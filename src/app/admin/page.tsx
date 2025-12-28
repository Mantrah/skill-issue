import fs from 'fs'
import path from 'path'
import { type Category } from '@/lib/categories'
import AdminTabs from './AdminTabs'

interface PendingArticle {
  id: string
  slug: string
  tags: Category[]
  imageUrl: string
  localImage?: string
  date: string
  status: 'pending' | 'approved' | 'rejected' | 'published' | 'needs_correction'
  createdAt: string
  updatedAt?: string
  fr: { title: string; content: string }
  en: { title: string; content: string }
  metadata?: { sourceUrl?: string; sourceName?: string }
  correction?: { prompt: string; requestedAt: string }
}

interface PendingData {
  articles: PendingArticle[]
}

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
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Administration</h1>
          <p className="text-muted mt-1">Gestion des articles</p>
        </div>

        <AdminTabs
          pendingArticles={pendingArticles}
          rejectedArticles={rejectedArticles}
        />
      </div>
    </div>
  )
}
