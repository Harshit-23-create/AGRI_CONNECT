import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { path: '/weather', icon: '🌤️', title: 'Weather', desc: 'Real-time forecasts for your location' },
  { path: '/crop', icon: '🌱', title: 'Crop Advisor', desc: 'AI crop recommendations by soil data' },
  { path: '/chat', icon: '🤖', title: 'AgriBot AI', desc: 'Get instant farming guidance' },
  { path: '/marketplace', icon: '🛒', title: 'Marketplace', desc: 'Buy & sell agricultural produce' },
  { path: '/schemes', icon: '🏛️', title: 'Gov. Schemes', desc: 'Explore subsidies and welfare plans' },
  { path: '/storage', icon: '🏭', title: 'Storage', desc: 'Storage and processing solutions' },
  { path: '/labour', icon: '👷', title: 'Labour & Tools', desc: 'Hire workers and rent equipment' },
  { path: '/loans', icon: '💰', title: 'Loan Assistant', desc: 'Discover agricultural loan options' },
  { path: '/knowledge', icon: '📚', title: 'Knowledge Hub', desc: 'Modern farming tips & techniques' },
];

const stats = [
  { icon: '🌾', value: '10K+', label: 'Farmers Registered' },
  { icon: '🌍', value: '28', label: 'States Covered' },
  { icon: '🤖', value: '95%', label: 'Crop Accuracy' },
  { icon: '⚡', value: '24/7', label: 'AI Availability' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div>
      {/* Welcome Banner */}
      <div className="dashboard-welcome animate-in">
        <h1>{greeting}, {user?.username?.split(' ')[0]}! 👋</h1>
        <p>Here's your AgriConnect dashboard. Explore all the tools available to grow your farm.</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          <span className="badge badge-green">
            {user?.serviceProvider === 'Yes' ? '✅ Service Provider' : '🌾 Farmer'}
          </span>
          <span className="badge badge-gold">🗣️ {user?.language?.toUpperCase()}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-24">
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-info">
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Grid */}
      <div className="page-header">
        <h2 style={{ fontSize: '1.4rem', background: 'linear-gradient(135deg, var(--text-white), var(--primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          All Features
        </h2>
        <p className="text-muted" style={{ fontSize: '0.88rem', marginTop: 4 }}>
          Click any card to get started
        </p>
      </div>

      <div className="grid-3">
        {features.map((f, i) => (
          <Link key={f.path} to={f.path} className="feature-card animate-in" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="feature-card-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
            <span style={{ color: 'var(--primary-light)', fontSize: '0.82rem', fontWeight: 600, marginTop: 'auto' }}>
              Open →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
