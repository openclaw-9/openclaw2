
// plugins/vv.mjs — fully standalone ESM. No lib/ imports. No lib edits needed.
//
// .vv            → view-once media back to same chat (owner only)
// .vvdm / .vv2   → view-once media to owner's own DM (owner only)
// .ok .nice ...  → short words: only on real view-once, otherwise silent
// .antivv on/off → auto-save every view-once to owner DM
//
// ⚠️ If your bot is CommonJS and this file crashes on import:
//    rename to vv.mjs  OR  set "type":"module" in package.json
//    OR  change `import` to `require` (I can give CJS version too, just ask)

import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { cmd } from '../arslan.js';   // ← adjust if your framework exports cmd elsewhere
import { downloadContentFromMessage, downloadMediaMessage } from '@whiskeysockets/baileys';

const __filename = fileURLToPath(import.meta.url);
const __dir = path.dirname(__filename);

// ═══════════════════════════════════════════════════════════════════════════
// INLINED SETTINGS (same file as lib/botsettings.js → compatible)
// ═══════════════════════════════════════════════════════════════════════════
const SETTINGS_FILE = path.join(process.env.DATA_DIR || path.join(__dir, '..', 'data'), 'botsettings.json');
const keyOf = (conn) => String((conn && conn.user && conn.user.id) || 'default').split(':')[0].split('@')[0];
function loadAllSettings() { try { return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')) || {}; } catch (_) { return {}; } }
function getSetting(conn, name, def) {
    const v = (loadAllSettings()[keyOf(conn)] || {})[name];
    return v === undefined ? def : v;
}
function setSetting(conn, name, value) {
    try {
        const all = loadAllSettings(); const k = keyOf(conn);
        all[k] = { ...(all[k] || {}), [name]: value };
        fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true });
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(all, null, 2));
        return true;
    } catch (e) { console.error('[VV] settings save failed:', e.message); return false; }
}
const ownerJid = (conn) => keyOf(conn) + '@s.whatsapp.net';

// ═══════════════════════════════════════════════════════════════════════════
// INLINED VIEW-ONCE CACHE (same folder as lib/extras-hooks.js → compatible)
// ═══════════════════════════════════════════════════════════════════════════
const VO_DIR = path.join(process.env.DATA_DIR || path.join(__dir, '..', 'data'), 'vo-cache');
if (!global.__voCache) global.__voCache = new Map();
const voInFlight = new Set();

function voDiskGet(id) {
    try {
        const safe = String(id || '').replace(/[^A-Za-z0-9_-]/g, '');
        if (!safe) return null;
        const meta = JSON.parse(fs.readFileSync(path.join(VO_DIR, safe + '.json'), 'utf8'));
        return { ...meta, buffer: fs.readFileSync(path.join(VO_DIR, safe + '.bin')) };
    } catch (_) { return null; }
}
const getViewOnce = (id) => global.__voCache.get(id) || voDiskGet(id) || null;

const VO_MAX_ITEMS = 30, VO_MAX_BYTES = 80 * 1024 * 1024;
function voPut(id, item) {
    const c = global.__voCache; c.set(id, item);
    let total = 0; for (const v of c.values()) total += v.buffer.length;
    while (c.size > VO_MAX_ITEMS || total > VO_MAX_BYTES) {
        const first = c.keys().next().value;
        total -= c.get(first).buffer.length;
        c.delete(first);
    }
}
function voDiskPut(id, item) {
    try {
        fs.mkdirSync(VO_DIR, { recursive: true });
        const safe = String(id).replace(/[^A-Za-z0-9_-]/g, '');
        if (!safe) return;
        fs.writeFileSync(path.join(VO_DIR, safe + '.bin'), item.buffer);
        fs.writeFileSync(path.join(VO_DIR, safe + '.json'), JSON.stringify({
            kind: item.kind, mimetype: item.mimetype, caption: item.caption, from: item.from, chat: item.chat
        }));
        const files = fs.readdirSync(VO_DIR).filter(f => f.endsWith('.json'))
            .map(f => ({ f, t: fs.statSync(path.join(VO_DIR, f)).mtimeMs })).sort((a, b) => a.t - b.t);
        while (files.length > 60) {
            const x = files.shift().f.replace('.json', '');
            for (const e of ['.json', '.bin']) { try { fs.rmSync(path.join(VO_DIR, x + e)); } catch (_) {} }
        }
    } catch (_) {}
}

