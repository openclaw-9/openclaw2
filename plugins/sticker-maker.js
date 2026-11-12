// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
import crypto from 'crypto';
import webp from 'node-webpmux';
import axios from 'axios';
import fs from 'fs-extra';
import { exec } from 'child_process';
import { Sticker, createSticker, StickerTypes } from 'wa-sticker-formatter';
import Config from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Take Sticker

cmd(
    {
        pattern: 'take',
        alias: ['rename', 'stake'],
        desc: 'Create a sticker with a custom pack name.',
        category: 'sticker',
        use: '<reply media or URL>',
        filename: __filename,
    },
    async (conn, mek, m, { quoted, args, q, reply, from }) => {
        if (!mek.quoted) return reply(`*Reply to any sticker.*`);
        if (!q) return reply(`*Please provide a pack name using .take <packname>*`);

        let mime = mek.quoted.mtype;
        let pack = q;

        if (mime === "imageMessage" || mime === "stickerMessage") {
            let media = await mek.quoted.download();
            let sticker = new Sticker(media, {
                pack: pack, 
                type: StickerTypes.FULL,
                categories: ["🤩", "🎉"],
                id: "12345",
                quality: 75,
                background: 'transparent',
            });
            const buffer = await sticker.toBuffer();
            return conn.sendMessage(mek.chat, { sticker: buffer }, { quoted: mek });
        } else {
            return reply("*Uhh, Please reply to an image.*");
        }
    }
);

//Sticker create 

cmd(
    {
        pattern: 'sticker',
        alias: ['s', 'stickergif'],
        desc: 'Create a sticker from an image, video, or URL.',
        category: 'sticker',
        use: '<reply media or URL>',
        filename: __filename,
    },
    async (conn, mek, m, { quoted, args, q, reply, from }) => {
        if (!mek.quoted) return reply(`*Reply to any Image or Video, Sir.*`);
        let mime = mek.quoted.mtype;
        let pack = Config.STICKER_NAME || "Jawad TechX";
        
        if (mime === "imageMessage" || mime === "stickerMessage") {
            let media = await mek.quoted.download();
            let sticker = new Sticker(media, {
                pack: pack, 
                type: StickerTypes.FULL,
                categories: ["🤩", "🎉"], 
                id: "12345",
                quality: 75, 
                background: 'transparent',
            });
            const buffer = await sticker.toBuffer();
            return conn.sendMessage(mek.chat, { sticker: buffer }, { quoted: mek });
        } else {
            return reply("*Uhh, Please reply to an image.*");
        }
    }
);

// Photo — Sticker ko wapas Photo/Image mein convert karta hai
// (Reply to a sticker with .photo — bot us sticker ki photo bana kar bhej dega)

const convertStickerToPhoto = (mediaBuffer) => {
    return new Promise(async (resolve, reject) => {
        try {
            const tmpDir = path.join(__dirname, '../tmp');
            fs.ensureDirSync(tmpDir);

            const inputPath = path.join(tmpDir, `photo_${Date.now()}_${Math.floor(Math.random() * 10000)}.webp`);
            fs.writeFileSync(inputPath, mediaBuffer);

            // Animated sticker check (node-webpmux se) — animated ho to mp4, warna png
            let isAnimated = false;
            try {
                const webpImage = new webp.Image();
                await webpImage.load(mediaBuffer);
                isAnimated = !!webpImage.anim;
            } catch (e) {
                isAnimated = false;
            }

            if (isAnimated) {
                // Animated sticker -> short video (mp4)
                const outputPath = inputPath.replace('.webp', '.mp4');
                exec(
                    `ffmpeg -y -i "${inputPath}" -movflags faststart -pix_fmt yuv420p -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2" "${outputPath}"`,
                    async (err) => {
                        try {
                            if (err) {
                                fs.remove(inputPath).catch(() => {});
                                return reject(new Error('ffmpeg convert failed'));
                            }
                            const buffer = fs.readFileSync(outputPath);
                            fs.remove(inputPath).catch(() => {});
                            fs.remove(outputPath).catch(() => {});
                            resolve({ buffer, isAnimated: true });
                        } catch (e) {
                            reject(e);
                        }
                    }
                );
            } else {
                // Static sticker -> photo (png)
                const outputPath = inputPath.replace('.webp', '.png');
                exec(
                    `ffmpeg -y -i "${inputPath}" "${outputPath}"`,
                    async (err) => {
                        try {
                            if (err) {
                                fs.remove(inputPath).catch(() => {});
                                return reject(new Error('ffmpeg convert failed'));
                            }
                            const buffer = fs.readFileSync(outputPath);
                            fs.remove(inputPath).catch(() => {});
                            fs.remove(outputPath).catch(() => {});
                            resolve({ buffer, isAnimated: false });
                        } catch (e) {
                            reject(e);
                        }
                    }
                );
            }
        } catch (e) {
            reject(e);
        }
    });
};

cmd(
    {
        pattern: 'photo',
        alias: ['toimg', 'toimage'],
        desc: 'Convert a sticker into a photo.',
        category: 'sticker',
        use: '<reply a sticker>',
        filename: __filename,
    },
    async (conn, mek, m, { quoted, reply, from }) => {
        try {
            if (!mek.quoted) return reply(`*Reply to any sticker.*`);

            const mime = mek.quoted.mtype;

            if (mime === 'stickerMessage') {
                const media = await mek.quoted.download();
                if (!media) return reply(`*Failed to download sticker.*`);

                const { buffer, isAnimated } = await convertStickerToPhoto(media);

                if (isAnimated) {
                    // Animated sticker ki video bhejo
                    return conn.sendMessage(
                        from,
                        { video: buffer, mimetype: 'video/mp4', caption: `*Here is your video!*` },
                        { quoted: mek }
                    );
                }

                // Static sticker ki photo bhejo
                return conn.sendMessage(
                    from,
                    { image: buffer, caption: `*Here is your photo!*` },
                    { quoted: mek }
                );
            }

            if (mime === 'imageMessage') {
                // Image par .photo kiya to wahi image wapas bhej do
                const media = await mek.quoted.download();
                if (!media) return reply(`*Failed to download image.*`);
                return conn.sendMessage(from, { image: media, caption: `*Here is your photo!*` }, { quoted: mek });
            }

            return reply(`*Uhh, Please reply to a sticker.*`);
        } catch (error) {
            console.error('Photo command error:', error);
            return reply(`*Failed to convert sticker to photo. Please try again.*`);
        }
    }
);
