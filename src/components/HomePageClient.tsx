'use client'

import CategoryFilter from '@/components/CategoryFilter'
import { useLanguage } from '@/contexts/LanguageContext'
import { type Category } from '@/lib/categories'

interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  category: Category
  image?: string
}

interface HomePageClientProps {
  articlesFr: Article[]
  articlesEn: Article[]
}

export default function HomePageClient({ articlesFr, articlesEn }: HomePageClientProps) {
  const { locale } = useLanguage()

  // Gradient statique : rouge à gauche, blanc à droite
  const staticGradientStyle = {
    background: 'linear-gradient(90deg, #2a1515 0%, #121212 35%, #121212 65%, #252525 100%)',
  }

  return (
    <div
      className="min-h-screen"
      style={staticGradientStyle}
    >
      <div className="max-w-5xl mx-auto px-4 py-8">
        <CategoryFilter articlesFr={articlesFr} articlesEn={articlesEn} />
      </div>
    </div>
  )
}
