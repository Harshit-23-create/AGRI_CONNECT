const { GoogleGenAI } = require('@google/genai');
const { GEMINI_MODELS } = require('../config/gemini');

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
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    console.error('[CHAT LOG] Initialization failed: GEMINI_API_KEY is missing or invalid.');
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateWithGemini = async (message, history = [], targetLanguage = 'en') => {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured or invalid');
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
          console.log(`[CHAT LOG] Success! Response status: OK`);
          console.log(`[CHAT LOG] Request duration: ${responseTime}ms`);
          console.log(`[CHAT LOG] Retry attempts: ${attempt}`);
          return {
            text: response.text.trim(),
            model: modelName,
            responseTime
          };
        }
      } catch (err) {
        const responseTime = Date.now() - startTime;
        console.warn(`[CHAT LOG] Model ${modelName} failed after ${responseTime}ms. Status: ERROR`);
        console.warn(`[CHAT LOG] Error reason: ${err.message}`);
        lastError = err;
      }
    }
    
    attempt++;
    if (attempt <= maxRetries) {
      console.log(`[CHAT LOG] All configured models failed on attempt ${attempt}. Retrying in 2 seconds...`);
      await delay(2000);
    }
  }

  throw lastError || new Error('All Gemini model attempts and retries failed');
};

exports.sendMessage = async (req, res) => {
  const requestStartTime = Date.now();
  const { message, language = 'en', history = [] } = req.body;

  console.log(`\n======================================================`);
  console.log(`[CHAT LOG] Request started...`);
  console.log(`[CHAT LOG] Language: ${language} | History length: ${history.length} | Time: ${new Date().toISOString()}`);
  const promptLog = message && typeof message === 'string' ? `${message.substring(0, 100)}${message.length > 100 ? '...' : ''}` : 'undefined or invalid';
  console.log(`[CHAT LOG] Prompt: "${promptLog}"`);
  
  if (!message || typeof message !== 'string' || !message.trim()) {
    console.warn('[CHAT LOG] Rejected: Empty message body');
    return res.status(400).json({ error: 'Message is required and must be a non-empty string.' });
  }

  const cleanMessage = message.trim();

  try {
    const result = await generateWithGemini(cleanMessage, history, language);
    
    const totalDuration = Date.now() - requestStartTime;
    console.log(`[CHAT LOG] Request completed successfully in ${totalDuration}ms`);
    console.log(`======================================================\n`);
    
    return res.status(200).json({
      success: true,
      reply: result.text,
      provider: 'Google Gemini AI',
      model: result.model,
      language,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    const totalDuration = Date.now() - requestStartTime;
    console.error(`[CHAT LOG] Request failed entirely after ${totalDuration}ms`);
    console.error(`[CHAT LOG] Fatal Error: ${error.message}`);
    console.log(`======================================================\n`);
    
    return res.status(503).json({
      success: false,
      error: 'AgriBot AI services are temporarily unavailable due to upstream API issues. Please try again later.',
      details: error.message,
      code: 'ALL_MODELS_UNAVAILABLE',
      timestamp: new Date().toISOString(),
    });
  }
};
