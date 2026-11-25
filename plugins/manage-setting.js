// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
import axios from 'axios';
import FormData from 'form-data';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ERFAN-MD

// ImgBB API Key (free, working)
const IMGBB_API_KEY = 'b63a821d989cdf895808a44aa5b76c33';

// Helper function to extract number from JID
function extractNumber(jid) {
    if (!jid) return '';
    return jid.split('@')[0];
}

// ========== SPACE TOLERANCE HELPERS ==========
// These let commands still work when an extra space is typed after the
// prefix, e.g. ". antilink on" behaves the same as ".antilink on".
function spaceTolerantAliases(name, extra = []) {
    const list = [...new Set([...extra, name])];
    return [...list, ...list.map(a => ` ${a}`)];
}

// Returns the first meaningful argument (skips repeated command/alias words
// that some frameworks include at the start of args)
function firstArg(args, ...skipNames) {
    const skip = new Set(skipNames.map(n => n.toLowerCase()));
    const list = (args || []).map(a => String(a).trim()).filter(Boolean);
    for (const a of list) {
        if (!skip.has(a.toLowerCase())) return a;
    }
    return '';
}

// Joins all meaningful arguments into one sentence (skips command words)
function joinArgs(args, ...skipNames) {
    const skip = new Set(skipNames.map(n => n.toLowerCase()));
    return (args || [])
        .map(a => String(a).trim())
        .filter(Boolean)
        .filter(a => !skip.has(a.toLowerCase()))
        .join(' ');
}

// Pretty on/off display instead of raw true/false
function pretty(value) {
    if (value === 'true' || value === true) return 'ON';
    if (value === 'false' || value === false) return 'OFF';
    return String(value || 'OFF').toUpperCase();
}

cmd({
    pattern: "statuslike",
    alias: spaceTolerantAliases("statuslike", ["statusreact"]),
    desc: "Toggle auto view status",
    category: "settings",
    react: "👁️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const value = firstArg(args, "statuslike", "statusreact").toLowerCase();

    if (!value) {
        return reply(`📌 *Usage:* .statuslike on/off\n*Current:* ${pretty(userConfig.AUTO_LIKE_STATUS)}`);
    }

    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Please use:* on or off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.AUTO_LIKE_STATUS = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Auto Like Status:* ${pretty(newValue)}`);
});

// ===============================
// ANTI Status COMMAND - FIXED
// ===============================
cmd({
    pattern: "antistatus",
    alias: ["anti-status"],
    desc: "Toggle Anti Status protection\n\n*Options:*\n• on - Enable Anti Status (warn + delete)\n• off - Disable Anti Status\n• warn - Only warn users\n• delete - Only delete messages",
    category: "settings",
    react: "🚫",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`📌 *Usᴀɢᴇ:* antistatus on/off/warn/delete\n*Cᴜʀʀᴇɴᴛ:* ${userConfig.ANTI_STATUS === 'true' ? 'on' : userConfig.ANTI_STATUS === 'false' ? 'off' : userConfig.ANTI_STATUS || 'off'}\n\n*Oᴘᴛɪᴏɴs:*\n• on - Warn + delete Status\n• off - Disable Anti Status\n• warn - Only warn users\n• delete - Only delete messages`);
    }

    const value = args[0].toLowerCase();
    if (value !== 'on' && value !== 'off' && value !== 'warn' && value !== 'delete') {
        return reply("❌ Please use: on, off, warn, or delete");
    }

    // Convert 'on' to 'true', 'off' to 'false', keep 'warn' and 'delete' as is
    let configValue;
    let responseMsg = "";
    
    if (value === "on") {
        configValue = "true";
        responseMsg = "✅ Anti Status set to ON\n\nUsers sending Status will be warned and messages will be deleted.";
    } else if (value === "off") {
        configValue = "false";
        responseMsg = "✅ Anti Status set to OFF\n\nNo Status protection active.";
    } else if (value === "warn") {
        configValue = "warn";
        responseMsg = "✅ Anti Status set to WARN\n\nUsers will receive warnings when sending Status, but messages won't be deleted.";
    } else if (value === "delete") {
        configValue = "delete";
        responseMsg = "✅ Anti Status set to DELETE\n\nStatus messages will be deleted without warning.";
    }

    userConfig.ANTI_STATUS = configValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(responseMsg);
});


// ===============================
// BOT DP COMMAND - Using ImgBB
// ===============================

cmd({
    pattern: "botdp",
    alias: spaceTolerantAliases("botdp", ["botimage", "botpic", "botphoto"]),
    desc: "Set bot display picture",
    category: "settings",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, updateUserConfig, userConfig, sanitizedNumber, quoted }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    try {
        let imageUrl = firstArg(args, "botdp", "botimage", "botpic", "botphoto");

        // If no URL provided but replied to an image
        if (!imageUrl && m.quoted) {
            const quotedMsg = m.quoted;
            const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';
            
            if (!mimeType || !mimeType.includes('image')) {
                return reply("❌ Please reply to an image");
            }

            await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

            const mediaBuffer = await quotedMsg.download();

            // Upload to ImgBB (same as url command)
            const form = new FormData();
            form.append('key', IMGBB_API_KEY);
            form.append('image', mediaBuffer.toString('base64'));
            form.append('name', 'botdp');

            const response = await axios.post("https://api.imgbb.com/1/upload", form, {
                headers: form.getHeaders(),
                timeout: 60000
            });

            imageUrl = response.data?.data?.url;

            if (!imageUrl) throw new Error("Upload failed - no URL returned");

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        }

        // If URL provided directly
        if (!imageUrl || !imageUrl.startsWith("http")) {
            return reply("❌ Provide a valid image URL or reply to an image.");
        }

        // Update user config with new bot image
        userConfig.BOT_IMAGE = imageUrl;
        await updateUserConfig(sanitizedNumber, userConfig);

        // Send success message with the image
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: `✅ *Bot Display Picture Updated!*\n\n📁 *Image URL:* ${imageUrl}\n\n> © Updated by ERFAN-MD 💜`
        }, { quoted: mek });

    } catch (error) {
        console.error('BotDP Error:', error);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        await reply(`❌ Error: ${error.message || error}`);
    }
});

// ===============================
// WELCOME COMMAND
// ===============================
cmd({
    pattern: "welcome",
    alias: spaceTolerantAliases("welcome"),
    desc: "Toggle welcome messages",
    category: "settings",
    react: "🎉",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const value = firstArg(args, "welcome").toLowerCase();

    if (!value) {
        return reply(`📌 *Usage:* .welcome on/off\n*Current:* ${pretty(userConfig.WELCOME)}`);
    }

    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Please use:* on or off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.WELCOME = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Welcome messages:* ${pretty(newValue)}`);
});

