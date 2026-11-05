// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
import axios from 'axios';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cmd({
    pattern: "pinterest",
    alias: ["pin", "pindl"],
    desc: "Download Pinterest videos/images",
    category: "download",
    react: "📌",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply("📌 *Please provide a Pinterest URL*");

        // Validate Pinterest URL
        if (!q.includes('pinterest.com') && !q.includes('pin.it')) {
            return await reply("❌ *Invalid Pinterest URL!*\n\nPlease provide a valid Pinterest URL starting with 'pinterest.com' or 'pin.it'");
        }

        // Send processing react
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // 🎬 Fetch from Pinterest API (NEW API)
        const apiUrl = `https://api.nexray.eu.cc/downloader/pinterest?url=${encodeURIComponent(q)}`;
        const res = await axios.get(apiUrl);
        const data = res.data;

        if (!data?.status || !data?.result) {
            return await reply("❌ *Failed to download!*\n\nCould not fetch media from Pinterest. Please check the URL and try again.");
        }

        const pinData = data.result;
        const isVideo = pinData.video ? true : false;
        const mediaUrl = isVideo ? pinData.video : pinData.thumbnail;

        // 📌 Send media with stylish caption
        const caption = `╭━━━〔 *DARKZONE-MD* 〕━━━┈⊷
┃▸╭───────────
┃▸┃๏ *PINS DOWNLOADING*
┃▸└───────────···๏
╰────────────────┈⊷
╭━━❐━⪼
┇๏ *Title:* ${pinData.title || 'No Title'}
┇๏ *Author:* ${pinData.author || 'Unknown'}
┇๏ *Type:* ${isVideo ? 'Video' : 'Image'}
┇๏ *Platform:* Pinterest
┇๏ *Quality:* HD Ultra
╰━━❑━⪼
> *DARKZONE-MD*`;

        if (isVideo) {
            // Send video directly (not as document)
            await conn.sendMessage(from, {
                video: { url: mediaUrl },
                caption: caption,
                mimetype: 'video/mp4'
            }, { quoted: mek });
        } else {
            // Send image directly (not as document)
            await conn.sendMessage(from, {
                image: { url: mediaUrl },
                caption: caption
            }, { quoted: mek });
        }

        // ✅ React success
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("❌ Error in .pinterest:", e);
        await reply("⚠️ *Something went wrong!*\n\nPlease try again with a different Pinterest URL.");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});