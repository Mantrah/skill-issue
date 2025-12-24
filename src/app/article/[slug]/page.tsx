import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getArticleBySlug, getAllSlugs, categoryConfig } from "@/lib/articles";
import Markdown from "react-markdown";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import ShareButtons from "@/components/ShareButtons";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";
import type { Metadata } from "next";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Likes mockés par article (sera remplacé par la DB)
const articleLikes: Record<string, number> = {
  'ubisoft-ac-shadows': 127,
  'ea-fc25-microtransactions': 89,
  'nintendo-fuite-cartouches': 234,
  'metroid-prime-4-attente': 456,
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Article non trouvé" };
  }

  return {
    title: `${article.title} | Skill Issue`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const config = categoryConfig[article.category];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <span>←</span>
        <span>Retour aux articles</span>
      </Link>

      <article>
        <header className="mb-8">
          {article.image ? (
            <div className="relative w-full aspect-[3/1] rounded-xl overflow-hidden mb-6">
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
              className="w-full aspect-[3/1] rounded-xl mb-6"
            />
          )}

          <div className="flex items-center gap-3 mb-4">
            <span
              className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full"
              style={{ backgroundColor: config.color, color: '#fff' }}
            >
              {config.label}
            </span>
            <span className="text-sm text-muted">{formatDate(article.date)}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold leading-tight text-foreground mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <LikeButton initialLikes={articleLikes[slug] || 0} />
            <ShareButtons
              url={`https://skillissue.fr/article/${slug}`}
              title={article.title}
            />
          </div>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none prose-p:text-foreground/90 prose-strong:text-foreground prose-a:text-accent hover:prose-a:text-accent-hover">
          <Markdown>{article.content}</Markdown>
        </div>
      </article>

      <CommentSection slug={slug} />
    </div>
  );
}
