// ERFAN MD 
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);

const VIDEO_API_BASE = "https://januxyt.vercel.app/api/ytmp4";
const AUDIO_API_BASE = "https://januxyt.vercel.app/api/ytmp3";

const toSmallCaps = (text) => {
    const map = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ',
        'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ',
        'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
    };
    return text.split('').map(c => map[c.toLowerCase()] || c).join('');
};

function getVideoId(url) {
    if (!url || typeof url !== 'string') return null;

    const patterns = [
        /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
        /(?:m\.youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/watch\/)([a-zA-Z0-9_-]{11})/,
        /(?:music\.youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }

    return null;
}

// ============================================
// UPDATED AUDIO / VIDEO APIS
// ============================================

const getAudioAPIs = (url) => [
    {
        url: `${AUDIO_API_BASE}?url=${encodeURIComponent(url)}`,
        timeout: 30000
    }
];

const getFallbackVideoAPI = (url) =>
    `${VIDEO_API_BASE}?url=${encodeURIComponent(url)}`;

// ============================================
// PATIENT VIDEO FETCHER
// - New fast API: januxyt.vercel.app/api/ytmp4
// - Response: { ok, type, title, thumbnail, author, duration,
//               quality, download, cached }
// - SIRF download URL uthaya jaata hai, baaki ignore.
// - PATIENT: agar response late aaye ya fail ho to foran error nahi
//   deta — retry karta hai (4 attempts x 60s timeout + 5s waits).
// - Jaldi aaye to foran return, late aaye to intezar karta hai.
// - Name same rakha (getDeliriusVideoData) taake video / drama /
//   cartoon / movie commands ko koi aur change na karna pare.
// ============================================
async function getDeliriusVideoData(url) {
    const maxAttempts = 4;
    const attemptTimeout = 60000;
    const waitBetweenMs = 5000;
    let lastError = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await axios.get(getFallbackVideoAPI(url), {
                timeout: attemptTimeout,
                headers: { "User-Agent": "Mozilla/5.0" }
            });

            const data = response.data;
            if (data?.ok === true && data?.download) {
                return {
                    title: data.title || null,
                    download: data.download,
                    format: "MP4",
                    quality: data.quality || "360p"
                };
            }
            lastError = new Error("Video API responded without a download link.");
        } catch (e) {
            lastError = e;
        }

        // Patience: wait before the next attempt instead of failing fast
        if (attempt < maxAttempts) {
            await new Promise((r) => setTimeout(r, waitBetweenMs));
        }
    }

    throw lastError || new Error("Video API failed after all attempts.");
}

// ============================================
// COMMAND: PLAY (AUDIO)
// ============================================

cmd({
    pattern: "play",
    alias: ["song", "music", "audio"],
    desc: "Download YouTube audio",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) {
            return reply("❌ Please provide song name\nExample: .play Shape of You");
        }

        const { default: yts } = await import('yt-search');

        let url = text;
        let vid = null;

        if (text.startsWith('http://') || text.startsWith('https://')) {
            if (!text.includes("youtube.com") && !text.includes("youtu.be")) {
                return reply("❌ Please provide a valid YouTube URL!");
            }

            const videoId = getVideoId(text);
            if (!videoId) return reply("❌ Invalid YouTube URL!");

            vid = await yts({ videoId });
            url = text;
        } else {
            const search = await yts(text);

            if (!search || !search.videos || !search.videos.length) {
                return reply("❌ No song found!");
            }

            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) return reply("❌ No results found!");

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `- *AUDIO DOWNLOADER 🎧*
╭━━❐━⪼
┇๏ *Title* - ${vid.title}
┇๏ *Duration* - ${vid.timestamp}
┇๏ *Views* - ${vid.views?.toLocaleString() || 'N/A'}
┇๏ *Author* - ${vid.author?.name || 'Unknown'}
┇๏ *Status* - Downloading...
╰━━❑━⪼
> Powered by ERFAN-MD`
        }, { quoted: mek });

        let success = false;
        const audioAPIs = getAudioAPIs(url);

        for (const api of audioAPIs) {
            if (success) break;

            try {
                const response = await axios.get(api.url, {
                    timeout: api.timeout
                });

                const audioUrl =
                    response.data?.ok === true && response.data?.download
                        ? response.data.download
                        : null;

                if (!audioUrl) continue;

                try {
                    await conn.sendMessage(from, {
                        audio: { url: audioUrl },
                        mimetype: "audio/mpeg",
                        fileName: `${vid.title}.mp3`,
                        ptt: false
                    }, { quoted: mek });

                    success = true;
                    break;
                } catch (sendErr) {
                    console.error(`⚠️ Audio send failed:`, sendErr.message);
                }
            } catch (e) {
                console.error(`⚠️ Audio API failed:`, e.message);
            }
        }

        if (!success) {
            return reply("❌ Audio download failed! Try again later.");
        }

        await conn.sendMessage(from, {
            react: { text: '✅', key: m.key }
        });

    } catch (err) {
        console.error("❌ PLAY ERROR:", err);
        
        reply("❌ Error occurred! Please try again later!");

        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
    }
});

