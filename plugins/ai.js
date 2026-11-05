// ERFAN-MD — Combined AI Commands Plugin
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
import axios from 'axios';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= CHATGPT / GPT FAMILY =================
// Command 1: ChatGPT 1
cmd({ pattern: "chatgpt1", desc: "Ask ChatGPT 1 AI.", category: "ai", react: "🤖", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.chatgpt1 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🤖 *ChatGPT 1 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 2: ChatGPT 2
cmd({ pattern: "chatgpt2", desc: "Ask ChatGPT 2 AI.", category: "ai", react: "🤖", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.chatgpt2 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🤖 *ChatGPT 2 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 3: ChatGPT 3
cmd({ pattern: "chatgpt3", desc: "Ask ChatGPT 3 AI.", category: "ai", react: "🤖", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.chatgpt3 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🤖 *ChatGPT 3 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 4: ChatGPT 4
cmd({ pattern: "chatgpt4", desc: "Ask ChatGPT 4 AI.", category: "ai", react: "🤖", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.chatgpt4 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🤖 *ChatGPT 4 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 5: ChatGPT Plus
cmd({ pattern: "chatgptplus", desc: "Ask ChatGPT Plus AI.", category: "ai", react: "🤖", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.chatgptplus Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🤖 *ChatGPT Plus Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 6: GPT-3.5 Turbo
cmd({ pattern: "gpt35", desc: "Ask GPT-3.5 Turbo AI.", category: "ai", react: "🤖", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.gpt35 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🤖 *GPT-3.5 Turbo Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 7: GPT-4
cmd({ pattern: "gpt4", desc: "Ask GPT-4 AI.", category: "ai", react: "🤖", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.gpt4 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🤖 *GPT-4 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 8: GPT-4o
cmd({ pattern: "gpt4o", desc: "Ask GPT-4o AI.", category: "ai", react: "🤖", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.gpt4o Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🤖 *GPT-4o Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 9: GPT-4o Mini
cmd({ pattern: "gpt4omini", desc: "Ask GPT-4o Mini AI.", category: "ai", react: "🤖", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.gpt4omini Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🤖 *GPT-4o Mini Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// ================= CLAUDE FAMILY =================
// Command 10: Claude 1
cmd({ pattern: "claude1", desc: "Ask Claude 1 AI.", category: "ai", react: "🤖", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.claude1 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🤖 *Claude 1 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 11: Claude 2
cmd({ pattern: "claude2", desc: "Ask Claude 2 AI.", category: "ai", react: "🤖", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.claude2 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🤖 *Claude 2 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 12: Claude 3
cmd({ pattern: "claude3", desc: "Ask Claude 3 AI.", category: "ai", react: "🤖", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.claude3 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🤖 *Claude 3 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 13: Claude 3.5 Sonnet
cmd({ pattern: "claude35", desc: "Ask Claude 3.5 Sonnet AI.", category: "ai", react: "🤖", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.claude35 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🤖 *Claude 3.5 Sonnet Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 14: Claude 4 Sonnet
cmd({ pattern: "claude4", desc: "Ask Claude 4 Sonnet AI.", category: "ai", react: "🤖", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.claude4 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🤖 *Claude 4 Sonnet Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 15: Claude Opus
cmd({ pattern: "claudeopus", desc: "Ask Claude Opus AI.", category: "ai", react: "🤖", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.claudeopus Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🤖 *Claude Opus Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// ================= GEMINI FAMILY =================
// Command 16: Gemini 1
cmd({ pattern: "gemini1", desc: "Ask Gemini 1 AI.", category: "ai", react: "♊", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.gemini1 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`♊ *Gemini 1 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 17: Gemini 2
cmd({ pattern: "gemini2", desc: "Ask Gemini 2 AI.", category: "ai", react: "♊", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.gemini2 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`♊ *Gemini 2 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 18: Gemini 3
cmd({ pattern: "gemini3", desc: "Ask Gemini 3 AI.", category: "ai", react: "♊", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.gemini3 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`♊ *Gemini 3 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 19: Gemini Pro
cmd({ pattern: "geminipro", desc: "Ask Gemini Pro AI.", category: "ai", react: "♊", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.geminipro Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`♊ *Gemini Pro Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 20: Gemini Flash
cmd({ pattern: "geminiflash", desc: "Ask Gemini Flash AI.", category: "ai", react: "♊", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.geminiflash Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`♊ *Gemini Flash Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 21: Gemini Ultra
cmd({ pattern: "geminiultra", desc: "Ask Gemini Ultra AI.", category: "ai", react: "♊", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.geminiultra Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`♊ *Gemini Ultra Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// ================= GROK FAMILY =================
// Command 22: Grok 1
cmd({ pattern: "grok1", desc: "Ask Grok 1 AI.", category: "ai", react: "🚀", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.grok1 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🚀 *Grok 1 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 23: Grok 2
cmd({ pattern: "grok2", desc: "Ask Grok 2 AI.", category: "ai", react: "🚀", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.grok2 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🚀 *Grok 2 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 24: Grok 3
cmd({ pattern: "grok3", desc: "Ask Grok 3 AI.", category: "ai", react: "🚀", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.grok3 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🚀 *Grok 3 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 25: Grok 4
cmd({ pattern: "grok4", desc: "Ask Grok 4 AI.", category: "ai", react: "🚀", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.grok4 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🚀 *Grok 4 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 26: Grok
cmd({ pattern: "grok", desc: "Ask Grok AI.", category: "ai", react: "🚀", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.grok Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🚀 *Grok Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// ================= DEEPSEEK FAMILY =================
// Command 27: DeepSeek
cmd({ pattern: "deepseek", desc: "Ask DeepSeek AI.", category: "ai", react: "🔍", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.deepseek Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🔍 *DeepSeek Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 28: DeepSeek V3
cmd({ pattern: "deepseekv3", desc: "Ask DeepSeek V3 AI.", category: "ai", react: "🔍", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.deepseekv3 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🔍 *DeepSeek V3 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 29: DeepSeek R1
cmd({ pattern: "deepseekr1", desc: "Ask DeepSeek R1 AI.", category: "ai", react: "🔍", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.deepseekr1 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🔍 *DeepSeek R1 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 30: DeepSeek Coder
cmd({ pattern: "deepseekcoder", desc: "Ask DeepSeek Coder AI.", category: "ai", react: "🔍", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.deepseekcoder Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🔍 *DeepSeek Coder Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// ================= CODING SPECIALIST AIs =================
// Command 31: CodeGPT
cmd({ pattern: "codegpt", desc: "Ask CodeGPT AI.", category: "ai", react: "💻", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.codegpt Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`💻 *CodeGPT Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 32: Claude Code
cmd({ pattern: "claudecode", desc: "Ask Claude Code AI.", category: "ai", react: "🖥️", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.claudecode Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🖥️ *Claude Code Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 33: Claude Coder
cmd({ pattern: "claudecoder", desc: "Ask Claude Coder AI.", category: "ai", react: "🖥️", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.claudecoder Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🖥️ *Claude Coder Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 34: Cursor AI
cmd({ pattern: "cursorai", desc: "Ask Cursor AI AI.", category: "ai", react: "🖱️", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.cursorai Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🖱️ *Cursor AI Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 35: GitHub Copilot
cmd({ pattern: "copilot", desc: "Ask GitHub Copilot AI.", category: "ai", react: "👨‍💻", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.copilot Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`👨‍💻 *GitHub Copilot Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 36: GitHub Copilot Pro
cmd({ pattern: "copilotpro", desc: "Ask GitHub Copilot Pro AI.", category: "ai", react: "👨‍💻", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.copilotpro Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`👨‍💻 *GitHub Copilot Pro Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 37: Blackbox AI
cmd({ pattern: "blackbox", desc: "Ask Blackbox AI AI.", category: "ai", react: "🖤", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.blackbox Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🖤 *Blackbox AI Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 38: Phind
cmd({ pattern: "phind", desc: "Ask Phind AI.", category: "ai", react: "🔎", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.phind Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🔎 *Phind Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 39: Windsurf AI
cmd({ pattern: "windsurf", desc: "Ask Windsurf AI AI.", category: "ai", react: "🏄", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.windsurf Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🏄 *Windsurf AI Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 40: Devin
cmd({ pattern: "devin", desc: "Ask Devin AI.", category: "ai", react: "🤖", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.devin Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🤖 *Devin Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 41: Gemini Code Assist
cmd({ pattern: "codegemini", desc: "Ask Gemini Code Assist AI.", category: "ai", react: "💎", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.codegemini Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`💎 *Gemini Code Assist Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 42: Qwen Coder
cmd({ pattern: "codeqwen", desc: "Ask Qwen Coder AI.", category: "ai", react: "💻", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.codeqwen Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`💻 *Qwen Coder Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 43: StarCoder 2
cmd({ pattern: "starcoder2", desc: "Ask StarCoder 2 AI.", category: "ai", react: "⭐", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.starcoder2 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`⭐ *StarCoder 2 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 44: CodeLLaMA
cmd({ pattern: "codellama", desc: "Ask CodeLLaMA AI.", category: "ai", react: "🦙", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.codellama Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🦙 *CodeLLaMA Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 45: CodeGemma
cmd({ pattern: "codegemma", desc: "Ask CodeGemma AI.", category: "ai", react: "💠", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.codegemma Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`💠 *CodeGemma Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// ================= OTHER CHAT AIs =================
// Command 46: LLaMA
cmd({ pattern: "llama", desc: "Ask LLaMA AI.", category: "ai", react: "🦙", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.llama Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🦙 *LLaMA Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 47: LLaMA 2
cmd({ pattern: "llama2", desc: "Ask LLaMA 2 AI.", category: "ai", react: "🦙", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.llama2 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🦙 *LLaMA 2 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 48: LLaMA 3
cmd({ pattern: "llama3", desc: "Ask LLaMA 3 AI.", category: "ai", react: "🦙", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.llama3 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🦙 *LLaMA 3 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 49: Mistral
cmd({ pattern: "mistral", desc: "Ask Mistral AI.", category: "ai", react: "🌬️", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.mistral Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🌬️ *Mistral Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 50: Mixtral
cmd({ pattern: "mixtral", desc: "Ask Mixtral AI.", category: "ai", react: "🌪️", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.mixtral Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🌪️ *Mixtral Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 51: Qwen
cmd({ pattern: "qwen", desc: "Ask Qwen AI.", category: "ai", react: "🐉", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.qwen Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🐉 *Qwen Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 52: Phi-4
cmd({ pattern: "phi4", desc: "Ask Phi-4 AI.", category: "ai", react: "🔢", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.phi4 Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🔢 *Phi-4 Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 53: Bard
cmd({ pattern: "bard", desc: "Ask Bard AI.", category: "ai", react: "🎭", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.bard Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🎭 *Bard Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 54: ERFAN AI
cmd({ pattern: "ai", desc: "Ask ERFAN AI AI.", category: "ai", react: "✨", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.ai Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`✨ *ERFAN AI Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// ================= KIMI GROUP =================
// Command 55: Kimi
cmd({ pattern: "kimi", desc: "Ask Kimi AI.", category: "ai", react: "🌙", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.kimi Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🌙 *Kimi Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 56: Kimi Help
cmd({ pattern: "kimihelp", desc: "Ask Kimi Help AI.", category: "ai", react: "🌙", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.kimihelp Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🌙 *Kimi Help Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 57: Moonshot
cmd({ pattern: "moonshot", desc: "Ask Moonshot AI.", category: "ai", react: "🌙", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.moonshot Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🌙 *Moonshot Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 58: Kiamiga
cmd({ pattern: "kiamiga", desc: "Ask Kiamiga AI.", category: "ai", react: "🌙", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.kiamiga Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🌙 *Kiamiga Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// ================= LUMIN GROUP =================
// Command 59: Lumin
cmd({ pattern: "lumin", desc: "Ask Lumin AI.", category: "ai", react: "💡", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.lumin Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`💡 *Lumin Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 60: Lumina
cmd({ pattern: "lumina", desc: "Ask Lumina AI.", category: "ai", react: "💡", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.lumina Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`💡 *Lumina Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 61: Lumin AI
cmd({ pattern: "luminai", desc: "Ask Lumin AI AI.", category: "ai", react: "💡", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.luminai Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`💡 *Lumin AI Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 62: Light AI
cmd({ pattern: "lightai", desc: "Ask Light AI AI.", category: "ai", react: "💡", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.lightai Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`💡 *Light AI Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// ================= PERPLEXITY GROUP =================
// Command 63: Perplexity
cmd({ pattern: "perplexity", desc: "Ask Perplexity AI.", category: "ai", react: "🤔", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.perplexity Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🤔 *Perplexity Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 64: Perplex
cmd({ pattern: "perplex", desc: "Ask Perplex AI.", category: "ai", react: "❓", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.perplex Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`❓ *Perplex Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 65: Ask AI
cmd({ pattern: "askai", desc: "Ask Ask AI AI.", category: "ai", react: "🎓", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.askai Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🎓 *Ask AI Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 66: Brain AI
cmd({ pattern: "brain", desc: "Ask Brain AI AI.", category: "ai", react: "🧠", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.brain Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🧠 *Brain AI Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 67: Think AI
cmd({ pattern: "think", desc: "Ask Think AI AI.", category: "ai", react: "💭", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.think Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`💭 *Think AI Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// ================= MATHGPT GROUP =================
// Command 68: MathGPT
cmd({ pattern: "mathgpt", desc: "Ask MathGPT AI.", category: "ai", react: "🧮", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.mathgpt Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🧮 *MathGPT Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 69: Math Solver
cmd({ pattern: "math", desc: "Ask Math Solver AI.", category: "ai", react: "➗", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.math Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`➗ *Math Solver Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 70: AI Calculator
cmd({ pattern: "calculator", desc: "Ask AI Calculator AI.", category: "ai", react: "🧮", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.calculator Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🧮 *AI Calculator Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 71: Algebra Help
cmd({ pattern: "algebra", desc: "Ask Algebra Help AI.", category: "ai", react: "📐", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.algebra Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`📐 *Algebra Help Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 72: Geometry Help
cmd({ pattern: "geometry", desc: "Ask Geometry Help AI.", category: "ai", react: "📏", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.geometry Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`📏 *Geometry Help Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// ================= ISLAMIC KNOWLEDGE GROUP =================
// Command 73: Islamic Info
cmd({ pattern: "islam", desc: "Ask Islamic Info AI.", category: "ai", react: "🕌", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.islam Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🕌 *Islamic Info Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 74: Islamcity
cmd({ pattern: "islamcity", desc: "Ask Islamcity AI.", category: "ai", react: "🕌", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.islamcity Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🕌 *Islamcity Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 75: Hadith Search
cmd({ pattern: "hadith", desc: "Ask Hadith Search AI.", category: "ai", react: "📿", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.hadith Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`📿 *Hadith Search Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 76: Quran Guidance
cmd({ pattern: "quran", desc: "Ask Quran Guidance AI.", category: "ai", react: "📖", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.quran Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`📖 *Quran Guidance Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 77: Fiqh Answers
cmd({ pattern: "fiqh", desc: "Ask Fiqh Answers AI.", category: "ai", react: "⚖️", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.fiqh Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`⚖️ *Fiqh Answers Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Command 78: Sunnah Info
cmd({ pattern: "sunnah", desc: "Ask Sunnah Info AI.", category: "ai", react: "☪️", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.sunnah Your question`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`☪️ *Sunnah Info Says:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// ================= GRAMMAR GROUP =================
// Grammar Check
cmd({ pattern: "grammar", desc: "Grammar Check.", category: "ai", react: "✍️", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.grammar Your text`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`✍️ *Grammar Check:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Spell Check
cmd({ pattern: "spellcheck", desc: "Spell Check.", category: "ai", react: "🔤", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.spellcheck Your text`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`🔤 *Spell Check:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Text Correction
cmd({ pattern: "correct", desc: "Text Correction.", category: "ai", react: "✏️", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.correct Your text`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`✏️ *Text Correction:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Grammarly
cmd({ pattern: "grammarly", desc: "Grammarly.", category: "ai", react: "📖", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.grammarly Your text`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`📖 *Grammarly:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
// Proofreading
cmd({ pattern: "proofread", desc: "Proofreading.", category: "ai", react: "📝", filename: __filename },
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("💬 *Usage:* `.proofread Your text`");
        const apiUrl = `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        if (!data || !data.status) return reply("❌ API Error.");
        reply(`📝 *Proofreading:*\n\n${data.result}\n\n~ DARKZONE-MD`);
    } catch (error) {
        console.error(error.message);
        reply("❌ Failed to connect to API.");
    }
});
