import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import { generateWAMessageFromContent, generateMessageIDV2 } from '@whiskeysockets/baileys';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "paymsg",
    alias: ["pay", "payment"],
    desc: "Send a custom payment message to a group",
    category: "owner",
    filename: __filename
}, async (client, message, match, { from, isCreator, reply, text }) => {
    try {
        if (!isCreator) return await reply("*📛 Owner Only Command*");

        // 1. Safe Text Parsing (Fixes the .trim() crash)
        let inputText = typeof text === 'string' ? text : (typeof match === 'string' ? match : match?.text || "");
        const args = inputText.trim().split(/\s+/);
        
        if (args.length < 2) {
            return await reply("*🍁 Usage:* `.paymsg <grouplink> <message>`");
        }

        const groupLink = args[0];
        const noteText = args.slice(1).join(" ");

        // 2. Fetch Group Info (JID)
        const inviteMatch = groupLink.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
        if (!inviteMatch) return await reply("❌ Invalid group link format.");
        
        const inviteCode = inviteMatch[1];
        let targetJid = null;

        try {
            const groupInfo = await client.groupGetInviteInfo(inviteCode);
            targetJid = groupInfo.id;
        } catch (e) {
            return await reply("❌ Failed to get group info. (Is the bot inside the group?)");
        }

        // 3. Build Payment Message
        const randomAmount = Math.floor(Math.random() * 500) + 1; 
        const scaledAmount = (randomAmount * 1000).toString();

        const paymentMessage = {
            requestPaymentMessage: {
                currencyCodeIso4217: 'USD',
                amount1000: scaledAmount, 
                requestFrom: '0@s.whatsapp.net', 
                noteMessage: {
                    extendedTextMessage: { text: noteText }
                },
                expiryTimestamp: '0',
                amount: {
                    value: scaledAmount,
                    offset: 1000,
                    currencyCode: 'USD'
                }
            }
        };

        // 4. Send to Group
        const fullMessage = generateWAMessageFromContent(targetJid, paymentMessage, {
            userJid: client.user.id,
            messageId: generateMessageIDV2(client.user.id)
        });

        await client.relayMessage(targetJid, fullMessage.message, {
            messageId: fullMessage.key.id
        });

        // 5. React with ✅ instead of sending a text confirmation
        await client.sendMessage(from, {
            react: {
                text: "✅",
                key: message.key
            }
        });

    } catch (error) {
        console.error("paymsg Error:", error);
        await reply(`💢 Error: ${error.message}`);
    }
});