// ============================================
// COMMAND: VIDEO
// ============================================

cmd({
    pattern: "video",
    alias: ["ytv", "ytmp4", "vd"],
    desc: "Download YouTube video using Rimi API",
    category: "download",
    react: "📹",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) {
            return reply("🎥 Please provide a video name or YouTube link!\n\nExample: `.video Alone Marshmello`");
        }

        const { default: yts } = await import("yt-search");
        let vid;
        let url = text.trim();

        if (/^https?:\/\//i.test(url)) {
            if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
                return reply("❌ Please provide a valid YouTube URL!");
            }
            const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/|live\/))([a-zA-Z0-9_-]{11})/);
            if (!match) return reply("❌ Invalid YouTube URL!");
            vid = await yts({ videoId: match[1] });
        } else {
            const search = await yts(url);
            vid = search.videos?.[0];
            if (vid) url = vid.url;
        }

        if (!vid) return reply("❌ No video results found!");

        // Send thumbnail and metadata immediately, before calling the download API.
        const detailsCaption = `╭─────────────🎬
│ 🎥 *VIDEO DOWNLOADER*
│─────────────────────
│ 🎬 *Title:* ${vid.title}
│ 👤 *Author:* ${vid.author?.name || "Unknown"}
│ 👀 *Views:* ${vid.views?.toLocaleString() || "N/A"}
│ 🎞️ *Duration:* ${vid.timestamp || "N/A"}
│ 📥 *Status:* Preparing download...
╰─────────────🎬
🔗 *Powered By ERFAN-MD*`;

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: detailsCaption
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: "⬇️", key: m.key }
        });

        // Patient fetch: fast response → instant use; late response → waits for it.
        const apiData = await getDeliriusVideoData(url);
        const title = apiData.title || vid.title;
        const videoDownloadUrl = apiData.download;

        const videoRes = await axios.get(videoDownloadUrl, {
            responseType: "arraybuffer",
            timeout: 300000,
            maxContentLength: 500 * 1024 * 1024,
            maxBodyLength: 500 * 1024 * 1024,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": "https://www.youtube.com/",
                "Accept": "*/*"
            }
        });

        const videoBuffer = Buffer.from(videoRes.data);
        const contentType = videoRes.headers?.["content-type"] || "";

        if (
            videoBuffer.length < 10000 ||
            contentType.includes("text/html") ||
            contentType.includes("application/json")
        ) {
            throw new Error("The API returned an invalid or empty video file.");
        }

        const safeTitle = title.replace(/[\\/:*?"<>|]/g, "_").slice(0, 180);

        await conn.sendMessage(from, {
            video: videoBuffer,
            mimetype: "video/mp4",
            fileName: `${safeTitle}.mp4`,
            caption: `🎬 *${title}*\n🎞️ ${apiData.format || "MP4"}\n🔗 *Powered By ERFAN-MD*`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });

    } catch (error) {
        console.error("[VIDEO] Error:", error?.response?.data || error?.message || error);
        await conn.sendMessage(from, {
            react: { text: "❌", key: m.key }
        });
        return reply(
            error?.code === "ECONNABORTED"
                ? "❌ Video download timed out. Please try again."
                : `❌ Video download failed: ${error?.message || "Please try again later."}`
        );
    }
});

