const LOAN_TYPES = [
  {
    icon: '🌾',
    title: 'Kisan Credit Card (KCC)',
    bank: 'All Nationalized Banks / Co-op Banks',
    purpose: 'Short-term crop production, post-harvest expenses, allied activities',
    rate: '4% (with interest subvention)',
    maxAmt: 'Up to ₹3 Lakh (no collateral)',
    tenure: '1 year (revolving credit)',
    eligibility: 'Farmers with land records, share croppers, oral lessees',
    highlight: true,
  },
  {
    icon: '🏗️',
    title: 'Agricultural Term Loan',
    bank: 'SBI, PNB, Bank of Baroda, NABARD',
    purpose: 'Purchase of land, farm equipment, irrigation systems, greenhouses',
    rate: '8.5–11% per annum',
    maxAmt: 'Up to ₹25 Lakh (with land collateral)',
    tenure: '5–15 years',
    eligibility: 'Farmers with clear land title or stable income proof',
    highlight: false,
  },
  {
    icon: '🤝',
    title: 'Microfinance / SHG Loans',
    bank: 'Bandhan Bank, Ujjivan, NBFC-MFI',
    purpose: 'Small farm inputs, seeds, livestock, tools for marginal farmers',
    rate: '18–24% per annum',
    maxAmt: '₹50,000–₹1.5 Lakh',
    tenure: '6–24 months',
    eligibility: 'Marginal farmers, women SHG members, BPL families',
    highlight: false,
  },
  {
    icon: '🌳',
    title: 'Horticulture Crop Loan',
    bank: 'NABARD, State Cooperative Banks',
    purpose: 'Fruit orchards, vegetable cultivation, floriculture, spice crops',
    rate: '7–10% per annum',
    maxAmt: 'Up to ₹10 Lakh',
    tenure: '3–7 years',
    eligibility: 'Horticulture farmers with 0.5+ acre land',
    highlight: false,
  },
];

const STEPS = [
  { step: '01', icon: '📋', title: 'Gather Documents', desc: 'Land records (Khasra/Khatauni), Aadhaar, PAN card, bank passbook, passport photos, and 6-month bank statement.' },
  { step: '02', icon: '🏦', title: 'Approach Your Bank', desc: 'Visit the nearest branch of nationalized bank or cooperative bank in your village. Ask for the agricultural loan officer.' },
  { step: '03', icon: '📝', title: 'Submit Application', desc: 'Fill the loan application form with honest details about land area, crops grown, and annual income.' },
  { step: '04', icon: '🔍', title: 'Field Inspection', desc: 'Bank will send an officer to inspect your farm, verify land records, and assess repayment capacity.' },
  { step: '05', icon: '✅', title: 'Approval & Disbursal', desc: 'After verification, loan gets approved. KCC is issued within 14 days; term loans within 30 days of verification.' },
];

const TIPS = [
  'Always repay loans on time — a good CIBIL score gets you better interest rates',
  'Apply under PM Interest Subvention Scheme to reduce KCC rate to 4%',
  'Women farmers often get preferential rates and lower collateral requirements',
  'Join a Farmer Producer Organization (FPO) for group loan benefits',
  'Compare rates across 3+ banks before finalizing any loan',
  'Use the loan only for stated agricultural purpose to avoid penalty',
];

const LoanPage = () => {
  return (
    <div>
      <div className="info-hero animate-in">
        <div className="info-hero-icon">💰</div>
        <div>
          <h1>Loan Assistant</h1>
          <p>Discover the right agricultural credit options and navigate the loan process with ease</p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.4rem', color: 'var(--text-white)', marginBottom: 20 }}>💳 Agricultural Loan Types</h2>
      <div className="grid-2 mb-32">
        {LOAN_TYPES.map((l, i) => (
          <div key={i} className="card" style={{ border: l.highlight ? '1px solid var(--primary-light)' : undefined, position: 'relative' }}>
            {l.highlight && (
              <span className="badge badge-green" style={{ position: 'absolute', top: 16, right: 16 }}>🌟 Recommended</span>
            )}
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>{l.icon}</div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-white)', marginBottom: 4 }}>{l.title}</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 14 }}>🏦 {l.bank}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>📌 Purpose: </span>
                <span style={{ color: 'var(--text-muted)' }}>{l.purpose}</span>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <span className="badge badge-gold">💰 {l.maxAmt}</span>
                <span className="badge badge-blue">📊 {l.rate}</span>
              </div>
              <div style={{ fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>⏳ Tenure: </span>
                <span style={{ color: 'var(--text-muted)' }}>{l.tenure}</span>
              </div>
              <div style={{ fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>✅ Eligible: </span>
                <span style={{ color: 'var(--text-muted)' }}>{l.eligibility}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.4rem', color: 'var(--text-white)', marginBottom: 20 }}>📋 How to Apply — Step by Step</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {STEPS.map((s, i) => (
          <div key={i} className="card" style={{ flexDirection: 'row', display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
              {s.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>STEP {s.step}</span>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-white)' }}>{s.title}</h4>
              </div>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ color: 'var(--text-white)', marginBottom: 16 }}>💡 Smart Loan Tips</h3>
        <div className="grid-2">
          {TIPS.map((t, i) => (
            <div key={i} className="info-item">
              <div className="info-item-icon">💡</div>
              <div className="info-item-text"><p>{t}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoanPage;
