// ERFAN MD 
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "aiimage",
    alias: ["genimage", "imagine", "aiimg", "dalle"],
    desc: "Generate AI images from text prompts",
    category: "ai",
    react: "🎨",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) {
            return reply("🎨 Please provide a prompt to generate an image!\n\n*Example:* `.aiimage cute cat driving a sports car`");
        }

        // Sending initial loading reaction/message
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Encode the payload matching the API requirements
        const payload = JSON.stringify({ prompt: text });
        const apiUrl = `https://api-xemoz-official.my.id/api/ai/ai-image.php?prompt=${encodeURIComponent(payload)}`;

        const response = await axios.get(apiUrl, { timeout: 60000 });

        if (response.data && response.data.status && response.data.result?.url) {
            const imageUrl = response.data.result.url;

            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: `🎨 *AI IMAGE GENERATOR*\n\n📝 *Prompt:* ${text}\n\n> Powered by ERFAN-MD`
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
        } else {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ Failed to generate image. Please try again with a different prompt.");
        }

    } catch (e) {
        console.error("Error in aiimage command:", e.message);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ An error occurred while generating the image. Please try again later!");
    }
});
