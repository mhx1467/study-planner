import pl from './locales/pl.json'
import en from './locales/en.json'

export type Language = 'pl' | 'en'

export interface Translations {
  [key: string]: string | Translations
}

const translations: Record<Language, Translations> = {
  pl,
  en,
};

export const DEFAULT_LANGUAGE: Language = 'pl'

/**
 * Get a translation value by key path (supports nested keys with dot notation)
 * @param key - Translation key (e.g., "buttons.save" or "messages.error.network")
 * @param language - Language code (defaults to current language or 'pl')
 * @returns Translated string or the key itself if not found
 */
export function getTranslation(key: string, language: Language = DEFAULT_LANGUAGE): string {
  const keys = key.split('.')
  let current: any = translations[language] || translations[DEFAULT_LANGUAGE]

  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k]
    } else {
      // Translation key not found - return the key itself as fallback
      return key
    }
  }

  return typeof current === 'string' ? current : key
}

/**
 * Format a translation string with variables
 * @param key - Translation key
 * @param variables - Object with variables to replace (e.g., { name: "John" })
 * @param language - Language code
 * @returns Formatted translation string
 * 
 * @example
 * // Translation: "Hello {name}, you have {count} messages"
 * formatTranslation('greeting', { name: 'John', count: 5 })
 * // Returns: "Hello John, you have 5 messages"
 */
export function formatTranslation(
  key: string,
  variables: Record<string, string | number>,
  language: Language = DEFAULT_LANGUAGE
): string {
  let text = getTranslation(key, language)

  for (const [varName, value] of Object.entries(variables)) {
    text = text.replace(new RegExp(`\\{${varName}\\}`, 'g'), String(value))
  }

  return text
}

/**
 * Get the current language from localStorage or return default
 */
export function getCurrentLanguage(): Language {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('language')
    if (stored === 'pl' || stored === 'en') {
      return stored as Language
    }
  }
  return DEFAULT_LANGUAGE
}

/**
 * Set the current language and persist to localStorage
 */
export function setLanguage(language: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', language)
  }
}

/**
 * Get all available languages
 */
export function getAvailableLanguages(): Language[] {
  return Object.keys(translations) as Language[]
}
