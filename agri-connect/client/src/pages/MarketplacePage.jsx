import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getProducts } from '../services/api';
import { getLocalizedValue } from '../utils/localization';
import toast from 'react-hot-toast';

const MarketplacePage = () => {
  const { t, i18n } = useTranslation(['marketplace', 'common']);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  const getLoc = (obj) => getLocalizedValue(obj, i18n.language);

  const CATEGORIES = ['All', 'Grains', 'Vegetables', 'Seeds', 'Fertilizers', 'Pesticides', 'Equipment'];

  // Modal state
  const [selectedSeller, setSelectedSeller] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await getProducts(
          activeCategory !== 'All' ? activeCategory : '',
          search
        );
        setProducts(data);
      } catch {
        toast.error(t('common:error'));
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [activeCategory, search, t]);

  const handleContactClick = (seller) => {
    setSelectedSeller(seller);
  };

  return (
    <div>
      <div className="page-header">
        <h1>{t('marketplace:title')}</h1>
        <p>{t('marketplace:subtitle')}</p>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          className="form-input"
          placeholder={t('marketplace:searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 360 }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={activeCategory === c ? 'btn btn-primary btn-sm' : 'btn btn-glass btn-sm'}
            onClick={() => setActiveCategory(c)}
          >
            {c === 'All' ? t('marketplace:allCategories') : t(`marketplace:cat_${c}`, { defaultValue: c })}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex-center" style={{ minHeight: 200 }}>
          <div className="loader-spinner" />
        </div>
      ) : products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
          <p style={{ color: 'var(--text-muted)' }}>{t('marketplace:noProducts')}</p>
        </div>
      ) : (
        <div className="grid-3">
          {products.map((p) => {
            const pCat = getLoc(p.category);
            return (
              <div key={p._id} className="product-card animate-in">
                <div className="product-img">
                  {pCat === 'Grains' ? '🌾' : pCat === 'Vegetables' ? '🥔' : pCat === 'Seeds' ? '🌽' : pCat === 'Fertilizers' ? '🐄' : pCat === 'Pesticides' ? '🌿' : '⚙️'}
                </div>
                <div className="product-body">
                  <span className="badge badge-green" style={{ marginBottom: 8, fontSize: '0.7rem' }}>{pCat}</span>
                  <h3>{getLoc(p.title)}</h3>
                  <p>🏪 {t('marketplace:seller')}: {getLoc(p.seller?.name)}</p>
                  <p>📦 {getLoc(p.quantity)}</p>
                  <p>⭐ {p.rating}</p>
                  <div className="product-footer" style={{ marginTop: 12 }}>
                    <span className="product-price">{getLoc(p.price)}</span>
                    <button className="btn btn-primary btn-sm" onClick={() => handleContactClick(p.seller)}>
                      {t('marketplace:contactSeller')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Seller Contact Modal */}
      {selectedSeller && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20
        }}>
          <div className="card animate-in" style={{ width: '100%', maxWidth: 400 }}>
            <h2 style={{ color: 'var(--text-white)', marginBottom: 16 }}>📞 {t('marketplace:sellerContactTitle')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <p><strong style={{ color: 'var(--text-secondary)' }}>{t('marketplace:seller')}:</strong> {getLoc(selectedSeller.name)}</p>
              <p><strong style={{ color: 'var(--text-secondary)' }}>{t('marketplace:location')}:</strong> 📍 {getLoc(selectedSeller.location)}</p>
              <p><strong style={{ color: 'var(--text-secondary)' }}>{t('marketplace:phone')}:</strong> 📱 {selectedSeller.phone}</p>
              <p><strong style={{ color: 'var(--text-secondary)' }}>{t('marketplace:email')}:</strong> 📧 {selectedSeller.email}</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href={`tel:${selectedSeller.phone}`} className="btn btn-primary btn-full">
                {t('common:callNow')}
              </a>
              <button className="btn btn-glass btn-full" onClick={() => setSelectedSeller(null)}>
                {t('common:cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
