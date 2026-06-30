import { useState } from 'react';

const LABOUR_SERVICES = [
  { icon: '🚜', title: 'Tractor Services', desc: 'Hire tractors with operators for plowing, sowing, and harvesting. Available on hourly or daily rates.', rate: '₹800–1,500/hour' },
  { icon: '🌾', title: 'Harvesting Labour', desc: 'Skilled harvesting teams for manual or semi-mechanized harvesting of crops like wheat, rice, and vegetables.', rate: '₹350–600/day per person' },
  { icon: '💧', title: 'Irrigation Workers', desc: 'Experts to set up and operate drip, sprinkler, or flood irrigation systems and maintain channels.', rate: '₹400–700/day' },
  { icon: '🧑‍🌾', title: 'Transplanting Labour', desc: 'Experienced paddy transplanting teams for rice cultivation using manual or mechanical transplanting methods.', rate: '₹500–900/day' },
  { icon: '🌿', title: 'Weeding Teams', desc: 'Manual weeding services to remove invasive weeds that compete with crops for nutrients and water.', rate: '₹300–500/day' },
  { icon: '📦', title: 'Packaging Labour', desc: 'Post-harvest sorting, grading, and packaging workers experienced in handling perishable and dry produce.', rate: '₹400–650/day' },
];

const TOOLS = [
  { icon: '🚜', name: 'Power Tiller', desc: 'For soil preparation in small fields', rental: '₹600–900/day' },
  { icon: '✂️', name: 'Crop Harvester', desc: 'Multi-crop harvesting machine', rental: '₹2,000–4,500/day' },
  { icon: '💦', name: 'Water Pump Set', desc: 'Diesel/electric pump for irrigation', rental: '₹400–700/day' },
  { icon: '🌿', name: 'Sprayer (Knapsack)', desc: 'Pesticide/herbicide application', rental: '₹150–300/day' },
  { icon: '🌱', name: 'Seed Drill', desc: 'Uniform seed sowing machine', rental: '₹800–1,200/day' },
  { icon: '🌾', name: 'Thresher Machine', desc: 'Grain separation from stalks', rental: '₹900–1,800/day' },
  { icon: '🔧', name: 'Rotavator', desc: 'Soil mixing and bed preparation', rental: '₹1,200–2,000/day' },
  { icon: '🏗️', name: 'Leveler / Grader', desc: 'Field leveling for uniform irrigation', rental: '₹1,500–2,500/day' },
];

const PLATFORMS = [
  { name: 'CHC Farm Machinery Portal', desc: 'Government portal for hiring farm machinery through Custom Hiring Centers near you.', link: 'https://chcfarm.gov.in' },
  { name: 'MGNREGS (MGNREGA)', desc: 'Mahatma Gandhi National Rural Employment Guarantee Scheme — guaranteed 100 days of wage employment.', link: 'https://mnregaweb4.nic.in' },
  { name: 'Agri Machine Rental Apps', desc: 'Private apps like AgroStar, Farmart, and Hesa provide marketplace for equipment rental and farm services.', link: '#' },
];

const LabourPage = () => {
  const [activeTab, setActiveTab] = useState('labour');

  return (
    <div>
      <div className="info-hero animate-in">
        <div className="info-hero-icon">👷</div>
        <div>
          <h1>Labour & Tools</h1>
          <p>Find skilled agricultural workers and rent modern farm machinery at affordable rates</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        <button
          className={activeTab === 'labour' ? 'btn btn-primary' : 'btn btn-glass'}
          onClick={() => setActiveTab('labour')}
        >
          👷 Labour Services
        </button>
        <button
          className={activeTab === 'tools' ? 'btn btn-primary' : 'btn btn-glass'}
          onClick={() => setActiveTab('tools')}
        >
          🔧 Farm Equipment
        </button>
        <button
          className={activeTab === 'platforms' ? 'btn btn-primary' : 'btn btn-glass'}
          onClick={() => setActiveTab('platforms')}
        >
          🌐 Where to Hire
        </button>
      </div>

      {activeTab === 'labour' && (
        <div className="grid-2 animate-in">
          {LABOUR_SERVICES.map((s, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div className="info-item-icon">{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-white)', marginBottom: 6 }}>{s.title}</h3>
                  <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: 10 }}>{s.desc}</p>
                  <span className="badge badge-green">💰 {s.rate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tools' && (
        <div className="grid-4 animate-in">
          {TOOLS.map((t, i) => (
            <div key={i} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{t.icon}</div>
              <h3 style={{ fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: 6 }}>{t.name}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 10 }}>{t.desc}</p>
              <span className="badge badge-gold">{t.rental}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'platforms' && (
        <div className="grid-3 animate-in">
          {PLATFORMS.map((p, i) => (
            <div key={i} className="scheme-card">
              <div className="scheme-icon">🌐</div>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <a href={p.link} target="_blank" rel="noopener noreferrer" className="scheme-link">
                Visit Platform →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabourPage;
