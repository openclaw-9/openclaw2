// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';
import config from '../config.js';
import { cmd } from '../command.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getTikTokPhotoSearch(query) {
    const apis = [
        `https://api.nexray.eu.cc/search/tiktokphoto?q=${encodeURIComponent(query)}`
    ]
    
    const getAll = async () => {
        for (const url of apis) {
            try {
                const res = await axios.get(url)
                const data = res.data
                
                let photos = []
                if (Array.isArray(data?.result)) {
                    photos = data.result.filter(item => item.images && item.images.length > 0)
                }
                
                if (photos.length) return photos
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
    pattern: "tiktokphoto",
    alias: ["ttphoto", "ttimg"],
    react: "📸",
    desc: "Search and download TikTok photos",
    category: "download",
    use: ".tiktokphoto <query>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply(`❀ Please enter a search query.\n\n*Example:* .tiktokphoto Imran Khan`)

        const res = await getTikTokPhotoSearch(q)
        const photos = await res.getAll()
        
        if (photos.length < 1) return reply('✧ No photos found.')
        
        // Get first result
        const post = photos[0]
        
        const caption = `*${post.title.substring(0, 100)}${post.title.length > 100 ? '...' : ''}*\n\n` +
                      `👤 ${post.author.nickname}\n` +
                      `👁️ ${post.stats.views}\n` +
                      `❤️ ${post.stats.likes}\n\n` +
                      `> DARKZONE-MD`
        
        // Send all images from the post (up to 10)
        const imagesToSend = post.images.slice(0, 10)
        
        for (let i = 0; i < imagesToSend.length; i++) {
            await conn.sendMessage(from, {
                image: { url: imagesToSend[i] },
                caption: i === 0 ? caption : ''
            }, { quoted: m })
        }

    } catch (error) {
        console.error('TikTok Photo Search Error:', error)
        reply(`⚠️ A problem has occurred.\n\n${error.message}`)
    }
})