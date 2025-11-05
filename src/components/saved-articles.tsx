import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bookmark, ArrowRight } from "lucide-react"

export default function SavedArticles() {
  const savedArticles = [
    {
      id: 1,
      title: "Ethiopia's Path to Digital Transformation",
      source: "Tech Today",
      date: "Nov 1, 2025",
      category: "Technology",
    },
    {
      id: 2,
      title: "Investment Opportunities in East Africa",
      source: "Business Insights",
      date: "Oct 28, 2025",
      category: "Business",
    },
    {
      id: 3,
      title: "Cultural Heritage Conservation Efforts",
      source: "Culture Weekly",
      date: "Oct 25, 2025",
      category: "Culture",
    },
  ]

  return (
    <div className="space-y-4">
      {savedArticles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No saved articles yet</p>
            <p className="text-sm text-muted-foreground mt-2">Start saving articles to read them later</p>
          </CardContent>
        </Card>
      ) : (
        savedArticles.map((article) => (
          <Card key={article.id} className="hover:border-primary transition cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-primary uppercase">{article.category}</span>
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                  </div>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{article.source}</span>
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-primary fill-primary" />
                <ArrowRight className="w-4 h-4 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
