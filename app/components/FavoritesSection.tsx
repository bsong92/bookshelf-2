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
  if (favorites.length === 0) {
    return (
      <section>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          My Favorites
        </h2>
        <p className="text-sm text-zinc-500 text-center py-4">
          No favorites yet. Search for books and add some!
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-3">
        My Favorites ({favorites.length})
      </h2>
      <div className="flex flex-col gap-2">
        {favorites.map((fav) => (
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
          />
        ))}
      </div>
    </section>
  );
}
