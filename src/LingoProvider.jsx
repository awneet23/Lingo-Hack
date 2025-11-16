import React, { createContext, useState, useEffect, useCallback } from 'react';

/**
 * Context for managing translations and language state
 */
export const LingoContext = createContext({
  currentLanguage: 'en',
  translations: {},
  setLanguage: () => {},
  isLoading: false,
  error: null,
});

/**
 * LingoProvider Component
 *
 * Manages the current language state and dynamically loads translation files.
 * Wrap your app with this provider to enable i18n throughout your React application.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.defaultLanguage - Initial language (default: 'en')
 * @param {string} props.translationsPath - Path to translation files (default: '/locales')
 * @param {Array<string>} props.supportedLanguages - List of supported language codes
 */
export function LingoProvider({
  children,
  defaultLanguage = 'en',
  translationsPath = '/locales',
  supportedLanguages = ['en'],
}) {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load translations for a specific language
   * Fetches the JSON file for the specific language
   */
  const loadTranslations = useCallback(async (language) => {
    setIsLoading(true);
    setError(null);

    try {
      // Construct the path to the translation file
      const filePath = `${translationsPath}/${language}.json`;

      // Fetch the translation file
      const response = await fetch(filePath);

      if (!response.ok) {
        throw new Error(`Failed to load translations for language: ${language}`);
      }

      const data = await response.json();

      // Each language file is a simple key-value object
      // e.g., en.json: { "welcome": "Welcome!", "greeting": "Hello" }
      // No flattening needed - use the data directly
      setTranslations(data);
    } catch (err) {
      console.error('Error loading translations:', err);
      setError(err.message);
      // Fallback to empty translations
      setTranslations({});
    } finally {
      setIsLoading(false);
    }
  }, [translationsPath]);

  /**
   * Change the current language and load its translations
   */
  const setLanguage = useCallback(
    (language) => {
      if (!supportedLanguages.includes(language)) {
        console.warn(
          `Language "${language}" is not in supportedLanguages. Loading anyway...`
        );
      }
      setCurrentLanguage(language);
    },
    [supportedLanguages]
  );

  // Load translations when language changes
  useEffect(() => {
    loadTranslations(currentLanguage);
  }, [currentLanguage, loadTranslations]);

  // Context value
  const value = {
    currentLanguage,
    translations,
    setLanguage,
    isLoading,
    error,
  };

  return (
    <LingoContext.Provider value={value}>
      {children}
    </LingoContext.Provider>
  );
}
