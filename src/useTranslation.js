import { useContext, useCallback } from 'react';
import { LingoContext } from './LingoProvider';

/**
 * useTranslation Hook
 *
 * Custom React hook for accessing translation functionality.
 * Must be used within a LingoProvider component.
 *
 * @returns {Object} Translation utilities
 * @returns {Function} t - Translation function that takes a key and returns the translated string
 * @returns {Function} changeLanguage - Function to change the current language
 * @returns {string} currentLanguage - The currently active language code
 * @returns {boolean} isLoading - Whether translations are currently being loaded
 * @returns {string|null} error - Error message if translation loading failed
 *
 * @example
 * function MyComponent() {
 *   const { t, changeLanguage, currentLanguage } = useTranslation();
 *
 *   return (
 *     <div>
 *       <h1>{t('welcome')}</h1>
 *       <button onClick={() => changeLanguage('es')}>
 *         Español
 *       </button>
 *       <p>Current language: {currentLanguage}</p>
 *     </div>
 *   );
 * }
 */
export function useTranslation() {
  const context = useContext(LingoContext);

  if (!context) {
    throw new Error(
      'useTranslation must be used within a LingoProvider. ' +
      'Make sure to wrap your app with <LingoProvider>.'
    );
  }

  const { translations, setLanguage, currentLanguage, isLoading, error } = context;

  /**
   * Translation function
   *
   * Looks up a translation key in the loaded translations and returns the translated string.
   * If the key is not found, returns the key itself as a fallback.
   *
   * Supports both flat keys ('welcome') and nested keys ('section.title').
   *
   * @param {string} key - The translation key to look up
   * @param {Object} options - Optional parameters
   * @param {Object} options.vars - Variables to interpolate into the translation
   * @param {string} options.fallback - Custom fallback if key is not found
   * @returns {string} The translated string or the key as fallback
   *
   * @example
   * t('welcome') // Returns: "Welcome to React Lingo!"
   * t('missing.key') // Returns: "missing.key" (fallback)
   * t('greeting', { vars: { name: 'John' } }) // Returns: "Hello, John!" (if supported)
   * t('missing', { fallback: 'Default text' }) // Returns: "Default text"
   */
  const t = useCallback(
    (key, options = {}) => {
      const { vars, fallback } = options;

      // Look up the translation
      let translation = translations[key];

      // If not found, use fallback or return the key itself
      if (translation === undefined || translation === null) {
        translation = fallback !== undefined ? fallback : key;
      }

      // Simple variable interpolation (optional feature)
      // Replaces {{variableName}} with values from vars object
      if (vars && typeof translation === 'string') {
        translation = translation.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
          return vars[varName] !== undefined ? vars[varName] : match;
        });
      }

      return translation;
    },
    [translations]
  );

  /**
   * Alias for setLanguage for better DX
   */
  const changeLanguage = useCallback(
    (language) => {
      setLanguage(language);
    },
    [setLanguage]
  );

  return {
    t,
    changeLanguage,
    currentLanguage,
    isLoading,
    error,
  };
}
