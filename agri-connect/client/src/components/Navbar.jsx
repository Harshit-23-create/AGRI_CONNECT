import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useState } from 'react';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success(t('common:success'));
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to={user ? '/dashboard' : '/'} className="navbar-brand">
        <span className="brand-icon">🌾</span>
        <span className="brand-text">{t('common:appName')}</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <LanguageSelector />

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {user ? (
          <>
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {t('common:nav.dashboard')}
            </Link>
            <Link
              to="/profile"
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-avatar">{user.username?.charAt(0).toUpperCase()}</span>
              {t('common:nav.profile')}
            </Link>
            <button className="btn btn-outline-sm" onClick={handleLogout}>
              {t('common:nav.logout')}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
              {t('common:nav.login')}
            </Link>
            <Link to="/register" className="btn btn-primary-sm" onClick={() => setMenuOpen(false)}>
              {t('common:nav.register')}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