// ═══════════════════════════════════════════════════════════════════════════
// Original File-1 helpers
// ═══════════════════════════════════════════════════════════════════════════
const SHORT_WORDS = new Set(['ok', 'theek', 'nice', 'ggod', 'acha', 'sahi', 'thanks']);
const WRAPPERS = ['viewOnceMessageV2', 'viewOnceMessageV2Extension', 'viewOnceMessage'];
const OTHER_WRAPPERS = ['ephemeralMessage', 'documentWithCaptionMessage', 'editedMessage'];
const MEDIA_RE = /^(image|video|audio)Message$/;

const unwrap = (message) => {
    let msg = message || {}, viewOnce = false;
    for (let i = 0; i < 8 && msg; i++) {
        let inner = null;
        for (const k of WRAPPERS) if (msg[k] && msg[k].message) { inner = msg[k].message; viewOnce = true; break; }
        if (!inner) for (const k of OTHER_WRAPPERS) if (msg[k] && msg[k].message) { inner = msg[k].message; break; }
        if (!inner) break;
        msg = inner;
    }
    return { msg: msg || {}, viewOnce };
};
const mediaTypeOf = (msg) => Object.keys(msg || {}).find(k => MEDIA_RE.test(k));

const findCtx = (message) => {
    const { msg } = unwrap(message);
    for (const k of Object.keys(msg)) {
        const v = msg[k];
        if (v && typeof v === 'object' && v.contextInfo && (v.contextInfo.stanzaId || v.contextInfo.quotedMessage)) return v.contextInfo;
    }
    return {};
};

const prettyFrom = (quoted, from) => {
    const p = (quoted && (quoted.sender || quoted.participant)) || '';
    const num = String(p || from).split('@')[0].split(':')[0];
    return String(from).endsWith('@g.us') ? `${num} (group)` : num;
};

async function streamToBuffer(src, kind) {
    const stream = await downloadContentFromMessage(src, kind);
    const chunks = []; for await (const c of stream) chunks.push(c);
    return Buffer.concat(chunks);
}

async function obtainMedia(conn, mek, from, quoted, ctxInfo) {
    const reasons = [];
    const stanzaId = (quoted && (quoted.stanzaId || quoted.id)) || ctxInfo.stanzaId;
    const qMessage = (quoted && quoted.message) || ctxInfo.quotedMessage || {};
    const participant = (quoted && quoted.participant) || ctxInfo.participant;

    // 1) cache
    try {
        const cached = stanzaId && getViewOnce(stanzaId);
        if (cached && cached.buffer && cached.buffer.length) {
            return { buffer: cached.buffer, kind: cached.kind, media: { caption: cached.caption, mimetype: cached.mimetype }, viaCache: true, isVO: true };
        }
    } catch (e) { reasons.push('cache: ' + e.message); }

    let { msg, viewOnce } = unwrap(qMessage);
    let type = mediaTypeOf(msg);

    // 3) message store
    let stored = null;
    if (conn.arslanStore && stanzaId) {
        const jids = [...new Set([from, ctxInfo.remoteJid, participant].filter(Boolean))];
        for (const j of jids) {
            try {
                const orig = await conn.arslanStore.loadMessage(j, stanzaId);
                if (orig && orig.message) {
                    const u = unwrap(orig.message);
                    const t = mediaTypeOf(u.msg);
                    if (t) { stored = { key: orig.key, message: orig.message, msg: u.msg, type: t, vo: u.viewOnce || (u.msg[t] && u.msg[t].viewOnce === true) }; break; }
                }
            } catch (_) {}
        }
    }
    if (!type && stored) { msg = stored.msg; type = stored.type; }
    if (!type) throw new Error('NOT_MEDIA');
    const isVO = viewOnce || (msg[type] && msg[type].viewOnce === true) || Boolean(stored && stored.vo);
    const kind = type.replace('Message', '');

    const candidates = [];
    if (msg[type]) candidates.push({ label: 'quoted', src: msg[type] });
    if (stored && stored.msg[stored.type]) candidates.push({ label: 'store', src: stored.msg[stored.type] });

    for (const c of candidates) {
        try {
            const buffer = await streamToBuffer(c.src, kind);
            if (buffer.length) return { buffer, kind, media: c.src, isVO };
            reasons.push(c.label + ': empty');
        } catch (e) { reasons.push(c.label + ': ' + (e.message || e)); }
    }

    const keyed = [
        stored && { key: stored.key, message: stored.message },
        { key: { remoteJid: from, id: stanzaId, participant, fromMe: false }, message: { [type]: msg[type] } },
    ].filter(Boolean);
    for (const k of keyed) {
        try {
            const buffer = await downloadMediaMessage(k, 'buffer', {}, { reuploadRequest: conn.updateMediaMessage, logger: console });
            if (buffer && buffer.length) return { buffer, kind, media: msg[type] || {}, isVO };
        } catch (e) { reasons.push('reupload: ' + (e.message || e)); }
    }

    const err = new Error('MEDIA_EMPTY'); err.reasons = reasons; throw err;
}

