import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = async (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('agriconnect_language', langCode);
    setIsOpen(false);

    // Sync with user profile if logged in
    if (user) {
      try {
        await updateProfile({ preferredLanguage: langCode });
      } catch (err) {
        console.warn('Failed to sync language preference to server profile:', err);
      }
    }
  };

  return (
    <div className="language-selector-wrapper" ref={dropdownRef}>
      <button
        className="lang-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('common.selectLanguage')}
        title={t('common.selectLanguage')}
      >
        <span className="lang-globe-icon">🌐</span>
        <span className="lang-flag">{currentLang.flag}</span>
        <span className="lang-name">{currentLang.nativeName}</span>
        <span className="lang-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="lang-dropdown-menu">
          <div className="lang-dropdown-header">{t('common.selectLanguage')}</div>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className={`lang-option ${lang.code === i18n.language ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="lang-option-flag">{lang.flag}</span>
              <span className="lang-option-native">{lang.nativeName}</span>
              <span className="lang-option-en">({lang.name})</span>
              {lang.code === i18n.language && <span className="lang-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
