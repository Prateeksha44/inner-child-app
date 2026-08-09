"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import KiteBackground from "@/components/KiteBackground";
import { createClient } from "@/lib/supabase/client";

const links = [
  {
    href: "/today",
    emoji: "🌤️",
    title: "Today's Little Adventure",
    subtitle: "Your invitation for today",
  },
  {
    href: "/journey",
    emoji: "💛",
    title: "Your Journey",
    subtitle: "See your streak and grace days",
  },
  {
    href: "/recap",
    emoji: "🧸",
    title: "This Week's Little Moments",
    subtitle: "Look back at what you've captured",
  },
  {
    href: "/about",
    emoji: "🌱",
    title: "About This Space",
    subtitle: "Why this app exists",
  },
];

export default function MenuPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="app-shell items-start py-10">
      <KiteBackground position="bottom" />

      <div className="app-card relative">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="absolute top-4 right-4 font-body text-xs text-inkmuted hover:text-marigold transition disabled:opacity-50"
        >
          {loggingOut ? "Logging out..." : "Log out"}
        </button>

        <h1 className="app-heading mb-2">Your Little World</h1>
        <p className="app-subtext">Everything you need, in one gentle place. 🌈</p>

        <div className="flex flex-col gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-4 bg-white border border-orange-100 rounded-2xl px-4 py-4 hover:border-marigold hover:bg-marigold/5 transition"
            >
              <span className="text-2xl">{link.emoji}</span>
              <div className="flex-1">
                <p className="font-body font-semibold text-ink">{link.title}</p>
                <p className="font-body text-sm text-inkmuted">{link.subtitle}</p>
              </div>
              <span className="text-inkmuted">›</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}