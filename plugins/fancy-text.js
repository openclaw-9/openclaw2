// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';
import config from '../config.js';
import { cmd } from '../command.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getFancyText(text) {
    const url = `https://api.giftedtech.co.ke/api/tools/fancy?apikey=gifted&text=${encodeURIComponent(text)}`
    
    try {
        const res = await axios.get(url)
        const data = res.data
        
        // Handle GiftedTech API response structure
        if (data?.success && Array.isArray(data?.results)) {
            return data.results
        }
        return []
    } catch {
        return []
    }
}

cmd({
    pattern: "fancy",
    alias: ["fancytext", "styletext"],
    react: "✨",
    desc: "Convert text to fancy styles",
    category: "tools",
    use: ".fancy <text>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply(`❀ Please provide text to convert.\n\n*Example:* .fancy Erfan`)

        await reply("*GENERATING FANCY TEXT...*")

        const results = await getFancyText(q)
        
        if (results.length < 1) return reply('✧ Failed to generate fancy text. Please try again.')
        
        // Format fancy text results
        let message = `╭━━━━━━━━━━━━━━━━━━╮\n`
        message += `┃ ✨ *FANCY TEXT GENERATOR*\n`
        message += `┃ 📝 Original: ${q}\n`
        message += `┃ 🎨 Styles: ${results.length}\n`
        message += `╰━━━━━━━━━━━━━━━━━━╯\n\n`
        
        results.forEach((style, index) => {
            message += `*${index + 1}. ${style.name}*\n`
            message += `${style.result}\n\n`
        })
        
        message += `━━━━━━━━━━━━━━━━━━\n\n`
        message += `> DARKZONE-MD FANCY TEXT\n`
        message += `> Created by Erfan`
        
        await conn.sendMessage(from, { 
            text: message 
        }, { quoted: m })

    } catch (error) {
        console.error('Fancy Text Error:', error)
        reply(`⚠️ A problem has occurred.\n\n${error.message}`)
    }
})