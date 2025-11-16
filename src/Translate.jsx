import React from 'react';
import { useTranslation } from './useTranslation';

/**
 * Translate Component
 *
 * A declarative component for translating text.
 * Uses the children as the translation key and renders the translated value.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The translation key (as a string)
 * @param {Object} props.vars - Optional variables for interpolation
 * @param {string} props.fallback - Optional custom fallback text
 * @param {React.ElementType} props.as - Optional HTML element to render as (default: 'span')
 * @param {Object} props.restProps - Any additional props to pass to the rendered element
 *
 * @example
 * // Basic usage - children is used as the translation key
 * <Translate>welcome</Translate>
 *
 * @example
 * // With variables
 * <Translate vars={{ name: 'John' }}>greeting</Translate>
 *
 * @example
 * // With custom fallback
 * <Translate fallback="Welcome!">welcome</Translate>
 *
 * @example
 * // Render as a different element
 * <Translate as="h1">welcome</Translate>
 *
 * @example
 * // With additional props
 * <Translate as="p" className="greeting-text">welcome</Translate>
 */
export function Translate({ children, vars, fallback, as: Component = 'span', ...restProps }) {
  const { t } = useTranslation();

  // Convert children to string to use as translation key
  // This handles cases where children might be a number or other primitive
  const key = String(children);

  // Get the translated text
  const translatedText = t(key, { vars, fallback });

  // Render the translated text in the specified component
  return <Component {...restProps}>{translatedText}</Component>;
}
