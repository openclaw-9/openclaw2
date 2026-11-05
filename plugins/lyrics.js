// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
import axios from 'axios';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cmd({
    pattern: "lyrics",
    alias: ["lyric", "songlyrics", "findlyrics"],
    desc: "Search for song information and lyrics",
    category: "search",
    react: "🎵",
    filename: __filename
},
async(conn, mek, m, {
    from, quoted, args, q, reply
}) => {
    try {
        const songName = q || (quoted && quoted.text) || '';

        if (!songName) {
            return reply(`❌ *Please provide a song name!*

*Usage:* .lyrics <song name>
*Example:* .lyrics Shape of You
*Example:* .lyrics Pal Pal`);
        }

        await reply("🔍 *Searching for song...*");

        const encodedQuery = encodeURIComponent(songName);
        const apiUrl = `https://api.zenitsu.web.id/api/search/lyrics?q=${encodedQuery}`;

        const response = await axios.get(apiUrl, {
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const data = response.data;

        if (!data || data.statusCode !== 200 || !data.results) {
            return reply("❌ *Song not found!*\nPlease try with a different song name.");
        }

        const song = data.results;
        
        // Build credits string
        let creditsText = "";
        if (song.credits && song.credits.length > 0) {
            creditsText = song.credits.map(c => `• ${c.name} (${c.role})`).join('\n');
        }

        // Get lyrics preview (first few lines only)
        let lyricsPreview = "";
        if (song.lyrics) {
            const lines = song.lyrics.split('\n').filter(line => line.trim());
            const previewLines = lines.slice(0, 4); // Only first 4 lines
            lyricsPreview = previewLines.join('\n');
            if (lines.length > 4) {
                lyricsPreview += "\n...";
            }
        }

        // Create message
        const message = `🎵 *SONG INFORMATION*

📀 *Title:* ${song.title || 'N/A'}
💿 *Album:* ${song.album || 'N/A'}
📅 *Release Date:* ${song.releaseDate || 'N/A'}
🎭 *Genre:* ${song.genre || 'N/A'}

${creditsText ? `👥 *Credits:*\n${creditsText}` : ''}

${lyricsPreview ? `📝 *Lyrics Preview:*\n${lyricsPreview}` : ''}

_Search more songs with .lyrics <song name>_`;

        // Send with cover image if available
        if (song.cover) {
            await conn.sendMessage(from, {
                image: { url: song.cover },
                caption: message
            }, { quoted: m });
        } else {
            await reply(message);
        }

    } catch (error) {
        console.error("Lyrics command error:", error);
        
        let errorMessage = "❌ *Failed to fetch song info*\n\n";
        
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            errorMessage += "⏱️ Connection timeout. Please try again.";
        } else if (error.response?.status === 404) {
            errorMessage += "🔍 Song not found. Try a different name.";
        } else if (error.response?.status === 429) {
            errorMessage += "🚫 Too many requests. Please wait and try again.";
        } else if (error.response?.status === 500) {
            errorMessage += "🔧 Server error. Please try again later.";
        } else {
            errorMessage += "🔄 Please try again with a different song name.";
        }
        
        await reply(errorMessage);
    }
});
