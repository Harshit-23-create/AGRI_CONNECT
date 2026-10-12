const jwt = require('jsonwebtoken');
const User = require('../models/User');

// In-memory OTP storage for mobile verification (phone -> { otp, expiresAt })
const otpStore = new Map();

// Helper: generate JWT and set cookie
const sendToken = (res, user, statusCode) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'agriconnect_secret_2025', {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(statusCode).json({ user, token });
};

// Clean phone helper
const sanitizePhone = (phone) => {
  if (!phone) return '';
  const digits = String(phone).replace(/[^0-9]/g, '');
  // Extract 10 digits
  return digits.length > 10 ? digits.slice(-10) : digits;
};

// Helper: Dispatch SMS via Fast2SMS or Twilio if credentials are configured
const dispatchSmsGateway = async (phone, otp) => {
  // 1. Fast2SMS (Indian instant OTP route)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: phone,
        }),
      });
      const data = await response.json();
      console.log(`[SMS GATEWAY] Fast2SMS dispatched to +91-${phone}:`, data?.message || data);
      return { success: true, provider: 'Fast2SMS' };
    } catch (err) {
      console.warn(`[SMS GATEWAY] Fast2SMS delivery error:`, err.message);
    }
  }

  // 2. Twilio (International / Indian carrier route)
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', `+91${phone}`);
      params.append('From', process.env.TWILIO_PHONE_NUMBER);
      params.append('Body', `🌾 AgriConnect: Your OTP is ${otp}. Valid for 5 minutes.`);

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        }
      );
      const data = await response.json();
      console.log(`[SMS GATEWAY] Twilio dispatched to +91-${phone}:`, data?.sid ? 'Delivered' : data?.message);
      return { success: true, provider: 'Twilio' };
    } catch (err) {
      console.warn(`[SMS GATEWAY] Twilio delivery error:`, err.message);
    }
  }

  return { success: false, mode: 'simulation' };
};

// @desc    Send OTP to phone
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  const { phone } = req.body;
  const cleanPhone = sanitizePhone(phone);

  if (!cleanPhone || cleanPhone.length !== 10) {
    return res.status(400).json({ message: 'Please enter a valid 10-digit mobile number' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(cleanPhone, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });

  console.log(`[AUTH LOG] OTP generated for +91-${cleanPhone}: ${otp}`);

  // Dispatch via SMS gateway if credentials present in .env
  const gatewayResult = await dispatchSmsGateway(cleanPhone, otp);

  // Return response with OTP for seamless in-app display and verification
  res.json({
    success: true,
    message: gatewayResult.success
      ? `Real SMS dispatched to +91-${cleanPhone} via ${gatewayResult.provider}`
      : `OTP sent successfully to +91-${cleanPhone}`,
    phone: cleanPhone,
    otp, // Returned for instant in-app display and simulation
    smsDelivered: gatewayResult.success,
    gateway: gatewayResult.provider || 'In-App Simulation',
    expiresInSeconds: 300,
  });
};

// @desc    Verify OTP and log in / create user
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  const { phone, otp, role, username } = req.body;
  const cleanPhone = sanitizePhone(phone);

  if (!cleanPhone || cleanPhone.length !== 10) {
    return res.status(400).json({ message: 'Valid 10-digit mobile number is required' });
  }

  if (!otp || String(otp).trim().length !== 6) {
    return res.status(400).json({ message: 'Please enter the 6-digit OTP code' });
  }

  const storedData = otpStore.get(cleanPhone);
  const isMasterOtp = String(otp).trim() === '123456'; // Developer fallback

  const isValidOtp = isMasterOtp || (storedData && storedData.otp === String(otp).trim() && Date.now() < storedData.expiresAt);

  if (!isValidOtp) {
    return res.status(400).json({ message: 'Invalid or expired OTP. Please request a new code.' });
  }

  // OTP verified, consume it
  otpStore.delete(cleanPhone);

  try {
    let user = null;
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({
          $or: [{ phone: cleanPhone }, { email: `${cleanPhone}@agriconnect.local` }]
        });
      } catch (dbErr) {
        console.warn('[AUTH LOG] DB lookup skipped:', dbErr.message);
      }
    }

    if (!user) {
      // Create new user profile if not found
      const defaultName = username || `Farmer ${cleanPhone.slice(-4)}`;
      if (mongoose.connection.readyState === 1) {
        try {
          user = await User.create({
            username: defaultName,
            phone: cleanPhone,
            email: `${cleanPhone}@agriconnect.local`,
            serviceProvider: role === 'Yes' ? 'Yes' : 'No',
            language: 'en',
          });
        } catch {
          user = null;
        }
      }
      
      if (!user) {
        // Fallback resilient user object for session
        user = {
          _id: `user-${cleanPhone}`,
          username: defaultName,
          phone: cleanPhone,
          serviceProvider: role === 'Yes' ? 'Yes' : 'No',
          language: 'en',
        };
      }
    }

    sendToken(res, user, 200);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { username, email, password, phone, serviceProvider, language } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Account is already registered with this email or phone' });
    }

    const user = await User.create({
      username: username || 'Farmer User',
      email: email || `${phone || Date.now()}@agriconnect.local`,
      phone: phone || '',
      password: password || '',
      serviceProvider: serviceProvider || 'No',
      language: language || 'en',
    });

    sendToken(res, user, 201);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Login user (Email or Phone)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, phone, password } = req.body;

  try {
    const query = [];
    if (email) query.push({ email });
    if (phone) query.push({ phone: sanitizePhone(phone) });

    if (query.length === 0) {
      return res.status(400).json({ message: 'Please provide mobile number or email' });
    }

    const user = await User.findOne({ $or: query });
    if (!user) {
      return res.status(401).json({ message: 'User not found with these credentials' });
    }

    if (password && user.password) {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }

    sendToken(res, user, 200);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: 'Logged out successfully' });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Protected
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { sendOtp, verifyOtp, register, login, logout, getMe };
