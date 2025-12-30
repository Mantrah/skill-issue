import fs from 'fs'
import path from 'path'
import newsSourcesData from '@/data/news-sources.json'
import { scoreSatiricalPotential, type ScoreResult } from './satirical-scorer'

export interface NewsSource {
  id: string
  name: string
  url: string
  lang: 'en' | 'fr'
  enabled: boolean
  category: string
}

export interface NewsItem {
  id: string
  sourceId: string
  sourceName: string
  title: string
  description: string
  url: string
  publishedAt: string
  fetchedAt: string
  satiricalScore: number
  satiricalReasons: string[]
  satiricalCategory: ScoreResult['category']
  status: 'new' | 'reviewed' | 'used' | 'dismissed'
  usedInArticle: string | null
}

export interface NewsCache {
  lastFetch: string | null
  news: NewsItem[]
}

const sources = newsSourcesData.sources as NewsSource[]
const CACHE_FILE = path.join(process.cwd(), 'data', 'news-cache.json')

/**
 * Get enabled news sources
 */
export function getEnabledSources(): NewsSource[] {
  return sources.filter(s => s.enabled)
}

/**
 * Get all news sources
 */
export function getAllSources(): NewsSource[] {
  return sources
}

/**
 * Read the news cache
 */
export function readNewsCache(): NewsCache {
  if (!fs.existsSync(CACHE_FILE)) {
    return { lastFetch: null, news: [] }
  }

  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'))
  } catch {
    return { lastFetch: null, news: [] }
  }
}

/**
 * Write to the news cache
 */
export function writeNewsCache(cache: NewsCache): void {
  const dir = path.dirname(CACHE_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
}

/**
 * Add news items to cache (avoiding duplicates)
 */
export function addNewsToCache(items: Omit<NewsItem, 'id' | 'fetchedAt' | 'satiricalScore' | 'satiricalReasons' | 'satiricalCategory' | 'status' | 'usedInArticle'>[]): NewsItem[] {
  const cache = readNewsCache()
  const existingUrls = new Set(cache.news.map(n => n.url))
  const now = new Date().toISOString()
  const newItems: NewsItem[] = []

  for (const item of items) {
    if (existingUrls.has(item.url)) {
      continue
    }

    const scoreResult = scoreSatiricalPotential(item.title, item.description)

    const newsItem: NewsItem = {
      id: `${item.sourceId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...item,
      fetchedAt: now,
      satiricalScore: scoreResult.score,
      satiricalReasons: scoreResult.reasons,
      satiricalCategory: scoreResult.category,
      status: 'new',
      usedInArticle: null
    }

    newItems.push(newsItem)
    cache.news.push(newsItem)
  }

  cache.lastFetch = now
  writeNewsCache(cache)

  return newItems
}

/**
 * Get top news by satirical score
 */
export function getTopNews(limit: number = 10, status?: NewsItem['status']): NewsItem[] {
  const cache = readNewsCache()

  let filtered = cache.news
  if (status) {
    filtered = filtered.filter(n => n.status === status)
  }

  return filtered
    .sort((a, b) => b.satiricalScore - a.satiricalScore)
    .slice(0, limit)
}

/**
 * Update news item status
 */
export function updateNewsStatus(newsId: string, status: NewsItem['status'], usedInArticle?: string): boolean {
  const cache = readNewsCache()
  const index = cache.news.findIndex(n => n.id === newsId)

  if (index === -1) {
    return false
  }

  cache.news[index].status = status
  if (usedInArticle) {
    cache.news[index].usedInArticle = usedInArticle
  }

  writeNewsCache(cache)
  return true
}

/**
 * Parse RSS feed XML to news items
 * Note: This is a simple parser, may need adjustment for different feed formats
 */
export function parseRSSItems(xml: string, source: NewsSource): Omit<NewsItem, 'id' | 'fetchedAt' | 'satiricalScore' | 'satiricalReasons' | 'satiricalCategory' | 'status' | 'usedInArticle'>[] {
  const items: Omit<NewsItem, 'id' | 'fetchedAt' | 'satiricalScore' | 'satiricalReasons' | 'satiricalCategory' | 'status' | 'usedInArticle'>[] = []

  // Simple regex-based parsing (works for most RSS feeds)
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  const titleRegex = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i
  const linkRegex = /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i
  const descRegex = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i
  const pubDateRegex = /<pubDate>([\s\S]*?)<\/pubDate>/i

  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1]

    const titleMatch = titleRegex.exec(itemXml)
    const linkMatch = linkRegex.exec(itemXml)
    const descMatch = descRegex.exec(itemXml)
    const pubDateMatch = pubDateRegex.exec(itemXml)

    if (titleMatch && linkMatch) {
      const title = titleMatch[1].trim().replace(/<[^>]*>/g, '')
      const url = linkMatch[1].trim()
      const description = descMatch ? descMatch[1].trim().replace(/<[^>]*>/g, '').slice(0, 500) : ''
      const publishedAt = pubDateMatch ? new Date(pubDateMatch[1].trim()).toISOString() : new Date().toISOString()

      items.push({
        sourceId: source.id,
        sourceName: source.name,
        title,
        description,
        url,
        publishedAt
      })
    }
  }

  return items
}

/**
 * Get news statistics
 */
export function getNewsStats(): {
  total: number
  byStatus: Record<NewsItem['status'], number>
  byCategory: Record<ScoreResult['category'], number>
  lastFetch: string | null
} {
  const cache = readNewsCache()

  const byStatus: Record<NewsItem['status'], number> = {
    new: 0,
    reviewed: 0,
    used: 0,
    dismissed: 0
  }

  const byCategory: Record<ScoreResult['category'], number> = {
    excellent: 0,
    good: 0,
    average: 0,
    low: 0
  }

  for (const news of cache.news) {
    byStatus[news.status]++
    byCategory[news.satiricalCategory]++
  }

  return {
    total: cache.news.length,
    byStatus,
    byCategory,
    lastFetch: cache.lastFetch
  }
}
