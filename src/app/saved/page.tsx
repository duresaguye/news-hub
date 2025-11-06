"use client";
import SavedArticles from "@/components/saved-articles";

export default function SavedPage() {
  return (
    <div className="max-w-3xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Saved Articles</h1>
      <SavedArticles />
    </div>
  );
}
