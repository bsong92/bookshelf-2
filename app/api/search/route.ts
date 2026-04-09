import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) {
    return NextResponse.json({ docs: [] });
  }

  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=20&fields=key,title,author_name,cover_i,first_publish_year`
  );
  const data = await res.json();

  return NextResponse.json({
    docs: data.docs.map((doc: Record<string, unknown>) => ({
      key: doc.key as string,
      title: doc.title as string,
      author: (doc.author_name as string[])?.[0] ?? "Unknown",
      cover_id: (doc.cover_i as number) ?? null,
      year: (doc.first_publish_year as number) ?? null,
    })),
  });
}
