"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"

interface SearchFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  onClearFilters: () => void
}

export default function SearchFilters({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  onClearFilters,
}: SearchFiltersProps) {
  const categories = [
    { id: "all", label: "All Categories", count: 128 },
    { id: "politics", label: "Politics", count: 32 },
    { id: "technology", label: "Technology", count: 24 },
    { id: "business", label: "Business", count: 28 },
    { id: "sports", label: "Sports", count: 18 },
    { id: "entertainment", label: "Entertainment", count: 15 },
    { id: "health", label: "Health", count: 11 },
  ]

  const sortOptions = [
    { id: "recent", label: "Most Recent" },
    { id: "popular", label: "Most Popular" },
    { id: "relevant", label: "Most Relevant" },
  ]

  const hasActiveFilters = selectedCategory !== "all"

  return (
    <div className="space-y-6">
      {/* Filters Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-8 gap-1">
            <X className="w-3 h-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all hover:border-gray-300 ${
                selectedCategory === category.id 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full border-2 ${
                  selectedCategory === category.id 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'border-gray-300'
                }`} />
                <span className={`font-medium ${
                  selectedCategory === category.id ? 'text-blue-900' : 'text-gray-700'
                }`}>
                  {category.label}
                </span>
              </div>
              <Badge 
                variant="secondary" 
                className={`${
                  selectedCategory === category.id 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {category.count}
              </Badge>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Sort Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Sort By</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onSortChange(option.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all hover:border-gray-300 ${
                sortBy === option.id 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full border-2 ${
                  sortBy === option.id 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'border-gray-300'
                }`} />
                <span className={`font-medium ${
                  sortBy === option.id ? 'text-blue-900' : 'text-gray-700'
                }`}>
                  {option.label}
                </span>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Active Filters</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCategory !== "all" && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  Category: {categories.find(c => c.id === selectedCategory)?.label}
                  <button 
                    onClick={() => onCategoryChange('all')}
                    className="ml-1 hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Sort: {sortOptions.find(o => o.id === sortBy)?.label}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}