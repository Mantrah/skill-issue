'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'react-markdown'
import { useLanguage } from '@/contexts/LanguageContext'
import { categoryConfig, type Category } from '@/lib/categories'
import { formatDateLocale } from '@/lib/i18n'
import ImagePlaceholder from './ImagePlaceholder'
import ShareButtons from './ShareButtons'
import LikeButton from './LikeButton'
import ReportButton from './ReportButton'
import CommentSection from './CommentSection'

interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  category: Category
  image?: string
  date: string
}

interface Comment {
  id: string
  author: string
  content: string
  date: string
  likes: number
  status: 'admin' | 'bot' | 'user'
  replyTo: string | null
}

interface ArticlePageClientProps {
  articleFr: Article | null
  articleEn: Article | null
  slug: string
  initialLikes: number
  comments: Comment[]
}

export default function ArticlePageClient({
  articleFr,
  articleEn,
  slug,
  initialLikes,
  comments,
}: ArticlePageClientProps) {
  const { locale, t } = useLanguage()

  // Select article based on locale, fallback to French
  const article = locale === 'en' && articleEn ? articleEn : articleFr

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-muted text-center">{t.noArticles}</p>
      </div>
    )
  }

  const config = categoryConfig[article.category]
  const categoryLabel = t.categories[article.category as keyof typeof t.categories] || config.label

  // Effet Ambilight : extraction couleur dynamique depuis l'image
  const [ambientColor, setAmbientColor] = useState<string | null>(null)
  const blobUrlRef = useRef<string | null>(null)

  useEffect(() => {
    if (!article.image) return

    let isMounted = true

    const extractColorFromImage = async () => {
      try {
        const response = await fetch(article.image!)
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
          if (!ctx) return

          const scale = Math.min(1, 100 / Math.max(img.width, img.height))
          canvas.width = img.width * scale
          canvas.height = img.height * scale

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
          let r = 0, g = 0, b = 0, count = 0

          for (let i = 0; i < imageData.length; i += 16) {
            const pr = imageData[i]
            const pg = imageData[i + 1]
            const pb = imageData[i + 2]

            const brightness = (pr + pg + pb) / 3
            if (brightness > 30 && brightness < 225) {
              r += pr
              g += pg
              b += pb
              count++
            }
          }

          if (count > 0) {
            r = Math.round(r / count)
            g = Math.round(g / count)
            b = Math.round(b / count)

            // Booster la saturation
            const max = Math.max(r, g, b)
            const min = Math.min(r, g, b)
            const boost = 1.8

            if (max !== min) {
              const mid = (max + min) / 2
              r = Math.min(255, Math.max(0, Math.round(mid + (r - mid) * boost)))
              g = Math.min(255, Math.max(0, Math.round(mid + (g - mid) * boost)))
              b = Math.min(255, Math.max(0, Math.round(mid + (b - mid) * boost)))
            }

            // Assombrir la couleur tout en gardant de la visibilité
            const darkR = Math.round(r * 0.45)
            const darkG = Math.round(g * 0.45)
            const darkB = Math.round(b * 0.45)

            const hex = `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`
            setAmbientColor(hex)
          }

          URL.revokeObjectURL(blobUrl)
          blobUrlRef.current = null
        }
      } catch (error) {
        console.error('Erreur extraction couleur:', error)
      }
    }

    extractColorFromImage()

    // Cleanup : révoquer le blobUrl si le composant est démonté
    return () => {
      isMounted = false
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
    }
  }, [article.image])

  // Style du gradient dynamique (couleur opaque en haut, comme la page principale)
  const ambientStyle = {
    backgroundImage: ambientColor
      ? `linear-gradient(180deg, ${ambientColor} 0%, var(--background) 67%)`
      : 'none',
    backgroundColor: 'var(--background)',
    backgroundAttachment: 'fixed' as const,
  }

  return (
    <div
      className="min-h-screen transition-all duration-1000 ease-out"
      style={ambientStyle}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <span>&larr;</span>
        <span>{t.backToArticles}</span>
      </Link>

      <article>
        <header className="mb-8">
          {article.image ? (
            <div className="relative w-full aspect-[3/1] rounded-xl overflow-hidden mb-6">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <ImagePlaceholder
              category={article.category}
              className="w-full aspect-[3/1] rounded-xl mb-6"
            />
          )}

          <div className="flex items-center gap-3 mb-4">
            <span
              className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full"
              style={{ backgroundColor: config.color, color: '#fff' }}
            >
              {categoryLabel}
            </span>
            <span className="text-sm text-muted">{formatDateLocale(article.date, locale)}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold leading-tight text-foreground mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <LikeButton initialLikes={initialLikes} />
            <ShareButtons
              url={`https://skillissue.fr/article/${slug}`}
              title={article.title}
            />
            <ReportButton />
          </div>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none prose-p:text-foreground/90 prose-strong:text-foreground prose-a:text-accent hover:prose-a:text-accent-hover">
          <Markdown>{article.content}</Markdown>
        </div>
      </article>

      <CommentSection slug={slug} comments={comments} />
      </div>
    </div>
  )
}
