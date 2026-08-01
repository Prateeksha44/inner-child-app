export const TAGS = [
  { value: "art", label: "Art & Drawing", emoji: "🎨" },
  { value: "building", label: "Building & Making", emoji: "🧱" },
  { value: "outdoors", label: "Outdoors & Nature", emoji: "🌳" },
  { value: "movement", label: "Movement & Sports", emoji: "🤸" },
  { value: "pretend_play", label: "Pretend Play & Stories", emoji: "🎭" },
  { value: "music", label: "Music & Rhythm", emoji: "🎵" },
  { value: "animals", label: "Animals", emoji: "🐾" },
  { value: "puzzles", label: "Puzzles & Games", emoji: "🧩" },
  { value: "cooking", label: "Cooking & Snacks", emoji: "🍪" },
] as const;

export type TagValue = (typeof TAGS)[number]["value"];

export const CADENCE_OPTIONS = [
  { value: "daily", label: "Daily", sublabel: "A prompt every day" },
  { value: "3x_week", label: "3x a week", sublabel: "Mon / Wed / Fri-ish" },
  { value: "weekly", label: "Weekly", sublabel: "One prompt a week" },
] as const;

export type CadenceValue = (typeof CADENCE_OPTIONS)[number]["value"];
