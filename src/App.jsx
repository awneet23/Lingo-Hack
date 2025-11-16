// Write this code into src/App.jsx
import React from 'react';
import { LingoProvider } from './LingoProvider';
import { useTranslation } from './useTranslation';
import './App.css'; // Import the CSS you just created

// Main App component: Wraps everything in the LingoProvider
function App() {
  return (
    <LingoProvider
      defaultLanguage="en"
      supportedLanguages={['en', 'es', 'fr', 'de']}
      translationsPath="/locales"
    >
      <div className="App">
        <DemoPage />
      </div>
    </LingoProvider>
  );
}

// DemoPage component: This contains the actual UI
// It uses the useTranslation hook to get the t() function and changeLanguage()
function DemoPage() {
  const { t, changeLanguage, currentLanguage } = useTranslation();

  return (
    <div className="container">
      <header>
        <p>Language Switcher:</p>
        <nav className="lang-nav">
          <button
            disabled={currentLanguage === 'en'}
            onClick={() => changeLanguage('en')}
          >
            English
          </button>
          <button
            disabled={currentLanguage === 'es'}
            onClick={() => changeLanguage('es')}
          >
            Español
          </button>
          <button
            disabled={currentLanguage === 'fr'}
            onClick={() => changeLanguage('fr')}
          >
            Français
          </button>
          <button
            disabled={currentLanguage === 'de'}
            onClick={() => changeLanguage('de')}
          >
            Deutsch
          </button>
        </nav>
      </header>

      <main>
        {/* Using the keys from en.json */}
        <h1>{t('homepage.title')}</h1>
        <p>{t('homepage.subtitle')}</p>
        <p>{t('description')}</p>

        <div className="buttons">
          <button>{t('button.login')}</button>
          <button className="primary">{t('button.signup')}</button>
        </div>
      </main>

      <footer>
        <p>{t('footer.copyright')}</p>
      </footer>
    </div>
  );
}

export default App;
