import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { type Category, allCategories } from './categories'
import { type Locale, defaultLocale } from './i18n'

export { type Category, categoryConfig, allCategories } from './categories'
export { type Locale, defaultLocale } from './i18n'

export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  tags: Category[]
  category: Category // Premier tag (rétrocompatibilité)
  image?: string
  date: string
}

// Dates des articles publiés (sera remplacé par la DB plus tard)
// IMPORTANT: Seuls les articles listés ici sont visibles sur le site public
// Les articles sans date sont considérés comme "drafts" et ne s'affichent pas
const articleDates: Record<string, string> = {
  'palworld-joueurs-realisation': '2025-12-26',
  'ubisoft-ac-shadows': '2025-12-24',
  'ea-fc25-microtransactions': '2025-12-23',
  'nintendo-fuite-cartouches': '2025-12-22',
  'metroid-prime-4-attente': '2025-12-21',
}

const baseContentDirectory = path.join(process.cwd(), 'content')
const imagesDirectory = path.join(process.cwd(), 'public', 'images')

function getContentDirectory(locale: Locale): string {
  return path.join(baseContentDirectory, locale)
}

function findImage(slug: string): string | undefined {
  const extensions = ['.png', '.jpg', '.jpeg', '.webp']
  for (const ext of extensions) {
    const imagePath = path.join(imagesDirectory, slug + ext)
    if (fs.existsSync(imagePath)) {
      return `/images/${slug}${ext}`
    }
  }
  return undefined
}

function isValidCategory(value: unknown): value is Category {
  return typeof value === 'string' && allCategories.includes(value as Category)
}

function parseTagsFromFrontmatter(frontmatter: Record<string, unknown>): Category[] {
  // Support both "tags: [a, b]" and legacy "category: a"
  if (Array.isArray(frontmatter.tags)) {
    return frontmatter.tags.filter(isValidCategory)
  }
  if (isValidCategory(frontmatter.category)) {
    return [frontmatter.category]
  }
  return []
}

function detectTagsFromSlug(slug: string): Category[] {
  const slugLower = slug.toLowerCase()
  const detected: Category[] = []

  // Plateformes
  if (slugLower.includes('nintendo') || slugLower.includes('zelda') || slugLower.includes('mario') || slugLower.includes('metroid')) {
    detected.push('nintendo')
  }
  if (slugLower.includes('playstation') || slugLower.includes('sony') || slugLower.includes('ps5') || slugLower.includes('ps4')) {
    detected.push('playstation')
  }
  if (slugLower.includes('xbox') || slugLower.includes('microsoft')) {
    detected.push('xbox')
  }

  // Éditeurs/Types
  if (slugLower.includes('ubisoft') || slugLower.includes('assassin') || slugLower.includes('ea-') || slugLower.includes('fifa') || slugLower.includes('fc25') || slugLower.includes('fc-25')) {
    detected.push('aaa')
  }
  if (slugLower.includes('indie')) {
    detected.push('indie')
  }

  // Genres
  if (slugLower.includes('moba') || slugLower.includes('league') || slugLower.includes('dota')) {
    detected.push('moba')
  }
  if (slugLower.includes('fps') || slugLower.includes('shooter') || slugLower.includes('call-of-duty') || slugLower.includes('valorant')) {
    detected.push('fps')
  }
  if (slugLower.includes('mmorpg') || slugLower.includes('wow') || slugLower.includes('ffxiv')) {
    detected.push('mmorpg')
  }
  if (slugLower.includes('rpg')) {
    detected.push('rpg')
  }
  if (slugLower.includes('battle-royale') || slugLower.includes('fortnite') || slugLower.includes('pubg') || slugLower.includes('warzone')) {
    detected.push('battle-royale')
  }
  if (slugLower.includes('survival') || slugLower.includes('palworld') || slugLower.includes('rust') || slugLower.includes('ark')) {
    detected.push('survival')
  }

  // Autres thématiques
  if (slugLower.includes('esport') || slugLower.includes('tournament') || slugLower.includes('competitive')) {
    detected.push('esports')
  }
  if (slugLower.includes('mobile') || slugLower.includes('gacha')) {
    detected.push('mobile')
  }
  if (slugLower.includes('vr') || slugLower.includes('virtual-reality') || slugLower.includes('meta-quest')) {
    detected.push('vr')
  }
  if (slugLower.includes('retro') || slugLower.includes('nostalgia') || slugLower.includes('remaster')) {
    detected.push('retro')
  }
  if (slugLower.includes('industry') || slugLower.includes('layoff') || slugLower.includes('crunch')) {
    detected.push('industry')
  }
  if (slugLower.includes('hardware') || slugLower.includes('gpu') || slugLower.includes('console')) {
    detected.push('hardware')
  }
  if (slugLower.includes('streaming') || slugLower.includes('twitch') || slugLower.includes('streamer')) {
    detected.push('streaming')
  }
  if (slugLower.includes('pc')) {
    detected.push('pc')
  }

  return detected.length > 0 ? detected : ['general']
}

function parseArticle(slug: string, fileContent: string): { title: string; excerpt: string; content: string; tags: Category[] } {
  // Parse frontmatter avec gray-matter
  const { data: frontmatter, content: markdownContent } = matter(fileContent)

  const lines = markdownContent.split('\n')

  const titleLine = lines.find(line => line.startsWith('# '))
  const title = titleLine ? titleLine.replace('# ', '').trim() : 'Sans titre'

  const excerptMatch = markdownContent.match(/\*\*(.+?)\*\*/s)
  const excerpt = excerptMatch ? excerptMatch[1].trim() : ''

  const content = lines.filter(line => !line.startsWith('# ')).join('\n').trim()

  // Priorité : frontmatter > détection par slug > fallback general
  let tags = parseTagsFromFrontmatter(frontmatter)
  if (tags.length === 0) {
    tags = detectTagsFromSlug(slug)
  }

  return { title, excerpt, content, tags }
}

export function getAllArticles(locale: Locale = defaultLocale): Article[] {
  const contentDirectory = getContentDirectory(locale)
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(contentDirectory)
  const articles = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .filter(fileName => {
      // Seuls les articles avec une date explicite sont publiés
      const slug = fileName.replace(/\.md$/, '')
      return slug in articleDates
    })
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(contentDirectory, fileName)
      const fileContent = fs.readFileSync(fullPath, 'utf8')
      const { title, excerpt, content, tags } = parseArticle(slug, fileContent)
      const image = findImage(slug)
      const date = articleDates[slug]

      return { slug, title, excerpt, content, tags, category: tags[0], image, date }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return articles
}

export function getArticleBySlug(slug: string, locale: Locale = defaultLocale): Article | null {
  // Vérifie que l'article est publié (a une date explicite)
  if (!(slug in articleDates)) {
    return null
  }

  const contentDirectory = getContentDirectory(locale)
  const fullPath = path.join(contentDirectory, `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContent = fs.readFileSync(fullPath, 'utf8')
  const { title, excerpt, content, tags } = parseArticle(slug, fileContent)
  const image = findImage(slug)
  const date = articleDates[slug]

  return { slug, title, excerpt, content, tags, category: tags[0], image, date }
}

export function getAllSlugs(locale: Locale = defaultLocale): string[] {
  const contentDirectory = getContentDirectory(locale)
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  return fs.readdirSync(contentDirectory)
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''))
    .filter(slug => slug in articleDates) // Seuls les articles publiés
}