// ===============================
// GOODBYE COMMAND
// ===============================
cmd({
    pattern: "goodbye",
    alias: spaceTolerantAliases("goodbye"),
    desc: "Toggle goodbye messages",
    category: "settings",
    react: "👋",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const value = firstArg(args, "goodbye").toLowerCase();

    if (!value) {
        return reply(`📌 *Usage:* .goodbye on/off\n*Current:* ${pretty(userConfig.GOODBYE)}`);
    }

    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Please use:* on or off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.GOODBYE = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Goodbye messages:* ${pretty(newValue)}`);
});

// ===============================
// SET WELCOME COMMAND
// ===============================
cmd({
    pattern: "setwelcome",
    alias: spaceTolerantAliases("setwelcome"),
    desc: "Set custom welcome message\n\n*Placeholders:*\n• @user - Mention new member\n• @group - Group name\n• @desc - Group description\n• @count - Total members\n• @bot - Bot name\n• @time - Current time",
    category: "settings",
    react: "✏️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const welcomeMessage = joinArgs(args, "setwelcome");

    if (!welcomeMessage) {
        return reply(`📌 *Current welcome message:*\n\n${userConfig.WELCOME_MESSAGE || 'Not set'}\n\n*Usage:* .setwelcome <message>\n\n*Placeholders:*\n• @user - Mention new member\n• @group - Group name\n• @desc - Group description\n• @count - Total members\n• @bot - Bot name\n• @time - Current time`);
    }

    userConfig.WELCOME_MESSAGE = welcomeMessage;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Welcome message set to:*\n\n${welcomeMessage}`);
});

