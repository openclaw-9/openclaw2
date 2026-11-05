// ERFAN-MD — Anti-Tag toggle command
// Blocks tagall / mass-mention spam in groups. Enforcement logic lives in
// index.js (messages.upsert handler); this file only lets admins flip the
// setting via chat.
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "antitag",
    alias: ["antimention", "at"],
    use: '.antitag on/off/kick',
    desc: "Block tagall / mass-mention spam in this group",
    category: "admin",
    react: "🚫",
    filename: __filename
},
async (conn, mek, m, { isGroup, isAdmins, isOwner, reply, args, userConfig, updateUserConfig, sanitizedNumber }) => {
    try {
        if (!isGroup) return reply("This command only works inside a group.");
        if (!isAdmins && !isOwner) return reply("Only group admins can use *.antitag*.");

        const opt = (args[0] || '').toLowerCase();
        const current = userConfig?.ANTI_TAG && userConfig.ANTI_TAG !== 'false' ? userConfig.ANTI_TAG.toUpperCase() : 'OFF';

        if (!opt) {
            return reply(
                `📛 Anti-tag is currently: *${current}*\n\n` +
                `Usage:\n` +
                `.antitag on   — delete tagall messages\n` +
                `.antitag kick — delete + remove the sender\n` +
                `.antitag off  — disable`
            );
        }

        if (!['on', 'off', 'kick'].includes(opt)) {
            return reply("Usage: .antitag on / off / kick");
        }

        const value = opt === 'on' ? 'delete' : opt;
        await updateUserConfig(sanitizedNumber, { ANTI_TAG: value });
        return reply(value === 'false' ? "✅ Anti-tag turned *OFF*." : `✅ Anti-tag set to *${value.toUpperCase()}*.`);
    } catch (e) {
        reply(`Error: ${e.message}`);
    }
});
