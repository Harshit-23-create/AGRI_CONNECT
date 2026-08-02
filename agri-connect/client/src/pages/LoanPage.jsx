import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const LoanPage = () => {
  const { t } = useTranslation(['loans', 'common']);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [eligForm, setEligForm] = useState({
    name: '', age: '', landArea: '', annualIncome: '', creditScore: '',
  });
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [applyForm, setApplyForm] = useState({ name: '', phone: '', bank: '', branch: '' });
  const [applying, setApplying] = useState(false);
  const [showApply, setShowApply] = useState(false);

  const LOAN_TYPES = [
    {
      icon: '🌾',
      title: t('loans:kccTitle'),
      bank: t('loans:kccBank'),
      purpose: t('loans:kccDesc'),
      rate: t('loans:kccRate'),
      maxAmt: t('loans:kccAmt'),
      highlight: true,
      minAge: 18,
      maxAge: 65,
      minLand: 0.5,
      rateNum: 4,
      link: 'https://www.nabard.org/content1.aspx?id=21',
    },
    {
      icon: '🏗️',
      title: t('loans:termLoanTitle'),
      bank: t('loans:termLoanBank'),
      purpose: t('loans:termLoanDesc'),
      rate: t('loans:termLoanRate'),
      maxAmt: t('loans:termLoanAmt'),
      highlight: false,
      minAge: 21,
      maxAge: 60,
      minLand: 1,
      rateNum: 7,
      link: 'https://www.nabard.org',
    },
  ];

  const checkEligibility = (e) => {
    e.preventDefault();
    setChecking(true);
    setResult(null);
    setTimeout(() => {
      const age = parseInt(eligForm.age);
      const land = parseFloat(eligForm.landArea);
      const income = parseInt(eligForm.annualIncome);

      const ageOk = age >= selectedLoan.minAge && age <= selectedLoan.maxAge;
      const landOk = land >= selectedLoan.minLand;
      const incomeOk = income >= 50000;

      if (ageOk && landOk && incomeOk) {
        const maxLoan = Math.min(land * 100000, 300000);
        setResult({
          eligible: true,
          message: `🎉 You are eligible for ${selectedLoan.title}!`,
          details: [
            `✅ Estimated loan amount: ₹${maxLoan.toLocaleString('en-IN')}`,
            `✅ Interest rate: ${selectedLoan.rate}`,
            `✅ Processing time: 7–14 working days`,
            `✅ Collateral: Agricultural land documents (${eligForm.landArea} acres)`,
          ],
        });
      } else {
        const reasons = [];
        if (!ageOk) reasons.push(`Age must be ${selectedLoan.minAge}–${selectedLoan.maxAge} years`);
        if (!landOk) reasons.push(`Minimum land holding: ${selectedLoan.minLand} acres`);
        if (!incomeOk) reasons.push('Annual income should be ₹50,000+');
        setResult({
          eligible: false,
          message: '❌ You may not be currently eligible.',
          details: reasons.map(r => `⚠️ ${r}`),
        });
      }
      setChecking(false);
    }, 1800);
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (!applyForm.name || !applyForm.phone || !applyForm.bank) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      setShowApply(false);
      setSelectedLoan(null);
      setResult(null);
      toast.success(`✅ Application submitted for ${selectedLoan?.title}! Your application ID is AGR-${Math.floor(Math.random()*900000+100000)}. You will be contacted within 3 business days.`);
    }, 1800);
  };

  return (
    <div>
      <div className="info-hero animate-in">
        <div className="info-hero-icon">💰</div>
        <div>
          <h1>{t('loans:title')}</h1>
          <p>{t('loans:subtitle')}</p>
        </div>
      </div>

      <div className="grid-2 mb-32">
        {LOAN_TYPES.map((l, i) => (
          <div key={i} className="card" style={{ border: l.highlight ? '1px solid var(--primary-light)' : undefined }}>
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>{l.icon}</div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-white)', marginBottom: 4 }}>{l.title}</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 14 }}>🏦 {l.bank}</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>{l.purpose}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="badge badge-gold">💰 {l.maxAmt}</span>
                <span className="badge badge-blue">📊 {t('loans:interestRate')}: {l.rate}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => { setSelectedLoan(l); setResult(null); setShowApply(false); }}
                >
                  {t('loans:checkEligibility')}
                </button>
                <a href={l.link} target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-sm">
                  Official →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Government Subsidy Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(26,122,74,0.15), transparent)', border: '1px solid var(--primary-dark)', padding: '24px' }}>
        <h3 style={{ color: 'var(--text-white)', marginBottom: 12 }}>🏛️ Government Loan Subsidies Available</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { scheme: 'Interest Subvention Scheme', benefit: '2% rebate on timely repayment', icon: '💸' },
            { scheme: 'ATMA Scheme', benefit: 'Skill development + credit linkage', icon: '🎓' },
            { scheme: 'PM Kisan FPO', benefit: 'Credit of ₹15 lakh for FPOs', icon: '🌾' },
          ].map((item, idx) => (
            <div key={idx} style={{ padding: 14, background: 'rgba(255,255,255,0.04)', borderRadius: 10 }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{item.icon}</div>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-white)', marginBottom: 4 }}>{item.scheme}</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.benefit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility Check Modal */}
      {selectedLoan && !showApply && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20,
          overflowY: 'auto'
        }}>
          <div className="card animate-in" style={{ width: '100%', maxWidth: 480, margin: '20px auto' }}>
            <h2 style={{ color: 'var(--text-white)', marginBottom: 4 }}>
              🔍 {t('loans:checkEligibility')}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', marginBottom: 20 }}>
              {selectedLoan.icon} {selectedLoan.title}
            </p>

            {!result ? (
              <form onSubmit={checkEligibility} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                  <label>👤 Full Name</label>
                  <input type="text" className="form-input" placeholder="e.g. Ramesh Kumar"
                    value={eligForm.name} onChange={(e) => setEligForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>🎂 Age (years)</label>
                    <input type="number" className="form-input" placeholder="e.g. 35" min="18" max="75"
                      value={eligForm.age} onChange={(e) => setEligForm(p => ({ ...p, age: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>🌾 Land Holding (acres)</label>
                    <input type="number" className="form-input" placeholder="e.g. 2.5" min="0.1" step="0.1"
                      value={eligForm.landArea} onChange={(e) => setEligForm(p => ({ ...p, landArea: e.target.value }))} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>💰 Annual Income (₹)</label>
                  <input type="number" className="form-input" placeholder="e.g. 150000" min="0"
                    value={eligForm.annualIncome} onChange={(e) => setEligForm(p => ({ ...p, annualIncome: e.target.value }))} required />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={checking}>
                    {checking ? '⏳ Checking...' : '🔍 Check Eligibility'}
                  </button>
                  <button type="button" className="btn btn-glass" onClick={() => setSelectedLoan(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{
                  padding: 16, borderRadius: 10,
                  background: result.eligible ? 'rgba(26,122,74,0.15)' : 'rgba(220,38,38,0.1)',
                  border: `1px solid ${result.eligible ? 'var(--primary-dark)' : '#ef444440'}`
                }}>
                  <p style={{ fontWeight: 700, color: 'var(--text-white)', marginBottom: 10 }}>{result.message}</p>
                  {result.details.map((d, i) => (
                    <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{d}</p>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {result.eligible && (
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setShowApply(true)}>
                      📝 Apply Now
                    </button>
                  )}
                  <button className="btn btn-glass" style={{ flex: 1 }} onClick={() => { setResult(null); setSelectedLoan(null); }}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApply && selectedLoan && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20,
        }}>
          <div className="card animate-in" style={{ width: '100%', maxWidth: 440 }}>
            <h2 style={{ color: 'var(--text-white)', marginBottom: 4 }}>📝 Apply for {selectedLoan.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>Fill in your basic details to start the process</p>
            <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label>👤 Full Name</label>
                <input type="text" className="form-input" placeholder="As per Aadhaar"
                  value={applyForm.name} onChange={(e) => setApplyForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>📱 Mobile Number</label>
                <input type="tel" className="form-input" placeholder="Linked with Aadhaar"
                  value={applyForm.phone} onChange={(e) => setApplyForm(p => ({ ...p, phone: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>🏦 Preferred Bank</label>
                <select className="form-select" value={applyForm.bank} onChange={(e) => setApplyForm(p => ({ ...p, bank: e.target.value }))} required>
                  <option value="">Select Bank</option>
                  <option value="SBI">State Bank of India</option>
                  <option value="PNB">Punjab National Bank</option>
                  <option value="BOB">Bank of Baroda</option>
                  <option value="Canara">Canara Bank</option>
                  <option value="Union">Union Bank of India</option>
                  <option value="NABARD">NABARD</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={applying}>
                  {applying ? '⏳ Submitting...' : '✅ Submit Application'}
                </button>
                <button type="button" className="btn btn-glass" onClick={() => setShowApply(false)}>Back</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanPage;
