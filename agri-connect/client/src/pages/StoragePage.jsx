import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const StoragePage = () => {
  const { t } = useTranslation(['storage', 'common']);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', quantity: '', duration: '' });
  const [submitting, setSubmitting] = useState(false);

  const STORAGE_TYPES = [
    {
      icon: '🏭',
      title: t('storage:coldStorageTitle'),
      desc: t('storage:coldStorageDesc'),
      rate: '₹2,500/month/ton',
      capacity: '500 tons',
      location: 'District Warehouses',
      contact: '+91-1800-180-1551',
    },
    {
      icon: '🌾',
      title: t('storage:siloTitle'),
      desc: t('storage:siloDesc'),
      rate: '₹1,200/month/ton',
      capacity: '1000 tons',
      location: 'State Agricultural Depots',
      contact: '+91-1800-180-2117',
    },
    {
      icon: '📦',
      title: t('storage:warehouseTitle'),
      desc: t('storage:warehouseDesc'),
      rate: '₹800/month/ton',
      capacity: '2000 tons',
      location: 'Central Warehousing Corporation',
      contact: '+91-1800-572-2225',
    },
  ];

  const handleBook = (storage) => {
    setSelectedStorage(storage);
    setBookingForm({ name: '', phone: '', quantity: '', duration: '' });
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.quantity || !bookingForm.duration) {
      toast.error('Please fill in all fields.');
      return;
    }
    setSubmitting(true);
    // Simulate booking API call
    setTimeout(() => {
      setSubmitting(false);
      setSelectedStorage(null);
      toast.success(`✅ Booking request for "${selectedStorage.title}" submitted! You will receive a confirmation call on ${bookingForm.phone} within 24 hours.`);
    }, 1500);
  };

  return (
    <div>
      <div className="info-hero animate-in">
        <div className="info-hero-icon">🏭</div>
        <div>
          <h1>{t('storage:title')}</h1>
          <p>{t('storage:subtitle')}</p>
        </div>
      </div>

      <h2 style={{ marginBottom: 16, fontSize: '1.4rem', color: 'var(--text-white)' }}>{t('storage:storageTypesHeader')}</h2>
      <div className="grid-3 mb-32">
        {STORAGE_TYPES.map((s, i) => (
          <div key={i} className="card animate-in" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>{s.icon}</div>
            <h3 style={{ color: 'var(--text-white)', marginBottom: 8 }}>{s.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', marginBottom: 12 }}>{s.desc}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              <span className="badge badge-green">💰 {s.rate}</span>
              <span className="badge badge-blue">📦 Capacity: {s.capacity}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {s.location}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📞 {s.contact}</span>
            </div>
            <button
              className="btn btn-primary btn-sm btn-full"
              style={{ marginTop: 'auto' }}
              onClick={() => handleBook(s)}
            >
              {t('storage:bookStorage')}
            </button>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(26,122,74,0.15), transparent)', border: '1px solid var(--primary-dark)', textAlign: 'center', padding: '32px' }}>
        <div style={{ fontSize: '2rem', marginBottom: 12 }}>📋</div>
        <h3 style={{ color: 'var(--text-white)', marginBottom: 8 }}>National Warehouse Receipt System</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', marginBottom: 20 }}>
          Get a Warehouse Receipt against your stored produce and use it as collateral to get loans at low interest rates.
        </p>
        <a href="https://www.wdra.gov.in" target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-sm">
          Visit WDRA Portal →
        </a>
      </div>

      {/* Booking Modal */}
      {selectedStorage && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20
        }}>
          <div className="card animate-in" style={{ width: '100%', maxWidth: 460 }}>
            <h2 style={{ color: 'var(--text-white)', marginBottom: 4 }}>📋 Book Storage</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', marginBottom: 20 }}>
              {selectedStorage.icon} {selectedStorage.title} · {selectedStorage.rate}
            </p>
            <form onSubmit={handleSubmitBooking} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label>👤 Your Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ramesh Kumar"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>📱 Mobile Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. 9876543210"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm(p => ({ ...p, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>📦 Quantity (in tons)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 10"
                  min="1"
                  value={bookingForm.quantity}
                  onChange={(e) => setBookingForm(p => ({ ...p, quantity: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>📅 Duration (months)</label>
                <select
                  className="form-select"
                  value={bookingForm.duration}
                  onChange={(e) => setBookingForm(p => ({ ...p, duration: e.target.value }))}
                  required
                >
                  <option value="">Select duration</option>
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                </select>
              </div>
              <div style={{ background: 'rgba(26,122,74,0.1)', borderRadius: 8, padding: 12, border: '1px solid var(--primary-dark)' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  💰 Estimated Cost: <strong style={{ color: 'var(--primary-light)' }}>
                    {bookingForm.quantity && bookingForm.duration
                      ? `₹${(parseInt(bookingForm.quantity) * parseInt(bookingForm.duration) * parseInt(selectedStorage.rate.replace(/[^0-9]/g, '').slice(0,4))).toLocaleString()}`
                      : 'Fill in quantity & duration'}
                  </strong>
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? '⏳ Submitting...' : '✅ Confirm Booking'}
                </button>
                <button type="button" className="btn btn-glass" onClick={() => setSelectedStorage(null)}>
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

export default StoragePage;
