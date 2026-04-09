"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import PopularBooks from "./PopularBooks";
import SearchSection from "./SearchSection";
import FavoritesSection from "./FavoritesSection";

type Book = {
  key: string;
  title: string;
  author: string;
  cover_id: number | null;
  year?: number | null;
};

type Favorite = {
  id: string;
  book_key: string;
  title: string;
  author: string;
  cover_id: number | null;
};

export default function HomePage() {
  const { isSignedIn } = useUser();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const favoriteKeys = new Set(favorites.map((f) => f.book_key));

  const loadFavorites = useCallback(async () => {
    if (!isSignedIn) return;
    const res = await fetch("/api/favorites");
    const data = await res.json();
    setFavorites(data.favorites ?? []);
  }, [isSignedIn]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  async function toggleFavorite(book: Book) {
    if (!isSignedIn) return;

    if (favoriteKeys.has(book.key)) {
      await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_key: book.key }),
      });
    } else {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_key: book.key,
          title: book.title,
          author: book.author,
          cover_id: book.cover_id,
        }),
      });
    }
    await loadFavorites();
  }

  function removeFavorite(bookKey: string) {
    toggleFavorite({
      key: bookKey,
      title: "",
      author: "",
      cover_id: null,
    });
  }

  return (
    <div className="flex flex-col gap-8 p-4">
      <PopularBooks />

      {isSignedIn && (
        <>
          <SearchSection
            favoriteKeys={favoriteKeys}
            onToggleFavorite={toggleFavorite}
          />
          <FavoritesSection favorites={favorites} onRemove={removeFavorite} />
        </>
      )}

      {!isSignedIn && (
        <p className="text-sm text-zinc-500 text-center py-4">
          Sign in to search and favorite books.
        </p>
      )}
    </div>
  );
}
