import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', icon: '🏠', key: 'common:nav.dashboard' },
    { path: '/weather', icon: '🌤️', key: 'common:nav.weather' },
    { path: '/crop', icon: '🌱', key: 'common:nav.crop' },
    { path: '/chat', icon: '🤖', key: 'common:nav.chat' },
    { path: '/marketplace', icon: '🛒', key: 'common:nav.marketplace' },
    { path: '/schemes', icon: '🏛️', key: 'common:nav.schemes' },
    { path: '/storage', icon: '🏭', key: 'common:nav.storage' },
    { path: '/labour', icon: '👷', key: 'common:nav.labour' },
    { path: '/loans', icon: '💰', key: 'common:nav.loans' },
    { path: '/knowledge', icon: '📚', key: 'common:nav.knowledge' },
    { path: '/profile', icon: '👤', key: 'common:nav.profile' },
  ];

  const handleLogout = async () => {
    await logout();
    toast.success(t('common:success'));
    navigate('/login');
    onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Nav Items */}
        <nav className="sidebar-nav">
          {navItems.map(({ path, icon, key }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`
              }
              onClick={onClose}
            >
              <span className="sidebar-icon">{icon}</span>
              <span className="sidebar-label">{t(key)}</span>
            </NavLink>
          ))}
        </nav>

        {/* User info + Logout at bottom */}
        {user && (
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{user.username}</p>
              <p className="sidebar-user-role">
                {user.serviceProvider === 'Yes' ? t('common:serviceProvider') : t('common:farmer')}
              </p>
            </div>
            <button
              className="sidebar-logout-btn"
              onClick={handleLogout}
              title={t('common:nav.logout')}
            >
              ⏻
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
