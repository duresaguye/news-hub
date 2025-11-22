'use client';

import ArticleGrid from "@/components/article-grid";
import Hero from "@/components/hero";
import { useTopHeadlines } from "@/lib/newsHooks";
import { Empty } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const { data, loading, error } = useTopHeadlines({ pageSize: 18 });

  return (
    <div>
      <Hero />
      {loading && (
        <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center"><Spinner /></div>
      )}
      {!loading && error && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <Empty title="Failed to load news" />
          <p className="mt-4 text-sm text-muted-foreground">{error}</p>
        </div>
      )}
      {!loading && !error && (
        <ArticleGrid articles={data ?? []} title="Top Headlines" badgeText="Live" />
      )}
    </div>
  );
}
