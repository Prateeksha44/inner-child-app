"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import KiteBackground from "@/components/KiteBackground";
import { createClient } from "@/lib/supabase/client";

export default function TodayPage() {
  const supabase = createClient();

  const [promptText, setPromptText] = useState("");
  const [memoryIntro, setMemoryIntro] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrompt() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      type PromptResult = {
        prompt_id: string;
        prompt_text: string;
        is_first: boolean;
        childhood_memory: string | null;
      };

      const { data, error } = await supabase
        .rpc("get_or_create_todays_prompt", { p_user_id: user.id })
        .single<PromptResult>();

      if (!error && data) {
        setPromptText(data.prompt_text);
        if (data.is_first && data.childhood_memory) {
          setMemoryIntro(data.childhood_memory);
        }
      }

      setLoading(false);
    }

    loadPrompt();
  }, []);

  return (
    <main className="app-shell items-start py-10">
      <KiteBackground position="bottom" />

      <div className="app-card">
        <Link
          href="/menu"
          className="font-body text-sm text-inkmuted hover:text-marigold transition mb-4 inline-block"
        >
          ‹ Your Little World
        </Link>

        <h1 className="app-heading mb-4">Today's Little Adventure</h1>

        <p className="app-subtext">
          One tiny invitation to reconnect with the playful part of you 🌤️
        </p>

        {memoryIntro && (
  <p className="font-body text-sm text-inkmuted text-center italic mb-4">
    You once told us: "{memoryIntro}" — thank you for sharing that. 🌱
  </p>
)}

        <div className="bg-marigold/10 border border-marigold/30 rounded-2xl px-4 py-5 mb-6 min-h-[80px] flex items-center justify-center">
          <p className="font-display text-lg text-ink text-center leading-relaxed">
            {loading ? "Finding your little adventure..." : promptText}
          </p>
        </div>

        <p className="font-body text-sm text-inkmuted text-center mt-2 mb-6">
          There is NO RIGHT WAY ✨
          <br />
          Just follow your curiosity 🌱
        </p>

        <Link href="/capture" className="btn-primary w-full block text-center">
          Let's Capture this Moment!
        </Link>
      </div>
    </main>
  );
}