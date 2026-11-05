// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// RESPECT CATEGORY - ALL 70 COMMANDS (FIXED)
// ============================================

// 1. RESPECT
cmd({
  pattern: "respect",
  alias: ["izzat", "respect1"],
  desc: "Give respect to someone",
  react: "🫡",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args, text }) => {
  let mention;
  
  if (quoted) {
    mention = quoted.sender;
  } else if (m.mentionedJid && m.mentionedJid[0]) {
    mention = m.mentionedJid[0];
  } else if (args[0]) {
    mention = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  } else {
    mention = sender;
  }
  
  const messages = [
    `*🫡 RESPECT SALUTE 🫡*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ko full respect diya!\n\n*"Izzat dene walon ki izzat Allah bhi karta hai!"* ✨`,
    `*👑 RESPECT KING 👑*\n\n@${mention.split("@")[0]} aap ko @${sender.split("@")[0]} ki taraf se salami!\n\n*"Respect is earned, not demanded!"* 💯`,
    `*🌟 TAZEEM 🌟*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ke liye haath jode!\n\n*"Aapki shakhsiyat qabil-e-ehtram hai!"* 🙏`
  ];
  
  await conn.sendMessage(mek.chat, {
    text: messages[Math.floor(Math.random() * messages.length)],
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 2. SALUTE
cmd({
  pattern: "salute",
  alias: ["salami", "respect2"],
  desc: "Give military style salute",
  react: "🎖️",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🎖️ MILITARY SALUTE 🎖️*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ko faujio waali salute di!\n\n*"Salute to your dedication!"* 🫡\n\n_Bahaduri aur izzat ka paighaam!_ ⚔️`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 3. SALAM
cmd({
  pattern: "salam",
  alias: ["assalam", "respect3"],
  desc: "Islamic greeting with respect",
  react: "☪️",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*☪️ ASSALAM-O-ALAIKUM ☪️*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ko adab se salam kiya!\n\n*"السلام علیکم ورحمۃ اللہ وبرکاتہ"*\n\n_Sukoon aur barkat ka paigham!_ 🤲`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 4. ADAB
cmd({
  pattern: "adab",
  alias: ["aadab", "respect4"],
  desc: "Traditional Urdu greeting",
  react: "🙏",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🙏 ADAB ARZ HAI 🙏*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ko tehzeeb se adab kiya!\n\n*"Adab pehli ibadat hai!"*\n\n_Khoobsurti adab mein hai!_ 🌹`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 5. JAZAKALLAH
cmd({
  pattern: "jazakallah",
  alias: ["jzk", "respect5"],
  desc: "Islamic way to thank someone",
  react: "🤲",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🤲 JAZAKALLAH KHAIR 🤲*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ka shukriya ada kiya!\n\n*"جَزَاكَ اللهُ خَيْرًا"*\n_"Allah aapko behtar jaza de!"_\n\nAapki mehrbani qabil-e-taarif hai! 💚`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 6. SHUKRIA
cmd({
  pattern: "shukria",
  alias: ["shukriya", "respect6"],
  desc: "Thank someone in Urdu",
  react: "💝",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  const messages = [
    `*💝 SHUKRIA 💝*\n\n@${sender.split("@")[0]} dil se @${mention.split("@")[0]} ka shukar guzar hai!\n\n*"Aapki mehrbani kabhi nahi bhoolunga!"* 🙏`,
    `*🌸 BOHOT SHUKRIA 🌸*\n\n@${mention.split("@")[0]} aapka ehsan hai @${sender.split("@")[0]} par!\n\n*"Neki karne waale ko yaad rakha jata hai!"* ✨`,
    `*💖 THANK YOU 💖*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ke احسان ko yaad kiya!\n\n*"Shukr guzari ek azeem sifat hai!"* 🌟`
  ];
  
  await conn.sendMessage(mek.chat, {
    text: messages[Math.floor(Math.random() * messages.length)],
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 7. THANKYOU
cmd({
  pattern: "thankyou",
  alias: ["ty", "respect7", "thanks"],
  desc: "Thank someone politely",
  react: "🙏",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🙏 THANK YOU SO MUCH 🙏*\n\n@${sender.split("@")[0]} is very grateful to @${mention.split("@")[0]}!\n\n*"Your kindness means the world!"* 💫\n\n_Aapki madad aur pyaar ke liye dil se shukriya!_ 💝`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 8. SORRY
cmd({
  pattern: "sorry",
  alias: ["sorryji", "respect8"],
  desc: "Apologize to someone",
  react: "🥺",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  const messages = [
    `*🥺 I'M TRULY SORRY 🥺*\n\n@${sender.split("@")[0]} dil se @${mention.split("@")[0]} se maafi maang raha hai!\n\n*"Galti se galti ho jati hai, maaf kar do!"* 🙏\n\n_Please maaf kar do yaar!_ 💔`,
    `*😔 SORRY YAAR 😔*\n\n@${sender.split("@")[0]} ko bohot afsos hai @${mention.split("@")[0]}!\n\n*"Dosti mein sorry kehna bhi zaroori hai!"* 💙\n\n_Galti maan li, ab muskura do!_ 🌸`,
    `*💔 PLEASE FORGIVE ME 💔*\n\n@${sender.split("@")[0]} chahta hai @${mention.split("@")[0]} maaf kar de!\n\n*"Rishte galtiyon se nahi toote, na maafi se tootte hain!"* 🤝`
  ];
  
  await conn.sendMessage(mek.chat, {
    text: messages[Math.floor(Math.random() * messages.length)],
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 9. MAAFI
cmd({
  pattern: "maafi",
  alias: ["maaf", "respect9"],
  desc: "Ask for forgiveness in Urdu",
  react: "🙏",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🙏 MAAFI CHAHTA HOON 🙏*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} se معافی maangi!\n\n*"معاف کر دو یار!"*\n\n_Galti hogayi, dil se maafi!_ 🥺\n\nPlease maaf kardo! 💙`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 10. TAZEEM
cmd({
  pattern: "tazeem",
  alias: ["taazeem", "respect10"],
  desc: "Show honor and respect",
  react: "👑",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*👑 TAZEEM-O-TAKREEM 👑*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ki تعظیم ki!\n\n*"Aap jaisa koi nahi!"*\n\n_Aapki shan-o-shaukat ko salaam!_ ✨\n\nHamari taraf se makhsoos ehtram! 🌟`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 11. IZZAT
cmd({
  pattern: "izzat",
  alias: ["honor", "respect11"],
  desc: "Give honor to someone",
  react: "⭐",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*⭐ IZZAT-O-IKRAM ⭐*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ki عزت ko sarbuland kiya!\n\n*"Izzat dene se izzat milti hai!"* 👑\n\n_Aap ka maqam buland hai!_ 🌟`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 12. QADR
cmd({
  pattern: "qadr",
  alias: ["qadrdaan", "respect12"],
  desc: "Show someone their value",
  react: "💎",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*💎 QADR-O-QEEMAT 💎*\n\n@${sender.split("@")[0]} jaanta hai @${mention.split("@")[0]} ki قدر!\n\n*"Aapki qeemat heeron se zyada hai!"* 💫\n\n_Aap bohot qeemti hain!_ ✨`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 13. AHSAN
cmd({
  pattern: "ahsan",
  alias: ["ehsan", "respect13"],
  desc: "Acknowledge someone's favor",
  react: "🌺",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🌺 AHSAN MAND HOON 🌺*\n\n@${sender.split("@")[0]} par @${mention.split("@")[0]} ka احسان hai!\n\n*"Aapke ehsanat kabhi nahi bhoolenge!"* 🙏\n\n_Nek dil, nek insaan!_ 💚`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 14. MEHRBANI
cmd({
  pattern: "mehrbani",
  alias: ["kindness", "respect14"],
  desc: "Thank for kindness",
  react: "🌸",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🌸 MEHRBANI KA SHUKRIYA 🌸*\n\n@${sender.split("@")[0]} shukriya ada karta hai @${mention.split("@")[0]} ki مہربانی ka!\n\n*"Aapki mehrbani dil ko chhoo gayi!"* 💝\n\n_Allah aapko jaza de!_ 🤲`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 15. NAWAZ
cmd({
  pattern: "nawaz",
  alias: ["nawaaz", "respect15"],
  desc: "Feel graced by someone",
  react: "🎁",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🎁 NAWAZ FARMAYA 🎁*\n\n@${mention.split("@")[0]} ne @${sender.split("@")[0]} ko اپنی نوازش se nawaza!\n\n*"Aapki nawazish se khushqismat hoon!"* ✨\n\n_Shukriya!_ 🌟`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 16. SALAAM
cmd({
  pattern: "salaam",
  alias: ["salaam2", "respect16"],
  desc: "Greet with peace",
  react: "🕊️",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🕊️ SALAAM-O-DOSTI 🕊️*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ko پیار se salaam kiya!\n\n*"Salaam sukoon ka paigham!"* ☪️\n\n_Pyaar aur aman!_ 💚`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 17. TASLEEM
cmd({
  pattern: "tasleem",
  alias: ["acknowledge", "respect17"],
  desc: "Acknowledge someone's greatness",
  react: "🌟",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🌟 TASLEEM HAI 🌟*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ki تسلیم کیا!\n\n*"Aapki kamiyabi tasleem hai!"* 👏\n\n_Mubarak ho!_ 🎉`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 18. SHANDAR
cmd({
  pattern: "shandar",
  alias: ["wonderful", "respect18"],
  desc: "Call someone wonderful",
  react: "✨",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*✨ SHANDAR INSAAN ✨*\n\n@${sender.split("@")[0]} kehta hai @${mention.split("@")[0]} واقعی شاندار hai!\n\n*"Aap bilkul shandar hain!"* 🌟\n\n_Amazing personality!_ 💫`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 19. ZABARDAST
cmd({
  pattern: "zabardast",
  alias: ["amazing", "respect19"],
  desc: "Express amazement",
  react: "🔥",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🔥 ZABARDAST 🔥*\n\n@${sender.split("@")[0]} kehta hai @${mention.split("@")[0]} زبردست hai!\n\n*"Aap toh kamaal ke hain!"* 💯\n\n_Too good!_ ⚡`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 20. KAMAAL
cmd({
  pattern: "kamaal",
  alias: ["kamal", "respect20"],
  desc: "Express wonder",
  react: "🎯",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🎯 KAMAAL KAR DIYA 🎯*\n\n@${mention.split("@")[0]} ne کمال kar diya! @${sender.split("@")[0]} hairaan hai!\n\n*"Wah! Kya baat hai!"* 👏\n\n_Incredible!_ ✨`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 21. LAJAWAB
cmd({
  pattern: "lajawab",
  alias: ["incredible", "respect21"],
  desc: "Call someone incredible",
  react: "💫",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*💫 LAJAWAB 💫*\n\n@${sender.split("@")[0]} kehta hai @${mention.split("@")[0]} بالکل لاجواب hai!\n\n*"Koi jawaab nahi aapka!"* 🌟\n\n_Simply the best!_ 👑`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 22. MASHALLAH
cmd({
  pattern: "mashallah",
  alias: ["masha", "respect22"],
  desc: "Praise with MashAllah",
  react: "🌙",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🌙 MASHALLAH 🌙*\n\n@${sender.split("@")[0]} kehta hai @${mention.split("@")[0]} ko:\n\n*"ماشاءاللہ! اللہ نظر بد سے بچائے!"* ☪️\n\n_May Allah protect you!_ 🤲\n\nBohot khubsurat! 💚`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 23. SUBHANALLAH
cmd({
  pattern: "subhanallah",
  alias: ["subhan", "respect23"],
  desc: "Express glory to Allah",
  react: "☪️",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*☪️ SUBHANALLAH ☪️*\n\n@${sender.split("@")[0]} dekh kar @${mention.split("@")[0]} ko kaha:\n\n*"سبحان اللہ! کیا خوبصورت تخلیق!"* 🌟\n\n_Glory be to Allah!_ 🤲\n\nAllah ki azeem takhleq! 💫`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 24. BARKATEIN
cmd({
  pattern: "barkatein",
  alias: ["blessings", "respect24"],
  desc: "Send blessings",
  react: "🌺",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🌺 BARKATEIN 🌺*\n\n@${sender.split("@")[0]} bhej raha hai @${mention.split("@")[0]} ke liye:\n\n*"اللہ آپ کو ڈھیروں برکتیں دے!"* 🤲\n\n_May you be blessed abundantly!_ 💚\n\nKhushiyan aur kamyabi! ✨`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 25. DUAIN
cmd({
  pattern: "duain",
  alias: ["prayers", "respect25"],
  desc: "Send prayers",
  react: "🤲",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🤲 DUAIN 🤲*\n\n@${sender.split("@")[0]} ki duain hain @${mention.split("@")[0]} ke liye:\n\n*"اللہ آپ کو ہمیشہ خوش رکھے!"* ☪️\n\n_Dil se dua hai!_ 💚\n\nAllah salamat rakhe! 🌟`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 26. KHIDMAT
cmd({
  pattern: "khidmat",
  alias: ["service", "respect26"],
  desc: "Express readiness to serve",
  react: "🙇",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🙇 KHIDMAT MEIN HAAZIR 🙇*\n\n@${sender.split("@")[0]} haazir hai @${mention.split("@")[0]} ki خدمت mein!\n\n*"Aapki khidmat karne ka sharaf!"* 🙏\n\n_Hukum karen!_ ✨`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 27. EHTRAM
cmd({
  pattern: "ehtram",
  alias: ["ahtram", "respect27"],
  desc: "Show deep respect",
  react: "👑",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*👑 GEHRI EHTRAM 👑*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ko احترام diya!\n\n*"Aapka ehtram dil se!"* 🌟\n\n_Bohot zyada respect!_ 💫`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 28. APPRECIATION
cmd({
  pattern: "appreciation",
  alias: ["appreciate", "respect28"],
  desc: "Appreciate someone",
  react: "👏",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*👏 APPRECIATION 👏*\n\n@${sender.split("@")[0]} appreciate karta hai @${mention.split("@")[0]} ko!\n\n*"Your efforts are truly valued!"* 💝\n\n_Bohot khoob!_ ✨\n\nKeep shining! 🌟`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 29. PROUD
cmd({
  pattern: "proud",
  alias: ["fakhr", "respect29"],
  desc: "Express pride in someone",
  react: "🏆",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🏆 PROUD OF YOU 🏆*\n\n@${sender.split("@")[0]} ko فخر hai @${mention.split("@")[0]} par!\n\n*"Aap par humein naaz hai!"* 👑\n\n_You make us proud!_ ⭐\n\nMubarak ho! 🎉`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 30. GRATEFUL
cmd({
  pattern: "grateful",
  alias: ["shukrguzar", "respect30"],
  desc: "Express deep gratitude",
  react: "🙏",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🙏 DEEPLY GRATEFUL 🙏*\n\n@${sender.split("@")[0]} is extremely grateful to @${mention.split("@")[0]}!\n\n*"میں آپ کا شکر گزار ہوں!"*\n\n_Your support means everything!_ 💚\n\nAllah aapko jaza-e-khair de! 🤲`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 31. KARAM
cmd({
  pattern: "karam",
  alias: ["blessing", "respect31"],
  desc: "Acknowledge someone's blessing",
  react: "✨",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*✨ AAPKA KARAM HAI ✨*\n\n@${sender.split("@")[0]} kehta hai @${mention.split("@")[0]} ka کرم hai!\n\n*"یہ سب آپ کا کرم ہے!"* 🌟\n\n_Aapki mehrbani ka shukriya!_ 💫`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 32. INAYAT
cmd({
  pattern: "inayat",
  alias: ["grace", "respect32"],
  desc: "Express grace received",
  react: "🌸",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🌸 INAYAT-O-KARAM 🌸*\n\n@${sender.split("@")[0]} par @${mention.split("@")[0]} ki عنایت hai!\n\n*"آپ کی عنایت سے یہ ممکن ہوا!"* 💝\n\n_Bohot mehrbani!_ 🌺`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 33. LUTF
cmd({
  pattern: "lutf",
  alias: ["kindness2", "respect33"],
  desc: "Acknowledge kindness",
  react: "🌷",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🌷 BOHOT LUTF 🌷*\n\n@${sender.split("@")[0]} ko @${mention.split("@")[0]} ka لطف mila!\n\n*"آپ کا لطف کبھی نہیں بھولوں گا!"* 💖\n\n_Dil se shukriya!_ ✨`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 34. MIHR
cmd({
  pattern: "mihr",
  alias: ["affection", "respect34"],
  desc: "Show affection and respect",
  react: "💗",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*💗 MIHR-O-MOHABBAT 💗*\n\n@${sender.split("@")[0]} ki mihr @${mention.split("@")[0]} par!\n\n*"آپ کی مہر سے دل کو سکون ملا!"* 🌙\n\n_Bohot pyaar!_ 💕`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 35. SHAFQAT
cmd({
  pattern: "shafqat",
  alias: ["compassion", "respect35"],
  desc: "Express compassion",
  react: "💚",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*💚 SHAFQAT-O-MOHABBAT 💚*\n\n@${sender.split("@")[0]} mehsoos karta hai @${mention.split("@")[0]} ki شفقت!\n\n*"آپ کی شفقت کا کوئی جواب نہیں!"* 🌟\n\n_Dil se respect!_ 💫`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 36. RAHMAT
cmd({
  pattern: "rahmat",
  alias: ["mercy", "respect36"],
  desc: "Pray for Allah's mercy",
  react: "☪️",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*☪️ RAHMAT-E-KHUDA ☪️*\n\n@${sender.split("@")[0]} dua karta hai @${mention.split("@")[0]} ke liye:\n\n*"اللہ کی رحمت آپ پر ہو!"* 🤲\n\n_May Allah's mercy be upon you!_ 💚`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 37. NAIMAT
cmd({
  pattern: "naimat",
  alias: ["blessing2", "respect37"],
  desc: "Call someone a blessing",
  react: "🎁",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🎁 ALLAH KI NAIMAT 🎁*\n\n@${sender.split("@")[0]} kehta hai @${mention.split("@")[0]} hai نعمت!\n\n*"آپ اللہ کی نعمت ہیں!"* ✨\n\n_You're a blessing!_ 🌟`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 38. CONGRATULATIONS
cmd({
  pattern: "congratulations",
  alias: ["congrats", "respect38"],
  desc: "Congratulate someone",
  react: "🎉",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🎉 CONGRATULATIONS 🎉*\n\n@${sender.split("@")[0]} mubarak baad deta hai @${mention.split("@")[0]} ko!\n\n*"Mubarak ho! Bohot khushi hui!"* 🎊\n\n_Well deserved!_ 🏆\n\nYou earned it! 👏`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 39. MUBARAK
cmd({
  pattern: "mubarak",
  alias: ["mubarakho", "respect39"],
  desc: "Say Mubarak to someone",
  react: "🎊",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🎊 MUBARAK HO 🎊*\n\n@${sender.split("@")[0]} ki taraf se @${mention.split("@")[0]} ko:\n\n*"بہت بہت مبارک ہو!"* 🎉\n\n_Allah aur barkatein de!_ 🤲\n\nKhush raho! 💚`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 40. BADHAI
cmd({
  pattern: "badhai",
  alias: ["badhaiho", "respect40"],
  desc: "Give congratulations in Urdu",
  react: "🌟",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🌟 BADHAI HO 🌟*\n\n@${sender.split("@")[0]} kehta hai @${mention.split("@")[0]} ko:\n\n*"بڑھائی ہو! کمال کر دیا!"* 🎉\n\n_Bohot khushi ki baat hai!_ 💫`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 41. TAHSEEN
cmd({
  pattern: "tahseen",
  alias: ["praise", "respect41"],
  desc: "Praise someone highly",
  react: "⭐",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*⭐ TAHSEEN-O-TAARIF ⭐*\n\n@${sender.split("@")[0]} ki تحسین @${mention.split("@")[0]} ke liye!\n\n*"آپ کی تعریف کے لیے الفاظ کم ہیں!"* 👏\n\n_Outstanding!_ 🌟`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 42. AFREEN
cmd({
  pattern: "afreen",
  alias: ["wellsaid", "respect42"],
  desc: "Say Afreen (well done)",
  react: "👏",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*👏 AFREEN HAI 👏*\n\n@${sender.split("@")[0]} kehta hai @${mention.split("@")[0]} ko:\n\n*"آفرین! واہ کیا بات ہے!"* 🌟\n\n_Zabardast!_ ✨\n\nKya baat hai! 💯`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 43. WAH
cmd({
  pattern: "wah",
  alias: ["wahwah", "respect43"],
  desc: "Express amazement with Wah",
  react: "😍",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*😍 WAH WAH 😍*\n\n@${sender.split("@")[0]} kehta hai @${mention.split("@")[0]} ko:\n\n*"واہ واہ! کیا کمال کیا ہے!"* 👏\n\n_Subhan Allah!_ 🌟\n\nLajawab! 💫`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 44. KHUSHI
cmd({
  pattern: "khushi",
  alias: ["happiness", "respect44"],
  desc: "Express happiness for someone",
  react: "😊",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*😊 BOHOT KHUSHI HUI 😊*\n\n@${sender.split("@")[0]} bohot خوش hai @${mention.split("@")[0]} ke liye!\n\n*"آپ کی خوشی میری خوشی!"* 💚\n\n_Hamesha khush raho!_ 🌸`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 45. DILSE
cmd({
  pattern: "dilse",
  alias: ["fromheart", "respect45"],
  desc: "Thank from the heart",
  react: "❤️",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*❤️ DIL SE SHUKRIYA ❤️*\n\n@${sender.split("@")[0]} دل سے kehta hai @${mention.split("@")[0]} ko:\n\n*"دل کی گہرائیوں سے شکریہ!"* 💝\n\n_True gratitude!_ ✨`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 46. LEGEND
cmd({
  pattern: "legend",
  alias: ["legendary", "respect46"],
  desc: "Call someone a legend",
  react: "🔱",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🔱 ABSOLUTE LEGEND 🔱*\n\n@${sender.split("@")[0]} declares @${mention.split("@")[0]} as a LEGEND!\n\n*"You're a living legend!"* 👑\n\n_Legendary status unlocked!_ ⚡\n\nRespect! 💯`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 47. HERO
cmd({
  pattern: "hero",
  alias: ["myhero", "respect47"],
  desc: "Call someone your hero",
  react: "🦸",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🦸 MY HERO 🦸*\n\n@${sender.split("@")[0]} says @${mention.split("@")[0]} is their HERO!\n\n*"آپ میرے ہیرو ہیں!"* 💪\n\n_Real hero vibes!_ ⚡\n\nSalute to you! 🫡`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 48. SUPERSTAR
cmd({
  pattern: "superstar",
  alias: ["star", "respect48"],
  desc: "Call someone a superstar",
  react: "⭐",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*⭐ SUPERSTAR ⭐*\n\n@${sender.split("@")[0]} kehta hai @${mention.split("@")[0]} hai SUPERSTAR!\n\n*"You shine like a star!"* 🌟\n\n_True superstar!_ ✨\n\nKeep shining! 💫`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 49. ROCKSTAR
cmd({
  pattern: "rockstar",
  alias: ["rocker", "respect49"],
  desc: "Call someone a rockstar",
  react: "🎸",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🎸 ROCKSTAR 🎸*\n\n@${sender.split("@")[0]} says @${mention.split("@")[0]} is a ROCKSTAR!\n\n*"Rock on! You're amazing!"* 🤘\n\n_Living the rockstar life!_ 🔥\n\nYou rock! 💯`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 50. CHAMPION
cmd({
  pattern: "champion",
  alias: ["champ", "respect50"],
  desc: "Call someone a champion",
  react: "🏆",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🏆 CHAMPION 🏆*\n\n@${sender.split("@")[0]} declares @${mention.split("@")[0]} as CHAMPION!\n\n*"You're a true champion!"* 👑\n\n_Winner mentality!_ 💪\n\nVictory is yours! 🎯`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 51. BOSS
cmd({
  pattern: "boss",
  alias: ["theboss", "respect51"],
  desc: "Call someone the boss",
  react: "👔",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*👔 THE BOSS 👔*\n\n@${sender.split("@")[0]} kehta hai @${mention.split("@")[0]} hai THE BOSS!\n\n*"Boss level unlocked!"* 😎\n\n_Leadership goals!_ 💼\n\nRespect the boss! 👑`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 52. KING
cmd({
  pattern: "king",
  alias: ["badshah", "respect52"],
  desc: "Call someone the king",
  react: "👑",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*👑 THE KING 👑*\n\n@${sender.split("@")[0]} bows to KING @${mention.split("@")[0]}!\n\n*"بادشاہ سلامت!"* 🙇\n\n_Long live the king!_ ⚔️\n\nAll hail! 🔱`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 53. QUEEN
cmd({
  pattern: "queen",
  alias: ["malika", "respect53"],
  desc: "Call someone the queen",
  react: "👸",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*👸 THE QUEEN 👸*\n\n@${sender.split("@")[0]} honors QUEEN @${mention.split("@")[0]}!\n\n*"ملکہ سلامت!"* 💎\n\n_Long live the queen!_ 👑\n\nAll hail! ✨`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 54. GEM
cmd({
  pattern: "gem",
  alias: ["gems", "respect54"],
  desc: "Call someone a gem",
  react: "💎",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*💎 HIDDEN GEM 💎*\n\n@${sender.split("@")[0]} found a gem - @${mention.split("@")[0]}!\n\n*"You're a rare gem!"* 🌟\n\n_Precious and valuable!_ ✨\n\nPriceless! 💫`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 55. DIAMOND
cmd({
  pattern: "diamond",
  alias: ["heera", "respect55"],
  desc: "Call someone a diamond",
  react: "💍",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*💍 PURE DIAMOND 💍*\n\n@${sender.split("@")[0]} says @${mention.split("@")[0]} is a DIAMOND!\n\n*"آپ ہیرے جیسے ہیں!"* 💎\n\n_Rare and precious!_ ✨\n\nShining bright! 🌟`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 56. PRECIOUS
cmd({
  pattern: "precious",
  alias: ["qeemti", "respect56"],
  desc: "Call someone precious",
  react: "🌟",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🌟 SO PRECIOUS 🌟*\n\n@${sender.split("@")[0]} thinks @${mention.split("@")[0]} is PRECIOUS!\n\n*"آپ بہت قیمتی ہیں!"* 💝\n\n_Beyond valuable!_ 💎\n\nTreasured! ✨`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 57. VALUABLE
cmd({
  pattern: "valuable",
  alias: ["worthy", "respect57"],
  desc: "Show someone their value",
  react: "💫",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*💫 HIGHLY VALUABLE 💫*\n\n@${sender.split("@")[0]} recognizes the value of @${mention.split("@")[0]}!\n\n*"Your worth is immeasurable!"* 🌟\n\n_Priceless person!_ 💎`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 58. DESERVING
cmd({
  pattern: "deserving",
  alias: ["mustahiq", "respect58"],
  desc: "Say someone deserves it",
  react: "🎯",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🎯 YOU DESERVE IT 🎯*\n\n@${sender.split("@")[0]} says @${mention.split("@")[0]} truly DESERVES it!\n\n*"آپ اس کے مستحق ہیں!"* 🏆\n\n_Well earned!_ ✨\n\nYou worked for it! 💪`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 59. INSPIRATION
cmd({
  pattern: "inspiration",
  alias: ["inspire", "respect59"],
  desc: "Call someone an inspiration",
  react: "💡",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*💡 TRUE INSPIRATION 💡*\n\n@${sender.split("@")[0]} is inspired by @${mention.split("@")[0]}!\n\n*"You inspire me every day!"* 🌟\n\n_Keep inspiring!_ ✨\n\nMotivational icon! 🔥`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 60. ROLEMODEL
cmd({
  pattern: "rolemodel",
  alias: ["ideal", "respect60"],
  desc: "Call someone a role model",
  react: "🎖️",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🎖️ ROLE MODEL 🎖️*\n\n@${sender.split("@")[0]} sees @${mention.split("@")[0]} as a ROLE MODEL!\n\n*"آپ میرے آئیڈیل ہیں!"* 🌟\n\n_Perfect example!_ 💯\n\nGoals! 🎯`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 61. MENTOR
cmd({
  pattern: "mentor",
  alias: ["ustad", "respect61"],
  desc: "Honor someone as mentor",
  react: "📚",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*📚 MY MENTOR 📚*\n\n@${sender.split("@")[0]} honors mentor @${mention.split("@")[0]}!\n\n*"استاد کا ادب واجب!"* 🙏\n\n_Thank you for guidance!_ 🌟\n\nRespected teacher! 💫`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 62. GENIUS
cmd({
  pattern: "genius",
  alias: ["brilliant", "respect62"],
  desc: "Call someone a genius",
  react: "🧠",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🧠 PURE GENIUS 🧠*\n\n@${sender.split("@")[0]} says @${mention.split("@")[0]} is a GENIUS!\n\n*"Brilliant mind!"* 💡\n\n_Intelligence level: MAX!_ 🎯\n\nBrilliant! ✨`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 63. TALENT
cmd({
  pattern: "talent",
  alias: ["talented", "respect63"],
  desc: "Praise someone's talent",
  react: "🎨",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🎨 PURE TALENT 🎨*\n\n@${sender.split("@")[0]} admires @${mention.split("@")[0]}'s TALENT!\n\n*"Your talent is amazing!"* 🌟\n\n_Gifted person!_ ✨\n\nKeep creating! 💫`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 64. SKILLFUL
cmd({
  pattern: "skillful",
  alias: ["skilled", "respect64"],
  desc: "Acknowledge someone's skills",
  react: "⚡",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*⚡ HIGHLY SKILLFUL ⚡*\n\n@${sender.split("@")[0]} recognizes @${mention.split("@")[0]}'s SKILLS!\n\n*"Master of your craft!"* 🎯\n\n_Pro level!_ 💯\n\nSkilled expert! 🔥`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 65. AWESOME
cmd({
  pattern: "awesome",
  alias: ["amazing2", "respect65"],
  desc: "Call someone awesome",
  react: "🌈",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🌈 TOTALLY AWESOME 🌈*\n\n@${sender.split("@")[0]} thinks @${mention.split("@")[0]} is AWESOME!\n\n*"You're absolutely awesome!"* 🌟\n\n_Amazing vibes!_ ✨\n\nStay awesome! 💫`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 66. WONDERFUL
cmd({
  pattern: "wonderful",
  alias: ["ajayab", "respect66"],
  desc: "Call someone wonderful",
  react: "🦋",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🦋 WONDERFUL PERSON 🦋*\n\n@${sender.split("@")[0]} says @${mention.split("@")[0]} is WONDERFUL!\n\n*"عجائب انسان!"* 🌸\n\n_Simply wonderful!_ 💝\n\nBeautiful soul! 🌟`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 67. FANTASTIC
cmd({
  pattern: "fantastic",
  alias: ["fantabulous", "respect67"],
  desc: "Call someone fantastic",
  react: "🎆",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🎆 FANTASTIC 🎆*\n\n@${sender.split("@")[0]} says @${mention.split("@")[0]} is FANTASTIC!\n\n*"Absolutely fantastic!"* 🌟\n\n_Beyond amazing!_ ✨\n\nFantabulous! 💫`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 68. EXCELLENCE
cmd({
  pattern: "excellence",
  alias: ["excellent", "respect68"],
  desc: "Praise excellence",
  react: "🏅",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🏅 PURE EXCELLENCE 🏅*\n\n@${sender.split("@")[0]} praises @${mention.split("@")[0]}'s EXCELLENCE!\n\n*"Excellence personified!"* 🌟\n\n_Top tier quality!_ 💯\n\nExcellent work! 👏`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 69. PERFECT
cmd({
  pattern: "perfect",
  alias: ["kamil", "respect69"],
  desc: "Call someone perfect",
  react: "💯",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*💯 ABSOLUTELY PERFECT 💯*\n\n@${sender.split("@")[0]} says @${mention.split("@")[0]} is PERFECT!\n\n*"کامل انسان!"* ✨\n\n_Perfection achieved!_ 🌟\n\nFlawless! 💫`,
    mentions: [sender, mention]
  }, { quoted: mek });
});

// 70. BLESSED
cmd({
  pattern: "blessed",
  alias: ["mubarik", "respect70"],
  desc: "Call someone blessed",
  react: "🌟",
  category: "respect",
  filename: __filename
}, async (conn, mek, m, { sender, reply, quoted, args }) => {
  let mention = quoted ? quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender;
  
  await conn.sendMessage(mek.chat, {
    text: `*🌟 TRULY BLESSED 🌟*\n\n@${sender.split("@")[0]} thinks @${mention.split("@")[0]} is BLESSED!\n\n*"آپ واقعی خوش نصیب ہیں!"* 🤲\n\n_May Allah keep blessing you!_ 💚\n\nHighly favored! ✨`,
    mentions: [sender, mention]
  }, { quoted: mek });
});