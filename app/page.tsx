import { auth, currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import HomePage from "./components/HomePage";

async function syncUser() {
  const { userId } = await auth();
  if (!userId) return;

  const user = await currentUser();
  if (!user) return;

  await supabase
    .from("users")
    .upsert(
      {
        clerk_id: userId,
        email: user.emailAddresses[0]?.emailAddress ?? null,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || null,
      },
      { onConflict: "clerk_id" }
    );
}

export default async function Home() {
  await syncUser();

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black font-sans">
      <main className="flex-1 w-full max-w-2xl mx-auto bg-white dark:bg-black">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Bookshelf
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Discover and favorite books from OpenLibrary
          </p>
        </div>
        <HomePage />
      </main>
    </div>
  );
}
