import React from 'react';
import { LingoProvider, useTranslation, Translate } from 'react-lingo';

/**
 * Example React app demonstrating react-lingo usage
 */

// Example component using the useTranslation hook
function Welcome() {
  const { t, changeLanguage, currentLanguage, isLoading } = useTranslation();

  if (isLoading) {
    return <div>Loading translations...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>

      <div style={{ marginTop: '20px' }}>
        <h2>Navigation</h2>
        <nav>
          <a href="/" style={{ marginRight: '10px' }}>{t('nav.home')}</a>
          <a href="/about" style={{ marginRight: '10px' }}>{t('nav.about')}</a>
          <a href="/contact">{t('nav.contact')}</a>
        </nav>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Language Selector</h2>
        <select
          value={currentLanguage}
          onChange={(e) => changeLanguage(e.target.value)}
          style={{ padding: '5px', fontSize: '16px' }}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
        <p>Current language: {currentLanguage}</p>
      </div>
    </div>
  );
}

// Example component using the Translate component
function Footer() {
  return (
    <footer style={{
      marginTop: '40px',
      padding: '20px',
      backgroundColor: '#f0f0f0',
      textAlign: 'center'
    }}>
      <Translate as="p">footer.copyright</Translate>
      <Translate as="p" fallback="All rights reserved.">footer.rights</Translate>
    </footer>
  );
}

// Main App component with LingoProvider
export default function App() {
  return (
    <LingoProvider
      defaultLanguage="en"
      supportedLanguages={['en', 'es', 'fr', 'de']}
      translationsPath="/locales"
    >
      <div>
        <Welcome />
        <Footer />
      </div>
    </LingoProvider>
  );
}
