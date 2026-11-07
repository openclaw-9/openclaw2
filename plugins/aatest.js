 hai. Ye lo, isko plugins/channelstatus.js naam se save kar do aur bot restart karke test karo:

// plugins/channelstatus.js
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "channelstatus",
    alias: ["cstatus", "chstatus"],
    react: "📗",
    desc: "Owner Only - Post status on WhatsApp channel (24h)",
    category: "owner",
    filename: __filename
}, async (client, message, m, { from, isCreator, args, text }) => {
    try {
        if (!isCreator) {
            return await client.sendMessage(from, { text: "*📛 This is an owner command.*" }, { quoted: message });
        }

        // --- Channel JID nikalo ---
        let jid = null;

        // 1) Channel link diya ho (whatsapp.com/channel/XXXX)
        let link = args?.find(a => a.includes('whatsapp.com/channel/'));
        if (link) {
            let code = link.split('/channel/')[1].split(/[?#\s]/)[0];
            let meta = await client.newsletterMetadata('invite', code);
            jid = meta.id;
        }

        // 2) Direct JID diya ho (1234567@newsletter)
        if (!jid) {
            let direct = args?.find(a => /^\d+@newsletter$/.test(a));
            if (direct) jid = direct;
        }

        // 3) Kisi channel ke message pe reply kiya ho
        if (!jid && m.quoted && m.quoted.chat && m.quoted.chat.endsWith('@newsletter')) {
            jid = m.quoted.chat;
        }

        if (!jid) {
            return await client.sendMessage(from, { text:
                "*📗 Channel nahi mila! Istemaal:*\n\n" +
                "`.cstatus <channel-jid> <text>`\n" +
                "`.cstatus <channel link> <text>`\n\n" +
                "Ya kisi channel message pe reply karke:\n" +
                "`.cstatus <text>`"
            }, { quoted: message });
        }

        // --- Caption/text nikaalo ---
        let body = (text && text.trim()) || m.quoted?.text || m.quoted?.caption || '';

        // --- Media nikaalo (reply wali cheez se) ---
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';

        if (/image/.test(mime)) {
            let img = await q.download();
            await client.sendMessage(jid, { image: img, caption: body }, { statusJidList: [] });
        } else if (/video/.test(mime)) {
            let vid = await q.download();
            await client.sendMessage(jid, { video: vid, caption: body }, { statusJidList: [] });
        } else if (body) {
            // font: 0-6, backgroundColor sirf text status ke liye
            await client.sendMessage(jid, {
                text: body,
                backgroundColor: '#0b141a',
                font: 3
            }, { statusJidList: [] });
        } else {
            return await client.sendMessage(from, { text: "*🍁 Status ka text ya photo/video do!*" }, { quoted: message });
        }

        await client.sendMessage(from, { text: "*✅ Channel pe status laga diya! (24 ghante baad khud hat jayega)*" }, { quoted: message });
    } catch (error) {
        console.error("channelstatus Error:", error);
        await client.sendMessage(from, { text: "❌ Error:\n" + error.message }, { quoted: message });
    }
});
