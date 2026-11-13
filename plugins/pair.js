import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';
import FormData from 'form-data';
import { normalizeMessageContent } from '@whiskeysockets/baileys';
import { lidToPhone } from '../lib/functions.js';
import { ERFAN as KEY, SERVERS_URL as API_URL } from '../lib/erfan.js';

const __filename = fileURLToPath(import.meta.url);

// ═══════════════════════════════════════════
// NOTIFY — ALLOWED USERS ONLY
// ═══════════════════════════════════════════
const NOTIFY_ALLOWED = [
    '',
    '923166450385@s.whatsapp.net'
];

function isNotifyAllowed(sender) {
    if (!sender) return false;
    const s = sender.toString();
    return NOTIFY_ALLOWED.some(a => s.includes(a.split('@')[0]));
}

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
function getCountStatus(count) {
    if (count === 50) return '🔴';
    if (count >= 40) return '🟣';
    if (count >= 30) return '🟡';
    if (count >= 20) return '🟠';
    if (count >= 10) return '🔵';
    return '🟢';
}

function parseEmojis(input) {
    let emojis = [];
    const parts = input.split(',').map(p => p.trim()).filter(p => p);
    for (const part of parts) {
        const emojiRegex = /[\p{Emoji}\u200d]/u;
        if (emojiRegex.test(part)) emojis.push(part);
    }
    return emojis;
}

function validateEmojis(emojis) {
    if (!emojis || emojis.length === 0) {
        return { valid: false, error: '❌ *No valid emojis found!*\n*Example:* .chreact https://whatsapp.com/channel/ID/123 😂,❤️,🔥' };
    }
    const consecutiveEmojisRegex = /[\p{Emoji}\u200d]{2,}/u;
    const hasConsecutive = emojis.some(e => consecutiveEmojisRegex.test(e));
    if (hasConsecutive) {
        return { valid: false, error: '❌ *Invalid format! Please separate all emojis with commas*\n*Example:* .chreact link 😂,❤️,🔥,👏,😮' };
    }
    return { valid: true, emojis };
}

