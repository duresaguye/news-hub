import ArticleGrid from "@/components/article-grid";
import { useEverything } from "@/lib/newsHooks";
import { Spinner } from "@/components/ui/spinner";
import { Empty } from "@/components/ui/empty";

export default function World() {
  const { data, loading, error } = useEverything({ q: "world", sortBy: "publishedAt", language: "en", pageSize: 18 });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-4">World</h1>
      {loading && (
        <div className="py-12 flex justify-center"><Spinner /></div>
      )}
      {!loading && error && (
        <Empty title="Failed to load world news" description={error} />
      )}
      {!loading && !error && (
        <ArticleGrid articles={data ?? []} title="World News" badgeText="Global" />
      )}
    </div>
  );
}


