// ERFAN-MD
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// ERFAN-MD


// Video URLs Array
const romanticVideos = [
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
const getRandomVideo = () => romanticVideos[Math.floor(Math.random() * romanticVideos.length)];

// ============================================
// COMMAND 1: ROMANTIC
// ============================================
cmd({
  pattern: "romantic",
  alias: ["romancevid"],
  desc: "Get romantic video",
  react: "💕",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "💕 *Romantic Moments* 💕"
  }, { quoted: mek });
});

// ============================================
// COMMAND 2: COUPLE
// ============================================
cmd({
  pattern: "couple",
  alias: ["couplevid"],
  desc: "Get couple romantic video",
  react: "👫",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "👫 *Couple Goals* 👫"
  }, { quoted: mek });
});

// ============================================
// COMMAND 3: ROMANCE
// ============================================
cmd({
  pattern: "romance",
  alias: ["romanceclip"],
  desc: "Pure romance video",
  react: "❤️",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "❤️ *Pure Romance* ❤️"
  }, { quoted: mek });
});

// ============================================
// COMMAND 4: INTIMATE
// ============================================
cmd({
  pattern: "intimate",
  alias: ["intimacy"],
  desc: "Intimate moments video",
  react: "💋",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "💋 *Intimate Moments* 💋"
  }, { quoted: mek });
});

// ============================================
// COMMAND 5: FIRSTNIGHT
// ============================================
cmd({
  pattern: "firstnight",
  alias: ["pehlirat"],
  desc: "First night romantic video",
  react: "🌙",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🌙 *First Night Special* 🌙"
  }, { quoted: mek });
});

// ============================================
// COMMAND 6: SUHAGRAAT
// ============================================
cmd({
  pattern: "suhagraat",
  alias: ["weddingnight"],
  desc: "Suhagraat romantic video",
  react: "💐",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "💐 *Suhagraat Moments* 💐"
  }, { quoted: mek });
});

// ============================================
// COMMAND 7: BEDROOM
// ============================================
cmd({
  pattern: "bedroom",
  alias: ["bedroomscene"],
  desc: "Bedroom romance video",
  react: "🛏️",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🛏️ *Bedroom Romance* 🛏️"
  }, { quoted: mek });
});

// ============================================
// COMMAND 8: CUDDLE
// ============================================
cmd({
  pattern: "cuddle",
  alias: ["cuddling"],
  desc: "Cuddling moments video",
  react: "🤗",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🤗 *Cuddling Time* 🤗"
  }, { quoted: mek });
});

// ============================================
// COMMAND 9: PASSIONATE
// ============================================
cmd({
  pattern: "passionate",
  alias: ["passion"],
  desc: "Passionate moments video",
  react: "🔥",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🔥 *Passionate Love* 🔥"
  }, { quoted: mek });
});

// ============================================
// COMMAND 10: LOVERS
// ============================================
cmd({
  pattern: "lovers",
  alias: ["loversvid"],
  desc: "Lovers romantic video",
  react: "💑",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "💑 *True Lovers* 💑"
  }, { quoted: mek });
});

// ============================================
// COMMAND 11: ROMANCING
// ============================================
cmd({
  pattern: "romancing",
  alias: ["romantictime"],
  desc: "Romancing video",
  react: "😘",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "😘 *Romancing Moments* 😘"
  }, { quoted: mek });
});

// ============================================
// COMMAND 12: TOGETHER
// ============================================
cmd({
  pattern: "together",
  alias: ["togetherness"],
  desc: "Together romantic video",
  react: "💞",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "💞 *Together Forever* 💞"
  }, { quoted: mek });
});

// ============================================
// COMMAND 13: PRIVATE
// ============================================
cmd({
  pattern: "private",
  alias: ["privatemoments"],
  desc: "Private moments video",
  react: "🔒",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🔒 *Private Moments* 🔒"
  }, { quoted: mek });
});

// ============================================
// COMMAND 14: CLOSENESS
// ============================================
cmd({
  pattern: "closeness",
  alias: ["close"],
  desc: "Closeness romantic video",
  react: "🫂",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🫂 *Closeness* 🫂"
  }, { quoted: mek });
});

// ============================================
// COMMAND 15: EMBRACE
// ============================================
cmd({
  pattern: "embrace",
  alias: ["embracing"],
  desc: "Embrace romantic video",
  react: "🤲",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🤲 *Warm Embrace* 🤲"
  }, { quoted: mek });
});

// ============================================
// COMMAND 16: TENDER
// ============================================
cmd({
  pattern: "tender",
  alias: ["tenderlove"],
  desc: "Tender moments video",
  react: "🌺",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🌺 *Tender Love* 🌺"
  }, { quoted: mek });
});

