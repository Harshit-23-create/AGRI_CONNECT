import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { getProfile, updateProfile } from '../services/api';
import { SUPPORTED_LANGUAGES } from '../i18n';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation(['profile', 'common', 'auth']);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: '', serviceProvider: 'No', preferredLanguage: i18n.language });
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
          preferredLanguage: data.user.preferredLanguage || i18n.language,
        });
      } catch {
        toast.error(t('common:error'));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [i18n.language, t]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateProfile(form);
      setProfile(data.user);
      if (form.preferredLanguage) {
        i18n.changeLanguage(form.preferredLanguage);
        localStorage.setItem('agriconnect_language', form.preferredLanguage);
      }
      setEditMode(false);
      toast.success(t('common:success'));
    } catch (err) {
      toast.error(err?.response?.data?.message || t('common:error'));
    } finally {
      setSaving(false);
    }
  };

  const displayUser = profile || user;
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === (displayUser?.preferredLanguage || i18n.language)) || SUPPORTED_LANGUAGES[0];

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
        <h1>{t('profile:title')}</h1>
        <p>{t('profile:subtitle')}</p>
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
              {displayUser?.serviceProvider === 'Yes' ? t('auth:providerRole') : t('auth:farmerRole')}
            </span>
            <span className="badge badge-blue">
              🗣️ {currentLang.flag} {currentLang.nativeName} ({currentLang.name})
            </span>
          </div>
        </div>
        {!editMode && (
          <button className="btn btn-outline" onClick={() => setEditMode(true)}>
            ✏️ {t('profile:updateProfile')}
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Info Card */}
        <div className="card animate-in">
          <h3 style={{ color: 'var(--text-white)', marginBottom: 20 }}>{t('profile:title')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: t('profile:username'), value: displayUser?.username, icon: '👤' },
              { label: t('profile:email'), value: displayUser?.email, icon: '📧' },
              { label: t('profile:serviceProvider'), value: displayUser?.serviceProvider === 'Yes' ? t('common:serviceProvider') : t('common:farmer'), icon: '🌾' },
              { label: t('profile:preferredLanguage'), value: `${currentLang.flag} ${currentLang.nativeName}`, icon: '🗣️' },
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
            <h3 style={{ color: 'var(--text-white)', marginBottom: 20 }}>{t('profile:updateProfile')}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label>{t('profile:username')}</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.username}
                  onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('profile:serviceProvider')}</label>
                <select
                  className="form-select"
                  value={form.serviceProvider}
                  onChange={(e) => setForm((p) => ({ ...p, serviceProvider: e.target.value }))}
                >
                  <option value="No">🌾 {t('common:farmer')} (No)</option>
                  <option value="Yes">✅ {t('common:serviceProvider')} (Yes)</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t('profile:preferredLanguage')}</label>
                <select
                  className="form-select"
                  value={form.preferredLanguage}
                  onChange={(e) => setForm((p) => ({ ...p, preferredLanguage: e.target.value }))}
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.nativeName} ({l.name})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                  {saving ? t('common:loading') : `💾 ${t('common:save')}`}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setEditMode(false)}>
                  {t('common:cancel')}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="card animate-in" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>{t('common:appName')} Security</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', marginBottom: 20 }}>
              {t('profile:subtitle')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