// ===============================
// SET GOODBYE COMMAND
// ===============================
cmd({
    pattern: "setgoodbye",
    alias: spaceTolerantAliases("setgoodbye"),
    desc: "Set custom goodbye message\n\n*Placeholders:*\n• @user - Mention leaving member\n• @group - Group name\n• @desc - Group description\n• @count - Total members\n• @bot - Bot name\n• @time - Current time",
    category: "settings",
    react: "✏️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const goodbyeMessage = joinArgs(args, "setgoodbye");

    if (!goodbyeMessage) {
        return reply(`📌 *Current goodbye message:*\n\n${userConfig.GOODBYE_MESSAGE || 'Not set'}\n\n*Usage:* .setgoodbye <message>\n\n*Placeholders:*\n• @user - Mention leaving member\n• @group - Group name\n• @desc - Group description\n• @count - Total members\n• @bot - Bot name\n• @time - Current time`);
    }

    userConfig.GOODBYE_MESSAGE = goodbyeMessage;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Goodbye message set to:*\n\n${goodbyeMessage}`);
});

// ===============================
// BANLIST COMMAND
// ===============================
cmd({
    pattern: "banlist",
    alias: spaceTolerantAliases("banlist", ["banned"]),
    desc: "Show list of banned users",
    category: "settings",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    let bannedList = Array.isArray(userConfig.BANNED) ? userConfig.BANNED : [];

    if (bannedList.length === 0) {
        return reply("📋 *No banned users found.*");
    }

    let listText = "*📋 Banned Users:*\n\n";
    for (let i = 0; i < bannedList.length; i++) {
        const user = bannedList[i];
        const userNumber = extractNumber(user);
        listText += `${i + 1}. ${userNumber}\n`;
    }

    await reply(listText);
});

// ===============================
// BAN COMMAND
// ===============================
cmd({
    pattern: "ban",
    alias: spaceTolerantAliases("ban"),
    desc: "Ban a user from using the bot",
    category: "settings",
    react: "🔨",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    // Get target JID directly from mentioned or quoted
    let target = m.mentionedJid?.[0] || (m.quoted?.sender ?? null);

    // If args provided, check if it's a JID format
    if (!target) {
        const argTarget = firstArg(args, "ban");
        if (argTarget && argTarget.includes('@')) {
            target = argTarget;
        } else {
            return reply("⚠️ Please mention the user or reply to their message.\n\n*Usage:* .ban @user or reply to user's message");
        }
    }

    if (!target) {
        return reply("⚠️ Please provide a target to ban!\n\n*Usage:* .ban @user or reply to a message");
    }

    // Can't ban the bot itself
    if (target === conn.user.id) {
        return reply("🤖 I can't ban myself!");
    }

    // Can't ban the owner
    const ownerJid = userConfig.OWNER_NUMBER || '';
    if (ownerJid) {
        const ownerWithSuffix = ownerJid.includes('@') ? ownerJid : ownerJid + '@s.whatsapp.net';
        if (target === ownerWithSuffix) {
            return reply("👑 Cannot ban the owner!");
        }
    }

    let bannedList = Array.isArray(userConfig.BANNED) ? [...userConfig.BANNED] : [];

    if (bannedList.includes(target)) {
        return reply("❌ This user is already banned!");
    }

    bannedList.push(target);
    userConfig.BANNED = bannedList;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *User banned successfully!*\n\nUser: ${target}`);
});

// ===============================
// UNBAN COMMAND
// ===============================
cmd({
    pattern: "unban",
    alias: spaceTolerantAliases("unban"),
    desc: "Unban a user from using the bot",
    category: "settings",
    react: "🔓",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    // Get target JID directly from mentioned or quoted
    let target = m.mentionedJid?.[0] || (m.quoted?.sender ?? null);

    // If args provided, check if it's a JID format
    if (!target) {
        const argTarget = firstArg(args, "unban");
        if (argTarget && argTarget.includes('@')) {
            target = argTarget;
        } else {
            return reply("⚠️ Please mention the user or reply to their message.\n\n*Usage:* .unban @user or reply to user's message");
        }
    }

    if (!target) {
        return reply("⚠️ Please provide a target to unban!\n\n*Usage:* .unban @user or reply to a message");
    }

    let bannedList = Array.isArray(userConfig.BANNED) ? [...userConfig.BANNED] : [];

    if (!bannedList.includes(target)) {
        return reply("❌ This user is not banned!");
    }

    bannedList = bannedList.filter(jid => jid !== target);
    userConfig.BANNED = bannedList;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *User unbanned successfully!*\n\nUser: ${target}`);
});

// ===============================
// SUDO COMMAND
// ===============================
cmd({
    pattern: "sudo",
    alias: spaceTolerantAliases("sudo"),
    desc: "Add a user to sudo list",
    category: "settings",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    // Get target JID directly from mentioned or quoted
    let target = m.mentionedJid?.[0] || (m.quoted?.sender ?? null);

    // If args provided, try to match with @lid format
    if (!target) {
        const argTarget = firstArg(args, "sudo");
        if (argTarget && argTarget.includes('@')) {
            target = argTarget;
        } else {
            return reply("⚠️ Please mention the user or reply to their message.\n\n*Usage:* .sudo @user or reply to user's message");
        }
    }

    if (!target) {
        return reply("⚠️ Please provide a target to add to sudo!\n\n*Usage:* .sudo @user or reply to a message");
    }

    // Check if trying to sudo the bot itself
    if (target === conn.user.id) {
        return reply("🤖 I can't sudo myself!");
    }

    let sudoList = Array.isArray(userConfig.SUDO) ? [...userConfig.SUDO] : [];

    if (sudoList.includes(target)) {
        return reply("❌ This user is already in sudo list!");
    }

    sudoList.push(target);
    userConfig.SUDO = sudoList;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *User added to sudo list!*\n\nUser: ${target}`);
});

