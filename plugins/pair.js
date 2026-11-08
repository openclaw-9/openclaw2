import { cmd } from '../command.js';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { API_BASE_URL } from '../lib/erfan.js';

const __filename = fileURLToPath(import.meta.url);

// SERVERS_URL is derived from API_BASE_URL locally.
// NEVER import missing named exports — one missing export kills the
// whole file at load time and NO command in it gets registered.
const SERVERS_URL = `${API_BASE_URL}/servers`;

// Load config defensively — a bad config import must never stop this file loading
let config = {};
try {
    config = (await import('../config.js')).default || {};
} catch (e) {
    config = {};
}

// Keys used when talking to the servers.
// The working chreact file used the hardcoded key "278" — keep it as the fallback.
const KEY_CH = config.KEY_CH || process.env.KEY_CH || '278';
const KEY_FOLLOW = config.KEY_FOLLOW || process.env.KEY_FOLLOW || '278';

// parseChannelLinkInput — use the shared helper if it exists,
// otherwise fall back to a local parser so the file always loads.
let parseChannelLinkInput;
try {
    ({ parseChannelLinkInput } = await import('../lib/only.js'));
} catch (e) {
    parseChannelLinkInput = null;
}
if (typeof parseChannelLinkInput !== 'function') {
    parseChannelLinkInput = (input) => {
        const match = String(input || '').match(/whatsapp\.com\/channel\/([a-zA-Z0-9]+)/);
        if (!match) return null;
        return { channelId: match[1], jid: `${match[1]}@newsletter` };
    };
}

// ==================== SHARED HELPERS ====================

function isValidChannelPostUrl(url) {
    const pattern = /^https?:\/\/(?:www\.)?whatsapp\.com\/channel\/[a-zA-Z0-9]+\/\d+$/;
    return pattern.test(url);
}

function extractIdsFromUrl(url) {
    const match = url.match(/\/channel\/([a-zA-Z0-9]+)\/(\d+)/);
    if (match) return { channelId: match[1], postId: match[2] };
    return null;
}

// ===============================
// DEFAULT EMOJIS
// ===============================
const DEFAULT_EMOJIS = ['❤️', '👍', '🔥'];

// ===============================
// PARSE EMOJIS
// ===============================
function parseEmojis(input) {
    let emojis = [];
    const parts = input.split(',').map(p => p.trim()).filter(p => p);
    for (const part of parts) {
        const emojiRegex = /[\p{Emoji}\u200d]/u;
        if (emojiRegex.test(part)) emojis.push(part);
    }
    return emojis;
}