// ============================================

// COMMAND: SONG (INTERACTIVE)
// ============================================

cmd({
    pattern: "song",
    alias: ["yt", "music", "ytdl"],
    desc: "Download YouTube song or video (interactive)",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) {
            return reply("🎶 Please provide a YouTube video name or link.\n\nExample: `.song Alone - Alan Walker`");
        }

        const { default: yts } = await import('yt-search');

        let vid = null;
        let url = text;

        if (text.startsWith('http://') || text.startsWith('https://')) {
            if (!text.includes("youtube.com") && !text.includes("youtu.be")) {
                return reply("❌ Please provide a valid YouTube URL!");
            }

            const videoId = getVideoId(text);
            if (!videoId) return reply("❌ Invalid YouTube URL!");

            vid = await yts({ videoId });
            url = text;
        } else {
            const search = await yts(text);

            if (!search || !search.videos || !search.videos.length) {
                return reply("❌ No results found!");
            }

            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) return reply("❌ No results found!");

        const caption = `*╭┈───〔 ${toSmallCaps('YT Downloader')} 〕┈───⊷*
*├▢ 🎬 Title:* ${vid.title}
*├▢ 📺 Channel:* ${vid.author?.name || 'Unknown'}
*├▢ ⏰ Duration:* ${vid.timestamp}
*├▢ 👀 Views:* ${vid.views?.toLocaleString() || 'N/A'}
*╰───────────────────⊷*
*╭───⬡ ${toSmallCaps('Select Format')} ⬡───*
*┋ ⬡ 1* 🎧 ${toSmallCaps('Audio (MP3)')}
*┋ ⬡ 2* 📹 ${toSmallCaps('Video (MP4)')}
*┋ ⬡ 3* 📄 ${toSmallCaps('Audio as Document')}
*┋ ⬡ 4* 📄 ${toSmallCaps('Video as Document')}
*╰───────────────────⊷*

> Powered by ERFAN-MD`;


   const sent = await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption
        }, { quoted: mek });

        const msgId = sent.key.id;

        const songListener = async (msgData) => {
            const received = msgData.messages[0];
            if (!received.message) return;

            const selected =
                received.message.conversation ||
                received.message.extendedTextMessage?.text;

            const replyToBot =
                received.message.extendedTextMessage?.contextInfo?.stanzaId === msgId;

            if (!replyToBot) return;

            conn.ev.off("messages.upsert", songListener);

            await conn.sendMessage(from, {
                react: { text: '⬇️', key: received.key }
            });

            const cleanSelect = selected?.trim();

            if (!["1", "2", "3", "4"].includes(cleanSelect)) {
                return conn.sendMessage(from, {
                    text: `❌ *Invalid selection!*
Please reply with:
1️⃣ for Audio (MP3)
2️⃣ for Video (MP4)
3️⃣ for Audio as Document
4️⃣ for Video as Document`
                }, { quoted: received });
            }

            const type = cleanSelect === "1" || cleanSelect === "3" ? "mp3" : "mp4";
            const asDocument = cleanSelect === "3" || cleanSelect === "4";

            if (type === "mp3") {
                let success = false;
                const audioAPIs = getAudioAPIs(url);

                for (const api of audioAPIs) {
                    if (success) break;

                    try {
                        const response = await axios.get(api.url, {
                            timeout: api.timeout
                        });

                        const audioUrl =
                            response.data?.ok === true && response.data?.download
                                ? response.data.download
                                : null;

                        if (!audioUrl) continue;

                        if (asDocument) {
                            await conn.sendMessage(from, {
                                document: { url: audioUrl },
                                mimetype: "audio/mpeg",
                                fileName: `${vid.title}.mp3`,
                                caption: `📄 *${vid.title}*\n🎧 Audio Document\n\n> Powered by ERFAN-MD`
                            }, { quoted: received });
                        } else {
                            await conn.sendMessage(from, {
                                audio: { url: audioUrl },
                                mimetype: "audio/mpeg",
                                fileName: `${vid.title}.mp3`,
                                ptt: false
                            }, { quoted: received });
                        }

                        success = true;
                    } catch (e) {
                        console.error("⚠️ Audio download failed:", e.message);
                    }
                }

                if (!success) {
                    return conn.sendMessage(from, {
                        text: "❌ Audio download failed! Try again later."
                    }, { quoted: received });
                }
            } else {
                let success = false;
                let tempFile = null;

                try {
                    const apiData = await getDeliriusVideoData(url);
                    const videoUrl = apiData.download;
                    const title = apiData.title || vid.title;

                    {
                        if (!asDocument) {
                            await conn.sendMessage(from, {
                                video: { url: videoUrl },
                                caption: `🎬 *${title}*\n\n> Powered by ERFAN-MD`
                            }, { quoted: received });
                        } else {
                            tempFile = path.join(os.tmpdir(), `video_${Date.now()}.mp4`);

                            const fileRes = await axios({
                                method: 'GET',
                                url: videoUrl,
                                responseType: 'stream',
                                timeout: 300000
                            });

                            const writer = fs.createWriteStream(tempFile);
                            fileRes.data.pipe(writer);

                            await new Promise((resolve, reject) => {
                                writer.on('finish', resolve);
                                writer.on('error', reject);
                                fileRes.data.on('error', reject);
                            });

                            await conn.sendMessage(from, {
                                document: { url: tempFile },
                                mimetype: "video/mp4",
                                fileName: `${title}.mp4`,
                                caption: `📄 *${title}*\n📹 Video Document\n\n> Powered by ERFAN-MD`
                            }, { quoted: received });

                            try {
                                if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
                            } catch {}

                            tempFile = null;
                        }

                        success = true;
                    }
                } catch (e) {
                    console.error("⚠️ Video download failed:", e.message);

                    try {
                        if (tempFile && fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
                    } catch {}

                    tempFile = null;
                }

                if (!success) {
                    return conn.sendMessage(from, {
                        text: "❌ Video download failed! Try again later."
                    }, { quoted: received });
                }
            }

            await conn.sendMessage(from, {
                react: { text: '✅', key: received.key }
            });
        };

        conn.ev.on("messages.upsert", songListener);

        setTimeout(() => {
            conn.ev.off("messages.upsert", songListener);
        }, 30000);

    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);

        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
    }
});

