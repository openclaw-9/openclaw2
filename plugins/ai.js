// ERFAN-MD — Combined AI Commands Plugin (Updated)
// All old APIs removed. Every command now uses the new GEMINI API:
// https://api-gohan-v1.onrender.com/ai/gemini?text=<query>
// Response format:
// {
//   "status": true,
//   "creator": "DVWILKER",
//   "result": { "text": "..." }
// }
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
import axios from 'axios';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= NEW API CONFIG =================
const API_BASE = 'https://api-gohan-v1.onrender.com/ai/gemini';

// Shared handler — parses the new response shape (data.result.text)
const makeAICommand = ({ pattern, title, desc, react }) => {
    cmd({ pattern, desc, category: 'ai', react, filename: __filename },
    async (conn, mek, m, { q, reply }) => {
        try {
            if (!q) return reply(`💬 *Usage:* \`.${pattern} Your question\``);
            const apiUrl = `${API_BASE}?text=${encodeURIComponent(q)}`;
            const { data } = await axios.get(apiUrl, { timeout: 60000 });
            if (!data || !data.status) return reply('❌ API Error.');
            const text = data?.result?.text;
            if (!text) return reply('❌ API Error.');
            reply(`${react} *${title} Says:*\n\n${text}\n\n~ DARKZONE-MD`);
        } catch (error) {
            console.error(error.message);
            reply('❌ Failed to connect to API.');
        }
    });
};

