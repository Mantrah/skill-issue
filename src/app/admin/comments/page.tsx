import { getScheduledComments, getAllCommentsFiles, getCommentsBySlug } from '@/lib/comments'
import CommentsAdminClient from './CommentsAdminClient'

export default function CommentsAdminPage() {
  // Get all scheduled comments
  const scheduledComments = getScheduledComments()

  // Get all published comments grouped by article
  const allSlugs = getAllCommentsFiles()
  const publishedByArticle = allSlugs.map(slug => {
    const comments = getCommentsBySlug(slug)
    const published = comments.filter(c => !c.scheduledStatus || c.scheduledStatus === 'published')
    return { slug, comments: published }
  }).filter(a => a.comments.length > 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Comments</h1>
        <p className="text-muted text-sm mt-1">Moderation et queue de publication</p>
      </div>

      <CommentsAdminClient
        scheduledComments={scheduledComments}
        publishedByArticle={publishedByArticle}
      />
    </div>
  )
}
