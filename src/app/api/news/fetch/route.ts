import { NextRequest, NextResponse } from 'next/server'
import { getEnabledSources, addNewsToCache, parseRSSItems } from '@/lib/news-fetcher'

// POST /api/news/fetch - Fetch news from RSS sources
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { sourceId } = body

    const sources = getEnabledSources()
    const sourcesToFetch = sourceId
      ? sources.filter(s => s.id === sourceId)
      : sources

    if (sourcesToFetch.length === 0) {
      return NextResponse.json(
        { error: 'No sources to fetch' },
        { status: 400 }
      )
    }

    const results: Array<{
      sourceId: string
      sourceName: string
      fetched: number
      error?: string
    }> = []

    for (const source of sourcesToFetch) {
      try {
        const response = await fetch(source.url, {
          headers: {
            'User-Agent': 'SkillIssue/1.0 (Gaming Satire Bot)',
            'Accept': 'application/rss+xml, application/xml, text/xml, */*'
          },
          next: { revalidate: 0 }
        })

        if (!response.ok) {
          results.push({
            sourceId: source.id,
            sourceName: source.name,
            fetched: 0,
            error: `HTTP ${response.status}`
          })
          continue
        }

        const xml = await response.text()
        const items = parseRSSItems(xml, source)
        const added = addNewsToCache(items)

        results.push({
          sourceId: source.id,
          sourceName: source.name,
          fetched: added.length
        })
      } catch (error) {
        results.push({
          sourceId: source.id,
          sourceName: source.name,
          fetched: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    const totalFetched = results.reduce((acc, r) => acc + r.fetched, 0)
    const errors = results.filter(r => r.error).length

    return NextResponse.json({
      success: true,
      totalFetched,
      sourcesProcessed: results.length,
      errors,
      details: results
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
