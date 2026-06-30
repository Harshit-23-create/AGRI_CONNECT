const STORAGE_TYPES = [
  {
    icon: '🏭',
    title: 'Cold Storage',
    desc: 'Maintain freshness of perishables like fruits, vegetables, dairy, and flowers at controlled temperatures (2–8°C).',
    tips: ['Check the cold chain certificate', 'Ideal for potatoes, onions, apples', 'Reduces post-harvest losses by 40%'],
  },
  {
    icon: '🌾',
    title: 'Grain Silos',
    desc: 'Cylindrical towers ideal for bulk storage of dry grains like wheat, rice, maize, and pulses at optimum moisture.',
    tips: ['Maintain moisture below 14%', 'Use hermetic storage to avoid pests', 'Regular temperature monitoring needed'],
  },
  {
    icon: '📦',
    title: 'Warehouse Storage',
    desc: 'General-purpose storage for packaged goods, seeds, fertilizers, and equipment with loading/unloading facilities.',
    tips: ['Stack products on pallets off the floor', 'FIFO (first in, first out) rotation', 'Ensure proper ventilation'],
  },
  {
    icon: '🛢️',
    title: 'Underground Storage (Pits)',
    desc: 'Traditional, low-cost storage for root vegetables like yam, potato, carrot in sealed earthen pits.',
    tips: ['Line pit with dry grass or sand', 'Cover with soil to regulate temperature', 'Inspect every 2–3 weeks'],
  },
];

const PROCESSING = [
  { icon: '⚙️', title: 'Rice Milling', desc: 'Removes husk and bran to produce white rice. Modern mills achieve 65–70% milling recovery with minimal breakage.' },
  { icon: '🫙', title: 'Food Canning & Preservation', desc: 'Extends shelf life of vegetables, fruits, and pulses through thermal processing, vacuum sealing, and preservatives.' },
  { icon: '🌿', title: 'Spice Grinding & Blending', desc: 'Processes raw spices into powders or blended masalas using grinding, drying, and packaging equipment.' },
  { icon: '🥜', title: 'Oil Extraction', desc: 'Extracts edible oils from oilseeds (groundnut, mustard, sunflower) using mechanical expellers or solvent extraction.' },
  { icon: '🍅', title: 'Tomato/Vegetable Processing', desc: 'Converts fresh produce into pastes, purees, juices, or dried products for longer shelf life and value addition.' },
  { icon: '🌽', title: 'Starch & Ethanol Production', desc: 'Transforms maize, cassava, and potatoes into industrial starch or biofuel, adding significant economic value.' },
];

const GOVT_SCHEMES = [
  { title: 'PMKVY (Cold Chain)', desc: 'Integrated cold chain development for preserving agricultural produce.' },
  { title: 'MIDH Scheme', desc: 'Mission for Integrated Development of Horticulture — post-harvest management.' },
  { title: 'RKVY Storage Grant', desc: 'Rashtriya Krishi Vikas Yojana provides grants for storage infrastructure.' },
];

const StoragePage = () => {
  return (
    <div>
      <div className="info-hero animate-in">
        <div className="info-hero-icon">🏭</div>
        <div>
          <h1>Storage & Processing</h1>
          <p>Reduce post-harvest losses and add value to your produce with modern storage and processing solutions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-32">
        {[
          ['30–40%', 'Post-harvest losses in India annually'],
          ['₹92,000 Cr', 'Annual value lost due to poor storage'],
          ['8–10°C', 'Ideal cold storage for most vegetables'],
          ['14%', 'Maximum moisture content for safe grain storage'],
        ].map(([v, l], i) => (
          <div key={i} className="stat-card">
            <div className="stat-info">
              <h3 style={{ fontSize: '1.3rem' }}>{v}</h3>
              <p>{l}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ marginBottom: 16, fontSize: '1.4rem', color: 'var(--text-white)' }}>📦 Storage Types</h2>
      <div className="grid-2 mb-32">
        {STORAGE_TYPES.map((s, i) => (
          <div key={i} className="card animate-in">
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>{s.icon}</div>
            <h3 style={{ color: 'var(--text-white)', marginBottom: 8 }}>{s.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', marginBottom: 12 }}>{s.desc}</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {s.tips.map((t, j) => (
                <li key={j} style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', display: 'flex', gap: 8 }}>
                  <span style={{ color: 'var(--primary-light)' }}>✓</span> {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 style={{ marginBottom: 16, fontSize: '1.4rem', color: 'var(--text-white)' }}>⚙️ Value Addition & Processing</h2>
      <div className="grid-3 mb-32">
        {PROCESSING.map((p, i) => (
          <div key={i} className="info-item animate-in">
            <div className="info-item-icon">{p.icon}</div>
            <div className="info-item-text">
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ marginBottom: 16, fontSize: '1.4rem', color: 'var(--text-white)' }}>🏛️ Government Support</h2>
      <div className="grid-3">
        {GOVT_SCHEMES.map((s, i) => (
          <div key={i} className="card" style={{ borderColor: 'rgba(245,166,35,0.3)' }}>
            <span className="badge badge-gold" style={{ marginBottom: 8 }}>Scheme</span>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: 6 }}>{s.title}</h3>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoragePage;
