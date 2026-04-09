"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import PopularBooks from "./PopularBooks";
import SearchSection from "./SearchSection";
import FavoritesSection from "./FavoritesSection";
import { useFavorites } from "./useFavorites";

type Book = {
  key: string;
  title: string;
  author: string;
  cover_id: number | null;
  year?: number | null;
};

export default function HomePage() {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const {
    favorites,
    favoriteKeys,
    toggleFavorite,
    removeFavorite,
  } = useFavorites(isSignedIn);
  const [authPromptShown, setAuthPromptShown] = useState(false);

  async function handleToggleFavorite(book: Book) {
    const result = await toggleFavorite(book);

    // If anonymous and just favorited (not unfavorited), prompt sign-in once
    if (result === "needs_auth" && !authPromptShown) {
      // Check if the book was just added (not removed)
      const wasFavorited = favoriteKeys.has(book.key);
      if (!wasFavorited) {
        setAuthPromptShown(true);
        // Small delay so the heart animation is visible first
        setTimeout(() => {
          openSignIn();
        }, 600);
      }
    }
  }

  return (
    <>
      {/* Search is always visible */}
      <SearchSection
        favoriteKeys={favoriteKeys}
        onToggleFavorite={handleToggleFavorite}
      />

      <Separator className="opacity-30" />

      <PopularBooks />

      {(isSignedIn || favorites.length > 0) && (
        <>
          <Separator className="opacity-30" />
          <FavoritesSection favorites={favorites} onRemove={removeFavorite} />
        </>
      )}

      {!isSignedIn && favorites.length === 0 && (
        <>
          <Separator className="opacity-30" />
          <div className="py-20 text-center">
            <h2 className="font-[family-name:var(--font-dm-sans)] font-semibold text-2xl tracking-tight text-foreground mb-2">
              Start collecting
            </h2>
            <p className="text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Favorite a book above to start building your personal library.
            </p>
          </div>
        </>
      )}
    </>
  );
}
