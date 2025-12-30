'use client'

import { useState } from 'react'
import type { Liker } from '@/lib/liker-matcher'

interface CategorizedLikers {
  gaming: Liker[]
  memes: Liker[]
  celebrities: Liker[]
  fiction: Liker[]
  other: Liker[]
}

interface Props {
  categorized: CategorizedLikers
  total: number
}

const CATEGORY_LABELS: Record<keyof CategorizedLikers, { label: string; color: string }> = {
  gaming: { label: 'Gaming', color: 'bg-green-500/20 text-green-500' },
  memes: { label: 'Memes', color: 'bg-yellow-500/20 text-yellow-500' },
  celebrities: { label: 'Celebrities', color: 'bg-blue-500/20 text-blue-500' },
  fiction: { label: 'Fiction', color: 'bg-purple-500/20 text-purple-500' },
  other: { label: 'Other', color: 'bg-gray-500/20 text-gray-500' }
}

export default function LikersAdminClient({ categorized, total }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<keyof CategorizedLikers | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const allLikers = [
    ...categorized.gaming,
    ...categorized.memes,
    ...categorized.celebrities,
    ...categorized.fiction,
    ...categorized.other
  ]

  const filteredLikers = (selectedCategory === 'all' ? allLikers : categorized[selectedCategory])
    .filter(l =>
      searchQuery === '' ||
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.triggers.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            selectedCategory === 'all'
              ? 'bg-accent text-white'
              : 'bg-card border border-card-border text-muted hover:text-foreground'
          }`}
        >
          All ({total})
        </button>
        {(Object.keys(CATEGORY_LABELS) as Array<keyof CategorizedLikers>).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedCategory === cat
                ? 'bg-accent text-white'
                : 'bg-card border border-card-border text-muted hover:text-foreground'
            }`}
          >
            {CATEGORY_LABELS[cat].label} ({categorized[cat].length})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or trigger..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-card border border-card-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
        />
      </div>

      {/* Likers grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLikers.map(liker => (
          <LikerCard key={liker.id} liker={liker} />
        ))}
      </div>

      {filteredLikers.length === 0 && (
        <div className="text-center py-12 text-muted">
          <p>Aucun liker trouve</p>
        </div>
      )}
    </div>
  )
}

function LikerCard({ liker }: { liker: Liker }) {
  return (
    <div className="p-4 bg-card border border-card-border rounded-xl hover:border-accent/50 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        {liker.avatar ? (
          <img src={liker.avatar} alt={liker.name} className="w-10 h-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-accent font-bold">{liker.name.charAt(0)}</span>
          </div>
        )}
        <div>
          <h3 className="font-semibold text-foreground">{liker.name}</h3>
          <p className="text-xs text-muted">{liker.id}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {liker.triggers.slice(0, 5).map(trigger => (
          <span
            key={trigger}
            className="text-xs px-2 py-0.5 bg-card-border/50 text-muted rounded"
          >
            {trigger}
          </span>
        ))}
        {liker.triggers.length > 5 && (
          <span className="text-xs px-2 py-0.5 text-muted">
            +{liker.triggers.length - 5}
          </span>
        )}
      </div>
    </div>
  )
}
