import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, getAllSlugs, categoryConfig } from "@/lib/articles";
import Markdown from "react-markdown";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import type { Metadata } from "next";

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
          <ImagePlaceholder
            category={article.category}
            className="w-full aspect-[3/1] rounded-xl mb-6"
          />

          <span
            className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full mb-4"
            style={{ backgroundColor: config.color, color: '#fff' }}
          >
            {config.label}
          </span>

          <h1 className="text-2xl md:text-3xl font-bold leading-tight text-foreground">
            {article.title}
          </h1>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none prose-p:text-foreground/90 prose-strong:text-foreground prose-a:text-accent hover:prose-a:text-accent-hover">
          <Markdown>{article.content}</Markdown>
        </div>
      </article>
    </div>
  );
}
