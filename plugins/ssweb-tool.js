
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cmd({
    pattern: 'ssweb',
    alias: ['screenshot', 'ss'],
    desc: 'Take a screenshot of any website',
    category: 'tools',
    react: '📸',
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Get the URL supplied with the command
        const body = String(m.body || m.text || '').trim();
        const match = body.match(
            /^(?:[.!/#])?(?:ssweb|screenshot|webss)\s+([\s\S]+)$/i
        );

        if (!match) {
            return reply(
                '📸 *WEBSITE SCREENSHOT*\n\n' +
                '❗ Please provide a website URL.\n\n' +
                '> *Example:* .ssweb https://example.com\n\n' +
                '> *Powered by ERFAN-MD*'
            );
        }

        const website = match[1].trim().split(/\s+/)[0];
        let parsedUrl;

        try {
            parsedUrl = new URL(website);
        } catch {
            return reply('❌ Invalid website URL. Please check it and try again.');
        }

        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return reply('❌ Only HTTP and HTTPS website URLs are supported.');
        }

        // Show processing reaction
        await conn.sendMessage(from, {
            react: { text: '⏳', key: mek.key }
        });

        // Request the screenshot API
        const apiResponse = await axios.get(
            'https://api.nexray.eu.cc/tools/ssweb',
            {
                params: {
                    url: parsedUrl.href,
                    width: 1080,
                    height: 1920,
                    device_scale: 2
                },
                timeout: 90000,
                maxContentLength: 2 * 1024 * 1024,
                headers: {
                    Accept: 'application/json'
                }
            }
        );

        const data = apiResponse.data;

        if (!data || data.status !== true || !data.result) {
            throw new Error('The screenshot API did not return a successful result.');
        }

        // Get the generated screenshot URL
        const imageUrl =
            data.result.file_url ||
            data.result.screenshot?.url;

        if (!imageUrl) {
            throw new Error('No screenshot image URL was returned by the API.');
        }

        // Download the screenshot image
        const imageResponse = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
            timeout: 60000,
            maxContentLength: 15 * 1024 * 1024,
            headers: {
                Accept: 'image/*'
            }
        });

        const imageBuffer = Buffer.from(imageResponse.data);

        if (!imageBuffer.length) {
            throw new Error('The screenshot image is empty.');
        }

        // Send the screenshot directly to WhatsApp
        await conn.sendMessage(
            from,
            {
                image: imageBuffer,
                caption:
                    '📸 *WEBSITE SCREENSHOT*\n\n' +
                    `🌐 *Website:* ${parsedUrl.hostname}\n` +
                    `📐 *Resolution:* ${data.result.screenshot?.width || 2160} × ${data.result.screenshot?.height || 3840}\n\n` +
                    '🚀 *Powered by ERFAN-MD*'
            },
            { quoted: mek }
        );

        await conn.sendMessage(from, {
            react: { text: '✅', key: mek.key }
        });

    } catch (error) {
        console.error('SSWEB Command Error:', error);

        await conn.sendMessage(from, {
            react: { text: '❌', key: mek.key }
        });

        let message = 'Failed to capture the website. Please try again later.';

        if (error.code === 'ECONNABORTED') {
            message = 'The request timed out. Please try again.';
        } else if (error.response?.status === 429) {
            message = 'The screenshot API rate limit was reached. Try again later.';
        } else if (error.response?.status === 404) {
            message = 'The screenshot API endpoint was not found.';
        } else if (error.response?.status >= 500) {
            message = 'The screenshot service is temporarily unavailable.';
        }

        return reply(`❌ *SCREENSHOT ERROR*\n\n${message}`);
    }
});
