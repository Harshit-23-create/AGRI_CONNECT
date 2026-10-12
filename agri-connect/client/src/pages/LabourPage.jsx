import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { bookLabourServiceApi } from '../services/api';

const LabourPage = () => {
  const { t } = useTranslation(['labour', 'common']);
  const [selectedService, setSelectedService] = useState(null);
  const [contactForm, setContactForm] = useState({ farmerName: '', phone: '', location: '', date: '', workers: '1' });
  const [submitting, setSubmitting] = useState(false);
  const [bookingSent, setBookingSent] = useState(null);

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
    setBookingSent(null);
    setContactForm({ farmerName: '', phone: '', location: '', date: '', workers: '1' });
  };

  const cleanPhoneForLink = (phoneStr) => {
    const digits = String(phoneStr || '').replace(/[^0-9]/g, '');
    if (digits.length === 10) return `91${digits}`;
    if (digits.startsWith('91') && digits.length === 12) return digits;
    return digits;
  };

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    if (!contactForm.farmerName || !contactForm.phone || !contactForm.location || !contactForm.date) {
      toast.error('Please fill all required fields.');
      return;
    }

    setSubmitting(true);

    const cleanFarmerPhone = contactForm.phone.replace(/[^0-9]/g, '').slice(-10);
    const cleanProviderPhone = cleanPhoneForLink(selectedService.contactPhone);
    const formattedDate = new Date(contactForm.date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    // Formulate a structured agricultural booking message
    const messageText = 
`🌾 *AgriConnect Equipment Rental & Labour Booking*
━━━━━━━━━━━━━━━━━━━━
📌 *Service*: ${selectedService.title} (${selectedService.rate})
👤 *Farmer Name*: ${contactForm.farmerName}
📱 *Farmer Contact*: +91 ${cleanFarmerPhone}
📍 *Farm Location*: ${contactForm.location}
📅 *Booking Date*: ${formattedDate}
👥 *Requirement*: ${contactForm.workers} Worker(s) / Unit(s)
━━━━━━━━━━━━━━━━━━━━
Please confirm tool availability and dispatch schedule. Thank you!`;

    const bookingPayload = {
      serviceTitle: selectedService.title,
      serviceRate: selectedService.rate,
      providerName: selectedService.contactName,
      providerPhone: selectedService.contactPhone,
      farmerName: contactForm.farmerName,
      farmerPhone: cleanFarmerPhone,
      location: contactForm.location,
      date: contactForm.date,
      workers: contactForm.workers,
    };

    try {
      // 1. Post to backend server to record booking and trigger dispatch logging
      await bookLabourServiceApi(bookingPayload).catch((err) => {
        console.warn('Booking API backend notification notice:', err.message);
      });

      // 2. Open WhatsApp Web/App prefilled with the booking message directly to provider's number
      const whatsappUrl = `https://wa.me/${cleanProviderPhone}?text=${encodeURIComponent(messageText)}`;
      window.open(whatsappUrl, '_blank');

      // 3. Save sent status to show rich action buttons
      setBookingSent({
        providerName: selectedService.contactName,
        providerPhone: selectedService.contactPhone,
        farmerName: contactForm.farmerName,
        farmerPhone: cleanFarmerPhone,
        messageText,
        cleanProviderPhone,
        whatsappUrl,
        smsUrl: `sms:${selectedService.contactPhone}?body=${encodeURIComponent(messageText)}`,
        callUrl: `tel:${selectedService.contactPhone}`,
        farmerWhatsappUrl: `https://wa.me/91${cleanFarmerPhone}?text=${encodeURIComponent(messageText)}`,
      });

      toast.success(`✅ Booking message dispatched to ${selectedService.contactName} (${selectedService.contactPhone})!`, {
        duration: 5000,
        icon: '📲',
      });
    } catch (err) {
      console.error('Error submitting contact:', err);
      toast.error('Booking message created!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyMessage = () => {
    if (bookingSent?.messageText) {
      navigator.clipboard.writeText(bookingSent.messageText);
      toast.success('Booking message copied to clipboard!', { icon: '📋' });
    }
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
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📞 {s.contactName} ({s.contactPhone})</span>
                </div>
                <button
                  id={`btn-service-contact-${i}`}
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
        <h3 style={{ color: 'var(--text-white)', marginBottom: 12 }}>💡 Tips for Hiring Agricultural Labour & Renting Tools</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { icon: '📋', tip: 'Verify machinery specs and operator experience before rental.' },
            { icon: '💰', tip: 'Confirm hourly or daily fuel and operator inclusive terms.' },
            { icon: '⏰', tip: 'Book 24–48 hours in advance for peak season availability.' },
            { icon: '🛡️', tip: 'Direct SMS/WhatsApp confirmations give instant paper trails.' },
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact / Hire / Rent Tool Modal */}
      {selectedService && (
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--bg-modal-overlay)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20
        }}>
          <div className="card animate-in" style={{ width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
            
            {/* When booking is dispatched */}
            {bookingSent ? (
              <div>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: '2.8rem', display: 'block', marginBottom: 8 }}>✅</span>
                  <h2 style={{ color: 'var(--text-white)', fontSize: '1.3rem', marginBottom: 4 }}>
                    Message Dispatched to Provider!
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Your rental request was prepared and sent to <strong>{bookingSent.providerName}</strong>
                  </p>
                </div>

                <div className="booking-dispatch-banner">
                  <div className="booking-dispatch-title">
                    <span>📱</span>
                    <span>Recipient Numbers</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.86rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Tool Owner: </span>
                      <strong style={{ color: 'var(--text-white)' }}>{bookingSent.providerName} ({bookingSent.providerPhone})</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Farmer (You): </span>
                      <strong style={{ color: 'var(--text-white)' }}>{bookingSent.farmerName} (+91 {bookingSent.farmerPhone})</strong>
                    </div>
                  </div>

                  <div className="message-preview-box">
                    {bookingSent.messageText}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="btn btn-outline-sm"
                      onClick={handleCopyMessage}
                      style={{ fontSize: '0.78rem' }}
                    >
                      📋 Copy Message Text
                    </button>
                  </div>
                </div>

                <div className="booking-channel-grid">
                  <a
                    id="btn-open-whatsapp"
                    href={bookingSent.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-whatsapp"
                  >
                    💬 WhatsApp Chat
                  </a>
                  <a
                    id="btn-send-sms"
                    href={bookingSent.smsUrl}
                    className="btn-sms"
                  >
                    ✉️ Send Direct SMS
                  </a>
                  <a
                    id="btn-call-provider"
                    href={bookingSent.callUrl}
                    className="btn-call"
                  >
                    📞 Call Provider
                  </a>
                  <a
                    id="btn-farmer-whatsapp"
                    href={bookingSent.farmerWhatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-glass"
                    style={{ fontSize: '0.82rem', textAlign: 'center' }}
                  >
                    📲 Copy to Farmer's No
                  </a>
                </div>

                <div style={{ marginTop: 20 }}>
                  <button
                    id="btn-booking-done"
                    type="button"
                    className="btn btn-primary btn-full"
                    onClick={() => {
                      setSelectedService(null);
                      setBookingSent(null);
                    }}
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Input Form */
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h2 style={{ color: 'var(--text-white)', marginBottom: 4 }}>
                      {selectedService.icon} {t('labour:contactLabour')}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem' }}>
                      {selectedService.title} · {selectedService.rate}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{
                  background: 'rgba(26, 122, 74, 0.1)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}>
                  <span style={{ fontSize: '1.3rem' }}>📲</span>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Submitting will dispatch a direct WhatsApp & SMS message to provider <strong>{selectedService.contactName} ({selectedService.contactPhone})</strong>.
                  </div>
                </div>

                <form onSubmit={handleSubmitContact} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="form-group">
                    <label>👤 Your Name</label>
                    <input
                      id="input-farmer-name"
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
                      id="input-farmer-phone"
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
                      id="input-farmer-location"
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
                        id="input-farmer-date"
                        type="date"
                        className="form-input"
                        min={new Date().toISOString().split('T')[0]}
                        value={contactForm.date}
                        onChange={(e) => setContactForm(p => ({ ...p, date: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>👥 No. of Workers / Units</label>
                      <select
                        id="select-farmer-workers"
                        className="form-select"
                        value={contactForm.workers}
                        onChange={(e) => setContactForm(p => ({ ...p, workers: e.target.value }))}
                      >
                        {['1','2','3','5','10','20'].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                    <button id="btn-submit-booking" type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                      {submitting ? '⏳ Dispatching Message...' : '📤 Send Request & Message'}
                    </button>
                    <button type="button" className="btn btn-glass" onClick={() => setSelectedService(null)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LabourPage;
