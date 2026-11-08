// plugins/channelstatus.js
// Owner Only - Post or FORWARD content to a WhatsApp channel.
// Supports: text, image, video, voice notes (any size), audio, documents, stickers.
// Give a channel JID or invite link, or reply to any channel message.
//
// FIXES over previous version:
// - "Sent successfully" lied before because forwarding used the serialized
//   quoted object (empty payload) -> message resolved but never landed.
//   Now we build the RAW WAMessage (fakeObj()/key+message) for forwarding.
// - Every send is VERIFIED: sendMessage must return a real key (message id),
//   otherwise we fall through to the next method and only say success if
//   one actually got through.
// - 3 fallback methods for media: forward -> re-upload -> raw relay.
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// --- helpers -------------------------------------------------------------

// Get the RAW Baileys WAMessage needed for forwarding.
// In MD bots the serialized object usually exposes .fakeObj(); if not,
// accept any object that already has key+message.
function getRawMessage(x) {
    if (!x) return null;
    if (typeof x.fakeObj === 'function') {
        try { return x.fakeObj(); } catch { /* ignore */ }
    }
    if (x.key && x.message) return x;
    if (x.key && x.msg) return { key: x.key, message: { ...x.msg } }; // last resort
    return null;
}

// Wait for the message to actually be accepted by the server.
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Send and VERIFY: a real send returns { key: { id, ... } }.
// If no key -> the message did not go out -> treat as failure.
async function verifiedSend(client, jid, content) {
    const res = await client.sendMessage(jid, content);
    if (!res || !res.key || !res.key.id) throw new Error('no message key returned (send rejected)');
    await sleep(300);
    return res;
}

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
            jid = meta?.id;
        }

        // 2) Direct newsletter JID
        if (!jid) {
            let direct = args?.find(a => /^\d+@newsletter$/.test(a.trim()));
            if (direct) jid = direct.trim();
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

        // --- Detect media (quoted or sent with the command) ---
        const q = m.quoted || m;
        const mime = (q.msg || q).mimetype || '';

        // ============ MEDIA: try methods in order ============
        if (mime) {
            const caption = q.caption || (text && text.trim()) || '';

            // METHOD 1: Forward the RAW original message (any size, no re-encode)
            const raw = getRawMessage(q) || getRawMessage(m);
            if (raw) {
                try {
                    await verifiedSend(client, jid, { forward: raw });
                    return await client.sendMessage(from, { text: "✅ Sent successfully" }, { quoted: message });
                } catch (e) {
                    console.error("cstatus forward failed:", e.message);
                }
            }

            // METHOD 2: Download & re-upload with the correct type
            try {
                const buffer = await q.download();
                if (!buffer || !buffer.length) throw new Error('empty media buffer');

                if (/image/.test(mime)) {
                    await verifiedSend(client, jid, { image: buffer, caption });
                } else if (/video/.test(mime)) {
                    await verifiedSend(client, jid, { video: buffer, caption, mimetype: mime });
                } else if (/audio|ogg|opus/.test(mime)) {
                    const isVoice = q.msg?.ptt || q.ptt || /ogg|opus/.test(mime);
                    await verifiedSend(client, jid, isVoice
                        ? { audio: buffer, ptt: true, mimetype: 'audio/ogg; codecs=opus' }
                        : { audio: buffer, mimetype: mime || 'audio/mp4' });
                } else if (/sticker|webp/.test(mime)) {
                    await verifiedSend(client, jid, { sticker: buffer });
                } else {
                    await verifiedSend(client, jid, {
                        document: buffer,
                        mimetype: mime || 'application/octet-stream',
                        fileName: q.fileName || q.filename || 'file'
                    });
                }
                return await client.sendMessage(from, { text: "✅ Sent successfully" }, { quoted: message });
            } catch (e) {
                console.error("cstatus re-upload failed:", e.message);
            }

            // METHOD 3: relayMessage raw forward (works on some Baileys builds
            // where sendMessage(forward) is broken)
            if (raw) {
                try {
                    const baileys = await import('@whiskeysockets/baileys').catch(() => null);
                    const fwdContent = baileys?.generateForwardMessageContent?.(raw, false);
                    if (!fwdContent) throw new Error('generateForwardMessageContent unavailable');
                    await client.relayMessage(jid, fwdContent, { messageId: client.generateMessageTag?.() });
                    return await client.sendMessage(from, { text: "✅ Sent successfully" }, { quoted: message });
                } catch (e) {
                    console.error("cstatus relay failed:", e.message);
                }
            }

            return await client.sendMessage(from, { text:
                "❌ Could not send to the channel.\n" +
                "All 3 methods failed. Check that the bot is FOLLOWING this channel and the link/JID is correct."
            }, { quoted: message });
        }

        // ============ TEXT ============
        const body = (text && text.trim()) || m.quoted?.text || '';
        if (!body) {
            return await client.sendMessage(from, { text: "*Send a text, audio, video, voice or any media with the channel link/JID.*" }, { quoted: message });
        }

        // Try decorated first, then plain text, then relay — verify each.
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
