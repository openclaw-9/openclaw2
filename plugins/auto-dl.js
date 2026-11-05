// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
import config from '../config.js';
import axios from 'axios';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global variable to track auto-downloader status - starts DISABLED
let autoDownloaderEnabled = false;

// ---------- COMMAND TO TOGGLE AUTO-DOWNLOADER ----------

cmd({
    pattern: "autodownload",
    alias: ["autodl", "ad"],
    desc: "Toggle auto downloader on/off",
    category: "download",
    filename: __filename
}, async (client, message, store, {
    from,
    reply,
    args,
    isCreator,
    isGroup
}) => {
    try {
        if (!isCreator) {
            return reply("❌ *Only bot owner can use this command!*");
        }

        if (args[0]) {
            const action = args[0].toLowerCase();
            
            if (action === "on" || action === "enable" || action === "true") {
                autoDownloaderEnabled = true;
                return reply("✅ *Auto Downloader has been ENABLED!*\n\n📱 Now bot will automatically download from:\n• YouTube\n• Instagram\n• TikTok\n• Facebook\n• GitHub\n• MediaFire\n• Mega");
            }
            else if (action === "off" || action === "disable" || action === "false") {
                autoDownloaderEnabled = false;
                return reply("❌ *Auto Downloader has been DISABLED!*\n\n🚫 Bot will no longer auto-download links.");
            }
            else {
                return reply("❓ *Invalid option!*\n\nUsage:\n• `autodl on` - Enable auto downloader\n• `autodl off` - Disable auto downloader\n• `autodl` - Check current status");
            }
        } else {
            const status = autoDownloaderEnabled ? "✅ ENABLED" : "❌ DISABLED";
            const platforms_list = autoDownloaderEnabled ? 
                "\n\n📱 *Supported Platforms:*\n• YouTube\n• Instagram\n• TikTok\n• Facebook\n• GitHub\n• MediaFire\n• Mega" : 
                "\n\n🚫 *No platforms active*";
            
            return reply(`🤖 *Auto Downloader Status:* ${status}${platforms_list}\n\n*Usage:*\n• \`autodl on\` - Enable\n• \`autodl off\` - Disable`);
        }
    } catch (error) {
        console.error("[AUTODL-CMD] Error:", error);
        reply("❌ *Error occurred while toggling auto downloader!*");
    }
});

// ---------- ROBUST URL DETECTOR ----------

function detectPlatform(text) {
    if (!text || typeof text !== 'string') return null;
    
    // YouTube
    const yt = text.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i);
    if (yt) return { platform: 'youtube', url: normalizeUrl(yt[0]) };
    
    // Instagram - ANY instagram.com or instagr.am link
    const ig = text.match(/(?:https?:\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/[^\s]+/i);
    if (ig) return { platform: 'instagram', url: normalizeUrl(ig[0]) };
    
    // TikTok - ANY tiktok domain
    const tt = text.match(/(?:https?:\/\/)?(?:www\.)?(?:tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com|m\.tiktok\.com)\/[^\s]+/i);
    if (tt) return { platform: 'tiktok', url: normalizeUrl(tt[0]) };
    
    // Facebook
    const fb = text.match(/(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.watch|fb\.com|m\.facebook\.com)\/[^\s]+/i);
    if (fb) return { platform: 'facebook', url: normalizeUrl(fb[0]) };
    
    // GitHub
    const gh = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s]+/i);
    if (gh) return { platform: 'github', url: normalizeUrl(gh[0]) };
    
    // MediaFire
    const mf = text.match(/(?:https?:\/\/)?(?:www\.)?mediafire\.com\/[^\s]+/i);
    if (mf) return { platform: 'mediafire', url: normalizeUrl(mf[0]) };
    
    // Mega
    const mg = text.match(/(?:https?:\/\/)?mega\.nz\/[^\s]+/i);
    if (mg) return { platform: 'mega', url: normalizeUrl(mg[0]) };
    
    return null;
}