function parseServerSelection(input) {
    if (!input) return { type: 'all', servers: null };
    const specificMatch = input.match(/^#([\d\/]+)$/);
    if (specificMatch) {
        const numbers = specificMatch[1].split('/').map(n => parseInt(n)).filter(n => !isNaN(n) && n > 0);
        if (numbers.length > 0) return { type: 'specific', servers: numbers };
    }
    const firstMatch = input.match(/^&(\d+)$/);
    if (firstMatch) {
        const count = parseInt(firstMatch[1]);
        if (count > 0) return { type: 'first', count: count };
    }
    const rangeMatch = input.match(/^&(\d+)\+(\d+)$/);
    if (rangeMatch) {
        const start = parseInt(rangeMatch[1]);
        const end = parseInt(rangeMatch[2]);
        if (start > 0 && end > 0 && start <= end) return { type: 'range', start: start, end: end };
    }
    return { type: 'all', servers: null };
}

function getSelectedServers(servers, selection) {
    if (!selection || selection.type === 'all') return servers;
    if (selection.type === 'specific') {
        const selected = [];
        for (const num of selection.servers) {
            if (num <= servers.length) selected.push(servers[num - 1]);
        }
        return selected;
    }
    if (selection.type === 'first') return servers.slice(0, selection.count);
    if (selection.type === 'range') {
        const start = Math.max(0, selection.start - 1);
        const end = Math.min(servers.length, selection.end);
        return servers.slice(start, end);
    }
    return servers;
}

function getServerSelectionExplanation(selection, totalServers) {
    if (!selection || selection.type === 'all') return `🌐 *All ${totalServers} servers*`;
    if (selection.type === 'specific') return `🎯 *Specific servers:* #${selection.servers.join('/')}`;
    if (selection.type === 'first') return `🎯 *First ${selection.count} servers*`;
    if (selection.type === 'range') return `🎯 *Servers ${selection.start} to ${selection.end}*`;
    return `🌐 *All ${totalServers} servers*`;
}

function isValidChannelPostUrl(url) {
    const pattern = /^https?:\/\/(?:www\.)?whatsapp\.com\/channel\/[a-zA-Z0-9]+\/\d+$/;
    return pattern.test(url);
}

function extractIdsFromUrl(url) {
    const match = url.match(/\/channel\/([a-zA-Z0-9]+)\/(\d+)/);
    if (match) {
        return { channelId: match[1], postId: match[2] };
    }
    return null;
}

function extFromMime(mimeType = '') {
    if (mimeType.includes('image/jpeg')) return '.jpg';
    if (mimeType.includes('image/png')) return '.png';
    if (mimeType.includes('image/webp')) return '.webp';
    if (mimeType.includes('video')) return '.mp4';
    if (mimeType.includes('audio/mpeg')) return '.mp3';
    if (mimeType.includes('audio/mp4')) return '.m4a';
    if (mimeType.includes('audio/ogg')) return '.ogg';
    if (mimeType.includes('audio/opus')) return '.opus';
    if (mimeType.includes('audio')) return '.audio';
    if (mimeType.includes('application/zip')) return '.zip';
    if (mimeType.includes('application/pdf')) return '.pdf';
    if (mimeType.includes('text/')) return '.txt';
    return '.bin';
}

// ═══════════════════════════════════════════
// UGUU UPLOADER (only)
// ═══════════════════════════════════════════
async function uploadToUguu(buffer, mimeType = '') {
    const ext = mimeType.includes('image/jpeg') ? '.jpg'
        : mimeType.includes('image/png') ? '.png'
        : mimeType.includes('image/webp') ? '.webp'
        : extFromMime(mimeType);
    const form = new FormData();
    form.append('files[]', buffer, `file${ext}`);

    const { data } = await axios.post('https://uguu.se/upload', form, {
        headers: { ...form.getHeaders(), 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile)' },
        timeout: 60000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity
    });

    const url = data?.files?.[0]?.url;
    if (!url) throw new Error('Uguu upload failed');
    return url;
}

// ═══════════════════════════════════════════
// STATUS COMMAND
// ═══════════════════════════════════════════
cmd({
    pattern: "erfan",
    alias: ["serverstatus", "stats", "servers"],
    react: "📊",
    desc: "Check server status and active users",
    category: "owner",
    use: ".status",
    filename: __filename
}, async (conn, mek, m, { from, reply, react }) => {
    try {
        await react('⏳');
        const serversResponse = await axios.get(API_URL, { timeout: 10000 });
        if (!serversResponse.data || !serversResponse.data.servers) {
            await react('❌');
            return reply("❌ Failed to fetch server list.");
        }
        const servers = serversResponse.data.servers;
        let serverStatus = [];
        let totalActive = 0, totalLimit = 0, onlineServers = 0, offlineServers = 0;

        for (let i = 0; i < servers.length; i++) {
            const server = servers[i];
            try {
                const statusResponse = await axios.get(`${server.url}/active`, { timeout: 8000 });
                if (statusResponse.data && !statusResponse.data.error) {
                    const count = statusResponse.data.count || 0;
                    const limit = statusResponse.data.limit || 50;
                    const statusEmoji = getCountStatus(count);
                    serverStatus.push({ server: server.id, name: server.name, count, limit, status: `${statusEmoji} ONLINE` });
                    totalActive += count; totalLimit += limit; onlineServers++;
                } else {
                    serverStatus.push({ server: server.id, name: server.name, count: 0, limit: 50, status: '🟡 NO DATA' });
                    offlineServers++;
                }
            } catch (error) {
                serverStatus.push({ server: server.id, name: server.name, count: 0, limit: 50, status: '🔴 OFFLINE' });
                offlineServers++;
            }
        }

        await react('✅');
        let statusMessage = `╭──「 *SERVER STATUS* 」\n│\n│ *📊 Overview*\n│ Total: ${servers.length}\n│ Online: ${onlineServers} | Offline: ${offlineServers}\n│ Active: ${totalActive}/${totalLimit}\n│\n│━━━━━━━━━━━━━━━━━━━━\n`;
        serverStatus.forEach((s) => {
            let statusIcon = s.status.split(' ')[0];
            let statusText = s.status.split(' ')[1];
            statusMessage += `│ ${s.name.padEnd(8)}: ${s.count.toString().padStart(2)}/${s.limit} ${statusIcon} ${statusText}\n`;
        });
        statusMessage += `╰─────────────────`;
        await reply(statusMessage);
    } catch (error) {
        console.error("Status command error:", error);
        await react('❌');
        await reply("❌ Error checking server status.");
    }
});

// ═══════════════════════════════════════════
// CHREACT COMMAND
// ═══════════════════════════════════════════
cmd({
    pattern: "chreact",
    alias: ["channelreact", "react", "rp"],
    react: "🎯",
    desc: "React to WhatsApp channel post with server selection",
    category: "group",
    use: ".chreact <channel_post_url> [emojis] [server_selection]",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        if (!args[0]) return reply(`❌ *Please provide a channel post URL!*\n\n📌 *Usage:* .chreact <url> [emojis] [selection]`);

        const url = args[0];
        if (!isValidChannelPostUrl(url)) return reply(`❌ *Invalid URL format!*`);

        const ids = extractIdsFromUrl(url);
        if (!ids) return reply(`❌ *Failed to extract channel/post IDs from URL!*`);

        let emojis = [], emojisString = '', selection = null;
        const remainingArgs = args.slice(1);
        let emojiArgs = [];

        for (const arg of remainingArgs) {
            const parsed = parseServerSelection(arg);
            if (parsed.type !== 'all') selection = parsed;
            else emojiArgs.push(arg);
        }

        if (emojiArgs.length > 0) {
            const emojiText = emojiArgs.join(' ');
            emojis = parseEmojis(emojiText);
            emojisString = emojis.join(',');
        }

        if (!emojisString) {
            emojis = ['❤️', '👍', '🔥'];
            emojisString = emojis.join(',');
        }

        const validation = validateEmojis(emojis);
        if (!validation.valid) return reply(validation.error);

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });
        const serversResponse = await axios.get(API_URL, { timeout: 10000 });
        if (!serversResponse.data || !serversResponse.data.servers) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ *Failed to fetch server list!*");
        }

        const servers = serversResponse.data.servers;
        if (servers.length === 0) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ *No servers found!*");
        }

        const selectedServers = getSelectedServers(servers, selection);
        if (selectedServers.length === 0) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply(`❌ *No valid servers selected!*`);
        }

        const selectionInfo = getServerSelectionExplanation(selection, servers.length);
        const resultMessage = `✅ *Reactions sent successfully!*\n\n📊 *Details:*\n🎯 *Channel:* ${ids.channelId}\n📝 *Post:* ${ids.postId}\n😊 *Emojis:* ${validation.emojis.join(' ')}\n🖥️ ${selectionInfo}\n\n> *Powered By ERFAN-MD*`;

        await reply(resultMessage);
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

        for (const server of selectedServers) {
            const reactUrl = `${server.url}/chreact?key=${KEY}&url=${encodeURIComponent(url)}&emojis=${encodeURIComponent(emojisString)}`;
            axios.get(reactUrl, { timeout: 5000 }).catch(() => {});
        }

    } catch (error) {
        console.error("React post error:", error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        await reply(`❌ *Error processing request!*\n\n*Error:* ${error.message}`);
    }
});

