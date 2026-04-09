"use client";

import BookCard from "./BookCard";

type Favorite = {
  id: string;
  book_key: string;
  title: string;
  author: string;
  cover_id: number | null;
};

export default function FavoritesSection({
  favorites,
  onRemove,
}: {
  favorites: Favorite[];
  onRemove: (bookKey: string) => void;
}) {
  return (
    <section className="py-10">
      <div className="flex items-baseline gap-3 mb-1">
        <h2 className="font-[family-name:var(--font-dm-sans)] font-semibold text-2xl tracking-tight text-foreground">
          My Collection
        </h2>
        {favorites.length > 0 && (
          <span className="text-xs text-muted-foreground font-mono">
            {favorites.length}
          </span>
        )}
      </div>
      <p className="text-base text-muted-foreground mb-5">
        {favorites.length === 0
          ? "Books you love will appear here"
          : "Your personal library"}
      </p>

      {favorites.length === 0 ? (
        <div className="relative py-16 text-center rounded-lg border border-dashed border-border/50">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto text-muted-foreground/30 mb-3"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
          <p className="font-[family-name:var(--font-instrument-serif)] text-muted-foreground italic">
            Your shelf awaits its first book.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/40">
          {favorites.map((fav, i) => (
            <BookCard
              key={fav.id}
              book={{
                key: fav.book_key,
                title: fav.title,
                author: fav.author,
                cover_id: fav.cover_id,
              }}
              isFavorited={true}
              onToggleFavorite={() => onRemove(fav.book_key)}
              index={i}
            />
          ))}
        </div>
      )}
    </section>
  );
}
