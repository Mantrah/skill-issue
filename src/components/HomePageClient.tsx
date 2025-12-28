'use client'

import CategoryFilter from '@/components/CategoryFilter'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAmbientColor } from '@/hooks/useAmbientColor'
import { type Category } from '@/lib/categories'

interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  tags: Category[]
  category: Category // Premier tag (rétrocompatibilité)
  image?: string
}

interface HomePageClientProps {
  articlesFr: Article[]
  articlesEn: Article[]
}

export default function HomePageClient({ articlesFr, articlesEn }: HomePageClientProps) {
  const { locale } = useLanguage()

  // Récupérer l'image du premier article selon la locale
  const articles = locale === 'en' && articlesEn.length > 0 ? articlesEn : articlesFr
  const firstArticleImage = articles[0]?.image

  // Effet Ambilight basé sur le premier article (position plus basse pour centrer sur image + titre)
  const { ambientStyle } = useAmbientColor(firstArticleImage, { verticalPosition: 18 })

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
