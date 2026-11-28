
// ============================================================
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
import axios from 'axios';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const enc = encodeURIComponent;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0 Safari/537.36';

// ------------------------------------------------------------
//  Prompt instructions — har sawal ke saath bheji jati hain
// ------------------------------------------------------------
// LANG: model user ki zuban mein jawab de (English manga ho to
// sirf English — Hindi/Arabic/Spanish kabhi nahi).
const PREFIX_LANG =
  "Reply in the same language as the user's message. If the user " +
  'wrote in English, reply in English only - never use Hindi, ' +
  'Arabic, Spanish or any other language. ';
// DIRECT: seedha jawab do — "theek se prompt do" mat kaho.
const PREFIX_DIRECT =
  "Answer the user's question directly and completely. Do not ask " +
  'the user to rephrase the question or to give a better prompt. ' +
  'Do not refuse or say you need more details - just give the best ' +
  'possible answer. ';
const PREFIX_GPT = PREFIX_DIRECT + PREFIX_LANG;

// ================= API PROVIDERS =================
// Har provider: build(q) -> URL, parse(json) -> jawab ka text.
// Pollinations plain text deta hai (JSON nahi) — isText: true.
const PROVIDERS = {
  gemini: {
    prefix: PREFIX_LANG,
    build: (q) => `https://api-gohan-v1.onrender.com/ai/gemini?text=${enc(q)}`,
    parse: (j) => j && j.result && j.result.text,
    timeout: 60000, // Render cold start ke liye zyada
  },
  deepseek: {
    prefix: PREFIX_LANG,
    build: (q) => `https://api.ryuzei.xyz/ai/deepseek?text=${enc(q)}`,
    parse: (j) => j && j.data && j.data.response,
    timeout: 30000,
  },
  llama: {
    prefix: PREFIX_LANG,
    build: (q) => `https://api.ryuzei.xyz/ai/llama?text=${enc(q)}`,
    parse: (j) => j && j.data && j.data.response,
    timeout: 30000,
  },
  gpt: {
    prefix: PREFIX_GPT,
    build: (q) =>
      `https://api.omegatech.app/api/ai/Deep-ai?action=chat&message=${enc(q)}&model=gpt-oss-120b`,
    parse: (j) => j && j.data && j.data.reply,
    timeout: 30000,
  },
  geminiFlash: {
    prefix: PREFIX_LANG,
    build: (q) =>
      `https://api.omegatech.app/api/ai/Deep-ai?action=chat&message=${enc(q)}&model=gemini-2.5-flash-lite`,
    parse: (j) => j && j.data && j.data.reply,
    timeout: 30000,
  },
  gemma: {
    prefix: PREFIX_LANG,
    build: (q) =>
      `https://api.omegatech.app/api/ai/Deep-ai?action=chat&message=${enc(q)}&model=gemma-4`,
    parse: (j) => j && j.data && j.data.reply,
    timeout: 30000,
  },
  pollinations: {
    prefix: PREFIX_LANG,
    build: (q) => `https://text.pollinations.ai/${enc(q)}?model=openai`,
    parse: null, // plain text jawab
    timeout: 30000,
    isText: true,
  },
};

// Fallback order — pehle family ka apna provider, phir baaki
// (tez tareen pehle, taake jawab jaldi aaye).
const CHAINS = {
  gemini: ['gemini', 'geminiFlash', 'pollinations', 'gpt', 'deepseek', 'llama', 'gemma'],
  deepseek: ['deepseek', 'pollinations', 'gpt', 'geminiFlash', 'llama', 'gemma', 'gemini'],
  llama: ['llama', 'pollinations', 'gpt', 'deepseek', 'geminiFlash', 'gemma', 'gemini'],
  gpt: ['gpt', 'pollinations', 'geminiFlash', 'deepseek', 'llama', 'gemma', 'gemini'],
  gemma: ['gemma', 'pollinations', 'gpt', 'deepseek', 'llama', 'geminiFlash', 'gemini'],
};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

