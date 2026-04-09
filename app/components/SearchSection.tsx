"use client";

import { useState } from "react";
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
    <section>
      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-3">
        Search Books
      </h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author..."
          className="flex-1 h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-10 px-4 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 disabled:opacity-50 transition-colors"
        >
          {loading ? "..." : "Search"}
        </button>
      </form>

      {loading && (
        <p className="text-sm text-zinc-500 text-center py-4">Searching OpenLibrary...</p>
      )}

      {!loading && searched && results.length === 0 && (
        <p className="text-sm text-zinc-500 text-center py-4">No results found.</p>
      )}

      <div className="flex flex-col gap-2">
        {results.map((book) => (
          <BookCard
            key={book.key}
            book={book}
            isFavorited={favoriteKeys.has(book.key)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}
