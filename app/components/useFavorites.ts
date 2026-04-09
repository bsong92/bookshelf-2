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

function getPendingKeys(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").map(
      (b: { key: string }) => b.key
    );
  } catch {
    return [];
  }
}

function addPendingKey(book: Book) {
  const current = getPending();
  if (!current.some((b) => b.key === book.key)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, book]));
  }
}

function removePendingKey(bookKey: string) {
  const current = getPending();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(current.filter((b) => b.key !== bookKey))
  );
}

function getPending(): Book[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function clearPending() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("bookshelf_banner_dismissed");
}

export function useFavorites(isSignedIn: boolean | undefined) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [pendingFavorites, setPending] = useState<Book[]>([]);
  const [syncing, setSyncing] = useState(false);

  const favoriteKeys = new Set([
    ...favorites.map((f) => f.book_key),
    ...pendingFavorites.map((f) => f.key),
  ]);

  const loadFavorites = useCallback(async () => {
    if (!isSignedIn) {
      setPending(getPending());
      return;
    }
    const res = await fetch("/api/favorites");
    const data = await res.json();
    setFavorites(data.favorites ?? []);
  }, [isSignedIn]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Sync pending localStorage favorites to the user's account after sign-in
  useEffect(() => {
    if (!isSignedIn || syncing) return;

    const pending = getPending();
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
      clearPending();
      setPending([]);
      await loadFavorites();
      setSyncing(false);
    })();
  }, [isSignedIn, syncing, loadFavorites]);

  async function toggleFavorite(book: Book): Promise<"needs_auth" | "done"> {
    const alreadyFavorited = favoriteKeys.has(book.key);

    if (!isSignedIn) {
      // Save to localStorage for tracking
      if (alreadyFavorited) {
        removePendingKey(book.key);
      } else {
        addPendingKey(book);
      }
      setPending(getPending());
    }

    // Always hit the API — anonymous favorites go to DB with null user_id
    if (alreadyFavorited) {
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

    if (isSignedIn) {
      await loadFavorites();
    }

    return isSignedIn ? "done" : "needs_auth";
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
