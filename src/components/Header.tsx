'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from './LanguageToggle'

function GamepadIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="6" width="20" height="12" rx="4" className="stroke-accent" />
      <line x1="6" y1="12" x2="10" y2="12" className="stroke-accent" />
      <line x1="8" y1="10" x2="8" y2="14" className="stroke-accent" />
      <circle cx="15" cy="13" r="1.5" className="fill-foreground" />
      <circle cx="18" cy="11" r="1.5" className="fill-foreground" />
    </svg>
  )
}

export default function Header() {
  const { t } = useLanguage()

  return (
    <header className="border-b border-card-border bg-black">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <GamepadIcon />
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">
                <span className="text-accent">SKILL</span>
                <span className="text-foreground"> ISSUE</span>
              </h1>
              <p className="text-xs text-muted mt-0.5">
                {t.tagline}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
              <Link href="/" className="text-muted hover:text-foreground transition-colors">
                {t.articles}
              </Link>
              <span className="text-muted/50 cursor-not-allowed">
                {t.about}
              </span>
              {/* TODO: Masquer quand auth sera implémentée */}
              <Link href="/admin" className="text-accent/70 hover:text-accent transition-colors">
                Admin
              </Link>
            </nav>
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
