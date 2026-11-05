// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// GAALIYAN / ABUSE CATEGORY - 100 COMMANDS
// ============================================

// 1. MADARCHOD
cmd({
  pattern: "madarchod",
  alias: ["mc"],
  desc: "Heavy mother abuse",
  react: "🤬",
  category: "gaaliyan",
  filename: __filename
}, async (conn, mek, m, { sender, quoted, mentionedJid, args }) => {
  let mention = quoted?.sender || (mentionedJid && mentionedJid[0]) || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender);
  await conn.sendMessage(mek.chat, { 
    text: `*🤬 MADARCHOD 🤬*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ko bola:\n\nYou are a madarchod! Teri maa ki chut mein lund!`, 
    mentions: [sender, mention] 
  }, { quoted: mek });
});

// 2. BEHENCHOD
cmd({
  pattern: "behenchod",
  alias: ["bc"],
  desc: "Sister abuse",
  react: "🤬",
  category: "gaaliyan",
  filename: __filename
}, async (conn, mek, m, { sender, quoted, mentionedJid, args }) => {
  let mention = quoted?.sender || (mentionedJid && mentionedJid[0]) || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender);
  await conn.sendMessage(mek.chat, { 
    text: `*🤬 BEHENCHOD 🤬*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ko bola:\n\nYou behenchod! Teri behen ki chut mein mera lund!`, 
    mentions: [sender, mention] 
  }, { quoted: mek });
});

// 3. GANDU
cmd({
  pattern: "gandu",
  alias: ["gaandu"],
  desc: "Ass fucker abuse",
  react: "🤬",
  category: "gaaliyan",
  filename: __filename
}, async (conn, mek, m, { sender, quoted, mentionedJid, args }) => {
  let mention = quoted?.sender || (mentionedJid && mentionedJid[0]) || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender);
  await conn.sendMessage(mek.chat, { 
    text: `*🤬 GANDU 🤬*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ko bola:\n\nYou dirty gandu! Gaand marwa ke aa!`, 
    mentions: [sender, mention] 
  }, { quoted: mek });
});

// 4. RANDI
cmd({
  pattern: "randi",
  alias: ["randibaaz"],
  desc: "Whore abuse",
  react: "🤬",
  category: "gaaliyan",
  filename: __filename
}, async (conn, mek, m, { sender, quoted, mentionedJid, args }) => {
  let mention = quoted?.sender || (mentionedJid && mentionedJid[0]) || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender);
  await conn.sendMessage(mek.chat, { 
    text: `*🤬 RANDI 🤬*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ko bola:\n\nYou randi! Teri maa aur behen dono randi hain!`, 
    mentions: [sender, mention] 
  }, { quoted: mek });
});

// 5. BHOSDIKE
cmd({
  pattern: "bhosdike",
  alias: ["bhosdi"],
  desc: "Pussy abuse",
  react: "🤬",
  category: "gaaliyan",
  filename: __filename
}, async (conn, mek, m, { sender, quoted, mentionedJid, args }) => {
  let mention = quoted?.sender || (mentionedJid && mentionedJid[0]) || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender);
  await conn.sendMessage(mek.chat, { 
    text: `*🤬 BHOSDIKE 🤬*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ko bola:\n\nTeri bhosdi mein lund! You bhosdike!`, 
    mentions: [sender, mention] 
  }, { quoted: mek });
});

// 6. CHUTIYA
cmd({
  pattern: "chutiya",
  alias: ["chutia"],
  desc: "Idiot abuse",
  react: "🤬",
  category: "gaaliyan",
  filename: __filename
}, async (conn, mek, m, { sender, quoted, mentionedJid, args }) => {
  let mention = quoted?.sender || (mentionedJid && mentionedJid[0]) || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender);
  await conn.sendMessage(mek.chat, { 
    text: `*🤬 CHUTIYA 🤬*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ko bola:\n\nYou big chutiya! Brainless fucker!`, 
    mentions: [sender, mention] 
  }, { quoted: mek });
});

// 7. HARAMI
cmd({
  pattern: "harami",
  alias: ["haramzada"],
  desc: "Bastard abuse",
  react: "🤬",
  category: "gaaliyan",
  filename: __filename
}, async (conn, mek, m, { sender, quoted, mentionedJid, args }) => {
  let mention = quoted?.sender || (mentionedJid && mentionedJid[0]) || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender);
  await conn.sendMessage(mek.chat, { 
    text: `*🤬 HARAMI 🤬*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ko bola:\n\nYou harami bastard!`, 
    mentions: [sender, mention] 
  }, { quoted: mek });
});

// 8. LAVDA
cmd({
  pattern: "lavda",
  alias: ["lund"],
  desc: "Dick abuse",
  react: "🤬",
  category: "gaaliyan",
  filename: __filename
}, async (conn, mek, m, { sender, quoted, mentionedJid, args }) => {
  let mention = quoted?.sender || (mentionedJid && mentionedJid[0]) || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender);
  await conn.sendMessage(mek.chat, { 
    text: `*🤬 LAVDA 🤬*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ko bola:\n\nChup kar lavde! Suck my dick!`, 
    mentions: [sender, mention] 
  }, { quoted: mek });
});

// 9. KAMINA
cmd({
  pattern: "kamina",
  alias: ["kameena"],
  desc: "Dirty person abuse",
  react: "🤬",
  category: "gaaliyan",
  filename: __filename
}, async (conn, mek, m, { sender, quoted, mentionedJid, args }) => {
  let mention = quoted?.sender || (mentionedJid && mentionedJid[0]) || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender);
  await conn.sendMessage(mek.chat, { 
    text: `*🤬 KAMINA 🤬*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ko bola:\n\nYou dirty kamina!`, 
    mentions: [sender, mention] 
  }, { quoted: mek });
});

// 10. SUAR
cmd({
  pattern: "suar",
  alias: ["suar1"],
  desc: "Pig abuse",
  react: "🤬",
  category: "gaaliyan",
  filename: __filename
}, async (conn, mek, m, { sender, quoted, mentionedJid, args }) => {
  let mention = quoted?.sender || (mentionedJid && mentionedJid[0]) || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender);
  await conn.sendMessage(mek.chat, { 
    text: `*🤬 SUAR 🤬*\n\n@${sender.split("@")[0]} ne @${mention.split("@")[0]} ko bola:\n\nYou suar ka bacha!`, 
    mentions: [sender, mention] 
  }, { quoted: mek });
});
