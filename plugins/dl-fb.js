import http from 'http';
import https from 'https';
import { fileURLToPath } from 'url';
import { cmd } from "../command.js";
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

// Create keep-alive agents
const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const UA = "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36";

// ========== GLOBAL CONSTANTS ==========
const TIMEOUT = 20000;

// Create axios instance with global config
const api = axios.create({
    timeout: TIMEOUT,
    httpAgent: httpAgent,
    httpsAgent: httpsAgent
});

cmd({ 
    pattern: "fb",
    alias: ["facebook"],
    desc: "Download Facebook videos (HD only)",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, userConfig }) => {
    try { 
        if (!q) return reply("📌 Please provide a Facebook video link.");
        if (!q.includes("facebook.com")) return reply("❌ Invalid Facebook link.");

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/fbdl?url=${encodeURIComponent(q)}`;
        const { data } = await api.get(apiUrl);

        if (!data.status || !data.data || !data.data.high) {
            return reply("❌ Failed to fetch Facebook video. Try another link.");
        }

        const { title, thumbnail, high } = data.data;

        const caption = `🎬 *Facebook Video Downloader*\n\n📖 *Title:* ${title}\n\n🔰 *${userConfig?.CAPTION || "Powered by ERFAN"}*`;

        await conn.sendMessage(from, { 
            video: { url: high }, 
            caption: caption, 
            contextInfo: { mentionedJid: [m.sender] } 
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) { 
        console.error("Facebook HD Downloader Error:", e);
        reply(`❌ Error occurred: ${e.message}`);
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    }
});
