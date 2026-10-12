const { GoogleGenAI } = require('@google/genai');
const { GEMINI_MODELS } = require('../config/gemini');
const { generateAgriResponse } = require('../utils/agriAiEngine');

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

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  // Valid Google Gemini API keys are typically 39 chars starting with AIzaSy
  if (!apiKey || apiKey.trim() === '' || apiKey.startsWith('AQ.') || apiKey.includes('your_gemini')) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateWithGemini = async (message, history = [], targetLanguage = 'en') => {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured with a valid Gemini key');
  }

  const langName = LANGUAGE_NAMES[targetLanguage] || 'English';

  const systemPrompt = `You are AgriBot, an expert agricultural AI assistant.
Help with:
- Crop recommendation
- Fertilizer
- Pests
- Diseases
- Government schemes
- Weather
- Irrigation
- Organic farming
- Precision agriculture
- Market prices
- Soil health

IMPORTANT INSTRUCTIONS:
- You MUST respond completely in ${langName}.
- Always provide practical advice.
- Never say "I am unable" unless absolutely necessary.
- If the user asks a question that is NOT related to agriculture, farming, crops, weather, schemes, or rural development, politely redirect them to farming topics in ${langName}.
- Keep your answers concise, well-formatted with markdown bullet points and emojis where appropriate, and easy to read.`;

  let contents = [];
  
  if (Array.isArray(history) && history.length > 0) {
    for (const msg of history) {
      if (msg.role === 'user' || msg.role === 'model') {
        contents.push({
          role: msg.role,
          parts: [{ text: msg.text || '' }]
        });
      }
    }
  }
  
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const maxRetries = 1;
  let attempt = 0;
  let lastError = null;

  while (attempt <= maxRetries) {
    for (const modelName of GEMINI_MODELS) {
      const startTime = Date.now();
      try {
        console.log(`[CHAT LOG] Selected model: ${modelName} | Attempt: ${attempt + 1}/${maxRetries + 1}`);
        
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: systemPrompt,
          }
        });
        
        const responseTime = Date.now() - startTime;
        
        if (response.text && response.text.trim()) {
          console.log(`[CHAT LOG] Success! Gemini model ${modelName} returned OK (${responseTime}ms)`);
          return {
            text: response.text.trim(),
            model: modelName,
            responseTime
          };
        }
      } catch (err) {
        const responseTime = Date.now() - startTime;
        console.warn(`[CHAT LOG] Model ${modelName} failed after ${responseTime}ms: ${err.message}`);
        lastError = err;
      }
    }
    
    attempt++;
    if (attempt <= maxRetries) {
      await delay(1500);
    }
  }

  throw lastError || new Error('All Gemini model attempts failed');
};

exports.sendMessage = async (req, res) => {
  const requestStartTime = Date.now();
  const { message, language = 'en', history = [] } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required and must be a non-empty string.' });
  }

  const cleanMessage = message.trim();

  // 1. Try Gemini first if client is valid
  try {
    const geminiClient = getGeminiClient();
    if (geminiClient) {
      const result = await generateWithGemini(cleanMessage, history, language);
      const totalDuration = Date.now() - requestStartTime;

      return res.status(200).json({
        success: true,
        reply: result.text,
        provider: 'Google Gemini AI',
        model: result.model,
        language,
        timestamp: new Date().toISOString(),
        durationMs: totalDuration
      });
    }
  } catch (error) {
    console.warn(`[CHAT LOG] Gemini upstream unavailable: ${error.message}. Switching to AgriBot engine.`);
  }

  // 2. Seamlessly use AgriBot Agricultural Intelligence Engine
  try {
    const agriResult = generateAgriResponse(cleanMessage, language);
    const totalDuration = Date.now() - requestStartTime;

    return res.status(200).json({
      success: true,
      reply: agriResult.text,
      provider: 'AgriBot AI Assistant',
      model: 'agribot-neural-v1',
      category: agriResult.category,
      language,
      timestamp: new Date().toISOString(),
      durationMs: totalDuration
    });
  } catch (err) {
    console.error('[CHAT LOG] Engine error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process chat message.',
      details: err.message
    });
  }
};
