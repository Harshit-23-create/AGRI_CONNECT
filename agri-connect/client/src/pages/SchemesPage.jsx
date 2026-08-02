import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TAGS = ['All', 'Income Support', 'Crop Insurance', 'Irrigation', 'Credit & Loan', 'Soil Health'];

const SchemesPage = () => {
  const { t } = useTranslation(['schemes', 'common']);
  const [activeTag, setActiveTag] = useState('All');

  const SCHEMES = [
    {
      icon: '🌾',
      title: t('schemes:pmKisanTitle'),
      desc: t('schemes:pmKisanDesc'),
      tag: 'Income Support',
      tagLocalized: t('schemes:pmKisanTag'),
      eligibility: t('schemes:pmKisanElig'),
      benefit: t('schemes:pmKisanBen'),
      link: 'https://pmkisan.gov.in',
    },
    {
      icon: '🛡️',
      title: t('schemes:pmfbyTitle'),
      desc: t('schemes:pmfbyDesc'),
      tag: 'Crop Insurance',
      tagLocalized: t('schemes:pmfbyTag'),
      eligibility: t('schemes:pmfbyElig'),
      benefit: t('schemes:pmfbyBen'),
      link: 'https://pmfby.gov.in',
    },
    {
      icon: '💧',
      title: t('schemes:pmksyTitle'),
      desc: t('schemes:pmksyDesc'),
      tag: 'Irrigation',
      tagLocalized: t('schemes:pmksyTag'),
      eligibility: t('schemes:pmksyElig'),
      benefit: t('schemes:pmksyBen'),
      link: 'https://pmksy.gov.in',
    },
    {
      icon: '💰',
      title: t('schemes:kccTitle'),
      desc: t('schemes:kccDesc'),
      tag: 'Credit & Loan',
      tagLocalized: t('schemes:kccTag'),
      eligibility: t('schemes:kccElig'),
      benefit: t('schemes:kccBen'),
      link: 'https://www.nabard.org',
    },
    {
      icon: '🧪',
      title: t('schemes:shcTitle'),
      desc: t('schemes:shcDesc'),
      tag: 'Soil Health',
      tagLocalized: t('schemes:shcTag'),
      eligibility: t('schemes:shcElig'),
      benefit: t('schemes:shcBen'),
      link: 'https://soilhealth.dac.gov.in',
    },
    {
      icon: '🏭',
      title: t('schemes:nfsmTitle'),
      desc: t('schemes:nfsmDesc'),
      tag: 'Food Security',
      tagLocalized: t('schemes:nfsmTag'),
      eligibility: t('schemes:nfsmElig'),
      benefit: t('schemes:nfsmBen'),
      link: 'https://nfsm.gov.in',
    },
  ];

  const filtered = activeTag === 'All' ? SCHEMES : SCHEMES.filter((s) => s.tag === activeTag);

  return (
    <div>
      <div className="page-header">
        <h1>{t('schemes:title')}</h1>
        <p>{t('schemes:subtitle')}</p>
      </div>

      {/* Filter Tags */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {TAGS.map((tag) => {
          const schemeForTag = SCHEMES.find(s => s.tag === tag);
          const localizedTagName = tag === 'All' ? t('common:nav.schemes') : (schemeForTag ? schemeForTag.tagLocalized : tag);
          return (
            <button
              key={tag}
              className={activeTag === tag ? 'btn btn-accent btn-sm' : 'btn btn-glass btn-sm'}
              onClick={() => setActiveTag(tag)}
            >
              {localizedTagName}
            </button>
          );
        })}
      </div>

      <div className="grid-3">
        {filtered.map((s, i) => (
          <div key={i} className="scheme-card animate-in" style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="scheme-icon">{s.icon}</div>
            <span className="scheme-tag">{s.tagLocalized}</span>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                👥 <strong>{t('schemes:eligibility')}:</strong> {s.eligibility}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>
                🎁 <strong>{t('schemes:benefits')}:</strong> {s.benefit}
              </span>
            </div>
            <a href={s.link} target="_blank" rel="noopener noreferrer" className="scheme-link">
              {t('schemes:applyNow')} →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemesPage;
