// ==================== EPHOTO/LOGO GENERATOR - ALL STYLES ====================
import axios from 'axios';
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// ==================== STYLE 1: ADVANCED GLOW ====================
cmd({
    pattern: "advglow",
    alias: ["advancedglow", "glow1"],
    desc: "Advanced glow text effect",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "✨",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*✨ Advanced Glow*\n\n*Usage:* .advglow <text>\n*Example:* .advglow ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/advancedglow?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Advanced Glow` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 2: AMONG US TEXT ====================
cmd({
    pattern: "amongus",
    alias: ["amongustext", "among"],
    desc: "Among Us style text",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "🎮",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*🎮 Among Us Text*\n\n*Usage:* .amongus <text>\n*Example:* .amongus ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/amongustext?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Among Us` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 3: BLACKPINK LOGO ====================
cmd({
    pattern: "bplogo",
    alias: ["blackpinklogo", "bp"],
    desc: "Blackpink logo style",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "🖤",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*🖤 Blackpink Logo*\n\n*Usage:* .bplogo <text>\n*Example:* .bplogo ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/blackpinklogo?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Blackpink Logo` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 4: BLACKPINK STYLE ====================
cmd({
    pattern: "bpstyle",
    alias: ["blackpinkstyle", "bpstyle1"],
    desc: "Blackpink text style",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "💗",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*💗 Blackpink Style*\n\n*Usage:* .bpstyle <text>\n*Example:* .bpstyle ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/blackpinkstyle?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Blackpink Style` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 5: CARTOON STYLE ====================
cmd({
    pattern: "cartoonstyle",
    alias: ["cartoonstyle", "cartoontxt"],
    desc: "Cartoon text style",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "🎨",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*🎨 Cartoon Style*\n\n*Usage:* .cartoon <text>\n*Example:* .cartoon ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/cartoonstyle?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Cartoon` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 6: DELETING TEXT ====================
cmd({
    pattern: "deletetxt",
    alias: ["deletingtext", "deltext"],
    desc: "Deleting text effect",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "💫",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*💫 Deleting Text*\n\n*Usage:* .deletetxt <text>\n*Example:* .deletetxt ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/deletingtext?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Deleting Text` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 7: EFFECT CLOUDS ====================
cmd({
    pattern: "clouds",
    alias: ["effectclouds", "cloudtxt"],
    desc: "Clouds text effect",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "☁️",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*☁️ Effect Clouds*\n\n*Usage:* .clouds <text>\n*Example:* .clouds ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/effectclouds?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Clouds Effect` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 8: FLAG 3D TEXT ====================
cmd({
    pattern: "flag3d",
    alias: ["flag3dtext", "3dflag"],
    desc: "Flag 3D text effect",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "🚩",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*🚩 Flag 3D Text*\n\n*Usage:* .flag3d <text>\n*Example:* .flag3d ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/flag3dtext?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Flag 3D` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 9: FREE CREATE ====================
cmd({
    pattern: "freecreate",
    alias: ["freecreate1", "fc"],
    desc: "Free create text effect",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "🎯",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*🎯 Free Create*\n\n*Usage:* .freecreate <text>\n*Example:* .freecreate ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/freecreate?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Free Create` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 10: GALAXY STYLE ====================
cmd({
    pattern: "galaxy",
    alias: ["galaxystyle", "galaxytxt"],
    desc: "Galaxy text style",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "🌌",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*🌌 Galaxy Style*\n\n*Usage:* .galaxy <text>\n*Example:* .galaxy ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/galaxystyle?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Galaxy` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 11: GALAXY WALLPAPER ====================
cmd({
    pattern: "galaxywp",
    alias: ["galaxywallpaper", "gwp"],
    desc: "Galaxy wallpaper text",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "🌠",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*🌠 Galaxy Wallpaper*\n\n*Usage:* .galaxywp <text>\n*Example:* .galaxywp ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/galaxywallpaper?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Galaxy Wallpaper` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 12: GLITCH TEXT ====================
cmd({
    pattern: "glitch",
    alias: ["glitchtext", "glitchtxt"],
    desc: "Glitch text effect",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "⚡",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*⚡ Glitch Text*\n\n*Usage:* .glitch <text>\n*Example:* .glitch ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/glitchtext?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Glitch` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 13: GLOWING TEXT ====================
cmd({
    pattern: "glow",
    alias: ["glowingtext", "glowtxt"],
    desc: "Glowing text effect",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "🌟",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*🌟 Glowing Text*\n\n*Usage:* .glow <text>\n*Example:* .glow ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/glowingtext?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Glowing Text` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 14: GRADIENT TEXT ====================
cmd({
    pattern: "gradient",
    alias: ["gradienttext", "gradtxt"],
    desc: "Gradient text effect",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "🌈",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*🌈 Gradient Text*\n\n*Usage:* .gradient <text>\n*Example:* .gradient ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/gradienttext?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Gradient Text` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 15: LIGHT EFFECTS ====================
cmd({
    pattern: "lightfx",
    alias: ["lighteffects", "lighteffect"],
    desc: "Light effects text",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "💡",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*💡 Light Effects*\n\n*Usage:* .lightfx <text>\n*Example:* .lightfx ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/lighteffects?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Light Effects` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 16: LOGO MAKER ====================
cmd({
    pattern: "logomaker",
    alias: ["logomk", "mklogo"],
    desc: "Logo maker text",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "🔱",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*🔱 Logo Maker*\n\n*Usage:* .logomaker <text>\n*Example:* .logomaker ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/logomaker?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Logo Maker` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 17: LUXURY GOLD ====================
cmd({
    pattern: "luxurygold",
    alias: ["gold", "goldtxt"],
    desc: "Luxury gold text",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "👑",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*👑 Luxury Gold*\n\n*Usage:* .luxurygold <text>\n*Example:* .luxurygold ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/luxurygold?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Luxury Gold` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 18: MAKING NEON ====================
cmd({
    pattern: "neon",
    alias: ["makingneon", "neontxt"],
    desc: "Neon text effect",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "💚",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*💚 Making Neon*\n\n*Usage:* .neon <text>\n*Example:* .neon ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/makingneon?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Neon` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 19: PAPER CUT STYLE ====================
cmd({
    pattern: "papercut",
    alias: ["papercutstyle", "pcut"],
    desc: "Paper cut text style",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "✂️",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*✂️ Paper Cut Style*\n\n*Usage:* .papercut <text>\n*Example:* .papercut ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/papercutstyle?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Paper Cut` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 20: PIXEL GLITCH ====================
cmd({
    pattern: "pixelglitch",
    alias: ["pixel", "pglitch"],
    desc: "Pixel glitch text effect",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "👾",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*👾 Pixel Glitch*\n\n*Usage:* .pixelglitch <text>\n*Example:* .pixelglitch ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/pixelglitch?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Pixel Glitch` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 21: ROYAL TEXT ====================
cmd({
    pattern: "royal",
    alias: ["royaltext", "royaltxt"],
    desc: "Royal text style",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "🤴",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*🤴 Royal Text*\n\n*Usage:* .royal <text>\n*Example:* .royal ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/royaltext?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Royal Text` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 22: SAND SUMMER ====================
cmd({
    pattern: "sand",
    alias: ["sandsummer", "sandtxt"],
    desc: "Sand summer text effect",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "🏖️",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*🏖️ Sand Summer*\n\n*Usage:* .sand <text>\n*Example:* .sand ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/sandsummer?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Sand Summer` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 23: TYPOGRAPHY TEXT ====================
cmd({
    pattern: "typography",
    alias: ["typographytext", "typo"],
    desc: "Typography text effect",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "📝",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*📝 Typography Text*\n\n*Usage:* .typography <text>\n*Example:* .typography ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/typographytext?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Typography` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 24: SUMMER BEACH ====================
cmd({
    pattern: "beach",
    alias: ["summerbeach", "beachtxt"],
    desc: "Summer beach text effect",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "🌊",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*🌊 Summer Beach*\n\n*Usage:* .beach <text>\n*Example:* .beach ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/summerbeach?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Summer Beach` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 25: UNDERWATER TEXT ====================
cmd({
    pattern: "underwater",
    alias: ["underwatertext", "uwtxt"],
    desc: "Underwater text effect",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "🐠",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*🐠 Underwater Text*\n\n*Usage:* .underwater <text>\n*Example:* .underwater ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/underwatertext?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Underwater` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 26: WATERCOLOR TEXT ====================
cmd({
    pattern: "watercolor",
    alias: ["watercolortext", "wctxt"],
    desc: "Watercolor text effect",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "🎨",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*🎨 Watercolor Text*\n\n*Usage:* .watercolor <text>\n*Example:* .watercolor ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/watercolortext?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Watercolor` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ==================== STYLE 27: WRITE TEXT ====================
cmd({
    pattern: "write",
    alias: ["writetext", "writetxt"],
    desc: "Write text effect",
    category: " ̶ͨ ̶ͧ ̶ͭ ̶ͤ➸⃝ 𝙇𝙊𝙂𝙊 𝙉𝘼𝙈𝙀 ",
    react: "✍️",
    filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("*✍️ Write Text*\n\n*Usage:* .write <text>\n*Example:* .write ERFAN-MD");
        const text = args.join('+');
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/ephoto/writetext?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (response.data.status !== 'success') throw new Error('API error');
        const imageResponse = await axios.get(response.data.image, { responseType: 'arraybuffer', timeout: 30000 });
        await conn.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: `*✅ Generated!*\n📝 *Text:* ${args.join(' ')}\n🎨 *Style:* Write Text` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Error:* ${e.message}`);
    }
});
