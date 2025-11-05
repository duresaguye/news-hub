import { useParams } from "react-router-dom";
import RelatedArticles from "@/components/related-articles";

export default function Article() {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <article className="space-y-4">
        <p className="text-sm text-muted-foreground">Article ID: {id}</p>
        <h1 className="text-3xl font-bold text-foreground">Sample Article Title</h1>
        <p className="text-foreground">
          This is a placeholder article page. Integrate your article content here.
        </p>
      </article>
      <RelatedArticles currentId={String(id ?? "")} />
    </div>
  );
}