async function callProvider(p, q) {
  const { data } = await axios.get(p.build((p.prefix || '') + q), {
    timeout: p.timeout,
    responseType: p.isText ? 'text' : 'json',
    headers: {
      'User-Agent': UA,
      Accept: p.isText ? 'text/plain, */*' : 'application/json, */*',
    },
  });
  if (p.isText) {
    const t = typeof data === 'string' ? data.trim() : '';
    if (!t) throw new Error('empty answer');
    // Pollinations daily limit (100/day/IP) — ye jawab nahi, fail hai.
    if (t.includes('Free limit reached')) throw new Error('Pollinations daily limit reached');
    return t;
  }
  if (data && (data.status === false || data.success === false)) {
    throw new Error('API returned false');
  }
  const text = p.parse(data);
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('no answer in response');
  }
  return text.trim();
}

// Family ke providers try karo; 'random' ho to pool shuffle karke.
async function askAI(family, q) {
  const keys =
    family === 'random'
      ? shuffle(Object.keys(PROVIDERS))
      : CHAINS[family] || shuffle(Object.keys(PROVIDERS));
  const errors = [];
  for (const key of keys) {
    try {
      const text = await callProvider(PROVIDERS[key], q);
      if (text) return text;
      throw new Error('empty answer');
    } catch (e) {
      errors.push(key + ': ' + e.message);
    }
  }
  throw new Error('All AI providers failed: ' + errors.join(' | '));
}

// ================= SHARED HANDLER =================
// NOTE: reply mein sirf COMMAND ka title aata hai (jaise
// "Claude 3 Says:") — andar wali API ka naam kabhi nahi.
const makeAICommand = ({ pattern, title, desc, react, family }) => {
  cmd({ pattern, desc, category: 'ai', react, filename: __filename },
  async (conn, mek, m, { q, reply }) => {
    try {
      if (!q) return reply(`💬 *Usage:* \`.${pattern} Your question\``);
      const text = await askAI(family || 'random', q);
      reply(`${react} *${title} Says:*\n\n${text}\n\n~ ERFAN-MD`);
    } catch (error) {
      console.error(`[${pattern}]`, error.message);
      reply('❌ All AI services are busy right now. Please try again.');
    }
  });
};

