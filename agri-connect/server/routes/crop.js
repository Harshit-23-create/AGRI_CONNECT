const express = require('express');
const router = express.Router();
const axios = require('axios');
const { predictCropFromParameters } = require('../utils/cropAdvisor');

// POST /api/crop/recommend
// Body: { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall }
router.post('/recommend', async (req, res) => {
  const { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall } = req.body;

  if (
    nitrogen === undefined || phosphorus === undefined || potassium === undefined ||
    temperature === undefined || humidity === undefined || ph === undefined || rainfall === undefined
  ) {
    return res.status(400).json({ error: 'All soil parameters are required' });
  }

  // 1. Attempt local / remote FastAPI ML service first (quick check)
  const fastApiUrl = process.env.FASTAPI_URL || 'http://127.0.0.1:8000/predict';
  
  try {
    const response = await axios.post(
      fastApiUrl,
      { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall },
      { timeout: 4000 }
    );

    if (response && response.data) {
      console.log('[CROP] Prediction returned from FastAPI service');
      return res.json(response.data);
    }
  } catch (err) {
    console.warn(`[CROP] FastAPI service unavailable (${err.message}). Falling back to integrated agronomic ML engine.`);
  }

  // 2. Resilient fallback using integrated agronomic dataset engine
  try {
    const result = predictCropFromParameters({
      nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall
    });

    console.log(`[CROP] Integrated recommendation: ${result.crop} (${result.confidence_score}%)`);
    return res.json(result);
  } catch (fallbackError) {
    console.error('[CROP] Recommendation error:', fallbackError);
    return res.status(500).json({
      error: 'Failed to generate crop recommendation.',
      details: fallbackError.message
    });
  }
});

module.exports = router;