// ============================================
// COMMAND: DRAMA (DIRECT DOCUMENT — no menu)
// ============================================

cmd({
    pattern: "drama",
    alias: ["film", "series"],
    desc: "Download YouTube drama/movie as document (direct)",
    category: "download",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    let tempFile = null;

    try {
        if (!text) {
            return reply("🎬 Please provide a drama/movie name or link.\n\nExample: `.drama Muskan 5`");
        }

        const { default: yts } = await import('yt-search');

        let vid = null;
        let url = text;

        if (text.startsWith('http://') || text.startsWith('https://')) {
            if (!text.includes("youtube.com") && !text.includes("youtu.be")) {
                return reply("❌ Please provide a valid YouTube URL!");
            }

            const videoId = getVideoId(text);
            if (!videoId) return reply("❌ Invalid YouTube URL!");

            vid = await yts({ videoId });
            url = text;
        } else {
            const search = await yts(text);

            if (!search || !search.videos || !search.videos.length) {
                return reply("❌ No results found!");
            }

            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) return reply("❌ No results found!");

        // Direct document download — no selection menu.
        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `*╭┈───〔 ${toSmallCaps('Drama Downloader')} 〕┈───⊷*
*├▢ 🎬 Title:* ${vid.title}
*├▢ 📺 Channel:* ${vid.author?.name || 'Unknown'}
*├▢ ⏰ Duration:* ${vid.timestamp}
*├▢ 👀 Views:* ${vid.views?.toLocaleString() || 'N/A'}
*╰───────────────────⊷*
_📥 Downloading as document..._

> Powered by ERFAN-MD`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: "⬇️", key: m.key }
        });

        const apiData = await getDeliriusVideoData(url);
        const videoUrl = apiData.download;
        const title = apiData.title || vid.title;

        tempFile = path.join(os.tmpdir(), `drama_${Date.now()}.mp4`);

        const fileRes = await axios({
            method: 'GET',
            url: videoUrl,
            responseType: 'stream',
            timeout: 300000
        });

        const writer = fs.createWriteStream(tempFile);
        fileRes.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
            fileRes.data.on('error', reject);
        });

        await conn.sendMessage(from, {
            document: { url: tempFile },
            mimetype: "video/mp4",
            fileName: `${title}.mp4`,
            caption: `🎬 *${title}*\n📺 Drama Document\n\n> Powered by ERFAN-MD`
        }, { quoted: mek });

        try {
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        } catch {}

        tempFile = null;

        await conn.sendMessage(from, {
            react: { text: '✅', key: m.key }
        });

    } catch (e) {
        try {
            if (tempFile && fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        } catch {}

        console.error("⚠️ Drama download failed:", e.message);

        await conn.sendMessage(from, {
            text: e?.code === "ECONNABORTED"
                ? "❌ Download timed out — the video is being prepared, please try again."
                : "❌ Video download failed! Try again later."
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
    }
});

// ============================================
// COMMAND: CARTOON
// ============================================

cmd({
    pattern: "cartoon",
    alias: ["toon", "kids"],
    desc: "Download YouTube cartoon video",
    category: "download",
    react: "🧸",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    let tempFile = null;

    try {
        if (!text) {
            return reply("🧸 Please provide a cartoon name!\n\nExample: `.cartoon Tom and Jerry`");
        }

        const { default: yts } = await import('yt-search');

        let url = text;
        let vid = null;

        if (text.startsWith('http://') || text.startsWith('https://')) {
            if (!text.includes("youtube.com") && !text.includes("youtu.be")) {
                return reply("❌ Please provide a valid YouTube URL!");
            }

            const videoId = getVideoId(text);
            if (!videoId) return reply("❌ Invalid YouTube URL!");

            vid = await yts({ videoId });
            url = text;
        } else {
            const search = await yts(`${text} cartoon`);

            if (!search || !search.videos || !search.videos.length) {
                return reply("❌ No cartoon results found!");
            }

            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) return reply("❌ No results found!");

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `*🧸 CARTOON DOWNLOADER*
🎞️ *Title:* ${vid.title}
📺 *Channel:* ${vid.author?.name || 'Unknown'}
🕒 *Duration:* ${vid.timestamp}

*Status:* Downloading Cartoon...

> Powered by ERFAN-MD`
        }, { quoted: mek });

        // Patient fetch — same video API as .video.
        const apiData = await getDeliriusVideoData(url);
        const videoUrl = apiData.download;
        const title = apiData.title || vid.title;

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `🧸 *${title}*\n\n> Powered by ERFAN-MD`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: '✅', key: m.key }
        });

    } catch (e) {
        try {
            if (tempFile && fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        } catch {}

        if (global.gc) global.gc();

        console.error("Error in .cartoon command:", e);
        reply("❌ Error occurred, please try again later!");

        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
    }
});

