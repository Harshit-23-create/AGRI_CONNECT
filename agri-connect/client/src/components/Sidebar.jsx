import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/weather', icon: '🌤️', label: 'Weather' },
  { path: '/crop', icon: '🌱', label: 'Crop Advisor' },
  { path: '/chat', icon: '🤖', label: 'AI Chat' },
  { path: '/marketplace', icon: '🛒', label: 'Marketplace' },
  { path: '/schemes', icon: '🏛️', label: 'Gov. Schemes' },
  { path: '/storage', icon: '🏭', label: 'Storage' },
  { path: '/labour', icon: '👷', label: 'Labour & Tools' },
  { path: '/loans', icon: '💰', label: 'Loan Assistant' },
  { path: '/knowledge', icon: '📚', label: 'Knowledge Hub' },
  { path: '/profile', icon: '👤', label: 'Profile' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
    onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Nav Items */}
        <nav className="sidebar-nav">
          {navItems.map(({ path, icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`
              }
              onClick={onClose}
            >
              <span className="sidebar-icon">{icon}</span>
              <span className="sidebar-label">{label}</span>
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
                {user.serviceProvider === 'Yes' ? 'Service Provider' : 'Farmer'}
              </p>
            </div>
            <button
              className="sidebar-logout-btn"
              onClick={handleLogout}
              title="Logout"
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
