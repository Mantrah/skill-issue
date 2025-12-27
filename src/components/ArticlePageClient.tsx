'use client'

import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'react-markdown'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAmbientColor } from '@/hooks/useAmbientColor'
import { categoryConfig, type Category } from '@/lib/categories'
import { formatDateLocale } from '@/lib/i18n'
import ImagePlaceholder from './ImagePlaceholder'
import GamepadDecorations from './GamepadDecorations'
import ShareButtons from './ShareButtons'
import LikeButton from './LikeButton'
import ReportButton from './ReportButton'
import CommentSection from './CommentSection'

interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  category: Category
  image?: string
  date: string
}

interface Comment {
  id: string
  author: string
  content: string
  date: string
  likes: number
  status: 'admin' | 'bot' | 'user'
  replyTo: string | null
}

interface ArticlePageClientProps {
  articleFr: Article | null
  articleEn: Article | null
  slug: string
  initialLikes: number
  comments: Comment[]
}

export default function ArticlePageClient({
  articleFr,
  articleEn,
  slug,
  initialLikes,
  comments,
}: ArticlePageClientProps) {
  const { locale, t } = useLanguage()

  // Select article based on locale, fallback to French
  const article = locale === 'en' && articleEn ? articleEn : articleFr

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-muted text-center">{t.noArticles}</p>
      </div>
    )
  }

  const config = categoryConfig[article.category]
  const categoryLabel = t.categories[article.category as keyof typeof t.categories] || config.label

  // Effet Ambilight : extraction couleur dynamique depuis l'image
  const { ambientStyle } = useAmbientColor(article.image)

  return (
    <div
      className="min-h-screen transition-all duration-1000 ease-out"
      style={ambientStyle}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <span>&larr;</span>
        <span>{t.backToArticles}</span>
      </Link>

      <article>
        <header className="mb-8">
          {article.image ? (
            <div className="relative w-full aspect-[3/1] rounded-xl overflow-hidden mb-6">
              <GamepadDecorations />
              {/* Zone écran centrale - 50% au milieu avec bordure */}
              <div className="absolute inset-0 flex items-center justify-center z-10 p-2">
                <div className="w-[60%] h-full border-2 border-black rounded-sm bg-black overflow-hidden flex items-center">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={1920}
                    height={1080}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          ) : (
            <ImagePlaceholder
              category={article.category}
              className="w-full aspect-[3/1] rounded-xl mb-6"
            />
          )}

          <div className="flex items-center gap-3 mb-4">
            <span
              className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full"
              style={{ backgroundColor: config.color, color: '#fff' }}
            >
              {categoryLabel}
            </span>
            <span className="text-sm text-muted">{formatDateLocale(article.date, locale)}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold leading-tight text-foreground mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <LikeButton initialLikes={initialLikes} />
            <ShareButtons
              url={`https://skillissue.fr/article/${slug}`}
              title={article.title}
            />
            <ReportButton />
          </div>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none prose-p:text-foreground/90 prose-strong:text-foreground prose-a:text-accent hover:prose-a:text-accent-hover">
          <Markdown>{article.content}</Markdown>
        </div>
      </article>

      <CommentSection slug={slug} comments={comments} />
      </div>
    </div>
  )
}
