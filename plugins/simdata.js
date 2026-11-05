// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
import axios from 'axios';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cmd({
    pattern: "simdata",
    alias: ["checknum", "siminfo", "numinfo"],
    desc: "Check Pakistani SIM card data",
    category: "tools",
    react: "📱",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) {
            await conn.sendMessage(from, { 
                text: "❗ *Please provide a Pakistani phone number*\n\n*Example:*\n`.simdata 03427582213`\n`.simdata 923427582213`" 
            }, { quoted: mek });
            return;
        }
        
        // Clean and format the number
        let number = q.replace(/[^0-9]/g, '');
        
        // Convert 923xx format to 03xx
        if (number.startsWith('92')) {
            number = '0' + number.substring(2);
        }
        
        // Validate Pakistani number
        if (!number.startsWith('0') || number.length !== 11) {
            await conn.sendMessage(from, { 
                text: "❌ *Invalid Pakistani number format!*\n\nPlease use format:\n• `03427582213`\n• `923427582213`" 
            }, { quoted: mek });
            return;
        }

        // Show loading
        await conn.sendMessage(from, { 
            react: { text: "⏳", key: mek.key } 
        });

        // Try multiple APIs in order
        const apis = [
            `https://fam-official.serv00.net/api/database.php?number=${number}`,
            `https://sim-database-api.vercel.app/api/check?number=${number}`,
            `https://pak-sim-data-api.onrender.com/api/info?number=${number}`
        ];

        let data = null;
        let usedApi = '';
        
        for (const apiUrl of apis) {
            try {
                const response = await axios.get(apiUrl, { 
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                if (response.data && (response.data.success || response.data.data || response.data.records)) {
                    data = response.data;
                    usedApi = apiUrl;
                    break;
                }
            } catch (apiError) {
                console.log(`API failed: ${apiUrl} - ${apiError.message}`);
                continue;
            }
        }

        if (!data) {
            await conn.sendMessage(from, { 
                react: { text: "❌", key: mek.key } 
            });
            await conn.sendMessage(from, { 
                text: "❌ *All APIs are currently down or the number is not in database.*\n\nPlease try again later." 
            }, { quoted: mek });
            return;
        }

        // Extract records
        let records = [];
        
        if (Array.isArray(data.data)) {
            records = data.data;
        } else if (data.data && Array.isArray(data.data.records)) {
            records = data.data.records;
        } else if (Array.isArray(data.records)) {
            records = data.records;
        }

        if (records.length === 0) {
            await conn.sendMessage(from, { 
                react: { text: "❌", key: mek.key } 
            });
            await conn.sendMessage(from, { 
                text: "❌ *No information found for this number in the database.*" 
            }, { quoted: mek });
            return;
        }

        // Format response
        let responseMessage = `📱 *SIM DATA INFORMATION*\n\n`;
        responseMessage += `📞 *Number:* ${number}\n`;
        responseMessage += `📊 *Records Found:* ${records.length}\n\n`;

        records.forEach((entry, index) => {
            responseMessage += `━━━ *Result ${index + 1}* ━━━\n`;
            
            const name = entry.name || entry.Name || entry.NAME || '';
            const cnic = entry.cnic || entry.CNIC || entry.cnic_number || '';
            const address = entry.address || entry.Address || entry.ADDRESS || '';
            const phone = entry.phone || entry.Phone || entry.mobile || '';
            
            if (name && name.trim() !== '') {
                responseMessage += `👤 *Name:* ${name}\n`;
            }
            if (cnic && cnic.trim() !== '') {
                // Check if masked
                if (cnic.includes('*')) {
                    responseMessage += `🪪 *CNIC:* ${cnic} _(Masked by API)_\n`;
                } else {
                    responseMessage += `🪪 *CNIC:* ${cnic}\n`;
                }
            }
            if (address && address.trim() !== '') {
                if (address.includes('*')) {
                    responseMessage += `📍 *Address:* ${address} _(Masked by API)_\n`;
                } else {
                    responseMessage += `📍 *Address:* ${address}\n`;
                }
            }
            if (phone && phone.trim() !== '') {
                responseMessage += `📞 *Phone:* ${phone}\n`;
            }
            responseMessage += `\n`;
        });

        const credit = data.credit || data.Credit || 'N/A';
        responseMessage += `💳 *Credit:* ${credit}\n`;
        responseMessage += `⚡ *Powered by SIM Database API*`;

        await conn.sendMessage(from, { 
            text: responseMessage 
        }, { quoted: mek });

        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });

    } catch (e) {
        console.error("Error in SIM data command:", e.message);
        
        try {
            await conn.sendMessage(from, { 
                react: { text: "❌", key: mek.key } 
            });
        } catch (reactError) {}
        
        await conn.sendMessage(from, { 
            text: `❌ *An error occurred while fetching SIM data.*\n\nError: ${e.message}` 
        }, { quoted: mek });
    }
});
