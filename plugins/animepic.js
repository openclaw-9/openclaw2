// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
import axios from 'axios';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ═══════════════════════════════════════
// 50 ANIME COMMANDS - HOTCHINA WALI WORKING API
// ═══════════════════════════════════════

const base = "https://nekos.best/api/v2";
const headers = { "User-Agent": "WhatsAppBot/1.0" };

// ─── 1. WAIFU ───
cmd({
    pattern: "waifu",
    desc: "Get random anime waifu image",
    category: "anime",
    react: "💖",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `💖 *Anime Waifu*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 2. NEKO ───
cmd({
    pattern: "neko",
    desc: "Get random anime neko image",
    category: "anime",
    react: "🐱",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/neko`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🐱 *Anime Neko*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 3. KITSUNE ───
cmd({
    pattern: "kitsune",
    desc: "Get random anime kitsune image",
    category: "anime",
    react: "🦊",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/kitsune`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🦊 *Anime Kitsune*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 4. HUSBANDO ───
cmd({
    pattern: "husbando",
    desc: "Get random anime husbando image",
    category: "anime",
    react: "💙",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/husbando`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `💙 *Anime Husbando*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 5. ANIMEGIRL ───
cmd({
    pattern: "animegirl",
    desc: "Get random anime girl image",
    category: "anime",
    react: "👧",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `👧 *Anime Girl*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 6. ANIMEBOY ───
cmd({
    pattern: "animeboy",
    desc: "Get random anime boy image",
    category: "anime",
    react: "👦",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/husbando`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `👦 *Anime Boy*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 7. CATGIRL ───
cmd({
    pattern: "catgirl",
    desc: "Get random catgirl anime image",
    category: "anime",
    react: "😺",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/neko`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `😺 *Catgirl Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 8. FOXGIRL ───
cmd({
    pattern: "foxgirl",
    desc: "Get random foxgirl anime image",
    category: "anime",
    react: "🦊",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/kitsune`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🦊 *Foxgirl Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 9. KAWAII ───
cmd({
    pattern: "kawaii",
    desc: "Get random kawaii anime image",
    category: "anime",
    react: "🌸",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🌸 *Kawaii Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 10. OTAKU ───
cmd({
    pattern: "otaku",
    desc: "Get random otaku anime image",
    category: "anime",
    react: "🎌",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🎌 *Otaku Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 11. MANGA ───
cmd({
    pattern: "manga",
    desc: "Get random manga style anime image",
    category: "anime",
    react: "📖",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `📖 *Manga Style*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 12. COSPLAY ───
cmd({
    pattern: "cosplay",
    desc: "Get random anime cosplay image",
    category: "anime",
    react: "🎭",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🎭 *Anime Cosplay*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 13. SCHOOLGIRL ───
cmd({
    pattern: "schoolgirl",
    desc: "Get random anime schoolgirl image",
    category: "anime",
    react: "🎒",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🎒 *Anime Schoolgirl*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 14. MAID ───
cmd({
    pattern: "maid",
    desc: "Get random anime maid image",
    category: "anime",
    react: "🧹",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🧹 *Anime Maid*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 15. UNIFORM ───
cmd({
    pattern: "uniform",
    desc: "Get random anime uniform image",
    category: "anime",
    react: "👔",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `👔 *Anime Uniform*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 16. FANTASY ───
cmd({
    pattern: "fantasy",
    desc: "Get random fantasy anime image",
    category: "anime",
    react: "✨",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `✨ *Fantasy Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 17. WARRIOR ───
cmd({
    pattern: "warrior",
    desc: "Get random anime warrior image",
    category: "anime",
    react: "⚔️",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `⚔️ *Anime Warrior*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 18. SAMURAI ───
cmd({
    pattern: "samurai",
    desc: "Get random anime samurai image",
    category: "anime",
    react: "🗡️",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/husbando`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🗡️ *Anime Samurai*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 19. NINJA ───
cmd({
    pattern: "ninja",
    desc: "Get random anime ninja image",
    category: "anime",
    react: "🥷",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/husbando`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🥷 *Anime Ninja*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 20. MAGICAL ───
cmd({
    pattern: "magical",
    desc: "Get random magical anime image",
    category: "anime",
    react: "🪄",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🪄 *Magical Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 21. DEMON ───
cmd({
    pattern: "demon",
    desc: "Get random demon anime image",
    category: "anime",
    react: "😈",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/husbando`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `😈 *Demon Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 22. ANGEL ───
cmd({
    pattern: "angel",
    desc: "Get random angel anime image",
    category: "anime",
    react: "👼",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `👼 *Angel Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 23. VAMPIRE ───
cmd({
    pattern: "vampire",
    desc: "Get random vampire anime image",
    category: "anime",
    react: "🧛",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🧛 *Vampire Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 24. ELF ───
cmd({
    pattern: "elf",
    desc: "Get random elf anime image",
    category: "anime",
    react: "🧝",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🧝 *Elf Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 25. PRINCESS ───
cmd({
    pattern: "princess",
    desc: "Get random princess anime image",
    category: "anime",
    react: "👸",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `👸 *Princess Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 26. PRINCE ───
cmd({
    pattern: "prince",
    desc: "Get random prince anime image",
    category: "anime",
    react: "🤴",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/husbando`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🤴 *Prince Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 27. CHIBI ───
cmd({
    pattern: "chibi",
    desc: "Get random chibi anime image",
    category: "anime",
    react: "🍼",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/neko`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🍼 *Chibi Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 28. IDOL ───
cmd({
    pattern: "idol",
    desc: "Get random idol anime image",
    category: "anime",
    react: "🎤",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🎤 *Idol Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 29. GAMER ───
cmd({
    pattern: "gamer",
    desc: "Get random gamer anime image",
    category: "anime",
    react: "🎮",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🎮 *Gamer Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 30. CYBERPUNK ───
cmd({
    pattern: "cyberpunk",
    desc: "Get random cyberpunk anime image",
    category: "anime",
    react: "🤖",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🤖 *Cyberpunk Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 31. AESTHETIC ───
cmd({
    pattern: "aesthetic",
    desc: "Get random aesthetic anime image",
    category: "anime",
    react: "🌺",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🌺 *Aesthetic Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 32. VINTAGE ───
cmd({
    pattern: "vintage",
    desc: "Get random vintage anime image",
    category: "anime",
    react: "📼",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `📼 *Vintage Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 33. SPORT ───
cmd({
    pattern: "sport",
    desc: "Get random sport anime image",
    category: "anime",
    react: "⚽",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/husbando`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `⚽ *Sport Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 34. WINTER ───
cmd({
    pattern: "winter",
    desc: "Get random winter anime image",
    category: "anime",
    react: "❄️",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `❄️ *Winter Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 35. SUMMER ───
cmd({
    pattern: "summer",
    desc: "Get random summer anime image",
    category: "anime",
    react: "☀️",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `☀️ *Summer Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 36. SPRING ───
cmd({
    pattern: "spring",
    desc: "Get random spring anime image",
    category: "anime",
    react: "🌸",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🌸 *Spring Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 37. AUTUMN ───
cmd({
    pattern: "autumn",
    desc: "Get random autumn anime image",
    category: "anime",
    react: "🍂",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🍂 *Autumn Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 38. MOONLIGHT ───
cmd({
    pattern: "moonlight",
    desc: "Get random moonlight anime image",
    category: "anime",
    react: "🌙",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🌙 *Moonlight Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 39. STARLIGHT ───
cmd({
    pattern: "starlight",
    desc: "Get random starlight anime image",
    category: "anime",
    react: "⭐",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `⭐ *Starlight Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 40. SUNSET ───
cmd({
    pattern: "sunset",
    desc: "Get random sunset anime image",
    category: "anime",
    react: "🌅",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🌅 *Sunset Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 41. RAINY ───
cmd({
    pattern: "rainy",
    desc: "Get random rainy anime image",
    category: "anime",
    react: "🌧️",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🌧️ *Rainy Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 42. CLOUDY ───
cmd({
    pattern: "cloudy",
    desc: "Get random cloudy anime image",
    category: "anime",
    react: "☁️",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `☁️ *Cloudy Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 43. OCEAN ───
cmd({
    pattern: "ocean",
    desc: "Get random ocean anime image",
    category: "anime",
    react: "🌊",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🌊 *Ocean Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 44. MOUNTAIN ───
cmd({
    pattern: "mountain",
    desc: "Get random mountain anime image",
    category: "anime",
    react: "⛰️",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `⛰️ *Mountain Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 45. FOREST ───
cmd({
    pattern: "forest",
    desc: "Get random forest anime image",
    category: "anime",
    react: "🌲",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🌲 *Forest Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 46. CHERRY ───
cmd({
    pattern: "cherry",
    desc: "Get random cherry blossom anime image",
    category: "anime",
    react: "🌸",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🌸 *Cherry Blossom Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 47. DRAGON ───
cmd({
    pattern: "dragon",
    desc: "Get random dragon anime image",
    category: "anime",
    react: "🐉",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🐉 *Dragon Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 48. PHOENIX ───
cmd({
    pattern: "phoenix",
    desc: "Get random phoenix anime image",
    category: "anime",
    react: "🔥",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🔥 *Phoenix Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 49. SPIRIT ───
cmd({
    pattern: "spirit",
    desc: "Get random spirit anime image",
    category: "anime",
    react: "👻",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `👻 *Spirit Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});

// ─── 50. MYSTIC ───
cmd({
    pattern: "mystic",
    desc: "Get random mystic anime image",
    category: "anime",
    react: "🔮",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let res = await axios.get(`${base}/waifu`, { headers });
        let imageUrl = res.data.results[0].url;
        let artist = res.data.results[0].artist_name || "Unknown";
        
        await conn.sendMessage(mek.chat, {
            image: { url: imageUrl },
            caption: `🔮 *Mystic Anime*\n🎨 *Artist:* ${artist}\n\n> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`
        }, { quoted: mek });
    } catch (error) {
        console.error("❌ Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});
