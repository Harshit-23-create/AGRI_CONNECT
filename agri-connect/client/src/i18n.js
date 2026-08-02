import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', speechCode: 'en-US' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', speechCode: 'hi-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', speechCode: 'pa-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', speechCode: 'mr-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', speechCode: 'gu-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', speechCode: 'bn-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', speechCode: 'ta-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', speechCode: 'te-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', speechCode: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', speechCode: 'ml-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', speechCode: 'or-IN' },
];

const namespaces = [
  'common', 'dashboard', 'weather', 'crop', 'chatbot',
  'marketplace', 'schemes', 'storage', 'labour', 'loans',
  'knowledge', 'profile', 'auth'
];

// Custom language detection options
const detectionOptions = {
  order: ['localStorage', 'navigator'],
  lookupLocalStorage: 'agriconnect_language',
  caches: ['localStorage'],
};

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    ns: namespaces,
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: detectionOptions,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true, // Use suspense for loading translations dynamically
    },
  });

i18n.on('languageChanged', (lng) => {
  const isRtl = ['ar', 'ur', 'he', 'fa'].includes(lng);
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
  localStorage.setItem('agriconnect_language', lng);
});

export default i18n;
