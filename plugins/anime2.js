// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';
import config from '../config.js';
import { cmd } from '../command.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getBaImage() {
    const apis = [
        `https://api.nexray.eu.cc/random/ba`
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
    pattern: "ba",
    alias: ["baimg"],
    react: "🎭",
    desc: "Get random BA images",
    category: "anime",
    use: ".ba",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        const imageUrl = `https://api.nexray.eu.cc/random/ba`
        
        const caption = `> DARKZONE-MD`
        
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: caption
        }, { quoted: m })

    } catch (error) {
        console.error('BA Image Error:', error)
        reply(`⚠️ A problem has occurred.\n\n${error.message}`)
    }
})