'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ReportButton() {
  const { t } = useLanguage()
  const [showMeme, setShowMeme] = useState(false)

  const handleReport = () => {
    setShowMeme(true)
  }

  const closeMeme = () => {
    setShowMeme(false)
  }

  return (
    <>
      <button
        onClick={handleReport}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-red-500 transition-colors"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
        <span>{t.report}</span>
      </button>

      {showMeme && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 cursor-pointer"
          onClick={closeMeme}
        >
          <div className="relative max-w-md w-full mx-4 animate-bounce-in">
            <Image
              src="/images/troll-face.png"
              alt="Problem?"
              width={400}
              height={400}
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  )
}
