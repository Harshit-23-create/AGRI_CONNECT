import { useState } from 'react';
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

const fields = [
  { name: 'nitrogen', label: 'Nitrogen (N)', placeholder: 'e.g. 90', unit: 'kg/ha' },
  { name: 'phosphorus', label: 'Phosphorus (P)', placeholder: 'e.g. 42', unit: 'kg/ha' },
  { name: 'potassium', label: 'Potassium (K)', placeholder: 'e.g. 43', unit: 'kg/ha' },
  { name: 'temperature', label: 'Temperature', placeholder: 'e.g. 20.8', unit: '°C' },
  { name: 'humidity', label: 'Humidity', placeholder: 'e.g. 82', unit: '%' },
  { name: 'ph', label: 'Soil pH', placeholder: 'e.g. 6.5', unit: 'pH' },
  { name: 'rainfall', label: 'Rainfall', placeholder: 'e.g. 202', unit: 'mm' },
];

const CropPage = () => {
  const [form, setForm] = useState({ nitrogen: '', phosphorus: '', potassium: '', temperature: '', humidity: '', ph: '', rainfall: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      toast.success('Crop recommendation ready!');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to get recommendation. Ensure ML service is running.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>🌱 Crop Recommendation</h1>
        <p>Enter your soil parameters to get an AI-powered crop recommendation</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'start' }}>
        {/* Form */}
        <div className="card">
          <h3 style={{ color: 'var(--text-white)', marginBottom: 20 }}>Soil & Climate Parameters</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div className="crop-form-grid">
              {fields.map((f) => (
                <div key={f.name} className="form-group">
                  <label>{f.label} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({f.unit})</span></label>
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
              {loading ? '🔍 Analyzing soil...' : '🌱 Get Recommendation'}
            </button>
          </form>
        </div>

        {/* Result + Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {error && <div className="alert alert-error">{error}</div>}

          {!result && !loading && (
            <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>🌿</div>
              <h3 style={{ color: 'var(--text-secondary)' }}>Your Recommendation</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', marginTop: 8 }}>
                Fill in the soil parameters on the left and click "Get Recommendation" to discover the best crop for your land.
              </p>
            </div>
          )}

          {loading && (
            <div className="card flex-center" style={{ minHeight: 160 }}>
              <div style={{ textAlign: 'center' }}>
                <div className="loader-spinner" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--text-muted)' }}>Analyzing soil data with ML model...</p>
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
                    <span className="badge badge-green">✅ Recommended</span>
                    <span className="badge badge-blue">🎯 {result.confidence_score}% Match</span>
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
                    <h4>Suitable Season</h4>
                    <p>{result.suitable_season}</p>
                  </div>
                </div>
                <div className="info-item" style={{ padding: 16 }}>
                  <div className="info-item-icon">💧</div>
                  <div className="info-item-text">
                    <h4>Water Requirement</h4>
                    <p>{result.water_requirement}</p>
                  </div>
                </div>
                <div className="info-item" style={{ padding: 16, gridColumn: 'span 2' }}>
                  <div className="info-item-icon">🌿</div>
                  <div className="info-item-text">
                    <h4>Fertilizer Recommendation</h4>
                    <p>{result.fertilizer_recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <h4 style={{ color: 'var(--text-white)', marginBottom: 12 }}>📖 Parameter Guide</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['N (Nitrogen)', 'Essential for leaf growth and green color (0-140 kg/ha)'],
                ['P (Phosphorus)', 'Supports root development and flowering (5-145 kg/ha)'],
                ['K (Potassium)', 'Improves disease resistance (5-205 kg/ha)'],
                ['Soil pH', 'Acidity/alkalinity (3.5-9.5, ideal 6.0-7.0)'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--primary-light)', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap', paddingTop: 2 }}>{k}:</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropPage;
