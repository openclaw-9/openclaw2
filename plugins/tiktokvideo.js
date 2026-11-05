// ERFAN MD 
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "bts",
    alias: ["btsarmy", "btsshorts"],
    desc: "Download random BTS Army short video",
    category: "download",
    react: "💜",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        const { default: yts } = await import('yt-search');
        
        const btsQueries = [
            "bts army short video",
            "bts funny shorts",
            "bts edits shorts",
            "bts status video",
            "bts dance short video",
            "bts cute moments shorts"
        ];

        const searchQuery = text ? `bts ${text} short` : btsQueries[Math.floor(Math.random() * btsQueries.length)];

        const search = await yts(searchQuery);
        if (!search || !search.videos || !search.videos.length) {
            return reply("❌ BTS ki koi video nahi mili! Dobara try karein.");
        }

        const maxIndex = Math.min(search.videos.length, 15);
        const vid = search.videos[Math.floor(Math.random() * maxIndex)];
        const url = vid.url;

        // Preview status
        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `*💜 BTS ARMY VIDEO 💜*\n\n🎞️ *Title:* \({vid.title}\n📺 *Channel:*\){vid.author?.name || 'BTS Army'}\n🕒 *Duration:* ${vid.timestamp}\n\n*Status:* Video download ho rahi hai...\n\n> Powered by ERFAN-MD`
        }, { quoted: mek });

        let videoUrl = null;

        // Multiple Download APIs (Fallback system)
        const downloadAPIs = [
            // API 1: JawadTech (Purani)
            async () => {
                const res = await axios.get(`https://xjawadtechyt.vercel.app/ytv3?url=${encodeURIComponent(url)}`, { timeout: 15000 });
                return res.data?.download?.url || null;
            },
            // API 2: Gifted Tech
            async () => {
                const res = await axios.get(`https://api.giftedtech.my.id/api/download/dlmp4?apikey=gifted&url=${encodeURIComponent(url)}`, { timeout: 15000 });
                return res.data?.result?.download_url || null;
            },
            // API 3: Widipe
            async () => {
                const res = await axios.get(`https://widipe.com/download/ytdl?url=${encodeURIComponent(url)}`, { timeout: 15000 });
                return res.data?.result?.mp4 || res.data?.result?.video || null;
            },
            // API 4: BK9 API
            async () => {
                const res = await axios.get(`https://bk9.fun/download/yt?url=${encodeURIComponent(url)}`, { timeout: 15000 });
                return res.data?.BK9?.video || null;
            }
        ];

        // Har API ko bari bari check karega
        for (const fetchAPI of downloadAPIs) {
            try {
                videoUrl = await fetchAPI();
                if (videoUrl) break;
            } catch (err) {
                continue;
            }
        }

        if (!videoUrl) {
            return reply("❌ Download servers temporary busy hain. Kuch dair baad dobara try karein!");
        }

        // Send video
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `💜 *${vid.title}*\n\n> Powered by ERFAN-MD`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '💜', key: m.key } });

    } catch (e) {
        console.error("Error in .bts command:", e);
        reply("❌ Error aagaya hai, dobara try karein!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
