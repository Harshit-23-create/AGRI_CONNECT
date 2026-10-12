import { useState } from 'react';
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
    email: 'farmer.demo@agriconnect.org',
    password: 'FarmerDemo@2025',
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
    email: 'buyer.demo@agriconnect.org',
    password: 'BuyerDemo@2025',
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
    email: 'partner.demo@agriconnect.org',
    password: 'PartnerDemo@2025',
    serviceProvider: 'Yes',
    language: 'pa',
    features: 'Warehouse Depot • Tractor Rentals',
    avatar: '🚚',
  },
];

const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoadingId, setDemoLoadingId] = useState(null);
  const [highlightedField, setHighlightedField] = useState(false);

  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success(t('common.success'));
      navigate('/dashboard');
    } catch (err) {
      console.error('Login Error:', err);
      const msg = err?.response?.data?.message || err.message || t('common.error');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Instant 1-Click Demo Login
  const handleQuickDemoLogin = async (demoUser) => {
    setError('');
    setDemoLoadingId(demoUser.id);
    try {
      await loginAsDemo(demoUser);
      toast.success(`Welcome, ${demoUser.username}! (${demoUser.badge})`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Demo Login Error:', err);
      toast.error('Could not complete demo login. Please try again.');
    } finally {
      setDemoLoadingId(null);
    }
  };

  // Autofill credentials into the form
  const handleAutofill = (demoUser) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setError('');
    setHighlightedField(true);
    toast('Credentials filled! Click "Sign In" or use 1-Click Login.', {
      icon: '✨',
    });
    setTimeout(() => setHighlightedField(false), 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-in" style={{ maxWidth: 480 }}>
        <div className="auth-logo">
          <span className="logo-icon">🌾</span>
          <h1>{t('nav.login')}</h1>
          <p>{t('dashboard.welcome')} {t('common.appName')}</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* ── Demo Accounts Section ── */}
        <div className="demo-accounts-box mb-24">
          <div className="demo-accounts-header">
            <div className="flex items-center gap-8">
              <span className="demo-sparkle-icon">⚡</span>
              <div>
                <h3 className="demo-title">Demo User Profiles</h3>
                <p className="demo-subtitle">Instant 1-click login for evaluation</p>
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
                      <span className="demo-features-hint">{demo.features}</span>
                    </div>
                  </div>

                  <div className="demo-action-buttons">
                    <button
                      type="button"
                      className="btn btn-primary-sm demo-quick-btn"
                      onClick={() => handleQuickDemoLogin(demo)}
                      disabled={loading || Boolean(demoLoadingId)}
                    >
                      {isThisDemoLoading ? 'Logging in...' : '⚡ Quick Login'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-sm demo-autofill-btn"
                      onClick={() => handleAutofill(demo)}
                      title="Autofill this profile's credentials"
                    >
                      Fill Form
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="auth-divider mb-16">
          <span>or sign in manually</span>
        </div>

        {/* Standard Manual Login Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{t('profile.email')}</label>
            <input
              id="email"
              type="email"
              className={`form-input ${highlightedField ? 'input-highlighted' : ''}`}
              placeholder="farmer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="password-toggle-link"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? '🙈 Hide' : '👁️ Show'}
              </button>
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input ${highlightedField ? 'input-highlighted' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || Boolean(demoLoadingId)}
          >
            {loading ? t('common.loading') : `🔑 ${t('nav.login')}`}
          </button>
        </form>

        <p className="auth-switch mt-16">
          <span>Don't have an account? </span>
          <Link to="/register">{t('nav.register')}</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
