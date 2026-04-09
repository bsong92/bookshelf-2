"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import BookCard from "./BookCard";

type Book = {
  key: string;
  title: string;
  author: string;
  cover_id: number | null;
  year?: number | null;
};

export default function SearchSection({
  favoriteKeys,
  onToggleFavorite,
}: {
  favoriteKeys: Set<string>;
  onToggleFavorite: (book: Book) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.docs);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-10">
      <h2 className="font-[family-name:var(--font-dm-sans)] font-semibold text-2xl text-foreground mb-5 text-center tracking-tight">
        Discover
      </h2>

      <form onSubmit={handleSearch} className="relative mb-6">
        <div className="relative">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or keyword..."
            className="h-11 pl-10 pr-20 bg-card border-border/60 rounded-lg text-sm placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-4 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? "..." : "Search"}
          </button>
        </div>
      </form>

      {loading && (
        <div className="space-y-0 divide-y divide-border/40">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-5 py-5">
              <Skeleton className="w-16 h-24 rounded-sm flex-shrink-0" />
              <div className="flex-1 space-y-2 py-2">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-2.5 w-12 mt-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-12">
          <p className="font-[family-name:var(--font-instrument-serif)] text-lg text-muted-foreground italic">
            Nothing found. Try a different search.
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="divide-y divide-border/40">
          {results.map((book, i) => (
            <BookCard
              key={book.key}
              book={book}
              isFavorited={favoriteKeys.has(book.key)}
              onToggleFavorite={onToggleFavorite}
              index={i}
            />
          ))}
        </div>
      )}
    </section>
  );
}
