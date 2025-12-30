import fs from 'fs'
import path from 'path'

export type UserStatus = 'admin' | 'bot' | 'user'
export type ScheduledStatus = 'pending' | 'scheduled' | 'published'

export interface Comment {
  id: string
  author: string
  content: string
  date: string
  likes: number
  status: UserStatus
  replyTo: string | null
  // Scheduling fields (optional for backwards compatibility)
  scheduledStatus?: ScheduledStatus
  scheduledAt?: string // ISO-8601 date when to publish
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

// Supprimer un commentaire
export function deleteComment(slug: string, commentId: string): boolean {
  const filePath = path.join(commentsDirectory, `${slug}.json`)

  if (!fs.existsSync(filePath)) {
    return false
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const data: CommentsData = JSON.parse(fileContent)

    const initialLength = data.comments.length
    data.comments = data.comments.filter(c => c.id !== commentId)

    if (data.comments.length === initialLength) {
      return false // Comment not found
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    return true
  } catch {
    return false
  }
}

// Mettre à jour un commentaire (likes, contenu, etc.)
export function updateComment(
  slug: string,
  commentId: string,
  updates: Partial<Omit<Comment, 'id'>>
): Comment | null {
  const filePath = path.join(commentsDirectory, `${slug}.json`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const data: CommentsData = JSON.parse(fileContent)

    const commentIndex = data.comments.findIndex(c => c.id === commentId)
    if (commentIndex === -1) {
      return null
    }

    data.comments[commentIndex] = {
      ...data.comments[commentIndex],
      ...updates
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    return data.comments[commentIndex]
  } catch {
    return null
  }
}

// Créer des commentaires planifiés (placeholders pour les bots)
export function createScheduledComments(
  slug: string,
  scheduledComments: Array<{
    author: string
    scheduledAt: string
    botId: string
  }>
): Comment[] {
  const filePath = path.join(commentsDirectory, `${slug}.json`)

  let data: CommentsData = {
    articleSlug: slug,
    comments: []
  }

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    data = JSON.parse(fileContent)
  }

  const newComments: Comment[] = []

  for (const scheduled of scheduledComments) {
    const comment: Comment = {
      id: `${Date.now()}-${scheduled.botId}`,
      author: scheduled.author,
      content: '', // À remplir par le bot
      date: scheduled.scheduledAt,
      likes: 0,
      status: 'bot',
      replyTo: null,
      scheduledStatus: 'scheduled',
      scheduledAt: scheduled.scheduledAt
    }

    newComments.push(comment)
    data.comments.push(comment)
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

  return newComments
}

// Obtenir tous les commentaires en attente de publication
export function getScheduledComments(): Array<{ slug: string; comment: Comment }> {
  if (!fs.existsSync(commentsDirectory)) {
    return []
  }

  const results: Array<{ slug: string; comment: Comment }> = []
  const files = fs.readdirSync(commentsDirectory).filter(f => f.endsWith('.json'))

  for (const file of files) {
    const slug = file.replace('.json', '')
    const filePath = path.join(commentsDirectory, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const data: CommentsData = JSON.parse(content)

    for (const comment of data.comments) {
      if (comment.scheduledStatus === 'scheduled') {
        results.push({ slug, comment })
      }
    }
  }

  return results.sort((a, b) => {
    const dateA = new Date(a.comment.scheduledAt || a.comment.date)
    const dateB = new Date(b.comment.scheduledAt || b.comment.date)
    return dateA.getTime() - dateB.getTime()
  })
}

// Formate la date relative
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
