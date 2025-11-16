# react-lingo

A simple, elegant wrapper around the Lingo.dev CLI to make i18n in React "just work."

react-lingo combines the power of AI-driven translations from Lingo.dev with a minimal React runtime, giving you internationalization with almost zero configuration.

## 🚀 Quick Demo

Want to see it in action immediately? Run:

```bash
npm install
npm run dev
```

Then open your browser to see the stunning demo with animated gradients, glassmorphism effects, and live language switching!

## Features

- 🤖 **AI-powered translations** via Lingo.dev CLI
- 🎨 **Modern, stunning UI** with animated gradients and glassmorphism
- 🌍 **Simple React Context API** for managing languages
- 📦 **Declarative `<Translate>` component**
- 🎣 **Flexible `useTranslation()` hook**
- ⚡ **Automatic translation file loading**
- 🚀 **Zero-config setup** with sensible defaults
- 💫 **Beautiful animations** and smooth transitions
- 📱 **Fully responsive** design

## Quick Start

### 1. Installation

```bash
npm install react-lingo
npm install lingo.dev
npm install --save-dev vite @vitejs/plugin-react react react-dom
```

**Note:**
- `lingo.dev` must be installed locally for the CLI to work
- Vite and React dependencies are needed to run the demo (`npm run dev`)

### 2. Initialize Lingo.dev

Run the init command to set up your project:

```bash
node cli/index.js init
```

This will:
- Initialize Lingo.dev in your project
- Create a `public/locales/` directory
- Generate an `i18n.json` configuration file with React-friendly defaults
- Create a sample `en.json` file with example translations

### 3. Add Translation Keys

Edit `public/locales/en.json` to add your translation keys:

```json
{
  "welcome": "Welcome to my app!",
  "nav.home": "Home",
  "nav.about": "About"
}
```

Note: Each language has its own file with simple key-value pairs. Use dot notation for nested keys (e.g., `"nav.home"`).

### 4. Sync Translations

Run the sync command to generate translations for all target languages:

```bash
node cli/index.js sync
```

To force re-translation of all keys (bypass cache):

```bash
node cli/index.js sync --force
```

This uses AI to translate your English keys into the target languages specified in `i18n.json` (default: Spanish, French, German).

After running, you'll have separate files for each language:

**`public/locales/en.json`:**
```json
{
  "welcome": "Welcome to my app!",
  "nav.home": "Home",
  "nav.about": "About"
}
```

**`public/locales/es.json`:**
```json
{
  "welcome": "¡Bienvenido a mi aplicación!",
  "nav.home": "Inicio",
  "nav.about": "Acerca de"
}
```

**`public/locales/fr.json`:**
```json
{
  "welcome": "Bienvenue dans mon application!",
  "nav.home": "Accueil",
  "nav.about": "À propos"
}
```

And similarly for German (`de.json`) and any other target languages you configure.

### 5. Use in Your React App

Wrap your app with `LingoProvider`:

```jsx
// App.jsx
import { LingoProvider } from 'react-lingo';

function App() {
  return (
    <LingoProvider
      defaultLanguage="en"
      supportedLanguages={['en', 'es', 'fr', 'de']}
      translationsPath="/locales"
    >
      <YourApp />
    </LingoProvider>
  );
}
```

Use the `useTranslation()` hook in your components:

```jsx
import { useTranslation } from 'react-lingo';

function Home() {
  const { t, changeLanguage, currentLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <nav>
        <a href="/">{t('nav.home')}</a>
        <a href="/about">{t('nav.about')}</a>
      </nav>

      <select
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
      </select>
    </div>
  );
}
```

Or use the declarative `<Translate>` component:

```jsx
import { Translate } from 'react-lingo';

function Header() {
  return (
    <header>
      <Translate as="h1">welcome</Translate>
      <Translate as="p">nav.home</Translate>
    </header>
  );
}
```

## 🎬 Live Demo

This project includes a beautiful, interactive demo showcasing the translation features!

### Running the Demo

```bash
npm run dev
```

This will start a Vite development server at `http://localhost:5173` (or similar).

### Demo Features

The included demo application showcases:

- ✨ **Stunning animated gradient background** with smooth color transitions
- 🎨 **Glassmorphism design** with frosted glass effects
- 🌐 **Interactive language switcher** for English, Spanish, French, and German
- 💫 **Smooth animations** and transitions on all interactive elements
- 🎯 **Premium button designs** with hover effects and shadows
- 📱 **Fully responsive** layout that works on all screen sizes
- 🎭 **Real-time translation switching** demonstrating the library's capabilities

### Visual Design Highlights

- **Animated gradient background** - A mesmerizing 5-color gradient that shifts smoothly
- **Gradient text** - Eye-catching purple gradient on the main heading
- **Pill-shaped buttons** - Modern, rounded buttons with smooth hover animations
- **Glass card** - Semi-transparent container with backdrop blur for depth
- **Shimmer effects** - Subtle shine animations on the primary call-to-action button
- **Staggered fade-ins** - Content animates in sequentially for a polished appearance

