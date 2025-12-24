import { getAllArticles } from "@/lib/articles";
import CategoryFilter from "@/components/CategoryFilter";

export default function Home() {
  const articles = getAllArticles();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {articles.length > 0 ? (
        <CategoryFilter articles={articles} />
      ) : (
        <p className="text-muted text-center py-12">
          Aucun article pour le moment.
        </p>
      )}
    </div>
  );
}