function normalizeUrl(url) {
    url = url.trim();
    // Remove trailing punctuation that might be caught by regex
    url = url.replace(/[.,;!?]+$/, '');
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    return url;
}

const createCaption = () => {
    return `> *© ${config.BOT_NAME} Auto Downloader*`;
};

// ---------- MAIN AUTO-DOWNLOAD HANDLER (BODY LISTENER) ----------

cmd({
    on: "body",
    dontAddCommandList: true,
    filename: __filename
}, async (client, message, store, {
    from,
    body,
    isGroup,
    isAdmins,
    isBotAdmins,
    isCreator,
    reply,
    sender
}) => {
    try {
        if (!autoDownloaderEnabled) return;
        
        // DEBUG: Log every message body so you can see what's happening
        console.log("[AUTO-DL] Body received:", body);
        
        if (!body || typeof body !== 'string') {
            console.log("[AUTO-DL] Empty or invalid body, skipping");
            return;
        }

        const detected = detectPlatform(body);
        
        if (!detected) {
            console.log("[AUTO-DL] No platform URL detected in body");
            return;
        }

        console.log(`[AUTO-DL] Detected ${detected.platform}: ${detected.url}`);

        const caption = createCaption();
        
        await client.sendMessage(from, { react: { text: '⏳', key: message.key } });

        try {
            await handleApiDownload(client, from, detected.url, detected.platform, caption, message);
            await client.sendMessage(from, { react: { text: '✅', key: message.key } });
        } catch (apiError) {
            console.error(`[AUTO-DL] Error for ${detected.platform}:`, apiError.message);
            await client.sendMessage(from, { react: { text: '❌', key: message.key } });
        }

    } catch (error) {
        console.error("[AUTO-DL] Main error:", error);
    }
});

// ---------- API DISPATCHER ----------

async function handleApiDownload(client, from, url, platformType, caption, message) {
    try {
        switch (platformType) {
            case "instagram":
                return await handleInstagram(client, from, url, caption, message);
            case "tiktok":
                return await handleTikTok(client, from, url, caption, message);
            case "youtube":
                return await handleYouTube(client, from, url, caption, message);
            case "facebook":
                return await handleFacebook(client, from, url, caption, message);
            case "github":
                return await handleGitHub(client, from, url, caption, message);
            case "mediafire":
                return await handleMediaFire(client, from, url, caption, message);
            case "mega":
                return await handleMega(client, from, url, caption, message);
            default:
                throw new Error("Unsupported platform");
        }
    } catch (error) {
        console.error(`[AUTO-DL] API error for ${platformType}:`, error.message);
        throw error;
    }
}

// ---------- YOUTUBE HANDLER ----------

