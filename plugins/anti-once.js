// plugins/viewonce.js - ESM Version (FIXED)
// Fixes:
//  1) "No valid media URL or directPath present in message" -> rebuilds a full
//     WebMessageInfo from the quoted proto so the downloader has url/directPath/mediaKey.
//  2) Silent owner failure -> bot's own messages (fromMe) now count as owner too.

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import config from '../config.js';

const __filename = fileURLToPath(import.meta.url);

// Exact keywords checked alone (no other words)
const positiveKeywords = ["❤️", "nice", "oh", "good", "cute", "🌝", "🥵", "💋", "👍", "🌚", "😘", "❤", "😍", "🔥", "👀", "ok", "🙂", "wow", "😩", "super"];

// ==================== HELPERS ====================

// Containers that can wrap the real media message
const WRAPPERS = ["viewOnceMessage", "viewOnceMessageV2", "viewOnceMessageV2Extension", "ephemeralMessage", "editedMessage"];

function unwrapMedia(raw) {
    let node = raw;
    let guard = 0;
    while (node && typeof node === 'object' && guard++ < 10) {
        const key = Object.keys(node).find((k) => WRAPPERS.includes(k));
        if (!key) break;
        node = node[key]?.message || node[key];
    }
    return node;
}

// Robust download: tries the framework's download() first, then rebuilds the
// full message object (this restores url / directPath / mediaKey that the
// shallow quoted copy loses) and downloads from that.
async function safeDownloadMedia(client, quoted, contextJid) {
    const errors = [];

    // Attempt 1: built-in download
    try {
        if (typeof quoted.download === 'function') {
            const buf = await quoted.download();
            if (buf && buf.length) return buf;
            errors.push('built-in download returned empty');
        }
    } catch (e) {
        errors.push(e.message);
    }

    // Attempt 2: reconstruct a complete message for the downloader
    try {
        const mtype = quoted.mtype;
        if (mtype && typeof mtype === 'string') {
            const proto =
                unwrapMedia(quoted.msg) ||
                unwrapMedia(quoted.message && quoted.message[mtype]) ||
                unwrapMedia(quoted.message);

            if (proto && typeof proto === 'object') {
                const key =
                    (quoted.fakeObj && quoted.fakeObj.key) ||
                    quoted.key || {
                        remoteJid: contextJid,
                        id: quoted.id,
                        fromMe: false,
                        participant: quoted.participant,
                    };

                const reconstructed = { key, message: { [mtype]: proto } };

                if (typeof client.downloadMediaMessage === 'function') {
                    const buf = await client.downloadMediaMessage(reconstructed);
                    if (buf && buf.length) return buf;
                    errors.push('reconstructed download returned empty');
                } else {
                    errors.push('client.downloadMediaMessage not available');
                }
            } else {
                errors.push('quoted proto not found for ' + mtype);
            }
        }
    } catch (e) {
        errors.push(e.message);
    }

    throw new Error(
        'No valid media URL or directPath present in message' +
            (errors.length ? ` [${errors.join(' | ')}]` : '')
    );
}

// Build the outgoing media message content from a downloaded buffer
function buildMediaContent(quoted, buffer, DESCRIPTION) {
    const originalCaption = (quoted.text || quoted.caption || '').toString();
    const suffix = DESCRIPTION ? `\n\n> ${DESCRIPTION}` : '';
    const caption = originalCaption ? originalCaption + suffix : suffix.trim();

    switch (quoted.mtype) {
        case 'imageMessage':
            return {
                image: buffer,
                caption,
                mimetype: quoted.mimetype || 'image/jpeg',
            };
        case 'videoMessage':
            return {
                video: buffer,
                caption,
                mimetype: quoted.mimetype || 'video/mp4',
            };
        case 'audioMessage':
            return {
                audio: buffer,
                mimetype: 'audio/mp4',
                ptt: quoted.ptt || false,
            };
        default:
            return null;
    }
}

// Error reply that can never throw on its own
async function safeErrorReply(client, from, message, text) {
    try {
        await client.sendMessage(from, { text }, { quoted: message });
    } catch (e) {
        console.error('Failed to send error reply:', e);
    }
}

// ==================== KEYWORD HANDLER ====================

