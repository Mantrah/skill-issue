import fs from 'fs'
import path from 'path'

export type Category = 'nintendo' | 'ea' | 'ubisoft' | 'sony' | 'microsoft' | 'general'

export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  category: Category
}

export const categoryConfig: Record<Category, { label: string; color: string; bgLight: string; icon: string }> = {
  nintendo: { label: 'Nintendo', color: '#e11d48', bgLight: '#fef2f2', icon: '🎮' },
  ea: { label: 'EA Sports', color: '#0ea5e9', bgLight: '#f0f9ff', icon: '⚽' },
  ubisoft: { label: 'Ubisoft', color: '#8b5cf6', bgLight: '#faf5ff', icon: '🗡️' },
  sony: { label: 'PlayStation', color: '#2563eb', bgLight: '#eff6ff', icon: '🎯' },
  microsoft: { label: 'Xbox', color: '#22c55e', bgLight: '#f0fdf4', icon: '🎲' },
  general: { label: 'Gaming', color: '#71717a', bgLight: '#f4f4f5', icon: '👾' },
}

const contentDirectory = path.join(process.cwd(), 'content')

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

      return { slug, title, excerpt, content, category }
    })

  return articles
}

export function getArticleBySlug(slug: string): Article | null {
  const fullPath = path.join(contentDirectory, `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContent = fs.readFileSync(fullPath, 'utf8')
  const { title, excerpt, content, category } = parseArticle(slug, fileContent)

  return { slug, title, excerpt, content, category }
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  return fs.readdirSync(contentDirectory)
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''))
}
