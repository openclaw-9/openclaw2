// plugins/vvtest.js - ESM
import { fileURLToPath } from 'url';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const VIEW_ONCE_WRAPPERS = ['viewOnceMessageV2', 'viewOnceMessageV2Extension', 'viewOnceMessage'];
const OTHER_WRAPPERS = ['ephemeralMessage', 'documentWithCaptionMessage'];

// Returns inner message and whether it was wrapped as view once
const unwrap = (message) => {
    let msg = message;
    let viewOnce = false;
    for (let i = 0; i < 6 && msg; i++) {
        let inner = null;
        for (const k of VIEW_ONCE_WRAPPERS) {
            if (msg[k]?.message) { inner = msg[k].message; viewOnce = true; break; }
        }
        if (!inner) {
            for (const k of OTHER_WRAPPERS) {
                if (msg[k]?.message) { inner = msg[k].message; break; }
            }
        }
        if (!inner) break;
        msg = inner;
    }
    return { msg, viewOnce };
};

const findType = (msg) => Object.keys(msg || {}).find(k => /^(image|video|audio)Message$/.test(k));

// ===== Cache of view once media (id -> data) =====
const cache = new Map();
const MAX_CACHE = 50;
let listenerAttached = false;

const attachListener = (client) => {
    if (listenerAttached || !client?.ev) return;
    listenerAttached = true;
    console.log("VV: cache listener attached");

    client.ev.on('messages.upsert', async ({ messages }) => {
        for (const mk of messages || []) {
            try {
                if (!mk.message || !mk.key?.id) continue;
                const { msg, viewOnce } = unwrap(mk.message);
                const type = findType(msg);
                if (!type) continue;
                if (!(viewOnce || msg[type]?.viewOnce === true)) continue;

                const kind = type.replace('Message', '');
                const stream = await downloadContentFromMessage(msg[type], kind);
                const chunks = [];
                for await (const chunk of stream) chunks.push(chunk);
                const buffer = Buffer.concat(chunks);
                if (!buffer.length) continue;

                cache.set(mk.key.id, {
                    buffer,
                    kind,
                    caption: msg[type].caption || '',
                    mimetype: msg[type].mimetype || ''
                });
                if (cache.size > MAX_CACHE) cache.delete(cache.keys().next().value);
                console.log("VV: cached view once", mk.key.id, kind, buffer.length);
            } catch (e) {
                console.log("VV cache error:", e.message);
            }
        }
    });
};

// Attach the listener on the first incoming text message
cmd({ on: "body" }, async (client) => {
    attachListener(client);
});

cmd({
    pattern: "vvd",
    alias: ["viewonce"],
    react: '🐳',
    desc: "Owner Only - retrieve view once photo/video/audio",
    category: "owner",
    filename: __filename
}, async (client, message, m, { from, isCreator }) => {
    const send = (text) => client.sendMessage(from, { text }, { quoted: message });

    try {
        attachListener(client);

        const botNum = String(client.user?.id || '').split(':')[0].split('@')[0];
        const senderNum = String(message.key?.participant || message.key?.remoteJid || '').split(':')[0].split('@')[0];
        const allowed = isCreator || message.key?.fromMe || (botNum && senderNum === botNum);
        if (!allowed) return;

        const ctxInfo = message.message?.extendedTextMessage?.contextInfo;
        const quotedRaw = ctxInfo?.quotedMessage || m.quoted?.message;
        const stanzaId = ctxInfo?.stanzaId || m.quoted?.id;

        if (!quotedRaw) return await send("*🍁 Please reply to a view once message!*");

        // Method 1: cache (most reliable)
        const cached = stanzaId ? cache.get(stanzaId) : null;
        if (cached) {
            let content;
            if (cached.kind === 'image') content = { image: cached.buffer, caption: cached.caption };
            else if (cached.kind === 'video') content = { video: cached.buffer, caption: cached.caption };
            else content = { audio: cached.buffer, mimetype: cached.mimetype || "audio/mp4", ptt: false };
            return await client.sendMessage(from, content, { quoted: message });
        }

        // Method 2: direct download from quoted message
        const { msg } = unwrap(quotedRaw);
        const type = findType(msg);
        console.log("VV DEBUG | stanzaId:", stanzaId, "| quoted keys:", Object.keys(quotedRaw), "| type:", type,
            "| hasMediaKey:", !!(type && msg[type]?.mediaKey), "| cacheSize:", cache.size);

        if (!type) return await send("❌ No image/video/audio found.\nKeys: " + Object.keys(quotedRaw).join(', '));

        const kind = type.replace('Message', '');
        let buffer = null;
        try {
            const stream = await downloadContentFromMessage(msg[type], kind);
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            buffer = Buffer.concat(chunks);
        } catch (e) {
            console.log("VV direct download failed:", e.message);
        }

        if (!buffer || !buffer.length) {
            return await send("❌ Media empty. Not in cache and direct download failed.\nSend a NEW view once after the bot is online, then try again.");
        }

        const caption = msg[type].caption || '';
        let content;
        if (kind === 'image') content = { image: buffer, caption };
        else if (kind === 'video') content = { video: buffer, caption };
        else content = { audio: buffer, mimetype: msg[type].mimetype || "audio/mp4", ptt: false };
        await client.sendMessage(from, content, { quoted: message });
    } catch (error) {
        console.error("vv Error:", error);
        try { await send("❌ Error:\n" + error.message); } catch (_) {}
    }
});
