import { NextRequest, NextResponse } from 'next/server'
import { getTopNews, getNewsStats, updateNewsStatus, type NewsItem } from '@/lib/news-fetcher'

// GET /api/news - List news with optional filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const status = searchParams.get('status') as NewsItem['status'] | null
  const statsOnly = searchParams.get('stats') === 'true'

  if (statsOnly) {
    const stats = getNewsStats()
    return NextResponse.json(stats)
  }

  const news = getTopNews(limit, status || undefined)
  const stats = getNewsStats()

  return NextResponse.json({
    news,
    stats
  })
}

// PATCH /api/news - Update news status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, usedInArticle } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: id, status' },
        { status: 400 }
      )
    }

    const validStatuses: NewsItem['status'][] = ['new', 'reviewed', 'used', 'dismissed']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const updated = updateNewsStatus(id, status, usedInArticle)

    if (!updated) {
      return NextResponse.json(
        { error: 'News item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
