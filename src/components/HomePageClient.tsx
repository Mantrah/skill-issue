'use client'

import CategoryFilter from '@/components/CategoryFilter'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAmbientColor } from '@/hooks/useAmbientColor'

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

  // Prendre le premier article selon la langue
  const articles = language === 'fr' ? articlesFr : articlesEn
  const firstArticleImage = articles[0]?.image

  // Effet Ambilight basé sur l'image du premier article
  const { ambientStyle } = useAmbientColor(firstArticleImage)

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
