// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';
import { cmd } from '../command.js';
import { fetchGif, gifToVideo } from '../lib/fetchgif.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ═══════════════════════════════════════════════════════════
// Reaction GIF sources (same pipeline as the working .kiss)
// Primary : nekos.best  (https://nekos.best/api/v2/{endpoint})
// Fallback: purrbot.site (https://purrbot.site/api/img/sfw/{endpoint}/gif)
// ═══════════════════════════════════════════════════════════

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

async function getReactionVideo(nbEndpoint, pbEndpoint) {
    const gifUrl = await getReactionGifUrl(nbEndpoint, pbEndpoint);
    const gifBuffer = await fetchGif(gifUrl);
    return await gifToVideo(gifBuffer);
}

// ═══════════════════════════════════════════════════════════
// BACHHA (Random Boy)
// ═══════════════════════════════════════════════════════════
cmd({
  pattern: "bacha",
  alias: ["boy", "larka"],
  desc: "Randomly selects a boy from the group",
  react: "👦",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    // ✅ Safely fetch group metadata from conn
    const groupMetadata = await conn.groupMetadata(mek.chat);
    const participants = groupMetadata.participants || [];

    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    const eligible = participants.filter(p => p.id !== botId);

    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];

    // ✅ Same kiss GIF pipeline as .marige
    const videoBuffer = await getReactionVideo("kiss", "kiss");

    await conn.sendMessage(
      mek.chat,
      {
        video: videoBuffer,
        caption: `👦 *Yeh lo tumhara Bacha!*\n\n@${randomUser.id.split('@')[0]} is your handsome boy! 😎`,
        gifPlayback: true,
        mentions: [randomUser.id]
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bacha command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});

// ═══════════════════════════════════════════════════════════
// BACHI (Random Girl)
// ═══════════════════════════════════════════════════════════
cmd({
  pattern: "bachi",
  alias: ["girl", "kuri", "larki"],
  desc: "Randomly selects a girl from the group",
  react: "👧",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    // ✅ Safely fetch group metadata from conn
    const groupMetadata = await conn.groupMetadata(mek.chat);
    const participants = groupMetadata.participants || [];

    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    const eligible = participants.filter(p => p.id !== botId);

    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];

    // ✅ Same kiss GIF pipeline as .marige
    const videoBuffer = await getReactionVideo("kiss", "kiss");

    await conn.sendMessage(
      mek.chat,
      {
        video: videoBuffer,
        caption: `👧 *Yeh lo tumhari Bachi!*\n\n@${randomUser.id.split('@')[0]} is your beautiful girl! 💖`,
        gifPlayback: true,
        mentions: [randomUser.id]
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bachi command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
