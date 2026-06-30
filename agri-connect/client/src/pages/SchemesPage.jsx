import { useState } from 'react';

const SCHEMES = [
  {
    icon: '🌾',
    title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    desc: 'Direct income support of ₹6,000 per year to all farmer families in three equal installments of ₹2,000.',
    tag: 'Income Support',
    eligibility: 'All landholding farmer families',
    benefit: '₹6,000/year',
    link: 'https://pmkisan.gov.in',
  },
  {
    icon: '🛡️',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    desc: 'Crop insurance scheme that provides financial support to farmers suffering crop loss due to natural calamities.',
    tag: 'Crop Insurance',
    eligibility: 'All farmers growing notified crops',
    benefit: 'Up to full crop loss coverage',
    link: 'https://pmfby.gov.in',
  },
  {
    icon: '💧',
    title: 'PM Krishi Sinchayee Yojana (PMKSY)',
    desc: 'Ensures water to every field with mission "Har Khet Ko Pani" and promotes water use efficiency via "More Crop Per Drop".',
    tag: 'Irrigation',
    eligibility: 'Farmers with irrigable land',
    benefit: 'Subsidy on drip/sprinkler systems',
    link: 'https://pmksy.gov.in',
  },
  {
    icon: '💰',
    title: 'Kisan Credit Card (KCC)',
    desc: 'Provides adequate and timely credit support for farmers for their cultivation and non-farm activities.',
    tag: 'Credit & Loan',
    eligibility: 'All farmer landholders',
    benefit: 'Loans at 4-7% interest rate',
    link: 'https://www.nabard.org',
  },
  {
    icon: '🧪',
    title: 'Soil Health Card Scheme',
    desc: 'Provides soil health cards to farmers with crop-wise recommendations for nutrients and fertilizers required.',
    tag: 'Soil Health',
    eligibility: 'All farmers',
    benefit: 'Free soil testing & advisory',
    link: 'https://soilhealth.dac.gov.in',
  },
  {
    icon: '🏭',
    title: 'National Food Security Mission (NFSM)',
    desc: 'Enhances production of rice, wheat, pulses and coarse cereals through area expansion and productivity enhancement.',
    tag: 'Food Security',
    eligibility: 'Farmers in selected districts',
    benefit: 'Subsidized seeds, inputs & training',
    link: 'https://nfsm.gov.in',
  },
  {
    icon: '🌿',
    title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    desc: 'Promotes organic farming through adoption of organic village, cluster approach, and PGS certification.',
    tag: 'Organic Farming',
    eligibility: 'Farmers interested in organic farming',
    benefit: '₹50,000/hectare over 3 years',
    link: 'https://pgsindia-ncof.gov.in',
  },
  {
    icon: '📊',
    title: 'eNAM (National Agriculture Market)',
    desc: 'Online trading platform for agricultural commodities that promotes pan-India trade and better prices.',
    tag: 'Digital Market',
    eligibility: 'Registered farmers with Aadhaar',
    benefit: 'Direct market access, better prices',
    link: 'https://enam.gov.in',
  },
  {
    icon: '🐄',
    title: 'Rashtriya Gokul Mission',
    desc: 'Development and conservation of indigenous bovine breeds through breed improvement program.',
    tag: 'Animal Husbandry',
    eligibility: 'Farmers with cattle',
    benefit: 'Subsidies for breed improvement',
    link: 'https://dahd.nic.in',
  },
];

const TAGS = ['All', 'Income Support', 'Crop Insurance', 'Irrigation', 'Credit & Loan', 'Soil Health', 'Organic Farming', 'Digital Market', 'Animal Husbandry'];

const SchemesPage = () => {
  const [activeTag, setActiveTag] = useState('All');

  const filtered = activeTag === 'All' ? SCHEMES : SCHEMES.filter((s) => s.tag === activeTag);

  return (
    <div>
      <div className="page-header">
        <h1>🏛️ Government Schemes</h1>
        <p>Explore all agricultural schemes, subsidies, and welfare programs for Indian farmers</p>
      </div>

      {/* Alert Banner */}
      <div style={{
        padding: '14px 20px',
        background: 'rgba(245,166,35,0.12)',
        border: '1px solid rgba(245,166,35,0.3)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 28,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '1.3rem' }}>💡</span>
        <p style={{ color: '#ffd54f', fontSize: '0.88rem' }}>
          Visit the official government portals for latest updates and to apply for these schemes. Having your Aadhaar, land records, and bank details ready will speed up the process.
        </p>
      </div>

      {/* Filter Tags */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {TAGS.map((t) => (
          <button
            key={t}
            className={activeTag === t ? 'btn btn-accent btn-sm' : 'btn btn-glass btn-sm'}
            onClick={() => setActiveTag(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid-3">
        {filtered.map((s, i) => (
          <div key={i} className="scheme-card animate-in" style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="scheme-icon">{s.icon}</div>
            <span className="scheme-tag">{s.tag}</span>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                👥 <strong>Eligible:</strong> {s.eligibility}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>
                🎁 <strong>Benefit:</strong> {s.benefit}
              </span>
            </div>
            <a href={s.link} target="_blank" rel="noopener noreferrer" className="scheme-link">
              Visit Official Site →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemesPage;
