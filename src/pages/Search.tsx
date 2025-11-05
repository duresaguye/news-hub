import { useState } from "react";
import SearchFilters from "@/components/search-filters";
import SearchResults from "@/components/search-results";

export default function Search() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-1 space-y-6">
        <div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
          />
        </div>
        <SearchFilters
          selectedCategory={category}
          onCategoryChange={setCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onClearFilters={() => { setCategory("all"); setSortBy("recent"); setQuery(""); }}
        />
      </div>
      <div className="md:col-span-3">
        <SearchResults query={query} category={category} sortBy={sortBy} />
      </div>
    </div>
  );
}


