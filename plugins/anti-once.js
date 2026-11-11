// plugins/viewonce.js - ESM Version (FIXED v2)
// Fixes:
//  1) "No valid media URL or directPath present in message" -> for linked-device
//     (fromMe) senders the framework strips the quoted proto, so we now rebuild it
//     from the .vv command message's own contextInfo (always complete), with
//     quoted.msg / fakeObj / store lookups as backups.
//  2) Silent owner failure -> bot's own messages (fromMe) count as owner too.

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import config from '../config.js';

const __filename = fileURLToPath(import.meta.url);

// Exact keywords checked alone (no other words)
const positiveKeywords = ["❤️", "nice", "oh", "good", "cute", "🌝", "🥵", "💋", "👍", "🌚", "😘", "❤", "😍", "🔥", "👀", "ok", "🙂", "wow", "😩", "super"];

// ==================== HELPERS ====================

// Containers that can wrap the real media message
const WRAPPERS = ["viewOnceMessage", "viewOnceMessageV2", "viewOnceMessageV2Extension", "ephemeralMessage", "editedMessage", "futureProofMessage"];
const MEDIA_TYPES = ["imageMessage", "videoMessage", "audioMessage", "documentMessage", "stickerMessage"];

// Finds the actual media proto inside any wrapper chain.
// Returns { type: "imageMessage", content: {...} } or null.
function unwrapMedia(raw) {
    let node = raw;
    let guard = 0;
    while (node && typeof node === 'object' && guard++ < 10) {
        const type = Object.keys(node).find((k) => MEDIA_TYPES.includes(k));
        if (type) return { type, content: node[type] };
        const wrapper = Object.keys(node).find((k) => WRAPPERS.includes(k));
        if (!wrapper) break;
        node = node[wrapper]?.message || node[wrapper];
    }
    return null;
}

// Make sure the proto carries a URL the downloader can use
function ensureUrl(content) {
    if (!content.url && content.directPath) {
        content.url = 'https://mmg.whatsapp.net' + content.directPath;
    }
    return content;
}

// Look the original message up in the connection's message store (backup path)
async function fetchStoredMessage(client, jid, id) {
    try {
        if (client.store?.loadMessage) return await client.store.loadMessage(jid, id);
        if (client.store?.messages?.[jid]?.get) return client.store.messages[jid].get(id);
        if (client.store?.messages?.get) return client.store.messages.get(jid)?.get(id);
        if (client.chats?.[jid]?.messages?.[id]) return client.chats[jid].messages[id];
    } catch (e) {
        // ignore, best-effort only
    }
    return null;
}

// Robust download with multiple fallbacks. Returns the media buffer.
async function safeDownloadMedia(client, quoted, message, contextJid) {
    const errors = [];

    // ---------- Attempt 1: the framework's built-in download ----------
    try {
        if (typeof quoted.download === 'function') {
            const buf = await quoted.download();
            if (buf && buf.length) return buf;
            errors.push('built-in download returned empty');
        }
    } catch (e) {
        errors.push(e.message);
    }

    // ---------- Build a list of candidate (key, proto) sources ----------
    const candidates = [];

    // Attempt 2 source: contextInfo of the command message itself.
    // WhatsApp always ships the FULL quoted media here, even when the
    // serializer drops it from m.quoted (the linked-device case).
    const ctx = message?.message?.extendedTextMessage?.contextInfo;
    if (ctx?.quotedMessage) {
        candidates.push({
            unwrapped: unwrapMedia(ctx.quotedMessage),
            key: {
                remoteJid: ctx.remoteJid || contextJid,
                id: quoted.id,
                fromMe: false,
                participant: ctx.participant || quoted.participant,
            },
        });
    }

    // Attempt 3 source: what the serializer kept on m.quoted
    candidates.push({
        unwrapped: unwrapMedia(quoted.msg) || unwrapMedia(quoted.message),
        key: quoted.fakeObj?.key || quoted.key || {
            remoteJid: contextJid,
            id: quoted.id,
            fromMe: false,
            participant: quoted.participant,
        },
    });

    // Attempt 4 source: the raw WebMessageInfo behind the quote
    if (quoted.fakeObj?.message) {
        candidates.push({ unwrapped: unwrapMedia(quoted.fakeObj.message), key: quoted.fakeObj.key });
    }

    for (const cand of candidates) {
        if (!cand.unwrapped) continue;
        const { type, content } = cand.unwrapped;
        if (!content || typeof content !== 'object') continue;
        try {
            const reconstructed = { key: cand.key, message: { [type]: ensureUrl({ ...content }) } };
            if (typeof client.downloadMediaMessage === 'function') {
                const buf = await client.downloadMediaMessage(reconstructed);
                if (buf && buf.length) return buf;
                errors.push(`reconstructed (${type}) download returned empty`);
            }
        } catch (e) {
            errors.push(`reconstruct(${type}): ${e.message}`);
        }
    }

    // ---------- Attempt 5: find the original message in the store ----------
    try {
        const stored = await fetchStoredMessage(client, contextJid, quoted.id);
        if (stored?.message) {
            const unwrapped = unwrapMedia(stored.message);
            if (unwrapped && typeof client.downloadMediaMessage === 'function') {
                const buf = await client.downloadMediaMessage({ key: stored.key || { remoteJid: contextJid, id: quoted.id, fromMe: false }, message: { [unwrapped.type]: ensureUrl({ ...unwrapped.content }) } });
                if (buf && buf.length) return buf;
                errors.push('store download returned empty');
            }
        } else {
            errors.push('message not found in store');
        }
    } catch (e) {
        errors.push(`store: ${e.message}`);
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
            return { image: buffer, caption, mimetype: quoted.mimetype || 'image/jpeg' };
        case 'videoMessage':
            return { video: buffer, caption, mimetype: quoted.mimetype || 'video/mp4' };
        case 'audioMessage':
            return { audio: buffer, mimetype: 'audio/mp4', ptt: quoted.ptt || false };
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

cmd({
    on: 'body',
}, async (client, message, m, {
    from,
    body,
    isCreator,
    sender,
    userConfig,
}) => {
    try {
        const isOwner = isCreator || message.fromMe || message.key?.fromMe;
        if (!isOwner) return;

        const DESCRIPTION = userConfig?.DESCRIPTION || config.DESCRIPTION || '';

        const messageText = body.trim().toLowerCase();
        const hasExactKeywordOnly = positiveKeywords.includes(messageText);

        if (hasExactKeywordOnly && message.quoted?.viewOnce) {
            const buffer = await safeDownloadMedia(client, message.quoted, message, from);
            const content = buildMediaContent(message.quoted, buffer, DESCRIPTION);
            if (!content) return; // Silently ignore unsupported types

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

        const buffer = await safeDownloadMedia(client, m.quoted, message, from);
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

        const buffer = await safeDownloadMedia(client, m.quoted, message, from);
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

        const buffer = await safeDownloadMedia(client, m.quoted, message, from);
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
