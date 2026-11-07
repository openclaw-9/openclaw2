// plugins/channelstatus.js
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "channelstatus",
    alias: ["cstatus", "chstatus"],
    react: "📗",
    desc: "Owner Only - Post a 24h status on a WhatsApp channel",
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
                "Or reply to any channel message:\n" +
                "`.cstatus <text>`"
            }, { quoted: message });
        }

        // --- Extract text / media ---
        let body = (text && text.trim()) || m.quoted?.text || m.quoted?.caption || '';
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';

        let content;
        if (/image/.test(mime)) {
            content = { image: await q.download(), caption: body };
        } else if (/video/.test(mime)) {
            content = { video: await q.download(), caption: body };
        } else if (body) {
            content = { text: body, backgroundColor: '#0b141a', font: 3 };
        } else {
            return await client.sendMessage(from, { text: "*Send a text, image or video for the status.*" }, { quoted: message });
        }

        // --- Try 1: newsletter status options ---
        let res = await client.sendMessage(jid, content, {
            statusJidList: [],
            ephemeralExpiration: 86400 // 24h expiry hint (status lifetime)
        });

        console.log("channelstatus DEBUG - sent result:");
        console.log(JSON.stringify(res, null, 2));

        await client.sendMessage(from, { text:
            "*Status request sent.* Check the channel:\n" +
            "- If it appears as a status (24h) = working\n" +
            "- If it appears as a normal post = your Baileys build does not support channel status\n\n" +
            "Check the console/terminal for the DEBUG result and share it."
        }, { quoted: message });
    } catch (error) {
        console.error("channelstatus Error:", error);
        await client.sendMessage(from, { text: "*Error:*\n" + error.message }, { quoted: message });
    }
});