// ============================================
// COMMAND 17: AFFECTION
// ============================================
cmd({
  pattern: "affection",
  alias: ["affectionate"],
  desc: "Affection romantic video",
  react: "💗",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "💗 *Pure Affection* 💗"
  }, { quoted: mek });
});

// ============================================
// COMMAND 18: LOVESCENE
// ============================================
cmd({
  pattern: "lovescene",
  alias: ["romanticscene"],
  desc: "Love scene video",
  react: "🎬",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🎬 *Love Scene* 🎬"
  }, { quoted: mek });
});

// ============================================
// COMMAND 19: COZY
// ============================================
cmd({
  pattern: "cozy",
  alias: ["cozymoments"],
  desc: "Cozy romantic video",
  react: "☕",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "☕ *Cozy Moments* ☕"
  }, { quoted: mek });
});

// ============================================
// COMMAND 20: WARMTH
// ============================================
cmd({
  pattern: "warmth",
  alias: ["warm"],
  desc: "Warmth romantic video",
  react: "🌟",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🌟 *Warmth of Love* 🌟"
  }, { quoted: mek });
});

// ============================================
// COMMAND 21: CHEMISTRY
// ============================================
cmd({
  pattern: "chemistry",
  alias: ["lovechemistry"],
  desc: "Chemistry romantic video",
  react: "⚗️",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "⚗️ *Perfect Chemistry* ⚗️"
  }, { quoted: mek });
});

// ============================================
// COMMAND 22: SPARK
// ============================================
cmd({
  pattern: "spark",
  alias: ["lovespark"],
  desc: "Spark romantic video",
  react: "✨",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "✨ *Love Spark* ✨"
  }, { quoted: mek });
});

// ============================================
// COMMAND 23: DESIRE
// ============================================
cmd({
  pattern: "desire",
  alias: ["desiring"],
  desc: "Desire romantic video",
  react: "🌹",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🌹 *Deep Desire* 🌹"
  }, { quoted: mek });
});

// ============================================
// COMMAND 24: ATTRACTION
// ============================================
cmd({
  pattern: "attraction",
  alias: ["attract"],
  desc: "Attraction romantic video",
  react: "🧲",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🧲 *Magnetic Attraction* 🧲"
  }, { quoted: mek });
});

// ============================================
// COMMAND 25: TEMPTATION
// ============================================
cmd({
  pattern: "temptation",
  alias: ["tempting"],
  desc: "Temptation romantic video",
  react: "😈",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "😈 *Sweet Temptation* 😈"
  }, { quoted: mek });
});

// ============================================
// COMMAND 26: SEDUCTION
// ============================================
cmd({
  pattern: "seduction",
  alias: ["seduce"],
  desc: "Seduction romantic video",
  react: "😏",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "😏 *Art of Seduction* 😏"
  }, { quoted: mek });
});

// ============================================
// COMMAND 27: ENCHANT
// ============================================
cmd({
  pattern: "enchant",
  alias: ["enchanting"],
  desc: "Enchanting romantic video",
  react: "🪄",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🪄 *Enchanting Love* 🪄"
  }, { quoted: mek });
});

// ============================================
// COMMAND 28: ALLURE
// ============================================
cmd({
  pattern: "allure",
  alias: ["alluring"],
  desc: "Allure romantic video",
  react: "💫",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "💫 *Pure Allure* 💫"
  }, { quoted: mek });
});

// ============================================
// COMMAND 29: CAPTIVATE
// ============================================
cmd({
  pattern: "captivate",
  alias: ["captivating"],
  desc: "Captivating romantic video",
  react: "🎯",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🎯 *Captivating Moments* 🎯"
  }, { quoted: mek });
});

// ============================================
// COMMAND 30: MESMERIZE
// ============================================
cmd({
  pattern: "mesmerize",
  alias: ["mesmerizing"],
  desc: "Mesmerizing romantic video",
  react: "🌀",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🌀 *Mesmerizing Love* 🌀"
  }, { quoted: mek });
});

// ============================================
// COMMAND 31: INFATUATION
// ============================================
cmd({
  pattern: "infatuation",
  alias: ["infatuated"],
  desc: "Infatuation romantic video",
  react: "😍",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "😍 *Sweet Infatuation* 😍"
  }, { quoted: mek });
});

// ============================================
// COMMAND 32: FASCINATION
// ============================================
cmd({
  pattern: "fascination",
  alias: ["fascinating"],
  desc: "Fascinating romantic video",
  react: "🎭",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🎭 *Fascinating Love* 🎭"
  }, { quoted: mek });
});

// ============================================
// COMMAND 33: CHARM
// ============================================
cmd({
  pattern: "charm",
  alias: ["charming"],
  desc: "Charming romantic video",
  react: "🎪",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🎪 *Charming Moments* 🎪"
  }, { quoted: mek });
});

