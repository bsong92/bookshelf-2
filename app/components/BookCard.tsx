"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Book = {
  key: string;
  title: string;
  author: string;
  cover_id: number | null;
  year?: number | null;
};

function getBookId(key: string) {
  // "/works/OL64365W" -> "OL64365W"
  return key.replace("/works/", "");
}

export default function BookCard({
  book,
  isFavorited,
  onToggleFavorite,
  showCount,
  count,
  index = 0,
}: {
  book: Book;
  isFavorited?: boolean;
  onToggleFavorite?: (book: Book) => void;
  showCount?: boolean;
  count?: number;
  index?: number;
}) {
  const coverUrl = book.cover_id
    ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
    : null;
  const bookId = getBookId(book.key);

  return (
    <div
      className="group flex gap-5 py-5 animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Book cover with depth */}
      <Link href={`/book/${bookId}`} className="flex-shrink-0">
        <div className="w-16 h-24 rounded-sm overflow-hidden book-shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-1deg]">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted p-2">
              <span className="font-[family-name:var(--font-instrument-serif)] text-[10px] text-center text-muted-foreground italic leading-tight">
                {book.title}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Book info */}
      <div className="flex flex-col flex-1 min-w-0 justify-center">
        <Link href={`/book/${bookId}`}>
          <h3 className="font-medium text-base text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-0.5">
          {book.author}
        </p>
        <div className="flex items-center gap-2 mt-2">
          {book.year && (
            <span className="text-[10px] text-muted-foreground/70 font-mono tracking-wider">
              {book.year}
            </span>
          )}
          {showCount && count !== undefined && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
              {count} {count === 1 ? "favorite" : "favorites"}
            </Badge>
          )}
        </div>
      </div>

      {/* Favorite action */}
      {onToggleFavorite && (
        <div className="flex items-center">
          <button
            onClick={() => onToggleFavorite(book)}
            className="group/btn flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:bg-warm-gold-muted"
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorited ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-primary transition-transform duration-200 group-hover/btn:scale-110"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground transition-all duration-200 group-hover/btn:text-primary group-hover/btn:scale-110"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