async function handleYouTube(client, from, url, caption, message) {
    try {
        const apiUrl = `https://api.deline.web.id/downloader/youtube?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { timeout: 60000 });
        
        if (!response.data?.status || !response.data?.result) {
            throw new Error("Failed to fetch YouTube video");
        }

        const result = response.data.result;
        const medias = result.medias || [];
        
        if (medias.length === 0) {
            throw new Error("No media streams found");
        }

        let selectedMedia = null;
        selectedMedia = medias.find(m => m.formatId === 18 && m.url);
        if (!selectedMedia) {
            selectedMedia = medias.find(m => m.type === 'video' && m.ext === 'mp4' && m.audioQuality && m.url);
        }
        if (!selectedMedia) {
            selectedMedia = medias.find(m => m.type === 'video' && m.url);
        }
        if (!selectedMedia) {
            selectedMedia = medias.find(m => m.url);
        }
        
        if (!selectedMedia || !selectedMedia.url) {
            throw new Error("No downloadable URL found");
        }

        const videoUrl = selectedMedia.url;
        const qualityLabel = selectedMedia.label || selectedMedia.quality || 'default';
        const title = result.title || 'YouTube Video';
        const finalCaption = `*${title}*\n*Quality:* ${qualityLabel}\n\n${caption}`;

        await client.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: finalCaption
        }, { quoted: message });

    } catch (error) {
        console.error("[AUTO-DL] YouTube error:", error.message);
        throw error;
    }
}

// ---------- INSTAGRAM HANDLER (Working API) ----------

async function handleInstagram(client, from, url, caption, message) {
    try {
        console.log("[AUTO-DL] Instagram downloading:", url);
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/down/insta?url=${encodeURIComponent(url)}`;
        const { data } = await axios.get(apiUrl, { timeout: 30000 });
        
        console.log("[AUTO-DL] Instagram API response:", data.status);
        
        if (!data || data.status !== "success" || !data.data || !data.data.url) {
            throw new Error("Failed to fetch Instagram media");
        }

        const media = data.data;
        const finalCaption = `🎬 *INSTAGRAM DOWNLOADER*\n📦 *Type:* ${media.type || 'Unknown'}\n\n${caption}`;

        if (media.type === "video") {
            await client.sendMessage(from, {
                video: { url: media.url },
                caption: finalCaption,
                mimetype: 'video/mp4'
            }, { quoted: message });
        } else {
            await client.sendMessage(from, {
                image: { url: media.url },
                caption: finalCaption,
                mimetype: 'image/jpeg'
            }, { quoted: message });
        }
    } catch (error) {
        console.error("[AUTO-DL] Instagram error:", error.message);
        throw error;
    }
}

// ---------- TIKTOK HANDLER (Working API) ----------

async function handleTikTok(client, from, url, caption, message) {
    try {
        console.log("[AUTO-DL] TikTok downloading:", url);
        const apiUrl = `https://tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
        const { data } = await axios.get(apiUrl, { timeout: 20000 });
        
        console.log("[AUTO-DL] TikTok API response code:", data?.code);
        
        if (!data || data.code !== 0 || !data.data) {
            throw new Error("Failed to fetch TikTok video");
        }

        const res = data.data;
        const title = res.title || 'TikTok Video';
        const uploader = res.author?.nickname || res.author?.unique_id || 'Unknown';
        const finalCaption = `🎵 *TIKTOK DOWNLOADER*\n📝 *Title:* ${title}\n👤 *Author:* ${uploader}\n\n${caption}`;

        // If it's a slideshow (images)
        if (Array.isArray(res.images) && res.images.length > 0) {
            let total = res.images.length;
            let index = 1;

            for (const img of res.images) {
                await client.sendMessage(from, {
                    image: { url: img },
                    caption: `🖼️ *Slide ${index} / ${total}*\n\n${finalCaption}`
                }, { quoted: message });
                index++;
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
            return;
        }

        // If it's a video
        if (res.play) {
            await client.sendMessage(from, {
                video: { url: res.play },
                mimetype: 'video/mp4',
                caption: finalCaption
            }, { quoted: message });
        } else {
            throw new Error("No video or images found");
        }
    } catch (error) {
        console.error("[AUTO-DL] TikTok error:", error.message);
        throw error;
    }
}

// ---------- FACEBOOK HANDLER ----------

async function handleFacebook(client, from, url, caption, message) {
    try {
        const apiUrl = `https://api.nexray.eu.cc/downloader/facebook?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        
        if (!response.data?.status || !response.data.result) {
            throw new Error("Failed to fetch Facebook video");
        }

        const result = response.data.result;
        const videoUrl = result.video_hd || result.video_sd || result.url || result.download_url;
        
        if (!videoUrl) {
            throw new Error("No video URL found");
        }

        const finalCaption = result.title ? `*${result.title}*\n\n${caption}` : caption;
        
        await client.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: finalCaption
        }, { quoted: message });
    } catch (error) {
        console.error("[AUTO-DL] Facebook error:", error.message);
        throw error;
    }
}

// ---------- GITHUB HANDLER ----------

