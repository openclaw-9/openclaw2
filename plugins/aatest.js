
// plugins/vvtest.js - ESM
import { fileURLToPath } from 'url';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const VIEW_ONCE_WRAPPERS = ['viewOnceMessageV2', 'viewOnceMessageV2Extension', 'viewOnceMessage'];
const OTHER_WRAPPERS = ['ephemeralMessage', 'documentWithCaptionMessage'];

// Open all wrappers and return the inner message
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
    pattern: "fch",
    alias: ["viewonce"],
    react: '🐳',
    desc: "Owner Only - retrieve view once photo/video/audio",
    category: "owner",
    filename: __filename
}, async (client, message, m, { from, isCreator }) => {
    try {
        if (!isCreator) return;

        // Get the raw quoted message (works with new WhatsApp structure)
        const ctxInfo = message.message?.extendedTextMessage?.contextInfo;
        const quotedRaw = ctxInfo?.quotedMessage || m.quoted?.message;

        if (!quotedRaw) {
            return await client.sendMessage(from, {
                text: "*🍁 Please reply to a view once message!*"
            }, { quoted: message });
        }

        const msg = unwrap(quotedRaw);
        const type = Object.keys(msg || {}).find(k => /^(image|video|audio)Message$/.test(k));

        console.log("VV DEBUG quoted keys:", Object.keys(quotedRaw), "| type:", type);

        if (!type) {
            return await client.sendMessage(from, {
                text: "❌ Only image, video, and audio are supported"
            }, { quoted: message });
        }

        const kind = type.replace('Message', '');
        let buffer = null;

        // Method 1: direct download from WhatsApp
        try {
            const stream = await downloadContentFromMessage(msg[type], kind);
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            buffer = Buffer.concat(chunks);
        } catch (e) {
            console.log("VV method 1 failed:", e.message);
            buffer = null;
        }

        // Method 2: fallback to your bot's own download helper
        if ((!buffer || !buffer.length) && typeof m.quoted?.download === 'function') {
            try { buffer = await m.quoted.download(); } catch (e) {
                console.log("VV method 2 failed:", e.message);
            }
        }

        if (!buffer || !buffer.length) {
            return await client.sendMessage(from, {
                text: "❌ Media empty. It may have been opened/expired, or arrived before the bot was online."
            }, { quoted: message });
        }

        const caption = msg[type].caption || '';
        let content;
        if (kind === 'image') content = { image: buffer, caption };
        else if (kind === 'video') content = { video: buffer, caption };
        else content = { audio: buffer, mimetype: msg[type].mimetype || "audio/mp4", ptt: false };

        await client.sendMessage(from, content, { quoted: message });
    } catch (error) {
        console.error("vv Error:", error);
        await client.sendMessage(from, {
            text: "❌ Error:\n" + error.message
        }, { quoted: message });
    }
});
