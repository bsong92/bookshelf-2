import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  // Get books ordered by how many users favorited them
  const { data, error } = await supabase
    .from("favorites")
    .select("book_key, title, author, cover_id");

  if (error) {
    return NextResponse.json({ books: [] });
  }

  // Aggregate counts
  const counts = new Map<string, { book_key: string; title: string; author: string; cover_id: number | null; count: number }>();
  for (const row of data ?? []) {
    const existing = counts.get(row.book_key);
    if (existing) {
      existing.count++;
    } else {
      counts.set(row.book_key, {
        book_key: row.book_key,
        title: row.title,
        author: row.author,
        cover_id: row.cover_id,
        count: 1,
      });
    }
  }

  const books = Array.from(counts.values()).sort((a, b) => b.count - a.count);

  return NextResponse.json({ books });
}
