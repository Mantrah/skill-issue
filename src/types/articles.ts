import type { Category } from '@/lib/categories'

export interface ArticleContent {
  title: string
  content: string
}

export type PendingStatus = 'pending' | 'approved' | 'rejected' | 'published' | 'needs_correction'

export interface PendingArticle {
  id: string
  slug: string
  tags: Category[]
  imageUrl: string
  localImage?: string
  date: string
  status: PendingStatus
  createdAt: string
  updatedAt?: string
  publishedAt?: string
  fr: ArticleContent
  en: ArticleContent
  metadata?: {
    sourceUrl?: string
    sourceName?: string
    [key: string]: unknown
  }
  correction?: {
    prompt: string
    requestedAt: string
  }
  rejectedReason?: string
}

export interface PendingData {
  $schema?: string
  articles: PendingArticle[]
}
