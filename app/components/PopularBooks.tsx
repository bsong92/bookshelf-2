"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

function getBookId(key: string) {
  return key.replace("/works/", "");
}

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

  return (
    <section className="pb-10">
      <div className="flex items-baseline gap-3 mb-6">
        <h2 className="font-[family-name:var(--font-dm-sans)] font-semibold text-2xl tracking-tight text-foreground">
          Community Picks
        </h2>
        <span className="text-xs text-muted-foreground tracking-wide uppercase">
          Most favorited by readers
        </span>
      </div>

      {loading ? (
        <div className="relative">
          <div className="flex gap-5 overflow-hidden pb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-shrink-0">
                <Skeleton className="w-[120px] h-[180px] rounded-sm" />
                <Skeleton className="h-3 w-20 mt-3" />
                <Skeleton className="h-2.5 w-14 mt-1.5" />
              </div>
            ))}
          </div>
          <div className="shelf-plank h-3 rounded-sm -mt-1" />
        </div>
      ) : books.length === 0 ? (
        <div className="relative">
          <div className="py-16 text-center">
            <p className="font-[family-name:var(--font-instrument-serif)] text-lg text-muted-foreground italic">
              The shelf is empty&mdash;be the first to place a book.
            </p>
          </div>
          <div className="shelf-plank h-3 rounded-sm" />
        </div>
      ) : (
        <div className="relative">
          {/* The books */}
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
            {books.map((book, i) => {
              const coverUrl = book.cover_id
                ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
                : null;

              return (
                <Link
                  href={`/book/${getBookId(book.book_key)}`}
                  key={book.book_key}
                  className="flex-shrink-0 group animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="relative">
                    <div className="w-[120px] h-[180px] rounded-sm overflow-hidden book-shadow transition-transform duration-300 group-hover:-translate-y-2">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted p-3">
                          <span className="font-[family-name:var(--font-instrument-serif)] text-sm text-center text-muted-foreground italic leading-tight">
                            {book.title}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Fav count pill */}
                    <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow-md">
                      {book.count}
                    </div>
                  </div>
                  <p className="text-xs font-medium text-foreground mt-3 line-clamp-1 w-[120px] group-hover:text-primary transition-colors">
                    {book.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground line-clamp-1 w-[120px]">
                    {book.author}
                  </p>
                </Link>
              );
            })}
          </div>

          {/* The wooden shelf plank */}
          <div className="shelf-plank h-3 rounded-sm -mt-1" />
        </div>
      )}
    </section>
  );
}
