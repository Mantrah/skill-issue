import { getAllArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";

export default function Home() {
  const articles = getAllArticles();
  const [featured, ...rest] = articles;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {featured && (
        <section className="mb-8">
          <ArticleCard article={featured} featured />
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">
            Derniers articles
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {rest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {articles.length === 0 && (
        <p className="text-muted text-center py-12">
          Aucun article pour le moment.
        </p>
      )}
    </div>
  );
}
