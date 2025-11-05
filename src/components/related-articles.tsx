import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

interface RelatedArticlesProps {
  currentId: string
}

export default function RelatedArticles({ currentId }: RelatedArticlesProps) {
  const relatedArticlesAll = [
    {
      id: "2",
      title: "Tech Startups Flourish in Addis Ababa",
      category: "Technology",
      source: "Tech Tribune",
    },
    {
      id: "3",
      title: "Government Announces New Investment Incentives",
      category: "Business",
      source: "Business Daily",
    },
    {
      id: "4",
      title: "Youth Unemployment Rate Drops by 15%",
      category: "Economy",
      source: "Economic News",
    },
  ]

  const relatedArticles = relatedArticlesAll.filter((a) => a.id !== currentId)

  return (
    <section>
      <h3 className="text-2xl font-bold text-foreground mb-6">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedArticles.map((article) => (
          <Link key={article.id} to={`/article/${article.id}`}>
            <Card className="h-full hover:border-primary transition cursor-pointer">
              <CardHeader>
                <div className="mb-2">
                  <span className="text-xs font-semibold text-primary uppercase">{article.category}</span>
                </div>
                <CardTitle className="line-clamp-2 text-balance">{article.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{article.source}</span>
                <ArrowRight className="w-4 h-4 text-primary" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
