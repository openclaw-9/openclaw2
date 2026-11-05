// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';
import { cmd } from '../command.js';
import { fetchGif, gifToVideo } from '../lib/fetchgif.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ERFAN-MD

// ═══════════════════════════════════════════════════════════
// Primary : nekos.best  (https://nekos.best/api/v2/{endpoint})
// Fallback: purrbot.site (https://purrbot.site/api/img/sfw/{endpoint}/gif)
// Same pipeline as the working .kiss command in reaction.js
// ═══════════════════════════════════════════════════════════

/**
 * Gets a reaction GIF url from nekos.best, falling back to purrbot.site.
 */
async function getReactionGifUrl(nbEndpoint, pbEndpoint) {
    if (nbEndpoint) {
        try {
            const res = await axios.get(`https://nekos.best/api/v2/${nbEndpoint}`);
            const url = res.data?.results?.[0]?.url;
            if (url) return url;
        } catch (e) {
            // fall through to purrbot
        }
    }

    if (pbEndpoint) {
        try {
            const res = await axios.get(`https://purrbot.site/api/img/sfw/${pbEndpoint}/gif`);
            if (res.data && res.data.error === false && res.data.link) {
                return res.data.link;
            }
        } catch (e) {
            // fall through to throw below
        }
    }

    throw new Error("No reaction GIF source available for this command.");
}

/**
 * Full pipeline: fetch gif url -> download gif bytes -> convert to mp4 buffer.
 */
async function getReactionVideo(nbEndpoint, pbEndpoint) {
    const gifUrl = await getReactionGifUrl(nbEndpoint, pbEndpoint);
    const gifBuffer = await fetchGif(gifUrl);
    return await gifToVideo(gifBuffer);
}

// ═══════════════════════════════════════════════════════════
// MARIGE
// ═══════════════════════════════════════════════════════════
cmd({
    pattern: "marige",
    alias: ["shadi", "marriage", "wedding"],
    desc: "Randomly pairs two users for marriage with a wedding GIF",
    react: "💍",
    category: "fun",
    filename: __filename
}, async (conn, mek, store, { isGroup, reply, sender }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups!");

        // Get group metadata properly
        const groupMetadata = await conn.groupMetadata(mek.chat);
        const participants = groupMetadata.participants.map(user => user.id);

        // Filter out the sender and bot number
        const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        const eligibleParticipants = participants.filter(id => id !== sender && id !== botNumber);

        if (eligibleParticipants.length < 1) {
            return reply("❌ Not enough participants to perform a marriage!");
        }

        // Select random partner
        const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
        const randomPair = eligibleParticipants[randomIndex];

        // nekos.best "kiss" primary, purrbot.site "kiss" fallback -> mp4
        const videoBuffer = await getReactionVideo("kiss", "kiss");

        const message = `💍 *Shadi Mubarak!* 💒\n\n👰 @${sender.split("@")[0]} + 🤵 @${randomPair.split("@")[0]}\n\nMay you both live happily ever after! 💖`;

        await conn.sendMessage(
            mek.chat,
            {
                video: videoBuffer,
                caption: message,
                gifPlayback: true,
                mentions: [sender, randomPair]
            },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .marige command:", error);
        reply("❌ *Error in .marige command:*\n" + error.message);
    }
});
