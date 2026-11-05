// ERFAN-MD
import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// ERFAN-MD


cmd({
    pattern: "modapk",
    alias: ["apk", "mod", "modapp"],
    desc: "Search and download MOD APK apps",
    category: "download",
    react: "📱",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply(`📱 *MOD APK DOWNLOADER*\n\nGive app name!\n\nExample:\n.modapk WhatsApp\n.modapk Capcut\n.modapk Subway Surfers`);

        await conn.sendMessage(from, { react: { text: '🔍', key: m.key } });

        // Search API
        const searchApi = `https://api.zanta-mini.store/api/modapk/search?apiKey=zanta_BJjqMjbWAFICwFA8QrRBCyiX&url=${encodeURIComponent(q)}`;
        
        const searchRes = await axios.get(searchApi, { timeout: 15000 });
        const data = searchRes.data;

        if (!data.success || !data.result || data.result.length === 0) {
            return await reply("❌ No apps found! Try different keywords.");
        }

        // Build results message
        let msg = `📱 *MOD APK SEARCH RESULTS*\n\n`;
        data.result.forEach((app, index) => {
            msg += `${index + 1}. ${app.title}\n`;
            msg += `   👨‍💻 ${app.developer}\n`;
            msg += `   ⭐ ${app.rating}\n\n`;
        });
        msg += `📌 Reply with number\n⏱️ 20 seconds`;

        const sent = await conn.sendMessage(from, {
            image: { url: data.result[0].thumbnail },
            caption: msg
        }, { quoted: mek });

        const msgId = sent.key.id;

        // Listen for reply
        const apkListener = async (msgData) => {
            const received = msgData.messages[0];
            if (!received.message) return;

            const userReply = received.message.conversation || 
                            received.message.extendedTextMessage?.text;
            const isReplyToBot = received.message.extendedTextMessage?.contextInfo?.stanzaId === msgId;

            if (isReplyToBot) {
                conn.ev.off("messages.upsert", apkListener);
                
                const num = parseInt(userReply?.trim());

                if (isNaN(num) || num < 1 || num > data.result.length) {
                    return await conn.sendMessage(from, {
                        text: `❌ Invalid! Use 1-${data.result.length}`
                    }, { quoted: received });
                }

                await conn.sendMessage(from, { react: { text: '⏳', key: received.key } });

                // Get selected app
                const selectedApp = data.result[num - 1];
                const appUrl = selectedApp.url;

                await conn.sendMessage(from, {
                    text: `⏳ Downloading: ${selectedApp.title}\n\nPlease wait...`
                }, { quoted: received });

                try {
                    // Download API
                    const dlApi = `https://api.zanta-mini.store/api/modapk/dl?apiKey=zanta_BJjqMjbWAFICwFA8QrRBCyiX&url=${encodeURIComponent(appUrl)}`;
                    const dlRes = await axios.get(dlApi, { timeout: 30000 });
                    const dlData = dlRes.data;

                    if (!dlData.success || !dlData.download_url) {
                        return await conn.sendMessage(from, {
                            text: "❌ Download link not available!"
                        }, { quoted: received });
                    }

                    const { info, download_url } = dlData;
                    const fileName = `${selectedApp.title.replace(/[^\w\s]/gi, '').trim()}.apk`;

                    // Send as document
                    try {
                        await conn.sendMessage(from, {
                            document: { url: download_url },
                            mimetype: 'application/vnd.android.package-archive',
                            fileName: fileName,
                            caption: `
📱 *${info.title}*

📦 *Size:* ${info.size}
📲 *Android:* ${info.android}
👨‍💻 *Developer:* ${selectedApp.developer}

⚠️ *Install at your own risk*

🖤 *DARK ZONE MD*
                            `
                        }, { quoted: received });

                        await conn.sendMessage(from, { react: { text: '✅', key: received.key } });

                    } catch (sendErr) {
                        console.error("Send failed:", sendErr.message);
                        
                        // Send direct link if failed
                        await conn.sendMessage(from, {
                            text: `⚠️ APK send failed!\n\n📥 Download directly:\n${download_url}\n\n📦 Size: ${info.size}`
                        }, { quoted: received });
                    }

                } catch (err) {
                    console.error("Error:", err.message);
                    await conn.sendMessage(from, {
                        text: "⚠️ Download failed! Try again or different app."
                    }, { quoted: received });
                }
            }
        };

        conn.ev.on("messages.upsert", apkListener);
        setTimeout(() => conn.ev.off("messages.upsert", apkListener), 20000);

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error(err);
        reply("⚠️ Error! Try again.");
    }
});