'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { categoryConfig, type Category } from '@/lib/categories'

interface PendingArticle {
  id: string
  slug: string
  tags: Category[]
  imageUrl: string
  localImage?: string
  date: string
  status: 'pending' | 'approved' | 'rejected' | 'published' | 'needs_correction'
  createdAt: string
  fr: { title: string; content: string }
  en: { title: string; content: string }
  metadata?: { sourceUrl?: string; sourceName?: string }
  correction?: { prompt: string; requestedAt: string }
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'En attente' },
    approved: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Approuvé' },
    rejected: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Refusé' },
    published: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Publié' },
    needs_correction: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'À corriger' },
  }
  const { bg, text, label } = config[status] || config.pending
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${bg} ${text}`}>
      {label}
    </span>
  )
}

function ImageSourcePreview({ url }: { url: string }) {
  const filename = url.split('/').pop() || 'image'
  const isWikimedia = url.includes('wikimedia.org')

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-card-border/20 p-2">
      <div className="text-2xl mb-1">🖼️</div>
      <p className="text-[10px] text-muted/80 text-center leading-tight">
        {isWikimedia ? 'Wikimedia' : 'Externe'}
      </p>
      <p className="text-[9px] text-muted/50 text-center truncate w-full mt-1" title={filename}>
        {filename.length > 20 ? filename.slice(0, 20) + '...' : filename}
      </p>
    </div>
  )
}

function extractExcerpt(content: string): string {
  const match = content.match(/\*\*(.+?)\*\*/s)
  if (match) {
    const excerpt = match[1].replace(/\n/g, ' ').trim()
    return excerpt.length > 180 ? excerpt.substring(0, 180) + '...' : excerpt
  }
  return ''
}

export default function AdminArticleCard({ article }: { article: PendingArticle }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [mode, setMode] = useState<'view' | 'edit' | 'correct'>('view')
  const [loading, setLoading] = useState(false)

  // Edit mode state
  const [editFr, setEditFr] = useState(article.fr.content)
  const [editEn, setEditEn] = useState(article.en.content)

  // Correction mode state
  const [correctionPrompt, setCorrectionPrompt] = useState('')

  const handleAction = async (action: 'publish' | 'reject' | 'correct' | 'edit') => {
    setLoading(true)
    try {
      const body: Record<string, unknown> = { slug: article.slug, action }

      if (action === 'correct') {
        body.correctionPrompt = correctionPrompt
      } else if (action === 'edit') {
        body.fr = { ...article.fr, content: editFr }
        body.en = { ...article.en, content: editEn }
      }

      const res = await fetch('/api/articles/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Erreur')
      }

      // Reset state and refresh
      setMode('view')
      setCorrectionPrompt('')
      router.refresh()
    } catch (error) {
      console.error('Action failed:', error)
      alert(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    setMode('view')
    setEditFr(article.fr.content)
    setEditEn(article.en.content)
    setCorrectionPrompt('')
  }

  return (
    <article className="bg-card border border-card-border rounded-xl overflow-hidden hover:border-card-border/80 transition-colors">
      {/* Header with image */}
      <div className="flex">
        {/* Image */}
        <div className="w-40 h-28 flex-shrink-0 relative bg-background border-r border-card-border overflow-hidden">
          {article.localImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.localImage}
              alt={article.fr.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <a
              href={article.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full hover:bg-card-border/30 transition-colors"
              title="Voir l'image source"
            >
              <ImageSourcePreview url={article.imageUrl} />
            </a>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={article.status} />
            {article.tags.map(tag => {
              const config = categoryConfig[tag]
              return (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] font-bold rounded uppercase"
                  style={{ backgroundColor: config?.color || '#666', color: '#fff' }}
                >
                  {config?.label || tag}
                </span>
              )
            })}
            <span className="text-xs text-muted/60 ml-auto">
              {new Date(article.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>

          <h2 className="font-bold text-foreground leading-tight line-clamp-1 mb-1">
            {article.fr.title}
          </h2>
          <p className="text-xs text-muted/70 line-clamp-1">
            {article.en.title}
          </p>
        </div>
      </div>

      {/* Correction prompt display */}
      {article.status === 'needs_correction' && article.correction && (
        <div className="px-4 py-2 bg-orange-500/10 border-t border-orange-500/20">
          <p className="text-xs text-orange-400">
            <span className="font-semibold">Correction demandée :</span> {article.correction.prompt}
          </p>
        </div>
      )}

      {/* Excerpt */}
      <div className="px-4 pb-3 border-t border-card-border/50">
        <p className="text-sm text-muted pt-3 line-clamp-2">
          {extractExcerpt(article.fr.content)}
        </p>
      </div>

      {/* Expandable content - View mode */}
      {expanded && mode === 'view' && (
        <div className="border-t border-card-border bg-background/50">
          <div className="p-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded">FR</span>
                  <span className="text-xs font-medium text-foreground">Version française</span>
                </div>
                <div className="bg-card rounded-lg border border-card-border p-3 max-h-80 overflow-y-auto">
                  <pre className="text-xs text-muted whitespace-pre-wrap font-sans leading-relaxed">
                    {article.fr.content}
                  </pre>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded">EN</span>
                  <span className="text-xs font-medium text-foreground">English version</span>
                </div>
                <div className="bg-card rounded-lg border border-card-border p-3 max-h-80 overflow-y-auto">
                  <pre className="text-xs text-muted whitespace-pre-wrap font-sans leading-relaxed">
                    {article.en.content}
                  </pre>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-card-border/50 flex items-center gap-2 text-xs text-muted/60">
              <span>Slug: <code className="bg-background px-1.5 py-0.5 rounded text-foreground/80">{article.slug}</code></span>
              <span className="mx-2">•</span>
              <span>ID: <code className="bg-background px-1.5 py-0.5 rounded">{article.id.slice(0, 8)}...</code></span>
              {article.metadata?.sourceName && (
                <>
                  <span className="mx-2">•</span>
                  <span>Source: {article.metadata.sourceName}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit mode */}
      {expanded && mode === 'edit' && (
        <div className="border-t border-card-border bg-background/50">
          <div className="p-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded">FR</span>
                  <span className="text-xs font-medium text-foreground">Version française</span>
                </div>
                <textarea
                  value={editFr}
                  onChange={(e) => setEditFr(e.target.value)}
                  className="w-full h-80 bg-card rounded-lg border border-card-border p-3 text-xs text-foreground font-mono leading-relaxed resize-none focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded">EN</span>
                  <span className="text-xs font-medium text-foreground">English version</span>
                </div>
                <textarea
                  value={editEn}
                  onChange={(e) => setEditEn(e.target.value)}
                  className="w-full h-80 bg-card rounded-lg border border-card-border p-3 text-xs text-foreground font-mono leading-relaxed resize-none focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-card-border/50 flex items-center gap-2">
              <button
                onClick={() => handleAction('edit')}
                disabled={loading}
                className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                onClick={cancelEdit}
                disabled={loading}
                className="px-4 py-1.5 text-xs font-medium text-muted hover:text-foreground border border-card-border rounded-lg hover:bg-background transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Correction mode */}
      {expanded && mode === 'correct' && (
        <div className="border-t border-card-border bg-background/50">
          <div className="p-4">
            <div className="mb-3">
              <label className="block text-xs font-medium text-foreground mb-2">
                Instructions de correction pour l'IA
              </label>
              <textarea
                value={correctionPrompt}
                onChange={(e) => setCorrectionPrompt(e.target.value)}
                placeholder="Ex: Raccourcir l'article, ajouter une statistique bidon sur le temps de jeu moyen..."
                className="w-full h-24 bg-card rounded-lg border border-card-border p-3 text-sm text-foreground leading-relaxed resize-none focus:outline-none focus:border-orange-500 placeholder:text-muted/50"
              />
              <p className="text-[10px] text-muted/60 mt-1">
                L'article sera marqué "À corriger" et pourra être régénéré par le content-generator
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAction('correct')}
                disabled={loading || correctionPrompt.trim().length < 10}
                className="px-4 py-1.5 text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi...' : 'Demander correction'}
              </button>
              <button
                onClick={cancelEdit}
                disabled={loading}
                className="px-4 py-1.5 text-xs font-medium text-muted hover:text-foreground border border-card-border rounded-lg hover:bg-background transition-colors"
              >
                Annuler
              </button>
              {correctionPrompt.trim().length > 0 && correctionPrompt.trim().length < 10 && (
                <span className="text-[10px] text-red-400">Min. 10 caractères</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-card-border bg-card">
        <button
          onClick={() => {
            if (!expanded) setExpanded(true)
            else if (mode !== 'view') setMode('view')
            else setExpanded(false)
          }}
          className="px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground border border-card-border rounded-lg hover:bg-background transition-colors"
        >
          {!expanded ? '▼ Voir' : mode !== 'view' ? '← Retour' : '▲ Réduire'}
        </button>

        <div className="flex-1" />

        {article.status === 'pending' && (
          <>
            <button
              onClick={() => {
                setExpanded(true)
                setMode('edit')
              }}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-500/50 rounded-lg transition-colors"
            >
              Éditer
            </button>
            <button
              onClick={() => {
                setExpanded(true)
                setMode('correct')
              }}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium text-orange-400 hover:text-orange-300 border border-orange-500/30 hover:border-orange-500/50 rounded-lg transition-colors"
            >
              Corriger (IA)
            </button>
            <button
              onClick={() => handleAction('reject')}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-colors"
            >
              Rejeter
            </button>
            <button
              onClick={() => handleAction('publish')}
              disabled={loading}
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
            >
              Publier
            </button>
          </>
        )}

        {article.status === 'needs_correction' && (
          <>
            <button
              onClick={() => {
                setExpanded(true)
                setMode('edit')
              }}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-500/50 rounded-lg transition-colors"
            >
              Éditer manuellement
            </button>
            <button
              onClick={() => handleAction('reject')}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-colors"
            >
              Rejeter
            </button>
          </>
        )}

        {article.status === 'rejected' && (
          <span className="text-xs text-muted/60">Article archivé</span>
        )}
      </div>
    </article>
  )
}
