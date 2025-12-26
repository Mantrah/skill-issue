import fs from 'fs'
import path from 'path'

export type UserStatus = 'admin' | 'bot' | 'user'

export interface Comment {
  id: string
  author: string
  content: string
  date: string
  likes: number
  status: UserStatus
  replyTo: string | null
}

export interface CommentsData {
  articleSlug: string
  comments: Comment[]
}

const commentsDirectory = path.join(process.cwd(), 'data', 'comments')

export function getCommentsBySlug(slug: string): Comment[] {
  const filePath = path.join(commentsDirectory, `${slug}.json`)

  if (!fs.existsSync(filePath)) {
    return []
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const data: CommentsData = JSON.parse(fileContent)
    return data.comments
  } catch {
    return []
  }
}

export function getAllCommentsFiles(): string[] {
  if (!fs.existsSync(commentsDirectory)) {
    return []
  }

  return fs.readdirSync(commentsDirectory)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''))
}

// Pour plus tard : écriture de commentaires
export function addComment(slug: string, comment: Omit<Comment, 'id'>): Comment {
  const filePath = path.join(commentsDirectory, `${slug}.json`)

  let data: CommentsData = {
    articleSlug: slug,
    comments: []
  }

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    data = JSON.parse(fileContent)
  }

  const newComment: Comment = {
    ...comment,
    id: String(Date.now())
  }

  data.comments.push(newComment)

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

  return newComment
}

// Formater la date relative
export function formatRelativeDate(dateStr: string, locale: 'fr' | 'en'): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (locale === 'fr') {
    if (diffMins < 1) return "à l'instant"
    if (diffMins < 60) return `il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`
    if (diffHours < 24) return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`
    if (diffDays < 7) return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
    return date.toLocaleDateString('fr-FR')
  } else {
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString('en-US')
  }
}
