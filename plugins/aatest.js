
// plugins/channelstatus.js
// Owner Only - Post or FORWARD content to a WhatsApp channel.
// Supports: text, image, video, voice notes (any size), audio, documents, stickers.
// Give a channel JID or invite link, or reply to any channel message.
//
// FIX: previously, when you REPLIED to a video/audio with the command, the
// framework's m.quoted mimetype lookup failed, so the command fell through to
// the TEXT branch and posted the raw command text to the channel instead of
// forwarding the video. Now media is detected directly from Baileys
// contextInfo.quotedMessage (framework-independent), sends are verified,
// and text posts are cleaned (command/link removed).
// FIX 3: forward now uses { forward: raw, force: true } — the force flag is
// required for Baileys to generate proper forwarded content for channels.
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// --- helpers -------------------------------------------------------------

// Wait briefly so the server settles before we call it a success.
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Get the RAW Baileys WAMessage needed for forwarding.
function getRawMessage(x) {
    if (!x) return null;
    if (typeof x.fakeObj === 'function') {
        try { return x.fakeObj(); } catch { /* ignore */ }
    }
    if (x.key && x.message) return x;
    return null;
}

// Send and VERIFY: a real send returns { key: { id, ... } }.
async function verifiedSend(client, jid, content) {
    const res = await client.sendMessage(jid, content);
    if (!res || !res.key || !res.key.id) throw new Error('no message key returned (send rejected)');
    await sleep(300);
    return res;
}

// Detect media type + mimetype from every possible location:
// serialized quoted, its proto, or the raw contextInfo.quotedMessage.
function detectMedia(q, ctxQuote) {
    const mime = q?.mimetype || q?.msg?.mimetype || '';
    if (mime) return { mime, ptt: !!(q.msg?.ptt || q.ptt) };

    const raw = ctxQuote || q?.msg;
    if (!raw) return null;

    if (raw.imageMessage)      return { mime: raw.imageMessage.mimetype || 'image/jpeg',  ptt: false };
    if (raw.videoMessage)      return { mime: raw.videoMessage.mimetype || 'video/mp4',   ptt: false };
    if (raw.stickerMessage)    return { mime: raw.stickerMessage.mimetype || 'image/webp', ptt: false };
    if (raw.audioMessage)      return { mime: raw.audioMessage.mimetype || 'audio/mp4',   ptt: !!raw.audioMessage.ptt };
    if (raw.documentMessage)   return { mime: raw.documentMessage.mimetype || 'application/octet-stream', ptt: false, doc: true };
    return null;
}

// Download media trying every available path.
async function downloadMedia(client, q, ctxQuote) {
    // 1) Framework download (serialized object)
    try {
        const b = await q?.download?.();
        if (b && b.length) return b;
    } catch { /* try next */ }
    // 2) Baileys util directly on the raw proto
    try {
        const target = ctxQuote || q?.msg || q;
        if (target && typeof client.downloadMediaMessage === 'function') {
            const b = await client.downloadMediaMessage(target);
            if (b && b.length) return b;
        }
    } catch { /* try next */ }
    return null;
}

// Remove the command word, channel link and JID from text/captions.
function cleanText(str) {
    if (!str) return '';
    return str
        .replace(/^\.?\s*(channelstatus|cstatus|chstatus)\b/i, '')
        .replace(/https?:\/\/\S*whatsapp\.com\/channel\/\S*/gi, '')
        .replace(/\d+@newsletter/gi, '')
        .trim();
}