// ═══════════════════════════════════════════════════════════════════════════
// Cache writer (dedup: skips if already cached by extras-hooks or earlier run)
// ═══════════════════════════════════════════════════════════════════════════
async function cacheViewOnce(mek) {
    if (!mek || !mek.message || !mek.key || !mek.key.id) return null;
    const id = mek.key.id;
    const existing = getViewOnce(id);
    if (existing) return existing;                          // already cached elsewhere → return for antivv check
    if (voInFlight.has(id)) return null;
    voInFlight.add(id);
    try {
        const { msg, viewOnce } = unwrap(mek.message);
        const type = mediaTypeOf(msg);
        if (!type) return null;
        const media = msg[type];
        if (!(viewOnce || media.viewOnce === true)) return null;
        const kind = type.replace('Message', '');
        const buffer = await streamToBuffer(media, kind);
        if (!buffer.length) return null;
        const item = {
            buffer, kind,
            mimetype: media.mimetype, caption: media.caption || '',
            from: (mek.key.participant || mek.key.remoteJid) || '',
            chat: mek.key.remoteJid
        };
        voPut(id, item); voDiskPut(id, item);
        return item;
    } catch (e) { console.warn('[VV cache] failed:', e.message); return null; }
    finally { voInFlight.delete(id); }
}

const antivvSent = new Set();
async function autoForwardViewOnce(conn, mek, item) {
    if (!item || !getSetting(conn, 'antivv', false)) return;
    const id = mek && mek.key && mek.key.id;
    if (id && antivvSent.has(id)) return;
    if (id) { antivvSent.add(id); if (antivvSent.size > 500) antivvSent.delete(antivvSent.values().next().value); }
    try {
        const who = String(item.from || '').split('@')[0].split(':')[0];
        const cap = `👁️ *VIEW ONCE SAVED*\n👤 From: ${who}${item.caption ? '\n📝 ' + item.caption : ''}`;
        const dest = ownerJid(conn);
        if (item.kind === 'image') await conn.sendMessage(dest, { image: item.buffer, caption: cap });
        else if (item.kind === 'video') await conn.sendMessage(dest, { video: item.buffer, caption: cap });
        else { await conn.sendMessage(dest, { text: cap }); await conn.sendMessage(dest, { audio: item.buffer, mimetype: item.mimetype || 'audio/mp4', ptt: false }); }
    } catch (e) { console.warn('[VV antivv] failed:', e.message); }
}

