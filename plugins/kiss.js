// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Kissing video URLs array
const kissingVideos = [
  "https://files.catbox.moe/wnuvru.mp4",
  "https://files.catbox.moe/g8nudx.mp4",
  "https://files.catbox.moe/wndkr8.mp4",
  "https://files.catbox.moe/djhvpv.mp4",
  "https://files.catbox.moe/flqqtx.mp4",
  "https://files.catbox.moe/lhmxb1.mp4",
  "https://files.catbox.moe/1bdgtk.mp4",
  "https://files.catbox.moe/v5f8h4.mp4",
  "https://files.catbox.moe/wnbt6e.mp4",
  "https://files.catbox.moe/mkuknm.mp4",
  "https://files.catbox.moe/39gphi.mp4",
  "https://files.catbox.moe/koo0tf.mp4",
  "https://files.catbox.moe/gxr1fk.mp4",
  "https://files.catbox.moe/lcc8mc.mp4",
  "https://files.catbox.moe/u529tm.mp4",
  "https://files.catbox.moe/c99mmo.mp4",
  "https://files.catbox.moe/7ccjky.mp4",
  "https://files.catbox.moe/5kkmbd.mp4",
  "https://files.catbox.moe/x4mmbi.mp4",
  "https://files.catbox.moe/2u33vq.mp4",
  "https://files.catbox.moe/rhpdhj.mp4",
  "https://files.catbox.moe/xpydrq.mp4",
  "https://files.catbox.moe/r07q39.mp4",
  "https://files.catbox.moe/drvmed.mp4",
  "https://files.catbox.moe/g6dtp9.mp4"
];

// Helper function to get random video
const getRandomKissVideo = () => kissingVideos[Math.floor(Math.random() * kissingVideos.length)];

cmd(
    {
        pattern: "kiss2",
        desc: "Send a kiss reaction video.",
        category: "fun",
        react: "💋",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message;
            if (mentionedUser) {
                let target = `@${mentionedUser.split("@")[0]}`;
                message = `${sender} kissed ${target} 💋`;
            } else if (isGroup) {
                message = `${sender} kissed everyone 💋`;
            } else {
                message = `> 𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟 🖤`;
            }

            // Get random video from array
            const randomVideo = getRandomKissVideo();

            // Send video directly from URL
            await conn.sendMessage(
                mek.chat,
                { 
                    video: { url: randomVideo }, 
                    caption: message, 
                    gifPlayback: true, 
                    mentions: [mek.sender, mentionedUser].filter(Boolean) 
                },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .kiss command:", error);
            reply(`❌ *Error in .kiss command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);
