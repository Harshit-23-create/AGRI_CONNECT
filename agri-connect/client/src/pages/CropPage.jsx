import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getCropRecommendation } from '../services/api';
import toast from 'react-hot-toast';

const CROP_EMOJIS = {
  rice: '🌾', wheat: '🌾', maize: '🌽', chickpea: '🫘', kidneybeans: '🫘',
  pigeonpeas: '🫘', mothbeans: '🫘', mungbean: '🫘', blackgram: '🫘',
  lentil: '🫘', pomegranate: '🍎', banana: '🍌', mango: '🥭',
  grapes: '🍇', watermelon: '🍉', muskmelon: '🍈', apple: '🍎',
  orange: '🍊', papaya: '🍈', coconut: '🥥', cotton: '🌿',
  jute: '🌿', coffee: '☕',
};

const getCropEmoji = (crop) => {
  const key = crop?.toLowerCase().replace(/\s/g, '');
  return CROP_EMOJIS[key] || '🌱';
};

const CropPage = () => {
  const { t } = useTranslation(['crop', 'common']);
  const [form, setForm] = useState({ nitrogen: '', phosphorus: '', potassium: '', temperature: '', humidity: '', ph: '', rainfall: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fields = [
    { name: 'nitrogen', labelKey: 'crop:nitrogen', placeholder: 'e.g. 90' },
    { name: 'phosphorus', labelKey: 'crop:phosphorus', placeholder: 'e.g. 42' },
    { name: 'potassium', labelKey: 'crop:potassium', placeholder: 'e.g. 43' },
    { name: 'temperature', labelKey: 'crop:temperature', placeholder: 'e.g. 20.8' },
    { name: 'humidity', labelKey: 'crop:humidity', placeholder: 'e.g. 82' },
    { name: 'ph', labelKey: 'crop:ph', placeholder: 'e.g. 6.5' },
    { name: 'rainfall', labelKey: 'crop:rainfall', placeholder: 'e.g. 202' },
  ];

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const payload = {
        nitrogen: Number(form.nitrogen),
        phosphorus: Number(form.phosphorus),
        potassium: Number(form.potassium),
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
        ph: Number(form.ph),
        rainfall: Number(form.rainfall),
      };
      const { data } = await getCropRecommendation(payload);
      setResult(data);
      toast.success(t('common:success'));
    } catch (err) {
      const msg = err?.response?.data?.error || t('common:error');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>{t('crop:title')}</h1>
        <p>{t('crop:subtitle')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'start' }}>
        {/* Form */}
        <div className="card">
          <h3 style={{ color: 'var(--text-white)', marginBottom: 20 }}>{t('crop:subtitle')}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div className="crop-form-grid">
              {fields.map((f) => (
                <div key={f.name} className="form-group">
                  <label>{t(f.labelKey)}</label>
                  <input
                    type="number"
                    step="any"
                    name={f.name}
                    className="form-input"
                    placeholder={f.placeholder}
                    value={form[f.name]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
            </div>
            <button type="submit" className="btn btn-primary btn-full mt-24" disabled={loading}>
              {loading ? t('common:loading') : `🌱 ${t('crop:getRecommendation')}`}
            </button>
          </form>
        </div>

        {/* Result + Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {error && <div className="alert alert-error">{error}</div>}

          {!result && !loading && (
            <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>🌿</div>
              <h3 style={{ color: 'var(--text-secondary)' }}>{t('crop:recommendedCrop')}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', marginTop: 8 }}>
                {t('crop:subtitle')}
              </p>
            </div>
          )}

          {loading && (
            <div className="card flex-center" style={{ minHeight: 160 }}>
              <div style={{ textAlign: 'center' }}>
                <div className="loader-spinner" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--text-muted)' }}>{t('common:loading')}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="crop-result" style={{ textAlign: 'left', padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <span className="crop-emoji" style={{ margin: 0, fontSize: '4rem' }}>{getCropEmoji(result.crop)}</span>
                <div>
                  <h2 style={{ fontSize: '2.4rem', margin: 0 }}>{result.crop.charAt(0).toUpperCase() + result.crop.slice(1)}</h2>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <span className="badge badge-green">✅ {t('crop:recommendedCrop')}</span>
                    <span className="badge badge-blue">🎯 {result.confidence_score}% {t('crop:confidence')}</span>
                  </div>
                </div>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '1.05rem', lineHeight: 1.6 }}>
                {result.short_description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="info-item" style={{ padding: 16 }}>
                  <div className="info-item-icon">🌤️</div>
                  <div className="info-item-text">
                    <h4>{t('crop:suitableSeason')}</h4>
                    <p>{result.suitable_season}</p>
                  </div>
                </div>
                <div className="info-item" style={{ padding: 16 }}>
                  <div className="info-item-icon">💧</div>
                  <div className="info-item-text">
                    <h4>{t('crop:waterReq')}</h4>
                    <p>{result.water_requirement}</p>
                  </div>
                </div>
                <div className="info-item" style={{ padding: 16, gridColumn: 'span 2' }}>
                  <div className="info-item-icon">🌿</div>
                  <div className="info-item-text">
                    <h4>{t('crop:fertilizerRec')}</h4>
                    <p>{result.fertilizer_recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropPage;
