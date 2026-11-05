// ERFAN-MD
import { fileURLToPath } from 'url';
import config from '../config.js';
import { cmd, commands } from '../command.js';
import path from 'path';
import { runtime } from '../lib/functions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function for small caps text
const toSmallCaps = (text) => {
    if (!text || typeof text !== 'string') return '';
    const smallCapsMap = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ',
        'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ',
        's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ',
        'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ғ', 'G': 'ɢ', 'H': 'ʜ', 'I': 'ɪ',
        'J': 'ᴊ', 'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ', 'O': 'ᴏ', 'P': 'ᴘ', 'Q': 'ǫ', 'R': 'ʀ',
        'S': 's', 'T': 'ᴛ', 'U': 'ᴜ', 'V': 'ᴠ', 'W': 'ᴡ', 'X': 'x', 'Y': 'ʏ', 'Z': 'ᴢ'
    };
    return text.split('').map(char => smallCapsMap[char] || char).join('');
};

// Format category with sidebar design from Menu 2
const formatCategory = (category, cmds) => {
    // Filter out commands with empty or undefined patterns
    const validCmds = cmds.filter(cmd => cmd.pattern && cmd.pattern.trim() !== '');

    if (validCmds.length === 0) return ''; // Skip empty categories

    let title = `\n━━━━━『 ${toSmallCaps(category.toUpperCase())} 』━━━━━\n◉\n`;
    let body = validCmds.map(cmd => {
        const commandName = cmd.pattern || '';
        return `◉ ➤ ${toSmallCaps(commandName)}`;
    }).join('\n');
    let footer = `\n◉\n┗━━━━━━━━━━━━━━`;
    return `${title}${body}${footer}`;
};

cmd({
    pattern: "menu",
    alias: ["mm", "help", "allmenu","fullmenu"],
    use: '.menu',
    desc: "Show all bot commands",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply, userConfig }) => {
    try {
        // Show typing presence before processing
        await conn.sendPresenceUpdate('composing', from);

        // Track patterns we've already listed so the same command
        // never gets printed twice (fixes the "double double" bug)
        const seenPatterns = new Set();

        // Get all unique categories and filter out undefined/null categories
        const categories = [...new Set(Object.values(commands).map(c => c.category))].filter(cat =>
            cat && cat.trim() !== '' && cat !== 'undefined'
        );

        // Organize commands by category, filter out empty categories,
        // and dedupe by pattern so duplicated entries in `commands`
        // don't get listed more than once.
        const categorized = {};
        categories.forEach(cat => {
            const categoryCommands = Object.values(commands).filter(c => c.category === cat);
            const validCommands = categoryCommands.filter(cmd => {
                if (!cmd.pattern || cmd.pattern.trim() === '') return false;
                const key = cmd.pattern.trim().toLowerCase();
                if (seenPatterns.has(key)) return false;
                seenPatterns.add(key);
                return true;
            });
            if (validCommands.length > 0) {
                categorized[cat] = validCommands;
            }
        });

        // Unique command count (based on the same dedupe pass above)
        let totalCommands = seenPatterns.size;

        // Build menu sections - only for categories that have commands
        let menuSections = '';
        for (const [category, cmds] of Object.entries(categorized)) {
            if (cmds && cmds.length > 0) {
                const section = formatCategory(category, cmds);
                if (section !== '') {
                    menuSections += section;
                }
            }
        }

        // Get all values from userConfig with fallback to config
        const BOT_NAME = userConfig?.BOT_NAME || config.BOT_NAME || "Bot";
        const OWNER_NAME = userConfig?.OWNER_NAME || config.OWNER_NAME || "Owner";
        const PREFIX = userConfig?.PREFIX || config.PREFIX || ".";
        const MODE = userConfig?.MODE || config.MODE || "private";
        const VERSION = userConfig?.VERSION || config.VERSION || "1.0.0";
        const DESCRIPTION = userConfig?.DESCRIPTION || config.DESCRIPTION || "";

        // Get BOT_IMAGE from userConfig first, then config.BOT_IMAGE, then config.BOT_MEDIA_URL
        // Only accept values that are actually http(s) links - skips stale local
        // paths (e.g. "./lib/ERFAN.jpg") that may still be saved in old userConfig records.
        const isValidImageUrl = (val) => typeof val === 'string' && /^https?:\/\//i.test(val.trim());
        const BOT_IMAGE = [userConfig?.BOT_IMAGE, userConfig?.BOT_MEDIA_URL, config.BOT_IMAGE, config.BOT_MEDIA_URL]
            .find(isValidImageUrl);

        // Main menu text with sidebar design from Menu 2
        let dec = `
  
━━━━━━ 🤖 ʙᴏᴛ ɪɴғᴏ ━━━━━━
◉ 🎉 ${BOT_NAME}
◉ 👑 ${toSmallCaps('Owner')}: ${OWNER_NAME}
◉ 📜 ${toSmallCaps('Commands')}: ${totalCommands}
◉ ⏱️ ${toSmallCaps('Runtime')}: ${runtime(process.uptime())}
◉ 📦 ${toSmallCaps('Prefix')}: ${PREFIX}
◉ ⚙️ ${toSmallCaps('Mode')}: ${MODE}
◉ 🏷️ ${toSmallCaps('Version')}: ${VERSION}
${menuSections}

> ${DESCRIPTION || ''}`;

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363416743041101@newsletter',
                newsletterName: BOT_NAME,
                serverMessageId: 143
            }
        };

        if (BOT_IMAGE) {
            // Config-provided image, sent directly by URL (no manual fetch/validation)
            await conn.sendMessage(from, {
                image: { url: BOT_IMAGE },
                caption: dec,
                contextInfo
            }, { quoted: mek });
        } else {
            // No image configured - send text only
            await conn.sendMessage(from, {
                text: dec,
                contextInfo
            }, { quoted: mek });
        }

    } catch (e) {
        console.log(e);
        reply(`Error: ${e}`);
    }
});