cmd({
    pattern: "chx",
    alias: ["cstatus", "chstatus"],
    react: "📗",
    desc: "Owner Only - Send/forward text or any media (audio, video, voice, image, file) to a WhatsApp channel",
    category: "owner",
    filename: __filename
}, async (client, message, m, { from, isCreator, args, text }) => {
    try {
        if (!isCreator) {
            return await client.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: message });
        }

        // --- Find channel JID ---
        let jid = null;

        // 1) Channel invite link (in args, full text, or caption)
        const searchText = `${(args || []).join(' ')} ${text || ''} ${m.quoted?.caption || ''}`;
        let link = searchText.match(/https?:\/\/\S*whatsapp\.com\/channel\/[A-Za-z0-9_-]+/)?.[0];
        if (link) {
            let code = link.split('/channel/')[1].split(/[?#\s]/)[0];
            let meta = await client.newsletterMetadata('invite', code);
            jid = meta?.id;
        }

        // 2) Direct newsletter JID
        if (!jid) {
            let direct = searchText.match(/\d+@newsletter/)?.[0];
            if (direct) jid = direct;
        }

        // 3) Reply to a channel message
        if (!jid && m.quoted && m.quoted.chat && m.quoted.chat.endsWith('@newsletter')) {
            jid = m.quoted.chat;
        }

        if (!jid || !jid.endsWith('@newsletter')) {
            return await client.sendMessage(from, { text:
                "*Channel not found! Usage:*\n\n" +
                "`.cstatus <channel-jid> <text>`\n" +
                "`.cstatus <channel link> <text>`\n\n" +
                "Or reply to any media (audio/video/voice/image/file) with:\n" +
                "`.cstatus <channel-jid or link>` — it will be forwarded to the channel."
            }, { quoted: message });
        }

        // --- Media detection (framework-independent) ---
        const q = m.quoted || m;
        // Raw quoted proto straight from the command message's contextInfo
        const ctxQuote = m.msg?.contextInfo?.quotedMessage
            || m.quoted?.msg?.contextInfo?.quotedMessage
            || null;

        const media = detectMedia(q, ctxQuote);

        // ============ MEDIA ============
        if (media) {
            const caption = q.caption || m.quoted?.caption || cleanText(text) || '';

            // Get the RAW full WAMessage (forward needs key + message, plus force:true)
            const raw = getRawMessage(q) || getRawMessage(m);

            // METHOD 1: Forward with force:true (the working channel method)
            if (raw) {
                try {
                    await verifiedSend(client, jid, { forward: raw, force: true });
                    return await client.sendMessage(from, { text: "✅ Sent successfully" }, { quoted: message });
                } catch (e) {
                    console.error("cstatus force-forward failed:", e.message);
                }
            }

            // METHOD 2: Download & re-upload (buffer) with correct type
            try {
                const buffer = await downloadMedia(client, q, ctxQuote);
                if (!buffer) throw new Error('could not download media');

                if (/^image\//.test(media.mime) && !/webp/.test(media.mime)) {
                    await verifiedSend(client, jid, { image: buffer, caption });
                } else if (/webp/.test(media.mime) || /sticker/.test(media.mime)) {
                    await verifiedSend(client, jid, { sticker: buffer });
                } else if (/^video\//.test(media.mime) || /quicktime|mkv|avi|webm/.test(media.mime)) {
                    // Video retries: mp4 -> no caption -> document
                    try {
                        await verifiedSend(client, jid, { video: buffer, caption, mimetype: 'video/mp4' });
                    } catch (v1) {
                        console.error("cstatus video attempt 1 failed:", v1.message);
                        try {
                            await verifiedSend(client, jid, { video: buffer, mimetype: 'video/mp4' });
                        } catch (v2) {
                            console.error("cstatus video attempt 2 failed:", v2.message);
                            await verifiedSend(client, jid, {
                                document: buffer,
                                mimetype: 'video/mp4',
                                fileName: `video-${Date.now()}.mp4`
                            });
                        }
                    }
                } else if (/^audio\//.test(media.mime) || /ogg|opus/.test(media.mime)) {
                    await verifiedSend(client, jid, media.ptt
                        ? { audio: buffer, ptt: true, mimetype: 'audio/ogg; codecs=opus' }
                        : { audio: buffer, mimetype: media.mime });
                } else {
                    await verifiedSend(client, jid, {
                        document: buffer,
                        mimetype: media.mime,
                        fileName: q.fileName || q.filename || 'file'
                    });
                }
                return await client.sendMessage(from, { text: "✅ Sent successfully" }, { quoted: message });
            } catch (e) {
                console.error("cstatus re-upload failed:", e.message);
            }

            // METHOD 3: plain forward (no force) as a final attempt
            if (raw) {
                try {
                    await verifiedSend(client, jid, { forward: raw });
                    return await client.sendMessage(from, { text: "✅ Sent successfully" }, { quoted: message });
                } catch (e) {
                    console.error("cstatus plain forward failed:", e.message);
                }
            }

            return await client.sendMessage(from, { text:
                "❌ Could not send to the channel.\n" +
                "Forward and re-upload both failed. Make sure the bot is FOLLOWING this channel."
            }, { quoted: message });
        }

        // ============ TEXT ============
        const body = cleanText(text) || cleanText(m.quoted?.text || '');
        if (!body) {
            return await client.sendMessage(from, { text: "*Send a text, audio, video, voice or any media with the channel link/JID.*" }, { quoted: message });
        }

        // Styled first, plain as fallback — each verified.
        try {
            await verifiedSend(client, jid, { text: body, backgroundColor: '#0b141a', font: 3 });
        } catch (e1) {
            console.error("cstatus styled text failed:", e1.message);
            try {
                await verifiedSend(client, jid, { text: body });
            } catch (e2) {
                console.error("cstatus plain text failed:", e2.message);
                throw new Error('text send rejected by server — bot may not be following this channel');
            }
        }

        return await client.sendMessage(from, { text: "✅ Sent successfully" }, { quoted: message });
    } catch (error) {
        console.error("channelstatus Error:", error);
        await client.sendMessage(from, { text: "❌ Failed: " + error.message }, { quoted: message });
    }
});