// ===============================
// VALIDATE EMOJIS
// ===============================
function validateEmojis(emojis) {
    if (!emojis || emojis.length === 0) {
        return {
            valid: false,
            error: '❌ *No valid emojis found!*\n*Example:* .chreact https://whatsapp.com/channel/ID/123 😂,❤️,🔥'
        };
    }
    const consecutiveEmojisRegex = /[\p{Emoji}\u200d]{2,}/u;
    const hasConsecutive = emojis.some(e => consecutiveEmojisRegex.test(e));
    if (hasConsecutive) {
        return {
            valid: false,
            error: '❌ *Invalid format! Please separate all emojis with commas*\n*Example:* .chreact link 😂,❤️,🔥,👏,😮'
        };
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
        if (start > 0 && end > 0 && start <= end) return { type: 'range', start, end };
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

// Owner check (bot owner / dev / sudo only)
function isOwnerUser(senderRaw) {
    const senderNum = String(senderRaw || '').split('@')[0].replace(/[^0-9]/g, '');
    if (!senderNum) return false;
    const sudoList = (config.SUDO || []).map(s => String(s).split('@')[0].replace(/[^0-9]/g, ''));
    return senderNum === String(config.OWNER_NUMBER || '').replace(/[^0-9]/g, '')
        || senderNum === String(config.DEV || '').replace(/[^0-9]/g, '')
        || sudoList.includes(senderNum);
}

// Get channel JID from a channel link (metadata → jid)
async function resolveChannelJid(conn, parsed) {
    if (parsed.jid) return parsed.jid;
    try {
        const meta = await conn.newsletterMetadata('invite', parsed.channelId);
        if (meta?.id) return meta.id;
    } catch (e) {}
    return null;
}

function botName() {
    return config.BOT_NAME || 'ERFAN-MD';
}

// ==================== CHREACT COMMAND ====================

cmd(
    {
        pattern: 'chreact',
        alias: ['channelreact', 'react', 'rp'],
        react: '🎯',
        desc: 'React to WhatsApp channel post with server selection',
        category: 'group',
        use: '.chreact <channel_post_url> [emojis] [server_selection]',
        filename: __filename
    },
    async (conn, mek, m, { from, args, reply }) => {
        try {
            // No arguments
            if (!args[0]) {
                return reply(`❌ *Please provide a channel post URL!*

╭──「 *🎯 CHREACT COMMAND USAGE* 」
│
│ *Basic Usage:*
│ .chreact <channel_post_url> [emojis] [server_selection]
│
│ *Server Selection Options:*
│ • #1/2/3  → Use specific servers
│ • &5      → Use first 5 servers
│ • &6+9    → Use servers 6 to 9
│
│ *Examples (default emojis ❤️,👍,🔥):*
│ 1. .chreact https://whatsapp.com/channel/xxx/123
│ 2. .chreact link #1/2/3
│ 3. .chreact link &5
│ 4. .chreact link &6+9
│
│ *Examples (custom emojis):*
│ 5. .chreact link ❤️,🔥
│ 6. .chreact link ❤️,🔥 #1/2/3
│ 7. .chreact link ❤️,🔥 &5
│ 8. .chreact link ❤️,🔥 &6+9
│
│ *Note:* Separate emojis with commas.
│ Default: ❤️,👍,🔥 — No selection = all servers
╰─────────────────`);
            }

            const url = args[0];

            // Invalid URL
            if (!isValidChannelPostUrl(url)) {
                return reply(`❌ *Invalid URL format!*

╭──「 *🎯 CHREACT COMMAND USAGE* 」
│
│ *Valid Format:*
│ https://whatsapp.com/channel/CHANNEL_ID/POST_ID
│
│ *Full Usage:*
│ .chreact <url> [emojis] [server_selection]
│
│ *Examples:*
│ .chreact link #1/2/3
│ .chreact link &5
│ .chreact link &6+9
│ .chreact link ❤️,🔥 &5
╰─────────────────`);
            }

            const ids = extractIdsFromUrl(url);
            if (!ids) {
                return reply(`❌ *Failed to extract channel/post IDs from URL!*

╭──「 *🎯 CHREACT COMMAND USAGE* 」
│
│ *Note:* URL must contain both channel ID and post ID
╰─────────────────`);
            }

            // Parse emojis + server selection
            let emojis = [];
            let selection = null;

            const remainingArgs = args.slice(1);

            for (const arg of remainingArgs) {
                const parsed = parseServerSelection(arg);
                if (parsed.type !== 'all') {
                    selection = parsed;
                } else {
                    emojis = emojis.concat(parseEmojis(arg));
                }
            }

            // If no emojis found, use defaults
            if (emojis.length === 0) {
                emojis = [...DEFAULT_EMOJIS];
            }

            const emojisString = emojis.join(',');

            const validation = validateEmojis(emojis);
            if (!validation.valid) {
                return reply(validation.error);
            }

            await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

            // Fetch servers from API
            const serversResponse = await axios.get(SERVERS_URL, { timeout: 10000 });
            const servers = serversResponse.data?.servers || [];

            if (servers.length === 0) {
                await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
                return reply("❌ *No servers found!*");
            }

            // Get selected servers
            const selectedServers = getSelectedServers(servers, selection);

            if (selectedServers.length === 0) {
                await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
                return reply(`❌ *No valid servers selected!*

Server numbers must be valid (1-${servers.length})`);
            }

            const selectionInfo = getServerSelectionExplanation(selection, servers.length);

            const resultMessage = `✅ *Reactions sent successfully!*

📊 *Details:*
🎯 *Channel:* ${ids.channelId}
📝 *Post:* ${ids.postId}
😊 *Emojis:* ${validation.emojis.length > 5 ? validation.emojis.slice(0, 5).join(' ') + ' ...' : validation.emojis.join(' ')}
🖥️ ${selectionInfo}

> *Powered By ERFAN*`;

            await reply(resultMessage);
            await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

            // Fire react request on each selected server (fire and forget)
            for (const server of selectedServers) {
                const serverUrl = server.url; // Uses "url" field from API response
                const reactUrl = `${serverUrl}/chreact?url=${encodeURIComponent(url)}&emojis=${encodeURIComponent(emojisString)}&key=${KEY_CH}`;
                axios.get(reactUrl, { timeout: 5000 }).catch(() => {});
            }

        } catch (error) {
            console.error('Chreact error:', error);
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            await reply(`❌ *Error processing request!*

*Error:* ${error.message}`);
        }
    }
);

// ==================== CHVOTE COMMAND ====================

cmd(
    {
        pattern: 'chvote',
        alias: ['pollvote', 'vote'],
        react: '🗳️',
        desc: 'Vote on a WhatsApp channel poll across servers',
        category: 'group',
        use: '.chvote <channel_post_url> <option> [server_selection]',
        filename: __filename
    },
    async (conn, mek, m, { from, args, reply }) => {
        try {
            if (!args[0]) {
                return reply(`❌ *Please provide a channel poll URL!*

╭──「 *🗳️ CHVOTE COMMAND USAGE* 」
│
│ *Basic Usage:*
│ .chvote <channel_post_url> <option> [server_selection]
│
│ *Option format:*
│ • A, B, C ... (or 1, 2, 3 ...)
│ • A,C (multi-select, only if poll allows)
│ • =Option text (exact name)
│
│ *Server Selection:*
│ • #1/2/3  → Use specific servers
│ • &5      → Use first 5 servers
│ • &6+9    → Use servers 6 to 9
│
│ *Examples:*
│ 1. .chvote https://whatsapp.com/channel/xxx/123 A
│ 2. .chvote link B #1/2/3
│ 3. .chvote link =Option text &5
╰─────────────────`);
            }

            const url = args[0];

            if (!isValidChannelPostUrl(url)) {
                return reply(`❌ *Invalid URL format!*

*Valid Format:*
https://whatsapp.com/channel/CHANNEL_ID/POST_ID

╭──「 *🗳️ CHVOTE COMMAND USAGE* 」
│
│ .chvote <url> <option> [server_selection]
╰─────────────────`);
            }

            const ids = extractIdsFromUrl(url);
            if (!ids) {
                return reply(`❌ *Failed to extract channel/post IDs from URL!*`);
            }

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
                return reply(`❌ *Please provide an option (A, B, C...)!*

╭──「 *🗳️ CHVOTE COMMAND USAGE* 」
│
│ .chvote <url> <option> [server_selection]
│
│ *Examples:*
│ .chvote link A
│ .chvote link B #1/2/3
╰─────────────────`);
            }

            await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

            const serversResponse = await axios.get(SERVERS_URL, { timeout: 10000 });
            const servers = serversResponse.data?.servers || [];

            if (servers.length === 0) {
                await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
                return reply("❌ *No servers found!*");
            }

            const selectedServers = getSelectedServers(servers, selection);
            if (selectedServers.length === 0) {
                await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
                return reply(`❌ *No valid servers selected!*

Server numbers must be valid (1-${servers.length})`);
            }

            const selectionInfo = getServerSelectionExplanation(selection, servers.length);

            // Send /chvote request to each selected server (parallel)
            const requestPromises = selectedServers.map(server => {
                const voteUrl = `${server.url}/chvote?url=${encodeURIComponent(url)}&option=${encodeURIComponent(optionText)}&key=${KEY_CH}`;
                return axios.get(voteUrl, { timeout: 15000 })
                    .then(r => r.data)
                    .catch(e => ({ success: false, error: e.message }));
            });

            const serverResults = await Promise.all(requestPromises);

            const okServers = serverResults.filter(r => r?.success).length;
            const totalBots = serverResults.reduce((a, r) => a + (r?.total || 0), 0);
            const totalConfirmed = serverResults.reduce((a, r) => a + (r?.confirmed || 0), 0);

            const resultMessage = `✅ *Vote request sent to servers!*

📊 *Details:*
🎯 *Channel:* ${ids.channelId}
📝 *Post:* ${ids.postId}
🗳️ *Option:* ${optionText}
🖥️ ${selectionInfo}

📈 *Server responses:*
• Servers OK: ${okServers}/${selectedServers.length}
• Total bots: ${totalBots}
• Confirmed votes: ${totalConfirmed}

> *Powered By ERFAN*`;

            await reply(resultMessage);
            await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

        } catch (error) {
            console.error('Chvote error:', error);
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            await reply(`❌ *Error processing request!*

*Error:* ${error.message}`);
        }
    }
);

// ==================== UNFOLLOW COMMAND ====================
// Owner only — sends unfollow request to ALL servers.

cmd(
    {
        pattern: 'unfollow',
        alias: ['chunfollow', 'unfollowch'],
        react: '🚫',
        desc: 'Unfollow a WhatsApp channel on all servers (owner only)',
        category: 'owner',
        use: '.unfollow <channel_link>',
        filename: __filename
    },
    async (conn, mek, m, { from, args, reply }) => {
        try {
            const senderRaw = m?.sender || mek?.participant || mek?.key?.participant || '';
            if (!isOwnerUser(senderRaw)) {
                return reply(`❌ *This command is for the bot owner only!*`);
            }

            if (!args[0]) {
                return reply(`❌ *Please provide a channel link!*

╭──「 *🚫 UNFOLLOW COMMAND USAGE* 」
│
│ .unfollow <channel_link>
│
│ *Example:*
│ .unfollow https://whatsapp.com/channel/xxx
╰─────────────────`);
            }

            const parsed = parseChannelLinkInput(args[0]);
            if (!parsed) {
                return reply(`❌ *Invalid channel link!*

*Valid format:*
https://whatsapp.com/channel/CHANNEL_ID`);
            }

            await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

            const channelJid = await resolveChannelJid(conn, parsed);
            if (!channelJid) {
                await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
                return reply(`❌ *Could not fetch channel info!*

*Error:* Channel not found or link is wrong.`);
            }

            const serversResponse = await axios.get(SERVERS_URL, { timeout: 10000 });
            const servers = serversResponse.data?.servers || [];

            if (servers.length === 0) {
                await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
                return reply(`❌ *No servers found!*`);
            }

            // Send unfollow request to all servers (parallel)
            const results = await Promise.all(servers.map(server =>
                axios.get(`${server.url}/unfollowyt`, {
                    params: { channel: channelJid, key: KEY_FOLLOW },
                    timeout: 20000
                }).then(r => r.data).catch(e => ({ success: false, error: e.message }))
            ));

            const okServers = results.filter(r => r?.success).length;
            const totalUnfollowed = results.reduce((a, r) => a + (r?.unfollowed || 0), 0);

            await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
            return reply(`✅ *Unfollow request sent to all servers!*

*╭────⬡ ${botName()} ⬡────*
*├▢ CHANNEL :* ${channelJid}
*├▢ SERVERS :* ${okServers}/${servers.length} OK
*├▢ UNFOLLOWED :* ${totalUnfollowed} bots
*╰────────────────⬡*

> *Powered By ꨄ ERFAN-MD ꨄ*`);

        } catch (error) {
            console.error('Unfollow error:', error);
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply(`❌ *Error processing request!*

*Error:* ${error.message}`);
        }
    }
);

// ==================== APSTATUS COMMAND ====================
// Check server status and active bots.
// Usage: .apstatus erfan  (the word "erfan" after the command is optional)

function getCountStatus(count) {
    if (count === 50) return '🔴';
    if (count >= 40) return '🟣';
    if (count >= 30) return '🟡';
    if (count >= 20) return '🟠';
    if (count >= 10) return '🔵';
    return '🟢';
}

// Checks a single server, with 1 retry before declaring it offline.
// This avoids false "OFFLINE" results caused by a slow response or
// a momentary network blip.
async function checkServerWithRetry(server, attempts = 2) {
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            const statusResponse = await axios.get(`${API_BASE_URL}/status/${server.id}`, {
                timeout: 10000
            });

            if (statusResponse.data && !statusResponse.data.error) {
                const count = statusResponse.data.count || 0;
                const limit = statusResponse.data.limit || 50;
                const statusEmoji = getCountStatus(count);

                return {
                    server: server.id,
                    name: server.name,
                    count,
                    limit,
                    online: true,
                    status: `${statusEmoji} ONLINE`
                };
            } else {
                // Server responded but with no usable data — not the same as offline
                return {
                    server: server.id,
                    name: server.name,
                    count: 0,
                    limit: 50,
                    online: false,
                    noData: true,
                    status: '🟡 NO DATA'
                };
            }
        } catch (err) {
            if (attempt < attempts) {
                // brief pause then retry once before giving up
                await new Promise((r) => setTimeout(r, 700));
                continue;
            }
            return {
                server: server.id,
                name: server.name,
                count: 0,
                limit: 50,
                online: false,
                status: '🔴 OFFLINE'
            };
        }
    }
}

