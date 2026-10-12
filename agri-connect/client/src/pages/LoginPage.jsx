import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export const DEMO_USERS = [
  {
    id: 'demo-farmer',
    role: 'farmer',
    badge: '🌾 Farmer',
    badgeClass: 'badge-green',
    username: 'Rajesh Kumar',
    phone: '9876543210',
    serviceProvider: 'No',
    language: 'en',
    features: 'Crop AI • Weather Advisory • Kisan Loans',
    avatar: '👨‍🌾',
  },
  {
    id: 'demo-buyer',
    role: 'buyer',
    badge: '🏪 Agro Buyer',
    badgeClass: 'badge-gold',
    username: 'Priya Sharma',
    phone: '9876512345',
    serviceProvider: 'Yes',
    language: 'en',
    features: 'Marketplace • Labour Hiring • Storage',
    avatar: '👩‍💼',
  },
  {
    id: 'demo-partner',
    role: 'partner',
    badge: '🚜 Storage & Fleet',
    badgeClass: 'badge-blue',
    username: 'Hardev Singh',
    phone: '9876567890',
    serviceProvider: 'Yes',
    language: 'pa',
    features: 'Warehouse Depot • Tractor Rentals',
    avatar: '🚚',
  },
];

const LoginPage = () => {
  const { t } = useTranslation();
  const { sendOtp, verifyOtpAndLogin, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  // Step 1 = Mobile Number, Step 2 = OTP Verification
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [receivedOtp, setReceivedOtp] = useState('');
  const [activeDemoProfile, setActiveDemoProfile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [demoLoadingId, setDemoLoadingId] = useState(null);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [highlightedField, setHighlightedField] = useState(false);

  const otpInputsRef = useRef([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Clean phone string to 10 digits
  const getCleanPhone = (val) => {
    return String(val || '').replace(/[^0-9]/g, '').slice(-10);
  };

  // Format phone display (e.g. 98765 43210)
  const formatPhoneDisplay = (val) => {
    const clean = getCleanPhone(val);
    if (clean.length > 5) {
      return `${clean.slice(0, 5)} ${clean.slice(5)}`;
    }
    return clean;
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    const clean = getCleanPhone(raw);
    setPhone(clean);
    if (error) setError('');
  };

  // Step 1: Request OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanPhone = getCleanPhone(phone);
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await sendOtp(cleanPhone);
      const generatedCode = res?.otp || '123456';
      setReceivedOtp(generatedCode);
      setStep(2);
      setTimer(30);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);

      toast.success(`Verification code sent to +91-${cleanPhone}!`, {
        icon: '📲',
        duration: 4000,
      });

      // Focus first OTP box
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
    } catch (err) {
      console.error('Send OTP Error:', err);
      setError(err?.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setLoading(true);
    setError('');
    try {
      const cleanPhone = getCleanPhone(phone);
      const res = await sendOtp(cleanPhone);
      const generatedCode = res?.otp || '123456';
      setReceivedOtp(generatedCode);
      setTimer(30);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      toast.success(`New OTP sent to +91-${cleanPhone}`);
      otpInputsRef.current[0]?.focus();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle individual digit input
  const handleOtpDigitChange = (index, value) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    if (error) setError('');

    // Auto-focus next input
    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits entered
    if (digit && index === 5 && newDigits.every((d) => d !== '')) {
      const fullOtp = newDigits.join('');
      executeVerifyOtp(fullOtp);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Support pasting full 6-digit code
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setOtpDigits(newDigits);

    if (pastedData.length === 6) {
      executeVerifyOtp(pastedData);
    } else {
      otpInputsRef.current[pastedData.length]?.focus();
    }
  };

  // Autofill test code button
  const handleAutofillOtp = () => {
    const code = receivedOtp || '123456';
    const digits = code.split('').slice(0, 6);
    setOtpDigits(digits);
    toast('Code filled! Verifying...', { icon: '⚡' });
    executeVerifyOtp(code);
  };

  // Step 2: Verify OTP and complete login
  const executeVerifyOtp = async (codeToVerify) => {
    const fullOtp = codeToVerify || otpDigits.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP code');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const cleanPhone = getCleanPhone(phone);
      await verifyOtpAndLogin(cleanPhone, fullOtp, activeDemoProfile);
      toast.success('Successfully logged in!', { icon: '🌾' });
      navigate('/dashboard');
    } catch (err) {
      console.error('Verify OTP Error:', err);
      setError(err?.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    executeVerifyOtp(otpDigits.join(''));
  };

  // Instant 1-Click Demo Login
  const handleQuickDemoLogin = async (demoUser) => {
    setError('');
    setDemoLoadingId(demoUser.id);
    try {
      await loginAsDemo(demoUser);
      toast.success(`Welcome, ${demoUser.username}! (${demoUser.badge})`, { icon: '⚡' });
      navigate('/dashboard');
    } catch (err) {
      console.error('Demo Login Error:', err);
      toast.error('Could not complete demo login. Please try again.');
    } finally {
      setDemoLoadingId(null);
    }
  };

  // Fill Phone Number into form
  const handleFillDemoPhone = (demoUser) => {
    setActiveDemoProfile(demoUser);
    setPhone(demoUser.phone);
    setStep(1);
    setError('');
    setHighlightedField(true);
    toast(`Number +91 ${demoUser.phone} filled! Click "Get OTP".`, { icon: '📱' });
    setTimeout(() => setHighlightedField(false), 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-in" style={{ maxWidth: 500 }}>
        {/* Brand Header */}
        <div className="auth-logo">
          <span className="logo-icon">🌾</span>
          <h1>AgriConnect</h1>
          <p>India’s Smart Agricultural & Farmer Network</p>
        </div>

        {error && <div className="alert alert-error mb-16">{error}</div>}

        {/* ── Demo Accounts Section ── */}
        <div className="demo-accounts-box mb-24">
          <div className="demo-accounts-header">
            <div className="flex items-center gap-8">
              <span className="demo-sparkle-icon">⚡</span>
              <div>
                <h3 className="demo-title">Quick Demo Profiles</h3>
                <p className="demo-subtitle">Select any role to test instant access</p>
              </div>
            </div>
          </div>

          <div className="demo-cards-grid">
            {DEMO_USERS.map((demo) => {
              const isThisDemoLoading = demoLoadingId === demo.id;
              return (
                <div key={demo.id} className="demo-profile-card">
                  <div className="demo-profile-header">
                    <span className="demo-avatar">{demo.avatar}</span>
                    <div className="demo-profile-text">
                      <div className="flex items-center gap-6">
                        <strong>{demo.username}</strong>
                        <span className={`badge ${demo.badgeClass} demo-badge`}>
                          {demo.badge}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          📱 +91 {demo.phone.slice(0, 5)} {demo.phone.slice(5)}
                        </span>
                      </div>
                      <span className="demo-features-hint">{demo.features}</span>
                    </div>
                  </div>

                  <div className="demo-action-buttons">
                    <button
                      id={`btn-quick-${demo.id}`}
                      type="button"
                      className="btn btn-primary-sm demo-quick-btn"
                      onClick={() => handleQuickDemoLogin(demo)}
                      disabled={loading || Boolean(demoLoadingId)}
                    >
                      {isThisDemoLoading ? 'Logging in...' : '⚡ Quick Login'}
                    </button>
                    <button
                      id={`btn-fill-${demo.id}`}
                      type="button"
                      className="btn btn-outline-sm demo-autofill-btn"
                      onClick={() => handleFillDemoPhone(demo)}
                      title="Use this phone number"
                    >
                      Fill Number
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="auth-divider mb-16">
          <span>or sign in with mobile number</span>
        </div>

        {/* ── STEP 1: Mobile Number Input ── */}
        {step === 1 && (
          <form className="auth-form" onSubmit={handleSendOtp}>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label htmlFor="mobileNumber" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  📱 Mobile Number
                </label>
                <span className="otp-step-pill">Step 1 of 2</span>
              </div>

              <div className="phone-input-group">
                <div className="phone-country-badge">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  id="mobileNumber"
                  type="tel"
                  className={`form-input phone-input-control ${highlightedField ? 'input-highlighted' : ''}`}
                  placeholder="98765 43210"
                  value={formatPhoneDisplay(phone)}
                  onChange={handlePhoneChange}
                  maxLength={11}
                  autoComplete="tel"
                  required
                  autoFocus
                />
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>
                We will send an SMS with a 6-digit verification code.
              </p>
            </div>

            <button
              id="btn-get-otp"
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading || getCleanPhone(phone).length !== 10}
              style={{ padding: '12px 20px', fontSize: '1rem', fontWeight: 600 }}
            >
              {loading ? '⏳ Sending OTP...' : '📲 Get Verification Code (OTP)'}
            </button>
          </form>
        )}

        {/* ── STEP 2: 6-Digit OTP Verification ── */}
        {step === 2 && (
          <form className="auth-form animate-in" onSubmit={handleVerifySubmit}>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span className="otp-step-pill">Step 2 of 2: Verify</span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-light)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  ✏️ Change Number
                </button>
              </div>

              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Enter the 6-digit code sent to:
                </p>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-white)', letterSpacing: 0.5 }}>
                  🇮🇳 +91 {formatPhoneDisplay(phone)}
                </strong>
              </div>

              {/* 6-digit Segmented Boxes */}
              <div className="otp-boxes-container" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputsRef.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className={`otp-box ${digit ? 'filled' : ''}`}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {/* Demo / In-App OTP helper chip */}
              <div id="btn-autofill-otp" className="otp-demo-badge" onClick={handleAutofillOtp} title="Click to fill automatically">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.1rem' }}>📩</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      SMS Simulation received code:
                    </div>
                    <span className="otp-chip-code">{receivedOtp || '123456'}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary-sm"
                  style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                >
                  ⚡ Autofill OTP
                </button>
              </div>

              {/* Timer & Resend row */}
              <div className="otp-timer-row">
                <span>
                  {timer > 0 ? (
                    <>⏱️ Resend code in <strong style={{ color: 'var(--accent-light)' }}>{timer}s</strong></>
                  ) : (
                    'Did not receive code?'
                  )}
                </span>
                <button
                  type="button"
                  className="otp-resend-btn"
                  onClick={handleResendOtp}
                  disabled={!canResend || loading}
                >
                  🔄 Resend OTP
                </button>
              </div>
            </div>

            <button
              id="btn-verify-otp"
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading || otpDigits.some((d) => !d)}
              style={{ padding: '12px 20px', fontSize: '1rem', fontWeight: 600 }}
            >
              {loading ? '⏳ Verifying...' : '✅ Verify & Log In'}
            </button>
          </form>
        )}

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            🔒 Bank-grade OTP authentication. No passwords required.
          </p>
        </div>

        <p className="auth-switch mt-16">
          <span>Don't have an account? </span>
          <Link to="/register">{t('nav.register')}</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
