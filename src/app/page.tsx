import { getAllArticles } from "@/lib/articles";
import CategoryFilter from "@/components/CategoryFilter";

export default function Home() {
  // Fetch articles for both locales server-side
  const articlesFr = getAllArticles('fr');
  const articlesEn = getAllArticles('en');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <CategoryFilter articlesFr={articlesFr} articlesEn={articlesEn} />
    </div>
  );
}
