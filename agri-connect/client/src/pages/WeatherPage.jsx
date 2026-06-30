import { useState } from 'react';
import { getWeather } from '../services/api';
import toast from 'react-hot-toast';

const STATES_DATA = [
  { name: 'Andhra Pradesh', cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati'] },
  { name: 'Assam', cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur', 'Nagaon'] },
  { name: 'Bihar', cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnea'] },
  { name: 'Chhattisgarh', cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Jagdalpur'] },
  { name: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'] },
  { name: 'Haryana', cities: ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Hisar', 'Karnal'] },
  { name: 'Himachal Pradesh', cities: ['Shimla', 'Manali', 'Dharamshala', 'Mandi', 'Solan', 'Kullu'] },
  { name: 'Jharkhand', cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar'] },
  { name: 'Karnataka', cities: ['Bengaluru', 'Mysuru', 'Mangalore', 'Hubli', 'Belagavi', 'Davangere'] },
  { name: 'Kerala', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Alappuzha', 'Kannur'] },
  { name: 'Madhya Pradesh', cities: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar'] },
  { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur'] },
  { name: 'Odisha', cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Sambalpur', 'Balasore'] },
  { name: 'Punjab', cities: ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali'] },
  { name: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'] },
  { name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'] },
  { name: 'Telangana', cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Mahbubnagar'] },
  { name: 'Uttar Pradesh', cities: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Ghaziabad', 'Unnao'] },
  { name: 'Uttarakhand', cities: ['Dehradun', 'Haridwar', 'Rishikesh', 'Nainital', 'Haldwani', 'Roorkee'] },
  { name: 'West Bengal', cities: ['Kolkata', 'Siliguri', 'Asansol', 'Durgapur', 'Howrah', 'Kharagpur'] },
];

const getWeatherIcon = (main) => {
  const map = { Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Drizzle: '🌦️', Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Fog: '🌫️', Haze: '🌫️' };
  return map[main] || '🌡️';
};

const getDayName = (timestamp) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[new Date(timestamp * 1000).getDay()];
};

const WeatherPage = () => {
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [village, setVillage] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cities = STATES_DATA.find((s) => s.name === state)?.cities || [];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!state || !city) { toast.error('Please select state and city'); return; }
    setLoading(true);
    setError('');
    setWeather(null);
    try {
      const { data } = await getWeather(state, city, village);
      setWeather(data);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  // Get 5 unique forecast days (noon readings)
  const dailyForecast = weather?.forecast?.list
    ? weather.forecast.list
        .filter((item) => item.dt_txt.includes('12:00:00'))
        .slice(0, 5)
    : [];

  return (
    <div>
      <div className="page-header">
        <h1>🌤️ Weather Intelligence</h1>
        <p>Real-time weather conditions and 5-day forecasts for your farm location</p>
      </div>

      {/* Search Form */}
      <div className="card mb-24" style={{ maxWidth: 800, margin: '0 auto 24px auto' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>State</label>
              <select className="form-select" value={state} onChange={(e) => { setState(e.target.value); setCity(''); }}>
                <option value="">Select State</option>
                {STATES_DATA.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>City / District</label>
              <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)} disabled={!state}>
                <option value="">Select City</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Village / Area (optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter village or area name"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Fetching weather...' : '🔍 Get Weather'}
          </button>
        </form>
      </div>

      {error && <div className="alert alert-error mb-16">{error}</div>}

      {loading && (
        <div className="flex-center" style={{ minHeight: 200 }}>
          <div className="loader-spinner" />
        </div>
      )}

      {weather && (
        <div className="animate-in">
          {/* Current Weather */}
          <div className="weather-card-main mb-24">
            <div className="weather-icon">{getWeatherIcon(weather.current.weather[0].main)}</div>
            <div className="weather-temp">{Math.round(weather.current.main.temp)}°C</div>
            <div className="weather-desc">{weather.current.weather[0].description}</div>
            <div className="weather-location">📍 {weather.current.name}, {state}</div>
            <div className="weather-details">
              <div className="weather-detail-item">
                <div className="val">💧 {weather.current.main.humidity}%</div>
                <div className="lbl">Humidity</div>
              </div>
              <div className="weather-detail-item">
                <div className="val">🌬️ {Math.round(weather.current.wind.speed * 3.6)} km/h</div>
                <div className="lbl">Wind Speed</div>
              </div>
              <div className="weather-detail-item">
                <div className="val">🌡️ {weather.current.main.feels_like}°C</div>
                <div className="lbl">Feels Like</div>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast */}
          {dailyForecast.length > 0 && (
            <>
              <h3 style={{ marginBottom: 12, color: 'var(--text-white)' }}>📅 5-Day Forecast</h3>
              <div className="forecast-grid">
                {dailyForecast.map((item, i) => (
                  <div key={i} className="forecast-card">
                    <div className="forecast-day">{getDayName(item.dt)}</div>
                    <div className="forecast-icon">{getWeatherIcon(item.weather[0].main)}</div>
                    <div className="forecast-temp">{Math.round(item.main.temp_max)}°</div>
                    <div className="forecast-min">{Math.round(item.main.temp_min)}°</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Farming Advisory */}
          <div className="card mt-24">
            <h3 style={{ color: 'var(--text-white)', marginBottom: 12 }}>🌾 Farming Advisory</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {weather.current.main.humidity > 80 && (
                <div className="info-item">
                  <div className="info-item-icon">⚠️</div>
                  <div className="info-item-text">
                    <h4>High Humidity Alert</h4>
                    <p>Humidity above 80% increases fungal disease risk. Consider fungicide application on vulnerable crops.</p>
                  </div>
                </div>
              )}
              {weather.current.main.temp > 35 && (
                <div className="info-item">
                  <div className="info-item-icon">🌡️</div>
                  <div className="info-item-text">
                    <h4>Heat Stress Warning</h4>
                    <p>High temperatures may stress crops. Irrigate early morning or evening and provide shade for seedlings.</p>
                  </div>
                </div>
              )}
              {weather.current.wind.speed > 10 && (
                <div className="info-item">
                  <div className="info-item-icon">🌬️</div>
                  <div className="info-item-text">
                    <h4>High Wind Advisory</h4>
                    <p>Strong winds can damage standing crops. Check and reinforce trellises and support structures.</p>
                  </div>
                </div>
              )}
              <div className="info-item">
                <div className="info-item-icon">💧</div>
                <div className="info-item-text">
                  <h4>Irrigation Guidance</h4>
                  <p>Current conditions suggest {weather.current.main.humidity < 50 ? 'more frequent irrigation is recommended.' : 'standard irrigation schedule is appropriate.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
