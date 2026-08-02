import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
  const { t } = useTranslation('landing');

  const features = [
    { icon: '🌤️', title: t('featWeatherTitle'), desc: t('featWeatherDesc') },
    { icon: '🌱', title: t('featCropTitle'), desc: t('featCropDesc') },
    { icon: '🤖', title: t('featAiTitle'), desc: t('featAiDesc') },
    { icon: '🛒', title: t('featMarketTitle'), desc: t('featMarketDesc') },
    { icon: '🏛️', title: t('featSchemesTitle'), desc: t('featSchemesDesc') },
    { icon: '📚', title: t('featKnowledgeTitle'), desc: t('featKnowledgeDesc') },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge">
            {t('heroBadge')}
          </div>
          <h1 className="hero-title">
            {t('heroTitleLine1')}<br />
            <span className="highlight">{t('heroTitleLine2')}</span>
          </h1>
          <p className="hero-subtitle">
            {t('heroSubtitle')}
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">
              {t('getStarted')}
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              {t('signIn')}
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="num">10K+</div>
              <div className="lbl">{t('statFarmers')}</div>
            </div>
            <div className="hero-stat">
              <div className="num">28</div>
              <div className="lbl">{t('statStates')}</div>
            </div>
            <div className="hero-stat">
              <div className="num">95%</div>
              <div className="lbl">{t('statAccuracy')}</div>
            </div>
            <div className="hero-stat">
              <div className="num">24/7</div>
              <div className="lbl">{t('statSupport')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="features-title">{t('featuresTitle')}</h2>
        <p className="features-subtitle">
          {t('featuresSubtitle')}
        </p>
        <div className="grid-3">
          {features.map((f, i) => (
            <div key={i} className="card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '8px' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(26,122,74,0.15), transparent)',
        borderTop: '1px solid var(--border)',
      }}>
        <h2 style={{
          fontSize: '2.2rem',
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #fff, var(--primary-light))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {t('ctaTitle')}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1rem' }}>
          {t('ctaSubtitle')}
        </p>
        <Link to="/register" className="btn btn-accent btn-lg">
          {t('ctaBtn')}
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
