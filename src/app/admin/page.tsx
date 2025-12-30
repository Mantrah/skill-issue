import fs from 'fs'
import path from 'path'
import type { PendingArticle, PendingData } from '@/types/articles'
import AdminTabs from './AdminTabs'

function getPendingArticles(): PendingArticle[] {
  const filePath = path.join(process.cwd(), 'drafts', 'pending.json')
  if (!fs.existsSync(filePath)) {
    return []
  }
  const data: PendingData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  return data.articles
}

export default function AdminPage() {
  const allArticles = getPendingArticles()
  // Pending + needs_correction dans le même onglet "En attente"
  const pendingArticles = allArticles.filter(a => a.status === 'pending' || a.status === 'needs_correction')
  const rejectedArticles = allArticles.filter(a => a.status === 'rejected')

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Articles</h1>
        <p className="text-muted text-sm mt-1">Gestion des articles en attente</p>
      </div>

      <AdminTabs
        pendingArticles={pendingArticles}
        rejectedArticles={rejectedArticles}
      />
    </div>
  )
}
