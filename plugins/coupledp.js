// ERFAN-MD
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd, commands } from '../command.js';
import axios from 'axios';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── COUPLE PP FUNCTION WITH FALLBACKS ─────────────────
async function getCouplePP() {
    const apis = [
        // API 1: Deline (Your main API - Priority)
        async () => {
            const { data } = await axios.get("https://api.deline.web.id/random/ppcouple", { timeout: 10000 });
            if (data?.status && data?.result?.cowo && data?.result?.cewe) {
                return { male: data.result.cowo, female: data.result.cewe };
            }
            throw new Error("Invalid response from Deline API");
        },
        
        // API 2: XSGames (Backup 1 - 100% Working)
        async () => {
            const maleNum = Math.floor(Math.random() * 70) + 1;
            const femaleNum = Math.floor(Math.random() * 70) + 1;
            return {
                male: `https://xsgames.co/randomusers/assets/avatars/male/${maleNum}.jpg`,
                female: `https://xsgames.co/randomusers/assets/avatars/female/${femaleNum}.jpg`
            };
        },
        
        // API 3: RandomUser.me (Backup 2 - 100% Working)
        async () => {
            const { data } = await axios.get('https://randomuser.me/api/?results=2', { timeout: 10000 });
            const male = data.results.find(u => u.gender === 'male')?.picture?.large;
            const female = data.results.find(u => u.gender === 'female')?.picture?.large;
            if (male && female) return { male, female };
            throw new Error("Invalid response from RandomUser");
        }
    ];
    
    // Try each API in order
    for (const api of apis) {
        try {
            const result = await api();
            if (result?.male && result?.female) return result;
        } catch (e) {
            console.log(`Couple API attempt failed:`, e.message);
        }
    }
    
    // Ultimate fallback - Never fails
    return {
        male: "https://xsgames.co/randomusers/assets/avatars/male/1.jpg",
        female: "https://xsgames.co/randomusers/assets/avatars/female/1.jpg"
    };
}

// ─── MAIN COMMAND ──────────────────────────────────────
cmd({
  'pattern': "couplepp",
  'alias': ["couple", "cpp", "ppcp", "couplepic"],
  'react': '💑',
  'desc': "Get a male and female couple profile picture.",
  'category': "image",
  'use': ".couplepp",
  'filename': __filename
}, async (conn, m, store, {
  from,
  args,
  reply
}) => {
  try {
    // Send processing message
    await reply("*💑 Fetching couple profile pictures...*");
    
    // React: Processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Get couple pictures from fallback system
    const result = await getCouplePP();

    // Send male picture
    if (result.male) {
      await conn.sendMessage(from, {
        'image': { 'url': result.male },
        'caption': "👨 *Male Couple Profile Picture*"
      }, { 'quoted': m });
    }

    // Send female picture
    if (result.female) {
      await conn.sendMessage(from, {
        'image': { 'url': result.female },
        'caption': "👩 *Female Couple Profile Picture*"
      }, { 'quoted': m });
    }

    // React: Success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    
    // Success message
    await reply("*✅ Couple profile pictures sent successfully!*");

  } catch (error) {
    console.error("CouplePP Error:", error);
    await reply("❌ An error occurred while fetching the couple profile pictures.");
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});