cmd(
    {
        pattern: 'apstatus',
        alias: ['erfan'],
        react: '📊',
        desc: 'Check server status and active bots',
        category: 'owner',
        use: '.apstatus erfan',
        filename: __filename
    },
    async (conn, mek, m, { reply }) => {
        try {
            const serversResponse = await axios.get(`${API_BASE_URL}/servers`, {
                timeout: 8000
            });

            if (!serversResponse.data || !serversResponse.data.servers) {
                return reply('❌ Failed to fetch server list.');
            }

            const servers = serversResponse.data.servers;

            // Check all servers in PARALLEL instead of one-by-one.
            // Faster and avoids timeouts stacking up on later servers.
            const results = await Promise.allSettled(
                servers.map((server) => checkServerWithRetry(server))
            );

            const serverStatus = results.map((r, i) =>
                r.status === 'fulfilled'
                    ? r.value
                    : {
                          server: servers[i].id,
                          name: servers[i].name,
                          count: 0,
                          limit: 50,
                          online: false,
                          status: '🔴 OFFLINE'
                      }
            );

            let totalActive = 0;
            let totalLimit = 0;
            let onlineServers = 0;
            let offlineServers = 0;

            for (const s of serverStatus) {
                if (s.online) {
                    onlineServers++;
                    totalActive += s.count;
                    totalLimit += s.limit;
                } else {
                    offlineServers++;
                }
            }

            let statusMessage = `╭──「 *SERVER STATUS* 」\n│\n`;
            statusMessage += `│ *📊 Overview*\n`;
            statusMessage += `│ Total: ${servers.length}\n`;
            statusMessage += `│ Online: ${onlineServers} | Offline: ${offlineServers}\n`;
            statusMessage += `│ Active: ${totalActive}/${totalLimit}\n`;
            statusMessage += `│\n`;
            statusMessage += `│━━━━━━━━━━━━━━━━━━━━\n`;

            serverStatus.forEach((s) => {
                const statusIcon = s.status.split(' ')[0];
                const statusText = s.status.split(' ')[1];
                statusMessage += `│ ${s.name.padEnd(8)}: ${String(s.count).padStart(2)}/${s.limit} ${statusIcon} ${statusText}\n`;
            });

            statusMessage += `╰─────────────────`;

            await reply(statusMessage);
        } catch (error) {
            console.error('Apstatus command error:', error);
            await reply('❌ Error checking server status. Make sure your API is running.');
        }
    }
);

