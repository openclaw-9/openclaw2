// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';
import { cmd } from '../command.js';
import config from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ═══════════════════════════════════════════════════════════
// 🎵 TIKTOK COMMAND - ERINE STYLE IN ERFAN STRUCTURE
// ═══════════════════════════════════════════════════════════

const TIKTOK_APIS = [
    {
        name: "TikWM",
        url: (ttUrl) => `https://tikwm.com/api/?url=${encodeURIComponent(ttUrl)}&hd=1`,
        checkResponse: (data) => data?.code === 0 && data?.data,
        getData: (data) => data.data,
        searchUrl: (query) => `https://tikwm.com/api/feed/search?keywords=${encodeURIComponent(query)}&count=1`
    }
];

function formatNumber(num = 0) {
    return num.toLocaleString();
}

function formatDuration(sec = 0) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

cmd({
    pattern: "tiktok",
    alias: ["tt", "ttdl", "ttsearch"],
    desc: "Download TikTok video",
    category: "download",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, userConfig }) => {
    try {
        if (!q) return await reply(`❌ Link ya search query kahan hai?\n\n*Example:*\n.tt https://vt.tiktok.com/xxxx\n.tt erine jkt48 edit`);

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        let url = q;
        let searchUsed = false;

        // Agar link nahi hai to search karo
        if (!/^https?:\/\//i.test(q)) {
            try {
                const { data } = await axios.get(
                    TIKTOK_APIS[0].searchUrl(q),
                    { timeout: 20000 }
                );
                
                if (!data || data.code !== 0 || !data.data?.videos?.length) {
                    throw new Error('Video nahi mila search se.');
                }
                
                const v = data.data.videos[0];
                url = `https://www.tiktok.com/@${v.author.unique_id}/video/${v.video_id}`;
                searchUsed = true;
            } catch (searchErr) {
                return await reply(`❌ Search failed: ${searchErr.message}`);
            }
        }

        // Video data fetch karo
        const { data } = await axios.get(
            TIKTOK_APIS[0].url(url),
            { timeout: 20000 }
        );

        if (!TIKTOK_APIS[0].checkResponse(data)) {
            throw new Error('TikTok API se valid response nahi mila.');
        }

        const res = TIKTOK_APIS[0].getData(data);

        const title = res.title || '-';
        const uploader = res.author?.nickname || res.author?.unique_id || '-';
        const duration = formatDuration(res.duration);
        const views = formatNumber(res.play_count || res.play || res.views || 0);

        const BOT_NAME = userConfig?.BOT_NAME || config.BOT_NAME || "ERFAN-MD";

        const caption = `┌˚₊ ๑│ ᴛ ɪ ᴋ ᴛ ᴏ ᴋ  ᴅ ʟ │๑˚₊ 🎵
┇ 
│ 📝 *Judul:* ${title}
│ 👤 *Author:* ${uploader}
│ ⏱️ *Durasi:* ${duration}
│ 👁️ *Views:* ${views}
┇ 
└˚₊ ๑ ────────────── ๑˚₊
> © ${BOT_NAME}`;

        // Agar images/slides hain to unhe bhejo
        if (Array.isArray(res.images) && res.images.length > 0) {
            let total = res.images.length;
            let index = 1;

            for (const img of res.images) {
                await conn.sendMessage(
                    from,
                    {
                        image: { url: img },
                        caption: `┌˚₊ ๑│ ᴛ ɪ ᴋ ᴛ ᴏ ᴋ  s ʟ ɪ ᴅ ᴇ │๑˚₊ 📸\n┇\n│ 🖼️ *Slide:* ${index} / ${total}\n┇\n└˚₊ ๑ ────────────── ๑˚₊\n> © ${BOT_NAME}`
                    },
                    { quoted: mek }
                );
                index++;
            }

            await conn.sendMessage(from, {
                text: caption
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
            return;
        }

        // Agar video hai to bhejo
        if (res.play) {
            await conn.sendMessage(from, {
                video: { url: res.play },
                mimetype: 'video/mp4',
                caption: caption
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
        } else {
            throw new Error('Video URL nahi mila.');
        }

    } catch (e) {
        console.error("❌ Error in .tiktok:", e);
        await reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal memproses video TikTok:\n┇ ${e.message || e}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERFAN-MD`);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
