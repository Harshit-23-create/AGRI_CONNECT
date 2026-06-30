import { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Grains', 'Vegetables', 'Seeds', 'Fertilizers', 'Pesticides', 'Equipment'];

const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
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
      } catch (err) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    // Simple debounce
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [activeCategory, search]);

  const handleContactClick = (seller) => {
    setSelectedSeller(seller);
  };

  return (
    <div>
      <div className="page-header">
        <h1>🛒 Marketplace</h1>
        <p>Connect directly with farmers, suppliers, and agricultural businesses across India</p>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Search products or sellers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 360 }}
        />
        <button className="btn btn-primary btn-sm" onClick={() => toast('Listing feature coming soon!', { icon: '🚧' })}>+ List Your Product</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={activeCategory === c ? 'btn btn-primary btn-sm' : 'btn btn-glass btn-sm'}
            onClick={() => setActiveCategory(c)}
          >
            {c}
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
          <p style={{ color: 'var(--text-muted)' }}>No products found matching your search</p>
        </div>
      ) : (
        <div className="grid-3">
          {products.map((p) => (
            <div key={p._id} className="product-card animate-in">
              <div className="product-img">
                {p.category === 'Grains' ? '🌾' : p.category === 'Vegetables' ? '🥔' : p.category === 'Seeds' ? '🌽' : p.category === 'Fertilizers' ? '🐄' : p.category === 'Pesticides' ? '🌿' : '⚙️'}
              </div>
              <div className="product-body">
                <span className="badge badge-green" style={{ marginBottom: 8, fontSize: '0.7rem' }}>{p.category}</span>
                <h3>{p.title}</h3>
                <p>🏪 {p.seller.name}</p>
                <p>📦 {p.quantity}</p>
                <p>⭐ {p.rating}</p>
                <div className="product-footer" style={{ marginTop: 12 }}>
                  <span className="product-price">{p.price}</span>
                  <button className="btn btn-primary btn-sm" onClick={() => handleContactClick(p.seller)}>
                    Contact Seller
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Seller Contact Modal */}
      {selectedSeller && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20
        }}>
          <div className="card animate-in" style={{ width: '100%', maxWidth: 400 }}>
            <h2 style={{ color: 'var(--text-white)', marginBottom: 16 }}>📞 Seller Contact</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <p><strong style={{ color: 'var(--text-secondary)' }}>Name:</strong> {selectedSeller.name}</p>
              <p><strong style={{ color: 'var(--text-secondary)' }}>Location:</strong> 📍 {selectedSeller.location}</p>
              <p><strong style={{ color: 'var(--text-secondary)' }}>Phone:</strong> 📱 {selectedSeller.phone}</p>
              <p><strong style={{ color: 'var(--text-secondary)' }}>Email:</strong> 📧 {selectedSeller.email}</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href={`tel:${selectedSeller.phone}`} className="btn btn-primary btn-full">
                Call Now
              </a>
              <button className="btn btn-glass btn-full" onClick={() => setSelectedSeller(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
