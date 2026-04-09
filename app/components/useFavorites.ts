"use client";

import { useEffect, useState, useCallback } from "react";

type Book = {
  key: string;
  title: string;
  author: string;
  cover_id: number | null;
};

type Favorite = {
  id: string;
  book_key: string;
  title: string;
  author: string;
  cover_id: number | null;
};

const STORAGE_KEY = "bookshelf_pending_favorites";

function getPendingFavorites(): Book[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function setPendingFavorites(books: Book[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function clearPendingFavorites() {
  localStorage.removeItem(STORAGE_KEY);
}

export function useFavorites(isSignedIn: boolean | undefined) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [pendingFavorites, setPending] = useState<Book[]>([]);
  const [syncing, setSyncing] = useState(false);

  const favoriteKeys = new Set([
    ...favorites.map((f) => f.book_key),
    ...pendingFavorites.map((f) => f.key),
  ]);

  // Load favorites
  const loadFavorites = useCallback(async () => {
    if (!isSignedIn) {
      setPending(getPendingFavorites());
      return;
    }
    const res = await fetch("/api/favorites");
    const data = await res.json();
    setFavorites(data.favorites ?? []);
  }, [isSignedIn]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Sync pending favorites to DB after sign-in
  useEffect(() => {
    if (!isSignedIn || syncing) return;

    const pending = getPendingFavorites();
    if (pending.length === 0) return;

    setSyncing(true);

    (async () => {
      for (const book of pending) {
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
      clearPendingFavorites();
      setPending([]);
      await loadFavorites();
      setSyncing(false);
    })();
  }, [isSignedIn, syncing, loadFavorites]);

  // Toggle favorite — works for both signed-in and anonymous
  async function toggleFavorite(book: Book): Promise<"needs_auth" | "done"> {
    if (!isSignedIn) {
      // Store locally
      const current = getPendingFavorites();
      const exists = current.some((b) => b.key === book.key);
      if (exists) {
        const updated = current.filter((b) => b.key !== book.key);
        setPendingFavorites(updated);
        setPending(updated);
      } else {
        const updated = [...current, book];
        setPendingFavorites(updated);
        setPending(updated);
      }
      return "needs_auth";
    }

    // Signed in — hit the API
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
    return "done";
  }

  function removeFavorite(bookKey: string) {
    toggleFavorite({
      key: bookKey,
      title: "",
      author: "",
      cover_id: null,
    });
  }

  return {
    favorites,
    pendingFavorites,
    favoriteKeys,
    toggleFavorite,
    removeFavorite,
    loadFavorites,
  };
}
