"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TAGS, CADENCE_OPTIONS, type CadenceValue } from "@/lib/constants";

const STEPS = ["tags", "cadence", "memory"] as const;
type Step = (typeof STEPS)[number];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("tags");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [cadence, setCadence] = useState<CadenceValue>("daily");
  const [memory, setMemory] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function toggleTag(value: string) {
    setSelectedTags((prev) =>
      prev.includes(value)
        ? prev.filter((t) => t !== value)
        : prev.length < 3
        ? [...prev, value]
        : prev
    );
  }

  function goNext() {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }

  function goBack() {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  }

  async function finishOnboarding() {
    setSaving(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Your session expired — please log in again.");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        tags: selectedTags,
        cadence,
        childhood_memory: memory || null,
        onboarded: true,
      })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push("/menu");
    router.refresh();
  }

  return (
    <main className="app-shell items-start py-10">
      <div className="w-full max-w-md relative z-10">
        {/* progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((s) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full transition ${
                s === step
                  ? "bg-marigold"
                  : STEPS.indexOf(s) < STEPS.indexOf(step)
                  ? "bg-marigold/50"
                  : "bg-marigold/15"
              }`}
            />
          ))}
        </div>

        {step === "tags" && (
          <div className="bg-card rounded-3xl shadow-lg shadow-orange-100/50 p-6 min-h-[560px] flex flex-col">
            <h1 className="font-display text-2xl font-bold text-ink mb-1">
              What made your Younger Self light up?
            </h1>
            <p className="font-body text-inkmuted text-sm mb-6">
              Pick up to three. We will shape your daily adventures around them.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {TAGS.map((tag) => {
                const selected = selectedTags.includes(tag.value);
                return (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() => toggleTag(tag.value)}
                    className={`font-body rounded-2xl border-2 px-3 py-4 text-left transition ${
                      selected
                        ? "border-marigold bg-marigold/10"
                        : "border-orange-100 bg-white"
                    }`}
                  >
                    <div className="text-2xl mb-1">{tag.emoji}</div>
                    <div className="text-sm font-medium text-ink">{tag.label}</div>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto">
              <button
                disabled={selectedTags.length === 0}
                onClick={goNext}
                className="btn-primary w-full"
              >
                {selectedTags.length > 0
                  ? "You've picked your Favs!"
                  : "Pick a few to continue"}
              </button>
            </div>
          </div>
        )}

        {step === "cadence" && (
          <div className="bg-card rounded-3xl shadow-lg shadow-orange-100/50 p-6 min-h-[560px] flex flex-col">
            <h1 className="font-display text-2xl font-bold text-ink mb-1">
              How often would you like a little adventure?
            </h1>
            <p className="font-body text-inkmuted text-sm mb-6">
              Choose a rhythm that feels good for you. You can always change it later 🌱
            </p>

            <div className="flex flex-col gap-3 mb-6">
              {CADENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCadence(opt.value)}
                  className={`font-body rounded-2xl border-2 px-4 py-3 text-left transition ${
                    cadence === opt.value
                      ? "border-marigold bg-marigold/10"
                      : "border-orange-100 bg-white"
                  }`}
                >
                  <div className="font-medium text-ink">{opt.label}</div>
                  <div className="text-sm text-inkmuted">{opt.sublabel}</div>
                </button>
              ))}
            </div>

            <div className="mt-auto flex gap-3">
              <button
                onClick={goBack}
                className="font-body flex-1 border-2 border-orange-100 text-ink rounded-2xl py-3 font-medium"
              >
                Back
              </button>
              <button onClick={goNext} className="btn-primary flex-1">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "memory" && (
          <div className="bg-card rounded-3xl shadow-lg shadow-orange-100/50 p-6 min-h-[560px] flex flex-col">
            <h1 className="font-display text-2xl font-bold text-ink mb-1">
              A little memory, if you'd like
            </h1>
            <p className="font-body text-inkmuted text-sm mb-4">
              Is there something you loved doing when you were little? Share
              whatever comes to mind.
            </p>

            <textarea
              value={memory}
              onChange={(e) => setMemory(e.target.value)}
              placeholder="e.g. Building blanket forts, making up secret worlds, dancing around the living room…"
              rows={4}
              className="app-input w-full mb-6 resize-none"
            />

            {error && (
              <p className="font-body text-red-500 text-sm mb-4 text-center">
                {error}
              </p>
            )}

            <div className="mt-auto flex gap-3">
              <button
                onClick={goBack}
                disabled={saving}
                className="font-body flex-1 border-2 border-orange-100 text-ink rounded-2xl py-3 font-medium disabled:opacity-40"
              >
                Back
              </button>
              <button
                onClick={finishOnboarding}
                disabled={saving}
                className="btn-primary flex-1"
              >
                {saving ? "Saving..." : "Let's Play"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}