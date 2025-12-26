'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage()

  return (
    <div className="flex items-center gap-1 bg-card border border-card-border rounded-lg p-0.5">
      <button
        onClick={() => setLocale('fr')}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
          locale === 'fr'
            ? 'bg-accent text-white'
            : 'text-muted hover:text-foreground'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
          locale === 'en'
            ? 'bg-accent text-white'
            : 'text-muted hover:text-foreground'
        }`}
      >
        EN
      </button>
    </div>
  )
}
