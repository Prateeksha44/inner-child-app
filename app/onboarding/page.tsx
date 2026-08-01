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

    router.push("/today");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-orange-50 flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-md">
        {/* progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((s) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full ${
                s === step
                  ? "bg-orange-500"
                  : STEPS.indexOf(s) < STEPS.indexOf(step)
                  ? "bg-orange-300"
                  : "bg-orange-100"
              }`}
            />
          ))}
        </div>

        {step === "tags" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h1 className="text-2xl font-bold mb-1">
              What did your inner child love?
            </h1>
            <p className="text-gray-600 text-sm mb-6">
              Pick up to 3 — we'll shape your prompts around these.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {TAGS.map((tag) => {
                const selected = selectedTags.includes(tag.value);
                return (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() => toggleTag(tag.value)}
                    className={`rounded-xl border-2 px-3 py-4 text-left transition ${
                      selected
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="text-2xl mb-1">{tag.emoji}</div>
                    <div className="text-sm font-medium">{tag.label}</div>
                  </button>
                );
              })}
            </div>
            <button
              disabled={selectedTags.length === 0}
              onClick={goNext}
              className="w-full bg-orange-500 text-white rounded-xl py-3 font-medium disabled:opacity-40"
            >
              Continue ({selectedTags.length}/3 selected)
            </button>
          </div>
        )}

        {step === "cadence" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h1 className="text-2xl font-bold mb-1">How often?</h1>
            <p className="text-gray-600 text-sm mb-6">
              You can change this anytime in settings — no pressure.
            </p>
            <div className="flex flex-col gap-3 mb-6">
              {CADENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCadence(opt.value)}
                  className={`rounded-xl border-2 px-4 py-3 text-left transition ${
                    cadence === opt.value
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-sm text-gray-500">{opt.sublabel}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={goBack}
                className="flex-1 border border-gray-300 rounded-xl py-3 font-medium"
              >
                Back
              </button>
              <button
                onClick={goNext}
                className="flex-1 bg-orange-500 text-white rounded-xl py-3 font-medium"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "memory" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h1 className="text-2xl font-bold mb-1">
              One memory (optional)
            </h1>
            <p className="text-gray-600 text-sm mb-4">
              What's something you loved doing as a kid? We'll use this to
              shape your very first prompt.
            </p>
            <textarea
              value={memory}
              onChange={(e) => setMemory(e.target.value)}
              placeholder="e.g. Building blanket forts and pretending they were spaceships..."
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {error && (
              <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={goBack}
                disabled={saving}
                className="flex-1 border border-gray-300 rounded-xl py-3 font-medium disabled:opacity-40"
              >
                Back
              </button>
              <button
                onClick={finishOnboarding}
                disabled={saving}
                className="flex-1 bg-orange-500 text-white rounded-xl py-3 font-medium disabled:opacity-50"
              >
                {saving ? "Saving..." : "Let's go"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
