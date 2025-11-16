#!/usr/bin/env node

/**
 * react-lingo CLI
 * A thin wrapper around the Lingo.dev CLI for React applications.
 *
 * Commands:
 * - init: Initialize Lingo.dev in your project with React-friendly defaults
 * - sync: Synchronize and translate your translation files
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

/**
 * Execute a shell command and stream output to console
 */
function executeCommand(cmd, errorMessage) {
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    console.error(errorMessage);
    process.exit(1);
  }
}

/**
 * Initialize Lingo.dev with React-friendly configuration
 */
function init() {
  console.log('Initializing Lingo.dev for React...\n');

  // Run the official Lingo.dev init command
  executeCommand(
    'npx lingo.dev@latest init',
    'Failed to initialize Lingo.dev. Please check your internet connection and try again.'
  );

  console.log('\nCreating React-friendly configuration...\n');

  // Check if i18n.json exists (created by lingo.dev init)
  const configPath = path.join(process.cwd(), 'i18n.json');

  if (fs.existsSync(configPath)) {
    // Read the generated config
    let config;
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
      console.error('Failed to read i18n.json. Using default configuration.');
      config = {};
    }

    // Apply React-friendly defaults
    const reactConfig = {
      $schema: config.$schema || "https://lingo.dev/schema/i18n.json",
      version: config.version || "1.10",
      locale: {
        source: config.locale?.source || "en",
        targets: config.locale?.targets || ["es", "fr", "de"]
      },
      buckets: [
        {
          type: "json-dictionary",
          include: ["public/locales/[locale].json"]
        }
      ]
    };

    // Preserve provider config if it exists
    if (config.provider) {
      reactConfig.provider = config.provider;
    }

    // Write the updated config
    fs.writeFileSync(configPath, JSON.stringify(reactConfig, null, 2));
    console.log('Updated i18n.json with React defaults:');
    console.log('  - Translation files: public/locales/[locale].json');
    console.log('  - Source language: ' + reactConfig.locale.source);
    console.log('  - Target languages: ' + reactConfig.locale.targets.join(', '));
  }

  // Create public/locales directory if it doesn't exist
  const localesDir = path.join(process.cwd(), 'public', 'locales');
  if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true });
    console.log('\nCreated directory: public/locales/');
  }

  // Create a sample en.json file with example translations
  const enPath = path.join(localesDir, 'en.json');
  if (!fs.existsSync(enPath)) {
    const sampleTranslations = {
      welcome: {
        en: "Welcome to React Lingo!"
      },
      greeting: {
        en: "Hello World"
      },
      description: {
        en: "This is a simple i18n solution for React applications."
      }
    };
    fs.writeFileSync(enPath, JSON.stringify(sampleTranslations, null, 2));
    console.log('Created sample file: public/locales/en.json');
  }

  console.log('\nInitialization complete!');
  console.log('\nNext steps:');
  console.log('  1. Add your translation keys to public/locales/en.json');
  console.log('  2. Run "npx react-lingo sync" to generate translations');
  console.log('  3. Use <LingoProvider> and useTranslation() in your React app\n');
}

/**
 * Synchronize and translate files using Lingo.dev
 */
function sync() {
  console.log('Synchronizing translations with Lingo.dev...\n');

  // Execute the Lingo.dev run command
  executeCommand(
    'npx lingo.dev@latest run',
    'Failed to sync translations. Please ensure i18n.json is configured correctly.'
  );

  console.log('\nTranslation sync complete!');
  console.log('Your translation files have been updated.\n');
}

/**
 * Display help information
 */
function help() {
  console.log(`
react-lingo - Simple i18n for React using Lingo.dev

Usage:
  npx react-lingo <command>

Commands:
  init    Initialize Lingo.dev with React-friendly defaults
  sync    Synchronize and translate your translation files
  help    Display this help message

Examples:
  npx react-lingo init
  npx react-lingo sync

For more information, visit: https://lingo.dev/en/cli
  `);
}

// Command router
switch (command) {
  case 'init':
    init();
    break;
  case 'sync':
    sync();
    break;
  case 'help':
  case '--help':
  case '-h':
    help();
    break;
  default:
    console.error(`Unknown command: ${command}\n`);
    help();
    process.exit(1);
}
