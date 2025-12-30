'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { type Locale, defaultLocale, getTranslations, type Translations } from '@/lib/i18n'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function getInitialLocale(): Locale {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('locale') as Locale | null
    if (saved && (saved === 'fr' || saved === 'en')) {
      return saved
    }
  }
  return defaultLocale
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  const t = getTranslations(locale)

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
