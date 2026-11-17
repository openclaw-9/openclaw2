// plugins/vvtest.js - ESM
import { fileURLToPath } from 'url';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const VIEW_ONCE_WRAPPERS = ['viewOnceMessageV2', 'viewOnceMessageV2Extension', 'viewOnceMessage'];
const OTHER_WRAPPERS = ['ephemeralMessage', 'documentWithCaptionMessage'];

const unwrap = (message) => {
    let msg = message;
    for (let i = 0; i < 6 && msg; i++) {
        let inner = null;
        for (const k of VIEW_ONCE_WRAPPERS) {
            if (msg[k]?.message) { inner = msg[k].message; break; }
        }
        if (!inner) {
            for (const k of OTHER_WRAPPERS) {
                if (msg[k]?.message) { inner = msg[k].message; break; }
            }
        }
        if (!inner) break;
        msg = inner;
    }
    return msg;
};

cmd({
    pattern: "vv",
    alias: ["viewonce"],
    react: '🐳',
    desc: "Owner Only - retrieve view once photo/video/audio",
    category: "owner",
    filename: __filename
}, async (client, message, m, { from, isCreator }) => {
    const send = (text) => client.sendMessage(from, { text }, { quoted: message });

    try {
        console.log("VV START | isCreator:", isCreator, "| fromMe:", message.key?.fromMe);

        // Owner check: isCreator OR fromMe OR bot's own number
        const botNum = String(client.user?.id || '').split(':')[0].split('@')[0];
        const senderNum = String(message.key?.participant || message.key?.remoteJid || '').split(':')[0].split('@')[0];
        const allowed = isCreator || message.key?.fromMe || (botNum && senderNum === botNum);

        if (!allowed) {
            return await send("❌ Owner check failed.\nisCreator: " + isCreator + "\nsender: " + senderNum + "\nbot: " + botNum);
        }

        // Raw quoted message
        const ctxInfo =
            message.message?.extendedTextMessage?.contextInfo ||
            message.message?.conversation && null;
        const quotedRaw = ctxInfo?.quotedMessage || m.quoted?.message;

        if (!quotedRaw) {
            return await send("*🍁 Please reply to a view once message!*");
        }

        const msg = unwrap(quotedRaw);
        const type = Object.keys(msg || {}).find(k => /^(image|video|audio)Message$/.test(k));

        console.log("VV DEBUG quoted keys:", Object.keys(quotedRaw), "| type:", type);

        if (!type) {
            return await send("❌ No image/video/audio found.\nKeys: " + Object.keys(quotedRaw).join(', '));
        }

        const kind = type.replace('Message', '');
        let buffer = null;

        // Method 1: direct download
        try {
            const stream = await downloadContentFromMessage(msg[type], kind);
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            buffer = Buffer.concat(chunks);
        } catch (e) {
            console.log("VV method 1 failed:", e.message);
        }

        // Method 2: bot's own helper
        if ((!buffer || !buffer.length) && typeof m.quoted?.download === 'function') {
            try { buffer = await m.quoted.download(); } catch (e) {
                console.log("VV method 2 failed:", e.message);
            }
        }

        if (!buffer || !buffer.length) {
            return await send("❌ Media empty. Opened/expired, or arrived before the bot was online.");
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