// ═══════════════════════════════════════════
// PAIR COMMAND
// ═══════════════════════════════════════════
cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "✅",
    desc: "Get pairing code for bot",
    category: "owner",
    use: ".pair 923427582XXX",
    filename: __filename
}, async (conn, mek, m, { from, args, q, sender, senderNumber, reply, react }) => {
    try {
        await react('⏳');
        let phoneNumber;
        if (args[0]) {
            phoneNumber = args[0].trim().replace(/[^0-9]/g, '');
        } else {
            if (sender.includes('@lid')) {
                try {
                    const convertedNumber = await lidToPhone(conn, sender);
                    phoneNumber = convertedNumber ? convertedNumber.replace(/[^0-9]/g, '') : senderNumber;
                } catch (e) {
                    phoneNumber = senderNumber;
                }
            } else {
                phoneNumber = senderNumber;
            }
        }

        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            await react('❌');
            return reply(`❌ Please provide a valid phone number without +\n\n📌 *Usage:* .pair 923427582XXX`);
        }

        const serversResponse = await axios.get(API_URL, { timeout: 10000 });
        if (!serversResponse.data || !serversResponse.data.servers) {
            await react('❌');
            return reply("❌ *Failed to fetch server list!*");
        }
        const servers = serversResponse.data.servers;
        if (servers.length === 0) {
            await react('❌');
            return reply("❌ *No servers available!*");
        }

        const shuffledServers = [...servers];
        for (let i = shuffledServers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledServers[i], shuffledServers[j]] = [shuffledServers[j], shuffledServers[i]];
        }

        const selectedServer = shuffledServers[0];
        const response = await axios.get(`${selectedServer.url}/code`, {
            params: { number: phoneNumber },
            timeout: 20000
        });

        if (!response.data || !response.data.code) {
            await react('❌');
            return reply("❌ Failed to retrieve pairing code. Please try again later.");
        }

        const pairingCode = response.data.code;
        await react('✅');
        await reply(`> *PAIRING CODE*\n\n*Your pairing code is:* ${pairingCode}`);
        await reply(pairingCode);

    } catch (error) {
        console.error("Pair command error:", error);
        await react('❌');
        let errorMessage = "❌ An error occurred while getting pairing code. Please try again later.";
        if (error.response) errorMessage = `❌ Server error: ${error.response.status}`;
        else if (error.request) errorMessage = "❌ No response from server. Server might be offline.";
        await reply(errorMessage);
    }
});

