const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /api/weather?state=&city=&village=
router.get('/', async (req, res) => {
  const { state, city, village } = req.query;

  if (!state || !city) {
    return res.status(400).json({ error: 'State and city are required' });
  }

  const location = village && village.trim()
    ? `${village.trim()},${city.trim()},${state.trim()}`
    : `${city.trim()},${state.trim()}`;

  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`
      ),
      axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`
      ),
    ]);

    res.json({
      current: currentRes.data,
      forecast: forecastRes.data,
    });
  } catch (err) {
    const message = err.response?.data?.message || err.message;
    res.status(500).json({ error: `Unable to fetch weather data: ${message}` });
  }
});

module.exports = router;