// ============================================
// COMMAND: MOVIE
// ============================================

cmd({
    pattern: "movie",
    alias: ["playmovie", "dlmovie"],
    desc: "Fast auto search with DP info and download full movie as document safely",
    category: "download",
    react: "🍿",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    let tempFile = null;

    try {
        if (!text) {
            return reply("❌ *Please provide a movie name!*\n\nExample: `.movie DJ Ganesh Chaturthi`");
        }

        if (text.startsWith('http://') || text.startsWith('https://')) {
            return reply("❌ URLs are not supported here.\nPlease send a movie *name* only.");
        }

        await conn.sendMessage(from, {
            react: { text: "⚡", key: mek.key }
        });

        const { default: yts } = await import('yt-search');
        const search = await yts(`${text} full movie`);

        if (!search || !search.videos || !search.videos.length) {
            return reply("❌ No results found!");
        }

        const vid = search.videos[0];

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `*╭┈───〔 ${toSmallCaps('Movie Downloader')} 〕┈───⊷*
*├▢ 🍿 Title:* ${vid.title}
*├▢ 📺 Channel:* ${vid.author?.name || 'Unknown'}
*├▢ ⏰ Duration:* ${vid.timestamp}
*├▢ 👀 Views:* ${vid.views?.toLocaleString() || 'N/A'}
*╰───────────────────⊷*
_⚡ Downloading as document..._

> Powered by ERFAN-MD`
        }, { quoted: mek });

        // Patient fetch — same video API as .video.
        const apiData = await getDeliriusVideoData(vid.url);
        const downloadURL = apiData.download;
        const title = apiData.title || vid.title;

        tempFile = path.join(os.tmpdir(), `movie_${Date.now()}.mp4`);

        const fileRes = await axios({
            method: 'GET',
            url: downloadURL,
            responseType: 'stream',
            timeout: 300000
        });

        const writer = fs.createWriteStream(tempFile);
        fileRes.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
            fileRes.data.on('error', reject);
        });

        await conn.sendMessage(from, {
            document: { url: tempFile },
            mimetype: "video/mp4",
            fileName: `${title}.mp4`,
            caption: `🍿 *${title}*\n\n> Powered by ERFAN-MD`
        }, { quoted: mek });

        try {
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        } catch {}

        if (global.gc) global.gc();
        tempFile = null;

        await conn.sendMessage(from, {
            react: { text: '✅', key: mek.key }
        });

    } catch (e) {
        try {
            if (tempFile && fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        } catch {}

        if (global.gc) global.gc();

        await reply("❌ Error: " + (e?.message || e));

        await conn.sendMessage(from, {
            react: { text: '❌', key: mek.key }
        });
    }
});