// ===============================
// DELSUDO COMMAND
// ===============================
cmd({
    pattern: "delsudo",
    alias: spaceTolerantAliases("delsudo", ["removesudo"]),
    desc: "Remove a user from sudo list",
    category: "settings",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    // Get target JID directly from mentioned or quoted
    let target = m.mentionedJid?.[0] || (m.quoted?.sender ?? null);

    // If args provided, try to match with @lid format
    if (!target) {
        const argTarget = firstArg(args, "delsudo", "removesudo");
        if (argTarget && argTarget.includes('@')) {
            target = argTarget;
        } else {
            return reply("⚠️ Please mention the user or reply to their message.\n\n*Usage:* .delsudo @user or reply to user's message");
        }
    }

    if (!target) {
        return reply("⚠️ Please provide a target to remove from sudo!\n\n*Usage:* .delsudo @user or reply to a message");
    }

    let sudoList = Array.isArray(userConfig.SUDO) ? [...userConfig.SUDO] : [];

    if (!sudoList.includes(target)) {
        return reply("❌ This user is not in sudo list!");
    }

    sudoList = sudoList.filter(jid => jid !== target);
    userConfig.SUDO = sudoList;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *User removed from sudo list!*\n\nUser: ${target}`);
});

// ===============================
// LISTSUDO COMMAND
// ===============================
cmd({
    pattern: "listsudo",
    alias: spaceTolerantAliases("listsudo", ["sudoers"]),
    desc: "Show list of sudo users",
    category: "settings",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    let sudoList = Array.isArray(userConfig.SUDO) ? userConfig.SUDO : [];

    if (sudoList.length === 0) {
        return reply("📋 *No sudo users found.*");
    }

    let listText = "*📋 Sudo Users:*\n\n";
    for (let i = 0; i < sudoList.length; i++) {
        const user = sudoList[i];
        const userNumber = extractNumber(user);
        listText += `${i + 1}. ${userNumber}\n`;
    }

    await reply(listText);
});

// ===============================
// ANTIEDIT COMMAND
// ===============================
cmd({
    pattern: "antiedit",
    alias: spaceTolerantAliases("antiedit"),
    desc: "Toggle anti-edit feature (detects and shows edited messages)",
    category: "settings",
    react: "✏️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const value = firstArg(args, "antiedit").toLowerCase();

    if (!value) {
        return reply(`📌 *Usage:* .antiedit on/off\n*Current:* ${pretty(userConfig.ANTI_EDIT)}\n*Edit path:* ${userConfig.ANTIEDIT_PATH || 'inbox'}\n\n*To change edit path use:* .editpath <inbox/same>`);
    }

    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Please use:* on or off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.ANTI_EDIT = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Anti-Edit:* ${pretty(newValue)}\n*Edit path:* ${userConfig.ANTIEDIT_PATH || 'inbox'}`);
});

// ===============================
// EDITPATH COMMAND
// ===============================
cmd({
    pattern: "editpath",
    alias: spaceTolerantAliases("editpath"),
    desc: "Set where to show edited messages\n\n*Options:*\n• inbox - Send in inbox (default)\n• same - Send in the same chat where message was edited",
    category: "settings",
    react: "📍",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const value = firstArg(args, "editpath").toLowerCase();

    if (!value) {
        return reply(`📌 *Usage:* .editpath inbox/same\n*Current path:* ${userConfig.ANTIEDIT_PATH || 'inbox'}\n\n*Options:*\n• inbox - Edited message notification in inbox\n• same - Edited message notification in the same chat`);
    }

    if (value !== 'inbox' && value !== 'same') {
        return reply('❌ *Please use:* inbox or same');
    }

    userConfig.ANTIEDIT_PATH = value;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Edit path:* ${value}\n*Anti-Edit status:* ${pretty(userConfig.ANTI_EDIT)}`);
});

// ===============================
// AUTOREAD COMMAND
// ===============================
cmd({
    pattern: "autoread",
    alias: spaceTolerantAliases("autoread", ["readmsg", "autoreadmsg"]),
    desc: "Toggle auto-read messages feature",
    category: "settings",
    react: "👁️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const value = firstArg(args, "autoread", "readmsg", "autoreadmsg").toLowerCase();

    if (!value) {
        return reply(`📌 *Usage:* .autoread on/off\n*Current:* ${pretty(userConfig.READ_MESSAGE)}\n\n*When enabled, the bot will automatically mark messages as read.*`);
    }

    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Please use:* on or off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.READ_MESSAGE = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Auto-Read:* ${pretty(newValue)}\n\n${newValue === 'true' ? '🔵 Bot will now automatically mark messages as read.' : '⚪ Bot will not automatically mark messages as read.'}`);
});

// ===============================
// ANTI LINK COMMAND
// ===============================
cmd({
    pattern: "antilink",
    alias: spaceTolerantAliases("antilink", ["linkblock"]),
    desc: "Toggle anti-link protection\n\n*Options:*\n• on - Delete + kick immediately\n• warn - Warn first, kick on 2nd offense\n• delete - Only delete messages\n• off - Disable",
    category: "settings",
    react: "🚫",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const value = firstArg(args, "antilink", "linkblock").toLowerCase();

    if (!value) {
        const current = userConfig.ANTI_LINK || 'off';
        return reply(`📌 *Usage:* .antilink on/off/warn/delete\n*Current:* ${current}\n\n*Options:*\n• on - Delete + kick immediately\n• warn - Warn first, kick on 2nd offense\n• delete - Only delete messages, no kick\n• off - Disable anti-link`);
    }

    if (!['on', 'off', 'warn', 'delete', 'kick'].includes(value)) {
        return reply("❌ Please use: on, off, warn, or delete");
    }

    let configValue;
    let responseMsg = "";

    if (value === "on" || value === "kick") {
        configValue = "true";
        responseMsg = "✅ *Anti-Link:* ON\n\nLink messages will be deleted and the sender removed immediately.";
    } else if (value === "off") {
        configValue = "false";
        responseMsg = "✅ *Anti-Link:* OFF\n\nNo link protection active.";
    } else if (value === "warn") {
        configValue = "warn";
        responseMsg = "✅ *Anti-Link:* WARN\n\nFirst link = warning, second link = removed from group.";
    } else if (value === "delete") {
        configValue = "delete";
        responseMsg = "✅ *Anti-Link:* DELETE\n\nLink messages will be deleted, no warning or kick.";
    }

    await updateUserConfig(sanitizedNumber, { ANTI_LINK: configValue });
    await reply(responseMsg);
});

