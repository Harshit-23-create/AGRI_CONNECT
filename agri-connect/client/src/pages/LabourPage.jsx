import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const LabourPage = () => {
  const { t } = useTranslation(['labour', 'common']);
  const [selectedService, setSelectedService] = useState(null);
  const [contactForm, setContactForm] = useState({ farmerName: '', phone: '', location: '', date: '', workers: '1' });
  const [submitting, setSubmitting] = useState(false);

  const LABOUR_SERVICES = [
    {
      icon: '🚜',
      title: t('labour:tractorTitle'),
      desc: t('labour:tractorDesc'),
      rate: '₹800–1,500/hr',
      available: 12,
      category: 'Equipment',
      contactName: 'Hardev Singh',
      contactPhone: '+91-9876501234',
    },
    {
      icon: '🌾',
      title: t('labour:harvestTitle'),
      desc: t('labour:harvestDesc'),
      rate: '₹350–600/day',
      available: 45,
      category: 'Labour',
      contactName: 'Suresh Patel',
      contactPhone: '+91-9876502345',
    },
    {
      icon: '💧',
      title: t('labour:irrigationTitle'),
      desc: t('labour:irrigationDesc'),
      rate: '₹400–700/day',
      available: 23,
      category: 'Labour',
      contactName: 'Rajan Kumar',
      contactPhone: '+91-9876503456',
    },
  ];

  const handleContact = (service) => {
    setSelectedService(service);
    setContactForm({ farmerName: '', phone: '', location: '', date: '', workers: '1' });
  };

  const handleSubmitContact = (e) => {
    e.preventDefault();
    if (!contactForm.farmerName || !contactForm.phone || !contactForm.location || !contactForm.date) {
      toast.error('Please fill all required fields.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSelectedService(null);
      toast.success(`✅ Request sent! ${selectedService.contactName} will call you on ${contactForm.phone} to confirm the booking for ${new Date(contactForm.date).toLocaleDateString('en-IN')}.`);
    }, 1500);
  };

  return (
    <div>
      <div className="info-hero animate-in">
        <div className="info-hero-icon">👷</div>
        <div>
          <h1>{t('labour:title')}</h1>
          <p>{t('labour:subtitle')}</p>
        </div>
      </div>

      <div className="grid-3 animate-in mb-32">
        {LABOUR_SERVICES.map((s, i) => (
          <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div className="info-item-icon">{s.icon}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-white)', marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: 10 }}>{s.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                  <span className="badge badge-green" style={{ display: 'inline-block' }}>💰 {t('labour:rate')}: {s.rate}</span>
                  <span className="badge badge-blue" style={{ display: 'inline-block' }}>✅ {s.available} Available</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📞 {s.contactName}</span>
                </div>
                <button
                  className="btn btn-primary btn-sm btn-full"
                  onClick={() => handleContact(s)}
                >
                  {t('labour:contactLabour')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(26,122,74,0.15), transparent)', border: '1px solid var(--primary-dark)', padding: '24px' }}>
        <h3 style={{ color: 'var(--text-white)', marginBottom: 12 }}>💡 Tips for Hiring Agricultural Labour</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { icon: '📋', tip: 'Verify workers\' experience before hiring for specialized tasks.' },
            { icon: '💰', tip: 'Agree on rates and payment terms before work begins.' },
            { icon: '⏰', tip: 'Book in advance during peak harvest season.' },
            { icon: '🛡️', tip: 'Ensure basic safety equipment is available for workers.' },
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Modal */}
      {selectedService && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20
        }}>
          <div className="card animate-in" style={{ width: '100%', maxWidth: 440 }}>
            <h2 style={{ color: 'var(--text-white)', marginBottom: 4 }}>
              {selectedService.icon} {t('labour:contactLabour')}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', marginBottom: 20 }}>
              {selectedService.title} · {selectedService.rate}
            </p>
            <form onSubmit={handleSubmitContact} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label>👤 Your Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ramesh Kumar"
                  value={contactForm.farmerName}
                  onChange={(e) => setContactForm(p => ({ ...p, farmerName: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>📱 Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. 9876543210"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm(p => ({ ...p, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>📍 Farm Location / Village</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Amritsar, Punjab"
                  value={contactForm.location}
                  onChange={(e) => setContactForm(p => ({ ...p, location: e.target.value }))}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>📅 Required Date</label>
                  <input
                    type="date"
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                    value={contactForm.date}
                    onChange={(e) => setContactForm(p => ({ ...p, date: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>👥 No. of Workers</label>
                  <select
                    className="form-select"
                    value={contactForm.workers}
                    onChange={(e) => setContactForm(p => ({ ...p, workers: e.target.value }))}
                  >
                    {['1','2','3','5','10','20'].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? '⏳ Sending...' : '📤 Send Request'}
                </button>
                <button type="button" className="btn btn-glass" onClick={() => setSelectedService(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabourPage;