// ================= COMMAND LIST =================
const commands = [
    // ---- CHATGPT / GPT FAMILY (GPT API) ----
    { pattern: 'chatgpt',     title: 'ChatGPT',         desc: 'Ask ChatGPT AI.',          react: '🤖', family: 'gpt' },
    { pattern: 'chatgpt1',    title: 'ChatGPT 1',       desc: 'Ask ChatGPT 1 AI.',        react: '🤖', family: 'gpt' },
    { pattern: 'chatgpt2',    title: 'ChatGPT 2',       desc: 'Ask ChatGPT 2 AI.',        react: '🤖', family: 'gpt' },
    { pattern: 'chatgpt3',    title: 'ChatGPT 3',       desc: 'Ask ChatGPT 3 AI.',        react: '🤖', family: 'gpt' },
    { pattern: 'chatgpt4',    title: 'ChatGPT 4',       desc: 'Ask ChatGPT 4 AI.',        react: '🤖', family: 'gpt' },
    { pattern: 'chatgptplus', title: 'ChatGPT Plus',    desc: 'Ask ChatGPT Plus AI.',     react: '🤖', family: 'gpt' },
    { pattern: 'gpt',         title: 'GPT',             desc: 'Ask GPT AI.',              react: '🤖', family: 'gpt' },
    { pattern: 'gpt35',       title: 'GPT-3.5 Turbo',   desc: 'Ask GPT-3.5 Turbo AI.',    react: '🤖', family: 'gpt' },
    { pattern: 'gpt4',        title: 'GPT-4',           desc: 'Ask GPT-4 AI.',            react: '🤖', family: 'gpt' },
    { pattern: 'gpt4o',       title: 'GPT-4o',          desc: 'Ask GPT-4o AI.',           react: '🤖', family: 'gpt' },
    { pattern: 'gpt4omini',   title: 'GPT-4o Mini',     desc: 'Ask GPT-4o Mini AI.',      react: '🤖', family: 'gpt' },

    // ---- CLAUDE FAMILY (no Claude API — random provider) ----
    { pattern: 'claude',      title: 'Claude',          desc: 'Ask Claude AI.',           react: '🤖', family: 'random' },
    { pattern: 'claude1',     title: 'Claude 1',        desc: 'Ask Claude 1 AI.',         react: '🤖', family: 'random' },
    { pattern: 'claude2',     title: 'Claude 2',        desc: 'Ask Claude 2 AI.',         react: '🤖', family: 'random' },
    { pattern: 'claude3',     title: 'Claude 3',        desc: 'Ask Claude 3 AI.',         react: '🤖', family: 'random' },
    { pattern: 'claude35',    title: 'Claude 3.5 Sonnet', desc: 'Ask Claude 3.5 Sonnet AI.', react: '🤖', family: 'random' },
    { pattern: 'claude4',     title: 'Claude 4 Sonnet', desc: 'Ask Claude 4 Sonnet AI.',  react: '🤖', family: 'random' },
    { pattern: 'claudeopus',  title: 'Claude Opus',     desc: 'Ask Claude Opus AI.',      react: '🤖', family: 'random' },

    // ---- GEMINI FAMILY (Gemini API) ----
    { pattern: 'gemini',      title: 'Gemini',          desc: 'Ask Gemini AI.',           react: '♊', family: 'gemini' },
    { pattern: 'gemini1',     title: 'Gemini 1',        desc: 'Ask Gemini 1 AI.',         react: '♊', family: 'gemini' },
    { pattern: 'gemini2',     title: 'Gemini 2',        desc: 'Ask Gemini 2 AI.',         react: '♊', family: 'gemini' },
    { pattern: 'gemini3',     title: 'Gemini 3',        desc: 'Ask Gemini 3 AI.',         react: '♊', family: 'gemini' },
    { pattern: 'geminipro',   title: 'Gemini Pro',      desc: 'Ask Gemini Pro AI.',       react: '♊', family: 'gemini' },
    { pattern: 'geminiflash', title: 'Gemini Flash',    desc: 'Ask Gemini Flash AI.',     react: '♊', family: 'gemini' },
    { pattern: 'geminiultra', title: 'Gemini Ultra',    desc: 'Ask Gemini Ultra AI.',     react: '♊', family: 'gemini' },

    // ---- GROK FAMILY (no Grok API — random provider) ----
    { pattern: 'grok1',       title: 'Grok 1',          desc: 'Ask Grok 1 AI.',           react: '🚀', family: 'random' },
    { pattern: 'grok2',       title: 'Grok 2',          desc: 'Ask Grok 2 AI.',           react: '🚀', family: 'random' },
    { pattern: 'grok3',       title: 'Grok 3',          desc: 'Ask Grok 3 AI.',           react: '🚀', family: 'random' },
    { pattern: 'grok4',       title: 'Grok 4',          desc: 'Ask Grok 4 AI.',           react: '🚀', family: 'random' },
    { pattern: 'grok',        title: 'Grok',            desc: 'Ask Grok AI.',             react: '🚀', family: 'random' },

    // ---- DEEPSEEK FAMILY (DeepSeek API) ----
    { pattern: 'deepseek',      title: 'DeepSeek',       desc: 'Ask DeepSeek AI.',      react: '🔍', family: 'deepseek' },
    { pattern: 'deepseekv3',    title: 'DeepSeek V3',    desc: 'Ask DeepSeek V3 AI.',   react: '🔍', family: 'deepseek' },
    { pattern: 'deepseekr1',    title: 'DeepSeek R1',    desc: 'Ask DeepSeek R1 AI.',   react: '🔍', family: 'deepseek' },
    { pattern: 'deepseekcoder', title: 'DeepSeek Coder', desc: 'Ask DeepSeek Coder AI.', react: '🔍', family: 'deepseek' },

    // ---- CODING SPECIALIST AIs ----
    { pattern: 'codegpt',     title: 'CodeGPT',          desc: 'Ask CodeGPT AI.',           react: '💻', family: 'gpt' },
    { pattern: 'claudecode',  title: 'Claude Code',      desc: 'Ask Claude Code AI.',       react: '🖥️', family: 'random' },
    { pattern: 'claudecoder', title: 'Claude Coder',     desc: 'Ask Claude Coder AI.',      react: '🖥️', family: 'random' },
    { pattern: 'cursorai',    title: 'Cursor AI',        desc: 'Ask Cursor AI AI.',         react: '🖱️', family: 'random' },
    { pattern: 'copilot',     title: 'GitHub Copilot',   desc: 'Ask GitHub Copilot AI.',    react: '👨‍💻', family: 'random' },
    { pattern: 'copilotpro',  title: 'GitHub Copilot Pro', desc: 'Ask GitHub Copilot Pro AI.', react: '👨‍💻', family: 'random' },
    { pattern: 'blackbox',    title: 'Blackbox AI',      desc: 'Ask Blackbox AI AI.',       react: '🖤', family: 'random' },
    { pattern: 'phind',       title: 'Phind',            desc: 'Ask Phind AI.',             react: '🔎', family: 'random' },
    { pattern: 'windsurf',    title: 'Windsurf AI',      desc: 'Ask Windsurf AI AI.',       react: '🏄', family: 'random' },
    { pattern: 'devin',       title: 'Devin',            desc: 'Ask Devin AI.',             react: '🤖', family: 'random' },
    { pattern: 'codegemini',  title: 'Gemini Code Assist', desc: 'Ask Gemini Code Assist AI.', react: '💎', family: 'gemini' },
    { pattern: 'codeqwen',    title: 'Qwen Coder',       desc: 'Ask Qwen Coder AI.',        react: '💻', family: 'random' },
    { pattern: 'starcoder2',  title: 'StarCoder 2',      desc: 'Ask StarCoder 2 AI.',       react: '⭐', family: 'random' },
    { pattern: 'codellama',   title: 'CodeLLaMA',        desc: 'Ask CodeLLaMA AI.',         react: '🦙', family: 'llama' },
    { pattern: 'codegemma',   title: 'CodeGemma',        desc: 'Ask CodeGemma AI.',         react: '💠', family: 'gemma' },

    // ---- OTHER CHAT AIs ----
    { pattern: 'llama',       title: 'LLaMA',      desc: 'Ask LLaMA AI.',    react: '🦙', family: 'llama' },
    { pattern: 'llama2',      title: 'LLaMA 2',    desc: 'Ask LLaMA 2 AI.',  react: '🦙', family: 'llama' },
    { pattern: 'llama3',      title: 'LLaMA 3',    desc: 'Ask LLaMA 3 AI.',  react: '🦙', family: 'llama' },
    { pattern: 'mistral',     title: 'Mistral',    desc: 'Ask Mistral AI.',  react: '🌬️', family: 'random' },
    { pattern: 'mixtral',     title: 'Mixtral',    desc: 'Ask Mixtral AI.',  react: '🌪️', family: 'random' },
    { pattern: 'qwen',        title: 'Qwen',       desc: 'Ask Qwen AI.',     react: '🐉', family: 'random' },
    { pattern: 'phi4',        title: 'Phi-4',      desc: 'Ask Phi-4 AI.',    react: '🔢', family: 'random' },
    { pattern: 'bard',        title: 'Bard',       desc: 'Ask Bard AI.',     react: '🎭', family: 'random' },
    { pattern: 'ai',          title: 'ERFAN AI',   desc: 'Ask ERFAN AI AI.', react: '✨', family: 'random' },

    // ---- KIMI GROUP ----
    { pattern: 'kimi',        title: 'Kimi',       desc: 'Ask Kimi AI.',     react: '🌙', family: 'random' },
    { pattern: 'kimihelp',    title: 'Kimi Help',  desc: 'Ask Kimi Help AI.', react: '🌙', family: 'random' },
    { pattern: 'moonshot',    title: 'Moonshot',   desc: 'Ask Moonshot AI.', react: '🌙', family: 'random' },
    { pattern: 'kiamiga',     title: 'Kiamiga',    desc: 'Ask Kiamiga AI.',  react: '🌙', family: 'random' },

    // ---- LUMIN GROUP ----
    { pattern: 'lumin',       title: 'Lumin',      desc: 'Ask Lumin AI.',    react: '💡', family: 'random' },
    { pattern: 'lumina',      title: 'Lumina',     desc: 'Ask Lumina AI.',   react: '💡', family: 'random' },
    { pattern: 'luminai',     title: 'Lumin AI',   desc: 'Ask Lumin AI AI.', react: '💡', family: 'random' },
    { pattern: 'lightai',     title: 'Light AI',   desc: 'Ask Light AI AI.', react: '💡', family: 'random' },

    // ---- PERPLEXITY GROUP ----
    { pattern: 'perplexity',  title: 'Perplexity', desc: 'Ask Perplexity AI.', react: '🤔', family: 'random' },
    { pattern: 'perplex',     title: 'Perplex',    desc: 'Ask Perplex AI.',    react: '❓', family: 'random' },
    { pattern: 'askai',       title: 'Ask AI',     desc: 'Ask Ask AI AI.',     react: '🎓', family: 'random' },
    { pattern: 'brain',       title: 'Brain AI',   desc: 'Ask Brain AI AI.',   react: '🧠', family: 'random' },
    { pattern: 'think',       title: 'Think AI',   desc: 'Ask Think AI AI.',   react: '💭', family: 'random' },

    // ---- MATHGPT GROUP ----
    { pattern: 'mathgpt',     title: 'MathGPT',      desc: 'Ask MathGPT AI.',      react: '🧮', family: 'random' },
    { pattern: 'math',        title: 'Math Solver',  desc: 'Ask Math Solver AI.',  react: '➗', family: 'random' },
    { pattern: 'calculator',  title: 'AI Calculator', desc: 'Ask AI Calculator AI.', react: '🧮', family: 'random' },
    { pattern: 'algebra',     title: 'Algebra Help', desc: 'Ask Algebra Help AI.', react: '📐', family: 'random' },
    { pattern: 'geometry',    title: 'Geometry Help', desc: 'Ask Geometry Help AI.', react: '📏', family: 'random' },

    // ---- ISLAMIC KNOWLEDGE GROUP ----
    { pattern: 'islam',       title: 'Islamic Info',  desc: 'Ask Islamic Info AI.',  react: '🕌', family: 'random' },
    { pattern: 'islamcity',   title: 'Islamcity',     desc: 'Ask Islamcity AI.',     react: '🕌', family: 'random' },
    { pattern: 'hadith',      title: 'Hadith Search', desc: 'Ask Hadith Search AI.', react: '📿', family: 'random' },
    { pattern: 'quran',       title: 'Quran Guidance', desc: 'Ask Quran Guidance AI.', react: '📖', family: 'random' },
    { pattern: 'fiqh',        title: 'Fiqh Answers',  desc: 'Ask Fiqh Answers AI.',  react: '⚖️', family: 'random' },
    { pattern: 'sunnah',      title: 'Sunnah Info',   desc: 'Ask Sunnah Info AI.',   react: '☪️', family: 'random' },

    // ---- GRAMMAR GROUP ----
    { pattern: 'grammar',     title: 'Grammar Check',  desc: 'Grammar Check.',    react: '✍️', family: 'random' },
    { pattern: 'spellcheck',  title: 'Spell Check',    desc: 'Spell Check.',      react: '🔤', family: 'random' },
    { pattern: 'correct',     title: 'Text Correction', desc: 'Text Correction.', react: '✏️', family: 'random' },
    { pattern: 'grammarly',   title: 'Grammarly',      desc: 'Grammarly.',        react: '📖', family: 'random' },
    { pattern: 'proofread',   title: 'Proofreading',   desc: 'Proofreading.',     react: '📝', family: 'random' },
];

// Register all commands
commands.forEach(makeAICommand);
