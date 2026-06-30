import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/api';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { value: 'en', label: '🇬🇧 English' },
  { value: 'hi', label: '🇮🇳 Hindi' },
  { value: 'te', label: '🌾 Telugu' },
  { value: 'ta', label: '🌾 Tamil' },
  { value: 'mr', label: '🌾 Marathi' },
  { value: 'bn', label: '🌾 Bengali' },
  { value: 'gu', label: '🌾 Gujarati' },
  { value: 'kn', label: '🌾 Kannada' },
  { value: 'pa', label: '🌾 Punjabi' },
];

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: '', serviceProvider: 'No', language: 'en' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data } = await getProfile();
        setProfile(data.user);
        setForm({
          username: data.user.username,
          serviceProvider: data.user.serviceProvider,
          language: data.user.language,
        });
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateProfile(form);
      setProfile(data.user);
      setEditMode(false);
      toast.success('Profile updated successfully! ✅');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const displayUser = profile || user;
  const memberSince = displayUser?.createdAt
    ? new Date(displayUser.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
    : 'N/A';

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: 300 }}>
        <div className="loader-spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>👤 My Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>

      {/* Profile Header */}
      <div className="profile-header animate-in">
        <div className="profile-avatar-lg">
          {displayUser?.username?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-header-info" style={{ flex: 1 }}>
          <h2>{displayUser?.username}</h2>
          <p>📧 {displayUser?.email}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <span className="badge badge-green">
              {displayUser?.serviceProvider === 'Yes' ? '✅ Service Provider' : '🌾 Farmer'}
            </span>
            <span className="badge badge-blue">
              🗣️ {LANGUAGES.find((l) => l.value === displayUser?.language)?.label || displayUser?.language}
            </span>
            <span className="badge badge-gold">📅 Member since {memberSince}</span>
          </div>
        </div>
        {!editMode && (
          <button className="btn btn-outline" onClick={() => setEditMode(true)}>
            ✏️ Edit Profile
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Info Card */}
        <div className="card animate-in">
          <h3 style={{ color: 'var(--text-white)', marginBottom: 20 }}>Account Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Full Name', value: displayUser?.username, icon: '👤' },
              { label: 'Email Address', value: displayUser?.email, icon: '📧' },
              { label: 'User Type', value: displayUser?.serviceProvider === 'Yes' ? 'Service Provider' : 'Farmer', icon: '🌾' },
              { label: 'Language', value: LANGUAGES.find((l) => l.value === displayUser?.language)?.label, icon: '🗣️' },
              { label: 'Member Since', value: memberSince, icon: '📅' },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '1.1rem', width: 24 }}>{icon}</span>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 500 }}>{value || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Form */}
        {editMode ? (
          <div className="card animate-in">
            <h3 style={{ color: 'var(--text-white)', marginBottom: 20 }}>Edit Profile</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.username}
                  onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Account Type</label>
                <select
                  className="form-select"
                  value={form.serviceProvider}
                  onChange={(e) => setForm((p) => ({ ...p, serviceProvider: e.target.value }))}
                >
                  <option value="No">🌾 Farmer (No)</option>
                  <option value="Yes">✅ Service Provider (Yes)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Preferred Language</label>
                <select
                  className="form-select"
                  value={form.language}
                  onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                  {saving ? 'Saving...' : '💾 Save Changes'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="card animate-in" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>Account Security</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', marginBottom: 20 }}>
              Your account is secured with bcrypt password hashing. To change your password, please contact support.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="info-item">
                <div className="info-item-icon">🛡️</div>
                <div className="info-item-text">
                  <h4>JWT Authentication</h4>
                  <p>Session secured with 7-day JWT tokens</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-item-icon">🔐</div>
                <div className="info-item-text">
                  <h4>Bcrypt Password Hashing</h4>
                  <p>Password stored with 10-round bcrypt hash</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
