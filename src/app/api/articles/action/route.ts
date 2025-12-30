import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { scheduleComments } from '@/lib/comment-scheduler'
import { createScheduledComments } from '@/lib/comments'
import type { PendingArticle, PendingData } from '@/types/articles'

const PENDING_FILE = path.join(process.cwd(), 'drafts', 'pending.json')

function readPendingData(): PendingData {
  if (!fs.existsSync(PENDING_FILE)) {
    return { articles: [] }
  }
  return JSON.parse(fs.readFileSync(PENDING_FILE, 'utf8'))
}

function writePendingData(data: PendingData): void {
  fs.writeFileSync(PENDING_FILE, JSON.stringify(data, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, action, correctionPrompt, fr, en } = body

    if (!slug || !action) {
      return NextResponse.json({ message: 'slug et action requis' }, { status: 400 })
    }

    const data = readPendingData()
    const articleIndex = data.articles.findIndex(a => a.slug === slug)

    if (articleIndex === -1) {
      return NextResponse.json({ message: 'Article non trouvé' }, { status: 404 })
    }

    const article = data.articles[articleIndex]
    const now = new Date().toISOString()

    switch (action) {
      case 'publish': {
        // Publication directe - l'article sera visible sur le site
        article.status = 'published'
        article.updatedAt = now
        article.publishedAt = now

        // Planifier les commentaires des bots
        const publishDate = new Date(now)
        const scheduled = scheduleComments(publishDate)
        const toSchedule = scheduled
          .filter(s => s.willComment)
          .map(s => ({
            author: s.author,
            scheduledAt: s.scheduledAt.toISOString(),
            botId: s.botId
          }))

        if (toSchedule.length > 0) {
          createScheduledComments(slug, toSchedule)
        }
        break
      }

      case 'reject':
        article.status = 'rejected'
        article.updatedAt = now
        article.rejectedReason = 'Rejeté manuellement'
        break

      case 'correct':
        if (!correctionPrompt || correctionPrompt.trim().length < 10) {
          return NextResponse.json({ message: 'Prompt de correction requis (min 10 caractères)' }, { status: 400 })
        }
        article.status = 'needs_correction'
        article.updatedAt = now
        article.correction = {
          prompt: correctionPrompt.trim(),
          requestedAt: now,
        }
        break

      case 'edit':
        if (!fr?.content || !en?.content) {
          return NextResponse.json({ message: 'Contenu FR et EN requis' }, { status: 400 })
        }
        article.fr = fr
        article.en = en
        article.updatedAt = now
        // Si l'article était en needs_correction, on le repasse en pending
        if (article.status === 'needs_correction') {
          article.status = 'pending'
          delete article.correction
        }
        break

      default:
        return NextResponse.json({ message: 'Action non reconnue' }, { status: 400 })
    }

    data.articles[articleIndex] = article
    writePendingData(data)

    return NextResponse.json({ success: true, article })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
