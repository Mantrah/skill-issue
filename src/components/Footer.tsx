'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

function GamepadIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="6" width="20" height="12" rx="4" className="stroke-accent" />
      <line x1="6" y1="12" x2="10" y2="12" className="stroke-accent" />
      <line x1="8" y1="10" x2="8" y2="14" className="stroke-accent" />
      <circle cx="15" cy="13" r="1.5" className="fill-muted" />
      <circle cx="18" cy="11" r="1.5" className="fill-muted" />
    </svg>
  )
}

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-card-border bg-black mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Logo + Colonnes centrées */}
        <div className="flex flex-col items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-6">
            <GamepadIcon />
            <span className="text-lg font-black tracking-tight">
              <span className="text-accent">SKILL</span>
              <span className="text-foreground"> ISSUE</span>
            </span>
          </Link>

          {/* Navigation columns - centrées et rapprochées */}
          <div className="flex gap-16 mb-6">
            {/* Navigation */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {t.footerNav}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {t.home}
                  </Link>
                </li>
                <li>
                  <span className="text-sm text-muted/50 cursor-not-allowed">
                    {t.about}
                  </span>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {t.footerLegal}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/mentions-legales"
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {t.legalNotice}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/confidentialite"
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {t.privacy}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-card-border pt-6">
          {/* Copyright */}
          <p className="text-xs text-muted text-center mb-4">
            {t.copyright.replace('{year}', year.toString())}
          </p>

          {/* Disclaimer */}
          <p
            className="text-xs text-muted text-center max-w-xl mx-auto"
            dangerouslySetInnerHTML={{ __html: t.disclaimer }}
          />
        </div>
      </div>
    </footer>
  )
}
