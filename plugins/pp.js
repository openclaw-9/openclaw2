// plugins/fullpp.js
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import { Jimp } from 'jimp';

const S_WHATSAPP_NET = '@s.whatsapp.net';
const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "fullpp",
    alias: ["setpp", "setdp", "pp", "setppbot"],
    react: "🖼️",
    desc: "Owner Only - Set bot's profile picture (original aspect ratio)",
    category: "owner",
    filename: __filename
}, async (client, message, m, { from, isCreator }) => {
    try {
        if (!isCreator) {
            return await client.sendMessage(from, { text: "*📛 This is an owner command.*" }, { quoted: message });
        }
        if (!m.quoted || m.quoted.mtype !== "imageMessage") {
            return await client.sendMessage(from, { text: "*🍁 Please reply to an image with .fullpp*" }, { quoted: message });
        }

        // 1. Download the image
        const buffer = await m.quoted.download();

        // 2. Same logic as that bot — read → no-op crop → scaleToFit(720,720) → JPEG
        const jimp = await Jimp.read(buffer);
        const w = jimp.width;
        const h = jimp.height;
        jimp.crop({ x: 0, y: 0, w, h });                    // no-op crop (whole image)
        jimp.scaleToFit({ w: 720, h: 720 });                // scale to max 720, KEEPS aspect
        const img = await jimp.getBuffer('image/jpeg', { quality: 80 });

        // 3. Send IQ — same as the bot
        await client.query({
            tag: 'iq',
            attrs: { target: undefined, to: S_WHATSAPP_NET, type: 'set', xmlns: 'w:profile:picture' },
            content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }]
        });

        await client.sendMessage(from, { text: "*✅ Bot's profile picture updated successfully!*" }, { quoted: message });
    } catch (error) {
        console.error("fullpp Error:", error);
        await client.sendMessage(from, { text: "❌ Error updating profile picture:\n" + error.message }, { quoted: message });
    }
});
