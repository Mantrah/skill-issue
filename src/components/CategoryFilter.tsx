'use client'

import { useState } from 'react'
import { categoryConfig, allCategories, type Category } from '@/lib/categories'
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
  articles: Article[]
}

export default function CategoryFilter({ articles }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')

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
          Tous
        </button>
        {availableCategories.map(cat => {
          const config = categoryConfig[cat]
          const isActive = activeCategory === cat
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
              {config.icon} {config.label}
            </button>
          )
        })}
      </div>

      {/* Articles */}
      {featured && (
        <section className="mb-8">
          <ArticleCard article={featured} featured />
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">
            {activeCategory === 'all' ? 'Derniers articles' : `Articles ${categoryConfig[activeCategory].label}`}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {rest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {filteredArticles.length === 0 && (
        <p className="text-muted text-center py-12">
          Aucun article dans cette catégorie.
        </p>
      )}
    </>
  )
}
