import { Link } from 'react-router-dom';

const features = [
  { icon: '🌤️', title: 'Weather Intelligence', desc: 'Real-time forecasts and 5-day predictions tailored for your farm location.' },
  { icon: '🌱', title: 'Crop Advisor', desc: 'AI-powered crop recommendations based on soil nutrients and climate data.' },
  { icon: '🤖', title: 'AgriBot AI', desc: 'Gemini-powered chatbot giving instant expert farming guidance 24/7.' },
  { icon: '🛒', title: 'Marketplace', desc: 'Connect directly with buyers and sellers to get the best prices for produce.' },
  { icon: '🏛️', title: 'Gov. Schemes', desc: 'Explore all government subsidies, loans, and agricultural schemes.' },
  { icon: '📚', title: 'Knowledge Hub', desc: 'Learn modern farming techniques, pest control, and best practices.' },
];

const LandingPage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge">
            🏆 Smart India Hackathon 2024 Project
          </div>
          <h1 className="hero-title">
            Empowering India's<br />
            <span className="highlight">Farmers with AI</span>
          </h1>
          <p className="hero-subtitle">
            A one-stop digital platform connecting farmers to weather intelligence,
            AI-powered crop recommendations, government schemes, and marketplace — all in one place.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">
              🚀 Get Started Free
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Sign In
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="num">10K+</div>
              <div className="lbl">Farmers Served</div>
            </div>
            <div className="hero-stat">
              <div className="num">28</div>
              <div className="lbl">States Covered</div>
            </div>
            <div className="hero-stat">
              <div className="num">95%</div>
              <div className="lbl">Crop Accuracy</div>
            </div>
            <div className="hero-stat">
              <div className="num">24/7</div>
              <div className="lbl">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="features-title">Everything a Farmer Needs</h2>
        <p className="features-subtitle">
          Powered by cutting-edge AI and real-time data to transform your farm's productivity
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
          Ready to Transform Your Farm?
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1rem' }}>
          Join thousands of farmers already using AgriConnect
        </p>
        <Link to="/register" className="btn btn-accent btn-lg">
          🌾 Start for Free Today
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