// ═══════════════════════════════════════════════════════════════════════════
// Lazy hook install — attaches raw conn.ev listener on first message
// (so it works without lib/extras-hooks.js and even if framework unwraps)
// ═══════════════════════════════════════════════════════════════════════════
function ensureRawHook(conn) {
    if (!conn || !conn.ev || conn.__vvRawHookInstalled) return;
    conn.__vvRawHookInstalled = true;
    conn.ev.on('messages.upsert', async ({ messages }) => {
        for (const mek of messages || []) {
            try {
                const item = await cacheViewOnce(mek);
                if (item) await autoForwardViewOnce(conn, mek, item);
            } catch (_) {}
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// runVV — the main command logic (unchanged from File 1)
// ═══════════════════════════════════════════════════════════════════════════
async function runVV(conn, mek, m, { from, isCreator, reply, command }, toDM) {
    const word = String(command || 'vv').toLowerCase();
    const quiet = SHORT_WORDS.has(word);
    const dest = toDM ? ownerJid(conn) : from;
    try {
        if (!isCreator) { if (!quiet) return reply('*YEH COMMAND SIRF BOT OWNER KE LIYE HAI 😎*'); return; }

        const ctxInfo = findCtx(mek.message);
        let quoted = m.quoted;
        if (!quoted && (ctxInfo.stanzaId || ctxInfo.quotedMessage)) {
            quoted = { stanzaId: ctxInfo.stanzaId, id: ctxInfo.stanzaId, participant: ctxInfo.participant, sender: ctxInfo.participant, message: ctxInfo.quotedMessage || {} };
        }
        if (!quoted || (!quoted.message && !quoted.stanzaId && !ctxInfo.stanzaId)) {
            if (quiet) return;
            return reply('*🥺 KISI VIEW ONCE PHOTO / VIDEO / AUDIO KO REPLY KARO*\n\n*Phir likho:* `.vv`  (ya .ok .nice .acha ...)\n*Apne inbox mein chahiye to:* `.vvdm`');
        }

        let got;
        try { got = await obtainMedia(conn, mek, from, quoted, ctxInfo); }
        catch (e) {
            if (e.message === 'NOT_MEDIA') { if (quiet) return; return reply('*❌ Ye view-once ya media message nahi hai (sirf photo / video / audio).*'); }
            throw e;
        }
        if (quiet && !got.isVO) return;

        if (!quiet) conn.sendMessage(from, { react: { text: '👁️', key: mek.key } }).catch(() => {});

        const { buffer, kind, media } = got;
        const caption = (((media && media.caption) || '') + `\n\n👁️ From: ${prettyFrom(quoted, from)}`).trim();
        let content;
        if (kind === 'image') content = { image: buffer, caption };
        else if (kind === 'video') content = { video: buffer, caption, mimetype: (media && media.mimetype) || 'video/mp4' };
        else content = { audio: buffer, mimetype: (media && media.mimetype) || 'audio/mp4', ptt: Boolean(media && media.ptt) };

        await conn.sendMessage(dest, content, toDM ? {} : { quoted: mek });
        if (kind === 'audio') await conn.sendMessage(dest, { text: `👁️ Voice/audio from: ${prettyFrom(quoted, from)}` });
        if (!quiet) conn.sendMessage(from, { react: { text: '✅', key: mek.key } }).catch(() => {});
    } catch (e) {
        console.log('VV ERROR:', e.message, e.reasons ? e.reasons.join(' | ') : '');
        let why = e.message || String(e);
        if (e.message === 'MEDIA_EMPTY') {
            why = 'Media nahi mili. Ya to ye view-once bot ke online hone se PEHLE aaya tha, ya WhatsApp se expire ho chuka hai. ' +
                'Bot online hone ke BAAD aane wali view-once par .vv hamesha chalega (bot usay aate hi save kar leta hai).';
        }
        try { await conn.sendMessage(ownerJid(conn), { text: '*❌ VIEW ONCE ERROR*\n_' + why + '_' }); } catch (_) {}
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// Message listener — installs the raw hook on the very first message
// ═══════════════════════════════════════════════════════════════════════════
cmd({ on: 'body' }, async (conn) => { ensureRawHook(conn); });

// ═══════════════════════════════════════════════════════════════════════════
// Commands
// ═══════════════════════════════════════════════════════════════════════════
cmd({
    pattern: 'fgx',
    alias: ['viewonce', 'view', 'open', ...SHORT_WORDS],
    desc: 'View-once photo/video/audio back to same chat (Owner only)',
    category: 'owner',
    filename: __filename
}, (conn, mek, m, ctx) => { ensureRawHook(conn); return runVV(conn, mek, m, ctx, false); });

cmd({
    pattern: 'vvdm',
    alias: ['vv2', 'vvme', 'savevo', 'vvprivate'],
    desc: 'View-once media only to your own inbox (Owner only)',
    category: 'owner',
    filename: __filename
}, (conn, mek, m, ctx) => { ensureRawHook(conn); return runVV(conn, mek, m, ctx, true); });

cmd({
    pattern: 'antivv',
    alias: ['autovv', 'antiviewonce'],
    desc: 'Send every view-once to owner DM automatically (on/off)',
    category: 'owner',
    filename: __filename
}, async (conn, mek, m, { isCreator, reply, args }) => {
    ensureRawHook(conn);
    if (!isCreator) return reply('*YEH COMMAND SIRF BOT OWNER KE LIYE HAI 😎*');
    const a = String((args && args[0]) || '').toLowerCase();
    if (['on', 'enable'].includes(a)) { setSetting(conn, 'antivv', true); return reply('👁️ *ANTI VIEW-ONCE ON*\nAb har view-once aate hi aapke DM mein save ho jayegi.\nBand: `.antivv off`'); }
    if (['off', 'disable'].includes(a)) { setSetting(conn, 'antivv', false); return reply('👁️ *ANTI VIEW-ONCE OFF*'); }
    return reply(`👁️ Abhi: *${getSetting(conn, 'antivv', false) ? 'ON' : 'OFF'}*\n\`.antivv on\` / \`.antivv off\`\nYa kisi view-once par reply karke \`.vv\``);
});

export { unwrap, findCtx, obtainMedia };
