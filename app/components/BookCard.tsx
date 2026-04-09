"use client";

type Book = {
  key: string;
  title: string;
  author: string;
  cover_id: number | null;
  year?: number | null;
};

export default function BookCard({
  book,
  isFavorited,
  onToggleFavorite,
  showCount,
  count,
}: {
  book: Book;
  isFavorited?: boolean;
  onToggleFavorite?: (book: Book) => void;
  showCount?: boolean;
  count?: number;
}) {
  const coverUrl = book.cover_id
    ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
    : null;

  return (
    <div className="flex gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="w-16 h-24 flex-shrink-0 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {coverUrl ? (
          <img src={coverUrl} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs text-center p-1">
            No cover
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
          {book.title}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{book.author}</p>
        {book.year && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">{book.year}</p>
        )}
        {showCount && count !== undefined && (
          <p className="text-xs text-zinc-500 mt-1">{count} {count === 1 ? "favorite" : "favorites"}</p>
        )}
        <div className="mt-auto pt-1">
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(book)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                isFavorited
                  ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {isFavorited ? "Unfavorite" : "Favorite"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
