// ERFAN-MD
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
  pattern: "del",
  alias: ["delete"],
  desc: "Delete any message",
  react: "🗑️",
  category: "admin",
  filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
  
  try {
    // Check if user replied to a message
    if (!m.quoted && !mek.message?.extendedTextMessage?.contextInfo?.stanzaId) {
      return reply("❌ Please reply to the message you want to delete!");
    }

    let key;

    // Method 1: Get key from m.quoted (standard in most Baileys frameworks)
    if (m.quoted && m.quoted.key) {
      key = m.quoted.key;
    } 
    // Method 2: Build key from raw contextInfo (fallback)
    else {
      const context = mek.message?.extendedTextMessage?.contextInfo;
      if (context && context.stanzaId) {
        key = {
          remoteJid: from,
          fromMe: context.participant === conn.user?.id || context.fromMe === true,
          id: context.stanzaId,
          participant: context.participant
        };
      }
    }

    if (!key || !key.id) {
      return reply("❌ Could not find the message key!");
    }

    // Permission Check: Non-owners can only delete bot's own messages
    if (!isCreator && !key.fromMe) {
      return reply("*📛 You can only delete messages sent by the bot.*");
    }

    // Official Baileys delete syntax
    await conn.sendMessage(from, { delete: key });

  } catch (e) {
    console.error("Delete command error:", e);
    reply(`❌ Failed to delete: ${e.message}`);
  }
});
