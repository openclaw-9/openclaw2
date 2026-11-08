import { cmd } from '../command.js';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { API_BASE_URL } from '../lib/erfan.js';

const __filename = fileURLToPath(import.meta.url);

// Status emoji function
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
                timeout: 10000 // was 5000 — too short, caused false offline reports
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

// ==================== STATUS COMMAND ====================

cmd(
    {
        pattern: 'areeba',
        alias: ['serveatus', 'stts', 'servrs'],
        react: '📊',
        desc: 'Check server status and active users',
        category: '💬 Fun Text',
        use: '.status',
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
            // This is both faster and avoids timeouts stacking up on
            // later servers in the list.
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
            console.error('Status command error:', error);
            await reply('❌ Error checking server status. Make sure your API is running.');
        }
    }
);

// ==================== PAIR COMMAND ====================
// Untouched — exactly as before

cmd(
    {
        pattern: 'pair',
        alias: ['getpair', 'clonebot'],
        react: '✅',
        desc: 'Get pairing code for erfan-MD bot',
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
                `🔐 ERFAN-MD PAIR CODE*\n\n` +
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
