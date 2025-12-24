import Link from 'next/link'
import Image from 'next/image'
import { categoryConfig, type Category } from '@/lib/categories'
import ImagePlaceholder from './ImagePlaceholder'

interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  category: Category
  image?: string
  date: string
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface ArticleCardProps {
  article: Article
  featured?: boolean
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const config = categoryConfig[article.category]

  if (featured) {
    return (
      <article className="group bg-card border border-card-border rounded-xl overflow-hidden hover:border-accent/30 transition-colors">
        <Link href={`/article/${article.slug}`} className="block">
          {article.image ? (
            <div className="relative w-full aspect-[2.5/1]">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <ImagePlaceholder
              category={article.category}
              className="w-full aspect-[2.5/1]"
            />
          )}
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full"
                style={{ backgroundColor: config.color, color: '#fff' }}
              >
                {config.label}
              </span>
              <span className="text-xs text-muted">{formatDate(article.date)}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight group-hover:text-accent transition-colors">
              {article.title}
            </h2>
            <p className="mt-3 text-muted line-clamp-2">
              {article.excerpt}
            </p>
          </div>
        </Link>
      </article>
    )
  }

  return (
    <article className="group bg-card border border-card-border rounded-xl overflow-hidden hover:border-accent/30 transition-colors">
      <Link href={`/article/${article.slug}`} className="flex flex-col sm:flex-row">
        {article.image ? (
          <div className="relative w-full sm:w-40 h-32 sm:h-auto flex-shrink-0">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <ImagePlaceholder
            category={article.category}
            className="w-full sm:w-40 h-32 sm:h-auto flex-shrink-0"
          />
        )}
        <div className="p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-block w-fit px-2 py-0.5 text-xs font-semibold rounded"
              style={{ backgroundColor: config.color, color: '#fff' }}
            >
              {config.label}
            </span>
            <span className="text-xs text-muted">{formatDate(article.date)}</span>
          </div>
          <h2 className="text-base font-semibold leading-snug text-foreground group-hover:text-accent transition-colors line-clamp-2">
            {article.title}
          </h2>
          <p className="mt-2 text-sm text-muted line-clamp-2 hidden sm:block">
            {article.excerpt}
          </p>
        </div>
      </Link>
    </article>
  )
}
