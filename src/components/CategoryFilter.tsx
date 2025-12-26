'use client'

import { useState } from 'react'
import { categoryConfig, allCategories, type Category } from '@/lib/categories'
import { useLanguage } from '@/contexts/LanguageContext'
import ArticleCard from './ArticleCard'

interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  category: Category
  image?: string
  date: string
}

interface CategoryFilterProps {
  articlesFr: Article[]
  articlesEn: Article[]
}

export default function CategoryFilter({ articlesFr, articlesEn }: CategoryFilterProps) {
  const { locale, t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')

  // Select articles based on locale, fallback to French if English not available
  const articles = locale === 'en' && articlesEn.length > 0 ? articlesEn : articlesFr

  // Catégories présentes dans les articles
  const availableCategories = allCategories.filter(cat =>
    articles.some(article => article.category === cat)
  )

  const filteredArticles = activeCategory === 'all'
    ? articles
    : articles.filter(article => article.category === activeCategory)

  const [featured, ...rest] = filteredArticles

  return (
    <>
      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-accent text-white'
              : 'bg-card border border-card-border text-foreground hover:border-accent/50'
          }`}
        >
          {t.allCategories}
        </button>
        {availableCategories.map(cat => {
          const config = categoryConfig[cat]
          const isActive = activeCategory === cat
          const label = t.categories[cat as keyof typeof t.categories] || config.label
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? 'text-white'
                  : 'bg-card border border-card-border text-foreground hover:border-accent/50'
              }`}
              style={isActive ? { backgroundColor: config.color } : undefined}
            >
              {config.icon} {label}
            </button>
          )
        })}
      </div>

      {/* Articles */}
      {featured && (
        <section className="mb-8">
          <ArticleCard article={featured} featured locale={locale} />
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">
            {activeCategory === 'all'
              ? t.latestArticles
              : `${t.latestArticles} ${t.categories[activeCategory as keyof typeof t.categories] || categoryConfig[activeCategory].label}`
            }
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {rest.map((article) => (
              <ArticleCard key={article.slug} article={article} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {filteredArticles.length === 0 && (
        <p className="text-muted text-center py-12">
          {t.noArticlesInCategory}
        </p>
      )}
    </>
  )
}
