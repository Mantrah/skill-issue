import fs from 'fs'
import path from 'path'
import { type Category } from './categories'

export { type Category, categoryConfig, allCategories } from './categories'

export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  category: Category
  image?: string
  date: string
}

// Dates mockées (sera remplacé par la DB plus tard)
const articleDates: Record<string, string> = {
  'ubisoft-ac-shadows': '2025-12-24',
  'ea-fc25-microtransactions': '2025-12-23',
  'nintendo-fuite-cartouches': '2025-12-22',
  'metroid-prime-4-attente': '2025-12-21',
}

const contentDirectory = path.join(process.cwd(), 'content')
const imagesDirectory = path.join(process.cwd(), 'public', 'images')

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

function detectCategory(slug: string, content: string): Category {
  const text = (slug + ' ' + content).toLowerCase()

  // Vérifier les éditeurs spécifiques d'abord (priorité sur les plateformes)
  if (text.includes('ubisoft') || text.includes('assassin\'s creed') || text.includes('assassin')) {
    return 'ubisoft'
  }
  if (text.includes('ea sports') || text.includes('ea fc') || text.includes('fifa') || text.includes('fc 25') || text.includes('fc25')) {
    return 'ea'
  }
  // Puis les plateformes
  if (text.includes('nintendo') || text.includes('metroid') || text.includes('zelda') || text.includes('mario')) {
    return 'nintendo'
  }
  if (text.includes('playstation') || text.includes('sony')) {
    return 'sony'
  }
  if (text.includes('xbox') || text.includes('microsoft')) {
    return 'microsoft'
  }

  return 'general'
}

function parseArticle(slug: string, fileContent: string): { title: string; excerpt: string; content: string; category: Category } {
  const lines = fileContent.split('\n')

  const titleLine = lines.find(line => line.startsWith('# '))
  const title = titleLine ? titleLine.replace('# ', '').trim() : 'Sans titre'

  const excerptMatch = fileContent.match(/\*\*(.+?)\*\*/s)
  const excerpt = excerptMatch ? excerptMatch[1].trim() : ''

  const content = lines.filter(line => !line.startsWith('# ')).join('\n').trim()

  const category = detectCategory(slug, fileContent)

  return { title, excerpt, content, category }
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(contentDirectory)
  const articles = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(contentDirectory, fileName)
      const fileContent = fs.readFileSync(fullPath, 'utf8')
      const { title, excerpt, content, category } = parseArticle(slug, fileContent)
      const image = findImage(slug)
      const date = articleDates[slug] || '2025-01-01'

      return { slug, title, excerpt, content, category, image, date }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return articles
}

export function getArticleBySlug(slug: string): Article | null {
  const fullPath = path.join(contentDirectory, `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContent = fs.readFileSync(fullPath, 'utf8')
  const { title, excerpt, content, category } = parseArticle(slug, fileContent)
  const image = findImage(slug)
  const date = articleDates[slug] || '2025-01-01'

  return { slug, title, excerpt, content, category, image, date }
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  return fs.readdirSync(contentDirectory)
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''))
}
