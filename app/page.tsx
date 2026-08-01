import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Root route: no UI of its own. It just figures out where the user
// belongs — login, onboarding, or today's prompt — and sends them there.
export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarded")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarded) {
    redirect("/onboarding");
  }

  redirect("/today");
}
