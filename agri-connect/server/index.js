require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const weatherRoutes = require('./routes/weather');
const chatRoutes = require('./routes/chat');
const cropRoutes = require('./routes/crop');
const productRoutes = require('./routes/product');
const articleRoutes = require('./routes/article');

const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      process.env.CLIENT_URL,
    ].filter(Boolean);
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.netlify.app')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/products', productRoutes);
app.use('/api/articles', articleRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'AgriConnect API is running 🌾' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🌿 AgriConnect server running on http://localhost:${PORT}`);
    
    // Gemini Startup Logging
    const packageJson = require('./package.json');
    const { GEMINI_MODELS } = require('./config/gemini');
    const geminiVersion = packageJson.dependencies['@google/genai'] || 'unknown';
    
    console.log(`\n🤖 === Gemini Configuration ===`);
    console.log(`- SDK Version: ${geminiVersion}`);
    console.log(`- Configured Models: [${GEMINI_MODELS.join(', ')}]`);
    console.log(`- Default Model: ${GEMINI_MODELS[0]}`);
    
    const key = process.env.GEMINI_API_KEY;
    if (key && key.length > 10) {
      const maskedKey = `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
      console.log(`- API Key Loaded: ${maskedKey}`);
    } else {
      console.warn(`- API Key: MISSING OR INVALID`);
    }
    console.log(`==============================\n`);
  });
}

module.exports = app;
