"use client";

import Link from "next/link";
import {
  SwingIllustration,
  BlanketFortIllustration,
  PaperBoatIllustration,
} from "@/components/Illustrations";

export default function AboutPage() {
  return (
    <main className="app-shell items-start py-10">
      <div className="app-card">
        <h1 className="app-heading mb-2">About This Space</h1>
        <p className="app-subtext">
          A little more about why this exists, and how it works. 🌱
        </p>

        <section className="mb-8">
          <SwingIllustration />
          <h2 className="font-display text-xl font-semibold text-ink text-center mt-3 mb-2">
            Why This Exists 🌈
          </h2>
          <p className="font-body text-inkmuted text-sm leading-relaxed text-center">
            Somewhere between deadlines and to-do lists, it's easy to forget
            the version of you that once spent hours building forts, doodling
            on any surface, or chasing kites through the park. This space is a
            gentle nudge back to that person — a few minutes at a time.
          </p>
        </section>

        <section className="mb-8">
          <BlanketFortIllustration />
          <h2 className="font-display text-xl font-semibold text-ink text-center mt-3 mb-2">
            How It Works 🧩
          </h2>
          <ul className="font-body text-inkmuted text-sm leading-relaxed space-y-3">
            <li>
              🌤️{" "}
              <span className="text-ink font-medium">
                Today's Little Adventure
              </span>{" "}
              — a tiny prompt made just for you, based on what you loved as a
              kid.
            </li>
            <li>
              📸{" "}
              <span className="text-ink font-medium">Capture the moment</span>{" "}
              — save a photo and a note once you've given it a try.
            </li>
            <li>
              💛 <span className="text-ink font-medium">Your Journey</span> —
              watch your streak grow, with grace days for the busy weeks.
            </li>
            <li>
              🧸 <span className="text-ink font-medium">Weekly recaps</span> —
              swipe back through everything you captured that week.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <PaperBoatIllustration />
          <h2 className="font-display text-xl font-semibold text-ink text-center mt-3 mb-2">
            What You Can Do Here ✨
          </h2>
          <p className="font-body text-inkmuted text-sm leading-relaxed text-center">
            Show up daily, a few times a week, or once a week — whatever
            rhythm feels right for you, and you can always change it later.
            There's no streak to protect and no perfect way to do this. Just
            small, real moments of play, saved for you to look back on.
          </p>
        </section>

        <p className="font-body text-sm text-inkmuted text-center italic mb-6">
          This is your space. Go at your pace. 🌱
        </p>

        <Link href="/menu" className="btn-primary w-full block text-center">
          Back to Your Little World
        </Link>
      </div>
    </main>
  );
}