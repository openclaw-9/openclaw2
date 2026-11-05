// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';
import config from '../config.js';
import { cmd } from '../command.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAnimeImage(type) {
    const apis = [
        `https://api.nexray.eu.cc/random/anime?type=${encodeURIComponent(type)}`
    ]
    
    const getAll = async () => {
        for (const url of apis) {
            try {
                const res = await axios.get(url, { 
                    responseType: 'arraybuffer',
                    timeout: 10000 
                })
                
                if (res.data) {
                    return [url]
                }
            } catch {}
        }
        return []
    }
    
    return { 
        getAll,
        getRandom: async () => {
            const all = await getAll()
            return all[0] || null
        }
    }
}

cmd({
    pattern: "anime",
    alias: ["animepic", "animeimg"],
    react: "🎌",
    desc: "Get random anime images",
    category: "anime",
    use: ".anime <type>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply(`❀ Please enter anime type.\n\n*Example:* waifu, neko, maid, etc.`)

        const imageUrl = `https://api.nexray.eu.cc/random/anime?type=${encodeURIComponent(q)}`
        
        const caption = `> DARKZONE-MD`
        
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: caption
        }, { quoted: m })

    } catch (error) {
        console.error('Anime Image Error:', error)
        reply(`⚠️ A problem has occurred.\n\n${error.message}`)
    }
})