async function handleGitHub(client, from, url, caption, message) {
    try {
        const apiUrl = `https://api.nexray.eu.cc/downloader/github?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        
        if (!response.data?.status || !response.data.result) {
            throw new Error("Failed to fetch GitHub repository");
        }

        const result = response.data.result;
        const downloadUrl = result.url || result.download_url;
        const filename = result.filename || 'github-repo.zip';
        
        if (!downloadUrl) {
            throw new Error("No download URL found");
        }

        const finalCaption = `*📁 ${result.repo || 'Repository'}*\n*Branch:* ${result.branch || 'main'}\n*File:* ${filename}\n\n${caption}`;
        
        await client.sendMessage(from, {
            document: { url: downloadUrl },
            fileName: filename,
            mimetype: 'application/zip',
            caption: finalCaption
        }, { quoted: message });
    } catch (error) {
        console.error("[AUTO-DL] GitHub error:", error.message);
        throw error;
    }
}

// ---------- MEDIAFIRE HANDLER ----------

async function handleMediaFire(client, from, url, caption, message) {
    try {
        const apiUrl = `https://api.nexray.eu.cc/downloader/mediafire?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        
        if (!response.data?.status || !response.data.result) {
            throw new Error("Failed to fetch MediaFire file");
        }

        const result = response.data.result;
        const downloadUrl = result.download_url || result.url;
        const filename = result.filename || 'mediafire-file';
        const mimetype = result.mimetype || 'application/octet-stream';
        
        if (!downloadUrl) {
            throw new Error("No download URL found");
        }

        const finalCaption = `*📎 ${filename}*\n*Size:* ${result.filesize || 'Unknown'}\n*Type:* ${mimetype}\n\n${caption}`;
        
        if (mimetype.startsWith('image/')) {
            await client.sendMessage(from, {
                image: { url: downloadUrl },
                caption: finalCaption
            }, { quoted: message });
        } else if (mimetype.startsWith('video/')) {
            await client.sendMessage(from, {
                video: { url: downloadUrl },
                caption: finalCaption
            }, { quoted: message });
        } else {
            await client.sendMessage(from, {
                document: { url: downloadUrl },
                fileName: filename,
                mimetype: mimetype,
                caption: finalCaption
            }, { quoted: message });
        }
    } catch (error) {
        console.error("[AUTO-DL] MediaFire error:", error.message);
        throw error;
    }
}

// ---------- MEGA HANDLER ----------

async function handleMega(client, from, url, caption, message) {
    try {
        const apiUrl = `https://api.nexray.eu.cc/downloader/mega?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        
        if (!response.data?.status || !response.data.result) {
            throw new Error("Failed to fetch Mega file");
        }

        const result = response.data.result;
        const downloadUrl = result.download_url || result.url;
        const filename = result.filename || 'mega-file';
        const mimetype = result.mimetype || 'application/octet-stream';
        
        if (!downloadUrl) {
            throw new Error("No download URL found");
        }

        const finalCaption = `*☁️ ${filename}*\n*Size:* ${result.filesize || 'Unknown'}\n*Type:* ${mimetype}\n\n${caption}`;
        
        if (mimetype.startsWith('image/')) {
            await client.sendMessage(from, {
                image: { url: downloadUrl },
                caption: finalCaption
            }, { quoted: message });
        } else if (mimetype.startsWith('video/')) {
            await client.sendMessage(from, {
                video: { url: downloadUrl },
                caption: finalCaption
            }, { quoted: message });
        } else {
            await client.sendMessage(from, {
                document: { url: downloadUrl },
                fileName: filename,
                mimetype: mimetype,
                caption: finalCaption
            }, { quoted: message });
        }
    } catch (error) {
        console.error("[AUTO-DL] Mega error:", error.message);
        throw error;
    }
}

console.log("[AUTO-DL] Auto Downloader Plugin Loaded - DISABLED by default (use .autodl on to enable) ✓");
