// ==================== SREACT COMMAND ====================
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Random reaction emojis
const reactions = [
    "❤️", "😂", "😍", "😢", "😡",
    "👍", "🔥", "🥰", "👏", "😁",
    "💯", "🤩", "😎", "🤝", "✨"
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

cmd({
    pattern: "sreact",
    alias: ["spamreact", "reactspam", "rreact"],
    desc: "React repeatedly to a replied message",
    category: "fun",
    react: "❤️",
    filename: __filename,
}, async (conn, mek, m, { from, q, reply }) => {

    try {

        // Check if user replied to a message
        if (!m.quoted) {
            return reply(
                "❌ *Please reply to a message!*\n\n" +
                "> *Example:* Reply to a message with\n" +
                "`.sreact 20`"
            );
        }

        // Get amount from command
        let amount = parseInt(q);

        if (!amount || amount < 1) {
            amount = 10;
        }

        // Safety limit
        if (amount > 50) {
            amount = 50;
        }

        const quoted = m.quoted;

        await conn.sendMessage(from, {
            react: {
                text: "⏳",
                key: mek.key
            }
        });

        // Send reactions
        for (let i = 0; i < amount; i++) {

            const emoji = reactions[
                Math.floor(Math.random() * reactions.length)
            ];

            await conn.sendMessage(from, {
                react: {
                    text: emoji,
                    key: quoted.key
                }
            });

            // Small delay between reactions
            await sleep(350);
        }

        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: mek.key
            }
        });

        return reply(
            `✅ *Reaction completed!*\n\n` +
            `> *Total reactions:* ${amount}\n` +
            `> *🚀 Powered by ERFAN-MD*`
        );

    } catch (error) {

        console.error("SReact Error:", error);

        await conn.sendMessage(from, {
            react: {
                text: "❌",
                key: mek.key
            }
        });

        return reply(
            `❌ *Failed to send reactions!*\n\n` +
            `> ${error.message || "Unknown error"}`
        );
    }

});
