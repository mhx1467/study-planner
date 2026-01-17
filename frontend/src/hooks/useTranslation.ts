import { useState, useCallback } from 'react'
import { getTranslation, formatTranslation, getCurrentLanguage, setLanguage as setLanguageUtil, getAvailableLanguages, type Language } from '@/i18n/i18n'

/**
 * Custom React hook for translations
 * Usage in components:
 * 
 * const { t, language, setLanguage } = useTranslation()
 * 
 * return (
 *   <div>
 *     <h1>{t('pages.dashboard.title')}</h1>
 *     <p>{t('auth.login.email_label')}</p>
 *     <button onClick={() => setLanguage('en')}>Change to English</button>
 *   </div>
 * )
 */
export function useTranslation() {
  const [language, setLanguageState] = useState<Language>(getCurrentLanguage())

  /**
   * Translate a key to the current language
   */
  const t = useCallback((key: string): string => {
    return getTranslation(key, language)
  }, [language])

  /**
   * Translate a key with variable replacements
   * @example
   * tf('toasts.success.subject_created.description', { name: 'Math' })
   */
  const tf = useCallback((key: string, variables: Record<string, string | number>): string => {
    return formatTranslation(key, variables, language)
  }, [language])

  /**
   * Set the language and persist it
   */
  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageUtil(newLanguage)
    setLanguageState(newLanguage)
  }, [])

  /**
   * Get all available languages
   */
  const availableLanguages = getAvailableLanguages()

  return {
    t,
    tf,
    language,
    setLanguage,
    availableLanguages,
  }
}
