'use client'

import { useState } from 'react'
import AdminArticleCard from './AdminArticleCard'
import { type Category } from '@/lib/categories'

interface PendingArticle {
  id: string
  slug: string
  tags: Category[]
  imageUrl: string
  localImage?: string
  date: string
  status: 'pending' | 'approved' | 'rejected' | 'published' | 'needs_correction'
  createdAt: string
  fr: { title: string; content: string }
  en: { title: string; content: string }
  metadata?: { sourceUrl?: string; sourceName?: string }
  correction?: { prompt: string; requestedAt: string }
}

interface AdminTabsProps {
  pendingArticles: PendingArticle[]
  rejectedArticles: PendingArticle[]
}

type TabId = 'pending' | 'rejected'

export default function AdminTabs({ pendingArticles, rejectedArticles }: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('pending')

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: 'pending', label: 'En attente', count: pendingArticles.length },
    { id: 'rejected', label: 'Rejetés', count: rejectedArticles.length },
  ]

  const articles = activeTab === 'pending' ? pendingArticles : rejectedArticles

  const emptyState = activeTab === 'pending'
    ? { icon: '📭', text: 'Aucun article en attente', subtext: 'Utilise le content-generator pour créer un nouvel article' }
    : { icon: '🗑️', text: 'Aucun article rejeté', subtext: null }

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-card-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-foreground'
                : 'text-muted hover:text-foreground/80'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                activeTab === tab.id
                  ? 'bg-accent/20 text-accent'
                  : 'bg-card-border text-muted'
              }`}>
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {articles.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-card-border">
          <div className="text-4xl mb-4">{emptyState.icon}</div>
          <p className="text-muted text-lg">{emptyState.text}</p>
          {emptyState.subtext && (
            <p className="text-sm text-muted/60 mt-2">{emptyState.subtext}</p>
          )}
        </div>
      ) : (
        <div className={`space-y-4 ${activeTab === 'rejected' ? 'opacity-70' : ''}`}>
          {articles.map((article) => (
            <AdminArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </>
  )
}
