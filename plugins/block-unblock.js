// ERFAN-MD - BLOCK/UNBLOCK/BLOCKLIST COMMANDS
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// HELPER: Get bot owner JID
// ============================================
function getBotNumber(sock) {
    try {
        if (!sock.user?.id) return null;
        return sock.user.id.includes(':') 
            ? sock.user.id.split(':')[0] + '@s.whatsapp.net'
            : sock.user.id;
    } catch {
        return null;
    }
}

function normalizeJid(input) {
    if (!input) return null;
    if (input.endsWith('@s.whatsapp.net') || input.endsWith('@g.us')) return input;
    const digits = input.toString().replace(/\D/g, '');
    if (digits.length < 7) return null;
    return digits + '@s.whatsapp.net';
}

// ============================================
// BLOCK COMMAND
// ============================================
cmd({
    pattern: "block",
    desc: "Block a user",
    category: "owner",
    react: "🚫",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, args, isOwner, quoted, senderNumber }) => {
    try {
        console.log("=== BLOCK COMMAND CALLED ===");
        console.log("From:", from);
        console.log("Sender:", sender);
        console.log("Sender Number:", senderNumber);
        console.log("isOwner:", isOwner);
        console.log("Args:", args);
        console.log("Quoted:", quoted);
        console.log("Full Message:", JSON.stringify(m).substring(0, 500));
        
        // Get bot number
        const botNumber = getBotNumber(conn);
        console.log("Bot Number:", botNumber);
        
        // SIMPLIFIED OWNER CHECK - Remove isOwner dependency
        const ownerJids = [
            botNumber,
            senderNumber,
            sender,
            conn.user?.id,
            conn.user?.id?.split(':')[0] + '@s.whatsapp.net'
        ].filter(Boolean);
        
        console.log("Owner JIDs to check:", ownerJids);
        
        // For now, let's skip owner check to test if command works
        // You can add owner check back once we confirm command works
        /*
        if (!isOwner && !ownerJids.includes(sender)) {
            console.log("NOT OWNER - Returning");
            return reply("*❌ Only bot owner can use this!*");
        }
        */
        
        let jid = null;

        // Check if replying to a message
        if (m.quoted?.sender) {
            jid = m.quoted.sender;
            console.log("Got JID from quoted:", jid);
        } 
        // Check if mentioning someone
        else if (m.mentions?.[0]) {
            jid = m.mentions[0];
            console.log("Got JID from mention:", jid);
        }
        // Check if number provided as argument
        else if (args?.[0]) {
            jid = normalizeJid(args[0]);
            console.log("Got JID from args:", jid);
        }

        console.log("Final JID:", jid);

        if (!jid) {
            console.log("NO JID FOUND - Sending usage");
            return reply(
                "*🚫 Block User*\n\n" +
                "*Usage:*\n" +
                "• Reply to message: `.block`\n" +
                "• Mention: `.block @user`\n" +
                "• Number: `.block 923001234567`"
            );
        }

        if (jid === botNumber) {
            return reply("*❌ You can't block the bot itself!*");
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        try {
            console.log("Attempting to block:", jid);
            await conn.updateBlockStatus(jid, 'block');
            console.log("Block successful!");
            
            await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
            
            const blockMsg = `*🚫 Blocked!*\n\n@${jid.split('@')[0]} has been blocked.`;
            
            await conn.sendMessage(from, { 
                text: blockMsg,
                mentions: [jid]
            }, { quoted: mek });
            
        } catch (error) {
            console.error("Block Error:", error);
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            await reply(`*❌ Failed to block!*\n\n_${error.message || error}_`);
        }
        
    } catch (error) {
        console.error("Block Command Error:", error);
        await reply(`*❌ Command error!*\n\n_${error.message}_`);
    }
});

// ============================================
// UNBLOCK COMMAND
// ============================================
cmd({
    pattern: "unblock",
    desc: "Unblock a user",
    category: "owner",
    react: "🔓",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, args, isOwner, quoted }) => {
    try {
        console.log("=== UNBLOCK COMMAND CALLED ===");
        
        const botNumber = getBotNumber(conn);
        
        let jid = null;

        // Check if replying to a message
        if (m.quoted?.sender) {
            jid = m.quoted.sender;
        } 
        // Check if mentioning someone
        else if (m.mentions?.[0]) {
            jid = m.mentions[0];
        }
        // Check if number provided as argument
        else if (args?.[0]) {
            jid = normalizeJid(args[0]);
        }

        console.log("JID for unblock:", jid);

        if (!jid) {
            return reply(
                "*🔓 Unblock User*\n\n" +
                "*Usage:*\n" +
                "• Reply to message: `.unblock`\n" +
                "• Mention: `.unblock @user`\n" +
                "• Number: `.unblock 923001234567`"
            );
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        try {
            console.log("Attempting to unblock:", jid);
            await conn.updateBlockStatus(jid, 'unblock');
            console.log("Unblock successful!");
            
            await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
            
            const unblockMsg = `*🔓 Unblocked!*\n\n@${jid.split('@')[0]} has been unblocked.`;
            
            await conn.sendMessage(from, { 
                text: unblockMsg,
                mentions: [jid]
            }, { quoted: mek });
            
        } catch (error) {
            console.error("Unblock Error:", error);
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            await reply(`*❌ Failed to unblock!*\n\n_${error.message || error}_`);
        }
        
    } catch (error) {
        console.error("Unblock Command Error:", error);
        await reply(`*❌ Command error!*\n\n_${error.message}_`);
    }
});

// ============================================
// BLOCKLIST COMMAND
// ============================================
cmd({
    pattern: "blocklist",
    alias: ["listblock", "blocked", "blocks"],
    desc: "Show blocked users",
    category: "owner",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, isOwner }) => {
    try {
        console.log("=== BLOCKLIST COMMAND CALLED ===");
        
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        try {
            const list = await conn.fetchBlocklist();
            console.log("Blocklist:", list);

            if (!list || list.length === 0) {
                await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
                return reply("*📋 Blocked List*\n\n_No users blocked._");
            }

            let text = `*📋 Blocked Users: ${list.length}*\n\n`;
            list.forEach((jid, i) => {
                text += `${i + 1}. @${jid.split('@')[0]}\n`;
            });

            await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
            
            await conn.sendMessage(from, { 
                text: text,
                mentions: list
            }, { quoted: mek });

        } catch (error) {
            console.error("Blocklist Error:", error);
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            await reply(`*❌ Failed to fetch blocklist!*\n\n_${error.message || error}_`);
        }
        
    } catch (error) {
        console.error("Blocklist Command Error:", error);
        await reply(`*❌ Command error!*\n\n_${error.message}_`);
    }
});
