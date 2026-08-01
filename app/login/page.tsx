"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 bg-orange-50">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-2">
          Reconnect with your inner child 🎈
        </h1>
        <p className="text-center text-gray-600 mb-8">
          One small, playful, offline thing — on your schedule.
        </p>

        {status === "sent" ? (
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-lg font-medium mb-1">Check your email 📬</p>
            <p className="text-gray-600 text-sm">
              We sent a magic link to <strong>{email}</strong>. Tap it to sign
              in — no password needed.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4"
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="bg-orange-500 text-white rounded-xl py-3 font-medium disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "Send me a magic link"}
            </button>
            {status === "error" && (
              <p className="text-red-600 text-sm text-center">{errorMsg}</p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
