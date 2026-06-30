import { useState, useEffect } from 'react';
import { getArticles } from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'All', icon: '📚', title: 'All Topics' },
  { id: 'Soil Management', icon: '🧪', title: 'Soil Management' },
  { id: 'Pest & Disease Control', icon: '🐛', title: 'Pest & Disease Control' },
  { id: 'Water Management', icon: '💧', title: 'Water Management' },
  { id: 'Modern Farming', icon: '🤖', title: 'Modern Farming' },
  { id: 'Climate-Smart Farming', icon: '🌍', title: 'Climate-Smart Farming' },
];

const KnowledgePage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const { data } = await getArticles(
          activeCategory !== 'All' ? activeCategory : '',
          search
        );
        setArticles(data);
      } catch (err) {
        toast.error('Failed to load articles');
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(() => {
      fetchArticles();
    }, 300);
    return () => clearTimeout(timer);
  }, [activeCategory, search]);

  return (
    <div>
      <div className="page-header">
        <h1>📚 Knowledge Hub</h1>
        <p>Learn modern farming techniques, best practices, and scientific approaches to boost your yield</p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={activeCategory === c.id ? 'btn btn-primary' : 'btn btn-glass'}
            onClick={() => setActiveCategory(c.id)}
          >
            {c.icon} {c.title}
          </button>
        ))}
      </div>

      {/* Articles List */}
      {loading ? (
        <div className="flex-center" style={{ minHeight: 200 }}>
          <div className="loader-spinner" />
        </div>
      ) : articles.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📚</div>
          <p style={{ color: 'var(--text-muted)' }}>No articles found matching your search</p>
        </div>
      ) : (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {articles.map((a) => (
            <div key={a._id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelectedArticle(a)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-white)', marginBottom: 8 }}>{a.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {a.content}
                  </p>
                </div>
                <span style={{ color: 'var(--primary-light)', fontSize: '1.2rem', flexShrink: 0 }}>→</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <span className="badge badge-green">📖 {a.category}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>⏱️ {a.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Modal */}
      {selectedArticle && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20
        }}>
          <div className="card animate-in" style={{ width: '100%', maxWidth: 700, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <span className="badge badge-green">{selectedArticle.category}</span>
                  <span className="badge badge-blue">{selectedArticle.readTime}</span>
                </div>
                <h2 style={{ color: 'var(--text-white)', fontSize: '1.6rem', margin: 0 }}>{selectedArticle.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
              {selectedArticle.content}
            </div>

            <div style={{ marginTop: 32, textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={() => setSelectedArticle(null)}>Close Article</button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Banner */}
      <div className="card mt-32" style={{
        background: 'linear-gradient(135deg, rgba(26,122,74,0.3), rgba(26,122,74,0.1))',
        border: '1px solid var(--primary)',
        textAlign: 'center',
        padding: '32px',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🤖</div>
        <h3 style={{ color: 'var(--text-white)', marginBottom: 8 }}>Have a specific question?</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: '0.9rem' }}>
          Ask AgriBot — our AI assistant powered by Google Gemini — for instant personalized answers
        </p>
        <Link to="/chat" className="btn btn-primary">Open AgriBot Chat →</Link>
      </div>
    </div>
  );
};

export default KnowledgePage;
