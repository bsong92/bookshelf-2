import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Fetch work data
  const workRes = await fetch(`https://openlibrary.org/works/${id}.json`);
  if (!workRes.ok) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }
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

  // Parse description
  let description = null;
  if (typeof work.description === "string") {
    description = work.description;
  } else if (work.description?.value) {
    description = work.description.value;
  }

  // Pick top subjects (filter out noise)
  const subjects = (work.subjects ?? [])
    .filter(
      (s: string) =>
        !s.startsWith("collectionID:") &&
        s.length < 50 &&
        !/^[a-z]{2,3}$/.test(s)
    )
    .slice(0, 12);

  return NextResponse.json({
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
  });
}
