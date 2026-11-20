// plugins/viewonce.js — single-file version
import { cmd } from '../command.js';
import config from '../config.js';
import { downloadContentFromMessage, downloadMediaMessage } from '@whiskeysockets/baileys';

// ───────── view-once cache (RAM) ─────────
if (!global.__voCache) global.__voCache = new Map();
const WRAPPERS = ['viewOnceMessageV2', 'viewOnceMessageV2Extension', 'viewOnceMessage'];
const OTHER_WRAPPERS = ['ephemeralMessage', 'documentWithCaptionMessage', 'editedMessage'];
const MEDIA_RE = /^(image|video|audio)Message$/;

function unwrapVO(message) {
    let msg = message || {}, viewOnce = false;
    for (let i = 0; i < 8 && msg; i++) {
        let inner = null;
        for (const k of WRAPPERS) if (msg[k]?.message) { inner = msg[k].message; viewOnce = true; break; }
        if (!inner) for (const k of OTHER_WRAPPERS) if (msg[k]?.message) { inner = msg[k].message; break; }
        if (!inner) break;
        msg = inner;
    }
    return { msg: msg || {}, viewOnce };
}
const mediaTypeOf = (msg) => Object.keys(msg || {}).find(k => MEDIA_RE.test(k));
const getViewOnce = (id) => global.__voCache.get(id) || null;

async function cacheViewOnce(mek) {
    if (!mek?.message) return;
    const { msg, viewOnce } = unwrapVO(mek.message);
    const type = mediaTypeOf(msg);
    if (!type) return;
    const media = msg[type];
    if (!(viewOnce || media.viewOnce === true)) return;
    const kind = type.replace('Message', '');
    try {
        const stream = await downloadContentFromMessage(media, kind);
        const chunks = [];
        for await (const c of stream) chunks.push(c);
        const buffer = Buffer.concat(chunks);
        if (!buffer.length) return;
        global.__voCache.set(mek.key.id, {
            buffer, kind,
            mimetype: media.mimetype,
            caption: media.caption || '',
            ptt: !!media.ptt,
            from: mek.key.participant || mek.key.remoteJid
        });
        if (global.__voCache.size > 40)
            global.__voCache.delete(global.__voCache.keys().next().value);
    } catch (_) {}
}

// ───────── attach the hook ONCE, on the first socket that loads this plugin ─────────
if (!global.__voHookAttached) global.__voHookAttached = new WeakSet();
function attachHook(client) {
    if (!client?.ev || !client.ev.on) return;
    if (global.__voHookAttached.has(client)) return;
    global.__voHookAttached.add(client);
    client.ev.on('messages.upsert', ({ messages }) => {
        for (const mek of messages || []) {
            // cache the ORIGINAL message before any unwrap strips the view-once wrapper
            cacheViewOnce({ key: mek.key, message: mek.message }).catch(() => {});
        }
    });
}

// ───────── media fetch (cache → quoted → store → reupload) ─────────
async function obtainMedia(client, message, quoted) {
    const stanzaId = quoted?.stanzaId || quoted?.id;
    const cached = stanzaId && getViewOnce(stanzaId);
    if (cached) return cached;

    const { msg, viewOnce } = unwrapVO(quoted?.message || {});
    const type = mediaTypeOf(msg);
    if (!type) throw new Error('NOT_MEDIA');
    const kind = type.replace('Message', '');
    const media = msg[type];

    // direct download first (works if link still fresh)
    try {
        const stream = await downloadContentFromMessage(media, kind);
        const chunks = [];
        for await (const c of stream) chunks.push(c);
        const buffer = Buffer.concat(chunks);
        if (buffer.length) return { buffer, kind, mimetype: media.mimetype, caption: media.caption || '', ptt: !!media.ptt };
    } catch (_) {}

    // fallback: reupload-request from sender's phone
    const buffer = await downloadMediaMessage(
        {
            key: {
                remoteJid: message.key.remoteJid,
                id: stanzaId,
                participant: quoted.participant,
                fromMe: false
            },
            message: { [type]: media }
        },
        'buffer', {},
        { reuploadRequest: client.updateMediaMessage, logger: console }
    );
    if (!buffer?.length) throw new Error('MEDIA_EMPTY');
    return { buffer, kind, mimetype: media.mimetype, caption: media.caption || '', ptt: !!media.ptt };
}

// ───────── the command ─────────
cmd({
    pattern: "vvx",
    alias: ["viewonce", "retrive", "retrieve", "vvdm", "vv2"],
    react: '👁️',
    desc: "Owner Only - retrieve view-once media",
    category: "owner",
    filename: __filename
}, async (client, message, m, { from, isCreator, userConfig, command }) => {
    try {
        attachHook(client); // safe: only attaches once per socket

        if (!isCreator) {
            return await client.sendMessage(from, {
                text: "*📛 This is an owner command.*"
            }, { quoted: message });
        }

        const DESCRIPTION = userConfig?.DESCRIPTION || config.DESCRIPTION || "";
        const toDM = ['vvdm', 'vv2'].includes(String(command || '').toLowerCase());
        const dest = toDM
            ? String(client.user.id).split(':')[0].split('@')[0] + '@s.whatsapp.net'
            : from;

        if (!m.quoted) {
            return await client.sendMessage(from, {
                text: "*🍁 Please reply to a view once message!*"
            }, { quoted: message });
        }

        let got;
        try {
            got = await obtainMedia(client, message, m.quoted);
        } catch (e) {
            if (e.message === 'NOT_MEDIA') {
                return await client.sendMessage(from, {
                    text: "❌ Only image, video, and audio messages are supported"
                }, { quoted: message });
            }
            throw e;
        }

        const { buffer, kind, mimetype, caption: originalCaption, ptt } = got;
        const cap = originalCaption
            ? `${originalCaption}\n\n> ${DESCRIPTION}`
            : `> ${DESCRIPTION}`;
        const opts = toDM ? {} : { quoted: message };

        let messageContent = {};
        if (kind === 'image') {
            messageContent = { image: buffer, caption: cap, mimetype: mimetype || 'image/jpeg' };
        } else if (kind === 'video') {
            messageContent = { video: buffer, caption: cap, mimetype: mimetype || 'video/mp4' };
        } else {
            messageContent = { audio: buffer, mimetype: mimetype || 'audio/mp4', ptt: !!ptt };
        }

        await client.sendMessage(dest, messageContent, opts);
    } catch (error) {
        console.error("vv Error:", error);
        await client.sendMessage(from, {
            text: "❌ Error fetching vv message:\n" + error.message
        }, { quoted: message });
    }
});
