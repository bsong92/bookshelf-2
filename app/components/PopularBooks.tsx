"use client";

import { useEffect, useState } from "react";
import BookCard from "./BookCard";

type PopularBook = {
  book_key: string;
  title: string;
  author: string;
  cover_id: number | null;
  count: number;
};

export default function PopularBooks() {
  const [books, setBooks] = useState<PopularBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites/popular")
      .then((res) => res.json())
      .then((data) => setBooks(data.books))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          Popular Books
        </h2>
        <p className="text-sm text-zinc-500 text-center py-4">Loading...</p>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          Popular Books
        </h2>
        <p className="text-sm text-zinc-500 text-center py-4">
          No favorites yet. Be the first to add one!
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-3">
        Popular Books
      </h2>
      <div className="flex flex-col gap-2">
        {books.map((book) => (
          <BookCard
            key={book.book_key}
            book={{
              key: book.book_key,
              title: book.title,
              author: book.author,
              cover_id: book.cover_id,
            }}
            showCount
            count={book.count}
          />
        ))}
      </div>
    </section>
  );
}
