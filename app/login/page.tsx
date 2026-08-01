"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

    let result;

    if (isLogin) {
      result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    } else {
      result = await supabase.auth.signUp({
        email,
        password,
      });
    }
    console.log(result);
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-orange-50 px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-6">

        <h1 className="text-3xl font-bold text-center mb-2">
          Reconnect with your inner child 🎈
        </h1>

        <p className="text-center text-gray-500 mb-6">
          {isLogin ? "Log into your account" : "Create your account"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="border rounded-xl px-4 py-3"
          />

          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="border rounded-xl px-4 py-3"
          />

          <button
            disabled={loading}
            className="bg-orange-500 text-white rounded-xl py-3"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Log In"
              : "Create Account"}
          </button>

          {error && (
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          )}

        </form>

        <button
          onClick={()=>setIsLogin(!isLogin)}
          className="w-full mt-5 text-sm text-orange-600"
        >
          {isLogin
            ? "Need an account? Sign Up"
            : "Already have an account? Log In"}
        </button>

      </div>
    </main>
  );
}