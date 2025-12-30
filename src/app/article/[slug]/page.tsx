import { notFound } from "next/navigation";
import { getArticleBySlug, getAllSlugs } from "@/lib/articles";
import { getCommentsBySlug } from "@/lib/comments";
import { matchLikers, generateLikeCount } from "@/lib/liker-matcher";
import ArticlePageClient from "@/components/ArticlePageClient";
import type { Metadata } from "next";

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

  // Match likers based on article content
  const article = articleFr || articleEn!;
  const likers = matchLikers(
    `${article.title} ${article.content}`,
    article.tags,
    5
  );

  // Generate deterministic like count based on slug
  const initialLikes = generateLikeCount(slug);

  return (
    <ArticlePageClient
      articleFr={articleFr}
      articleEn={articleEn}
      slug={slug}
      initialLikes={initialLikes}
      likers={likers}
      comments={comments}
    />
  );
}
