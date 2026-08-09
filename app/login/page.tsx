"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import KiteBackground from "@/components/KiteBackground";

export default function LoginPage() {
  const supabase = createClient();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="app-shell">
      <KiteBackground />

      <div className="app-card">
        <h1 className="app-heading">Little Adventures</h1>

        <p className="app-subtext">
          {isLogin ? "Take a moment for yourself" : "Create your account"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="app-input"
          />

          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="app-input"
          />

          <button disabled={loading} className="btn-primary">
            {loading ? "Please wait..." : isLogin ? "Let's Go" : "Create Account"}
          </button>

          {error && (
            <p className="font-body text-red-500 text-sm text-center">{error}</p>
          )}
        </form>

        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-5 link-muted">
          {isLogin
            ? "New here? Create your little space 🌱"
            : "Already have an account? Log In"}
        </button>
      </div>
    </main>
  );
}