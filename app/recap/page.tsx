"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Capture = {
  id: string;
  image_url: string;
  note: string | null;
  created_at: string;
};

function getCalendarWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;

  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { start: monday.toISOString(), end: sunday.toISOString() };
}

export default function RecapPage() {
  const supabase = createClient();

  const [captures, setCaptures] = useState<Capture[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    async function loadRecap() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { start, end } = getCalendarWeekRange();

      const { data, error } = await supabase
        .from("captures")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", start)
        .lte("created_at", end)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setCaptures(data as Capture[]);
      }

      setLoading(false);
    }

    loadRecap();
  }, []);

  function goNext() {
    setIndex((i) => Math.min(i + 1, captures.length - 1));
  }

  function goPrev() {
    setIndex((i) => Math.max(i - 1, 0));
  }

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const threshold = 50;

    if (deltaX < -threshold) goNext();
    if (deltaX > threshold) goPrev();

    setTouchStartX(null);
  }

  return (
    <main className="app-shell">
      <div className="app-card">
        <Link
          href="/menu"
          className="font-body text-sm text-inkmuted hover:text-marigold transition mb-4 inline-block"
        >
          ‹ Your Little World
        </Link>

        <h1 className="app-heading mb-2">This Week's Little Moments</h1>
        <p className="app-subtext">Small moments, worth remembering. 🧸</p>

        {loading && (
          <p className="font-body text-inkmuted text-center py-10">
            Gathering your little moments...
          </p>
        )}

        {!loading && captures.length === 0 && (
          <div className="bg-marigold/10 border border-marigold/30 rounded-2xl px-4 py-8 text-center">
            <p className="font-body text-ink font-medium mb-2">
              No little moments captured this week yet.
            </p>
            <p className="font-body text-inkmuted text-sm">
              There's still time to add one 🌱
            </p>
          </div>
        )}

        {!loading && captures.length > 0 && (
          <div>
            <div
              className="relative rounded-2xl overflow-hidden bg-white border border-orange-100"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={captures[index].image_url}
                alt={captures[index].note || "A little captured moment"}
                className="w-full aspect-square object-cover"
              />

              {captures.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    disabled={index === 0}
                    aria-label="Previous moment"
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-marigold hover:bg-marigold-dark text-white rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-lg shadow-black/20 disabled:opacity-0 transition"
                  >
                    ‹
                  </button>
                  <button
                    onClick={goNext}
                    disabled={index === captures.length - 1}
                    aria-label="Next moment"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-marigold hover:bg-marigold-dark text-white rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-lg shadow-black/20 disabled:opacity-0 transition"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {captures[index].note && (
              <p className="font-body text-ink text-center mt-4 leading-relaxed">
                {captures[index].note}
              </p>
            )}

            {captures.length > 1 && (
              <div className="flex justify-center gap-2 mt-5">
                {captures.map((c, i) => (
                  <div
                    key={c.id}
                    className={`h-2 w-2 rounded-full transition ${
                      i === index ? "bg-marigold" : "bg-marigold/20"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}