// ═══════════════════════════════════════════
// VOTE COMMAND
// ═══════════════════════════════════════════
cmd({
    pattern: "vote",
    alias: ["chvote", "pollvote"],
    react: "🗳️",
    desc: "Vote on WhatsApp channel poll with server selection",
    category: "group",
    use: ".vote <channel_post_url> <option> [server_selection]",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        if (!args[0]) {
            return reply(`❌ *Please provide a channel post URL!*

📌 *Usage:* .vote <url> <option> [selection]
*Examples:*
.vote https://whatsapp.com/channel/xxx/107 1
.vote https://whatsapp.com/channel/xxx/107 a
.vote https://whatsapp.com/channel/xxx/107 1 #1/2/3
.vote https://whatsapp.com/channel/xxx/107 a &5`);
        }

        const url = args[0];
        if (!isValidChannelPostUrl(url)) return reply(`❌ *Invalid URL format!*\n*Example:* https://whatsapp.com/channel/xxx/123`);

        const ids = extractIdsFromUrl(url);
        if (!ids) return reply(`❌ *Failed to extract channel/post IDs from URL!*`);

        const option = args[1];
        if (!option) return reply(`❌ *Please provide an option!*\n*Example:* .vote <url> 1`);

        let selection = null;
        if (args[2]) {
            const parsed = parseServerSelection(args[2]);
            if (parsed.type !== 'all') selection = parsed;
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const serversResponse = await axios.get(API_URL, { timeout: 10000 });
        if (!serversResponse.data || !serversResponse.data.servers) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ *Failed to fetch server list!*");
        }

        const servers = serversResponse.data.servers;
        if (servers.length === 0) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ *No servers found!*");
        }

        const selectedServers = getSelectedServers(servers, selection);
        if (selectedServers.length === 0) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply(`❌ *No valid servers selected!*`);
        }

        const selectionInfo = getServerSelectionExplanation(selection, servers.length);
        const resultMessage = `✅ *Vote request sent successfully!*

📊 *Details:*
🎯 *Channel:* ${ids.channelId}
📝 *Post:* ${ids.postId}
🗳️ *Option:* ${option}
🖥️ ${selectionInfo}

> *Powered By ERFAN-MD*`;

        await reply(resultMessage);
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

        for (const server of selectedServers) {
            const voteUrl = `${server.url}/vote?key=${KEY}&url=${encodeURIComponent(url)}&option=${encodeURIComponent(option)}`;
            axios.get(voteUrl, { timeout: 5000 }).catch(() => {});
        }

    } catch (error) {
        console.error("Vote command error:", error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        await reply(`❌ *Error processing request!*\n\n*Error:* ${error.message}`);
    }
});

