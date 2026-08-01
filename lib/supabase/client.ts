import { createBrowserClient } from "@supabase/ssr";

// Client-side Supabase client. Safe to use in "use client" components.
// Uses the public anon key only — never put a service-role key here.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
