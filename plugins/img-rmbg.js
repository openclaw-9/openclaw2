// ==================== REMOVE BG COMMANDS ====================
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to upload image to Uguu
async function uploadToUguu(buffer, mimetype) {
    try {
        const form = new FormData();
        form.append('files[]', buffer, {
            filename: `image_${Date.now()}.${mimetype.split('/')[1] || 'jpg'}`,
            contentType: mimetype,
        });
        
        const response = await axios.post('https://uguu.se/upload.php', form, {
            headers: {
                ...form.getHeaders(),
            },
            timeout: 30000,
        });
        
        if (response.data && response.data.files && response.data.files[0]) {
            return response.data.files[0].url;
        }
        
        // Fallback to another upload service if Uguu fails
        const catboxForm = new FormData();
        catboxForm.append('reqtype', 'fileupload');
        catboxForm.append('fileToUpload', buffer, {
            filename: `image_${Date.now()}.${mimetype.split('/')[1] || 'jpg'}`,
            contentType: mimetype,
        });
        
        const catboxResponse = await axios.post('https://catbox.moe/user/api.php', catboxForm, {
            headers: {
                ...catboxForm.getHeaders(),
            },
            timeout: 30000,
        });
        
        if (catboxResponse.data && typeof catboxResponse.data === 'string') {
            return catboxResponse.data;
        }
        
        throw new Error('Failed to upload image');
    } catch (error) {
        console.error('Upload Error:', error);
        throw error;
    }
}

cmd({
    pattern: "removebg",
    alias: ["nobg1", "rmbg1", "rbg"],
    desc: "Remove background from image (v1)",
    category: "tools",
    react: "🎨",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        
        if (!/image/.test(mime)) {
            return reply("📸 *Please reply to an image!*\n\n> *Usage:* Reply to an image with .removebg");
        }
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        // Download the image
        const mediaBuffer = await q.download();
        
        if (!mediaBuffer) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ *Failed to download image!*");
        }
        
        // Upload image to get URL
        const imageUrl = await uploadToUguu(mediaBuffer, mime);
        const encodedUrl = encodeURIComponent(imageUrl);
        
        // Call removebg API
        const apiUrl = `https://api.nexray.web.id/tools/removebg?url=${encodedUrl}`;
        const response = await axios.get(apiUrl, { 
            responseType: 'arraybuffer',
            timeout: 60000,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });
        
        if (!response.data || response.data.length === 0) {
            throw new Error('Empty response from API');
        }
        
        // Send processed image
        await conn.sendMessage(from, { 
            image: Buffer.from(response.data), 
            caption: "*✅ Background Removed*\n> *🚀 Powered by ERFAN-MD*"
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        
    } catch (e) {
        console.error('RemoveBG Error:', e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        
        let errorMsg = e.message || 'Unknown error';
        
        if (e.response) {
            if (e.response.status === 404) {
                errorMsg = 'API endpoint not found';
            } else if (e.response.status === 413) {
                errorMsg = 'Image too large (max 10MB)';
            } else if (e.response.status === 429) {
                errorMsg = 'Rate limit exceeded. Try again later';
            }
        }
        
        reply(`❌ *Error: ${errorMsg}*`);
    }
});

// ==================== REMOVE BG V2 COMMANDS (Direct API) ====================
cmd({
    pattern: "removebg2",
    alias: ["nobg2", "rmbg2", "rb2"],
    desc: "Remove background from image (v2 - Direct API)",
    category: "tools",
    react: "🖼️",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        
        if (!/image/.test(mime)) {
            return reply("📸 *Please reply to an image!*\n\n> *Usage:* Reply to an image with .removebg2");
        }
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        // Download the image
        const mediaBuffer = await q.download();
        
        if (!mediaBuffer) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ *Failed to download image!*");
        }
        
        // Direct API call with buffer
        const apiUrl = 'https://api.nexray.web.id/tools/removebg';
        
        const form = new FormData();
        form.append('image', mediaBuffer, {
            filename: `image_${Date.now()}.jpg`,
            contentType: mime,
        });
        
        const response = await axios.post(apiUrl, form, {
            headers: {
                ...form.getHeaders(),
            },
            responseType: 'arraybuffer',
            timeout: 60000,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });
        
        if (!response.data || response.data.length === 0) {
            throw new Error('Empty response from API');
        }
        
        // Send processed image
        await conn.sendMessage(from, { 
            image: Buffer.from(response.data), 
            caption: "*✅ Background Removed (v2)*\n> *🚀 Powered by ERFAN-MD*"
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        
    } catch (e) {
        console.error('RemoveBG v2 Error:', e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        
        let errorMsg = e.message || 'Unknown error';
        
        if (e.response) {
            if (e.response.status === 404) {
                errorMsg = 'API endpoint not found';
            } else if (e.response.status === 413) {
                errorMsg = 'Image too large (max 10MB)';
            } else if (e.response.status === 429) {
                errorMsg = 'Rate limit exceeded. Try again later';
            }
        }
        
        reply(`❌ *Error: ${errorMsg}*`);
    }
});

// ==================== REMOVE BG V3 COMMANDS (Alternative API) ====================
cmd({
    pattern: "removebg3",
    alias: ["nobg3", "rmbg3", "rb3"],
    desc: "Remove background from image (v3 - Alternative API)",
    category: "tools",
    react: "✨",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        
        if (!/image/.test(mime)) {
            return reply("📸 *Please reply to an image!*\n\n> *Usage:* Reply to an image with .removebg3");
        }
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        // Download the image
        const mediaBuffer = await q.download();
        
        if (!mediaBuffer) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ *Failed to download image!*");
        }
        
        // Convert buffer to base64
        const base64Image = mediaBuffer.toString('base64');
        
        // Alternative API using base64
        const apiUrl = 'https://api.nexray.web.id/tools/removebg-base64';
        
        const response = await axios.post(apiUrl, {
            image: base64Image,
        }, {
            responseType: 'arraybuffer',
            timeout: 60000,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });
        
        if (!response.data || response.data.length === 0) {
            throw new Error('Empty response from API');
        }
        
        // Send processed image
        await conn.sendMessage(from, { 
            image: Buffer.from(response.data), 
            caption: "*✅ Background Removed (v3)*\n> *🚀 Powered by ERFAN-MD*"
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        
    } catch (e) {
        console.error('RemoveBG v3 Error:', e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        
        reply(`❌ *Error: ${e.message}*`);
    }
});
