// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cmd({
    pattern: "hashtag",
    alias: ["tiktoktag", "hashtag", "tttag"],
    desc: "Analyze TikTok hashtags and get trending data",
    category: "tools",
    react: "🔍",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return await reply(`
🔍 *TIKTOK HASHTAG ANALYZER*

📌 Usage: .tt <hashtag>

💡 Example:
.tt bot
.tt fyp
.tt viral

📊 Shows:
• Popular hashtags
• Related hashtags
• Trending hashtags
• Total posts & views
`);
        }

        // Clean the hashtag (remove # if present)
        let tag = q.trim();
        if (tag.startsWith('#')) {
            tag = tag.substring(1);
        }

        // Show loading
        await conn.sendMessage(from, {
            react: { text: '⏳', key: m.key }
        });

        // ── API Call ──
        const apiUrl = `https://api.nexray.eu.cc/tools/tiktokhashtags?hashtags=%23${encodeURIComponent(tag)}`;
        console.log(`[TIKTOK] Fetching: ${apiUrl}`);

        const response = await axios.get(apiUrl, {
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        console.log(`[TIKTOK] Response status: ${response.status}`);
        console.log(`[TIKTOK] Data:`, JSON.stringify(response.data).substring(0, 200));

        const data = response.data;

        // Check if response is valid
        if (!data || !data.status) {
            console.log('[TIKTOK] Invalid response:', data);
            return await reply("❌ Failed to fetch hashtag data. The API might be down.\n\n💡 Try again later or use a different hashtag.");
        }

        const result = data.result;
        if (!result) {
            return await reply("❌ No data found for this hashtag. Try another one.");
        }

        // ── Find the searched hashtag in top10 ──
        let tagData = null;
        if (result.top10 && Array.isArray(result.top10)) {
            tagData = result.top10.find(item => 
                item.hashtag && item.hashtag.toLowerCase() === `#${tag.toLowerCase()}`
            );
        }

        // ── Build Response ──
        let message = `
🔍 *TIKTOK HASHTAG ANALYZER*
━━━━━━━━━━━━━━━━━━

📌 *Hashtag:* #${tag}

`;

        // If tag found in top10
        if (tagData) {
            message += `
📊 *STATS FOR #${tag}*
━━━━━━━━━━━━━━━━━━
📝 *Posts:* ${tagData.posts || 'N/A'}
👁️ *Views:* ${tagData.views || 'N/A'}
📈 *Views/Post:* ${tagData.post_views || 'N/A'}
`;
        } else {
            message += `
⚠️ *#${tag} not in top 10*
Showing overall stats:
`;
        }

        // ── Overall Report ──
        const report = result.report;
        if (report) {
            message += `
📊 *OVERALL REPORT*
━━━━━━━━━━━━━━━━━━
📝 *Total Posts:* ${report.overallPosts || 'N/A'}
👁️ *Total Views:* ${report.overallViews || 'N/A'}
📈 *Avg Views/Post:* ${report.viewsPerPost || 'N/A'}
`;
        }

        // ── Most Popular Hashtags ──
        if (result.most_popular && Array.isArray(result.most_popular) && result.most_popular.length > 0) {
            const popular = result.most_popular.slice(0, 10).join(', ');
            message += `
🔥 *MOST POPULAR*
━━━━━━━━━━━━━━━━━━
${popular}
`;
        }

        // ── Top 5 Related Hashtags ──
        if (result.related && Array.isArray(result.related) && result.related.length > 0) {
            message += `
🔗 *RELATED HASHTAGS*
━━━━━━━━━━━━━━━━━━
`;
            const related = result.related.slice(0, 5);
            related.forEach(item => {
                if (item.hashtag) {
                    message += `• ${item.hashtag}\n`;
                    message += `  📝 ${item.posts || 'N/A'} | 👁️ ${item.views || 'N/A'}\n`;
                }
            });
        }

        // ── Top 5 Trending ──
        if (result.trending && Array.isArray(result.trending) && result.trending.length > 0) {
            message += `
📈 *TRENDING NOW*
━━━━━━━━━━━━━━━━━━
`;
            const trending = result.trending.slice(0, 5);
            trending.forEach(item => {
                if (item.hashtag) {
                    message += `• ${item.hashtag}\n`;
                    message += `  📝 ${item.posts || 'N/A'} | 👁️ ${item.views || 'N/A'}\n`;
                }
            });
        }

        message += `
━━━━━━━━━━━━━━━━━━
⏱️ *Response:* ${data.response_time || 'N/A'}
*© Powered by ERFAN-MD*
`;

        // ── Send Response ──
        await conn.sendMessage(from, {
            text: message
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: '✅', key: m.key }
        });

    } catch (err) {
        console.error("❌ Error in .tt command:", err);
        
        // Check if it's a connection error
        if (err.code === 'ECONNABORTED') {
            await reply("❌ Request timed out! The API is taking too long to respond.\n\n💡 Try again later.");
        } else if (err.response) {
            await reply(`❌ API Error: ${err.response.status}\n\n💡 The TikTok API might be down. Try again later.`);
        } else {
            await reply(`❌ Error: ${err.message || 'Something went wrong!'}`);
        }
        
        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
    }
});