// ANTI DELETE COMMAND
// ===============================
cmd({
    pattern: "antidelete",
    alias: spaceTolerantAliases("antidelete", ["antidel", "delblock"]),
    desc: "Toggle anti-delete message protection",
    category: "settings",
    react: "🗑️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const value = firstArg(args, "antidelete", "antidel", "delblock").toLowerCase();

    if (!value) {
        return reply(`📌 *Usage:* .antidelete on/off\n*Current:* ${pretty(userConfig.ANTI_DELETE)}`);
    }

    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Please use:* on or off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.ANTI_DELETE = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Anti-Delete:* ${pretty(newValue)}\n\nWhen ON: Bot will detect and notify when messages are deleted.`);
});

// ===============================
// RECORDING COMMAND
// ===============================
cmd({
    pattern: "recording",
    alias: spaceTolerantAliases("recording", ["autorecording"]),
    desc: "Toggle auto recording presence",
    category: "settings",
    react: "🎙️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const value = firstArg(args, "recording", "autorecording").toLowerCase();

    if (!value) {
        return reply(`📌 *Usage:* .recording on/off\n*Current:* ${pretty(userConfig.AUTO_RECORDING)}`);
    }

    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Please use:* on or off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.AUTO_RECORDING = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Auto Recording:* ${pretty(newValue)}`);
});

// ===============================
// STATUS VIEW COMMAND
// ===============================
cmd({
    pattern: "statusview",
    alias: spaceTolerantAliases("statusview", ["autoview"]),
    desc: "Toggle auto view status",
    category: "settings",
    react: "👁️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const value = firstArg(args, "statusview", "autoview").toLowerCase();

    if (!value) {
        return reply(`📌 *Usage:* .statusview on/off\n*Current:* ${pretty(userConfig.AUTO_VIEW_STATUS)}`);
    }

    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Please use:* on or off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.AUTO_VIEW_STATUS = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Auto View Status:* ${pretty(newValue)}`);
});

// ===============================
// AUTO REACT COMMAND
// ===============================
cmd({
    pattern: "autoreact",
    alias: spaceTolerantAliases("autoreact", ["autoreaction", "reactauto"]),
    desc: "Toggle auto react to messages",
    category: "settings",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const value = firstArg(args, "autoreact", "autoreaction", "reactauto").toLowerCase();

    if (!value) {
        return reply(`📌 *Usage:* .autoreact on/off\n*Current:* ${pretty(userConfig.AUTO_REACT)}`);
    }

    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Please use:* on or off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.AUTO_REACT = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Auto React:* ${pretty(newValue)}\n\nBot will ${newValue === 'true' ? 'now' : 'no longer'} automatically react to messages.`);
});

// ===============================
// ANTI CALL COMMAND
// ===============================
cmd({
    pattern: "anticall",
    alias: spaceTolerantAliases("anticall", ["antcall", "callblock"]),
    desc: "Toggle anti-call protection",
    category: "settings",
    react: "📵",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const value = firstArg(args, "anticall", "antcall", "callblock").toLowerCase();

    if (!value) {
        return reply(`📌 *Usage:* .anticall on/off\n*Current:* ${pretty(userConfig.ANTI_CALL)}`);
    }

    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Please use:* on or off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.ANTI_CALL = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Anti-Call:* ${pretty(newValue)}\n\nWhen ON: Bot will automatically reject incoming calls and send a rejection message.`);
});

// ===============================
// ANTI CALL MESSAGE COMMAND
// ===============================
cmd({
    pattern: "anticallmsg",
    alias: spaceTolerantAliases("anticallmsg", ["callmsg", "rejectmsg"]),
    desc: "Set custom anti-call rejection message",
    category: "settings",
    react: "📝",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const currentMsg = userConfig.REJECT_MSG || "*📞 Calls are not allowed on this number. You don't have permission 📵*";
    const newMsg = joinArgs(args, "anticallmsg", "callmsg", "rejectmsg");

    if (!newMsg) {
        return reply(`📌 *Current reject message:*\n${currentMsg}\n\n*Usage:* .anticallmsg <your message>\n\n*Example:* .anticallmsg Calls are not allowed on this number`);
    }
    
    userConfig.REJECT_MSG = newMsg;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Anti-Call reject message set to:*\n${newMsg}`);
});

