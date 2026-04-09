import { auth, currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import HomePage from "./components/HomePage";
import FloatingCovers from "./components/FloatingCovers";

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
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero with floating book covers */}
      <div className="relative pt-24 pb-20 text-center overflow-hidden min-h-[340px]">
        <FloatingCovers />
        <div className="relative z-10">
          <h1 className="font-[family-name:var(--font-instrument-serif)] text-5xl md:text-6xl text-foreground leading-tight">
            Your library,
            <br />
            <span className="text-primary italic">beautifully kept.</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
            Discover books from the world&apos;s largest open catalog.
            Save the ones that move you.
          </p>
        </div>
      </div>

      <HomePage />
    </div>
  );
}
