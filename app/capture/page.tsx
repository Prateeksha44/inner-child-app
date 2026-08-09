"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function CapturePage() {
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  async function handleSave() {
    if (!file) {
      alert("Please choose a photo.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please sign in again.");
        return;
      }

      const filePath = `${user.id}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("captures")
        .upload(filePath, file);

      if (uploadError) {
        console.error("UPLOAD ERROR", uploadError);
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("captures")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      const { error: insertError } = await supabase
        .from("captures")
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          note,
        });

      if (insertError) {
        console.error("INSERT ERROR", insertError);
        throw insertError;
      }

      // -----------------------
      // Update streak (create the row if it doesn't exist yet)
      // -----------------------

      const { data: streak, error: streakError } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (streakError) {
        console.error("STREAK FETCH ERROR:", JSON.stringify(streakError, null, 2));
        throw streakError;
      }

      const today = new Date();

      if (!streak) {
        // First-ever capture for this user — no streaks row yet, so create one
        const { error } = await supabase.from("streaks").insert({
          user_id: user.id,
          current_streak: 1,
          grace_skips_remaining: 2,
          last_session_at: today.toISOString(),
        });

        if (error) throw error;
      } else if (!streak.last_session_at) {
        const { error } = await supabase
          .from("streaks")
          .update({
            current_streak: 1,
            last_session_at: today.toISOString(),
          })
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const last = new Date(streak.last_session_at);

        const diffDays = Math.floor(
          (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0) {
          // Already completed today — do nothing
        } else if (diffDays === 1) {
          const { error } = await supabase
            .from("streaks")
            .update({
              current_streak: streak.current_streak + 1,
              last_session_at: today.toISOString(),
            })
            .eq("user_id", user.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("streaks")
            .update({
              current_streak: 1,
              grace_skips_remaining: 2,
              last_session_at: today.toISOString(),
            })
            .eq("user_id", user.id);

          if (error) throw error;
        }
      }

      alert("Capture saved! 🎉");
      router.push("/journey");
    } catch (err) {
      console.error("CAPTURE ERROR:", JSON.stringify(err, null, 2));
      alert("Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
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

        <h1 className="app-heading mb-8">Save This Little Moment</h1>

        <label className="block mb-8">
          <span className="font-body font-medium text-ink">
            Keep this little memory 📸
          </span>

          <input
            type="file"
            accept="image/*"
            className="font-body mt-4 block w-full text-sm text-inkmuted"
            onChange={(e) => {
              if (e.target.files?.length) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </label>

        <label className="block mb-6">
          <span className="font-body font-medium text-ink">
            What made this moment special? 💭
          </span>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="app-input mt-4 w-full resize-none"
            rows={3}
          />
        </label>

        <button
          className="btn-primary w-full"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Keep This Memory"}
        </button>
      </div>
    </main>
  );
}