// ===============================
// ADMIN ACTION COMMAND
// ===============================
cmd({
    pattern: "adminaction",
    alias: spaceTolerantAliases("adminaction", ["adminnotify"]),
    desc: "Toggle admin action notifications",
    category: "settings",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const value = firstArg(args, "adminaction", "adminnotify").toLowerCase();

    if (!value) {
        return reply(`📌 *Usage:* .adminaction on/off\n*Current:* ${pretty(userConfig.ADMIN_ACTION)}`);
    }

    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Please use:* on or off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.ADMIN_ACTION = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Admin Action Notifications:* ${pretty(newValue)}`);
});

// ===============================
// AUTO TYPING COMMAND
// ===============================
cmd({
    pattern: "autotyping",
    alias: spaceTolerantAliases("autotyping", ["typing"]),
    desc: "Toggle auto typing in chats",
    category: "settings",
    react: "⌨️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    // Auto-typing permanently disabled by request — always kept off,
    // "on" is no longer accepted.
    if (userConfig.AUTO_TYPING !== 'false') {
        userConfig.AUTO_TYPING = 'false';
        await updateUserConfig(sanitizedNumber, userConfig);
    }

    return reply('❌ *Auto Typing is permanently disabled.*');
});

// ===============================
// ONLINE COMMAND
// ===============================
cmd({
    pattern: "online",
    alias: spaceTolerantAliases("online", ["alwaysonline", "alwayson"]),
    desc: "Toggle always online status",
    category: "settings",
    react: "💚",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const value = firstArg(args, "online", "alwaysonline", "alwayson").toLowerCase();

    if (!value) {
        return reply(`📌 *Usage:* .online on/off\n*Current:* ${pretty(userConfig.ALWAYS_ONLINE)}`);
    }

    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Please use:* on or off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.ALWAYS_ONLINE = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Always Online:* ${pretty(newValue)}\n\nWhen ON: Bot will always show online status.`);
});

// ===============================
// MODE COMMAND
// ===============================
cmd({
    pattern: "mode",
    alias: spaceTolerantAliases("mode", ["mod"]),
    desc: "Change bot mode (public/private/inbox)",
    category: "settings",
    react: "🌐",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const mode = firstArg(args, "mode", "mod").toLowerCase();

    if (!mode) {
        return reply(`📌 *Usage:* .mode public/private/inbox\n*Current:* ${userConfig.MODE || 'public'}`);
    }

    if (!['public', 'private', 'inbox'].includes(mode)) {
        return reply('❌ *Available modes:* public, private, inbox');
    }

    userConfig.MODE = mode;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    const modeDescriptions = {
        public: '📢 Commands work everywhere',
        private: '🔒 Only owner commands work',
        inbox: '💬 Commands work only in private chats'
    };
    
    await reply(`✅ *Bot mode:* ${mode}\n📝 *Info:* ${modeDescriptions[mode]}`);
});

// ===============================
// PREFIX COMMAND
// ===============================
cmd({
    pattern: "prefix",
    alias: spaceTolerantAliases("prefix"),
    desc: "Change command prefix",
    category: "settings",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const newPrefix = firstArg(args, "prefix");

    if (!newPrefix) {
        return reply(`📌 *Usage:* .prefix <new_prefix>\n*Current:* ${userConfig.PREFIX}`);
    }

    if (newPrefix.length > 2) {
        return reply('❌ *Prefix must be 1-2 characters max*');
    }

    userConfig.PREFIX = newPrefix;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Prefix changed to:* ${newPrefix}\n\n*Example:* ${newPrefix}menu`);
});

// ===============================
// BOT NAME COMMAND
// ===============================
cmd({
    pattern: "botname",
    alias: spaceTolerantAliases("botname", ["name"]),
    desc: "Change bot name",
    category: "settings",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const newName = joinArgs(args, "botname", "name");

    if (!newName) {
        return reply(`📌 *Usage:* .botname <new_name>\n*Current:* ${userConfig.BOT_NAME || 'Not set'}`);
    }

    if (newName.length > 30) {
        return reply('❌ *Bot name must be under 30 characters*');
    }

    userConfig.BOT_NAME = newName;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Bot name set to:* ${newName}`);
});

