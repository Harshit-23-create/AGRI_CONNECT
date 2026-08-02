import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getArticles } from '../services/api';
import { getLocalizedValue } from '../utils/localization';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const KnowledgePage = () => {
  const { t, i18n } = useTranslation(['knowledge', 'common', 'chatbot']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const getLoc = (obj) => getLocalizedValue(obj, i18n.language);

  // Modal State
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categories = [
    { id: 'All', icon: '📚', title: t('knowledge:catAll') },
    { id: 'Soil Management', icon: '🧪', title: t('knowledge:catSoil') },
    { id: 'Pest & Disease Control', icon: '🐛', title: t('knowledge:catPest') },
    { id: 'Water Management', icon: '💧', title: t('knowledge:catWater') },
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const { data } = await getArticles(
          activeCategory !== 'All' ? activeCategory : '',
          search
        );
        setArticles(data);
      } catch {
        toast.error(t('common:error'));
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(() => {
      fetchArticles();
    }, 300);
    return () => clearTimeout(timer);
  }, [activeCategory, search, t]);

  return (
    <div>
      <div className="page-header">
        <h1>{t('knowledge:title')}</h1>
        <p>{t('knowledge:subtitle')}</p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          className="form-input"
          placeholder={t('knowledge:searchPlaceholder', { defaultValue: '🔍 Search articles...' })}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 420 }}
        />
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {categories.map((c) => (
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
          <p style={{ color: 'var(--text-muted)' }}>{t('knowledge:noArticles')}</p>
        </div>
      ) : (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {articles.map((a) => (
            <div key={a._id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelectedArticle(a)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-white)', marginBottom: 8 }}>{getLoc(a.title)}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {typeof getLoc(a.content) === 'string' ? getLoc(a.content).substring(0, 150) : ''}...
                  </p>
                </div>
                <span style={{ color: 'var(--primary-light)', fontSize: '1.2rem' }}>→</span>
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
            <h2 style={{ color: 'var(--text-white)', fontSize: '1.6rem', marginBottom: 16 }}>{getLoc(selectedArticle.title)}</h2>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
              {getLoc(selectedArticle.content)}
            </div>
            <div style={{ marginTop: 32, textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={() => setSelectedArticle(null)}>{t('common:cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Banner */}
      <div className="card mt-32" style={{ textAlign: 'center', padding: '32px' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🤖</div>
        <h3 style={{ color: 'var(--text-white)', marginBottom: 8 }}>{t('knowledge:bottomPromptTitle')}</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: '0.9rem' }}>{t('knowledge:bottomPromptDesc')}</p>
        <Link to="/chat" className="btn btn-primary">{t('knowledge:openChatBtn')}</Link>
      </div>
    </div>
  );
};

export default KnowledgePage;
