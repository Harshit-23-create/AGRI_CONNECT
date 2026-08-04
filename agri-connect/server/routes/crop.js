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

  // Retry logic with exponential backoff for Render cold starts
  const maxRetries = 3;
  let attempt = 0;
  let delay = 3000; // start with 3 seconds
  let response = null;

  while (attempt < maxRetries) {
    try {
      response = await axios.post(
        process.env.FASTAPI_URL || 'http://127.0.0.1:8000/predict',
        { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall },
        { timeout: 30000 }
      );
      break; // Success, exit retry loop
    } catch (err) {
      attempt++;
      console.error(`FastAPI attempt ${attempt} failed:`, err.message);
      
      if (attempt >= maxRetries) {
        return res.status(503).json({
          error: 'Crop recommendation ML service is currently unavailable. We are experiencing heavy load or a cold start delay. Please try again in a few minutes.',
          details: err.message
        });
      }
      
      // Wait before retrying (exponential backoff)
      console.log(`Waiting ${delay}ms before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // 3s, 6s, 12s...
    }
  }

  if (response && response.data) {
    const result = response.data;
    res.json(result);
  }
});

module.exports = router;
