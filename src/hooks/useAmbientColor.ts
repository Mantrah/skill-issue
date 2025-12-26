'use client'

import { useState, useEffect, useRef } from 'react'

interface AmbientColorOptions {
  saturationBoost?: number
  darkenFactor?: number
  gradientEnd?: number
}

const defaultOptions: Required<AmbientColorOptions> = {
  saturationBoost: 1.8,
  darkenFactor: 0.45,
  gradientEnd: 67,
}

export function useAmbientColor(imageUrl: string | undefined, options: AmbientColorOptions = {}) {
  const [ambientColor, setAmbientColor] = useState<string | null>(null)
  const blobUrlRef = useRef<string | null>(null)

  const { saturationBoost, darkenFactor, gradientEnd } = { ...defaultOptions, ...options }

  useEffect(() => {
    if (!imageUrl) return
    let isMounted = true

    const extractColorFromImage = async () => {
      try {
        const response = await fetch(imageUrl)
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
            r = Math.min(255, Math.round(mid + (r - mid) * saturationBoost))
            g = Math.min(255, Math.round(mid + (g - mid) * saturationBoost))
            b = Math.min(255, Math.round(mid + (b - mid) * saturationBoost))

            // Darken
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
  }, [imageUrl, saturationBoost, darkenFactor])

  const ambientStyle = {
    backgroundImage: ambientColor
      ? `linear-gradient(180deg, ${ambientColor} 0%, var(--background) ${gradientEnd}%)`
      : 'none',
    backgroundColor: 'var(--background)',
    backgroundAttachment: 'fixed' as const,
  }

  return { ambientColor, ambientStyle }
}
