import { notFound } from "next/navigation";
import { getArticleBySlug, getAllSlugs } from "@/lib/articles";
import { getCommentsBySlug } from "@/lib/comments";
import ArticlePageClient from "@/components/ArticlePageClient";
import type { Metadata } from "next";

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
  // Get slugs from both locales
  const slugsFr = getAllSlugs('fr');
  const slugsEn = getAllSlugs('en');
  const allSlugs = [...new Set([...slugsFr, ...slugsEn])];
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug, 'fr') || getArticleBySlug(slug, 'en');

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

  // Fetch article for both locales
  const articleFr = getArticleBySlug(slug, 'fr');
  const articleEn = getArticleBySlug(slug, 'en');

  // If neither exists, 404
  if (!articleFr && !articleEn) {
    notFound();
  }

  // Fetch comments from JSON
  const comments = getCommentsBySlug(slug);

  return (
    <ArticlePageClient
      articleFr={articleFr}
      articleEn={articleEn}
      slug={slug}
      initialLikes={articleLikes[slug] || 0}
      comments={comments}
    />
  );
}
