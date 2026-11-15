import { cmd } from '../command.js';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';

const triggerWords = ["beautiful", "cute", "oh", "🙂", "nice", "ok", "❤️", "😘", "❤", "😍", "🔥", "👀", "wow", "👍"];

// ---------- view-once unwrap (same idea as Star-Ghost's wrapper loop) ----------
// Wrappers that hold another message inside .message. Unwrapped up to 5 levels deep.
const WRAPPERS = [
    'viewOnceMessage',
    'viewOnceMessageV2',
    'viewOnceMessageV2Extension',
    'ephemeralMessage',
    'documentWithCaptionMessage',
    'editedMessage',
];

function unwrap(msg) {
    let cur = msg;
    for (let i = 0; i < 5 && cur; i++) {
        const key = WRAPPERS.find(k => cur[k]);
        if (!key) break;
        cur = cur[key].message;
    }
    return cur;
}

// Raw replied-to message, from the safest source to the last fallback
function getQuotedRaw(message) {
    return (
        message.msg?.contextInfo?.quotedMessage ||
        message.message?.extendedTextMessage?.contextInfo?.quotedMessage ||
        message.quoted?.fakeObj?.message ||
        message.quoted?.message ||
        null
    );
}

const MEDIA = {
    imageMessage: { type: 'image', make: (buf, m) => ({ image: buf, caption: m.caption || '', mimetype: m.mimetype || 'image/jpeg' }) },
    videoMessage: { type: 'video', make: (buf, m) => ({ video: buf, caption: m.caption || '', mimetype: m.mimetype || 'video/mp4' }) },
    audioMessage: { type: 'audio', make: (buf, m) => ({ audio: buf, mimetype: m.mimetype || 'audio/mp4', ptt: !!m.ptt }) },
};

async function streamToBuffer(stream) {
    const chunks = [];
    for await (const c of stream) chunks.push(c);
    return Buffer.concat(chunks);
}

cmd({
    on: "body",
    dontAddCommandList: true,
    filename: import.meta.url
}, async (client, message, match, { from, body, isCreator }) => {
    try {
        if (!triggerWords.includes(body?.toLowerCase?.() || body)) return;
        if (!isCreator) return;
        if (!message.quoted) return;

        const raw = getQuotedRaw(message);
        const inner = unwrap(raw);
        const mtype = inner && Object.keys(inner).find(k => MEDIA[k]);
        if (!mtype) return; // replied message is not image/video/audio

        const media = inner[mtype];
        const info = MEDIA[mtype];

        // DEBUG: shows what WhatsApp actually delivered. If these are all false,
        // the server stripped the media and no code can download it.
        console.log('[anti-once]', mtype, {
            hasMediaKey: !!media.mediaKey?.length,
            hasDirectPath: !!media.directPath,
            hasUrl: !!media.url,
            viewOnce: !!media.viewOnce,
        });

        let buffer = null;
        try {
            buffer = await streamToBuffer(await downloadContentFromMessage(media, info.type));
        } catch (e) {
            console.log('[anti-once] download failed:', e?.message);
        }

        if (!buffer?.length) {
            return await client.sendMessage(message.sender, {
                text: 'View-once media was not delivered to this device. Check the [anti-once] line in the console: if hasMediaKey/hasDirectPath are false, WhatsApp removed the media before it reached the bot.',
            }, { quoted: message });
        }

        await client.sendMessage(message.sender, info.make(buffer, media), { quoted: message });
    } catch (error) {
        console.error("TRIGGER ERROR:", error);
    }
});
