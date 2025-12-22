import Link from 'next/link'
import { categoryConfig, type Article } from '@/lib/articles'
import ImagePlaceholder from './ImagePlaceholder'

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
          <ImagePlaceholder
            category={article.category}
            className="w-full aspect-[2.5/1]"
          />
          <div className="p-5">
            <span
              className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full mb-3"
              style={{ backgroundColor: config.color, color: '#fff' }}
            >
              {config.label}
            </span>
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
        <ImagePlaceholder
          category={article.category}
          className="w-full sm:w-40 h-32 sm:h-auto flex-shrink-0"
        />
        <div className="p-4 flex flex-col justify-center">
          <span
            className="inline-block w-fit px-2 py-0.5 text-xs font-semibold rounded mb-2"
            style={{ backgroundColor: config.color, color: '#fff' }}
          >
            {config.label}
          </span>
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