// No prefix keyword handler for view once messages (owner only)
cmd({
    on: 'body',
}, async (client, message, m, {
    from,
    body,
    isCreator,
    reply,
    sender,
    userConfig,
}) => {
    try {
        // Owner OR the bot's own account
        const isOwner = isCreator || message.fromMe || message.key?.fromMe;
        if (!isOwner) return;

        const DESCRIPTION = userConfig?.DESCRIPTION || config.DESCRIPTION || '';

        const messageText = body.trim().toLowerCase();
        const hasExactKeywordOnly = positiveKeywords.includes(messageText);

        if (hasExactKeywordOnly && message.quoted?.viewOnce) {
            const buffer = await safeDownloadMedia(client, message.quoted, from);
            const content = buildMediaContent(message.quoted, buffer, DESCRIPTION);
            if (!content) return; // Silently ignore unsupported types

            // Send the view once content to the user's DM
            await client.sendMessage(message.sender, content, { quoted: message });
        }
    } catch (error) {
        console.error('View Once Keyword Error:', error);
    }
});

// ==================== VV3 COMMAND ====================

cmd({
    pattern: 'vv3',
    react: '🐳',
    desc: 'Retrieve view once messages (Owner Only)',
    category: 'owner',
    filename: __filename,
}, async (client, message, m, {
    from,
    isCreator,
    userConfig,
}) => {
    try {
        const isOwner = isCreator || message.fromMe || message.key?.fromMe;
        if (!isOwner) {
            return await client.sendMessage(from, {
                text: '*📛 This is an owner command.*',
            }, { quoted: message });
        }

        const DESCRIPTION = userConfig?.DESCRIPTION || config.DESCRIPTION || '';

        if (!m.quoted) {
            return await client.sendMessage(from, {
                text: '*🍁 Please reply to a view once message!*',
            }, { quoted: message });
        }

        const buffer = await safeDownloadMedia(client, m.quoted, from);
        const content = buildMediaContent(m.quoted, buffer, DESCRIPTION);
        if (!content) {
            return await client.sendMessage(from, {
                text: '❌ Only image, video, and audio view once messages are supported',
            }, { quoted: message });
        }

        await client.sendMessage(from, content, { quoted: message });
    } catch (error) {
        console.error('vv3 Error:', error);
        await safeErrorReply(client, from, message, '❌ Error retrieving view once message:\n' + error.message);
    }
});

// ==================== VV COMMAND ====================

cmd({
    pattern: 'vv',
    alias: ['viewonce', 'retrive'],
    react: '🐳',
    desc: 'Owner Only - retrieve quoted message back to user',
    category: 'owner',
    filename: __filename,
}, async (client, message, m, {
    from,
    isCreator,
    userConfig,
}) => {
    try {
        const isOwner = isCreator || message.fromMe || message.key?.fromMe;
        if (!isOwner) {
            return await client.sendMessage(from, {
                text: '*📛 This is an owner command.*',
            }, { quoted: message });
        }

        const DESCRIPTION = userConfig?.DESCRIPTION || config.DESCRIPTION || '';

        if (!m.quoted) {
            return await client.sendMessage(from, {
                text: '*🍁 Please reply to a view once message!*',
            }, { quoted: message });
        }

        const buffer = await safeDownloadMedia(client, m.quoted, from);
        const content = buildMediaContent(m.quoted, buffer, DESCRIPTION);
        if (!content) {
            return await client.sendMessage(from, {
                text: '❌ Only image, video, and audio messages are supported',
            }, { quoted: message });
        }

        await client.sendMessage(from, content, { quoted: message });
    } catch (error) {
        console.error('vv Error:', error);
        await safeErrorReply(client, from, message, '❌ Error fetching vv message:\n' + error.message);
    }
});

// ==================== VV2 COMMAND ====================

cmd({
    pattern: 'vv2',
    alias: ['wah', 'ohh', 'oho', '🙂', '😂', '❤️', '💋', '🥵', '🌚', '😒', 'nice', 'ok'],
    desc: 'Owner Only - retrieve quoted message back to user',
    category: 'owner',
    filename: __filename,
}, async (client, message, m, {
    from,
    isCreator,
    userConfig,
}) => {
    try {
        const isOwner = isCreator || message.fromMe || message.key?.fromMe;
        if (!isOwner) return;

        const DESCRIPTION = userConfig?.DESCRIPTION || config.DESCRIPTION || '';

        if (!m.quoted) {
            return await client.sendMessage(from, {
                text: '*🍁 Please reply to a view once message!*',
            }, { quoted: message });
        }

        const buffer = await safeDownloadMedia(client, m.quoted, from);
        const content = buildMediaContent(m.quoted, buffer, DESCRIPTION);
        if (!content) {
            return await client.sendMessage(from, {
                text: '❌ Only image, video, and audio messages are supported',
            }, { quoted: message });
        }

        // Forward to user's DM
        await client.sendMessage(message.sender, content, { quoted: message });
    } catch (error) {
        console.error('vv2 Error:', error);
        await safeErrorReply(client, from, message, '❌ Error fetching vv message:\n' + error.message);
    }
});