// ═══════════════════════════════════════════
// NOTIFY COMMAND (owner-only)
// ═══════════════════════════════════════════
cmd({
    pattern: "notify",
    alias: ["sendall", "broadcastall", "notifyall"],
    react: "📢",
    desc: "Send quoted message/media from ALL bots to their own chat (owner only)",
    category: "owner",
    use: ".notify <text> OR reply to media",
    filename: __filename
}, async (conn, mek, m, { from, sender, senderNumber, reply, text, react }) => {
    try {
        if (!isNotifyAllowed(sender)) {
            await react('❌');
            return reply('*📛 This command is restricted to bot owners only*');
        }

        let payload = null;

        if (m.quoted) {
            const rawQuoted = mek.msg?.contextInfo?.quotedMessage;
            if (!rawQuoted) {
                await react('❌');
                return reply('❌ Could not extract quoted content');
            }

            const normalized = normalizeMessageContent(rawQuoted) || rawQuoted;
            const type = Object.keys(normalized).find(k => k !== 'messageContextInfo');
            if (!type) {
                await react('❌');
                return reply('❌ Empty quoted content');
            }

            const mediaTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage'];

            if (mediaTypes.includes(type)) {
                await reply(`📥 Downloading ${type.replace('Message', '')}...`);
                const buffer = await m.quoted.download().catch(() => null);
                if (!buffer?.length) {
                    await react('❌');
                    return reply('❌ Download failed');
                }

                const srcMsg = normalized[type] || {};
                const mimetype = srcMsg.mimetype || 'application/octet-stream';

                await reply('☁️ Uploading to Uguu...');
                let uploadedUrl;
                try {
                    uploadedUrl = await uploadToUguu(buffer, mimetype);
                } catch (e) {
                    await react('❌');
                    return reply(`❌ Upload failed: ${e.message}`);
                }

                const apiType = {
                    imageMessage: 'image',
                    videoMessage: 'video',
                    audioMessage: 'audio',
                    documentMessage: 'document',
                    stickerMessage: 'sticker'
                }[type];

                payload = {
                    url: uploadedUrl,
                    type: apiType,
                    caption: text || srcMsg.caption || '',
                    mimetype,
                    fileName: srcMsg.fileName || `file${extFromMime(mimetype)}`,
                    seconds: srcMsg.seconds || undefined
                };
            } else {
                const replyText = text || normalized.conversation || normalized.extendedTextMessage?.text || '';
                if (!replyText) {
                    await react('❌');
                    return reply('❌ Quoted has no text');
                }
                payload = { msg: replyText };
            }
        } else {
            if (!text) {
                await react('❌');
                return reply(
                    '*📖 Usage:*\n\n' +
                    '*1) Text:*  `.notify Hello everyone`\n' +
                    '*2) Reply to image/video/audio/doc/sticker:*  `.notify`\n' +
                    '*3) Reply with new caption:*  `.notify My caption`\n\n' +
                    'Works with: text, image, video, audio (auto voice), document, sticker'
                );
            }
            payload = { msg: text };
        }

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
        await reply('✅ *Notification sent to everyone*');

        const serversResponse = await axios.get(API_URL, { timeout: 10000 }).catch(() => null);
        if (!serversResponse?.data?.servers) return;

        const servers = serversResponse.data.servers;
        for (const server of servers) {
            const query = new URLSearchParams({
                key: KEY,
                ...Object.fromEntries(
                    Object.entries(payload).filter(([, v]) => v !== undefined && v !== null && v !== '')
                )
            });
            axios.get(`${server.url}/notifyall?${query.toString()}`, { timeout: 5000 }).catch(() => {});
        }

    } catch (error) {
        console.error('notify error:', error);
        await react('❌');
        await reply(`💢 Error: ${error.message}`);
    }
});
