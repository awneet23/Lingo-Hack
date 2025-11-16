# react-lingo Implementation Notes

## Project Overview

react-lingo is a two-part NPM package that wraps the Lingo.dev CLI to provide seamless i18n in React applications.

## Architecture

### Part 1: Dev-Time CLI Wrapper (Node.js)

**File: `cli/index.js`**

A Node.js CLI script that provides two commands:

1. **`init`** - Initializes Lingo.dev with React-friendly defaults
   - Runs `npx lingo.dev@latest init`
   - Creates `i18n.json` with json-dictionary bucket configuration
   - Sets up `public/locales/[locale].json` file structure
   - Creates sample `en.json` with example translations
   - Uses the json-dictionary format for all languages in one file

2. **`sync`** - Synchronizes and translates files
   - Runs `npx lingo.dev@latest run`
   - Reads configuration from `i18n.json`
   - Sends new/changed keys to LLM for translation
   - Updates translation files with AI-generated translations

### Part 2: Run-Time Library (React)

#### **LingoProvider.jsx**

React Context provider that:
- Manages `currentLanguage` state
- Dynamically fetches translation files (`/locales/[locale].json`)
- Flattens json-dictionary format into simple key-value pairs
- Provides `currentLanguage`, `setLanguage`, and `translations` via context
- Handles loading states and errors

**Key Feature:** The provider converts the Lingo.dev json-dictionary format:
```json
{
  "welcome": { "en": "Welcome", "es": "Bienvenido" }
}
```

Into a flat object for the current language:
```json
{
  "welcome": "Welcome"
}
```

#### **useTranslation.js**

Custom React hook that:
- Returns `t(key, options)` function for looking up translations
- Returns `changeLanguage(lang)` function to switch languages
- Returns `currentLanguage`, `isLoading`, and `error` states
- Supports fallback values when keys are missing
- Supports variable interpolation with `{{variableName}}` syntax

#### **Translate.jsx**

Declarative component that:
- Uses children as the translation key
- Internally calls `useTranslation()` hook
- Supports custom HTML element rendering via `as` prop
- Supports variable interpolation and fallback values
- Passes through additional props to rendered element

## File Structure

```
react-lingo/
├── cli/
│   └── index.js              # CLI wrapper script
├── src/
│   ├── LingoProvider.jsx     # React Context provider
│   ├── useTranslation.js     # Custom hook
│   ├── Translate.jsx         # Declarative component
│   └── index.js              # Main exports
├── example/
│   ├── App.jsx               # Example usage
│   └── public/
│       └── locales/
│           └── en.json       # Sample translations
├── package.json              # Package configuration
├── README.md                 # Documentation
└── .gitignore                # Git ignore rules
```

## Translation File Format

Based on Lingo.dev's json-dictionary format, all languages are stored in a single file:

```json
{
  "key": {
    "en": "English text",
    "es": "Spanish text",
    "fr": "French text"
  },
  "nested": {
    "key": {
      "en": "Nested value",
      "es": "Valor anidado"
    }
  }
}
```

The LingoProvider automatically extracts the correct language and flattens the structure.

## Workflow

1. **Developer runs:** `npx react-lingo init`
   - Sets up Lingo.dev configuration
   - Creates directory structure
   - Generates sample translation file

2. **Developer adds keys** to `public/locales/en.json`:
   ```json
   {
     "newKey": {
       "en": "New text to translate"
     }
   }
   ```

3. **Developer runs:** `npx react-lingo sync`
   - Lingo.dev CLI detects new key
   - Sends to LLM for translation
   - Updates file with all language variants
   ```json
   {
     "newKey": {
       "en": "New text to translate",
       "es": "Nuevo texto para traducir",
       "fr": "Nouveau texte à traduire"
     }
   }
   ```

4. **Developer uses in React:**
   ```jsx
   const { t } = useTranslation();
   return <h1>{t('newKey')}</h1>;
   ```

## How Lingo.dev CLI Works (Backend)

Based on the documentation study:

1. **Content Discovery** - Scans project for files matching patterns in `i18n.json`
2. **Data Cleaning** - Filters out non-translatable content (numbers, booleans, UUIDs)
3. **Delta Calculation** - Uses SHA-256 fingerprints to identify new/changed keys
4. **Localization** - Sends delta to LLM with retry logic and error recovery
5. **Content Injection** - Writes translations back, preserving file structure

The CLI generates an `i18n.lock` file to track content state between runs.

## Configuration (i18n.json)

The React-friendly default configuration:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  },
  "buckets": [
    {
      "type": "json-dictionary",
      "include": ["public/locales/[locale].json"]
    }
  ]
}
```

Developers can customize:
- Source language
- Target languages
- File paths
- LLM provider (add `provider` section)
- Model selection
- Custom system prompts

## Key Design Decisions

1. **json-dictionary format** - All languages in one file simplifies React integration
2. **public/locales/** path - Works out-of-the-box with Create React App and Vite
3. **Flat key structure** - Simpler API than nested objects (use dot notation)
4. **Context API** - Native React solution, no additional dependencies
5. **Dynamic loading** - Fetch translations on demand, not bundled at build time
6. **Minimal CLI wrapper** - Thin layer over Lingo.dev, easy to maintain

## Future Enhancements

Potential features for v2:

- TypeScript support with auto-generated types from translation keys
- Pluralization support (count-based translations)
- Date/number formatting utilities
- Translation key extraction from JSX
- Build-time optimization (inline translations)
- SSR support with initial translations
- Translation key validation/linting
- Missing key reporting

## Testing Considerations

To test this package:

1. **CLI Testing:**
   - Run `npx react-lingo init` in a fresh React project
   - Verify `i18n.json` and directory structure
   - Add test keys to `en.json`
   - Run `npx react-lingo sync`
   - Verify translations are generated

2. **React Library Testing:**
   - Import components in a test app
   - Wrap app with `LingoProvider`
   - Test `useTranslation()` hook
   - Test `<Translate>` component
   - Test language switching
   - Test error handling (missing files, missing keys)

## Dependencies

**Runtime:**
- React 16.8+ (for hooks support)

**Dev-time:**
- Node.js 14+ (for CLI)
- Lingo.dev CLI (installed via npx)

**No additional dependencies** - This keeps the package lightweight and reduces potential conflicts.

## License

MIT - Open source and free to use.
