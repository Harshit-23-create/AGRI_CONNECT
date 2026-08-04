const express = require('express');
const router = express.Router();
const axios = require('axios');

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

  try {
    const response = await axios.post(
      process.env.FASTAPI_URL || 'http://127.0.0.1:8000/predict',
      { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall },
      { timeout: 60000 }
    );

    const result = response.data;
    res.json(result);
  } catch (err) {
    console.error('FastAPI error:', err.message);
    res.status(503).json({
      error: 'Crop recommendation ML service is starting up (this can take up to 50 seconds on free hosting). Please wait a moment and try again.',
    });
  }
});

module.exports = router;
