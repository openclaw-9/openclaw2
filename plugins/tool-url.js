// ERFAN-MD
import { fileURLToPath } from 'url';
import axios from 'axios';
import FormData from 'form-data';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// ERFAN-MD

// Multiple ImgBB API Keys (fallback system)
const IMGBB_API_KEYS = [
  'fb92e9929582dc7c12b873fafe7b632c',
  '565e1bab7de2b9d897f15bddd815659c',
  'fa7749fb726c3826805cd2f0fa34f749',
  '5b0a862fec98947c695b11fffdd0fbad',
  'b63a821d989cdf895808a44aa5b76c33'
];

// Function to upload with fallback API keys
async function uploadToImgBB(imageBase64, apiKey) {
  const form = new FormData();
  form.append('key', apiKey);
  form.append('image', imageBase64);
  form.append('name', 'ERFAN-MD');

  const response = await axios.post("https://api.imgbb.com/1/upload", form, {
    headers: form.getHeaders(),
    timeout: 60000
  });

  return response.data?.data?.url;
}

cmd({
  pattern: "url",
  alias: ["imgtourl", "imgurl", "tourl", "geturl", "upload"],
  react: '🖇',
  desc: "Upload image to ImgBB and get URL",
  category: "utility",
  use: ".tourl [reply to image]",
  filename: __filename
}, async (conn, mek, m, { from, reply, quoted }) => {
  try {
    const quotedMsg = m.quoted || m;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';

    if (!mimeType || !mimeType.includes('image')) {
      return reply("❌ Please reply to an image");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

    const mediaBuffer = await quotedMsg.download();
    const imageBase64 = mediaBuffer.toString('base64');

    let imageUrl = null;
    let lastError = null;

    // Try each API key until one works
    for (let i = 0; i < IMGBB_API_KEYS.length; i++) {
      try {
        console.log(`Trying API key ${i + 1}/${IMGBB_API_KEYS.length}...`);
        imageUrl = await uploadToImgBB(imageBase64, IMGBB_API_KEYS[i]);
        
        if (imageUrl) {
          console.log(`✅ Upload successful with API key ${i + 1}`);
          break; // Exit loop if successful
        }
      } catch (error) {
        lastError = error;
        console.log(`❌ API key ${i + 1} failed: ${error.message || error}`);
        
        // If this is the last key, throw the error
        if (i === IMGBB_API_KEYS.length - 1) {
          throw lastError;
        }
        
        // Wait 1 second before trying next key
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!imageUrl) throw "Upload failed - all API keys exhausted";

    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    await reply(`✅ *Image Successfully Uploaded*\n\n- ${imageUrl}`);

  } catch (error) {
    console.error("Tourl error:", error);
    await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    await reply(`❌ Error: ${error.message || error}`);
  }
});
