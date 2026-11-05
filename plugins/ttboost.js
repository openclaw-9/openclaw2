// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';
import config from '../config.js';
import { cmd } from '../command.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cmd({
    pattern: "boost",
    alias: ["tiktokboost", "ttboost"],
    react: "🚀",
    desc: "Boost TikTok video views",
    category: "tools",
    use: ".boost <tiktok link>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return reply(`❌ Please provide a TikTok link.\n\nExample:\n.boost https://vm.tiktok.com/ZNR7QoYud/\n.boost https://vm.tiktok.com/ZNR7QoYud/ 500`);
        }

        const parts = q.trim().split(/\s+/);
        let tiktokUrl = parts[0];
        let target = 100;

        // Custom target number
        if (parts.length > 1 && !isNaN(parseInt(parts[parts.length - 1]))) {
            target = parseInt(parts[parts.length - 1]);
        }

        if (!tiktokUrl.includes('tiktok.com')) {
            return reply('❌ Invalid TikTok link.');
        }

        // Processing message
        await conn.sendMessage(from, {
            text: `⏳ Boosting your TikTok video...\n🎯 Target: ${target} Views\n🔗 ${tiktokUrl}`
        }, { quoted: m });

        const result = await boostTikTok(tiktokUrl, target);

        if (!result || result.status !== true) {
            return reply(`❌ Boost failed. Check your link and try again.\n🔗 ${tiktokUrl}`);
        }

        const r = result.result;
        
        const msg = `╭━「 ✅ BOOST SUCCESSFUL 」━⊷
┃
┃  🎯 *Target:* ${r.target} Views
┃  ✅ *Success:* ${r.success}/${r.sessions}
┃  📝 ${r.message}
┃
┃  🔗 ${tiktokUrl}
╰━━━━━━━━━━⊷

> DARKZONE-MD 🚀`;

        await conn.sendMessage(from, { text: msg }, { quoted: m });

    } catch (error) {
        console.error('Boost Error:', error);
        reply(`⚠️ Error: ${error.message}`);
    }
});