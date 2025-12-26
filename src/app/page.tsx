import { getAllArticles } from "@/lib/articles";
import HomePageClient from "@/components/HomePageClient";

export default function Home() {
  const articlesFr = getAllArticles('fr');
  const articlesEn = getAllArticles('en');

  return <HomePageClient articlesFr={articlesFr} articlesEn={articlesEn} />;
}
