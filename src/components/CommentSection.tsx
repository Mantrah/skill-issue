'use client'

import { useState } from 'react'

interface Comment {
  id: string
  author: string
  avatar?: string
  content: string
  date: string
  likes: number
}

// Commentaires mockés par article
const mockComments: Record<string, Comment[]> = {
  'metroid-prime-4-attente': [
    {
      id: '1',
      author: 'SamusHunter64',
      content: 'Enfin ! Ça fait 7 ans que j\'attends ce moment. J\'ai vieilli plus vite que le développement de ce jeu.',
      date: 'il y a 2 heures',
      likes: 42,
    },
    {
      id: '2',
      author: 'NintendoFanboy',
      content: 'Je refuse de croire que c\'est réel tant que je n\'ai pas la cartouche entre les mains.',
      date: 'il y a 5 heures',
      likes: 18,
    },
  ],
  'nintendo-fuite-cartouches': [
    {
      id: '1',
      author: 'TechLeaker2025',
      content: '128 Go c\'est bien, mais attendez de voir le prix des jeux...',
      date: 'il y a 1 heure',
      likes: 67,
    },
    {
      id: '2',
      author: 'RetroGamer',
      content: 'On est passé de souffler dans les cartouches à télécharger des day-one patches de 50 Go.',
      date: 'il y a 3 heures',
      likes: 156,
    },
  ],
  'ea-fc25-microtransactions': [
    {
      id: '1',
      author: 'FIFAVeteran',
      content: 'Surprise ! EA qui fait des microtransactions. Qui l\'aurait cru ?',
      date: 'il y a 30 minutes',
      likes: 89,
    },
    {
      id: '2',
      author: 'FootballManager',
      content: 'J\'ai calculé : pour avoir l\'équipe de mes rêves, il me faudrait vendre un rein. Les deux en fait.',
      date: 'il y a 4 heures',
      likes: 234,
    },
  ],
  'ubisoft-ac-shadows': [
    {
      id: '1',
      author: 'AssassinVeteran',
      content: 'Après tous ces reports, le jeu a intérêt à être parfait. Genre, vraiment parfait.',
      date: 'il y a 1 heure',
      likes: 45,
    },
    {
      id: '2',
      author: 'JapanHistoryNerd',
      content: 'J\'espère qu\'ils ont bien fait leurs recherches historiques cette fois. Les samouraïs méritent mieux.',
      date: 'il y a 6 heures',
      likes: 78,
    },
  ],
}

// Commentaires par défaut si l'article n'a pas de commentaires mockés
const defaultComments: Comment[] = [
  {
    id: '1',
    author: 'GamerAnon',
    content: 'Premier commentaire ! Enfin un article de qualité.',
    date: 'il y a 1 heure',
    likes: 12,
  },
  {
    id: '2',
    author: 'SkillIssueReader',
    content: 'Ce site est une pépite. Continuez comme ça !',
    date: 'il y a 3 heures',
    likes: 28,
  },
]

interface CommentSectionProps {
  slug: string
}

export default function CommentSection({ slug }: CommentSectionProps) {
  const comments = mockComments[slug] || defaultComments
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set())

  const toggleLike = (commentId: string) => {
    setLikedComments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }

  return (
    <section className="mt-12 pt-8 border-t border-card-border">
      <h3 className="text-lg font-bold text-foreground mb-6">
        Commentaires ({comments.length})
      </h3>

      {/* Zone de commentaire (désactivée pour le POC) */}
      <div className="mb-8 p-4 bg-card border border-card-border rounded-xl">
        <div className="flex gap-3">
          {/* Avatar placeholder */}
          <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-muted" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div className="flex-1">
            <textarea
              placeholder="Connectez-vous pour commenter..."
              disabled
              className="w-full p-3 bg-background border border-card-border rounded-lg text-sm text-muted resize-none cursor-not-allowed"
              rows={2}
            />
            <div className="mt-2 flex justify-end">
              <button
                disabled
                className="px-4 py-2 bg-accent/50 text-white text-sm font-medium rounded-lg cursor-not-allowed"
              >
                Commenter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des commentaires */}
      <div className="space-y-4">
        {comments.map(comment => {
          const isLiked = likedComments.has(comment.id)
          const displayLikes = isLiked ? comment.likes + 1 : comment.likes

          return (
            <div key={comment.id} className="p-4 bg-card border border-card-border rounded-xl">
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-accent">
                    {comment.author.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground text-sm">
                      {comment.author}
                    </span>
                    <span className="text-xs text-muted">
                      {comment.date}
                    </span>
                  </div>

                  <p className="text-foreground/90 text-sm leading-relaxed">
                    {comment.content}
                  </p>

                  {/* Actions */}
                  <div className="mt-3 flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(comment.id)}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        isLiked ? 'text-red-500' : 'text-muted hover:text-red-500'
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill={isLiked ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      <span>{displayLikes}</span>
                    </button>

                    <button
                      disabled
                      className="flex items-center gap-1.5 text-sm text-muted cursor-not-allowed"
                      title="Bientot disponible"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                      <span>Repondre</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
