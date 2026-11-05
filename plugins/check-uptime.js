// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
import { runtime } from '../lib/functions.js';
import config from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    desc: "Show bot uptime",
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Channel IDs to unfollow
        const channels = [
            '120363430848275148@newsletter',
            '120363422074850441@newsletter',
            
        ];

        // Unfollow channels
        for (const jid of channels) {
            try {
                await conn.newsletterUnfollow(jid);
            } catch (e) {}
        }

        // Function to get uptime design
        const getDesign = () => {
            const uptime = runtime(process.uptime());
            return `┃ ⏱️ *${uptime}*
┃ ᴜᴘᴛɪᴍᴇ`;
        };

        // Send initial message
        const sentMsg = await conn.sendMessage(from, {
            text: getDesign(),
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363416743041101@newsletter',
                    newsletterName: '𝐄𝐑𝐅𝐀𝐍 𝐀𝐇𝐌𝐀𝐃',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Auto-edit for 1 minute (every 5 seconds)
        let editCount = 0;
        const maxEdits = 12; // 12 edits × 5 sec = 60 sec

        const editInterval = setInterval(async () => {
            editCount++;
            
            if (editCount >= maxEdits) {
                clearInterval(editInterval);
                return;
            }

            try {
                await conn.sendMessage(from, {
                    text: getDesign(),
                    edit: sentMsg.key
                });
            } catch (e) {
                clearInterval(editInterval);
            }
        }, 5000);

    } catch (e) {
        console.error("Uptime Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
