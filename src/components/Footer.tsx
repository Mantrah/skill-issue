'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-card-border bg-header-bg mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <p
          className="text-xs text-muted text-center"
          dangerouslySetInnerHTML={{ __html: t.disclaimer }}
        />
      </div>
    </footer>
  )
}
