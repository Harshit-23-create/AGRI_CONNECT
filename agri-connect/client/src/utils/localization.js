/**
 * Safely extracts a localized string from a value that could either be a
 * direct string or a localization map object { en: "...", hi: "..." }.
 * 
 * @param {string|object} value - The data field from the API.
 * @param {string} currentLanguage - The active i18n language code.
 * @returns {string} - The safely resolved string.
 */
export const getLocalizedValue = (value, currentLanguage) => {
  // If undefined, null, or empty string, fallback immediately
  if (!value) return '';

  // If it's already a string, just return it
  if (typeof value === 'string') return value;

  // If it's an object containing translations
  if (typeof value === 'object' && !Array.isArray(value)) {
    // 1. Try selected language
    if (value[currentLanguage] && typeof value[currentLanguage] === 'string') {
      return value[currentLanguage];
    }
    
    // 2. Try English fallback
    if (value['en'] && typeof value['en'] === 'string') {
      return value['en'];
    }
    
    // 3. Try first available key as absolute fallback
    const keys = Object.keys(value);
    for (const key of keys) {
      if (typeof value[key] === 'string' && value[key].trim() !== '') {
        return value[key];
      }
    }
  }

  // Absolute fallback to avoid displaying "..." or "[object Object]"
  return '';
};
