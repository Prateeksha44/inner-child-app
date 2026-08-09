"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function JourneyPage() {
  const supabase = createClient();

  const [streak, setStreak] = useState(0);
  const [graceDays, setGraceDays] = useState(2);
  const [lastAdventure, setLastAdventure] = useState("Not yet");

  useEffect(() => {
    async function loadJourney() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!data) return;

      setStreak(data.current_streak);
      setGraceDays(data.grace_skips_remaining);

      if (data.last_session_at) {
        const last = new Date(data.last_session_at);
        const today = new Date();

        if (last.toDateString() === today.toDateString()) {
          setLastAdventure("Today 🌼");
        } else {
          setLastAdventure(last.toLocaleDateString());
        }
      }
    }

    loadJourney();
  }, []);

  return (
    <main className="app-shell">
      <div className="app-card">
        <Link
          href="/menu"
          className="font-body text-sm text-inkmuted hover:text-marigold transition mb-4 inline-block"
        >
          ‹ Your Little World
        </Link>

        <h1 className="font-display text-3xl font-bold text-ink mb-3">
          💛 Your Journey
        </h1>

        <p className="app-subtext">
          Every little adventure helps your younger self feel seen, safe and
          joyful again. 🌈
        </p>

        <p className="font-body text-inkmuted leading-8">
          You've been showing up for yourself for
        </p>

        <p className="mt-2 font-display text-5xl font-bold text-marigold">
          {streak} {streak === 1 ? "day" : "days"}
        </p>

        <p className="mt-1 font-body text-inkmuted text-sm">this week</p>

        <div className="mt-8 rounded-2xl bg-marigold/10 p-5">
          {graceDays > 0 ? (
            <>
              <p className="font-body font-medium text-ink">
                Your Grace Days {"🌼".repeat(graceDays)}
              </p>
              <p className="mt-2 text-sm text-inkmuted">
                They're here whenever life gets busy.
              </p>
            </>
          ) : (
            <>
              <p className="font-body font-medium text-ink">
                You've used all your Grace Days.
              </p>
              <p className="mt-3 font-body font-medium text-ink">
                Tomorrow is a beautiful day to Begin Again 🌱
              </p>
            </>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-orange-100 p-5">
          <p className="font-body text-sm text-inkmuted">Last adventure</p>

          <p className="mt-1 font-display text-lg font-semibold text-ink">
            {lastAdventure}
          </p>
        </div>
      </div>
    </main>
  );
}