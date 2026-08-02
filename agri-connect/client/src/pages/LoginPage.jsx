import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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

  return (
    <div className="auth-container">
      <div className="auth-card animate-in">
        <div className="auth-logo">
          <span className="logo-icon">🌾</span>
          <h1>{t('nav.login')}</h1>
          <p>{t('dashboard.welcome')} {t('common.appName')}</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{t('profile.email')}</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="farmer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? t('common.loading') : `🔑 ${t('nav.login')}`}
          </button>
        </form>

        <p className="auth-switch mt-16">
          <Link to="/register">{t('nav.register')}</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
