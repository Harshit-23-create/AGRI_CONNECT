const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

// Map language codes to English names for Gemini system prompt
const LANGUAGE_NAMES = {
  en: 'English',
  hi: 'Hindi (हिन्दी)',
  pa: 'Punjabi (ਪੰਜਾਬੀ)',
  mr: 'Marathi (मराठी)',
  gu: 'Gujarati (ગુજરાતી)',
  bn: 'Bengali (বাংলা)',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
  kn: 'Kannada (ಕನ್ನಡ)',
  ml: 'Malayalam (മലയാളം)',
  or: 'Odia (ଓଡ଼ିଆ)',
};

// Initialize Gemini SDK safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Helper to attempt generation using Google Gemini SDK with fallback models
 */
const generateWithGemini = async (message, targetLanguage = 'en') => {
  const genAI = getGeminiClient();
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured or invalid');
  }

  const langName = LANGUAGE_NAMES[targetLanguage] || 'English';

  const systemPrompt = `You are AgriBot, an expert agricultural assistant for Indian farmers. 
Your goal is to provide practical, actionable, and accurate farming advice.
IMPORTANT MULTILINGUAL REQUIREMENT: You MUST respond completely in ${langName}.
If the user asks a question in any language or in English, ALWAYS output your final response in ${langName}.
If the user asks a question that is NOT related to agriculture, farming, crops, weather, schemes, or rural development, politely redirect them to farming topics in ${langName}.
Keep your answers concise, well-formatted with markdown bullet points and emojis where appropriate, and easy to read.`;

  const candidateModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      console.log(`[CHAT CONTROLLER] Attempting Gemini model: ${modelName} in ${langName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = `${systemPrompt}\n\nUser question: ${message}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      if (text && text.trim()) {
        return text.trim();
      }
    } catch (err) {
      console.warn(`[CHAT CONTROLLER] Model ${modelName} failed: ${err.message}`);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini model attempts failed');
};

/**
 * Helper to call FastAPI ML Service fallback
 */
const generateWithFastAPI = async (message, language = 'en') => {
  const baseUrl = process.env.FASTAPI_BASE_URL || 'http://127.0.0.1:8000';
  const chatUrl = `${baseUrl.replace(/\/+$/, '')}/chat`;

  console.log(`[CHAT CONTROLLER] Attempting FastAPI ML Service fallback at ${chatUrl}`);
  const response = await axios.post(
    chatUrl,
    { message, language },
    { timeout: 60000, headers: { 'Content-Type': 'application/json' } }
  );

  if (response.data && response.data.reply) {
    return response.data.reply;
  }
  throw new Error('Invalid response received from FastAPI ML Service');
};

/**
 * Main Controller Handler for POST /api/chat
 */
exports.sendMessage = async (req, res) => {
  const startTime = Date.now();
  const { message, language = 'en' } = req.body;

  console.log(`[CHAT LOG] Incoming request | Language: ${language} | Time: ${new Date().toISOString()}`);

  if (!message || typeof message !== 'string' || !message.trim()) {
    console.warn('[CHAT LOG] Rejected: Empty message body');
    return res.status(400).json({ error: 'Message is required and must be a non-empty string.' });
  }

  const cleanMessage = message.trim();
  let replyText = null;
  let provider = null;

  // 1. Primary Attempt: Google Gemini API
  try {
    replyText = await generateWithGemini(cleanMessage, language);
    provider = 'Google Gemini AI';
  } catch (geminiError) {
    console.error(`[CHAT LOG] Gemini API attempt failed: ${geminiError.message}`);
    
    // 2. Secondary Fallback: FastAPI ML Service
    try {
      replyText = await generateWithFastAPI(cleanMessage, language);
      provider = 'FastAPI ML Service';
    } catch (fastApiError) {
      console.error(`[CHAT LOG] FastAPI ML Service fallback failed: ${fastApiError.message}`);
    }
  }

  const durationMs = Date.now() - startTime;

  if (replyText) {
    console.log(`[CHAT LOG] Success | Provider: ${provider} | Duration: ${durationMs}ms`);
    return res.json({
      success: true,
      reply: replyText,
      provider,
      language,
      timestamp: new Date().toISOString(),
    });
  }

  // 3. Graceful degradation / error handling
  console.error(`[CHAT LOG] All AI services failed after ${durationMs}ms`);
  return res.status(503).json({
    success: false,
    error: 'AgriBot AI service is temporarily unavailable. Please verify your connection or try again in a few moments.',
    code: 'AI_SERVICE_UNAVAILABLE',
    timestamp: new Date().toISOString(),
  });
};
