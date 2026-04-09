import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import FavoriteButton from "./FavoriteButton";

type BookDetail = {
  key: string;
  title: string;
  description: string | null;
  cover_id: number | null;
  covers: number[];
  first_publish_date: string | null;
  subjects: string[];
  subject_places: string[];
  subject_people: string[];
  subject_times: string[];
  links: { title: string; url: string }[];
  author: {
    name: string | null;
    bio: string | null;
    birth_date: string | null;
    death_date: string | null;
    photo_id: number | null;
  } | null;
};

async function getBook(id: string): Promise<BookDetail | null> {
  // Fetch work data directly from OpenLibrary
  const workRes = await fetch(`https://openlibrary.org/works/${id}.json`, {
    cache: "no-store",
  });
  if (!workRes.ok) return null;
  const work = await workRes.json();

  // Fetch author data
  let author = null;
  if (work.authors?.[0]?.author?.key) {
    const authorRes = await fetch(
      `https://openlibrary.org${work.authors[0].author.key}.json`
    );
    if (authorRes.ok) {
      const authorData = await authorRes.json();
      author = {
        name: authorData.name ?? null,
        bio:
          typeof authorData.bio === "string"
            ? authorData.bio
            : authorData.bio?.value ?? null,
        birth_date: authorData.birth_date ?? null,
        death_date: authorData.death_date ?? null,
        photo_id: authorData.photos?.[0] ?? null,
      };
    }
  }

  let description = null;
  if (typeof work.description === "string") {
    description = work.description;
  } else if (work.description?.value) {
    description = work.description.value;
  }

  const subjects = (work.subjects ?? [])
    .filter(
      (s: string) =>
        !s.startsWith("collectionID:") &&
        s.length < 50 &&
        !/^[a-z]{2,3}$/.test(s)
    )
    .slice(0, 12);

  return {
    key: work.key,
    title: work.title,
    description,
    cover_id: work.covers?.[0] ?? null,
    covers: (work.covers ?? []).filter((c: number) => c > 0).slice(0, 6),
    first_publish_date: work.first_publish_date ?? null,
    subjects,
    subject_places: (work.subject_places ?? []).slice(0, 5),
    subject_people: (work.subject_people ?? []).slice(0, 5),
    subject_times: (work.subject_times ?? []).slice(0, 5),
    links: (work.links ?? []).map((l: { title: string; url: string }) => ({
      title: l.title,
      url: l.url,
    })),
    author,
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <span className="text-4xl block mb-4">{"📖"}</span>
        <h1 className="font-[family-name:var(--font-instrument-serif)] text-2xl text-foreground mb-2">
          Book not found
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          We couldn&apos;t find this book in OpenLibrary.
        </p>
        <Link
          href="/"
          className="text-sm text-primary hover:underline underline-offset-4"
        >
          Back to Bookshelf
        </Link>
      </div>
    );
  }

  const coverUrl = book.cover_id
    ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
    : null;

  const authorPhotoUrl = book.author?.photo_id
    ? `https://covers.openlibrary.org/a/id/${book.author.photo_id}-M.jpg`
    : null;

  return (
    <div className="max-w-5xl mx-auto px-6 pb-16">
      {/* Back link */}
      <div className="pt-6 pb-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-0.5"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </Link>
      </div>

      {/* Hero: Cover + Title */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-10">
        {/* Cover */}
        <div className="flex-shrink-0 self-center md:self-start">
          <div className="relative animate-fade-up">
            <div className="w-[200px] h-[300px] rounded-sm overflow-hidden book-shadow">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted p-6">
                  <span className="font-[family-name:var(--font-instrument-serif)] text-lg text-center text-muted-foreground italic leading-tight">
                    {book.title}
                  </span>
                </div>
              )}
            </div>
            {/* Shelf under the cover */}
            <div className="shelf-plank h-2.5 rounded-sm mt-1 w-[220px] -ml-[10px]" />
          </div>
        </div>

        {/* Title + Meta */}
        <div className="flex flex-col min-w-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <h1 className="font-[family-name:var(--font-instrument-serif)] text-3xl md:text-4xl text-foreground leading-tight">
            {book.title}
          </h1>

          {book.author?.name && (
            <p className="text-base text-muted-foreground mt-2">
              by{" "}
              <span className="text-foreground font-medium">
                {book.author.name}
              </span>
              {book.author.birth_date && (
                <span className="text-muted-foreground/60 text-sm ml-1.5">
                  ({book.author.birth_date}
                  {book.author.death_date
                    ? ` – ${book.author.death_date}`
                    : ""}
                  )
                </span>
              )}
            </p>
          )}

          {book.first_publish_date && (
            <p className="text-xs text-muted-foreground/70 font-mono tracking-wider mt-2 uppercase">
              First published {book.first_publish_date}
            </p>
          )}

          {/* Subjects */}
          {book.subjects.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {book.subjects.map((subject) => (
                <Badge
                  key={subject}
                  variant="secondary"
                  className="text-[11px] font-normal px-2 py-0.5"
                >
                  {subject}
                </Badge>
              ))}
            </div>
          )}

          {/* Favorite button */}
          <div className="mt-5">
            <FavoriteButton
              bookKey={book.key}
              title={book.title}
              author={book.author?.name ?? "Unknown"}
              coverId={book.cover_id}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      {book.description && (
        <div className="mt-12 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <h2 className="font-[family-name:var(--font-instrument-serif)] text-xl text-foreground mb-4">
            About this book
          </h2>
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line max-w-prose">
            {book.description}
          </div>
        </div>
      )}

      <Separator className="my-10 opacity-30" />

      {/* Detail grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-up"
        style={{ animationDelay: "300ms" }}
      >
        {/* Characters */}
        {book.subject_people.length > 0 && (
          <div>
            <h3 className="text-xs text-muted-foreground/60 font-mono tracking-wider uppercase mb-2">
              Characters
            </h3>
            <ul className="space-y-1">
              {book.subject_people.map((person) => (
                <li key={person} className="text-sm text-foreground">
                  {person}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Places */}
        {book.subject_places.length > 0 && (
          <div>
            <h3 className="text-xs text-muted-foreground/60 font-mono tracking-wider uppercase mb-2">
              Places
            </h3>
            <ul className="space-y-1">
              {book.subject_places.map((place) => (
                <li key={place} className="text-sm text-foreground">
                  {place}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Time periods */}
        {book.subject_times.length > 0 && (
          <div>
            <h3 className="text-xs text-muted-foreground/60 font-mono tracking-wider uppercase mb-2">
              Time Periods
            </h3>
            <ul className="space-y-1">
              {book.subject_times.map((time) => (
                <li key={time} className="text-sm text-foreground">
                  {time}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Links */}
        {book.links.length > 0 && (
          <div>
            <h3 className="text-xs text-muted-foreground/60 font-mono tracking-wider uppercase mb-2">
              External Links
            </h3>
            <ul className="space-y-1.5">
              {book.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline underline-offset-4 inline-flex items-center gap-1"
                  >
                    {link.title}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-50"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Author bio */}
      {book.author?.bio && (
        <>
          <Separator className="my-10 opacity-30" />
          <div className="animate-fade-up" style={{ animationDelay: "400ms" }}>
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-xl text-foreground mb-5">
              About the Author
            </h2>
            <div className="flex gap-5">
              {authorPhotoUrl && (
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-border">
                    <img
                      src={authorPhotoUrl}
                      alt={book.author.name ?? "Author"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="min-w-0">
                <p className="font-medium text-foreground mb-2">
                  {book.author.name}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {book.author.bio}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Other covers */}
      {book.covers.length > 1 && (
        <>
          <Separator className="my-10 opacity-30" />
          <div className="animate-fade-up" style={{ animationDelay: "500ms" }}>
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-xl text-foreground mb-5">
              Other Editions
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
              {book.covers.slice(1).map((coverId) => (
                <div
                  key={coverId}
                  className="flex-shrink-0 w-[90px] h-[135px] rounded-sm overflow-hidden book-shadow-sm"
                >
                  <img
                    src={`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`}
                    alt={`${book.title} edition`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
