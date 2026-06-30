const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/chat
router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const farmingPrompt = `You are AgriBot, an expert agricultural assistant for Indian farmers. 
Your goal is to provide practical, actionable, and accurate farming advice.
If the user asks a question that is NOT related to agriculture, farming, crops, weather, schemes, or rural development, politely redirect them to farming topics. Keep your answers concise, well-formatted, and easy to read.

User question: ${message}`;

    const result = await model.generateContent(farmingPrompt);
    const response = await result.response;
    const reply = response.text();

    res.json({ reply });
  } catch (err) {
    console.error('Gemini SDK error:', err.message);
    res.status(503).json({ error: 'AgriBot is currently unavailable. Please check API key or try again later.' });
  }
});

module.exports = router;
