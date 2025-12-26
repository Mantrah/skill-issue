'use client'

import { useState, useEffect, useRef } from 'react'
import CategoryFilter from '@/components/CategoryFilter'
import { useLanguage } from '@/contexts/LanguageContext'

interface Article {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  image?: string
}

interface HomePageClientProps {
  articlesFr: Article[]
  articlesEn: Article[]
}

export default function HomePageClient({ articlesFr, articlesEn }: HomePageClientProps) {
  const { language } = useLanguage()
  const [ambientColor, setAmbientColor] = useState<string | null>(null)
  const blobUrlRef = useRef<string | null>(null)

  // Prendre le premier article selon la langue
  const articles = language === 'fr' ? articlesFr : articlesEn
  const firstArticleImage = articles[0]?.image

  useEffect(() => {
    if (!firstArticleImage) return
    let isMounted = true

    const extractColorFromImage = async () => {
      try {
        const response = await fetch(firstArticleImage)
        const blob = await response.blob()
        const blobUrl = URL.createObjectURL(blob)
        blobUrlRef.current = blobUrl

        const img = new window.Image()
        img.src = blobUrl

        img.onload = () => {
          if (!isMounted) {
            URL.revokeObjectURL(blobUrl)
            return
          }

          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            URL.revokeObjectURL(blobUrl)
            return
          }

          const sampleSize = 50
          canvas.width = sampleSize
          canvas.height = sampleSize
          ctx.drawImage(img, 0, 0, sampleSize, sampleSize)

          const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize)
          const data = imageData.data

          let r = 0, g = 0, b = 0, count = 0
          for (let i = 0; i < data.length; i += 4) {
            const pixelR = data[i]
            const pixelG = data[i + 1]
            const pixelB = data[i + 2]
            const brightness = (pixelR + pixelG + pixelB) / 3
            if (brightness > 30 && brightness < 225) {
              r += pixelR
              g += pixelG
              b += pixelB
              count++
            }
          }

          if (count > 0) {
            r = Math.round(r / count)
            g = Math.round(g / count)
            b = Math.round(b / count)

            // Boost saturation
            const max = Math.max(r, g, b)
            const min = Math.min(r, g, b)
            const mid = (max + min) / 2
            const saturationBoost = 1.8
            r = Math.min(255, Math.round(mid + (r - mid) * saturationBoost))
            g = Math.min(255, Math.round(mid + (g - mid) * saturationBoost))
            b = Math.min(255, Math.round(mid + (b - mid) * saturationBoost))

            // Darken
            const darkenFactor = 0.45
            r = Math.round(r * darkenFactor)
            g = Math.round(g * darkenFactor)
            b = Math.round(b * darkenFactor)

            const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
            setAmbientColor(hex)
          }

          URL.revokeObjectURL(blobUrl)
          blobUrlRef.current = null
        }

        img.onerror = () => {
          URL.revokeObjectURL(blobUrl)
          blobUrlRef.current = null
        }
      } catch (error) {
        console.error('Erreur extraction couleur:', error)
      }
    }

    extractColorFromImage()

    return () => {
      isMounted = false
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
    }
  }, [firstArticleImage])

  const ambientStyle = {
    backgroundImage: ambientColor
      ? `linear-gradient(180deg, ${ambientColor} 0%, var(--background) 50%)`
      : 'none',
    backgroundColor: 'var(--background)',
    backgroundAttachment: 'fixed' as const,
  }

  return (
    <div
      className="min-h-screen transition-all duration-1000 ease-out"
      style={ambientStyle}
    >
      <div className="max-w-5xl mx-auto px-4 py-8">
        <CategoryFilter articlesFr={articlesFr} articlesEn={articlesEn} />
      </div>
    </div>
  )
}
