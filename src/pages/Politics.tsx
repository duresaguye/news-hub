import ArticleGrid from "@/components/article-grid";
import { useEverything } from "@/lib/newsHooks";
import { Spinner } from "@/components/ui/spinner";
import { Empty } from "@/components/ui/empty";

export default function Politics() {
  const { data, loading, error } = useEverything({ q: "politics", sortBy: "publishedAt", language: "en", pageSize: 18 });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-4">Politics</h1>
      {loading && (
        <div className="py-12 flex justify-center"><Spinner /></div>
      )}
      {!loading && error && (
        <Empty title="Failed to load politics" description={error} />
      )}
      {!loading && !error && (
        <ArticleGrid articles={data ?? []} title="Politics" badgeText="Latest" />
      )}
    </div>
  );
}


