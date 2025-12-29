'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ReportButton() {
  const { t } = useLanguage()
  const [showMeme, setShowMeme] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
  }

  return (
    <div
      className={`relative ${showMeme ? 'cursor-none' : 'cursor-pointer'}`}
      onMouseEnter={() => setShowMeme(true)}
      onMouseLeave={() => setShowMeme(false)}
      onMouseMove={handleMouseMove}
    >
      <button className={`flex items-center gap-1.5 text-sm text-muted hover:text-red-500 transition-colors ${showMeme ? 'cursor-none' : ''}`}>
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
          className="fixed pointer-events-none z-50"
          style={{
            left: position.x - 16,
            top: position.y - 16,
          }}
        >
          <Image
            src="/images/troll-face.png"
            alt="Problem?"
            width={32}
            height={32}
            className="drop-shadow-lg"
          />
        </div>
      )}
    </div>
  )
}
