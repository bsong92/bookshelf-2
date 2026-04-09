import type { Metadata } from "next";
import { Source_Serif_4, Instrument_Serif, DM_Sans } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bookshelf",
  description: "A place for the books you love",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${instrumentSerif.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col bg-background text-foreground font-[family-name:var(--font-source-serif)]">
        <ClerkProvider>
          <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
            <div className="max-w-5xl mx-auto flex items-center justify-end px-6 h-14">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Sign in
                  </Button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </nav>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border/30 py-8 text-center">
            <p className="text-xs text-muted-foreground/60 tracking-wide uppercase">
              Powered by OpenLibrary
            </p>
          </footer>
        </ClerkProvider>
      </body>
    </html>
  );
}
