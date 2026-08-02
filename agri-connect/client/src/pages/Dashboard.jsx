import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n';

const Dashboard = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation(['dashboard', 'common', 'weather', 'crop', 'chatbot', 'marketplace', 'schemes', 'storage', 'labour', 'loans', 'knowledge', 'auth']);

  const activeLang = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  const features = [
    { path: '/weather', icon: '🌤️', title: t('weather:title'), desc: t('weather:subtitle') },
    { path: '/crop', icon: '🌱', title: t('crop:title'), desc: t('crop:subtitle') },
    { path: '/chat', icon: '🤖', title: t('chatbot:title'), desc: t('chatbot:subtitle') },
    { path: '/marketplace', icon: '🛒', title: t('marketplace:title'), desc: t('marketplace:subtitle') },
    { path: '/schemes', icon: '🏛️', title: t('schemes:title'), desc: t('schemes:subtitle') },
    { path: '/storage', icon: '🏭', title: t('storage:title'), desc: t('storage:subtitle') },
    { path: '/labour', icon: '👷', title: t('labour:title'), desc: t('labour:subtitle') },
    { path: '/loans', icon: '💰', title: t('loans:title'), desc: t('loans:subtitle') },
    { path: '/knowledge', icon: '📚', title: t('knowledge:title'), desc: t('knowledge:subtitle') },
  ];

  const stats = [
    { icon: '🌾', value: '10K+', label: t('dashboard:statFarmers') },
    { icon: '🌍', value: '28', label: t('dashboard:statStates') },
    { icon: '🤖', value: '95%', label: t('dashboard:statAccuracy') },
    { icon: '⚡', value: '24/7', label: t('dashboard:statAvailability') },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div className="dashboard-welcome animate-in">
        <h1>{t('dashboard:welcome')}, {user?.username?.split(' ')[0]}! 👋</h1>
        <p>{t('dashboard:subtitle')}</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          <span className="badge badge-green">
            {user?.serviceProvider === 'Yes' ? t('auth:providerRole') : t('auth:farmerRole')}
          </span>
          <span className="badge badge-gold">🗣️ {activeLang.flag} {activeLang.nativeName}</span>
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
          {t('dashboard:quickActions')}
        </h2>
        <p className="text-muted" style={{ fontSize: '0.88rem', marginTop: 4 }}>
          {t('dashboard:subtitle')}
        </p>
      </div>

      <div className="grid-3">
        {features.map((f, i) => (
          <Link key={f.path} to={f.path} className="feature-card animate-in" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="feature-card-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
            <span style={{ color: 'var(--primary-light)', fontSize: '0.82rem', fontWeight: 600, marginTop: 'auto' }}>
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
