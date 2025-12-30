'use client'

import { useState } from 'react'
import type { Comment } from '@/lib/comments'

interface ScheduledComment {
  slug: string
  comment: Comment
}

interface PublishedByArticle {
  slug: string
  comments: Comment[]
}

interface Props {
  scheduledComments: ScheduledComment[]
  publishedByArticle: PublishedByArticle[]
}

export default function CommentsAdminClient({ scheduledComments, publishedByArticle }: Props) {
  const [activeTab, setActiveTab] = useState<'scheduled' | 'published'>('scheduled')

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'scheduled'
              ? 'bg-accent text-white'
              : 'bg-card border border-card-border text-muted hover:text-foreground'
          }`}
        >
          Scheduled ({scheduledComments.length})
        </button>
        <button
          onClick={() => setActiveTab('published')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'published'
              ? 'bg-accent text-white'
              : 'bg-card border border-card-border text-muted hover:text-foreground'
          }`}
        >
          Published ({publishedByArticle.reduce((acc, a) => acc + a.comments.length, 0)})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'scheduled' && (
        <ScheduledTab comments={scheduledComments} />
      )}

      {activeTab === 'published' && (
        <PublishedTab articles={publishedByArticle} />
      )}
    </div>
  )
}

function ScheduledTab({ comments }: { comments: ScheduledComment[] }) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        <p>Aucun commentaire planifie</p>
        <p className="text-sm mt-1">Les commentaires seront crees lors de la publication d&apos;un article</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {comments.map(({ slug, comment }) => (
        <div key={comment.id} className="p-4 bg-card border border-card-border rounded-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-foreground">{comment.author}</span>
                <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded">
                  scheduled
                </span>
              </div>
              <p className="text-sm text-muted truncate">Article: {slug}</p>
              {comment.scheduledAt && (
                <p className="text-xs text-muted mt-1">
                  Planifie pour: {new Date(comment.scheduledAt).toLocaleString('fr-FR')}
                </p>
              )}
              {comment.content ? (
                <p className="text-sm text-foreground/80 mt-2">{comment.content}</p>
              ) : (
                <p className="text-sm text-muted/50 italic mt-2">Contenu a generer...</p>
              )}
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs bg-green-500/20 text-green-500 rounded hover:bg-green-500/30 transition-colors">
                Publish Now
              </button>
              <button className="px-3 py-1 text-xs bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function PublishedTab({ articles }: { articles: PublishedByArticle[] }) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        <p>Aucun commentaire publie</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {articles.map(({ slug, comments }) => (
        <div key={slug}>
          <h3 className="text-sm font-semibold text-muted mb-2">{slug}</h3>
          <div className="space-y-2">
            {comments.map(comment => (
              <div key={comment.id} className="p-3 bg-card border border-card-border rounded-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground text-sm">{comment.author}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        comment.status === 'bot' ? 'bg-blue-500/20 text-blue-500' :
                        comment.status === 'admin' ? 'bg-purple-500/20 text-purple-500' :
                        'bg-gray-500/20 text-gray-500'
                      }`}>
                        {comment.status}
                      </span>
                      <span className="text-xs text-muted">{comment.likes} likes</span>
                    </div>
                    <p className="text-sm text-foreground/80">{comment.content}</p>
                  </div>
                  <button className="px-2 py-1 text-xs bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