Perfect for hackathon demos, presentations, or showcasing the library's capabilities!

## API Reference

### `<LingoProvider>`

The context provider that manages language state and translation loading.

**Props:**
- `children` (ReactNode) - Your app components
- `defaultLanguage` (string) - Initial language code (default: `'en'`)
- `translationsPath` (string) - Path to translation files (default: `'/locales'`)
- `supportedLanguages` (string[]) - Array of supported language codes

**Example:**
```jsx
<LingoProvider
  defaultLanguage="en"
  supportedLanguages={['en', 'es', 'fr']}
  translationsPath="/locales"
>
  <App />
</LingoProvider>
```

### `useTranslation()`

A React hook that provides translation functionality.

**Returns:**
- `t(key, options)` - Function to translate a key
- `changeLanguage(lang)` - Function to change the current language
- `currentLanguage` - The current language code
- `isLoading` - Boolean indicating if translations are loading
- `error` - Error message if loading failed

**Example:**
```jsx
const { t, changeLanguage, currentLanguage, isLoading } = useTranslation();

// Basic usage
t('welcome') // "Welcome to my app!"

// Nested keys
t('nav.home') // "Home"

// With fallback
t('missing.key', { fallback: 'Default text' })

// With variable interpolation
t('greeting', { vars: { name: 'John' } }) // "Hello, {{name}}!" → "Hello, John!"
```

### `<Translate>`

A declarative component for rendering translated text.

**Props:**
- `children` (string) - The translation key
- `vars` (object) - Variables for interpolation
- `fallback` (string) - Custom fallback text
- `as` (string | Component) - HTML element to render as (default: `'span'`)
- `...restProps` - Additional props passed to the rendered element

**Example:**
```jsx
<Translate>welcome</Translate>

<Translate as="h1" className="title">welcome</Translate>

<Translate vars={{ name: 'John' }}>greeting</Translate>

<Translate fallback="Welcome!">missing.key</Translate>
```

## CLI Commands

### `node cli/index.js init`

Initialize Lingo.dev in your project with React-friendly configuration.

### `node cli/index.js sync`

Synchronize and translate your translation files using AI.

### `node cli/index.js sync --force`

Force re-translation of all keys, bypassing the cache.

### `npm run dev`

Start the Vite development server to run the demo application. Opens at `http://localhost:5173`.

## Workflow

1. **Add keys** - Add new translation keys to `public/locales/en.json`
2. **Sync** - Run `node cli/index.js sync` to generate translations
3. **Use** - Use the `t()` function or `<Translate>` component in your app
4. **Repeat** - Add more keys and sync again as needed

## Configuration

The `i18n.json` file controls the translation process. You can customize:

- **Source language** - The language you write translations in
- **Target languages** - Languages to translate into
- **File paths** - Where translation files are stored
- **LLM provider** - Which AI service to use (Lingo.dev, OpenAI, Anthropic, etc.)

See the [Lingo.dev documentation](https://lingo.dev/en/cli/fundamentals/i18n-json-config) for full configuration options.

## How It Works

### Dev-Time (CLI)

1. You run `node cli/index.js init` to set up the project
2. You add English translation keys to `public/locales/en.json` as simple key-value pairs
3. You run `node cli/index.js sync` which:
   - Reads your `i18n.json` configuration
   - Finds new or changed translation keys in your source file (`en.json`)
   - Sends them to an LLM (via Lingo.dev)
   - Creates separate translation files for each target language (e.g., `es.json`, `fr.json`, `de.json`)
   - Each file contains the same keys with translated values
   - Creates an `i18n.lock` file to track changes

### Run-Time (React)

1. `LingoProvider` dynamically fetches the translation file for the current language (e.g., `en.json`, `es.json`)
2. It stores the simple key-value object in state
3. The `t()` function looks up keys directly in this object
4. When you change languages, it fetches and loads the new language's translation file
5. Components re-render with the new translations

## Why react-lingo?

- 🤖 **AI-Powered** - Uses LLMs to generate high-quality translations automatically
- 🎨 **Beautiful Demo** - Stunning, modern UI with animated gradients and glassmorphism
- 🎯 **Simple** - Minimal API surface, easy to learn
- 🔧 **Flexible** - Works with hooks or components, your choice
- 👨‍💻 **Dev-Friendly** - Sensible defaults, clear error messages
- ⚡ **Zero Config** - Works out of the box for most React apps
- 🎬 **Demo Ready** - Includes a gorgeous demo perfect for presentations and hackathons

## License

MIT

## Links

- [Lingo.dev CLI Documentation](https://lingo.dev/en/cli)
- [GitHub Repository](#)
- [NPM Package](#)
