import { getAllLikers } from '@/lib/liker-matcher'
import LikersAdminClient from './LikersAdminClient'

export default function LikersAdminPage() {
  const likers = getAllLikers()

  // Group by category (based on triggers)
  const categorized = {
    gaming: likers.filter(l =>
      l.triggers.some(t => ['bethesda', 'valve', 'xbox', 'nintendo', 'ea', 'ubisoft', 'activision', 'game'].some(k => t.includes(k)))
    ),
    memes: likers.filter(l =>
      l.triggers.some(t => ['crypto', 'sigma', 'manager', 'stonks', 'souffrance'].some(k => t.includes(k)))
    ),
    celebrities: likers.filter(l =>
      l.triggers.some(t => ['twitter', 'amazon', 'tesla', 'meta', 'facebook'].some(k => t.includes(k)))
    ),
    fiction: likers.filter(l =>
      l.triggers.some(t => ['witcher', 'halo', 'god of war', 'anneau', 'empire', 'hogwarts'].some(k => t.includes(k)))
    ),
    other: [] as typeof likers
  }

  // Put remaining in other
  const categorizedIds = new Set([
    ...categorized.gaming,
    ...categorized.memes,
    ...categorized.celebrities,
    ...categorized.fiction
  ].map(l => l.id))

  categorized.other = likers.filter(l => !categorizedIds.has(l.id))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Likers</h1>
        <p className="text-muted text-sm mt-1">Personnalites qui likent les articles ({likers.length} total)</p>
      </div>

      <LikersAdminClient
        categorized={categorized}
        total={likers.length}
      />
    </div>
  )
}
