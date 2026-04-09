"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function FavoriteButton({
  bookKey,
  title,
  author,
  coverId,
}: {
  bookKey: string;
  title: string;
  author: string;
  coverId: number | null;
}) {
  const { isSignedIn } = useUser();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        const favs = data.favorites ?? [];
        setIsFavorited(
          favs.some(
            (f: { book_key: string }) => f.book_key === bookKey
          )
        );
      });
  }, [isSignedIn, bookKey]);

  async function handleToggle() {
    if (!isSignedIn || loading) return;
    setLoading(true);

    if (isFavorited) {
      await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_key: bookKey }),
      });
      setIsFavorited(false);
    } else {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_key: bookKey,
          title,
          author,
          cover_id: coverId,
        }),
      });
      setIsFavorited(true);
    }
    setLoading(false);
  }

  if (!isSignedIn) {
    return (
      <p className="text-xs text-muted-foreground italic">
        Sign in to add this book to your collection
      </p>
    );
  }

  return (
    <Button
      onClick={handleToggle}
      disabled={loading}
      variant={isFavorited ? "default" : "outline"}
      className="gap-2 rounded-full px-5"
    >
      {isFavorited ? (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          In your collection
        </>
      ) : (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          Add to collection
        </>
      )}
    </Button>
  );
}