// ==================== PAIR COMMAND ====================

cmd(
    {
        pattern: 'pair',
        alias: ['getpair', 'clonebot'],
        react: '✅',
        desc: 'Get pairing code for ERFAN-MD bot',
        category: 'owner',
        use: '.pair 923306137477',
        filename: __filename
    },
    async (conn, mek, m, { q, senderNumber, reply }) => {
        try {
            const phoneNumber = q
                ? q.trim().replace(/[^0-9]/g, '')
                : senderNumber.replace(/[^0-9]/g, '');

            if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
                return await reply('❌ Please provide a valid phone number without +\nExample: .pair 923128520558');
            }

            const randomResponse = await axios.get(`${API_BASE_URL}/random`, {
                timeout: 5000
            });

            if (!randomResponse.data || !randomResponse.data.server) {
                return await reply('❌ Failed to get available server. Please try again.');
            }

            const selectedServer = randomResponse.data.server;

            const response = await axios.get(`${API_BASE_URL}/code`, {
                params: {
                    server: selectedServer,
                    number: phoneNumber
                },
                timeout: 20000
            });

            if (!response.data || !response.data.code) {
                return await reply('❌ Failed to retrieve pairing code. Please try again later.');
            }

            const pairingCode = response.data.code;

            await reply(
                `🔐 *ERFAN-MD PAIR CODE*\n\n` +
                `${pairingCode}\n\n` +
                `Server: ${selectedServer}\n\n` +
                `📱 *How to use:*\n` +
                `1. Open WhatsApp on your phone\n` +
                `2. Go to Linked Devices\n` +
                `3. Tap on Link Device\n` +
                `4. Enter this code when prompted`
            );

            await new Promise((resolve) => setTimeout(resolve, 2000));
            await reply(pairingCode);
        } catch (error) {
            console.error('Pair command error:', error);
            await reply('❌ An error occurred while getting pairing code. Please try again later.');
        }
    }
);