// ================= COMMAND LIST =================
const commands = [
    // ---- CHATGPT / GPT FAMILY ----
    { pattern: 'chatgpt1',    title: 'ChatGPT 1',       desc: 'Ask ChatGPT 1 AI.',        react: '🤖' },
    { pattern: 'chatgpt2',    title: 'ChatGPT 2',       desc: 'Ask ChatGPT 2 AI.',        react: '🤖' },
    { pattern: 'chatgpt3',    title: 'ChatGPT 3',       desc: 'Ask ChatGPT 3 AI.',        react: '🤖' },
    { pattern: 'chatgpt4',    title: 'ChatGPT 4',       desc: 'Ask ChatGPT 4 AI.',        react: '🤖' },
    { pattern: 'chatgptplus', title: 'ChatGPT Plus',    desc: 'Ask ChatGPT Plus AI.',     react: '🤖' },
    { pattern: 'gpt35',       title: 'GPT-3.5 Turbo',   desc: 'Ask GPT-3.5 Turbo AI.',    react: '🤖' },
    { pattern: 'gpt4',        title: 'GPT-4',           desc: 'Ask GPT-4 AI.',            react: '🤖' },
    { pattern: 'gpt4o',       title: 'GPT-4o',          desc: 'Ask GPT-4o AI.',           react: '🤖' },
    { pattern: 'gpt4omini',  title: 'GPT-4o Mini',     desc: 'Ask GPT-4o Mini AI.',      react: '🤖' },

    // ---- CLAUDE FAMILY ----
    { pattern: 'claude1',     title: 'Claude 1',        desc: 'Ask Claude 1 AI.',         react: '🤖' },
    { pattern: 'claude2',     title: 'Claude 2',        desc: 'Ask Claude 2 AI.',         react: '🤖' },
    { pattern: 'claude3',     title: 'Claude 3',        desc: 'Ask Claude 3 AI.',         react: '🤖' },
    { pattern: 'claude35',    title: 'Claude 3.5 Sonnet', desc: 'Ask Claude 3.5 Sonnet AI.', react: '🤖' },
    { pattern: 'claude4',     title: 'Claude 4 Sonnet', desc: 'Ask Claude 4 Sonnet AI.',  react: '🤖' },
    { pattern: 'claudeopus',  title: 'Claude Opus',     desc: 'Ask Claude Opus AI.',      react: '🤖' },

    // ---- GEMINI FAMILY ----
    { pattern: 'gemini1',     title: 'Gemini 1',        desc: 'Ask Gemini 1 AI.',         react: '♊' },
    { pattern: 'gemini2',     title: 'Gemini 2',        desc: 'Ask Gemini 2 AI.',         react: '♊' },
    { pattern: 'gemini3',     title: 'Gemini 3',        desc: 'Ask Gemini 3 AI.',         react: '♊' },
    { pattern: 'geminipro',   title: 'Gemini Pro',      desc: 'Ask Gemini Pro AI.',       react: '♊' },
    { pattern: 'geminiflash', title: 'Gemini Flash',    desc: 'Ask Gemini Flash AI.',     react: '♊' },
    { pattern: 'geminiultra', title: 'Gemini Ultra',    desc: 'Ask Gemini Ultra AI.',     react: '♊' },

    // ---- GROK FAMILY ----
    { pattern: 'grok1',       title: 'Grok 1',          desc: 'Ask Grok 1 AI.',           react: '🚀' },
    { pattern: 'grok2',       title: 'Grok 2',          desc: 'Ask Grok 2 AI.',           react: '🚀' },
    { pattern: 'grok3',       title: 'Grok 3',          desc: 'Ask Grok 3 AI.',           react: '🚀' },
    { pattern: 'grok4',       title: 'Grok 4',          desc: 'Ask Grok 4 AI.',           react: '🚀' },
    { pattern: 'grok',        title: 'Grok',            desc: 'Ask Grok AI.',             react: '🚀' },

    // ---- DEEPSEEK FAMILY ----
    { pattern: 'deepseek',      title: 'DeepSeek',       desc: 'Ask DeepSeek AI.',      react: '🔍' },
    { pattern: 'deepseekv3',    title: 'DeepSeek V3',    desc: 'Ask DeepSeek V3 AI.',   react: '🔍' },
    { pattern: 'deepseekr1',    title: 'DeepSeek R1',    desc: 'Ask DeepSeek R1 AI.',   react: '🔍' },
    { pattern: 'deepseekcoder', title: 'DeepSeek Coder', desc: 'Ask DeepSeek Coder AI.', react: '🔍' },

    // ---- CODING SPECIALIST AIs ----
    { pattern: 'codegpt',     title: 'CodeGPT',          desc: 'Ask CodeGPT AI.',           react: '💻' },
    { pattern: 'claudecode',  title: 'Claude Code',      desc: 'Ask Claude Code AI.',       react: '🖥️' },
    { pattern: 'claudecoder', title: 'Claude Coder',     desc: 'Ask Claude Coder AI.',      react: '🖥️' },
    { pattern: 'cursorai',    title: 'Cursor AI',        desc: 'Ask Cursor AI AI.',         react: '🖱️' },
    { pattern: 'copilot',     title: 'GitHub Copilot',   desc: 'Ask GitHub Copilot AI.',    react: '👨‍💻' },
    { pattern: 'copilotpro',  title: 'GitHub Copilot Pro', desc: 'Ask GitHub Copilot Pro AI.', react: '👨‍💻' },
    { pattern: 'blackbox',    title: 'Blackbox AI',      desc: 'Ask Blackbox AI AI.',       react: '🖤' },
    { pattern: 'phind',       title: 'Phind',            desc: 'Ask Phind AI.',             react: '🔎' },
    { pattern: 'windsurf',    title: 'Windsurf AI',      desc: 'Ask Windsurf AI AI.',       react: '🏄' },
    { pattern: 'devin',       title: 'Devin',            desc: 'Ask Devin AI.',             react: '🤖' },
    { pattern: 'codegemini',  title: 'Gemini Code Assist', desc: 'Ask Gemini Code Assist AI.', react: '💎' },
    { pattern: 'codeqwen',    title: 'Qwen Coder',       desc: 'Ask Qwen Coder AI.',        react: '💻' },
    { pattern: 'starcoder2',  title: 'StarCoder 2',      desc: 'Ask StarCoder 2 AI.',       react: '⭐' },
    { pattern: 'codellama',   title: 'CodeLLaMA',        desc: 'Ask CodeLLaMA AI.',         react: '🦙' },
    { pattern: 'codegemma',   title: 'CodeGemma',        desc: 'Ask CodeGemma AI.',         react: '💠' },

    // ---- OTHER CHAT AIs ----
    { pattern: 'llama',       title: 'LLaMA',      desc: 'Ask LLaMA AI.',    react: '🦙' },
    { pattern: 'llama2',      title: 'LLaMA 2',    desc: 'Ask LLaMA 2 AI.',  react: '🦙' },
    { pattern: 'llama3',      title: 'LLaMA 3',    desc: 'Ask LLaMA 3 AI.',  react: '🦙' },
    { pattern: 'mistral',     title: 'Mistral',    desc: 'Ask Mistral AI.',  react: '🌬️' },
    { pattern: 'mixtral',     title: 'Mixtral',    desc: 'Ask Mixtral AI.',  react: '🌪️' },
    { pattern: 'qwen',        title: 'Qwen',       desc: 'Ask Qwen AI.',     react: '🐉' },
    { pattern: 'phi4',        title: 'Phi-4',      desc: 'Ask Phi-4 AI.',    react: '🔢' },
    { pattern: 'bard',        title: 'Bard',       desc: 'Ask Bard AI.',     react: '🎭' },
    { pattern: 'ai',          title: 'ERFAN AI',   desc: 'Ask ERFAN AI AI.', react: '✨' },

    // ---- KIMI GROUP ----
    { pattern: 'kimi',        title: 'Kimi',       desc: 'Ask Kimi AI.',     react: '🌙' },
    { pattern: 'kimihelp',    title: 'Kimi Help',  desc: 'Ask Kimi Help AI.', react: '🌙' },
    { pattern: 'moonshot',    title: 'Moonshot',   desc: 'Ask Moonshot AI.', react: '🌙' },
    { pattern: 'kiamiga',     title: 'Kiamiga',    desc: 'Ask Kiamiga AI.',  react: '🌙' },

    // ---- LUMIN GROUP ----
    { pattern: 'lumin',       title: 'Lumin',      desc: 'Ask Lumin AI.',    react: '💡' },
    { pattern: 'lumina',      title: 'Lumina',     desc: 'Ask Lumina AI.',   react: '💡' },
    { pattern: 'luminai',     title: 'Lumin AI',   desc: 'Ask Lumin AI AI.', react: '💡' },
    { pattern: 'lightai',     title: 'Light AI',   desc: 'Ask Light AI AI.', react: '💡' },

    // ---- PERPLEXITY GROUP ----
    { pattern: 'perplexity',  title: 'Perplexity', desc: 'Ask Perplexity AI.', react: '🤔' },
    { pattern: 'perplex',     title: 'Perplex',    desc: 'Ask Perplex AI.',    react: '❓' },
    { pattern: 'askai',       title: 'Ask AI',     desc: 'Ask Ask AI AI.',     react: '🎓' },
    { pattern: 'brain',       title: 'Brain AI',   desc: 'Ask Brain AI AI.',   react: '🧠' },
    { pattern: 'think',       title: 'Think AI',   desc: 'Ask Think AI AI.',   react: '💭' },

    // ---- MATHGPT GROUP ----
    { pattern: 'mathgpt',     title: 'MathGPT',      desc: 'Ask MathGPT AI.',      react: '🧮' },
    { pattern: 'math',        title: 'Math Solver',  desc: 'Ask Math Solver AI.',  react: '➗' },
    { pattern: 'calculator',  title: 'AI Calculator', desc: 'Ask AI Calculator AI.', react: '🧮' },
    { pattern: 'algebra',     title: 'Algebra Help', desc: 'Ask Algebra Help AI.', react: '📐' },
    { pattern: 'geometry',    title: 'Geometry Help', desc: 'Ask Geometry Help AI.', react: '📏' },

    // ---- ISLAMIC KNOWLEDGE GROUP ----
    { pattern: 'islam',       title: 'Islamic Info',  desc: 'Ask Islamic Info AI.',  react: '🕌' },
    { pattern: 'islamcity',   title: 'Islamcity',     desc: 'Ask Islamcity AI.',     react: '🕌' },
    { pattern: 'hadith',      title: 'Hadith Search', desc: 'Ask Hadith Search AI.', react: '📿' },
    { pattern: 'quran',       title: 'Quran Guidance', desc: 'Ask Quran Guidance AI.', react: '📖' },
    { pattern: 'fiqh',        title: 'Fiqh Answers',  desc: 'Ask Fiqh Answers AI.',  react: '⚖️' },
    { pattern: 'sunnah',      title: 'Sunnah Info',   desc: 'Ask Sunnah Info AI.',   react: '☪️' },

    // ---- GRAMMAR GROUP ----
    { pattern: 'grammar',     title: 'Grammar Check',  desc: 'Grammar Check.',    react: '✍️' },
    { pattern: 'spellcheck',  title: 'Spell Check',    desc: 'Spell Check.',      react: '🔤' },
    { pattern: 'correct',     title: 'Text Correction', desc: 'Text Correction.', react: '✏️' },
    { pattern: 'grammarly',   title: 'Grammarly',      desc: 'Grammarly.',        react: '📖' },
    { pattern: 'proofread',   title: 'Proofreading',   desc: 'Proofreading.',     react: '📝' },
];

// Register all commands (all use the new Gemini API and parse data.result.text)
commands.forEach(makeAICommand);
