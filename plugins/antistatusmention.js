// ERFAN-MD — Anti-Status-Mention toggle command
// Blocks forwarded WhatsApp Status mentions being dropped into a group.
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "antistatusmention",
    alias: ["asm", "antistatustag"],
    use: '.antistatusmention on/off',
    desc: "Block forwarded Status-mention messages in this group",
    category: "admin",
    react: "🚫",
    filename: __filename
},
async (conn, mek, m, { isGroup, isAdmins, isCreator, reply, args, userConfig, updateUserConfig, sanitizedNumber }) => {
    try {
        if (!isGroup) return reply("This command only works inside a group.");
        if (!isAdmins && !isCreator) return reply("Only group admins can use *.antistatusmention*.");

        const opt = (args[0] || '').toLowerCase();
        const current = userConfig?.ANTI_STATUS_MENTIONED === 'true' ? 'ON' : 'OFF';

        if (!opt) {
            return reply(
                `📛 Anti-status-mention is currently: *${current}*\n\n` +
                `Usage:\n` +
                `.antistatusmention on  — delete forwarded status-mention messages\n` +
                `.antistatusmention off — disable`
            );
        }

        if (!['on', 'off'].includes(opt)) {
            return reply("Usage: .antistatusmention on / off");
        }

        const value = opt === 'on' ? 'true' : 'false';
        userConfig.ANTI_STATUS = value;
        await updateUserConfig(sanitizedNumber, userConfig);

        const status = value === 'true' ? 'ON (delete)' : 'OFF';
        return reply(`✅ Anti-status-mention set to *${status}*.`);
    } catch (e) {
        reply(`Error: ${e.message}`);
    }
});