// ============================================
// COMMAND: YTS (YOUTUBE SEARCH)
// ============================================

cmd({
    pattern: "yts",
    alias: ["ytsearch", "searchyt"],
    use: '.yts ERFAN',
    react: "🔎",
    desc: "Search YouTube and get video details",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) {
            return reply('*Please provide search words!*\n\nExample: .yts Alan Walker Faded');
        }

        const { default: yts } = await import('yt-search');
        const search = await yts(text);

        if (!search.videos || !search.videos.length) {
            return reply('*No results found!*');
        }

        const results = search.videos.slice(0, 10);

        let mesaj = `*╭┈───〔 ${toSmallCaps('YouTube Search')} 〕┈───⊷*
*├▢ 🔎 Query:* ${text}
*├▢ 📊 Results:* ${search.videos.length}
*╰───────────────────⊷*

`;

        results.forEach((video, i) => {
            mesaj += `*${i + 1}. ${video.title}*
*├▢ 🔗 URL:* ${video.url}
*├▢ ⏱️ Duration:* ${video.timestamp}
*├▢ 👀 Views:* ${video.views?.toLocaleString() || 'N/A'}
*├▢ 👤 Channel:* ${video.author?.name || 'Unknown'}
*╰───────────────────⊷*

`;
        });

        mesaj += `*╭───⬡ ${toSmallCaps('Powered By')} ⬡ ───*
*┋ ⬡ ${toSmallCaps('ERFAN-MD')}*
*╰───────────────────⊷*`;

        await conn.sendMessage(from, {
            text: mesaj.trim()
        }, { quoted: mek });

    } catch (e) {
        console.error('Error in yts command:', e);
        reply(`*Error occurred while searching!*\n\`\`\`${e.message}\`\`\``);
    }
});
