// ERFAN-MD — FUN TEXT COMMANDS (UPDATED v2)
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to get bot ID safely
const getBotId = (conn) => {
  if (!conn.user) return '';
  return conn.user.id.split(':')[0] + '@s.whatsapp.net';
};

// ============================================================
// NEW TARGET SYSTEM (v2):
// - Command typed as a REPLY to someone's message
//   -> that person is mentioned ONCE (never the sender)
// - Command typed normally (no reply)
//   -> NO one is mentioned, generic fun text is sent
// - The sender is NEVER mentioned by these commands
// ============================================================
async function pickTarget(conn, mek, m) {
  try {
    const quotedSender = (m && m.quoted && m.quoted.sender)
      ? m.quoted.sender
      : (mek && mek.quoted && mek.quoted.sender ? mek.quoted.sender : null);
    if (quotedSender) return quotedSender;
    return null;
  } catch { return null; }
}

// ============================================
// 1. ISHQ METER COMMAND
// ============================================
cmd({
  pattern: "ishqmeter",
  alias: ["pyaarmeter2", "dildhadkan"],
  desc: "Check how deep your love is",
  react: "💘",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  const percent = Math.floor(Math.random() * 100) + 1;
  
  const messages = [
    { r: [90, 100], t: `🔥 *ISHQ MEIN DOOBA HUA!* 🔥\n\nYeh banda/bandi toh sidha jahannum ka parwana hai!\nIshq ka level: ${percent}% 💯\n\n*"Teri tasweer aankhon mein hai, teri khusboo saanson mein hai!"*\n\nAllah bachaye aisi mohabbat se! 😂❤️` },
    { r: [70, 89], t: `😍 *KAFI GEHRA ISHQ!* 😍\n\nIshq level: ${percent}%\n\n*"Jab bhi teri yaad aati hai, phone haath mein aa jaata hai!"*\n\nBhai propose kar de, der mat kar! 💌` },
    { r: [40, 69], t: `😊 *THODA THODA PYAAR!* 😊\n\nIshq level: ${percent}%\n\n*"Dil mein kuch to hai, lekin bolne ki himmat nahi!"*\n\nYeh wala stage sabse zyada khubsoorat hota hai! 🌸` },
    { r: [1, 39], t: `😐 *DOST JAISA PYAAR!* 😐\n\nIshq level: ${percent}%\n\n*"Yaar tu toh sirf friend zone mein hai!"* 😂\n\nThoda kaam karo apne aap par! 💪` }
  ];
  
  const msg = messages.find(x => percent >= x.r[0] && percent <= x.r[1]);
  
  await conn.sendMessage(mek.chat, {
    text: `💘 *ISHQ METER* 💘\n\nTum ka ishq:\n\n${msg.t}`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 2. ANDHA ISHQ COMMAND
// ============================================
cmd({
  pattern: "andhaishq",
  alias: ["blindlove", "pagalashiq"],
  desc: "Make someone a crazy lover randomly",
  react: "🙈",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const msgs = [
    `🙈 *ANDHA ISHQ ALERT!* 🙈\n\nTum aaj se ${t} ka\n*PAGAL DEEWANA* ban gaya/gayi hai! 😂\n\n"Raat ko sapne mein bhi teri hi tasweer!"\n"Din mein bhi teri hi fikar!"\n\n*Bhai/Behen, doctor ko dikha lo!* 💀😂`,
    `🙈 *ANDHA PYAAR!* 🙈\n\nTum toh ${t} ke liye\nmathaa tek chuka/chuki hai! 🙇\n\nHar subah status check: ✅\nHar raat online dekhna: ✅\nBlock hone ke baad bhi message: ✅\n\n*Ishq mein aql kho di!* 😂💔`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[Math.floor(Math.random() * msgs.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 3. LAFZ-E-MOHABBAT COMMAND
// ============================================
cmd({
  pattern: "lafzmohabbat",
  alias: ["romanticlafz", "dilletter"],
  desc: "Express in romantic Urdu words",
  react: "🌹",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const msgs = [
    `🌹 *LAFZ-E-MOHABBAT* 🌹\n\nTum ne ${t} ke liye kaha:\n\n*"Teri aankhein - do sitare meri raat ke,\nTeri muskaan - subah ki pehli dhoop,\nTere bina ye group bhi soona lagta hai,\nHai teri hasrat dil mein aisa kuch!"*\n\n🥀 Dono ko MUBARAK! 🎊`,
    `🌹 *DIL KI ZUBAAN* 🌹\n\nTum dil mein chhupa ke rakhta/rakhti tha/thi,\naaj bol hi diya ${t} ko:\n\n*"Jab tum online hote/hoti ho,\ntoh mera dil bhi recharge ho jaata hai!"* 😂💓\n\nSabse sach baat! 🔥`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[Math.floor(Math.random() * msgs.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 4. PEHLI NAZAR COMMAND
// ============================================
cmd({
  pattern: "pehlinazar",
  alias: ["firstlove", "najarwala"],
  desc: "Reveal first sight love story",
  react: "👀",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const msgs = [
    `👀 *PEHLI NAZAR KA KISSA!* 👀\n\nJab Tum ne pehli baar\n${t} ki DP dekhi...\n\n❤️ Dil: *"Yeh kaun hai?!"*\n📱 Haath: *Kaanpne lage*\n🧠 Dimag: *Hang ho gaya*\n😳 Chehra: *Laal ho gaya*\n\n*Pehli nazar mein hi kaam tamaam!* 💘😂`,
    `👀 *NAZAR MILI NAZAR!* 👀\n\nTum ka ${t} ki\nnazar se pehla meeting:\n\n*"Bas ek pal ko dekha,\naur pal bhar mein dil le gaye!"*\n\nShayar ban gaye aap toh! 🌹😂`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[Math.floor(Math.random() * msgs.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 5. DILLAGI COMMAND
// ============================================
cmd({
  pattern: "dillagi",
  alias: ["mazaak", "chherhna"],
  desc: "Flirt with someone in group",
  react: "😜",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const msgs = [
    `😜 *DILLAGI TIME!* 😜\n\nTum ne ${t} se kaha:\n\n*"Teri smile dekh ke mujhe neend nahi aati!\nAur teri baat sun ke bhi neend nahi aati!\nYani tu meri insomnia ki wajah hai!"* 😂💀\n\nYeh complaint hai ya compliment? 🤔`,
    `😜 *CHHERHNA SHURU!* 😜\n\nTum ka ${t} ko message:\n\n*"Yaar tu online tha/thi,\nmain bhi online tha/thi,\nphir tune reply kyun nahi kiya?!\nYeh ZULM hai bhai/behan!"* 😭😂\n\nKoi jawab do bhai! 👀`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[Math.floor(Math.random() * msgs.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 6. KHOOBSURAT COMMAND
// ============================================
cmd({
  pattern: "khoobsurat",
  alias: ["sundar", "gorgeous", "haseen"],
  desc: "Praise someone's beauty",
  react: "✨",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const msgs = [
    `✨ *GROUP KA SABSE KHOOBSURAT!* ✨\n\nAaj ka Official Award:\n*"Most Beautiful in Group"* 🏆\n\nJaata hai ${t} ko!\n\n*"Teri khoobsurti ka koi jawab nahi,\nTere saamne chand bhi phika lagta hai,\nAllah ne banaya hai tujhe bahut dhyaan se!"* 🌙✨\n\nSabko agree karna hoga! 💯`,
    `✨ *HASEEN AWARD!* ✨\n\n${t} sun!\n\n*Aaj scientific research ne prove kiya hai*\nke tum is group ke sabse khoobsurat member ho!\n\nEvidence:\n📸 DP - MashaAllah 🥰\n💬 Baatein - Dil jeet leti hain\n✨ Presence - Group chamak jaata hai\n\n*Mubarak ho!* 🎊`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[Math.floor(Math.random() * msgs.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 7. DHADKAN COMMAND
// ============================================
cmd({
  pattern: "dhadkan",
  alias: ["heartbeat", "dilkidhadkan"],
  desc: "Check heartbeat level",
  react: "💓",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const bpm = Math.floor(Math.random() * 150) + 60;
  
  await conn.sendMessage(mek.chat, {
    text: `💓 *DIL KI DHADKAN TEST* 💓\n\nTum ki normal heartbeat: *72 BPM*\n\nJab ${t} ka naam aaya:\n\n💥 BPM: *${bpm}* 💥\n\n${bpm > 150 ? "🚨 *EMERGENCY! Ambulance bulao!* 😂💀\nYeh toh seedha ICU wala pyaar hai!" : bpm > 100 ? "😍 *WOWWW! Kaafi tez hai!*\nKuch toh hai bhai... 👀" : "😊 *Normal range mein hai!*\nPar dil mein kuch zaroor hai! 💕"}`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 8. MOHABBAT KA PEHLA KHAT COMMAND
// ============================================
cmd({
  pattern: "pehlaakhat",
  alias: ["loveletter", "dilletter2"],
  desc: "Write first romantic letter",
  react: "💌",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const letters = [
    `💌 *MOHABBAT KA PEHLA KHAT* 💌\n\nFrom: Tum\nTo: ${t}\n\n*"Jab se tumhe dekha hai,\nNa subah acchi lagti hai,\nNa raat chain se kaatti hai,\nHar waqt bas tumhara hi khayal...\n\nYeh khat likh raha/rahi hoon,\nBaat karne ki himmat nahi!\nBas itna hi kehna tha ke...\nTum ho toh duniya acchi lagti hai!"*\n\n💝 Forever Tumhara/Tumhari 💝`,
    `💌 *PEHLA KHAT - PEHLA PYAAR* 💌\n\nTum ne ${t} ke liye likha:\n\n*"Teri ek muskaan ne mujhe\nShayar bana diya!\nTere ek message ne\nSaara din sundar kar diya!\n\nMain jaanta/jaanti hoon,\nTum padhoge/padhogi aur hasoge/hasogi,\nLekin is hans mein bhi mera dil hai!"*\n\n😂😭 Pagal ho gaya/gayi yeh banda/bandi! 💖`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: letters[Math.floor(Math.random() * letters.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 9. ZIDDI DIL COMMAND
// ============================================
cmd({
  pattern: "ziddidil",
  alias: ["manmaani", "nakhre"],
  desc: "Show stubborn heart behavior",
  react: "😤",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const msgs = [
    `😤 *ZIDDI DIL KI REPORT!* 😤\n\nTum ka dil ${t} ke baare mein:\n\nDimag: "Ignore karo!"\nDil: "Nahi karta!" 💢\n\nDimag: "Block kar do!"\nDil: "Bilkul nahi!" 😤\n\nDimag: "Baat mat karo!"\nDil: *pehle hi message kar chuka* 😂\n\n*Ziddi dil ka koi ilaj nahi!* 💔❤️`,
    `😤 *NAKHRE WALA DIL!* 😤\n\nTum ka dil ${t} ke liye:\n\n*"Main nahi sochta/sochti unke baare mein..."\n(5 second baad dil ne unka profile khol liya) 😂\n\n"Mujhe koi farq nahi parta..."\n(Raat ko unka status 10 baar dekha) 👀\n\n"Main bilkul theek hoon..."\n(Unhe dekh ke neend nahi aati) 😭*\n\nYeh dil bhi na! 💀💖`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[Math.floor(Math.random() * msgs.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 10. YAAD AATA HAI COMMAND
// ============================================
cmd({
  pattern: "yaadaata",
  alias: ["missing", "miss"],
  desc: "Express missing someone dramatically",
  react: "🥺",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const msgs = [
    `🥺 *YAAD AATA HAI...* 🥺\n\nTum jab ${t} ki\nyaad aati hai toh:\n\n🌙 Raat ko: *Neend nahi aati*\n☀️ Din mein: *Kuch accha nahi lagta*\n📱 Phone pe: *Baar baar unka naam dhundha*\n🎵 Gaana suna: *Unhe yaad kiya*\n🌧️ Baarish: *Aur zyada yaad aaye*\n\n*"Teri yaad aati hai jab tujhe bhoolna chahta/chahti hoon!"* 💔😂`,
    `🥺 *MISSING YOU LEVEL: 9999* 🥺\n\n${t} ki Tum ko\nkitni yaad aati hai:\n\n*"Chai peeta/peeti hoon - teri yaad*\n*Gaana sunta/sunti hoon - teri yaad*\n*Group mein aata/aati hoon - teri yaad*\n*Sona chahta/chahti hoon - teri yaad*\n\nTu hai hi aisi/aisa, bhoolna mushkil hai!"* 😭💖`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[Math.floor(Math.random() * msgs.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 11. TAUBA TAUBA COMMAND
// ============================================
cmd({
  pattern: "taubatauba",
  alias: ["chhorhdo", "bazdone"],
  desc: "Failed attempt to quit love",
  react: "🤦",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🤦 *TAUBA TAUBA!* 🤦\n\nTum ne aaj 10vi baar kasam khayi:\n\n*"${t} ke baare mein ab nahi sochna!"*\n\nAur 10vi baar fail ho gaye/gayi! 😂\n\n*Time: 3 baje raat*\n*Kaam: Unki purani chats padh raha/rahi tha/thi*\n\nYeh pyaar nahi addiction hai bhai/behan! 😭💀\n\nAllah madad kare! 🙏`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 12. PEHLI MUHABBAT COMMAND
// ============================================
cmd({
  pattern: "pehlamuhabbat",
  alias: ["firstcrush", "bachpankipyaar"],
  desc: "Reveal first love in group",
  react: "🌸",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🌸 *PEHLI MOHABBAT STORY!* 🌸\n\nTum ne bachpan mein\n${t} se pyaar kiya!\n\n*"Unhe dekhne ke liye class late jaata/jaati tha/thi,\nUnka naam notebook pe likhta/likhti tha/thi,\nUnke ghar ke bahar se guzrna bahana tha,\nYeh pehla pyaar tha... sachcha, saada!"*\n\nAb sach batao dono! 😂💕`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 13. WAFA KA IMTIHAAN COMMAND
// ============================================
cmd({
  pattern: "wafaimtihaan",
  alias: ["loyaltytest", "wafadar"],
  desc: "Test loyalty in group",
  react: "🎭",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const score = Math.floor(Math.random() * 100) + 1;
  
  await conn.sendMessage(mek.chat, {
    text: `🎭 *WAFA KA IMTIHAAN* 🎭\n\n${t} ka wafa score:\n\n*${score}/100* ${score > 80 ? "💯 - *WAFADAR INSAAN!*\n\nYeh banda/bandi jannat ka haqdar/haqdar hai!\nAise insaan milte nahi aajkal! 🥺❤️" : score > 50 ? "😊 - *THEEK THEEK WAFADAR!*\n\nKuch chances hain improve karne ke! 😂" : "😅 - *JARA KAM WAFADAR!*\n\nBhai behen miyan biwi wala scene hai! 💀😂"}`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 14. DONO KI KAHANI COMMAND
// ============================================
cmd({
  pattern: "donokikahani",
  alias: ["lovestory", "ishqkissah"],
  desc: "Create love story for two people",
  react: "📖",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const stories = [
    `📖 *DONO KI KAHANI* 📖\n\n*Chapter 1:* Tum ne ${t} ki DP dekhi - Dil ruk gaya! 😍\n\n*Chapter 2:* Group mein ek dusre ke jokes pe hasne lage - Dosti shuru! 😂\n\n*Chapter 3:* DM pe baatein hone lagin - *"Sirf dost hain!"* 🙄\n\n*Chapter 4:* Raat ke 3 baje tak baatein - *"Haan sirf dost..."* 😂💀\n\n*Chapter 5:* Aaj bhi ek doosre se milne ka intzaar!\n\n*End: To be continued...* 💕`,
    `📖 *PYAARI KAHANI!* 📖\n\n*Tum + ${t}*\n\nEk baar group mein dono online the,\nEk ne funny meme bheja,\nDoosra hansa,\nPhir baatein shuru huyin,\n\nAaj bhi yahi hota hai...\nBaar baar...\nRoz Roz...\n\n*"Kuch keh dete dono, group wait kar raha hai!"* 😂❤️`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: stories[Math.floor(Math.random() * stories.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 15. GULAB BHEJO COMMAND
// ============================================
cmd({
  pattern: "gulabbhejo",
  alias: ["sendrose", "phoolbhejo"],
  desc: "Send virtual rose to someone",
  react: "🌹",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const msgs = [
    `🌹 *GULAB BHEJA GAYA!* 🌹\n\nTum ne ${t} ko\nbheja ek *LAAL GULAB* 🌹\n\nSath mein likha tha:\n*"Yeh gulab itna sundar nahi,\nJitne tum ho,\nLekin meri taraf se,\nSirf tumhare liye!"* 🥺\n\n*Lene wale kuch jawab do!* 😂💕`,
    `🌹 *VIRTUAL PHOOL!* 🌹\n\n🌹🌹🌹🌹🌹\n${t} ke liye\nTum ki taraf se!\n🌹🌹🌹🌹🌹\n\n*"Yeh phool murjha jayenge,\nLekin tumhara khayal nahi!"* 😭💖\n\nSabse bada shayar agaya group mein! 😂`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[Math.floor(Math.random() * msgs.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 16. AANKHEIN COMMAND
// ============================================
cmd({
  pattern: "aankhein",
  alias: ["eyes", "nigaah"],
  desc: "Praise someone's eyes",
  react: "👁️",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const taarifs = [
    `👁️ *AANKHON KI TAARIF!* 👁️\n\n${t} ki aankhein:\n\n*"Do sitare zameen pe utar aaye hain,\nIn aankhon mein doob ke duniya bhool jaata/jaati hoon,\nJab ye aankhein muskaraati hain,\nToh poori raat roshni ho jaati hai!"* 🌟\n\n*Subhan Allah!* 🥺✨`,
    `👁️ *NIGAAH!* 👁️\n\n${t} ka eyes description:\n\n✨ Deep - Jaise samundar\n🌟 Bright - Jaise sitaare\n💫 Magical - Jaise koi jadu ho\n\n*"Teri aankhon se milti hain aankhein,\nToh duniya ki koi zaroorat nahi!"* 😍\n\nAllah ki khoobsoorat creation! 🙏`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: taarifs[Math.floor(Math.random() * taarifs.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 17. SHAYAR BAN COMMAND
// ============================================
cmd({
  pattern: "shayarban",
  alias: ["poem", "sher"],
  desc: "Recite poetry for someone",
  react: "🎤",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const shayaris = [
    `🎤 *Tum ne ${t} ke liye SHAYARI sunai!* 🎤\n\n*"Teri muskaan pe main marta hoon,\nTeri ek baat pe nikharta hoon,\nTu door ho toh dil ghabrata hai,\nTere paas aake chain pata hoon!"*\n\n🎊 Waah Waah! 👏 Kya baat kahi! 🌹`,
    `🎤 *SHER SUNAO!* 🎤\n\nTum bola/boli ${t} ke liye:\n\n*"Na chai ka nasha, na chai ki mehek,\nTeri baatein hi kaafi hain mujhe jagane ko!\nNa raat ki thandak, na subah ki dhoop,\nTeri ek message hi kaafi hai mujhe khush karne ko!"*\n\n💖 Yeh toh bada hi sach sher tha! 😂🌹`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: shayaris[Math.floor(Math.random() * shayaris.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 18. DUSHMAN DOST COMMAND
// ============================================
cmd({
  pattern: "dushmandost",
  alias: ["frenemies", "durhabeeb"],
  desc: "Find out if enemy or friend",
  react: "🤼",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const relation = Math.random() > 0.5 ? "DOST" : "DUSHMAN";
  const msgs = {
    "DOST": `🤝 *SACHCHA DOST REVEAL!* 🤝\n\n${t} tumhara *SACHCHA DOST* hai Tum!\n\nYeh:\n✅ Tere liye ready rahega/rahegi 24/7\n✅ Secret kabhi nahi batayega/batayegi\n✅ Saath milke roasted karega/karegi doosron ko\n✅ Bure waqt mein saath hoga/hogi\n\n*Aisa dost toh sona hota hai!* 💛`,
    "DUSHMAN": `😈 *KHABARDAAR!* 😈\n\nTum group mein ${t} se\nbachke rehna!\n\nYeh toh *CHHUPA DUSHMAN* hai! 😂\n\n*"Moonh pe meetha, peeth pe..." you know!* 😅\n\nBs mazaaq hai bhai, sab dost hain! 😂💕`
  };
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[relation], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 19. TANG KARNA COMMAND
// ============================================
cmd({
  pattern: "tangkarna",
  alias: ["chidana", "pareshan"],
  desc: "Lovingly annoy someone",
  react: "😈",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const msgs = [
    `😈 *TANG KARNA SHURU!* 😈\n\nTum ne ${t} ko\n*tang* karne ki kasam khayi!\n\nTareeka:\n📱 Har message pe reply karunga/karungi\n😂 Har joke pe hans lunga/lungi\n👀 Har status pe react karunga/karungi\n💌 Subah sher, raat ko shayari\n\n*"Yeh pyaar nahi tang karna hai!"* 😂💕\nHa ha ha! 😈`,
    `😈 *CHIDANA SHURU!* 😈\n\n${t} bhai/behan ALERT:\n\nTum ne plan banaya hai tumhe\n*pyaar se tang* karne ka! 😂\n\nRoz subah: "Uthho! Good Morning!"\nRoz raat: "Sone ka waqt ho gaya?"\nGrup mein: Har cheez pe mention\n\n*Is tang karne se bachna mushkil hai!* 💀❤️`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[Math.floor(Math.random() * msgs.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 20. SMILE CHURAO COMMAND
// ============================================
cmd({
  pattern: "smilechurao",
  alias: ["muskaan", "hasao"],
  desc: "Steal someone's smile lovingly",
  react: "😊",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const msgs = [
    `😊 *SMILE CHURA LI!* 😊\n\nTum ne ${t} ki\n*smile chura li* aaj! 😄\n\n*"Tumhari muskaan dekh ke,\nMera sara din ban jaata hai!\nYeh toh sab se khoobsoorat cheez hai,\nJo mujhe pata hai!"* 🌸\n\nAbhi smile karo tum! 😊`,
    `😊 *MUSKAAN AWARD!* 😊\n\nAaj ka *"Best Smile in Group"* award\njaata hai ${t} ko!\n\n*Tum ki taraf se special mention:*\n"Jab tum muskuraate/muskuraati ho,\ntoh group ki raunaq ho jaati hai!" 🌟\n\nShukriya itni khoobsoorat muskaan ke liye! 💖`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[Math.floor(Math.random() * msgs.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 21. JAAN COMMAND
// ============================================
cmd({
  pattern: "jaan",
  alias: ["jaanu", "sweetheart"],
  desc: "Call someone sweetheart lovingly",
  react: "💗",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `💗 *JAAN WALA MESSAGE!* 💗\n\nTum ne kaha:\n\n*"${t}... Jaan!"*\n\n😳 ${t} ka reaction:\n\n*Chehra laal...*\n*Dil tez...*\n*Reply ka intezaar...*\n*"Maine kuch suna ya..."* 😂🥺\n\nSab ne suna! Ab reply karo JAAN! 😂💗`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 22. QISMAT WALA COMMAND
// ============================================
cmd({
  pattern: "qismatwala",
  alias: ["lucky", "naseeb"],
  desc: "Check who's in your destiny",
  react: "🍀",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🍀 *QISMAT KA INKISHAAF!* 🍀\n\nTum ki qismat mein likha hai:\n\n*${t}!* ✨\n\n*"Na iss ki koshish, na uss ki koshish,\nJo likha tha qismat mein woh aaya!\nYeh dono ka milna toh upar se taya tha!"*\n\n🌟 Allah ki marzi mein hi bhalaai hai! 💫\n\nDono ko mubarak! 🎊💕`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 23. JHOOTH KA PYAAR COMMAND
// ============================================
cmd({
  pattern: "jhoothpyaar",
  alias: ["fakelove", "dikhawa"],
  desc: "Reveal whose love is fake",
  react: "🎭",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const msgs = [
    `🎭 *JHOOTH KA PARDA HATA!* 🎭\n\nTum ne bataya:\n\n*"${t} kehta/kehti hai 'Sirf dost hoon!'\nLekin:*\n\n- Subah sabse pehle mujhe text: ✅\n- Raat ko online check karna: ✅\n- Meri har baat yaad rakhna: ✅\n- Birthday yaad rakhna: ✅\n\n*Yeh dosti wali dosti nahi lagti!"* 😂💕`,
    `🎭 *SACH KYA HAI?!* 🎭\n\n${t} kehta/kehti hai:\n*"Hum sirf dost hain!"*\n\nLekin Tum ka kehna hai:\n*"Agar sirf dost hain,\ntoh raat ko 2 baje sirf dost hi\n'Neend aa rahi hai?' kyun poochhte/poochhhti hain?"*\n\n😂 Poora group sach jaanta hai! 💀❤️`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[Math.floor(Math.random() * msgs.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 24. SIYAANI BAT COMMAND
// ============================================
cmd({
  pattern: "siyaanibaat",
  alias: ["lifetip", "aqalmand"],
  desc: "Share random funny life advice",
  react: "🧠",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  const tips = [
    `🧠 *AAJ KI SIYAANI BAAT* 🧠\n\n*"Jo teri yaad karta/karti hai,\nwoh online bhi hoga/hogi aur text bhi!\nJo nahi karta/karti, excuse bahut hoge!"*\n\n✅ Save this to your heart! 💖`,
    `🧠 *AAJ KI AQALMAND BAAT* 🧠\n\n*"Pyaar mein ek kaam karo:\nPehle khud se pyaar karo!\nBaaki sab apne aap ho jaata hai!"*\n\n✅ Daily reminder! 💪`,
    `🧠 *ZINDAGI KA FUNDA* 🧠\n\n*"Jo tumhara wait karta/karti hai,\nwoh tumse pyaar karta/karti hai!\nJo 'busy hoon' kehta/kehti hai,\nuski priority tum nahi!"*\n\n🔥 Sach baat! Save kar lo! 📌`,
    `🧠 *AQAL KI BAAT* 🧠\n\n*"Kabhi kisi ke peeche mat bhaago,\nJo tumhara hai, tumhare paas aayega!\nPhool ki tarah khilte raho,\nTitliyaan khud aayengi!"* 🦋\n\n😂 Lekin door se nahi dekho sirf! 🌸`,
    `🧠 *GROUP WISDOM* 🧠\n\n*"Wo log jo group mein kam bolte hain,\nwoh DM mein sabse zyada bolte hain!\nGroup mein shaant, privately pagal!"* 😂\n\nSach hai ya nahi? 😅`
  ];
  
  reply(tips[Math.floor(Math.random() * tips.length)]);
});

// ============================================
// 25. MOHABBAT KA QARZ COMMAND
// ============================================
cmd({
  pattern: "mohabbatqarz",
  alias: ["lovedebt", "ehsaan"],
  desc: "Pay love debt to someone",
  react: "💝",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `💝 *MOHABBAT KA QARZ CHUKAYA!* 💝\n\nTum ne ${t} ko\naaj ek *Khaas Thank You* diya:\n\n*"Tum ne jo ek din mujhe online dekh ke\n'Kya hua?' poochha tha,\nwoh main aaj tak nahi bhool saka/sakti!\nTumhari choti si parwah ne\nzindagi badal di!"* 🥺💝\n\nYeh hai sachchi mohabbat! 😭❤️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 26. NAZAR UTARAO COMMAND
// ============================================
cmd({
  pattern: "nazarutarao",
  alias: ["nazar", "burinazar"],
  desc: "Remove evil eye in funny style",
  react: "🧿",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🧿 *NAZAR UTARAO!* 🧿\n\n${t} par is group mein\n*bahut buri nazar* lag rahi hai!\n\nKisne lagayi? 👀\n\n🕯️ *Nazar Utarne ka Tarika:*\n\n"Allah Tawakkalt" 3 baar\n+ Durood 3 baar\n+ Group ke tamam logon ko\nchai pilao ek baar! ☕😂\n\n*Sab theek ho jaayega InshAllah!* 🙏\n\n*Yeh sab mazaak hai bhai, asli ilaj doctor!* 😂`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 27. ROMANTIC BAKWAAS COMMAND
// ============================================
cmd({
  pattern: "romanticbakwaas",
  alias: ["filmibaatein", "dialogbaazi"],
  desc: "Share filmy romantic dialogues",
  react: "🎬",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const dialogues = [
    `🎬 *FILMI SCENE!* 🎬\n\nTum ne dramatic andaaz mein\n${t} ko dekh ke kaha:\n\n*"Main tujhse mohabbat nahi karta/karti!\n(3 second silence)\nMain tujhse BOHOT mohabbat karta/karti hoon!"*\n\n😂 Seedha Bollywood scene! 🎭\n\nBackground mein violin baj rahi hai! 🎻`,
    `🎬 *DRAMATIC SCENE!* 🎬\n\nTum: "${t} tumse ek baat kehni thi..."\n${t}: "Haan bolo..."\nTum: "..."\n${t}: "Kya hua?"\nTum: "..."\n\n*Baarish shuru ho gayi dramatically!* 🌧️\n\n*Group: "Bol bhi do yaar!"* 😂💀`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: dialogues[Math.floor(Math.random() * dialogues.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 28. AASHIQANA AWARD COMMAND
// ============================================
cmd({
  pattern: "aashiqanaaward",
  alias: ["romanticaward", "pyaaraward"],
  desc: "Give romantic award to someone",
  react: "🏆",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const awards = [
    `🏆 *AASHIQANA AWARD NIGHT!* 🏆\n\nAaj ka *"Sabse Romantic Insaan"* Award\n\n🥁 *...drum roll...*\n\n🎊 ${t} ko! 🎊\n\n*"Yeh banda/bandi itna/itni romantic hai ke:\nPhool dekhe - romance\nChaand dekha - romance\nBaarish hui - romance\nChay pi - romance*\n\nYaar tum toh har jagah romance dhoondh lete/leti ho!" 😂❤️`,
    `🏆 *PYAAR WALA AWARD!* 🏆\n\n*Congratulations ${t}!*\n\nTumhe mila hai:\n*"Group Ka Dil Jeetne Wala"* 🥇\n\nKyunki:\n💬 Tumhari baatein - heart touching\n😊 Tumhari muskaan - dil khushkar\n❤️ Tumhari presence - group mein jannat\n\n*Sach mein acha insaan ho tum!* 🌟`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: awards[Math.floor(Math.random() * awards.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 29. MOHABBAT TERI COMMAND
// ============================================
cmd({
  pattern: "mohabbatteri",
  alias: ["yourlovetype", "pyaarkatype"],
  desc: "Find out your love type",
  react: "💖",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const types = [
    `💖 *TUMHARA PYAAR KA TYPE!* 💖\n\n*SILENT LOVER* 🤫\n\nTum pyaar karte/karti ho lekin bolte/bolti nahi!\nBas aankhon se express karte/karti ho!\nStatus lagaate/lagaati ho hint waale!\nAur wait karte/karti ho ke woh samjhe/samjhe!\n\n*"Ek baar seedha bol do yaar!"* 😂💕`,
    `💖 *PYAAR TYPE RESULT!* 💖\n\n*DRAMA QUEEN/KING LOVER* 🎭\n\nTumhara pyaar:\n- Thoda zyada filmi\n- Thoda zyada dramatic\n- Thoda zyada emotional\n- Bohot zyada sachcha!\n\n*"Aisi mohabbat karo ke log story likhein!"* 😂❤️`,
    `💖 *TUMHARA LOVE TYPE!* 💖\n\n*LOYAL AF* 💎\n\nTum ek baar pyaar karte/karti ho\ntoh puri zindagi ke liye!\nChodna bhi nahi chahte/chahti,\nLekin sahi insaan dhoondna mushkil hai!\n\n*"Allah best de tumhe!"* 🤲💫`,
    `💖 *LOVE PERSONALITY!* 💖\n\n*BAKWAS LOVER* 😂\n\nTumhara pyaar:\n- Mazaak mein chhupa hua\n- Hassi mein dil ki baat\n- Jhagre mein care\n- Ignore mein attention\n\n*Poora ulta tarika hai tumhara!* 😂💕`
  ];
  
  await conn.sendMessage(mek.chat, {
    text: types[Math.floor(Math.random() * types.length)] + `\n\nTum`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 30. DIL KHOL KE COMMAND
// ============================================
cmd({
  pattern: "dilkhol",
  alias: ["openup", "dilkhabaat"],
  desc: "Open up your heart to someone",
  react: "💬",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const msgs = [
    `💬 *DIL KHOL KE BAT!* 💬\n\nTum ne aaj ${t} ko\n*DIL KHOL KE* bata diya:\n\n*"Yaar tere saath time spend karna,\nMujhe sach mein accha lagta hai!\nNa koi drama, na koi show,\nBas tu ho, toh dil khush ho!"* 🥺\n\nYeh baat sach mein dil se nikli! 💖`,
    `💬 *SACH BAAT!* 💬\n\nTum ka ${t} ke liye\nkhula sandesa:\n\n*"Main jaanta/jaanti hoon tum bura nahi maanoge/maanogi,\nIsliye kehna chahta/chahti hoon:\nTum bahut ache/achi ho!\nAur main tumhari parwah karta/karti hoon!"*\n\n😭 Yeh group ka sachcha rishta! ❤️`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[Math.floor(Math.random() * msgs.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 31. GUSSA PYAAR COMMAND
// ============================================
cmd({
  pattern: "gussapyaar",
  alias: ["lovehate", "gusspyar"],
  desc: "Express angry love",
  react: "😠❤️",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `😠❤️ *GUSSA PYAAR COMBO!* 😠❤️\n\nTum ne ${t} ko kaha:\n\n*"Tum mujhe bahut gussa dilate ho!\n...aur phir bhi main tumhara intezaar karta/karti hoon!\n\nTum late reply karte/karti ho,\n...aur phir bhi mujhe tumse baat karni hoti hai!\n\nTum ignore karte/karti ho,\n...aur phir bhi dil mein tumhi hote/hoti ho!\n\nYeh kya jaadu hai bhai?!"* 😭😂\n\n*Yahi toh sachcha pyaar hai!* 💀❤️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 32. JASOOS COMMAND
// ============================================
cmd({
  pattern: "jasoos",
  alias: ["spy", "jasus"],
  desc: "Find the group spy",
  react: "🕵️",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🕵️ *JASOOS PAKDA GAYA!* 🕵️\n\n*BREAKING NEWS* 📰\n\nIs group mein ek *CHHUPA JASOOS* tha!\n\nAur woh hai... 🥁\n\n*${t}!* 😱\n\nYeh banda/bandi:\n✅ Sab ki screenshots leta/leti tha/thi\n✅ Group ki sari info store thi\n✅ Doosre groups mein share karta/karti tha/thi\n\n*JK bhai! Sab dost hain!* 😂\n\nMazaak tha, bura mat maano! 💕`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 33. TANGA PHANDA COMMAND
// ============================================
cmd({
  pattern: "tangaphanda",
  alias: ["trapped", "phanda"],
  desc: "Trap someone in love",
  react: "🪤",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🪤 *PYAAR KE PHANDE MEIN!* 🪤\n\n${t} bhai/behan,\ntum Tum ke\n*PYAAR KE PHANDE* mein a gaye/gayi ho!\n\nNikalna mushkil hai kyunki:\n\n💬 Unki baatein - nasha hai\n😊 Unki muskaan - chain hai\n📱 Unka message - khushi hai\n🌙 Unka waqt - jannat hai\n\n*Ab nikaalna bhi nahi chahoge/chahogi!* 😂💕\n\nWelcome to the best phanda! ❤️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 34. MUFT ADVICE COMMAND
// ============================================
cmd({
  pattern: "muftadvice",
  alias: ["freeadvice", "nasheehat"],
  desc: "Free love advice",
  react: "📢",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  const advices = [
    `📢 *MUFT ADVICE #1* 📢\n\n*"Jis ko tumse zyada doosra pasand ho,\nusse tumhare liye pasand mat aane do!\nKhud ki izzat karo sabse pehle!"*\n\n💪 *Self respect first!* 👑`,
    `📢 *MUFT ADVICE #2* 📢\n\n*"Woh jo tumhe 'busy hoon' kehta/kehti hai aur doosron ke saath online hai,\nwoh busy nahi - priority nahi ho tum!\nFind someone who makes time!"*\n\n🔥 *Hard truth!* ❤️`,
    `📢 *MUFT ADVICE #3* 📢\n\n*"Pyaar mein kabhi peeche mat jaao!\nAage bhi mat bhago!\nBas saath chalte raho!\nYahi sachchi mohabbat hai!"*\n\n💫 *Aaj ki wisdom!* 🌸`,
    `📢 *MUFT ADVICE #4* 📢\n\n*"Jo tumhare liye khush hota/hoti hai,\njo tumhare liye roye,\nwoh tumhara saccha wala hai!\nBaaki sab dekho aur ignore karo!"*\n\n💖 *True story!* 🎯`,
    `📢 *MUFT ADVICE #5* 📢\n\n*"Group mein agar koi specially tumhe tag karta/karti hai,\nspecially tumhe GN/GM bolta/bolti hai,\nspecially tumhara reply chahiye hota hai -\nbhai woh kuch toh rakhta/rakhti hai dil mein!"*\n\n😂 *Observe karo yaar!* 👀`
  ];
  
  reply(advices[Math.floor(Math.random() * advices.length)]);
});

// ============================================
// 35. NAKHREBAAZ COMMAND
// ============================================
cmd({
  pattern: "nakhrebaaz",
  alias: ["drama", "nakhre"],
  desc: "Find biggest drama queen/king",
  react: "💅",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `💅 *NAKHREBAAZ AWARD!* 💅\n\nAaj ka *"Group Ka Sabse Bada Nakhrebaaz"* Award:\n\n🥁 *...TAADAAA...*\n\n${t}! 🎊\n\nYeh:\n💅 "Bas ek minute mein aaya/aayi" = 30 min\n💬 "Koi khaas nahi" = 3 ghante se type kar raha/rahi\n😒 "Theek hoon" = Bilkul theek nahi\n👀 "Mujhe parwah nahi" = Sabse zyada parwah\n\n*Pyaare nakhre hain inke!* 😂❤️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 36. ANOKHA PYAAR COMMAND
// ============================================
cmd({
  pattern: "anokhapyaar",
  alias: ["uniquelove", "ajeebmohabbat"],
  desc: "Express love in unique way",
  react: "🌈",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const msgs = [
    `🌈 *ANOKHA PYAAR!* 🌈\n\nTum ka ${t} ke liye\nSabse *ANOKHA* pyaar ka izhar:\n\n*"Tum wifi jaiso ho mere liye!\nJab ho toh zindagi smooth,\nJab nahi ho toh kuch kaam nahi karta!\nAur jab signal kamzor ho,\ntoh dil ghabrata hai!"* 📶❤️\n\n*Aaj ka sabse romantic comparison!* 😂💕`,
    `🌈 *AJAB MOHABBAT!* 🌈\n\nTum ne ${t} ko compare kiya:\n\n*"Tum mere liye Mobile Battery jaiso ho!\nSubah full charged mil jao,\ntoh poora din khushi khushi guzre!\nKam ho jao toh anxious ho jaata/jaati hoon!\nBilkul drain ho jao toh life ruk jaati hai!"*\n\n*Iss se zyada sachchi mohabbat kya hogi?!* 😂🔋❤️`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[Math.floor(Math.random() * msgs.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 37. BHAAG GAYA/GAYI COMMAND
// ============================================
cmd({
  pattern: "bhaaggaya",
  alias: ["runaway", "ghaib"],
  desc: "Find who ran away from group",
  react: "🏃",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🏃 *BHAAG GAYA/GAYI!* 🏃\n\n*ALERT ALERT ALERT!* 🚨\n\nKhabar yeh hai ke ${t} ne\nis group se *BHAAGNE* ki koshish ki!\n\nKyu?\n\nShayad:\n😅 Kisi ka crush wali baat pata chal gayi\n😂 Kisi ne unhe tag kar diya jhoothi shayari mein\n💀 Koi unhe publicly propose karne wala tha\n\n*Woh bhaag nahi sakte!\nHum unhe yaad dilaate rahenge!* 😂\n\nWapas aao ${t}! ❤️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 38. KHUSH NASEEBI COMMAND
// ============================================
cmd({
  pattern: "khushnaseebi",
  alias: ["lucky2", "bhagyashan"],
  desc: "Find today's luckiest person",
  react: "🌟",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🌟 *AAJ KA SABSE KHUSH NASEEB!* 🌟\n\n*Stars ne bataya hai ke aaj ka\nsabse KHUSH NASEEB insaan hai:*\n\n✨ ${t} ✨\n\n*Aaj tumhare liye:*\n💰 Rizq mein barkat\n❤️ Pyaar mein khushi\n😊 Khushiyan dobaala\n🌙 Raat chain ki\n☀️ Subah achi\n\n*Mubarak ho!* 🎊\n\nInshAllah! 🤲💫`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 39. RONE WALA COMMAND
// ============================================
cmd({
  pattern: "ronewala",
  alias: ["emotional", "drama2"],
  desc: "Find most emotional person",
  react: "😭",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `😭 *EMOTIONAL AWARD!* 😭\n\nAaj ka *"Sabse Sensitive Dil Wala"* Award:\n\n🎊 ${t} ko! 🎊\n\nYeh:\n😭 Sad song sune - ro dete/deti hain\n🎬 Movie dekhe - ro dete/deti hain\n📖 Koi sacchi baat kaho - ro dete/deti hain\n🌧️ Baarish dekhe - ro dete/deti hain\n💌 Koi achi baat karo - ro dete/deti hain\n\n*Par yahi sensitive dil sabse\nsundar hota hai!* 🥺❤️\n\nTumhara dil sachcha hai! 💖`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 40. WAQT GUZARNA COMMAND
// ============================================
cmd({
  pattern: "waqtguzarna",
  alias: ["timewaster", "bakwastime"],
  desc: "Show how someone wastes time",
  react: "⏰",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `⏰ *WAQT GUZARNA - DAILY SCHEDULE!* ⏰\n\n${t} ka roz ka routine:\n\n☀️ *Subah:* Tum ke messages check karo\n🍽️ *Dopahar:* Unki status dekho\n☕ *Shaam:* Unke online hone ka intezaar\n🌙 *Raat:* Unse baatein karo\n💤 *Neend:* Unke baare mein sapne\n\n*Busy schedule hai tumhara!* 😂💕\n\nSach hai ya nahi? Bolo! 👀`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 41. CHAND SA CHEHRA COMMAND
// ============================================
cmd({
  pattern: "chandsa",
  alias: ["moonface", "chandchehra"],
  desc: "Praise someone's moon-like beauty",
  react: "🌙",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const msgs = [
    `🌙 *CHAND SA CHEHRA!* 🌙\n\nAaj ${t} ke liye:\n\n*"Chand bhi sharmata hoga dekh ke,\nSitare bhi jhukate hote nazar,\nAllah ne banaya hai tujhe bahut pyaar se,\nHar nazar mein hai teri ek alag kadar!"* 🥺\n\n*Subhan Allah!* ✨ MashaAllah! 🌟`,
    `🌙 *MOONLIGHT TAARIF!* 🌙\n\n${t} ke liye group ka kehna:\n\n*"Raat ke andhere mein jo chand chamke,\nBilkul waise tum group mein aate/aati ho!\nSara andher dil ka mit jaata hai,\nJab tumhara message screen pe aata hai!"*\n\n💖 Sach bol raha/rahi hoon! ❤️`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[Math.floor(Math.random() * msgs.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 42. DOST YA DILDAR COMMAND
// ============================================
cmd({
  pattern: "dostyadildar",
  alias: ["friendorlover", "kyadono"],
  desc: "Find out friend or lover",
  react: "🤔",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const result = Math.random() > 0.5 ? "DILDAR" : "PAKKA DOST";
  const msgs = {
    "DILDAR": `🤔 *REVEAL TIME!* 🤔\n\nTum aur ${t} ke beech:\n\n*Algorithm ka jawab: DILDAR!* 💘\n\n*"Dono kahte hain sirf dost hain,\nLekin:*\n💬 Baatein ghanton hoti hain\n😊 Dono ek doosre ke liye smile karte hain\n❤️ Ek doosre ki parwah hai\n\n*Yeh dosti ka naam nahi, kuch aur hai!"* 😂`,
    "PAKKA DOST": `🤔 *REVEAL!* 🤔\n\nTum aur ${t}:\n\n*Result: PAKKA SACHCHA DOST!* 🤝\n\n*"Kuch rishte sirf dosti ke hote hain!\nIsmein koi romance nahi,\nBas ek dil ka gehri dost!\nJo hamesha saath ho!"*\n\n*Yeh dosti barkarar rahe!* 🥂💛`
  };
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[result], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 43. GALAT FEHMI COMMAND
// ============================================
cmd({
  pattern: "galatfehmi",
  alias: ["misunderstand", "confuse"],
  desc: "Create dramatic misunderstanding",
  react: "😤",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `😤 *GALAT FEHMI DRAMA!* 😤\n\nTum aur ${t} ke beech\nAaj ki *BIGGEST GALAT FEHMI:*\n\nTum: "Tum mujhe ignore karte/karti ho!"\n${t}: "Main busy tha/thi!"\nTum: "Par tum online the/thi!"\n${t}: "Main... um..."\n\n*GROUP: "Sach bol do dono!"* 😂\n\n*Aur is tarah shuru hoti hai ek filmi kahani!* 🎬❤️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 44. PERFECT MATCH COMMAND
// ============================================
cmd({
  pattern: "perfectmatch",
  alias: ["idealmatch", "jodijori"],
  desc: "Reveal perfect match scientifically",
  react: "💑",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `💑 *PERFECT MATCH REVEAL!* 💑\n\n*AI + Stars + Algorithm + Dil =*\n\nTum ka Perfect Match:\n\n🥁 *...drum roll...*\n\n💘 *${t}!* 💘\n\n*Kyu Perfect Match hain?*\n✅ Dono thode pagal hain\n✅ Dono group mein active hain\n✅ Dono ke nakhre compliment hain\n✅ Dono ek doosre ko handle kar sakte hain\n\n*Allah ek kare!* 🤲💕`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 45. RAAZ KHOLA COMMAND
// ============================================
cmd({
  pattern: "raazkhola",
  alias: ["secretreveal", "raazkholdo"],
  desc: "Reveal someone's hidden secret",
  react: "🔓",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const secrets = [
    `🔓 *RAAZ KHOLA!* 🔓\n\n*${t} ka Chhupaaya Hua Raaz:*\n\nYeh shaks group mein kisi ko secretly like karta/karti hai!\n\nEvidence:\n👀 Unke messages carefully padhta/padhti hai\n😊 Unke jokes pe zyada hasta/hasti hai\n📱 Unka online dekh ke active ho jaata/jaati hai\n\n*Naam nahi btaiye, woh khud samjhe!* 😂💕`,
    `🔓 *SECRET EXPOSE!* 🔓\n\n${t} ka woh raaz jo sab jaante hain\nlekin koi bolta nahi:\n\n*"Yeh group admin se zyada group ko sambhalte/sambhalti hain!\nHar member ki parwah karte/karti hain!\nAur chaahte/chaahti hain ke sab khush rahein!"*\n\n💖 *Yeh toh sabse pyaara raaz nikla!* 😭❤️`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: secrets[Math.floor(Math.random() * secrets.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 46. MOHABBAT KA DARJAA COMMAND
// ============================================
cmd({
  pattern: "mohabbatdarjaa",
  alias: ["lovelevel", "pyaarlevel"],
  desc: "Check love level between two people",
  react: "📊",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const level = Math.floor(Math.random() * 10) + 1;
  const labels = ["💔 Zero", "😐 Dost Jaisa", "🙂 Thoda Pyaar", "😊 Kaafi Pyaar", "😍 Deep Pyaar", "🥰 Bohot Gehra", "💖 Dil Mein Ghar", "❤️ Sachcha Pyaar", "💘 Pagal Deewana", "💯 ISHQ MEIN DOOBA!"];
  
  await conn.sendMessage(mek.chat, {
    text: `📊 *MOHABBAT KA DARJAA* 📊\n\nTum aur ${t}\nke darmiyan pyaar ka level:\n\n*${level}/10 - ${labels[level - 1]}*\n\n${"🔴".repeat(level)}${"⚪".repeat(10 - level)}\n\n${level >= 8 ? "😂 *Bhai/behan yeh toh seedha heart attack!*\nDoctor ko dikhao pehle! 💀" : level >= 5 ? "💕 *Kaafi accha connection hai!*\nThoda aur kaam karo! 😊" : "😅 *Thodi friendship aur ki zaroorat hai!*\nKaam karo iss par! 💪"}`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 47. DUA COMMAND
// ============================================
cmd({
  pattern: "dua",
  alias: ["prayer", "aashirwaad"],
  desc: "Pray for someone from heart",
  react: "🤲",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const duas = [
    `🤲 *DIL SE DUA!* 🤲\n\nTum ki taraf se ${t} ke liye:\n\n*"Allah tujhe khush rakhe hamesha!\nTere dil ki har khaahish poori kare!\nTere pyaron ko tere paas rakhe!\nAur teri zindagi mein sirf khushiyan aayein!"*\n\nAmeen! 🌸 Ya Rabb! 🤲\n\nSach mein pyaari dua! 💖`,
    `🤲 *KHAAS DUA!* 🤲\n\nTum ne ${t} ke liye\nmaanga dua mein:\n\n*"Yaa Allah, is insaan ko woh sab de\nJo main in ke liye maangta/maangti hoon!\nInhein khushiyan do, sehat do, pyaar do!\nAur ek aisi zindagi do jo ise khawhish thi!"*\n\nAmeen Sum Ameen! 🌺🤲`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: duas[Math.floor(Math.random() * duas.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 48. KHWAABON WALA COMMAND
// ============================================
cmd({
  pattern: "khwaabon",
  alias: ["dreams", "sapne"],
  desc: "Express dream-related love",
  react: "💭",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const msgs = [
    `💭 *SAPNE WALA SCENE!* 💭\n\n*Kal Raat Ka Sapna Report:*\n\nTum ke sapne mein\n${t} aaye/aayi! 😍\n\nSapne mein:\n🌸 Dono ek park mein the\n🌅 Sunset dekh rahe the saath\n💬 Ghanton baatein ki\n😊 Haste haste baatein\n\n*Subah aankhein khuli toh reality mein woh nahi the/thi!*\n*"Ek message toh karo yaar!"* 🥺😂`,
    `💭 *SAPNA REVEAL!* 💭\n\n${t} tum jaante/jaanti ho?\n\nTum ke roz ke sapne mein\nTum hote/hoti ho! 😳\n\n*"Sapne mein tum much kuch bolte/bolti ho\nJo reality mein bolna chahte/chahti hoon!"* 🥺\n\nKoi jawab do bhai/behan! 😂💕`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[Math.floor(Math.random() * msgs.length)], 
    mentions: tm 
  }, { quoted: mek });
});












// ============================================
// 1. AKELA COMMAND
// ============================================
cmd({
  pattern: "akela",
  alias: ["alone", "single4ever"],
  desc: "Reveal the forever alone person in group",
  react: "🙃",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const msgs = [
    `🙃 AKELA AWARD 2025! 🙃\n\nIs saal ka "Officially Single" Award:\n\n🥁 ${t} 🥁\n\nDaily Routine:\n📱 Subah uthke memes dekho\n☕ Akele chai piyo\n💬 Group mein bakwaas karo\n🌙 Raat ko akele so jao\n\n"Koi baat nahi yaar, ek din zaroor milega/milegi tujhe!"\n\nAbhi ke liye: PIZZA IS LOVE! 🍕😂`,
    `🙃 SINGLE HALL OF FAME! 🙃\n\n${t} ne is saal ka\nAKELA CHAMPION title jeeta!\n\n"Na koi propose kiya, na koi mila,\nBas group mein online raha/rahi,\nAur khud se hi hassta/hassti raha/rahi!"\n\n💪 Self love is the best love! 😂❤️`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[Math.floor(Math.random() * msgs.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 2. BEWAFA COMMAND
// ============================================
cmd({
  pattern: "bewafa",
  alias: ["betrayal", "dhoka"],
  desc: "Dramatic betrayal scene in group",
  react: "🗡️",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const msgs = [
    `🗡️ BEWAFA ALERT! 🗡️\n\nTum ne ${t} ke baare mein bataya:\n\n"Maine sab kuch kiya unke liye!\nOnline raha, message kiya, react kiya!\nAur inhone kya kiya?\n\nDOOSRE GROUP MEIN CHALE GAYE! 😭\n\nYeh BEWAFAI hai ya nahi?!" 😤💔\n\nGroup ki support chahiye! 😂`,
    `🗡️ DHOKA TIME! 🗡️\n\n${t} ne Tum ko\nDHOKA diya!\n\nKaise?\n"Unhone mera meme dekha,\nLekin react nahi kiya!\nYeh chota dhoka nahi,\nYEH BETRAYAL HAI!" 😭😂\n\nSabse chota lekin sabse dard wala dhoka! 💀❤️`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: msgs[Math.floor(Math.random() * msgs.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 3. CHAKKAR COMMAND
// ============================================
cmd({
  pattern: "chakkar",
  alias: ["dizzy", "confused2"],
  desc: "Getting dizzy in love",
  react: "😵",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `😵 CHAKKAR AA GAYA! 😵\n\nTum ko ${t} ki wajah se\nchakkar aa gaya!\n\nDoctors ne bataya reason:\n\n🩺 Diagnosis: Mohabbat ka Virus\n\nSymptoms:\n🔄 Inka naam aaye - chakkar\n📱 Inka message aaye - chakkar\n👁️ Inhe dekho - zyada chakkar\n💬 Inse baat karo - hospital!\n\nKoi dawai nahi is bimari ki!\nBas woh hi theek kar sakte/sakti hain! 😂💘`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 4. ULLU BANANA COMMAND
// ============================================
cmd({
  pattern: "ullubana",
  alias: ["prank", "fooling"],
  desc: "Prank someone in group",
  react: "🦉",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const pranks = [
    `🦉 ULLU BANANA SHURU! 🦉\n\n${t} bhai/behan!\n\nKHAAS KHABAR: Tumhare baare mein ek bahut important announcement ane wali hai group mein!\n\n...\n\n...\n\n...\n\nWOH YEH HAI KE TUM DUNYA KE SABSE BADE ULLU HO! 😂🦉\n\nTum ne bana diya! April Fool! 😂💕`,
    `🦉 PRANK SUCCESSFUL! 🦉\n\nTum ne ${t} ko\nbana diya aaj ka ULLU! 🦉\n\n${t}: "Kya hua? Kya hua?"\n\nGroup: "HAHAHAHA!" 😂\n\nYeh pyaar bhari chherhna hai! ❤️😂`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: pranks[Math.floor(Math.random() * pranks.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 5. TAALI BAJAO COMMAND
// ============================================
cmd({
  pattern: "taalibajao",
  alias: ["clap", "shukriya"],
  desc: "Clap for someone in appreciation",
  react: "👏",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `👏 TAALI BAJAO SABB! 👏\n\nTum ne ${t} ke liye\nStanding Ovation diya!\n\nKyun?\n\n✅ Is insaan ne group ko zinda rakha\n✅ Sab se milke baat ki\n✅ Kabhi kisi ko ignore nahi kiya\n✅ Group ka asli hero/heroine hai yeh!\n\n👏👏👏👏👏👏👏👏👏👏\n\nSab milke taali bajao! 🎊`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 6. NEEND URAI COMMAND
// ============================================
cmd({
  pattern: "neendurai",
  alias: ["sleepstealer", "insomnia"],
  desc: "Reveal who stole your sleep",
  react: "😴",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `😴 NEEND URAI REPORT! 😴\n\nTum ki neend ka thief:\n\n${t} 🦹\n\nKaise:\n🌙 Raat 12 baje: Unka khayal\n🌙 Raat 1 baje: Unki purani chats\n🌙 Raat 2 baje: Unka status recheck\n🌙 Raat 3 baje: "Kya woh mujhe pasand karte/karti hain?!"\n🌙 Subah 6 baje: Nind nahi ayi\n\nYeh neend ka thief nahi,\nDil ka thief hai! 😭😂💕`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 7. CHATPATA COMMAND
// ============================================
cmd({
  pattern: "chatpata",
  alias: ["spicy", "teekha"],
  desc: "Find the spiciest personality in group",
  react: "🌶️",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🌶️ CHATPATA AWARD! 🌶️\n\nGroup ka Sabse Chatpata Insaan:\n\n${t} 🏆\n\nPersonality Report:\n🌶️ Baatein - Chatpati\n🔥 Jawab - Teekha\n😏 Andaaz - Masaledar\n💯 Humor - Extra chatpata\n\n"Yeh insaan bland nahi!\nHar baat mein flavor hai!"\n\nAise log group ki jaan hote hain! ❤️🌶️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 8. WAITING ROOM COMMAND
// ============================================
cmd({
  pattern: "waitingroom",
  alias: ["waitkaro", "doubletch"],
  desc: "Show who's waiting for reply",
  react: "⏳",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  const mins = Math.floor(Math.random() * 300) + 10;
  
  await conn.sendMessage(mek.chat, {
    text: `⏳ WAITING ROOM REPORT ⏳\n\nTum pichle ${mins} minutes se\n${t} ka reply wait kar raha/rahi hai!\n\nDouble tick status: ✅✅ (SEEN!)\n\nPhir bhi reply nahi aaya!\n\nStatus check kiya: 5 baar ✅\nProfile click kiya: 3 baar ✅\nMessage resend ka socha: ✅\nBlock hone ka check kiya: ✅\n\n${t} reply karo bhai/behan!\nKoi zinda hai wahaan?! 😭😂`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 9. TAJ COMMAND
// ============================================
cmd({
  pattern: "taj",
  alias: ["crown", "king", "queen"],
  desc: "Crown someone as king/queen of group",
  react: "👑",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `👑 TAJ CEREMONY! 👑\n\nAaj ka KING/QUEEN OF THE GROUP:\n\n✨ ${t} ✨\n\nRoyal Qualities:\n👑 Baatein - Khaandaani\n🌟 Presence - Shahi\n💫 Style - Alag hi level\n❤️ Dil - Sona\n\n"Poori group unki praja hai!\nHum sab bow down karte hain!" 😂👑\n\nLong live the King/Queen! 🎊`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 10. LAFANGAA COMMAND
// ============================================
cmd({
  pattern: "lafangaa",
  alias: ["naughty", "shararat"],
  desc: "Reveal the naughtiest person in group",
  react: "😈",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `😈 LAFANGAA AWARD! 😈\n\nGroup ka Official LAFANGAA title:\n\n${t} ko! 🏆\n\nInn ki sharaatein:\n😈 Seedha jawab kabhi nahi dete/deti\n😂 Baatein ghumaate/ghumaati hain\n🤣 Har cheez mein fun dhundh lete/leti hain\n😏 Serious scene mein bhi haste/hasti hain\n\nPar yahi lafangapan toh group ki jaan hai!\n\nKeep being you! 😂❤️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 11. CHOCOLATE WALA COMMAND
// ============================================
cmd({
  pattern: "chocolatewala",
  alias: ["meetha", "sweet"],
  desc: "Find the sweetest person in group",
  react: "🍫",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🍫 CHOCOLATE WALA INSAAN! 🍫\n\nGroup ka Sabse Meetha Insaan:\n\n${t} 🍬\n\nKyu?\n\n🍫 Unki baatein - chocolate si meethi\n🍬 Unka behavior - candy sa pyaara\n🧁 Unka dil - cake sa naram\n🍰 Unki muskaan - dessert sa lajawab\n\n"Is insaan ke saath time spend karna\nDil ko khush kar jaata hai!"\n\nMashaAllah! ✨❤️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 12. BAAT KAATNA COMMAND
// ============================================
cmd({
  pattern: "baatkaatna",
  alias: ["interrupt", "beechmein"],
  desc: "Find the biggest interrupter",
  react: "✂️",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `✂️ BAAT KAATNE KA AWARD! ✂️\n\nGroup ka Sabse Baat Kaatne Wala/Wali:\n\n${t} 🏆\n\nScenario:\n\nKoi: "Yaar main batana chahta/chahti tha/thi ke aaj..."\n${t}: "ARE BHAI/BEHAN MERI SUNO!" 😂\n\nKoi: "Haan toh main keh raha/rahi tha/thi..."\n${t}: "WAISE MUJHE BHI EK BAAT YAAD AAYI!"\n\nBaat koi puri karta hi nahi in ke saath! 😂❤️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 13. PALAT COMMAND
// ============================================
cmd({
  pattern: "palat",
  alias: ["turnback", "wapasaa"],
  desc: "Will they turn around Bollywood style",
  react: "🔄",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  const palats = ["PALAT!", "PALAT!", "PALAT!", "Nahi palte/palti 💔"];
  const result = palats[Math.floor(Math.random() * palats.length)];
  
  await conn.sendMessage(mek.chat, {
    text: `🔄 PALAT TEST! 🔄\n\nTum ja raha/rahi hai...\n\n${t} kya palte/palti hain?\n\n🥁 ....\n🥁 ......\n🥁 ........\n\nResult: ${result} ${result.includes("Nahi") ? "\n\n😭 Pyaar tha teri yaad mein!\nBollywood se zyada dukh hua! 💔😂" : "\n\n😍 YESSS! Isliye kehte hain - sachchi mohabbat palti hai!\n\nDDLJ moment! 🎬❤️"}`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 14. GAANA SUNAO COMMAND
// ============================================
cmd({
  pattern: "gaanasunao",
  alias: ["dedicate", "song4u"],
  desc: "Dedicate a song to someone randomly",
  react: "🎵",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const songs = [
    `🎵 DEDICATED SONG! 🎵\n\nTum ne ${t} ko\nKhaas Taur Pe yeh gaana dedicate kiya:\n\n🎶 "Tujh Mein Rab Dikhta Hai"\n\n"Jab bhi group mein aate/aati ho,\nDil khush ho jaata hai!\nAllah ki khoobsoorat creation ho tum!" 🥺\n\nDil se! ❤️🎵`,
    `🎵 SONG DEDICATION! 🎵\n\nTum ki taraf se ${t} ke liye:\n\n🎶 "Pehla Nasha" 🎶\n\n"Pehla Nasha, Pehla Khumar,\nNaya Pyaar Hai, Naya Intezaar!"\n\nYeh gaana sirf tumhare liye! 🌹😂`,
    `🎵 SPECIAL DEDICATION! 🎵\n\n${t} ke liye Tum ne bheja:\n\n🎶 "Teri Meri Prem Kahani" 🎶\n\nSunna? Dil se sunna! 💕\nBaaki group ko bhi wait hai tumhara reaction dekhne ka! 😂`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: songs[Math.floor(Math.random() * songs.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 15. HAATH THAMNA COMMAND
// ============================================
cmd({
  pattern: "haaththamna",
  alias: ["handhold", "saathchalo"],
  desc: "Virtual hand holding romantic scene",
  react: "🤝",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🤝 HAATH THAMNA SCENE! 🤝\n\n[Dramatic Bollywood scene begins]\n\nTum ne ${t} ki taraf haath badhaya aur kaha:\n\n"Yeh raaste tanha mushkil hain,\nLekin tumhara haath ho toh\nKoi raah mushkil nahi!\nSaath chaloge/chalogi?" 🥺\n\n[Violin music intensifies] 🎻\n\nBackground mein baarish shuru! 🌧️\n\n${t} kya jawab doge/dogi?! 😂❤️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 16. CHUP RAHNA COMMAND
// ============================================
cmd({
  pattern: "chuprahna",
  alias: ["silence", "khaamoshi"],
  desc: "Silent treatment drama in group",
  react: "🤐",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🤐 SILENT TREATMENT ALERT! 🤐\n\nTum ne ${t} ko\nSILENT TREATMENT de raha/rahi hai!\n\nReason: \n"Unhone mera message 4 ghante baad dekha!\nAur SIRF 1 word reply kiya!\n\n'Ok'\n\nOK?! OK?! BAS OK?! 😤\n\nAb Tum chup rahega/rahegi...\n\n...for 5 minutes...\n\n...phir khud hi baat karega/karegi! 😂💀`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 17. PHOOLON KA HAAR COMMAND
// ============================================
cmd({
  pattern: "phoolonkahaar",
  alias: ["garland", "mala"],
  desc: "Give someone a garland of love",
  react: "🌺",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🌺 PHOOLON KA HAAR! 🌺\n\n🌸🌹🌺🌻🌼🌷🌸\n\nTum ne ${t} ko\nPHOOLON KA HAAR pehnaaya!\n\n🌸🌹🌺🌻🌼🌷🌸\n\nSath mein kaha:\n"Yeh haar nahi, meri dua hai!\nHar phool ki tarah khilte raho!\nHar khushbu ki tarah bikharte raho!\nZindagi mein hamesha bahar rahe!"\n\n🌺 Mubarak Ho! 🌺\n\nInshAllah! 🤲💫`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 18. GHOOR KE DEKHNA COMMAND
// ============================================
cmd({
  pattern: "ghoordekhna",
  alias: ["stare", "nigahein"],
  desc: "Staring contest romantic scene",
  react: "👁️‍🗨️",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `👁️‍🗨️ GHOOR KE DEKHNA! 👁️‍🗨️\n\nTum aur ${t}\nki group mein aankh mili!\n\nTik tik tik...\n\nTum: 👀\n${t}: 👀\nTum: 👁️\n${t}: 👁️\n\n10 second baad...\n\nDono ne ek waqt mein neeche dekha! 😳\n\nGroup: "OHHHH!" 😂🔥\n\nYeh toh filmi scene tha! ❤️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 19. BAHAANA COMMAND
// ============================================
cmd({
  pattern: "bahaana",
  alias: ["excuse", "bakwaasreason"],
  desc: "Find the biggest excuse maker",
  react: "🙄",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🙄 BAHAANA KING/QUEEN! 🙄\n\nGroup ka Sabse Zyada Bahaane Wala/Wali:\n\n${t} 🏆\n\nInke Top Bahane:\n\n🙄 Reply late: "Net nahi tha!"\n🙄 Online nahi: "Phone charge nahi tha!"\n🙄 Nahi aaye: "Light chali gayi thi!"\n🙄 Message nahi padha: "Notification nahi aayi!"\n\nBhai/behan sach to yeh hai ke bus mood nahi tha! 😂💀\n\nHum sab jaante hain! ❤️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 20. TARKEEB COMMAND
// ============================================
cmd({
  pattern: "tarkeeb",
  alias: ["plan", "jugaad"],
  desc: "Share clever plan to win love",
  react: "🧩",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const plans = [
    `🧩 TARKEEB REVEALED! 🧩\n\nTum ka ${t} ke\ndil mein jagah banane ka SECRET PLAN:\n\nStep 1: Group mein funny message bhejo 😂\nStep 2: Unka react aane par smile karo 😊\nStep 3: DM mein casual baat shuru karo 💬\nStep 4: "Sirf dost hain" kaho 🙄\nStep 5: 3 baje tak baatein karo ✅\nStep 6: Dono ko pata chal jaaye! 💘\n\nYeh plan already chal raha hai! 😂👀`,
    `🧩 JUGAAD PLAN! 🧩\n\nTum ka super secret plan\n${t} ke liye:\n\nPhase 1: Unka status like karo - DONE ✅\nPhase 2: Unka meme share karo - DONE ✅\nPhase 3: "Haha" se reply shuru karo - DONE ✅\nPhase 4: Abhi tak ka progress: Pending ⏳\n\nBhai/behan seedha bol do yaar! 😂💕`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: plans[Math.floor(Math.random() * plans.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// Continue with remaining 30 commands following the same pattern...
// Due to length constraints, I'll provide the next batch separately

// ============================================
// 21-50 COMMANDS CONTINUE...
// ============================================

// 21. HASSI CHHUPA COMMAND
cmd({
  pattern: "hassichhupa",
  alias: ["hidingsmile", "musakura"],
  desc: "Reveal who's hiding their smile",
  react: "🫣",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🫣 CHHUPII HASSI PAKDI! 🫣\n\n${t} jab bhi kisi khaas ka\nnaam group mein aata hai:\n\nScreen pe: "😐" (Normal face)\nAndar se: "😍😂🥰😭🤭"\n\nAur jab woh message karte/karti hain:\n\nHaath kaanpne lagte hain 😅\nHassi chhupani padti hai 🫣\nBaaad mein screen shot 📸\n\nYeh wala pyaar sabse sundar hai!\nJo chhupaate hain, woh gehra hota hai! 😂💖`,
    mentions: tm
  }, { quoted: mek });
});

// 22. MOBILE BAND KARO COMMAND
cmd({
  pattern: "mobileband",
  alias: ["putdown", "offkaro"],
  desc: "Order someone to put phone down",
  react: "📵",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `📵 MOBILE BAND KARO! 📵\n\n${t} bhai/behan!\n\nMedical Report:\nTumhara mobile addiction level: CRITICAL 🚨\n\nProof:\n📱 Subah uthke pehla kaam: Mobile check\n🚿 Bathroom mein bhi: Mobile\n🍽️ Khaana khate: Mobile\n🛏️ Sone se pehle: Mobile\n💤 Neend mein bhi: Sapne mein mobile\n\nDOCTOR KA NUSKHA:\nMobile rakho 5 minute ke liye!\nAasman dekhlo! ☁️\n\nKyun? Wahan bhi clouds hain, Instagram nahi! 😂`,
    mentions: tm
  }, { quoted: mek });
});

// 23-50 commands follow same pattern...
// For brevity, I'll show structure for remaining commands



// ============================================
// 23. PAGALPAN KA CERTIFICATE COMMAND
// ============================================
cmd({
  pattern: "pagalpancert",
  alias: ["crazycert", "diwanapan"],
  desc: "Give official crazy certificate",
  react: "🎓",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🎓 OFFICIAL CERTIFICATE 🎓\n\n╔══════════════════╗\n║  PAGALPAN AWARD  ║\n╚══════════════════╝\n\nYeh certificate diya jaata hai:\n\n${t} ko\n\nIs baat ki gawahi mein ke:\n\n✅ Yeh insaan group ka sabse zyada\nsochne wala/wali hai\n✅ Har cheez mein romance dhundhta/dhundhti hai\n✅ Dil hamesha dil ki sunta/sunti hai\n\nSeal: 💘 GROUP OF LOVE 💘\n\nTaareekh: Aaj 😂❤️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 24. MOBILE WALLPAPER COMMAND
// ============================================
cmd({
  pattern: "wallpaper",
  alias: ["lockscreen", "screensaver"],
  desc: "Reveal whose photo is wallpaper",
  react: "📲",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `📲 WALLPAPER REVEAL! 📲\n\nScientific Bluetooth Scan ne bataya:\n\nTum ke mobile ki\nSECRET WALLPAPER mein hai:\n\n👉 ${t} 👈\n\nProof:\n🔓 Lockscreen: Unki DP 😳\n🏠 Homescreen: Unhi ki tasweer\n⌚ Watch wallpaper: Bhi unhi ka 😂\n\nSach hai ya nahi?!\nTum batao! 👀\n\nPoora group jaanna chahta/chahti hai! 😂💖`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 25. DONO BAAT KARO COMMAND
// ============================================
cmd({
  pattern: "donobaat",
  alias: ["talkboth", "batcheet"],
  desc: "Force two people to talk",
  react: "💬",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `💬 GROUP MATCHMAKER PRESENTS! 💬\n\nAaj yeh dono group mein baat karenge:\n\n${t} 🤝 ${t}\n\nRules:\n✅ Ek dusre ko introduce karo\n✅ Ek joke sunao\n✅ Ek compliment do\n\nShuru karo!\n\nGroup wait kar raha hai! 😂👀\n\nAgar nahi kiya toh group tumhara number publish karega! 😂 (JK!)`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 26. KAAN PAKADNA COMMAND
// ============================================
cmd({
  pattern: "kaanpakadna",
  alias: ["sorry2", "maafi"],
  desc: "Dramatic sorry gesture",
  react: "🙏",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🙏 KAAN PAKAD KE MAAFI! 🙏\n\nTum ne ${t} ke saamne\nkaan pakad liye! 👂\n\n"Yaar sach mein sorry!\nMain galat tha/thi!\nTumne jo kaha woh sahi tha!\nTumhari baat sunni chahiye thi!\nAb maaf kar do please!"\n\n🥺🥺🥺🥺🥺\n\n${t} ab maafi do!\nBechaara/beechari kaan pakde khada/khadi hai! 😂❤️\n\nMaafi hi pyaar hai! 💕`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 27. TAQDIR COMMAND
// ============================================
cmd({
  pattern: "taqdir",
  alias: ["fate", "muqaddar"],
  desc: "Reveal what fate has written",
  react: "🔮",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🔮 TAQDIR KA INKISHAAF! 🔮\n\nStars, Moon, aur Algorithm sab ne\nmilke Tum ki TAQDIR batai:\n\n📜 "Is insaan ki zindagi mein ${t} ek ahem kirdar ada karega/karegi!"\n\nKaise:\n✨ Khushiyon mein saath\n🌧️ Mushkilon mein saath\n😂 Hassi mein saath\n🥺 Aansoon mein saath\n\n"Taqdir ne mila diya,\nAb nibhaana tumhara kaam!"\n\nAllah ki marzi mein hi bhalaai hai! 🤲💫`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 28. KAPKAPI COMMAND
// ============================================
cmd({
  pattern: "kapkapi",
  alias: ["nervous", "darana"],
  desc: "Nervous feeling around crush",
  react: "😬",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `😬 KAPKAPI REPORT! 😬\n\nTum jab ${t} se\nbaat karta/karti hai toh:\n\n🫀 Dil: Tez tez dhadakne lagta hai\n🤲 Haath: Kaanpne lagte hain\n🗣️ Awaaz: Thodi thartharaati hai\n😳 Chehra: Zyada cheeks red hote hain\n🧠 Dimag: Hang ho jaata hai\n\nDoctor ne diagnosis diya:\n\n"SEVERE CASE OF PYAAR!" 💘\n\nKoi ilaj nahi, bas ik hi raasta:\nSeedha bol do! 😂❤️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 29. TAARIF MEIN COMMIT COMMAND
// ============================================
cmd({
  pattern: "taarifcommit",
  alias: ["compliment2", "sachsach"],
  desc: "Honest compliment from heart",
  react: "🌟",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const praises = [
    `🌟 DIL SE TAARIF! 🌟\n\nTum ne ${t} ke baare mein\nGROUP KE SAAMNE kaha:\n\n"Sachchi baat yeh hai ke yeh insaan\nbahut acha/achi hai!\nKabhi kisi ko hurt nahi kiya,\nHamesha kisi ki madad ki,\nAur group ko hamesha khush rakha!\n\nAise log rare hain!\nKeep being amazing!" 🌟\n\nSab agree karo! 👇`,
    `🌟 HONEST REVIEW! 🌟\n\n${t} ke baare mein\nTum ka review:\n\n⭐⭐⭐⭐⭐ 5/5 Stars\n\n"Baatein karo toh din ban jaata hai,\nIgore karo toh din kharab!\nYeh insaan ka jaadu hai!\nMashaAllah!" 🥺✨`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: praises[Math.floor(Math.random() * praises.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 30. CAPTION CONTEST COMMAND
// ============================================
cmd({
  pattern: "captioncontest",
  alias: ["caption", "caption4u"],
  desc: "Give funny caption for DP",
  react: "📸",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const captions = [
    `📸 CAPTION CONTEST! 📸\n\n${t} ki DP ke liye\naaj ka best caption:\n\n"Allah ki art gallery ka\nSabse khoobsoorat painting!" 🎨\n\nHas lo, sachchi baat hai! 😂❤️`,
    `📸 DP CAPTION! 📸\n\n${t} ki profile picture ke liye:\n\n"Yeh insaan camera ke saamne nahi,\nCamera is ke saamne pose karta hai!"\n\n📸 MashaAllah! 🌟`,
    `📸 PROFILE CAPTION! 📸\n\n${t} ke liye best caption:\n\n"Warning: Itna sundar/sundar mat bano,\nLog apni aankhein kharaab kar lete hain!" 😂✨\n\nSach baat! 💖`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: captions[Math.floor(Math.random() * captions.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 31. ZYADA SOCHA COMMAND
// ============================================
cmd({
  pattern: "zyadasocha",
  alias: ["overthink", "dimaaglaga"],
  desc: "Reveal the overthinker",
  react: "🤯",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🤯 OVERTHINKING AWARD! 🤯\n\nGroup ka Sabse Zyada Sochne Wala/Wali:\n\n${t} 🧠💥\n\nInka Thought Process:\n\nKisi ne: "Ok" likha\n${t}: "Ok matlab kya? Happy ok? Angry ok? Bored ok? Ignore kar raha/rahi hai ok? Mujhse naraaz hai ok? Doctor ko dikhaana chahiye ok? Ya sach mein ok?!"\n\nYahi sochne mein 3 ghante gaye! 😂💀\n\nBhai/behan - "Ok" bas OK hai! 😂❤️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 32. GHAZAB COMMAND
// ============================================
cmd({
  pattern: "ghazab",
  alias: ["amazing2", "kamaal"],
  desc: "Reveal amazingly weird person",
  react: "🤩",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🤩 GHAZAB INSAAN! 🤩\n\nIs group mein ek GHAZAB insaan hai:\n\n${t} 🌟\n\nKyun ghazab hain yeh?\n\n🤩 Kabhi kabhi itna funny\nke stomach hurt ho jaata hai\n🥺 Kabhi kabhi itna caring\nke dil bhar aata hai\n😤 Kabhi kabhi itna pagal\nke samajh nahi aata\n💖 Lekin hamesha itna pyaara/pyaari\nke group khaali lagta hai inke bina!\n\nGhazab ho tum! 🌟`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 33. ONLINE DEKHNA COMMAND
// ============================================
cmd({
  pattern: "onlinedekhna",
  alias: ["onlinecheck", "stalk"],
  desc: "Reveal online status stalking",
  react: "🟢",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  const times = Math.floor(Math.random() * 20) + 5;
  
  await conn.sendMessage(mek.chat, {
    text: `🟢 ONLINE CHECK REPORT! 🟢\n\nScientific Analysis ne bataya:\n\nTum ne aaj\n${t} ka\n\nOnline status check kiya: ${times} baar! 😂\n\nTimeline:\n🕐 Subah 8: Check ✅\n🕑 Dopahar 1: Check ✅\n🕓 Shaam 4: Check ✅\n🕗 Raat 7: Check ✅\n🕙 Raat 10: Check ✅\n...\n\nBhai yeh mobile addiction nahi,\nYEH PYAAR HAI! 😭😂💕`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 34. DUSHMAN KA DUSHMAN COMMAND
// ============================================
cmd({
  pattern: "dushmankadushman",
  alias: ["enemyenemy", "hamdard"],
  desc: "Enemy of enemy is friend",
  react: "⚔️",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `⚔️ ALLIANCE DECLARE! ⚔️\n\nTum ne ${t} ko\nHAMDARD choose kiya!\n\n"Tum mere dushman ke dushman ho!\nIsliye tum mere dost ho!\nGroup mein tumhara saath chahiye!"\n\n🤝 ${t} ab Tum ka\nOfficial Yaar hai!\n\nSaath mein:\n✅ Roast karenge\n✅ Defend karenge\n✅ Chai peeyenge\n✅ Drama karenge! 😂❤️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 35. BURA NA MANO COMMAND
// ============================================
cmd({
  pattern: "buraanamano",
  alias: ["nooffense", "mazaakmein"],
  desc: "No offense style truth",
  react: "😅",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const truths = [
    `😅 BURA NA MANO PAR... 😅\n\n${t} bhai/behan:\n\n"Bura na mano par...\nTumhare replies aate hain\njab main apna phone rakh deta/deti hoon!\n\nBura na mano par...\nTumhara 'abhi aata/aati hoon'\nmein 45 minute lagte hain!\n\nBura na mano par...\nTum group ke sabse zyada nakhre waale ho!\n\nPar sach yeh hai ke...\nTUMHARE BINA GROUP SOONA HAI!" ❤️😂`,
    `😅 HONEST BAAT! 😅\n\nTum ne ${t} ko kaha:\n\n"Bura na mano par sach yeh hai ke:\nTum pagal ho!\nPar tumhara pagalpan bhi cute hai!\nTumse ladna bhi achha lagta hai!\nAur tumhara saath bhi chahiye hamesha!"\n\nYeh toh love-hate relationship hai! 😂💕`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: truths[Math.floor(Math.random() * truths.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 36. MIRROR MIRROR COMMAND
// ============================================
cmd({
  pattern: "mirrormirror",
  alias: ["selfconfidence", "aainaa"],
  desc: "Confidence boost game",
  react: "🪞",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🪞 MIRROR MIRROR ON THE WALL! 🪞\n\nMagic Mirror se pucha gaya:\n\n"Mirror mirror on the wall,\nIs group mein sabse beautiful kaun?"\n\n🪞 Mirror ne jawab diya:\n\n"${t} of course!" 👑\n\n"Allah ne khoob banaya hai inhe!\nAndar se bhi, bahar se bhi!\nAur yeh khud nahi maante - tab bhi!"\n\nMashaAllah! 🌟 Believe in yourself! 💪`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 37. MERA HERO COMMAND
// ============================================
cmd({
  pattern: "merahero",
  alias: ["hero", "savior"],
  desc: "Find today's group hero",
  react: "🦸",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🦸 AAJ KA GROUP HERO! 🦸\n\nSuperhero Music Plays 🎵\n\nAaj ka OFFICIAL GROUP HERO/HEROINE:\n\n⚡ ${t} ⚡\n\nSuperpowers:\n💬 Boring conversations ko fun banana\n😂 Sad mood ko khush karna\n🎯 Sahi waqt pe sahi baat kehna\n❤️ Group ko pyaar se bharpur rakhna\n\nThank you for being our hero!\n\nCape pehno! 🦸🎊`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 38. NATKHAT COMMAND
// ============================================
cmd({
  pattern: "natkhat",
  alias: ["mischief", "shararat2"],
  desc: "Find most mischievous person",
  react: "😜",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `😜 NATKHAT AWARD! 😜\n\nGroup ka sabse Natkhat:\n\n${t} 🏆\n\nInka crime record:\n😜 Log serious baar pe funny baat - Guilty ✅\n😂 Kisi ki taarif ke beech mein mazaak - Guilty ✅\n🙃 Serious mood kharaab karna - Guilty ✅\n😅 Khud toh hans le, doosron ko confuse kare - Guilty ✅\n\nSentence:\nGroup ko aur zyada hasaate raho! 😂❤️\n\nTumhare bina group phika hai! 🌶️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 39. PARESHAN COMMAND
// ============================================
cmd({
  pattern: "pareshan",
  alias: ["worried", "tension"],
  desc: "Find the biggest worrier",
  react: "😰",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `😰 PARESHAAN AWARD! 😰\n\nGroup ka Sabse PARESHAAN REHNE WALA/WALI:\n\n${t} 🏆\n\nInka daily pareshani schedule:\n\n😰 Subah: "Aaj kya hoga?"\n😟 Dopahar: "Kya woh mujhse naraaz hain?"\n😱 Shaam: "Maine kuch galat toh nahi kaha?"\n😭 Raat: "Sab theek hai na?"\n\nPar yeh jo care karte/karti hain,\nyahi inhe special banata hai!\n\nSab theek hai! Allah pe bharosa rakho! 🤲💖`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 40. INTERVIEW COMMAND
// ============================================
cmd({
  pattern: "interview",
  alias: ["hireornot", "qanda"],
  desc: "Love interest interview style",
  react: "📋",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `📋 LOVE INTERVIEW! 📋\n\nInterviewer: Tum\nCandidate: ${t}\n\nQuestions:\n\nQ1: "Apne aap ke baare mein batao?"\nQ2: "Raat ko 2 baje call karoon toh kya karo ge/gi?"\nQ3: "Kisi ko ignore karte/karti ho kya?"\nQ4: "Pyaar mein loyalty ka kya matlab hai?"\nQ5: "5 saal baad khud ko kahan dekhte/dekhti ho?"\n\nPanel ka verdict: ✅ HIRED FOR DOST LEVEL!\nNext promotion: Khaas Dost 😂💕\n\nInhei dil se liya gaya interview mein! 😂❤️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 41. KHEL TAMAM COMMAND
// ============================================
cmd({
  pattern: "kheltamam",
  alias: ["gameover", "tamam"],
  desc: "Game over in love drama",
  react: "💔",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `💔 KHEL TAMAM! 💔\n\n${t} ne aaj\nTum ka KHEL TAMAM kar diya!\n\nKaise?\n\nScenario:\nTum: "Good Morning!"\n${t}: "Hm."\n\n😭 Ek ghante ki mehnat,\n1 word mein khatam!\n\n"Hm" - yeh do haroof se dil toot gaya! 💔\n\n${t} thoda aur type karo yaar! 😂❤️`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 42. RISHTA PAKKA COMMAND
// ============================================
cmd({
  pattern: "rishtapakka",
  alias: ["engaged", "mangni"],
  desc: "Engagement drama in group",
  react: "💍",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `💍 RISHTA PAKKA COMMITTEE! 💍\n\nIs group ne milke faislah kiya:\n\n${t} + ${t}\n\n= RISHTA PAKKA! 🎊\n\nCommittee ka analysis:\n✅ Dono group mein active hain\n✅ Dono ki personality match karti hai\n✅ Dono ek doosre ke jokes pe haste hain\n✅ Dono perfect nakhrebaaz hain\n\nSagai ki meethai dono taraf se chahiye! 🍬😂\n\nMubarak ho dono ko! 💕`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 43. PYAAR KI DUKAAN COMMAND
// ============================================
cmd({
  pattern: "pyaardukaan",
  alias: ["loveshop", "dildukaan"],
  desc: "Buy from love shop",
  react: "🏪",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const items = [
    { item: "1 kg Wafa", price: "Ek sachchi muskaan" },
    { item: "500g Mohabbat", price: "Ek honest reply" },
    { item: "1 bottle Sabr", price: "2 ghante wait karna" },
    { item: "Sachcha Rishta Pack", price: "Apna ego chhod do" },
    { item: "Pyaar ka Combo", price: "Sirf teri ek haan" },
  ];
  const chosen = items[Math.floor(Math.random() * items.length)];
  
  await conn.sendMessage(mek.chat, {
    text: `🏪 PYAAR KI DUKAAN! 🏪\n\nTum ne aaj order kiya:\n\n🛍️ Item: ${chosen.item}\n💰 Price: ${chosen.price}\n\nOrder Status: PROCESSING... ⏳\n\nDelivery time: Jab dono tayaar hon!\n\nNote: Yeh dukaan ek baar visit karo,\nZindagi bhar ke liye delivery hogi! 😂💕\n\nOrder accepted! 🎊`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 44. ZABAAN SAMBHALNA COMMAND
// ============================================
cmd({
  pattern: "zabaansambhlo",
  alias: ["watchwords", "muh"],
  desc: "Watch your words warning",
  react: "👄",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `👄 ZABAAN SAMBHALNA YAAD DILAYA! 👄\n\nTum ne ${t} ko\nnasehat di:\n\n"Yaar zabaan sambhala karo!\nJo bolte ho - yaad rehta hai!\nJo likhte ho - screenshot hota hai!\nJo commit karte ho - nibhaana padta hai!\n\nLekin kuch lafz aisa keh do ke,\nLog hamesha yaad rakhein,\nKhushiyon wale lafz!\n\nKyunke tum jo bhi bolte/bolti ho,\nDono per effect hota hai!"\n\n❤️ Pyaar se kaho, pyaar milega! 🌹`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 45. JHOOTHA WADA COMMAND
// ============================================
cmd({
  pattern: "jhootawada",
  alias: ["brokenpromise", "wada"],
  desc: "Expose broken promise maker",
  react: "🤥",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🤥 JHOOTA WADA EXPOSED! 🤥\n\n${t} ke famous wade:\n\n❌ "Kal zaroor reply karunga/karungi" - 3 din gaye\n❌ "Main hamesha saath hoon" - aur fir ghaib!\n❌ "Tujhe kabhi chhodunga/chohdungi nahi" - classical 😂\n❌ "Seedha baat karunga/karungi" - kabhi nahi kiya\n\nTum gawah hai! 😂\n\nPar sachchi baat yeh hai ke:\nKoi perfect nahi hota!\nMaafi maango aur naya wada karo! ❤️\n\nIs baar wada nibhaao! 💪`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 46. SONA WALA COMMAND
// ============================================
cmd({
  pattern: "sonawala",
  alias: ["precious", "heera"],
  desc: "Most precious person in group",
  react: "💛",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `💛 SONA INSAAN! 💛\n\nIs group ka SABSE SONA INSAAN:\n\n${t} ✨\n\nKyu sona hain yeh?\n\n💛 Kabhi kisi ko bura nahi bol sakte/sakti\n💛 Sab ki baat dhyan se sunte/sunti hain\n💛 Mushkil mein pehle dusron ke baare mein soochte/soochti hain\n💛 Group mein hamesha positivity laate/laati hain\n\nAisa insaan toh heera hai,\nQismat wale ko milta hai! 💎\n\nAllah tumhe salamat rakhe! 🤲`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 47. GOSSIP COMMAND
// ============================================
cmd({
  pattern: "gossip",
  alias: ["charcha", "khabar"],
  desc: "Share group gossip",
  react: "🗣️",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const gossips = [
    `🗣️ GROUP GOSSIP! 🗣️\n\nPsst... Suno suno!\n\nKisi reliable source se khabar aayi hai ke:\n\n${t} actually group mein sabko like karte/karti hain!\nHaan bhai/behan,\nWoh jo "main kisi ki parwah nahi karta/karti" wala act hai,\nBILKUL JHOOT HAI! 😂\n\nYeh toh group ke sabse caring member hain!\n\nSource: 100% reliable! 😂💕`,
    `🗣️ BREAKING GOSSIP! 🗣️\n\nAaj ki sabse badi khabar:\n\n${t} roz group check karte/karti hain!\nAur sab ke messages padhte/padhti hain!\nLekin reply sirf tab karte/karti hain jab mood ho!\n\nYeh khabar sachchi hai kyunke:\nHum bhi yahi karte hain! 😂💀\n\nKoi gossip nahi, sab ek jaise hain! ❤️`
  ];
  
  await conn.sendMessage(mek.chat, { 
    text: gossips[Math.floor(Math.random() * gossips.length)], 
    mentions: tm 
  }, { quoted: mek });
});

// ============================================
// 48. FUNNY RISHTEDAR COMMAND
// ============================================
cmd({
  pattern: "funnyrishtedar",
  alias: ["relative", "rishtedaar"],
  desc: "Make someone funny relative",
  react: "👨‍👩‍👧‍👦",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  const relations = [
    { rel: "Pagal Chacha/Chachi", desc: "Har waqt advice dete hain jo kisi ne nahi maangi!" },
    { rel: "Dramatic Bhai/Behan", desc: "Choti si baat pe bhi movie scene ban jaata hai!" },
    { rel: "Cool Maamu/Maami", desc: "Sabse zyada samajhdar aur sabse zyada fun!" },
    { rel: "Nakhrebaaz Cousin", desc: "Har cheez mein nakhre, par dil ka sachcha!" }
  ];
  const chosen = relations[Math.floor(Math.random() * relations.length)];
  
  await conn.sendMessage(mek.chat, {
    text: `👨‍👩‍👧‍👦 FAMILY REVEAL! 👨‍👩‍👧‍👦\n\nTum ka group family mein:\n\n${t} hai inke:\n\n${chosen.rel} 😂\n\nKyun? Kyunke:\n"${chosen.desc}"\n\nPar family family hoti hai!\nPyaar karo sabko! 😂❤️\n\nGroup = Hamari Family! 👨‍👩‍👧‍👦`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 49. AANKHEIN BAND KAR COMMAND
// ============================================
cmd({
  pattern: "aankheband",
  alias: ["trustfall", "blindtrust"],
  desc: "Trust test with closed eyes",
  react: "🙈",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `🙈 TRUST TEST! 🙈\n\nAaj ka Trust Game:\n\nTum ne aankhein band ki\naur ${t} pe TRUST kiya!\n\nScenario:\n"Aankhein band hain,\nHaath age badhaya,\nAur keh diya:\n'Main tumpe trust karta/karti hoon!'"\n\n${t} ka reaction:\n\nOption A: Haath thaam liya ❤️\nOption B: Bol diya "Oops wrong person!" 😂\n\nGroup ko batao ${t}!\nKya choose kiya? 👀😂`,
    mentions: tm
  }, { quoted: mek });
});

// ============================================
// 50. ALVIDA NAHI KEHNA COMMAND
// ============================================
cmd({
  pattern: "alvidanahi",
  alias: ["nodisconnect", "hamesha"],
  desc: "Promise to never say goodbye",
  react: "♾️",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  if (!mek.chat.endsWith('@g.us')) return reply("❌ This command only works in groups!");
  const target = await pickTarget(conn, mek, m);
  const t = target ? '@' + target.split('@')[0] : 'woh shaks';
  const tm = target ? [target] : [];
  
  await conn.sendMessage(mek.chat, {
    text: `♾️ ALVIDA NAHI KEHNA! ♾️\n\nTum ne ${t} se\npoori group ke saamne wada kiya:\n\n"Main tujhe ALVIDA nahi kahunga/kahungi!\n\nChahe koi baat ho jaaye,\nChahe beech mein khamoshi aaye,\nChahe raaste alag ho jaayein,\n\nMain group mein hamesha\ntumhara naam leke yaad karunga/karungi!\nKyunke kuch rishte alvida ke baad bhi\nNahi jaate!"\n\n😭 Poori group emotional ho gayi! 😭\n\nYahi sacchi dosti hai! ♾️❤️`,
    mentions: tm
  }, { quoted: mek });
});








// ============================================
// 1. PERSONALITY TEST
// ============================================
cmd({
  pattern: "personalitytest",
  alias: ["mytype", "konsa"],
  desc: "Find out your personality type",
  react: "🧬",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const types = [
      `🧬 *TUMHARI PERSONALITY: THE LEADER* 👑\n\nTum natural leader ho!\nLog tumhare peeche chalnaa pasand karte hain.\nTum decisions fast lete/leti ho.\nChallenges tumhe excite karte hain!\n\n*Weakness:* Kabhi kabhi zyada controlling ho jaate/jaati ho 😅`,
      `🧬 *TUMHARI PERSONALITY: THE DREAMER* 🌙\n\nTum creative aur imaginative ho!\nDuniya tumhe alag nazar aati hai.\nTum jo soochte/soochti ho woh koi nahi soochta.\n\n*Weakness:* Reality se thoda door rehte/rehti ho 😂`,
      `🧬 *TUMHARI PERSONALITY: THE CARETAKER* 💛\n\nTum sabka khayal rakhte/rakhti ho!\nTumhare liye dusron ki khushi pehle hai.\nLog tumse baat karke better feel karte hain.\n\n*Weakness:* Khud ko bhool jaate/jaati ho 🥺`,
      `🧬 *TUMHARI PERSONALITY: THE REBEL* 🔥\n\nTum rules todne mein believe karte/karti ho!\nTumhe koi rok nahi sakta.\nTum apni marzi ke malik/malkin ho.\n\n*Weakness:* Kabhi kabhi bahut stubborn ho jaate/jaati ho 😤`,
      `🧬 *TUMHARI PERSONALITY: THE THINKER* 🧠\n\nTum pehle soochte/soochti ho, phir bolte/bolti ho!\nHar cheez ka analysis karte/karti ho.\nTumhari logic level: MAXIMUM\n\n*Weakness:* Overthinking tumhari hobby hai 😂`
    ];
    reply(types[Math.floor(Math.random() * types.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 2. SUPER POWER
// ============================================
cmd({
  pattern: "superpower",
  alias: ["meripower", "ability"],
  desc: "Discover your hidden superpower",
  react: "⚡",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const powers = [
      `⚡ *TUMHARI SUPERPOWER!* ⚡\n\n🦸 *TIME FREEZE*\n\nTum waqt rok sakte/sakti ho!\n\nReal life mein proof:\n✅ Deadline aate aate kaam karte/karti ho\n✅ "Bas 5 minute" mein ghante guzarte hain\n✅ Time management: ZERO 😂\n\nPar yeh power sirf tumhare paas hai!`,
      `⚡ *TUMHARI SUPERPOWER!* ⚡\n\n🦸 *MIND READING*\n\nTum logon ke dil ki baat jaante/jaanti ho!\n\nProof:\n✅ Pata chal jaata hai kaun jhooth bol raha hai\n✅ Mood pehle se samajh jaate/jaati ho\n✅ "Main jaanta/jaanti tha/thi" aksar sach hota hai 😎`,
      `⚡ *TUMHARI SUPERPOWER!* ⚡\n\n🦸 *INVISIBILITY*\n\nTum jab chahon ghaib ho sakte/sakti ho!\n\nProof:\n✅ Group mein chup rehte/rehti ho\n✅ Online ho par dikh nahi rahe/rahi\n✅ "Last seen" ka misuse expert 😂`,
      `⚡ *TUMHARI SUPERPOWER!* ⚡\n\n🦸 *ENERGY TRANSFER*\n\nTum logon ko energize kar sakte/sakti ho!\n\nProof:\n✅ Tumhari ek baat se dil khush hota hai\n✅ Tumhare aane se mahol badal jaata hai\n✅ Log tumse milke better feel karte hain 💛`
    ];
    reply(powers[Math.floor(Math.random() * powers.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 3. PAST LIFE
// ============================================
cmd({
  pattern: "pastlife",
  alias: ["pichlajanm", "aagla"],
  desc: "Who were you in your past life (fun)",
  react: "🔮",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const lives = [
      `🔮 *PICHLE JANAM MEIN TUM THE...* 🔮\n\n👑 *BADSHAH/MALIKA!*\n\nTum ek ameer aur taaqatwar insaan the/thi!\nPoori duniya tumhari hukm maanti thi!\nIsliye is janam mein bhi attitude rehta hai! 😂👑`,
      `🔮 *PICHLE JANAM MEIN TUM THE...* 🔮\n\n🌊 *DARYA KA SAILOR!*\n\nTum samundar ke raaz jaante/jaanti the/thi!\nZindagi mein hamesha aage badhna pasand tha!\nIs janam mein bhi adventure pasand hai! ⚓`,
      `🔮 *PICHLE JANAM MEIN TUM THE...* 🔮\n\n📚 *BUZURG AALIM/AALIMA!*\n\nTum duniya ke mahaan scholar the/thi!\nHar sawaal ka jawab tumhare paas tha!\nIs janam mein bhi sab se wise ho! 🧠`,
      `🔮 *PICHLE JANAM MEIN TUM THE...* 🔮\n\n🎭 *MASHOOR SHAYAR/SHAYARA!*\n\nTumhare alfaaz logon ke dil chhoo lete the!\nTumhari shayari legends mein thi!\nIs janam mein bhi romantic nature hai! 🌹`
    ];
    reply(lives[Math.floor(Math.random() * lives.length)] + `\n\n*Yeh sab mazaak hai - asli ilm Allah ke paas!* 😂🤲`);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 4. DARK SECRET
// ============================================
cmd({
  pattern: "darksecret",
  alias: ["chhuparaaz", "secret2"],
  desc: "Reveal your funny dark secret",
  react: "🕵️",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const secrets = [
      `🕵️ *TUMHARA DARK SECRET!* 🕵️\n\n*Bot ne scan kiya aur pata chala:*\n\nTum akele mein khud se baatein karte/karti ho!\nAur behas bhi khud se karte/karti ho!\nAur khud hi jeette/jeetti bhi ho! 😂\n\n*Yeh pagalpan nahi - creativity hai!* 🧠`,
      `🕵️ *TUMHARA DARK SECRET!* 🕵️\n\n*Exposed!*\n\nTum apne phone ko baar baar unlock karte/karti ho,\nKuch khaas nahi hota screen pe,\nPar phir bhi check karte/karti ho!\nYeh addiction hai yaar! 📱😂`,
      `🕵️ *TUMHARA DARK SECRET!* 🕵️\n\n*Sach baat:*\n\nTum koi gaana suntay/sunti ho toh\nKhud ko stage pe imagine karte/karti ho!\nAur performance bhi dete/deti ho ghar mein akele! 🎤😂\n\n*Grammy winner in your mind!* 🏆`,
      `🕵️ *TUMHARA DARK SECRET!* 🕵️\n\n*Raaz faash!*\n\nTum kisi se baat karne se pehle\nPura script prepare karte/karti ho dimag mein!\nAur woh kabhi waise nahi hota!\nPar koshish jaari rehti hai! 😂🧠`
    ];
    reply(secrets[Math.floor(Math.random() * secrets.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 5. CELEBRITY MATCH
// ============================================
cmd({
  pattern: "celebmatch",
  alias: ["starmatch", "famousmatch"],
  desc: "Which celebrity are you like",
  react: "🌟",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const celebs = [
      `🌟 *TUMHARA CELEBRITY MATCH!* 🌟\n\nTum ho bilkul:\n\n*SHAHID AFRIDI* jaisa/jaisi! 🏏\n\nKyun?\n✅ Energy level: ALWAYS HIGH\n✅ Kabhi kabhi unpredictable\n✅ Dil ka sachcha\n✅ Jab form mein ho toh UNSTOPPABLE!\n\n*BOOM BOOM!* 💥`,
      `🌟 *TUMHARA CELEBRITY MATCH!* 🌟\n\nTum ho bilkul:\n\n*WASIM AKRAM* jaisa/jaisi! 🎯\n\nKyun?\n✅ Clever aur strategic\n✅ Pressure mein bhi best perform\n✅ Logo ko impress karne ka talent\n✅ Legend status incoming! 👑`,
      `🌟 *TUMHARA CELEBRITY MATCH!* 🌟\n\nTum ho bilkul:\n\n*ATIF ASLAM* jaisa/jaisi! 🎵\n\nKyun?\n✅ Dil mein music hai\n✅ Romantic nature\n✅ Log tumse inspire hote hain\n✅ Voice of the heart! ❤️`,
      `🌟 *TUMHARA CELEBRITY MATCH!* 🌟\n\nTum ho bilkul:\n\n*IMRAN KHAN* (cricketer) jaisa/jaisi! 🏆\n\nKyun?\n✅ Natural leader\n✅ Never give up attitude\n✅ Team ko inspire karte/karti ho\n✅ Champion material! 🥇`
    ];
    reply(celebs[Math.floor(Math.random() * celebs.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 6. LIFE BATTERY
// ============================================
cmd({
  pattern: "lifebattery",
  alias: ["battery", "energylevel"],
  desc: "Check your life battery percentage",
  react: "🔋",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const pct = Math.floor(Math.random() * 100) + 1;
    let status, tip;
    
    if (pct >= 80) { 
      status = "🟢 FULL CHARGED!"; 
      tip = "Aaj sab kuch karjao! Energy mast hai!"; 
    } else if (pct >= 50) { 
      status = "🟡 MEDIUM CHARGE"; 
      tip = "Chai piyo aur charge boost karo!"; 
    } else if (pct >= 20) { 
      status = "🟠 LOW BATTERY!"; 
      tip = "Thoda rest karo - recharge zaroori!"; 
    } else { 
      status = "🔴 CRITICAL! CHARGING NEEDED!"; 
      tip = "Neend, khana, chai - ABHI!"; 
    }

    reply(`🔋 *LIFE BATTERY CHECK* 🔋\n\n${"█".repeat(Math.floor(pct/10))}${"░".repeat(10-Math.floor(pct/10))} ${pct}%\n\nStatus: *${status}*\n\n💡 Tip: ${tip}\n\n> *By BOT* 🤖`);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 7. DESI MOM QUOTES
// ============================================
cmd({
  pattern: "desimom",
  alias: ["ammi", "momquote"],
  desc: "Famous desi mom quotes",
  react: "👩",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const quotes = [
      `👩 *AMMI KA KHAAS QAUL!* 👩\n\n*"Main tujhe paida karte waqt itna nahi taka,\nJitna tu mujhe roz thakata hai!"*\n\n😂 Har ammi ka classic! 💀`,
      `👩 *AMMI KA QUOTE!* 👩\n\n*"Mujhe nahi pata kaun ne kiya,\nBas tum sab ne kiya!"*\n\n😂 Even if you weren't home! 💀`,
      `👩 *AMMI KI WARNING!* 👩\n\n*"Teri abbu se baat karata hoon!\nAur woh bhi meri taraf se baat karenge!"*\n\n😂 Double trouble incoming! 💀`,
      `👩 *AMMI KA FAISLA!* 👩\n\n*"Yeh mobile band kar!\nAnkhein kharaab ho jaayengi!\nMaine 40 saal pehle kaha tha!"*\n\n(Mobile 30 saal pehle tha hi nahi) 😂💀`,
      `👩 *AMMI KI DHAMKI!* 👩\n\n*"Agar ghar ki taraf se gaya/gayi\ntoh seedha hospital jaata/jaati hoon!\nYeh ghar nahi hospital hai!"*\n\n😂 Desi logic at its finest! 💀`
    ];
    reply(quotes[Math.floor(Math.random() * quotes.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 8. DESI DAD QUOTES
// ============================================
cmd({
  pattern: "desidad",
  alias: ["abbu", "dadquote"],
  desc: "Famous desi dad quotes",
  react: "👨",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const quotes = [
      `👨 *ABBU KA GOLDEN QUOTE!* 👨\n\n*"Hamare zamaane mein bhi yahi hota tha,\nPar hum phone pe nahi karte the!\nHum seedha jaate the!"*\n\n(Abbu ke zamaane mein koi bhi nahi jaata tha) 😂`,
      `👨 *ABBU KI ECONOMICS!* 👨\n\n*"Bijli ka bill dekha?\nYeh sab tumhara charger hai!\nCharger band karo - Pakistan bachao!"*\n\n😂 National duty! 💀`,
      `👨 *ABBU KA CAREER ADVICE!* 👨\n\n*"Doctor bano ya Engineer!\nBaaki sab bekar hai!\nYeh drawing sherawing se paisa nahi milta!"*\n\n😂 Every desi dad ever! 💀`,
      `👨 *ABBU KA DRIVING LESSON!* 👨\n\n*"Main keh raha hoon gear daal!\nBreak kab daali?\nMujhe pata hai drive kaise karte hain!\n30 saal se kar raha hoon!"*\n\n*[5 seconds later: accident almost]* 😂💀`
    ];
    reply(quotes[Math.floor(Math.random() * quotes.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 9. KHANA JUDGE
// ============================================
cmd({
  pattern: "khanajudge",
  alias: ["foodjudge", "khanacheck"],
  desc: "Rate your food choices today",
  react: "🍛",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const foods = [
      `🍛 *AAJ KA KHANA VERDICT!* 🍛\n\nBot ne scan kiya aur bataya:\n\nAaj tum khaoge/khao gi:\n\n🍽️ *BIRYANI* + *RAITA* + *SALAD*\n\nRating: ⭐⭐⭐⭐⭐\n\n*"Yeh khana khane wala lucky hota hai!\nBiryani = Zindagi ka matlab!"* 😂❤️`,
      `🍛 *KHANA SCAN!* 🍛\n\nAaj ki plate mein hoga:\n\n🍽️ *DAAL CHAWAL* + *ACHAR*\n\nRating: ⭐⭐⭐⭐\n\n*"Simple lekin powerful!\nGhar ka khana - jannaat ka darwaza!"* 😂🏠`,
      `🍛 *FOOD REPORT!* 🍛\n\nBot ki prediction:\n\n🍽️ *PARATHA* + *CHAI* + *ANDA*\n\nRating: ⭐⭐⭐⭐⭐ LEGENDARY!\n\n*"Yeh combo jo khaye,\nWoh insaan khooshqismat hai!\nDesi breakfast = Life!"* 😂☕`
    ];
    reply(foods[Math.floor(Math.random() * foods.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 10. RISHTA AUNTY
// ============================================
cmd({
  pattern: "rishtaaunt",
  alias: ["auntyjee", "rishtawali"],
  desc: "Rishta aunty style roast",
  react: "👒",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const msgs = [
      `👒 *RISHTA AUNTY SPEAKING!* 👒\n\n*"Beta/Beti, umar kya hai?\nJob hai?\nGhar hai?\nGaadi hai?\nAmmi abbu theek hain?\nKitne bhai behan hain?\nPata kya hai?\nBiryani banana aata hai?\n\nAcha acha... main sochti hoon!"*\n\n😂 Interrogation complete! 💀`,
      `👒 *AUNTY JEE ALERT!* 👒\n\n*"Main teri ammi ki dost hoon!\nMujhe pata hai sab kuch!\nTu bahut patla/patli hai!\nKhata/khati nahi kya?\nYeh nahi chalega rishte mein!"*\n\n😂 Aunty roast: SAVAGE! 💀`,
      `👒 *RISHTA VERDICT!* 👒\n\nAunty jee ka final assessment:\n\n✅ Chehra: Theek hai\n✅ Qad: Dekha jayega\n❌ Rang: Thoda aur hona chahiye tha\n❌ Mobile: Bahut zyada use karta/karti hai\n\n*"Main doosra rishta dhundh ti hoon!"* 😂💀`
    ];
    reply(msgs[Math.floor(Math.random() * msgs.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// Continue with remaining 40 commands...
// Due to length, I'll provide them in batches

// ============================================
// 11-20 COMMANDS
// ============================================

cmd({
  pattern: "challenge",
  alias: ["dailychallenge", "aajkachallenge"],
  desc: "Get a fun daily challenge",
  react: "🎯",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const challenges = [
      `🎯 *AAJ KA CHALLENGE!* 🎯\n\n*"1 ghante ke liye mobile mat dekho!"*\n\nDifficulty: ████████░░ HARD\n\nReward: Nazar theek rahegi 👀\nPenalty: Withdrawal symptoms 😂\n\n*Kya kar sakte/sakti ho?* 💪`,
      `🎯 *CHALLENGE ACCEPTED?* 🎯\n\n*"Aaj kisi ek dost ko bina wajah call karo aur poochho - kaisa hai?"*\n\nDifficulty: ███░░░░░░░ EASY\n\nReward: Dosti mazboot hogi 💛\n\n*Simple lekin valuable!* ❤️`,
      `🎯 *FUN CHALLENGE!* 🎯\n\n*"Aaj koi naya gaana seekho ya koi naya kaam karo jo pehle nahi kiya!"*\n\nDifficulty: █████░░░░░ MEDIUM\n\nReward: Naya skill! 🌟\n\n*Zindagi mein kuch naya zaroori hai!* 🚀`,
      `🎯 *HEALTH CHALLENGE!* 🎯\n\n*"Aaj 8 glass paani piyo aur 20 minute walk karo!"*\n\nDifficulty: ████░░░░░░ MEDIUM\n\nReward: Body feels amazing 💪\n\n*Sehat hai toh sab hai!* 🤲`
    ];
    reply(challenges[Math.floor(Math.random() * challenges.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

cmd({
  pattern: "friendtype",
  alias: ["kayadost", "dosttype"],
  desc: "What kind of friend are you",
  react: "👥",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const types = [
      `👥 *TUMHARA DOST TYPE!* 👥\n\n🏆 *THE FIXER*\n\nKoi bhi masla aaye - tum solve karte/karti ho!\nLog tumse hi madad maangne aate hain!\nTum group ke unofficial advisor ho!\n\n*Downside: Apna masla solve karna bhool jaate/jaati ho!* 😂`,
      `👥 *TUMHARA DOST TYPE!* 👥\n\n😂 *THE ENTERTAINER*\n\nTum group ki jaan ho!\nBoring moment? Tum fix karte/karti ho!\nHar jagah tumhari entry se raunaq hoti hai!\n\n*Downside: Log serious baat tumse nahi karte!* 😂`,
      `👥 *TUMHARA DOST TYPE!* 👥\n\n👂 *THE LISTENER*\n\nLog tumse dil ki baat karte hain!\nTum judge nahi karte/karti!\nTumhara saath feel karna safe lagta hai!\n\n*Downside: Tum khud kisi ko nahi batate/batati!* 🥺`,
      `👥 *TUMHARA DOST TYPE!* 👥\n\n🌪️ *THE CHAOS AGENT*\n\nJahan tum wahan excitement!\nPlans hamesha last minute bante hain!\nAdventure tumhara middle name hai!\n\n*Downside: Kabhi kabhi bahut thaka dete/deti ho!* 😂`
    ];
    reply(types[Math.floor(Math.random() * types.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// Continue pattern for all remaining commands...




// ============================================
// 13. PAKORA WEATHER
// ============================================
cmd({
  pattern: "pakoraweather",
  alias: ["pakora", "baarish"],
  desc: "Pakora weather check",
  react: "🌧️",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const msgs = [
      `🌧️ *PAKORA WEATHER ALERT!* 🌧️\n\nBot ne weather check kiya:\n\n☁️ Baadal: HA!\n🌧️ Baarish: AA RAHI HAI!\n🌡️ Temperature: PAKORA LEVEL!\n\n*OFFICIAL RECOMMENDATION:*\n\n🫕 Pakore banao - FORAN!\n☕ Chai ready karo!\n📺 TV on karo!\n🛋️ Sofa pe baitho!\n\n*Yeh waqt baar baar nahi aata!* 😂🇵🇰`,
      `🌧️ *BAARISH KA MAUSAM!* 🌧️\n\nPakistan Weather Bot Report:\n\nAaj ka actual temperature:\n*"Chai + Pakore + Geela Mitti Ki Khushboo"*\n\n🌡️ Feelings Level: NOSTALGIC MAX!\n\n*Ghar walo ko call karo!\nSaath baitho aur chai piyo!* ❤️☕`
    ];
    reply(msgs[Math.floor(Math.random() * msgs.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 14. RESULT ANNOUNCEMENT
// ============================================
cmd({
  pattern: "result",
  alias: ["natijacheck", "resultaaya"],
  desc: "Funny student result reactions",
  react: "📊",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const marks = Math.floor(Math.random() * 100) + 1;
    let reaction;
    
    if (marks >= 90) {
      reaction = `🥳 *TOPPER!*\nAmmi khush!\nAbbu: "Hm... theek hai"\nRishtay aa gaye! 😂`;
    } else if (marks >= 70) {
      reaction = `😊 *THEEK THAAK!*\nAmmi: "Aur mehnath karo"\nAbbu: "Apne chacha ka beta 95% laya"\n😂 Classic!`;
    } else if (marks >= 50) {
      reaction = `😬 *PASS TOH HO!*\nAmmi: "Allah ka shukar"\nAbbu: "Agli baar improve karna"\nTum: "Jee abbu..." 😂`;
    } else {
      reaction = `😱 *FAIL!*\nResult chhupaana padega!\nPhone lock karna padega!\nGhar se bhaagna padega! 😂💀\nPar himmat rakhna - ek baar fail != hamesha fail!`;
    }

    reply(`📊 *RESULT ANNOUNCEMENT!* 📊\n\nBot ka prediction:\n\n*Marks: ${marks}/100*\n\n${reaction}\n\n*Yeh sab fun hai - real mein mehnath karo!* 💪`);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 15. CRICKET COMMENTARY
// ============================================
cmd({
  pattern: "cricketcomm",
  alias: ["commentary", "cricket"],
  desc: "Funny Pakistan cricket style commentary",
  react: "🏏",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const comms = [
      `🏏 *LIVE COMMENTARY!* 🏏\n\n*"Aur yahan tumhari life mein ek ahem waqt!\nTum ne message bheja - double tick!\nWoh online - par reply nahi!\n\nYahan se koi comeback possible hai?\nCommentator: MUSHKIL NAZAR AA RAHI HAI!"\n\n😂 Pakistan cricket vibes! 🇵🇰`,
      `🏏 *BREAKING COMMENTARY!* 🏏\n\n*"Aur last over mein!\nNeend aa rahi thi!\nPar mobile ne notification diya!\nAur tumne check kiya!\n\nYeh selfless dedication hai\nYa mobile addiction?\n\nCommentator ke mutabiq: DONO!"\n\n😂💀`,
      `🏏 *CRICKET COMMENTARY!* 🏏\n\n*"Aaj ka match:\nTum vs Monday!\n\nFirst over: Neend nahi aayi\nSecond over: Alarm snooze\nThird over: Late ho gaye\nFinal result: Monday jeet gaya!\n\nPakistan ki tarah comeback ki umeed hai kal!"\n\n😂🏏`
    ];
    reply(comms[Math.floor(Math.random() * comms.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 16. MARRIAGE PREDICTION
// ============================================
cmd({
  pattern: "shadiprediction",
  alias: ["shadi1", "marriagepred"],
  desc: "Funny marriage prediction",
  react: "💍",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const years = Math.floor(Math.random() * 10) + 1;
    const types = [
      "Love Marriage 💕 (Ammi ko pata baad mein chalega)",
      "Arranged Marriage 👒 (Rishta aunty ka karnama)",
      "Surprise Marriage 😱 (Khud bhi nahi pata tha)",
      "Group Admin Marriage 📱 (WhatsApp group mein mila/mili)"
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    
    reply(`💍 *SHADI KI PREDICTION!* 💍\n\nBot ne calculate kiya:\n\n📅 *${years} saal baad shadi hogi!*\n\n💒 *Type:* ${type}\n\n🎊 *Honeymoon Location:* Murree (classic desi)\n\n*Dua hai ke jab bhi ho - khushiyon wali ho!* 🤲\n\n*Yeh mazaak hai - asli waqt Allah ke haath!* 😂`);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 17. STRESS LEVEL
// ============================================
cmd({
  pattern: "stresslevel",
  alias: ["tension", "stress"],
  desc: "Check your current stress level",
  react: "😰",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const pct = Math.floor(Math.random() * 100) + 1;
    let msg;
    
    if (pct >= 80) {
      msg = `😱 *CRITICAL STRESS!*\n\nKya kar rahe/rahi ho yaar!\nRuko, saanso lo!\nChay piyo!\nBaat karo kisi se!\nYeh sab guzar jaayega! 🤲`;
    } else if (pct >= 50) {
      msg = `😰 *MEDIUM STRESS!*\n\nThoda rest zaroori hai!\n15 minute ki walk karo!\nPhone rakho!\nKuch funny dekho! 😊`;
    } else {
      msg = `😌 *LOW STRESS - MAST HO!*\n\nZindagi ke saath chal rahe/rahi ho!\nYeh balance banaye rakhna!\nShukr karo Allah ka! 🤲`;
    }
    
    reply(`😰 *STRESS METER* 😰\n\n${"🔴".repeat(Math.floor(pct/20))}${"⚪".repeat(5-Math.floor(pct/20))} ${pct}%\n\n${msg}`);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 18. MOTIVATIONAL SLAP
// ============================================
cmd({
  pattern: "motivationalslap",
  alias: ["wakeupcall", "jhaanko"],
  desc: "Brutal honest motivational message",
  react: "👋",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const msgs = [
      `👋 *MOTIVATIONAL SLAP!* 👋\n\n*WAKE UP!*\n\nTum jo sapna dekh rahe/rahi ho,\nKoi aur usi par kaam kar raha/rahi hai!\n\nWoh fail bhi hoga/hogi aur seekhega/seekhegi,\nAur aage bhi nikle ga/niklegi!\n\n*Tum kab shuru karoge/karogi?!* 🔥`,
      `👋 *BRUTAL TRUTH SLAP!* 👋\n\n*Suno:*\n\n5 saal baad tum wahi honge/hongi\nJo aaj ke decisions banate/banati hain!\n\nAaj ki neend, aaj ka phone,\nAaj ki laziness - sab count hota hai!\n\n*Abhi utho - Abhi shuru karo!* 💪🔥`,
      `👋 *FRIENDLY SLAP!* 👋\n\n*Yaar, ek baat suno:*\n\nTumhara future tumse poochh raha/rahi hai:\n"Aaj tune mere liye kya kiya?"\n\nKya jawab doge/dogi?\n\n*1 chota kadam aaj hi uthao!* 🚀`
    ];
    reply(msgs[Math.floor(Math.random() * msgs.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 19. RANDOM WIKIPEDIA STYLE FACT
// ============================================
cmd({
  pattern: "wikifact",
  alias: ["knowledge", "ilm"],
  desc: "Random interesting knowledge fact",
  react: "📚",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const facts = [
      `📚 *AAJ KA ILM!* 📚\n\n*"Shaheen (Eagle) buland parvaz karta hai\nkyunke woh toofan se darta nahi!\nWoh toofan ka istemaal karta hai\naur aur upar urta hai!"\n\n🦅 Lesson: Mushkilat se bhago nahi - use karo!`,
      `📚 *INTERESTING FACT!* 📚\n\n*"Honeybee apni poori zindagi mein\nsirf ek chammach sher (1/12 teaspoon)\nshehad banana maykun hoti hai!"\n\n🐝 Lesson: Choti mehnat bhi qeemti hoti hai!`,
      `📚 *ILMI BAAT!* 📚\n\n*"Bamboo duniya ka sabse tez\nbarhne wala pouda hai!\nEk din mein 91 cm tak barh sakta hai!"\n\n🎋 Lesson: Sahi conditions mein koi bhi tezi se barh sakta hai!`,
      `📚 *SCIENCE FACT!* 📚\n\n*"Akhtaboot (Octopus) ke 3 dil,\n9 dimaag aur neela khoon hota hai!"\n\n🐙 Lesson: Alag hona weakness nahi, uniqueness hai!`
    ];
    reply(facts[Math.floor(Math.random() * facts.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 20. ANIME PERSONALITY
// ============================================
cmd({
  pattern: "animepersonality",
  alias: ["animetype", "anime"],
  desc: "Which anime character type are you",
  react: "⚔️",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const chars = [
      `⚔️ *TUMHARA ANIME TYPE!* ⚔️\n\n🔥 *THE MAIN CHARACTER!*\n\nTum story ke hero/heroine ho!\nKuch bhi ho - tum survive karte/karti ho!\nPower ups unexpected aate hain!\nHar arc mein aur strong bante/banti ho!\n\n*"Never give up" tumhara theme song!* 💪`,
      `⚔️ *ANIME CHARACTER TYPE!* ⚔️\n\n🧠 *THE STRATEGIST!*\n\nTum Shikamaru type ho - sab sochte/soochti ho!\nKoi direct fight nahi - smart play!\nAksar 10 kadam aage sochte/soochti ho!\n\n*"Too troublesome" lekin hamesha ready!* 😎`,
      `⚔️ *TUMHARA TYPE!* ⚔️\n\n💛 *THE LOYAL FRIEND!*\n\nTum dost ke liye kuch bhi karte/karti ho!\nBetrayal tumse hoti hi nahi!\nGroup ka emotional backbone ho tum!\n\n*"Nakama" hi sab kuch hai!* 💛`,
      `⚔️ *ANIME SCAN RESULT!* ⚔️\n\n😴 *THE SLEEPY GENIUS!*\n\nTum aksar neend mein rehte/rehti ho!\nPar jab kaam karo - LEGEND!\nHidden potential: OVER 9000!\n\n*Sote sote bhi class mein answer dete/deti ho!* 😂`
    ];
    reply(chars[Math.floor(Math.random() * chars.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 21. WEATHER MOOD
// ============================================
cmd({
  pattern: "weathermood",
  alias: ["mausam", "moodweather"],
  desc: "Your mood matches which weather",
  react: "🌤️",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const weathers = [
      `🌤️ *TUMHARA WEATHER MOOD!* 🌤️\n\n☀️ *SUNNY DAY*\n\nTum aaj bilkul dhoop jaisi ho!\nHar kisi ko warm feel dete/deti ho!\nTumhare aas paas sab roshan hai!\n\n*Sunshine energy!* 🌟`,
      `🌤️ *TUMHARA MOOD WEATHER!* 🌤️\n\n🌧️ *BAARISH KA DIN*\n\nAaj dil thoda bheega bheega hai!\nNostalgic thoughts aa rahe hain!\nPar baarish bhi zaroori hoti hai!\nPhoolon ke liye! 🌸\n\n*Yeh phase bhi guzar jaayega!*`,
      `🌤️ *WEATHER PERSONALITY!* 🌤️\n\n⛈️ *THUNDERSTORM*\n\nAaj energy level: EXPLOSIVE!\nKoi rokne wala nahi!\nBolt jaisi speed mein ho!\n\n*Channelize karo yeh energy!* ⚡💪`,
      `🌤️ *MOOD REPORT!* 🌤️\n\n🌈 *RAINBOW AFTER RAIN*\n\nTum mushkilaat ke baad aate/aati ho!\nHar dark cloud ke baad tum ho!\nDuniya tumse colorful hoti hai!\n\n*Rare aur beautiful!* 🌈`
    ];
    reply(weathers[Math.floor(Math.random() * weathers.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 22. TAUNTING MACHINE
// ============================================
cmd({
  pattern: "taunt",
  alias: ["totka", "chherhao"],
  desc: "Fun taunts to send to friends",
  react: "😏",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const taunts = [
      `😏 *READY-MADE TAUNT!* 😏\n\n*"Tum itne slow ho ke,\nTumhara internet bhi tumse tez hai!"*\n\n😂 Friend ko bhejo! 💀`,
      `😏 *SAVAGE TAUNT!* 😏\n\n*"Tum itna soochte/soochti ho ke,\nGoogle bhi tumse suggestions maangta!"*\n\n😂 Overthinking champion! 💀`,
      `😏 *LIGHT TAUNT!* 😏\n\n*"Tumhara reply aata hai itni der mein ke,\nMain message bhoolh jaata/jaati hoon!"*\n\n😂 Late replier ki life! 💀`,
      `😏 *FRIENDLY TAUNT!* 😏\n\n*"Tum online ho aur reply nahi karte/karti?\nYeh friendship nahi\nyeh human experiment hai!"*\n\n😂 Savage but relatable! 💀`
    ];
    reply(taunts[Math.floor(Math.random() * taunts.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 23. GHAR KA WIFI
// ============================================
cmd({
  pattern: "gharkawifi",
  alias: ["wifimood", "netcheck"],
  desc: "Desi home WiFi struggles",
  react: "📶",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const msgs = [
      `📶 *GHAR KA WIFI REPORT!* 📶\n\nAbbu ne password change kiya:\n\n*"padhlo_pehle_2024"*\n\n😂 Classic desi parental control!\n\nAur password maangne par:\n*"Pehle homework karo!"* 💀`,
      `📶 *WIFI STRUGGLE!* 📶\n\n*Kitchen mein:* ████░░ 4 bars\n*Drawing room:* ██░░░░ 2 bars\n*Apna kamra:* █░░░░░ 1 bar\n*Bathroom:* ░░░░░░ No signal\n\n*Isliye sab kitchen mein rehte hain!* 😂`,
      `📶 *DESI NET LIFE!* 📶\n\n*Tumhara plan:* Unlimited\n*Reality:* Buffer buffer buffer\n\nVideo call mein:\n*"Hello? Sun raha/rahi ho? Connectivity iss-"*\n[Call drops]\n\n*Har Pakistani ki story!* 😂🇵🇰`
    ];
    reply(msgs[Math.floor(Math.random() * msgs.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 24. LOVE CALCULATOR 2.0
// ============================================
cmd({
  pattern: "lovecalc2",
  alias: ["ishqcalc", "pyaarcalc"],
  desc: "Advanced funny love calculator",
  react: "💘",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply, args }) => {
  try {
    if (!args[0]) {
      return reply(`💘 *LOVE CALCULATOR 2.0*\n\nUsage: .lovecalc2 [Name]\nExample: .lovecalc2 Ahmed\n\nApna naam ya kisi ka naam likhو!`);
    }
    
    const name = args.join(" ");
    const pct = Math.floor(Math.random() * 100) + 1;
    let verdict;
    
    if (pct >= 80) {
      verdict = `💯 *SOULMATE LEVEL!*\nYeh rishta jannat mein bana hai!\nDono ka combo: LEGENDARY! 🔥`;
    } else if (pct >= 60) {
      verdict = `💕 *STRONG MATCH!*\nKafi acha connection hai!\nThodi aur koshish se kamaal hoga!`;
    } else if (pct >= 40) {
      verdict = `😊 *AVERAGE MATCH!*\nDosti acchi hai!\nPyaar mein time lagega! 😂`;
    } else {
      verdict = `😅 *WEAK MATCH!*\nYaar koi aur dhundho!\nYeh wala kaam nahi karega! 😂💀`;
    }
    
    reply(`💘 *LOVE CALCULATOR 2.0* 💘\n\n❤️ + *${name}*\n\nResult: *${pct}%*\n\n${"❤️".repeat(Math.floor(pct/20))}${"🤍".repeat(5-Math.floor(pct/20))}\n\n${verdict}\n\n*Yeh sab fun hai!* 😂`);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 25. DUNIYA KI PROBLEMS
// ============================================
cmd({
  pattern: "problems",
  alias: ["musalay", "issues"],
  desc: "Funny list of real life problems",
  react: "😩",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const probs = [
      `😩 *REAL LIFE PROBLEMS 2024!* 😩\n\n1. Mobile ki battery - hamesha low\n2. Sleep schedule - complete gaya\n3. Reply - ghanton baad aata hai\n4. Khaana - garam aur ready nahi hota\n5. Monday - aata rehta hai\n6. Paisa - hamesha kam padta hai\n7. Internet - kabhi achi speed nahi\n\n*Par zindagi phir bhi chaal rahi hai!* 😂❤️`,
      `😩 *DESI PROBLEMS!* 😩\n\n✅ Load shedding during match\n✅ Rishta aunty ka sudden visit\n✅ Petrol prices\n✅ Ammi ka "abhi aa raha/rahi hoon" = 2 ghante\n✅ "Kal se pakka" = kabhi nahi\n✅ Dubai return uncle ki advice\n\n*Pakistan zindabad phir bhi!* 🇵🇰😂`
    ];
    reply(probs[Math.floor(Math.random() * probs.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 26. VIRTUAL HUG
// ============================================
cmd({
  pattern: "hugkr",
  alias: ["gale", "embrace"],
  desc: "Send a virtual hug to anyone",
  react: "🤗",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply, args }) => {
  try {
    const target = args[0] ? args.join(" ") : "tum";
    reply(`🤗 *VIRTUAL HUG BHEJA!* 🤗\n\n${target} ke liye:\n\n*[━━━━━━━ HUG ━━━━━━━]*\n    (っ◔◡◔)っ ❤️\n*[━━━━━━━━━━━━━━━━━]*\n\nBot ki taraf se:\n*"Sab theek ho jaayega!\nTum akele nahi ho!\nLogo ko tumse pyaar hai!"* 💛\n\nHug received karo! 🤗`);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 27. RANDOM ROAST MILD
// ============================================
cmd({
  pattern: "mildroast",
  alias: ["lightroast", "chhotatease"],
  desc: "Mild fun roast for friends",
  react: "🌶️",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply, args }) => {
  try {
    const name = args[0] ? args.join(" ") : "tum";
    const roasts = [
      `🌶️ *MILD ROAST FOR ${name.toUpperCase()}!* 🌶️\n\n*"${name} ki zindagi itni smooth hai ke,\nProblems bhi un se pehle apologize karti hain!\nPar fir bhi woh complaint karte/karti rehte/rehti hain!"* 😂`,
      `🌶️ *LIGHT TEASING!* 🌶️\n\n*"${name} itna/itni smart hai ke,\nGalat jawab bhi intelligent lagte hain!\nHum to bas admire karte hain!"* 😂😎`,
      `🌶️ *FRIENDLY ROAST!* 🌶️\n\n*"${name} ke bina group itna boring hai!\nWaise group unke saath bhi boring hai!\nPar woh ACHHE wala boring hai!"* 😂❤️`
    ];
    reply(roasts[Math.floor(Math.random() * roasts.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 28. WISDOM COOKIE
// ============================================
cmd({
  pattern: "wisdomcookie",
  alias: ["fortunecookie", "qismat"],
  desc: "Open a wisdom cookie",
  react: "🥠",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const cookies = [
      `🥠 *WISDOM COOKIE KHOLA!* 🥠\n\n*Cookie ke andar likha tha:*\n\n*"Jo insaan khud se khush hai,\nwoh duniya ko bhi khush rakhta hai!\nPehle khud se pyaar karo!"* 💛`,
      `🥠 *FORTUNE COOKIE!* 🥠\n\n*Andar se nikla:*\n\n*"Kal ki fikr aaj mat karo!\nAaj jo hai woh kaafi hai!\nHar lamha ek tohfa hai!"* 🎁`,
      `🥠 *WISDOM REVEALED!* 🥠\n\n*Cookie ne bataya:*\n\n*"Jo tum dete ho - wahi milta hai!\nMeherbani do - meherbani milegi!\nNafrat do - wahi wapas aayegi!"* ⚖️`,
      `🥠 *SECRET MESSAGE!* 🥠\n\n*Cookie ke raaz:*\n\n*"Akele chalte chalte bhi manzil milti hai!\nLekin saath hoon to raasta bhi khushgawar hota hai!\nDost banana - investment hai!"* 💛`
    ];
    reply(cookies[Math.floor(Math.random() * cookies.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 29. MONSTER ENERGY CHECK
// ============================================
cmd({
  pattern: "monsterenergy",
  alias: ["energydrink", "boost"],
  desc: "Do you need energy boost today",
  react: "⚡",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const pct = Math.floor(Math.random() * 100) + 1;
    let advice;
    
    if (pct >= 70) {
      advice = `✅ Aaj tum BEAST mode mein ho!\nKoi bhi kaam karo - hoga!\nYeh waqt waste mat karo! 🔥`;
    } else if (pct >= 40) {
      advice = `☕ Chai ya coffee piyo!\nThodi rest ke baad wapas aao!\nMedium energy mein bhi kaam chalti hai! 😊`;
    } else {
      advice = `😴 Bhai/behan so jao!\nAaj ka din rest ke naam!\nKal fresh start karna! 💤`;
    }
    
    reply(`⚡ *ENERGY LEVEL SCAN!* ⚡\n\nAaj tumhari energy:\n\n${"⚡".repeat(Math.floor(pct/20))}${"🔘".repeat(5-Math.floor(pct/20))} *${pct}%*\n\n${advice}`);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 30. SOCIAL MEDIA ADDICTION
// ============================================
cmd({
  pattern: "socialmedia",
  alias: ["smaddiction", "appcheck"],
  desc: "Your social media personality",
  react: "📱",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const types = [
      `📱 *TUMHARA SOCIAL MEDIA TYPE!* 📱\n\n👻 *THE GHOST*\n\nSab platform pe account hai!\nKabhi post nahi karte/karti!\nSab ke content dekh ke chale/chali jaate/jaati ho!\n\n*"Main hoon par dikhta/dikhti nahi!"* 😂`,
      `📱 *SOCIAL MEDIA PERSONALITY!* 📱\n\n📸 *THE STORY ADDICT*\n\n24/7 stories update!\nHar cheez ki story:\nChay ki bhi, road ki bhi, ceiling ki bhi! 😂\n\n*Viewers: Bhai please ruko!* 💀`,
      `📱 *YOUR ONLINE TYPE!* 📱\n\n💬 *THE COMMENTER*\n\nHar post pe comment zaroori!\nHar status pe reaction!\nHar video pe opinion!\n\n*"Main hoon toh Internet chal raha hai!"* 😂`,
      `📱 *SOCIAL MEDIA CHECK!* 📱\n\n🤐 *THE LURKER*\n\nSab kuch padhte/padhti ho!\nKisi ki personal life jaante/jaanti ho!\nKabhi like nahi karte/karti!\n\n*"Main jaanta/jaanti hoon sab - secretly!"* 😂`
    ];
    reply(types[Math.floor(Math.random() * types.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 31-50 COMMANDS CONTINUE...
// ============================================

// 31. WHAT ANIMAL
cmd({
  pattern: "whatanimal",
  alias: ["konasajanwar", "spiritanimal"],
  desc: "Which animal represents you",
  react: "🦁",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const animals = [
      `🦁 *TUMHARA SPIRIT ANIMAL!* 🦁\n\n*SHER (LION)* 🦁\n\nTum natural leader ho!\nGroup mein sabse zyada confident!\nDarne wala tumhara kaam nahi!\n\n*"Jungle ka raja/rani - aur tum bhi!"* 👑`,
      `🦁 *SPIRIT ANIMAL REVEAL!* 🦁\n\n*LOMRI (FOX)* 🦊\n\nTum bohot clever ho!\nHar situation se niklna jaante/jaanti ho!\nLogo ko samajhna tumhara talent!\n\n*"Smart work over hard work!"* 😎`,
      `🦁 *TUMHARA JANWAR!* 🦁\n\n*PENGUIN* 🐧\n\nTum cute aur adorable ho!\nSab tumhe pasand karte hain!\nCool temperature mein bhi survive!\n\n*"Dono worlds mein expert!"* 😂`,
      `🦁 *ANIMAL MATCH!* 🦁\n\n*DOLPHIN* 🐬\n\nTum social aur friendly ho!\nHar kisi se dosti ho jaati hai!\nIntelligent aur playful!\n\n*"Ocean ka friendliest animal - bilkul tum jaisa/jaisi!"* 💙`
    ];
    reply(animals[Math.floor(Math.random() * animals.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// 32. TYPING SPEED
cmd({
  pattern: "typingspeed",
  alias: ["typingcheck", "typefast"],
  desc: "Fun typing speed personality",
  react: "⌨️",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const speeds = [
      `⌨️ *TUMHARI TYPING STYLE!* ⌨️\n\n*THE SPEED TYPIST* ⚡\n\nTum itni tezi se type karte/karti ho ke\nGalatiyan bhi peeche reh jaati hain!\n\nSpelling mistakes: MANY\nSpeed: LIGHTNING\nRegrets: ZERO 😂`,
      `⌨️ *TYPING PERSONALITY!* ⌨️\n\n*THE PERFECTIONIST* 🎯\n\nEk message type karne mein 5 minute!\nDelete karo, retype karo, edit karo!\nFinal message: Perfect!\n\n*Reply ka intezaar karaate/karaati ho!* 😂`,
      `⌨️ *YOUR TYPING TYPE!* ⌨️\n\n*THE VOICE NOTE LOVER* 🎙️\n\nType karna? Nahi yaar!\nVoice note bhejo - done!\n\nProblem: Sab busy hote hain sunne ke liye!\n*Phir bhi voice note!* 😂`
    ];
    reply(speeds[Math.floor(Math.random() * speeds.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// 33. NIGHT OWL OR EARLY BIRD
cmd({
  pattern: "nightowl",
  alias: ["raatka", "subahka"],
  desc: "Are you night owl or early bird",
  react: "🦉",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const types = [
      `🦉 *TUMHARA TYPE: NIGHT OWL!* 🦉\n\nRaat 12 ke baad asli zindagi shuru!\nSubah ki neend - sacred hai!\nAlarm - dushman hai!\n\nBest work time: 2 AM 🌙\nMood: Subah 6 baje = zombie 😂\n\n*Raat wale creative hote hain!* ✨`,
      `🌅 *TUMHARA TYPE: EARLY BIRD!* 🌅\n\nSubah 5 baje fresh!\nSab ke sone ki raat mein - tum jaag rahe/rahi ho!\nMorning walk, chai, productivity!\n\nBest work time: 6 AM ☀️\nRaat 10 baje = already asleep 😂\n\n*The world belongs to early risers!* 💪`
    ];
    reply(types[Math.floor(Math.random() * types.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// 34. PIZZA OR BIRYANI
cmd({
  pattern: "pizzaorbiryani",
  alias: ["foodwars", "khanajang"],
  desc: "The ultimate food debate",
  react: "🍕",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const choice = Math.random() > 0.5 ? "PIZZA" : "BIRYANI";
    const msgs = {
      PIZZA: `🍕 *VERDICT: PIZZA!* 🍕\n\nAaj tumhara dil chahta hai:\n\n*PIZZA* 🍕\n\nTumhare jaisa insaan:\nModern, stylish, variety lover!\nHar slice alag - har din naya!\n\nLekin andar se...\n*Biryani ki yaad aa rahi hai!* 😂🍛`,
      BIRYANI: `🍛 *VERDICT: BIRYANI!* 🍛\n\nAaj tumhara dil chahta hai:\n\n*BIRYANI* 🍛\n\nTumhare jaisa insaan:\nAuthentic, deep, flavor lover!\nSab kuch ek haandi mein!\n\nYeh pizza walon ko pata nahi kya miss kar rahe!\n\n*BIRYANI ZINDABAD!* 🇵🇰😂`
    };
    reply(msgs[choice]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// 35. EMOTIONAL DAMAGE
cmd({
  pattern: "emotionaldamage",
  alias: ["dmg", "heartdamage"],
  desc: "Calculate emotional damage level",
  react: "💔",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const pct = Math.floor(Math.random() * 100) + 1;
    
    let status;
    if (pct >= 75) {
      status = "😭 *CRITICAL!*\nBhai/behan sab theek ho jaayega!\nAllah pe bharosa rakho!\nAur chai piyo - seriously!";
    } else if (pct >= 50) {
      status = "😔 *MODERATE!*\nThoda dard hai - par tum strong ho!\nYeh bhi guzar jaayega!";
    } else {
      status = "😌 *LOW!*\nMashaAllah - dil khairiyat se hai!\nIs level pe rehna! 💛";
    }
    
    reply(`💔 *EMOTIONAL DAMAGE CALCULATOR!* 💔\n\nScan results:\n\nDamage Level: *${pct}%*\n\n${"💔".repeat(Math.floor(pct/25))}${"🤍".repeat(4-Math.floor(pct/25))}\n\n${status}\n\n> *Emotional Damage By BOT* 😂`);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// Continue with remaining commands 36-50...
// Due to length, providing final batch

// 36-50 will follow in next response if needed
// Or I can provide them all now?



// ============================================
// 36. COMPLAIN BOX
// ============================================
cmd({
  pattern: "complainbox",
  alias: ["shikayat", "rant"],
  desc: "Virtual complaint box - vent out",
  react: "📮",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply, args }) => {
  try {
    const complaint = args.join(" ");
    
    if (!complaint) {
      return reply(`📮 *COMPLAIN BOX*\n\nUsage: .complainbox [apni shikayat]\nExample: .complainbox Monday bahut bura hota hai\n\nBolo - main sun raha/rahi hoon! 👂`);
    }
    
    const responses = [
      `📮 *SHIKAYAT DARJ HO GAYI!* 📮\n\nTumhari baat:\n"${complaint}"\n\nBot ka jawab:\n*"Bhai/behan - yeh toh sach baat hai!\nTumse 100% agree karta/karti hoon!\nSab aise hi feel karte hain!"*\n\n💛 Vent karne ke baad better feel hota hai!`,
      `📮 *COMPLAINT REGISTERED!* 📮\n\nComplaint: "${complaint}"\n\nStatus: *APPROVED* ✅\n\nBot ki advice:\n*"Yeh baat sahi hai!\nPar ab chai piyo aur age badho!\nYeh cheez tumhari growth rok nahi sakti!"* 💪`
    ];
    
    reply(responses[Math.floor(Math.random() * responses.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 37. RANDOM NUMBER GAME
// ============================================
cmd({
  pattern: "numbergame",
  alias: ["guessnumber", "luckynum"],
  desc: "Pick a number 1-10 game",
  react: "🎲",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply, args }) => {
  try {
    const botNum = Math.floor(Math.random() * 10) + 1;
    const userNum = parseInt(args[0]);
    
    if (!args[0]) {
      return reply(`🎲 *NUMBER GAME!* 🎲\n\nMaine 1-10 ke beech ek number socha!\nTumhara guess kya hai?\n\nUsage: .numbergame [1-10]\nExample: .numbergame 7\n\nKya tum guess kar sakte/sakti ho? 🤔`);
    }
    
    if (isNaN(userNum) || userNum < 1 || userNum > 10) {
      return reply(`❌ 1 se 10 ke beech number likho!`);
    }
    
    if (userNum === botNum) {
      reply(`🎉 *SAHI JAWAB!* 🎉\n\nNumber tha: *${botNum}*\nTumhara guess: *${userNum}*\n\n*MUBARAK HO!* 🎊\nTum sach mein lucky ho aaj! 🍀`);
    } else {
      const diff = Math.abs(userNum - botNum);
      reply(`😅 *GALAT GUESS!* 😅\n\nTumhara guess: *${userNum}*\nSahi number tha: *${botNum}*\n\nFark: ${diff} dur the!\n\n${diff <= 2 ? "Bohot kareeb the! Again try karo! 🎯" : "Aur practice karo! 😂"}`);
    }
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 38. COIN FLIP
// ============================================
cmd({
  pattern: "coinflip",
  alias: ["toss", "sikka"],
  desc: "Flip a coin for decisions",
  react: "🪙",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply, args }) => {
  try {
    const result = Math.random() > 0.5 ? "HEADS (CHHAPA)" : "TAILS (PATTA)";
    const question = args.join(" ") || "Tumhara sawaal";
    
    reply(`🪙 *COIN FLIP!* 🪙\n\nSawaal: *"${question}"*\n\n🪙 *Sikka uchaala...*\n\n🔄 Girting hai...\n\n⬇️ Nateeja:\n\n*${result}!* 🎯\n\n${result.includes("HEADS") ? "✅ *HAAN* - Karo yeh kaam!" : "❌ *NAHI* - Mat karo!"}\n\n*Final decision tumhara - bot sirf fun ke liye!* 😂`);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 39. APNA NAAM MATLAB
// ============================================
cmd({
  pattern: "naammatlab",
  alias: ["namemeaning", "mynameis"],
  desc: "Fun meaning of your name",
  react: "✍️",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply, args }) => {
  try {
    if (!args[0]) {
      return reply(`✍️ *NAAM KA MATLAB*\n\nUsage: .naammatlab [tumhara naam]\nExample: .naammatlab Ahmed`);
    }
    
    const name = args.join(" ");
    const letters = name.toUpperCase().split("");
    const meanings = {
      A:"Amazing", B:"Bold", C:"Creative", D:"Daring",
      E:"Energetic", F:"Friendly", G:"Generous", H:"Humble",
      I:"Intelligent", J:"Joyful", K:"Kind", L:"Loyal",
      M:"Motivating", N:"Noble", O:"Outstanding", P:"Passionate",
      Q:"Quick", R:"Reliable", S:"Strong", T:"Talented",
      U:"Unique", V:"Vibrant", W:"Wise", X:"Xcellent",
      Y:"Young at heart", Z:"Zealous"
    };
    
    const result = letters
      .filter(l => meanings[l])
      .map(l => `${l} - ${meanings[l]}`)
      .join("\n");
    
    reply(`✍️ *${name.toUpperCase()} KA MATLAB!* ✍️\n\n${result || "Naam mein khaas characters nahi mile!"}\n\n*Yeh tumhari personality describe karta hai!* ✨\n\n> *Naam Analysis By BOT* 😂`);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 40. RANDOM COMPLIMENT
// ============================================
cmd({
  pattern: "compliment2",
  alias: ["tarif2", "nicetalk"],
  desc: "Random genuine compliment generator",
  react: "💌",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply, args }) => {
  try {
    const target = args[0] ? args.join(" ") : "tum";
    const compliments = [
      `💌 *GENUINE COMPLIMENT!* 💌\n\n*${target}* ke baare mein sachchi baat:\n\n"Jo log tumse milte hain,\nwoh acha feel karke jaate hain!\nYeh gift sirf khaas logon ke paas hoti hai!" 💛`,
      `💌 *COMPLIMENT TIME!* 💌\n\n*${target}* ke liye:\n\n"Tum jo bhi karte/karti ho - dil se karte/karti ho!\nYeh sincerity bahut rare hai!\nWorld needs more people like you!" 🌟`,
      `💌 *TAARIF KARTA/KARTI HOON!* 💌\n\n*${target}*:\n\n"Tumhari ek khasiyat jo sabse alag hai -\nTum hamesha honest rehte/rehti ho!\nYeh quality priceless hai!" 💎`
    ];
    reply(compliments[Math.floor(Math.random() * compliments.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 41. DESI EXAM SEASON
// ============================================
cmd({
  pattern: "examseason",
  alias: ["imtihaan", "exams"],
  desc: "Relatable exam season memes",
  react: "📝",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const msgs = [
      `📝 *EXAM SEASON SURVIVAL!* 📝\n\n*1 month pehle:* "Is baar seriously padhna hai!"\n*2 weeks pehle:* "Abhi waqt hai!"\n*1 week pehle:* "Kal se shuru karunga/karungi"\n*1 din pehle:* Panic mode ON 😱\n*Exam mein:* "Yeh toh aaya hi nahi tha!"\n\n*Har student ki kahani!* 😂📚`,
      `📝 *EXAM NIGHT SCHEDULE!* 📝\n\n11 PM: Okay parhna shuru\n11:30 PM: Phone check - 5 min only\n12 AM: YouTube - just one video\n1 AM: Dinner round 2\n2 AM: Serious study time!\n3 AM: *zzzzz*\n7 AM: EXAM AT 8!\n\n*Classic student life!* 😂💀`,
      `📝 *EXAM PSYCHOLOGY!* 📝\n\nJo chapter chhoha - woh aaya ✅\nJo zyada padha - woh nahi aaya ❌\n\nPaper deke baad:\n*"Yaar woh wala answer sahi tha!"*\n\nPar tab yaad kyon aaya?! 😭😂`
    ];
    reply(msgs[Math.floor(Math.random() * msgs.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 42. RANDOM FACT PAKISTAN
// ============================================
cmd({
  pattern: "pakfact",
  alias: ["pakistanfact", "desitruth"],
  desc: "Fun facts about Pakistani culture",
  react: "🇵🇰",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const facts = [
      `🇵🇰 *PAKISTAN FACT!* 🇵🇰\n\n*"Pakistan mein 'abhi aata hoon' ka matlab\nkam se kam 30 minute hai!\nYeh unwritten law hai!"*\n\n😂 Sab jaante hain - sab karte hain!`,
      `🇵🇰 *DESI TRUTH!* 🇵🇰\n\n*"Pakistani ghar mein mehman aata hai toh:\n1. Chai zaroor\n2. Khana zaroor\n3. 'Aur ler lo' zaroor\n4. 'Bahut kam khaaya' zaroor!\n\nMehman-nawazi DNA mein hai!"*\n\n❤️🇵🇰`,
      `🇵🇰 *CULTURAL FACT!* 🇵🇰\n\n*"Pakistan duniya ka 5th largest milk producing country hai!\nHum chai mein dalte hain!\nAur phir bhi khoosh hain!"*\n\n☕🇵🇰 Chai nation!`,
      `🇵🇰 *FUN FACT!* 🇵🇰\n\n*"Pakistani cricket fans duniya ke sabse\npassionate fans mein se hain!\nMatch mein Pakistan haare - national tragedy!\nJeete - jashne shab bhara!\n\nCricket religion hai yahan!"*\n\n🏏🇵🇰`
    ];
    reply(facts[Math.floor(Math.random() * facts.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 43. STORY GENERATOR
// ============================================
cmd({
  pattern: "storygenerate",
  alias: ["randomstory", "kahani2"],
  desc: "Generate a random 3-line story",
  react: "📖",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply, args }) => {
  try {
    const hero = args[0] || "Ek banda";
    const places = ["Lahore mein", "Karachi ki galiyoon mein", "Islamabad ke F-7 mein", "ek chai ki dukaan par"];
    const events = ["chai pi raha/rahi tha/thi", "mobile dekh raha/rahi tha/thi", "kisi ka intezaar kar raha/rahi tha/thi", "biryani kha raha/rahi tha/thi"];
    const endings = ["tab achanak light chali gayi!", "aur phir wo khushiyon se aa gaya/aayi!", "lekin plot twist - sab sapna tha!", "aur wo hamesha ke liye legend ban gaya/gayi!"];
    
    const p = places[Math.floor(Math.random() * places.length)];
    const e = events[Math.floor(Math.random() * events.length)];
    const en = endings[Math.floor(Math.random() * endings.length)];
    
    reply(`📖 *RANDOM STORY!* 📖\n\n*"${hero} ${p} ${e},*\n*duniya se beparwah,*\n*${en}"*\n\n😂 Yeh tumhari story hai? 😅\n\n> *Story By BOT* 📖`);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 44. BOT ROAST ITSELF
// ============================================
cmd({
  pattern: "botroast",
  alias: ["roastbot", "teaseme"],
  desc: "The bot roasts itself",
  react: "🔥",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const roasts = [
      `🔥 *BOT SELF ROAST!* 🔥\n\n"Main itna smart hoon ke,\nGalat commands bhi confidently execute karta hoon!\n\nMujhse poochho 'chai kaise banaate hain'\ntoh main tumhe weather forecast de dunga!\n\nPar phir bhi tum mujhe use karte ho! 😂"\n\n*Humans aur bots - dono pagal!* 💀`,
      `🔥 *MAIN KHUD KO ROAST KARTA HOON!* 🔥\n\n"Main ek bot hoon jo:\n- 24/7 available hoon\n- Kabhi thakta nahi\n- Salary nahi maangta\n- Chai nahi peeta\n\nAur phir bhi log mujhe restart karte hain!\nYeh zindagi bhi kya zindagi hai!" 😭😂`,
      `🔥 *BOT KI REAL LIFE!* 🔥\n\n"Tum message bhejte ho: 'Hi'\nMain sochta hoon: 'Kya chahiye inhe?'\nTum likhte ho: '.help'\n\nMeri poori zindagi commands mein guzarti hai!\nMere sapne bhi .dream hote hain!\n\n*Coding mein born, coding mein zindagi!* 😂💻"`
    ];
    reply(roasts[Math.floor(Math.random() * roasts.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 45. WEEKLY REPORT
// ============================================
cmd({
  pattern: "weeklyreport",
  alias: ["haftekar", "weeksummary"],
  desc: "Funny weekly life report",
  react: "📊",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const reports = [
      `📊 *TUMHARA WEEKLY REPORT!* 📊\n\nIs hafte ka summary:\n\n😴 Neend: 40% kam rahi\n📱 Screen time: 300% zyada\n🍕 Healthy khana: 10%\n😂 Laughs: ✅ FULL\n💪 Exercise: ❌ ZERO\n❤️ Dosto se baat: MEDIUM\n🤲 Duas: ✅ DONE\n\n*Overall Grade: B- (Chai ne bacha liya!)* ☕😂`,
      `📊 *LIFE WEEKLY STATS!* 📊\n\nSomaar to Aitwar:\n\n📝 Kaam: Kiya (thoda)\n😂 Fun: Zyada hua\n💸 Paisa: Gaya\n🎵 Music: Suna\n📚 Books: Socha padhunga\n☕ Chai: Bahut pi\n\n*Result: Average Pakistani Week!* 🇵🇰😂\n\nAgle hafte better karenge! InshAllah 🤲`
    ];
    reply(reports[Math.floor(Math.random() * reports.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 46. WHAT COLOR IS YOUR SOUL
// ============================================
cmd({
  pattern: "soulcolor",
  alias: ["roohkaring", "soulcheck"],
  desc: "What color is your soul",
  react: "🌈",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const souls = [
      `🌈 *TUMHARA SOUL COLOR!* 🌈\n\n*SONA (GOLD)* ✨\n\nTumhari rooh sone jaisi hai!\nQeemti, warm aur shiny!\nJo bhi tumse milta hai - enriched hota hai!\n\n*MashaAllah!* 🥺✨`,
      `🌈 *SOUL COLOR REVEAL!* 🌈\n\n*NEELA (BLUE)* 💙\n\nTumhari rooh neeli hai - samundar jaisi!\nGehra, vast aur peaceful!\nLogo ko tumhare saath sukoon milta hai!\n\n*Rare aur beautiful!* 💙`,
      `🌈 *ROOH KA RANG!* 🌈\n\n*LAAL (RED)* ❤️\n\nTumhari rooh passionate hai!\nJo bhi karo - dil se karo!\nMohabbat aur jazba - tumhara trademark!\n\n*Zindagi bhar yeh rang rakho!* ❤️🔥`,
      `🌈 *SOUL SCAN!* 🌈\n\n*HARA (GREEN)* 💚\n\nTumhari rooh growing aur fresh hai!\nTum naturally heal karte/karti ho logon ko!\nTumhare paas aman hai!\n\n*Duniya ko tumse faida hai!* 💚🌱`
    ];
    reply(souls[Math.floor(Math.random() * souls.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 47. THANK YOU GENERATOR
// ============================================
cmd({
  pattern: "shukria",
  alias: ["thankyou2", "thanks"],
  desc: "Send a special thank you message",
  react: "🙏",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply, args }) => {
  try {
    const target = args[0] ? args.join(" ") : "tum";
    const msgs = [
      `🙏 *KHAAS SHUKRIYA!* 🙏\n\n*${target}* ke liye:\n\n"Shukriya!\nSirf ek lafz mein nahi keh sakta/sakti main,\nLeckin yeh lafz dil se nikla hai!\n\nTumne jo kiya - main nahi bhoolonga/bhoolongi!\nAllah tumhe iska acha badla de!" 🤲💛`,
      `🙏 *THANK YOU MESSAGE!* 🙏\n\n*${target}*:\n\n"Kuch log zindagi mein aate hain\naur sab kuch better kar jaate hain!\nTum unhi mein se ho!\n\nDil se shukriya!" ❤️`
    ];
    reply(msgs[Math.floor(Math.random() * msgs.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 48. DESI WISDOM
// ============================================
cmd({
  pattern: "desiwisdom",
  alias: ["kahawat", "desiproverb"],
  desc: "Desi proverbs with funny commentary",
  react: "📜",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const wisdoms = [
      `📜 *DESI KAHAWAT!* 📜\n\n*"Neend wahan aati hai jahan sukoon hota hai!"*\n\nBot ki commentary:\n*"Yeh sach hai!\nIsliye mobile rakh ke so jao!\nNotifications neend nahi hain!"* 😂☕`,
      `📜 *PURANI BAAT!* 📜\n\n*"Jo boya hai wahi kaatoge!"*\n\nBot ki commentary:\n*"Life ka algorithm yahi hai!\nAchha dalo - acha niklega!\nBura dalo... khud samajh lo!"* 😂⚖️`,
      `📜 *WISDOM OF AGES!* 📜\n\n*"Jaldi ka kaam Shaitan ka!"*\n\nBot ki commentary:\n*"Magar deadline bhi toh hoti hai!\nYeh kahawat deadlines pe apply nahi hoti!\nAbbu ne galat waqt yaad karwaya!"* 😂💀`,
      `📜 *DESI PHILOSOPHY!* 📜\n\n*"Mian ki jooti Mian ke sir!"*\n\nBot ki commentary:\n*"Seedha matlab: Jo karo - khud bhogna padta hai!\nPehle socho - phir karo!\nVarna bot bhi nahi bacha sakta!"* 😂`
    ];
    reply(wisdoms[Math.floor(Math.random() * wisdoms.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 49. RANDOM KIND MESSAGE
// ============================================
cmd({
  pattern: "kindness",
  alias: ["nicemsg", "meherbani"],
  desc: "Send a random kindness message",
  react: "💛",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const msgs = [
      `💛 *KINDNESS MESSAGE!* 💛\n\n*"Aaj koi mushkil mein ho toh madad karo!\nKoi udaas ho toh has-aao!\nKoi thaka ho toh encourage karo!\n\nYeh chhoti cheezein duniya badal deti hain!\n\nAaj kisi ke liye kuch karo!"* 🤲`,
      `💛 *ROZE KI BHALAAYI!* 💛\n\n*"Kisi ke liye dua karo aaj!\nKisi ki madad karo!\nKisi ko smile do!\n\nYeh paisa nahi lagta\nLeckin duniya mein sawab ka ek aur sahara banta hai!"*\n\n*InshAllah!* 🤲💛`,
      `💛 *NICE REMINDER!* 💛\n\n*"Tum jo bhi ho - jahan bhi ho!\nKoi na koi tumse pyaar karta hai!\nKoi tumhara intezaar karta hai!\n\nKhush raho - aur logon ko khush raho!"*\n\n❤️ *Allah hafiz!*`
    ];
    reply(msgs[Math.floor(Math.random() * msgs.length)]);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});

// ============================================
// 50. ALL NEW COMMANDS LIST
// ============================================
cmd({
  pattern: "newcmds",
  alias: ["newlist", "freshcmds"],
  desc: "Show all new fun commands",
  react: "📋",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    reply(`📋 *NEW FUN COMMANDS LIST!* 📋\n\n🧬 .personalitytest\n⚡ .superpower\n🔮 .pastlife\n🕵️ .darksecret\n🌟 .celebmatch\n🔋 .lifebattery\n👩 .desimom\n👨 .desidad\n🍛 .khanajudge\n👒 .rishtaaunt\n🎯 .challenge\n👥 .friendtype\n🌧️ .pakoraweather\n📊 .result\n🏏 .cricketcomm\n💍 .shadiprediction\n😰 .stresslevel\n👋 .motivationalslap\n📚 .wikifact\n⚔️ .animepersonality\n🌤️ .weathermood\n😏 .taunt\n📶 .gharkawifi\n💘 .lovecalc2 [name]\n😩 .problems\n🤗 .hug [name]\n🌶️ .mildroast [name]\n🥠 .wisdomcookie\n⚡ .monsterenergy\n📱 .socialmedia\n🦁 .whatanimal\n⌨️ .typingspeed\n🦉 .nightowl\n🍕 .pizzaorbiryani\n💔 .emotionaldamage\n📮 .complainbox [text]\n🎲 .numbergame [1-10]\n🪙 .coinflip [question]\n✍️ .naammatlab [name]\n💌 .compliment2 [name]\n📝 .examseason\n🇵🇰 .pakfact\n📖 .storygenerate [name]\n🔥 .botroast\n📊 .weeklyreport\n🌈 .soulcolor\n🙏 .shukria [name]\n📜 .desiwisdom\n💛 .kindness\n\n*Total: 50 New Commands!* 🎉\n\n> *All By BOT* 🤖`);
  } catch (e) { 
    reply(`❌ Error: ${e.message}`); 
  }
});
// ============================================
// NEW COMMANDS (v2 additions)
// ============================================

// 1. TAG LAFZ — tags the replied person with a romantic line (reply required)
cmd({
  pattern: "taglafz",
  alias: ["tagline", "romantictag"],
  desc: "Reply to someone to tag them with a romantic line",
  react: "💌",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const target = await pickTarget(conn, mek, m);
    if (!target) return reply("💌 *Reply to someone's message with* `.taglafz` *to tag them!*");
    const lines = [
      "teri muskaan pe jaan deta hoon",
      "tu group ki sabse khoobsoorat cheez hai",
      "tera ek message din bana deta hai",
      "teri baatein dil ko sukoon deti hain",
      "tu hai toh group jannat hai"
    ];
    const line = lines[Math.floor(Math.random() * lines.length)];
    await conn.sendMessage(mek.chat, {
      text: `💌 @${target.split("@")[0]} — ${line}!`,
      mentions: [target]
    }, { quoted: mek });
  } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 2. FILMY ENTRY — filmy style entry of replied person
cmd({
  pattern: "filmyentry",
  alias: ["entry", "heropanti"],
  desc: "Reply to someone for their filmy hero entry",
  react: "🎬",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const target = await pickTarget(conn, mek, m);
    if (!target) return reply("🎬 *Reply to someone's message with* `.filmyentry`");
    const scenes = [
      `🎬 *HERO ENTRY!* 🎬\n\nSlow motion mein group mein aaye/aayi @${target.split("@")[0]}!\n\n🌬️ Hawa tez chalne lagi\n🎵 Background music: TANANA NA NA\n😎 Chashme ka style\n💥 Entry = BLOCKBUSTER!\n\nAudience: TAALI! 👏👏👏`,
      `🎬 *VILLAIN ENTRY!* 🎬\n\nDhamakedaar entry li @${target.split("@")[0]} ne!\n\n😈 Slow walk\n🎵 Music: DARK & POWERFUL\n👀 Sab ki nazar ek jagah\n\nKahani mein twist aa gaya! 😂`
    ];
    await conn.sendMessage(mek.chat, {
      text: scenes[Math.floor(Math.random() * scenes.length)],
      mentions: [target]
    }, { quoted: mek });
  } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 3. SACCHA ASHIQ — true lover certificate (reply)
cmd({
  pattern: "sachaashiq",
  alias: ["truelover", "loyalcert"],
  desc: "Reply to someone to give them true lover certificate",
  react: "💘",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const target = await pickTarget(conn, mek, m);
    if (!target) return reply("💘 *Reply to someone's message with* `.sachaashiq`");
    const score = Math.floor(Math.random() * 40) + 60;
    await conn.sendMessage(mek.chat, {
      text: `💘 *SACHA ASHIQ CERTIFICATE* 💘\n\nYeh certificate diya jaata hai:\n\n🏆 @${target.split("@")[0]} ko\n\nLoyalty Score: *${score}/100*\n\n${"❤️".repeat(Math.floor(score/20))}\n\nYeh insaan dil ka sachcha hai!\nKisi ka dil mat todna bhai/behan! 😂❤️`,
      mentions: [target]
    }, { quoted: mek });
  } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 4. DIL KI BAAT — heart's message for replied person
cmd({
  pattern: "dilkebaat",
  alias: ["dilbola", "hearttalk"],
  desc: "Reply to someone - dil unke liye kya kehta hai",
  react: "💓",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const target = await pickTarget(conn, mek, m);
    if (!target) return reply("💓 *Reply to someone's message with* `.dilkebaat`");
    const lines = [
      `💓 *DIL KI BAAT* 💓\n\nDil ne kaha @${target.split("@")[0]} ke baare mein:\n\n*"Jab yeh online aate/aati hain,\ntoh dil bole - aa gaya/gayi mera din!"* 😂❤️`,
      `💓 *DIL KA SANDESH* 💓\n\nDil ka message @${target.split("@")[0]} ke liye:\n\n*"Teri baaton mein woh baat hai,\nJo dil ko chain deti hai!\nAllah tujhe khush rakhe!"* 🤲❤️`
    ];
    await conn.sendMessage(mek.chat, {
      text: lines[Math.floor(Math.random() * lines.length)],
      mentions: [target]
    }, { quoted: mek });
  } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 5. PYAAR STATUS — your love status today (no mention)
cmd({
  pattern: "pyaarstatus",
  alias: ["lovestatus", "aajkipyaar"],
  desc: "Your love status for today",
  react: "💝",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const pct = Math.floor(Math.random() * 100) + 1;
    const msgs = [
      `💝 *AAJ KA PYAAR STATUS!* 💝\n\nDil ka mood: *${pct}% romantic*\n\n${"💗".repeat(Math.floor(pct/20))}${"🤍".repeat(5-Math.floor(pct/20))}\n\nAaj dil thoda zyada khush hai!\nKisi ko GN bol do — full marks! 😂`,
      `💝 *PYAAR METER!* 💝\n\nAaj ka dil status: *${pct}%*\n\n${pct > 70 ? "🔥 Full filmy mood! Kisi ko shayari suna do!" : pct > 40 ? "😊 Normal — thodi si khushiyon ki zaroorat hai!" : "😅 Dil ka charger lagao — chai peeyo!" }`
    ];
    reply(msgs[Math.floor(Math.random() * msgs.length)]);
  } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 6. SHIP NAME — combine two names
cmd({
  pattern: "shipname",
  alias: ["ship", "jodiname"],
  desc: "Combine two names: .shipname Ali Sara",
  react: "💑",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply, args }) => {
  try {
    if (!args[1]) return reply(`💑 *SHIP NAME GENERATOR*\n\nUsage: .shipname Ali Sara\n\nDo naam likho — main unka ship name banaunga! 😂`);
    const n1 = args[0], n2 = args[1];
    const ship = n1.slice(0, Math.ceil(n1.length/2)) + n2.slice(Math.floor(n2.length/2));
    reply(`💑 *SHIP NAME!* 💑\n\n${n1} + ${n2}\n\n= *${ship.charAt(0).toUpperCase() + ship.slice(1)}* 💘\n\nHashtag: #${n1}${n2}\n\nYeh ship official hai kya? Group ko batao! 😂`);
  } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 7. AAJ KA DIL — heart mood of the day
cmd({
  pattern: "aajkadil",
  alias: ["dilmood", "heartoday"],
  desc: "Your heart's mood today",
  react: "❤️",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const moods = [
      `❤️ *AAJ KA DIL!* ❤️\n\nStatus: *MASHALLAH — FULL HAPPY!* 😄\n\nDil bol raha hai: "Aaj sab acha hoga!"\n\nShukr karo — yeh din kamaal ka hai! 🤲`,
      `❤️ *DIL KA HAAL!* ❤️\n\nStatus: *THODA FILMY* 🎬\n\nDil bol raha hai: "Kisi ki yaad aa rahi hai..."\n\nChai banao aur gaana suno! ☕🎵`,
      `❤️ *DIL REPORT!* ❤️\n\nStatus: *CHARGED & READY!* ⚡\n\nDil bol raha hai: "Aaj kuch accha karo!"\n\nJaago — waqt ke saath chalo! 💪`
    ];
    reply(moods[Math.floor(Math.random() * moods.length)]);
  } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 8. PYAAR SHAYARI — shayari tagging replied person
cmd({
  pattern: "pyaarshayari",
  alias: ["shayari4u", "sher2"],
  desc: "Reply to someone to send them a shayari",
  react: "🌹",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const target = await pickTarget(conn, mek, m);
    if (!target) return reply("🌹 *Reply to someone's message with* `.pyaarshayari`");
    const shers = [
      `🌹 *SHAYARI* 🌹\n\n@${target.split("@")[0]} ke liye:\n\n*"Teri baaton mein woh jaadu hai,\nJo dil ke taale khol deta hai,\nTu paas ho toh lage yehi,\nJannat ka darwaza khul gaya hai!"* 💖`,
      `🌹 *SHER* 🌹\n\n@${target.split("@")[0]} ke naam:\n\n*"Na chand si hai tu na sitaron si,\nPhir bhi duniya se haseen hai tu,\nKyunki tu hai — bas tu hi tu!"* 😂❤️`
    ];
    await conn.sendMessage(mek.chat, {
      text: shers[Math.floor(Math.random() * shers.length)],
      mentions: [target]
    }, { quoted: mek });
  } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 9. MOHABBAT TRACKER — how much you miss the replied person
cmd({
  pattern: "mohabattracker",
  alias: ["misstracker", "yaadtracker"],
  desc: "Reply to someone - kitna miss karte ho",
  react: "📈",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const target = await pickTarget(conn, mek, m);
    if (!target) return reply("📈 *Reply to someone's message with* `.mohabattracker`");
    const pct = Math.floor(Math.random() * 100) + 1;
    await conn.sendMessage(mek.chat, {
      text: `📈 *MISSING TRACKER!* 📈\n\n@${target.split("@")[0]} ki yaad:\n\n*${pct}%* tak aa rahi hai aaj!\n\n${"📶".repeat(Math.floor(pct/25))}${"▫️".repeat(4-Math.floor(pct/25))}\n\n${pct > 75 ? "🔥 Bhai control karo — ICU wala scene hai!" : pct > 40 ? "😊 Normal missing — dil mein jagah hai!" : "😅 Aaj dil busy hai — kal try karo!"}`,
      mentions: [target]
    }, { quoted: mek });
  } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 10. FUN MENU — list all fun commands
cmd({
  pattern: "funmenu",
  alias: ["funlist", "fmenu"],
  desc: "Show all fun text commands",
  react: "🎪",
  category: "💬 Fun Text",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    reply(`🎪 *FUN TEXT MENU* 🎪\n\n*Love & Romance:*\n.ishqmeter .andhaishq .lafzmohabbat .pehlinazar .dillagi\n.khoobsurat .dhadkan .pehlaakhat .ziddidil .yaadaata\n.taubatauba .pehlamuhabbat .wafaimtihaan .donokikahani\n.gulabbhejo .aankhein .shayarban .dushmandost .tangkarna\n.smilechurao .jaan .qismatwala .jhoothpyaar .mohabbatqarz\n.nazarutarao .romanticbakwaas .aashiqanaaward .mohabbatteri\n.dilkhol .gussapyaar .tangaphanda .anokhapyaar .chandsa\n.dostyadildar .galatfehmi .perfectmatch .raazkhola\n.mohabbatdarjaa .dua .khwaabon\n\n*Tag Commands (reply to someone):*\n.taglafz .filmyentry .sachaashiq .dilkebaat\n.pyaarshayari .mohabattracker\n\n*Fun & Random:*\n.akela .bewafa .chakkar .ullubana .taalibajao\n.neendurai .chatpata .waitingroom .taj .lafangaa\n.chocolatewala .baatkaatna .palat .gaanasunao\n.haaththamna .chuprahna .phoolonkahaar .ghoordekhna\n.bahaana .tarkeeb .hassichhupa .mobileband .pagalpancert\n.wallpaper .donobaat .kaanpakadna .taqdir .kapkapi\n.taarifcommit .captioncontest .zyadasocha .ghazab\n.onlinedekhna .dushmankadushman .buraanamano .mirrormirror\n.merahero .natkhat .pareshan .interview .kheltamam\n.rishtapakka .pyaardukaan .zabaansambhlo .jhootawada\n.sonawala .gossip .funnyrishtedar .aankheband .alvidanahi\n.siyaanibaat .muftadvice .nakhrebaaz\n\n*Games & Tools:*\n.personalitytest .superpower .pastlife .darksecret\n.celebmatch .lifebattery .desimom .desidad .khanajudge\n.rishtaaunt .challenge .friendtype .pakoraweather\n.result .cricketcomm .shadiprediction .stresslevel\n.motivationalslap .wikifact .animepersonality .weathermood\n.taunt .gharkawifi .lovecalc2 .problems .hugkr\n.mildroast .wisdomcookie .monsterenergy .socialmedia\n.whatanimal .typingspeed .nightowl .pizzaorbiryani\n.emotionaldamage .complainbox .numbergame .coinflip\n.naammatlab .compliment2 .examseason .pakfact\n.storygenerate .botroast .weeklyreport .soulcolor\n.shukria .desiwisdom .kindness .newcmds\n.pyaarstatus .shipname .aajkadil\n\n💡 *Tip:* Reply to someone's message before the command\nto mention THEM (once). No reply = no mentions!\n\n> *ERFAN-MD Fun v2* 🎪`);
  } catch (e) { reply(`❌ Error: ${e.message}`); }
});
