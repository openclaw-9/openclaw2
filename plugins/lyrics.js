// ERFAN-MD
// Lyrics command — uses https://api.ryuzei.xyz/search/lyrics?q=<song>
// No "Searching..." step: it fetches and sends the FULL lyrics directly.
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
import axios from 'axios';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cmd({
    pattern: "lyrics",
    alias: ["lyric", "songlyrics", "findlyrics"],
    desc: "Get full lyrics of a song",
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
*Example:* .lyrics Tek It`);
        }

        const encodedQuery = encodeURIComponent(songName.trim());
        const apiUrl = `https://api.ryuzei.xyz/search/lyrics?q=${encodedQuery}`;

        const response = await axios.get(apiUrl, {
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const data = response.data;

        if (!data) return reply("❌ *Lyrics not found!*\nTry with a different song name.");

        // Auto-detect the song object from common response shapes:
        // { result: {...} } | { results: {...} } | { data: {...} } | the object itself
        // | { result: [ {...} ] } etc.
        let song = data?.result ?? data?.results ?? data?.data ?? data;
        if (Array.isArray(song)) song = song[0];

        // Auto-detect fields regardless of naming
        const title  = song?.title || song?.name || song?.trackName || song?.songTitle || song?.song || songName;
        const artist = song?.artist || song?.artistName || song?.artists
            ? (typeof song?.artists === 'string' ? song.artists
               : Array.isArray(song?.artists) ? song.artists.map(a => a?.name || a).join(', ')
               : song?.artistName || '')
            : '';
        const album  = song?.album || song?.albumName || '';
        const lyrics = song?.lyrics || song?.lyric || song?.text || song?.body || '';

        if (!lyrics || typeof lyrics !== 'string') {
            return reply(`❌ *Lyrics not found!*\n\nSong: ${title}\nTry with a different song name.`);
        }

        // Header (only include what we actually have)
        let header = `🎵 *LYRICS*\n`;
        if (title) header += `📀 *Title:* ${title}\n`;
        if (artist) header += `🎤 *Artist:* ${artist}\n`;
        if (album) header += `💿 *Album:* ${album}\n`;
        header += `\n📝 *Lyrics:*\n\n`;

        const fullMessage = header + lyrics.trim();

        // Send with cover image if available, else plain text
        const cover = song?.cover || song?.image || song?.thumbnail || song?.artwork;
        if (cover && typeof cover === 'string' && /^https?:\/\//.test(cover)) {
            await conn.sendMessage(from, {
                image: { url: cover },
                caption: fullMessage
            }, { quoted: m });
        } else {
            await reply(fullMessage);
        }

    } catch (error) {
        console.error("Lyrics command error:", error);

        let errorMessage = "❌ *Failed to fetch lyrics*\n\n";
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            errorMessage += "⏱️ Connection timeout. Please try again.";
        } else if (error.response?.status === 404) {
            errorMessage += "🔍 Song not found. Try a different name.";
        } else if (error.response?.status === 429) {
            errorMessage += "🚫 Too many requests. Please wait and try again.";
        } else if (error.response?.status >= 500) {
            errorMessage += "🔧 API server error. Please try again later.";
        } else {
            errorMessage += "🔄 Please try again with a different song name.";
        }
        await reply(errorMessage);
    }
});
