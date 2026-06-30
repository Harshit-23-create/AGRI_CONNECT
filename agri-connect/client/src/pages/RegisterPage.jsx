import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    serviceProvider: 'No',
    language: 'en',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to AgriConnect 🌾');
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration Error:', err);
      const msg = err?.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-in" style={{ maxWidth: 480 }}>
        <div className="auth-logo">
          <span className="logo-icon">🌱</span>
          <h1>Join AgriConnect</h1>
          <p>Create your farmer account today</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="username"
              type="text"
              className="form-input"
              placeholder="Rajesh Kumar"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              className="form-input"
              placeholder="farmer@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Service Provider?</label>
              <select
                name="serviceProvider"
                className="form-select"
                value={form.serviceProvider}
                onChange={handleChange}
              >
                <option value="No">No — Farmer</option>
                <option value="Yes">Yes — Provider</option>
              </select>
            </div>

            <div className="form-group">
              <label>Language</label>
              <select
                name="language"
                className="form-select"
                value={form.language}
                onChange={handleChange}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="te">Telugu</option>
                <option value="ta">Tamil</option>
                <option value="mr">Marathi</option>
                <option value="bn">Bengali</option>
                <option value="gu">Gujarati</option>
                <option value="kn">Kannada</option>
                <option value="pa">Punjabi</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <><span className="loader-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating account...</>
            ) : (
              '🌾 Create Account'
            )}
          </button>
        </form>

        <p className="auth-switch mt-16">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
