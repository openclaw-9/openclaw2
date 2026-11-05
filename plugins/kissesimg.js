// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';
import config from '../config.js';
import { cmd } from '../command.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getPinterestSearch(query) {
    const apis = [
        `https://api.nexray.eu.cc/search/pinterest?q=${encodeURIComponent(query)}`
    ]
    
    const getAll = async () => {
        for (const url of apis) {
            try {
                const res = await axios.get(url)
                const data = res.data
                
                let urls = []
                if (Array.isArray(data?.result)) {
                    urls = data.result
                        .map(item => item.images_url)
                        .filter(u => typeof u === 'string' && u.startsWith('http'))
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
    pattern: "kissimg",
    alias: ["kissimg", "kissimg"],
    react: "📌",
    desc: "Search images on hot girl",
    category: "search",
    use: ".kissimg <query>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply(`❀ Please enter a search query.\n\n*Example:* .kissimg hot girl dp`)

        const res = await getPinterestSearch(q)
        const urls = await res.getAll()
        
        if (urls.length < 1) return reply('✧ No images found.')
        
        const medias = urls.slice(0, 10).map(url => ({ image: { url } }))
        const caption = `> DARKZONE-MD`
        
        for (let media of medias) {
            await conn.sendMessage(from, media, { quoted: m })
        }
        
        await conn.sendMessage(from, { text: caption }, { quoted: m })

    } catch (error) {
        console.error('Pinterest Search Error:', error)
        reply(`⚠️ A problem has occurred.\n\n${error.message}`)
    }
})
