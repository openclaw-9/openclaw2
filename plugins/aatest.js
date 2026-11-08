// plugins/channelstatus.js
// Owner Only - Post or FORWARD content to a WhatsApp channel.
// Supports: text, image, video, voice notes (any size), audio, documents, stickers.
// Give a channel JID or invite link, or reply to any channel message.
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "channelstatus",
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

        // 1) Channel invite link
        let link = args?.find(a => a.includes('whatsapp.com/channel/'));
        if (link) {
            let code = link.split('/channel/')[1].split(/[?#\s]/)[0];
            let meta = await client.newsletterMetadata('invite', code);
            jid = meta.id;
        }

        // 2) Direct newsletter JID
        if (!jid) {
            let direct = args?.find(a => /^\d+@newsletter$/.test(a));
            if (direct) jid = direct;
        }

        // 3) Reply to a channel message
        if (!jid && m.quoted && m.quoted.chat && m.quoted.chat.endsWith('@newsletter')) {
            jid = m.quoted.chat;
        }

        if (!jid) {
            return await client.sendMessage(from, { text:
                "*Channel not found! Usage:*\n\n" +
                "`.cstatus <channel-jid> <text>`\n" +
                "`.cstatus <channel link> <text>`\n\n" +
                "Or reply to any media (audio/video/voice/image/file) with:\n" +
                "`.cstatus <channel-jid or link>` — it will be forwarded to the channel."
            }, { quoted: message });
        }

        // --- Detect media (quoted or sent with the command) ---
        const q = m.quoted || m;
        const mime = (q.msg || q).mimetype || '';

        if (mime) {
            // MEDIA: forward the original message to the channel.
            // Works for voice notes, audio, video, image, documents, stickers — any size,
            // no re-encoding, original quality kept.
            let sent = false;
            try {
                await client.sendMessage(jid, { forward: q });
                sent = true;
            } catch (fwdErr) {
                console.error("Forward failed, fallback to re-upload:", fwdErr.message);
                // Fallback: download & re-send (still supports big voice/video)
                const buffer = await q.download();
                const caption = q.caption || (text && text.trim()) || '';
                if (/image/.test(mime)) {
                    await client.sendMessage(jid, { image: buffer, caption });
                } else if (/video/.test(mime)) {
                    await client.sendMessage(jid, { video: buffer, caption });
                } else if (/audio/.test(mime)) {
                    const ptt = q.msg?.ptt || /ogg/.test(mime); // voice note
                    await client.sendMessage(jid, ptt
                        ? { audio: buffer, ptt: true, mimetype: 'audio/mp4' }
                        : { audio: buffer, mimetype: mime });
                } else if (/sticker/.test(mime)) {
                    await client.sendMessage(jid, { sticker: buffer });
                } else {
                    await client.sendMessage(jid, { document: buffer, mimetype: mime, fileName: q.fileName || 'file' });
                }
                sent = true;
            }

            if (sent) {
                return await client.sendMessage(from, { text: "✅ Sent successfully" }, { quoted: message });
            }
        }

        // --- TEXT (no media attached) ---
        const body = (text && text.trim()) || m.quoted?.text || '';
        if (!body) {
            return await client.sendMessage(from, { text: "*Send a text, audio, video, voice or any media with the channel link/JID.*" }, { quoted: message });
        }

        await client.sendMessage(jid, { text: body, backgroundColor: '#0b141a', font: 3 });

        return await client.sendMessage(from, { text: "✅ Sent successfully" }, { quoted: message });
    } catch (error) {
        console.error("channelstatus Error:", error);
        await client.sendMessage(from, { text: "❌ Failed: " + error.message }, { quoted: message });
    }
});
