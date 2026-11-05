// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';
import config from '../config.js';
import { cmd } from '../command.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getStickerSearch(query) {
    const apis = [
        `https://api.giftedtech.co.ke/api/search/stickersearch?apikey=gifted&query=${encodeURIComponent(query)}`
    ]
    
    const getAll = async () => {
        for (const url of apis) {
            try {
                const res = await axios.get(url)
                const data = res.data
                
                // Handle GiftedTech API response structure
                let urls = []
                if (Array.isArray(data?.results)) {
                    // Results array contains direct URL strings
                    urls = data.results.filter(u => typeof u === 'string' && u.startsWith('http'))
                }
                
                if (urls.length) return urls
            } catch {}
        }
        return []
    }
    
    return { 
        getAll,
        getRandom: async () => {
            const all = await getAll()
            return all[Math.floor(Math.random() * all.length)] || null
        }
    }
}

cmd({
    pattern: "searchsticker",
    alias: ["searchs", "stickersearch"],
    react: "🎨",
    desc: "Search for stickers",
    category: "search",
    use: ".sticker <query>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply(`❀ Please enter a text to search for stickers.`)

        await reply("*SEARCHING FOR STICKERS...*")

        const res = await getStickerSearch(q)
        const urls = await res.getAll()
        
        if (urls.length < 1) return reply('✧ No stickers found.')
        
        const caption = `> DARKZONE-MD STICKER RESULTS FOR: ${q}\n\n📦 Sending ${Math.min(urls.length, 10)} stickers...`
        await conn.sendMessage(from, { text: caption }, { quoted: m })
        
        // Send stickers (max 10)
        for (let i = 0; i < Math.min(urls.length, 10); i++) {
            await conn.sendMessage(from, { 
                sticker: { url: urls[i] }
            }, { quoted: m })
        }

    } catch (error) {
        console.error('Sticker Search Error:', error)
        reply(`⚠️ A problem has occurred.\n\n${error.message}`)
    }
})