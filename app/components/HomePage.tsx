"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SignUpButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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
  const {
    favorites,
    pendingFavorites,
    favoriteKeys,
    toggleFavorite,
    removeFavorite,
  } = useFavorites(isSignedIn);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const showAuthBanner =
    !isSignedIn && pendingFavorites.length > 0 && !bannerDismissed;

  async function handleToggleFavorite(book: Book) {
    await toggleFavorite(book);
  }

  return (
    <>
      {/* Auth nudge banner — appears after first anonymous favorite */}
      {showAuthBanner && (
        <div className="mx-0 mb-2 px-5 py-4 rounded-lg bg-primary/5 border border-primary/15 flex items-center justify-between gap-4 animate-fade-up">
          <p className="text-sm text-foreground">
            You have{" "}
            <span className="font-semibold">
              {pendingFavorites.length}{" "}
              {pendingFavorites.length === 1 ? "book" : "books"}
            </span>{" "}
            saved locally. Sign up to keep them forever.
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <SignUpButton mode="modal">
              <Button size="sm" className="rounded-full px-4">
                Sign up
              </Button>
            </SignUpButton>
            <button
              onClick={() => setBannerDismissed(true)}
              className="text-muted-foreground hover:text-foreground p-1 transition-colors"
              aria-label="Dismiss"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

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

      {!isSignedIn && favorites.length === 0 && pendingFavorites.length === 0 && (
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
