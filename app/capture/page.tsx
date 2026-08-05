"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CapturePage() {
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
const supabase = createClient();
const [loading, setLoading] = useState(false);
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
};

    const { data } = supabase.storage
      .from("captures")
      .getPublicUrl(filePath);

    const imageUrl = data.publicUrl;

    const { error: insertError } = await supabase.from("captures").insert({
      user_id: user.id,
      image_url: imageUrl,
      note,
    });

    if (insertError) {
  console.error("INSERT ERROR", insertError);
  throw insertError;
};

    alert("Capture saved! 🎉");
    router.push("/today");
  } catch (err) {
    console.error(err);
    alert("Something went wrong while saving.");
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="min-h-screen bg-orange-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Capture your moment 📸</h1>

        <label className="block mb-4">
          <span className="font-medium">Upload a photo</span>

          <input
            type="file"
            accept="image/*"
            className="mt-2 block w-full"
            onChange={(e) => {
              if (e.target.files?.length) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </label>

        <label className="block mb-6">
          <span className="font-medium">One-line note</span>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            rows={3}
            placeholder="How did this activity make you feel?"
          />
        </label>

        <button
  className="w-full rounded-xl bg-orange-500 text-white py-3 font-semibold disabled:opacity-50"
  onClick={handleSave}
  disabled={loading}
>
  {loading ? "Saving..." : "Save"}
</button>
      </div>
    </main>
  );
}