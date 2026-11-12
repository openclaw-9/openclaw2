// ERFAN MD HELPER

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';
import { lidToPhone } from '../lib/functions.js';
import { API_BASE_URL } from '../lib/erfan.js';

const __filename = fileURLToPath(import.meta.url);

// SERVERS_URL is derived from API_BASE_URL in the lib (erfan.js).
// NEVER import missing named exports — one missing export kills the
// whole file at load time and NO command in it gets registered.
const SERVERS_URL = `${API_BASE_URL}/servers`;

// Secret key for chreact and chvote send requests (added directly — lib key was wrong)
const SECRET_KEY = "55";

// ==================== HELPER FUNCTIONS ====================

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

// Fire-and-forget GET request — request bhej deta hai, response ka intezar NAHI karta.
// Har error (timeout, offline server, DNS fail) silently swallow hota hai.
function sendFireAndForget(fullUrl) {
    axios.get(fullUrl, { timeout: 15000 }).catch(() => {});
}

// ==================== STATUS COMMAND ====================
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
        const serversResponse = await axios.get(SERVERS_URL, { timeout: 10000 });
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

// ==================== CHREACT COMMAND ====================
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
        const serversResponse = await axios.get(SERVERS_URL, { timeout: 10000 });
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
        const resultMessage = `✅ *Reactions sent successfully!*\n\n📊 *Details:*\n🎯 *Channel:* ${ids.channelId}\n📝 *Post:* ${ids.postId}\n😊 *Emojis:* ${validation.emojis.join(' ')}\n🖥️ ${selectionInfo}\n\n> *Powered By ERFAN MD*`;

        await reply(resultMessage);
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

        // Send react request on each selected server (FIRE AND FORGET —
        // kisi server ke response ka wait nahi hota, request turant jati hai)
        for (const server of selectedServers) {
            const reactUrl = `${server.url}/chreact?url=${encodeURIComponent(url)}&emojis=${encodeURIComponent(emojisString)}&key=${SECRET_KEY}`;
            sendFireAndForget(reactUrl);
        }

    } catch (error) {
        console.error("React post error:", error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        await reply(`❌ *Error processing request!*\n\n*Error:* ${error.message}`);
    }
});

// ==================== PAIR COMMAND ====================
cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "✅",
    desc: "Get pairing code for ERFAN MD bot",
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

        const serversResponse = await axios.get(SERVERS_URL, { timeout: 10000 });
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
        await reply(`> *ERFAN MD PAIRING CODE*\n\n*Your pairing code is:* ${pairingCode}`);
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

// ==================== VOTE COMMAND ====================
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

╭──「 *🗳️ VOTE COMMAND USAGE* 」
│
│ *Basic Usage:*
│ .vote <channel_post_url> <option> [server_selection]
│
│ *Option formats:*
│ • 1, 2, 3 ...  → option by number
│ • A, B, C, D ... → option by letter
│ • A,C or 1,2   → multi-select (if poll allows)
│ • =Option text → vote by exact option name
│
│ *Server Selection:*
│ • #1/2/3  → Use specific servers
│ • &5      → Use first 5 servers
│ • &6+9    → Use servers 6 to 9
│
│ *Examples:*
│ 1. .vote https://whatsapp.com/channel/xxx/107 1
│ 2. .vote link A
│ 3. .vote link A,C #1/2/3
│ 4. .vote link =ERFAN MD
│ 5. .vote link =ERFAN MD &5
╰─────────────────`);
        }

        const url = args[0];
        if (!isValidChannelPostUrl(url)) return reply(`❌ *Invalid URL format!*\n*Example:* https://whatsapp.com/channel/xxx/123`);

        const ids = extractIdsFromUrl(url);
        if (!ids) return reply(`❌ *Failed to extract channel/post IDs from URL!*`);

        // Collect option text and server selection (ERFAN style)
        let selection = null;
        const optionParts = [];

        for (let i = 1; i < args.length; i++) {
            const parsedSel = parseServerSelection(args[i]);
            if (parsedSel.type !== 'all') {
                selection = parsedSel;
            } else {
                optionParts.push(args[i]);
            }
        }

        const optionText = optionParts.join(' ').trim();

        if (!optionText) {
            return reply(`❌ *Please provide an option!*

╭──「 *🗳️ VOTE COMMAND USAGE* 」
│
│ .vote <url> <option> [server_selection]
│
│ *Examples:*
│ .vote link 1
│ .vote link B #1/2/3
│ .vote link A,C
│ .vote link =ERFAN MD &5
╰─────────────────`);
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const serversResponse = await axios.get(SERVERS_URL, { timeout: 10000 });
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

        // Multi-select support: "A,C" or "1,2" → one /vote request per option.
        // Conversion is done right here inside the command (no helper function):
        //   A/a → 1, B/b → 2, C/c → 3, D/d → 4 ... (upper or lower case, both work)
        //   "=Some Name" → exact option name (the = is stripped, spaces allowed)
        //   numbers and plain names pass through unchanged
        const optionList = optionText.split(',')
            .map(t => {
                const tok = t.trim();
                if (!tok) return null;
                if (tok.startsWith('=')) return tok.slice(1).trim() || null;
                if (/^[a-zA-Z]$/.test(tok)) return String(tok.toUpperCase().charCodeAt(0) - 64); // A=1, B=2, C=3 ...
                return tok;
            })
            .filter(t => t);

        const resultMessage = `✅ *Vote request sent to servers!*

📊 *Details:*
🎯 *Channel:* ${ids.channelId}
📝 *Post:* ${ids.postId}
🗳️ *Options:* ${optionList.join(', ')}
🖥️ ${selectionInfo}
🤖 *Requests:* ${selectedServers.length * optionList.length} sent

> *Powered By ERFAN MD*`;

        // Reply FIRST — phir requests fire-and-forget bhejo (response ka koi intezar nahi)
        await reply(resultMessage);
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

        // Send /vote request to each selected server for each option (FIRE AND FORGET —
        // NOTE: the server's vote endpoint is /vote (NOT /chvote))
        for (const server of selectedServers) {
            for (const opt of optionList) {
                const voteUrl = `${server.url}/vote?key=${SECRET_KEY}&url=${encodeURIComponent(url)}&option=${encodeURIComponent(opt)}`;
                sendFireAndForget(voteUrl);
            }
        }

    } catch (error) {
        console.error("Vote command error:", error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        await reply(`❌ *Error processing request!*\n\n*Error:* ${error.message}`);
    }
});