// ============================================
// COMMAND 34: ROMANCE1
// ============================================
cmd({
  pattern: "romance1",
  alias: ["rom1"],
  desc: "Romance video 1",
  react: "💖",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "💖 *Romance Series 1* 💖"
  }, { quoted: mek });
});

// ============================================
// COMMAND 35: ROMANCE2
// ============================================
cmd({
  pattern: "romance2",
  alias: ["rom2"],
  desc: "Romance video 2",
  react: "💝",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "💝 *Romance Series 2* 💝"
  }, { quoted: mek });
});

// ============================================
// COMMAND 36: ROMANCE3
// ============================================
cmd({
  pattern: "romance3",
  alias: ["rom3"],
  desc: "Romance video 3",
  react: "💓",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "💓 *Romance Series 3* 💓"
  }, { quoted: mek });
});

// ============================================
// COMMAND 37: HOTCOUPLE
// ============================================
cmd({
  pattern: "hotcouple",
  alias: ["couplegoals"],
  desc: "Hot couple video",
  react: "🔥",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🔥 *Hot Couple* 🔥"
  }, { quoted: mek });
});

// ============================================
// COMMAND 38: LOVEBIRDS
// ============================================
cmd({
  pattern: "lovebirds",
  alias: ["birds"],
  desc: "Lovebirds romantic video",
  react: "🕊️",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🕊️ *Lovebirds* 🕊️"
  }, { quoted: mek });
});

// ============================================
// COMMAND 39: SWEETHEARTS
// ============================================
cmd({
  pattern: "sweethearts",
  alias: ["sweetheart"],
  desc: "Sweethearts romantic video",
  react: "🍭",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🍭 *Sweethearts* 🍭"
  }, { quoted: mek });
});

// ============================================
// COMMAND 40: DARLING
// ============================================
cmd({
  pattern: "darling",
  alias: ["mydarling"],
  desc: "Darling romantic video",
  react: "🌷",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🌷 *My Darling* 🌷"
  }, { quoted: mek });
});

// ============================================
// COMMAND 41: BELOVED
// ============================================
cmd({
  pattern: "beloved",
  alias: ["mybeloved"],
  desc: "Beloved romantic video",
  react: "🌸",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🌸 *My Beloved* 🌸"
  }, { quoted: mek });
});

// ============================================
// COMMAND 42: SWEETHEART
// ============================================
cmd({
  pattern: "sweetheart",
  alias: ["mysweetheart"],
  desc: "Sweetheart romantic video",
  react: "🍬",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🍬 *My Sweetheart* 🍬"
  }, { quoted: mek });
});

// ============================================
// COMMAND 43: MYLOVE
// ============================================
cmd({
  pattern: "mylove",
  alias: ["truelove"],
  desc: "My love romantic video",
  react: "❣️",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "❣️ *My True Love* ❣️"
  }, { quoted: mek });
});

// ============================================
// COMMAND 44: MYJAAN
// ============================================
cmd({
  pattern: "myjaan",
  alias: ["jaan"],
  desc: "My jaan romantic video",
  react: "💌",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "💌 *Meri Jaan* 💌"
  }, { quoted: mek });
});

// ============================================
// COMMAND 45: HEARTBEAT
// ============================================
cmd({
  pattern: "heartbeat",
  alias: ["myheartbeat"],
  desc: "Heartbeat romantic video",
  react: "💗",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "💗 *My Heartbeat* 💗"
  }, { quoted: mek });
});

// ============================================
// COMMAND 46: SOULMATE
// ============================================
cmd({
  pattern: "soulmate",
  alias: ["mysoulmate"],
  desc: "Soulmate romantic video",
  react: "🌟",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🌟 *My Soulmate* 🌟"
  }, { quoted: mek });
});

// ============================================
// COMMAND 47: FOREVER
// ============================================
cmd({
  pattern: "forever",
  alias: ["foreverlove"],
  desc: "Forever romantic video",
  react: "♾️",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "♾️ *Forever Together* ♾️"
  }, { quoted: mek });
});

// ============================================
// COMMAND 48: ETERNAL
// ============================================
cmd({
  pattern: "eternal",
  alias: ["eternallove"],
  desc: "Eternal love romantic video",
  react: "🎆",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🎆 *Eternal Love* 🎆"
  }, { quoted: mek });
});

// ============================================
// COMMAND 49: PASSION
// ============================================
cmd({
  pattern: "passion",
  alias: ["passionlove"],
  desc: "Passion romantic video",
  react: "🌶️",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "🌶️ *Passionate Moments* 🌶️"
  }, { quoted: mek });
});

// ============================================
// COMMAND 50: INTENSE
// ============================================
cmd({
  pattern: "intense",
  alias: ["intenselove"],
  desc: "Intense romantic video",
  react: "⚡",
  category: "hot",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(mek.chat, { 
    video: { url: getRandomVideo() },
    caption: "⚡ *Intense Love* ⚡"
  }, { quoted: mek });
});