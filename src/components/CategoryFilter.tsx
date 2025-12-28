'use client'

import { useState } from 'react'
import { categoryConfig, allCategories, type Category } from '@/lib/categories'
import { useLanguage } from '@/contexts/LanguageContext'
import ArticleCard from './ArticleCard'

// Génère un nombre pseudo-aléatoire déterministe basé sur une string
function seededRandom(seed: string, min: number, max: number): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash = hash & hash
  }
  const normalized = Math.abs(hash) / 2147483647
  return Math.floor(normalized * (max - min + 1)) + min
}

interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  tags: Category[]
  category: Category // Premier tag (rétrocompatibilité)
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

  // Catégories présentes dans les articles (basé sur tous les tags)
  const availableCategories = allCategories.filter(cat =>
    articles.some(article => article.tags.includes(cat))
  )

  // Filtrage : article affiché si au moins 1 tag matche
  const filteredArticles = activeCategory === 'all'
    ? articles
    : articles.filter(article => article.tags.includes(activeCategory))

  const [featured, ...rest] = filteredArticles

  return (
    <>
      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
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

      {/* Article principal + populaires */}
      {featured && (
        <section className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Article featured */}
            <div className="flex-1 min-w-0">
              <ArticleCard article={featured} featured locale={locale} />
            </div>

            {/* Articles populaires - même hauteur que featured */}
            <div className="hidden lg:flex lg:flex-col w-72 flex-shrink-0">
              <div className="bg-card border border-card-border rounded-xl p-4 flex-1 flex flex-col min-h-0">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2 flex-shrink-0">
                  <span>🔥</span> {t.mostCommented || 'Les plus commentés'}
                </h3>
                <div className="space-y-2 overflow-y-auto flex-1 min-h-0">
                  {articles.slice(0, 10).map((article) => (
                    <a
                      key={article.slug}
                      href={`/article/${article.slug}`}
                      className="flex gap-2 items-center p-2 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                      {article.image && (
                        <div
                          className="w-12 h-12 rounded bg-cover bg-center flex-shrink-0"
                          style={{ backgroundImage: `url(${article.image})` }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted">
                          💬 {seededRandom(article.slug + '-comments', 10, 60)} · ❤️ {seededRandom(article.slug + '-likes', 20, 120)}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <div className="flex gap-6">
          {/* Colonne articles */}
          <section className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-foreground mb-4">
              {activeCategory === 'all'
                ? t.latestArticles
                : `${t.latestArticles} ${t.categories[activeCategory as keyof typeof t.categories] || categoryConfig[activeCategory].label}`
              }
            </h2>
            <div className="flex flex-col gap-4">
              {rest.map((article, index) => (
                <div key={article.slug}>
                  <ArticleCard article={article} locale={locale} />
                  {/* Pub mobile inline après le 2ème article */}
                  {index === 1 && (
                    <div className="lg:hidden mt-4 bg-card border border-card-border rounded-xl p-4 h-[250px] flex items-center justify-center">
                      <span className="text-muted text-sm">Pub 300x250</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Sidebar pubs */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-4 space-y-4">
              <div className="bg-card border border-card-border rounded-xl p-4 h-[250px] flex items-center justify-center">
                <span className="text-muted text-sm">Pub 300x250</span>
              </div>
              <div className="bg-card border border-card-border rounded-xl p-4 h-[600px] flex items-center justify-center">
                <span className="text-muted text-sm">Pub 300x600</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {filteredArticles.length === 0 && (
        <p className="text-muted text-center py-12">
          {t.noArticlesInCategory}
        </p>
      )}
    </>
  )
}
