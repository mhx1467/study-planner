import React, { createContext, useContext, useState } from 'react'
import { type Language, getCurrentLanguage, setLanguage as setLanguageUtil } from '@/i18n/i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return getCurrentLanguage()
  })

  const setLanguage = (newLanguage: Language) => {
    setLanguageUtil(newLanguage)
    setLanguageState(newLanguage)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