// ===============================
// OWNER NAME COMMAND
// ===============================
cmd({
    pattern: "ownername",
    alias: spaceTolerantAliases("ownername", ["owner"]),
    desc: "Change owner name",
    category: "settings",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const newName = joinArgs(args, "ownername", "owner");

    if (!newName) {
        return reply(`📌 *Usage:* .ownername <new_name>\n*Current:* ${userConfig.OWNER_NAME || 'Not set'}`);
    }

    if (newName.length > 30) {
        return reply('❌ *Owner name must be under 30 characters*');
    }

    userConfig.OWNER_NAME = newName;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Owner name set to:* ${newName}`);
});

// ===============================
// OWNER NUMBER COMMAND
// ===============================
cmd({
    pattern: "ownernumber",
    alias: spaceTolerantAliases("ownernumber", ["ownernum", "ownerphone"]),
    desc: "Change owner number",
    category: "settings",
    react: "📞",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const newNumber = firstArg(args, "ownernumber", "ownernum", "ownerphone");

    if (!newNumber) {
        return reply(`📌 *Usage:* .ownernumber <new_number>\n*Current:* ${userConfig.OWNER_NUMBER || 'Not set'}`);
    }

    if (!newNumber.match(/^\d{10,15}$/)) {
        return reply('❌ *Please enter a valid phone number (10-15 digits)*');
    }

    userConfig.OWNER_NUMBER = newNumber;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Owner number set to:* ${newNumber}`);
});

// ===============================
// DESCRIPTION COMMAND
// ===============================
cmd({
    pattern: "description",
    alias: spaceTolerantAliases("description", ["desc", "about"]),
    desc: "Change bot description",
    category: "settings",
    react: "📝",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const newDesc = joinArgs(args, "description", "desc", "about");

    if (!newDesc) {
        return reply(`📌 *Usage:* .description <new_description>\n*Current:* ${userConfig.DESCRIPTION || 'Not set'}`);
    }

    if (newDesc.length > 200) {
        return reply('❌ *Description must be under 200 characters*');
    }

    userConfig.DESCRIPTION = newDesc;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Bot description set to:* ${newDesc}`);
});

// ===============================
// STICKER NAME COMMAND
// ===============================
cmd({
    pattern: "stickername",
    alias: spaceTolerantAliases("stickername", ["stickertext", "stname"]),
    desc: "Set sticker pack name",
    category: "settings",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const stickerName = joinArgs(args, "stickername", "stickertext", "stname");

    if (!stickerName) {
        const currentName = userConfig.STICKER_NAME || 'Sticker Pack';
        return reply(`📌 *Usage:* .stickername Your Pack Name\n*Current:* ${currentName}`);
    }
    
    userConfig.STICKER_NAME = stickerName;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Sticker pack name set to:* ${stickerName}`);
});

// ===============================
// DELPATH COMMAND
// ===============================
cmd({
    pattern: "delpath",
    alias: spaceTolerantAliases("delpath", ["deletepath", "antideletepath"]),
    desc: "Set anti-delete path (same/inbox)",
    category: "settings",
    react: "🗑️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const value = firstArg(args, "delpath", "deletepath", "antideletepath").toLowerCase();

    if (!value) {
        return reply(`📌 *Usage:* .delpath same/inbox\n*Current:* ${userConfig.ANTI_DELETE_PATH || 'inbox'}`);
    }

    if (value !== 'same' && value !== 'inbox') {
        return reply('❌ *Please use:* same or inbox\n• *same* - Delete from same chat\n• *inbox* - Delete only from inbox');
    }

    userConfig.ANTI_DELETE_PATH = value;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Anti-Delete path:* ${value}`);
});

// ===============================
// REACT EMOJIS COMMAND
// ===============================
cmd({
    pattern: "reactemojis",
    alias: spaceTolerantAliases("reactemojis", ["reacts", "reactset"]),
    desc: "Set auto react emojis",
    category: "settings",
    react: "😍",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const input = joinArgs(args, "reactemojis", "reacts", "reactset");

    if (!input) {
        const currentEmojis = userConfig.REACT_EMOJIS || ['😍', '❤️', '🔥', '👏', '😮', '😢', '🤣', '👍', '🎉', '🤔', '🙏', '😊', '🥰', '💕', '🤩', '✨', '😎', '🥳', '🙌'];
        return reply(`📌 *Usage:* .reactemojis 😍,❤️,🔥,👏,😮\n*Current:* ${currentEmojis.join(', ')}`);
    }
    
    const consecutiveEmojisRegex = /[\p{Emoji}\u200d]+(?![,])[\p{Emoji}\u200d]+/gu;
    
    if (consecutiveEmojisRegex.test(input)) {
        return reply('❌ *Invalid format! Please separate all emojis with commas*\n*Example:* .reactemojis 😍,❤️,🔥,👏,😮');
    }
    
    const emojis = input.split(',').map(e => e.trim()).filter(e => e);
    
    const invalidEntries = emojis.filter(emoji => {
        const hasMultipleEmojis = Array.from(emoji).some((c, i, arr) => {
            if (i === 0) return false;
            const prev = arr[i-1];
            const regex = /\p{Emoji}/u;
            return regex.test(c) && regex.test(prev) && c !== '\u200d' && prev !== '\u200d';
        });
        
        return hasMultipleEmojis;
    });
    
    if (invalidEntries.length > 0) {
        return reply('❌ *Invalid format! Don\'t use multiple emojis without commas*\n*Example:* .reactemojis 😍,❤️,🔥,👏,😮');
    }
    
    if (emojis.length === 0) {
        return reply('❌ *Please provide valid emojis*');
    }

    userConfig.REACT_EMOJIS = emojis;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Auto react emojis set:*\n${emojis.join(', ')}`);
});

