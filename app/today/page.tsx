import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./sign-out-button";

export default async function TodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarded) redirect("/onboarding");

  // Basic tag-matching: find a prompt that overlaps with the user's tags.
  // (This gets upgraded on Day 2 with no-repeat rotation + cadence timing
  // + the AI-personalized Day-1 welcome prompt.)
  const { data: matchingPrompts } = await supabase
    .from("prompts")
    .select("*")
    .overlaps("tags", profile.tags ?? []);

  const prompt =
    matchingPrompts && matchingPrompts.length > 0
      ? matchingPrompts[Math.floor(Math.random() * matchingPrompts.length)]
      : null;

  return (
    <main className="min-h-screen bg-orange-50 flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Today's play 🎈</h1>
          <SignOutButton />
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-4">
          {prompt ? (
            <p className="text-lg leading-relaxed">{prompt.text}</p>
          ) : (
            <p className="text-gray-500">
              No matching prompt found yet — run{" "}
              <code>supabase/seed_prompts.sql</code> in your Supabase SQL
              editor, then refresh.
            </p>
          )}
        </div>

        <div className="bg-white/60 rounded-2xl p-4 text-sm text-gray-600">
          <p className="mb-1">
            <strong>Your tags:</strong> {profile.tags?.join(", ") || "none"}
          </p>
          <p>
            <strong>Cadence:</strong> {profile.cadence}
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Capture, streaks, and your weekly recap are coming next — this
          confirms auth + onboarding + prompt matching are working end to
          end.
        </p>
      </div>
    </main>
  );
}