// ===============================
// OWNER EMOJIS COMMAND
// ===============================
cmd({
    pattern: "owneremojis",
    alias: spaceTolerantAliases("owneremojis", ["owneremojiset", "ownerreacts"]),
    desc: "Set owner emojis for reactions",
    category: "settings",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }

    const input = joinArgs(args, "owneremojis", "owneremojiset", "ownerreacts");

    if (!input) {
        const currentEmojis = userConfig.OWNER_EMOJIS || ['👑', '⭐', '💎', '🌟', '✨', '⚡', '🔥', '❤️', '💕', '🎯'];
        return reply(`📌 *Usage:* .owneremojis 👑,⭐,💎,🌟,✨\n*Current:* ${currentEmojis.join(', ')}`);
    }
    
    const consecutiveEmojisRegex = /[\p{Emoji}\u200d]+(?![,])[\p{Emoji}\u200d]+/gu;
    
    if (consecutiveEmojisRegex.test(input)) {
        return reply('❌ *Invalid format! Please separate all emojis with commas*\n*Example:* .owneremojis 👑,⭐,💎,🌟,✨');
    }
    
    const emojis = input.split(',').map(e => e.trim()).filter(e => e);
    
    const invalidEntries = emojis.filter(emoji => {
        const hasMultipleEmojis = Array.from(emoji).some((c, i, arr) => {
            if (i === 0) return false;
            const prev = arr[i-1];
            const regex = /\p{Emoji}/u;
            return regex.test(c) && regex.test(prev) && c !== '\u200d' && prev !== '\u200d';
        });
        
        return hasMultipleEmojis;
    });
    
    if (invalidEntries.length > 0) {
        return reply('❌ *Invalid format! Don\'t use multiple emojis without commas*\n*Example:* .owneremojis 👑,⭐,💎,🌟,✨');
    }
    
    if (emojis.length === 0) {
        return reply('❌ *Please provide valid emojis*');
    }

    userConfig.OWNER_EMOJIS = emojis;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Owner emojis set:*\n${emojis.join(', ')}`);
});

// ===============================
// SETTINGS COMMAND
// ===============================
cmd({
    pattern: "settings",
    alias: spaceTolerantAliases("settings", ["setting", "env", "config"]),
    desc: "Bot settings management - View all available setting commands",
    category: "settings",
    react: "⚙️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, prefix, userConfig }) => {
    if (!isCreator) {
        return reply("*📛 Owner only command.*");
    }
    
    const botName = userConfig.BOT_NAME || 'ERFAN-MD';

    const settingsText = `
╭──「 ⚙️ *${botName} Settings* 」
│
│ 📁 *General*
│ › welcome on/off
│ › goodbye on/off
│ › setwelcome <message>
│ › setgoodbye <message>
│
│ 📁 *Anti Features*
│ › antiedit on/off
│ › editpath inbox/same
│ › antilink on/warn/delete/off
│ › antidelete on/off
│ › anticall on/off
│ › anticallmsg <message>
│
│ 📁 *Auto Features*
│ › autoread on/off
│ › recording on/off
│ › statusview on/off
│ › statuslike on/off
│ › autoreact on/off
│ › online on/off
│
│ 📁 *Users*
│ › ban @user
│ › unban @user
│ › banlist
│ › sudo @user
│ › delsudo @user
│ › listsudo
│
│ 📁 *Bot Settings*
│ › mode public/private/inbox
│ › prefix <new_prefix>
│ › botname <name>
│ › ownername <name>
│ › ownernumber <number>
│ › description <text>
│ › botdp <url> or reply image
│ › stickername <name>
│ › delpath same/inbox
│ › reactemojis 😍,❤️,🔥
│ › owneremojis 👑,⭐,💎
│
│ 📊 *Current Status*
│ › Welcome: ${pretty(userConfig.WELCOME)}
│ › Goodbye: ${pretty(userConfig.GOODBYE)}
│ › Anti-Edit: ${pretty(userConfig.ANTI_EDIT)}
│ › Anti-Link: ${userConfig.ANTI_LINK || 'off'}
│ › Anti-Delete: ${pretty(userConfig.ANTI_DELETE)}
│ › Anti-Call: ${pretty(userConfig.ANTI_CALL)}
│ › Auto-Read: ${pretty(userConfig.READ_MESSAGE)}
│ › Auto-React: ${pretty(userConfig.AUTO_REACT)}
│ › Auto-Typing: ${pretty(userConfig.AUTO_TYPING)}
│ › Always Online: ${pretty(userConfig.ALWAYS_ONLINE)}
│ › Mode: ${userConfig.MODE || 'public'}
│ › Prefix: ${userConfig.PREFIX || prefix}
│
│ 💡 *Tip:* Use .help <command> for details
╰───────────────
    `;
    
    await reply(settingsText);
});
