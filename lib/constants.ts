export const TAGS = [
  { value: "art", label: "Art & Drawing", emoji: "🎨" },
  { value: "building", emoji: "🧱", label: "Building Things" },             // was "Building & Making"
  { value: "outdoors", label: "Outdoors & Nature", emoji: "🌳" },
  { value: "movement", label: "Movement & Sports", emoji: "🤸" },
  { value: "pretend_play", emoji: "🎭", label: "Stories & Imagination" }, // was "Pretend Play & Stories"
  { value: "music", label: "Music & Rhythm", emoji: "🎵" },
  { value: "animals", label: "Animals", emoji: "🐾" },
  { value: "puzzles", label: "Puzzles & Games", emoji: "🧩" },
  { value: "cooking", emoji: "🍪", label: "Baking & Treats" },            // was "Cooking & Snacks"
] as const;

export type TagValue = (typeof TAGS)[number]["value"];

export const CADENCE_OPTIONS = [
  {
    value: "daily",
    label: "Every day",
    sublabel: "A tiny moment of play, each day.",
  },
  {
    value: "three_times_week",
    label: "A few times a week",
    sublabel: "A little adventure on Mon / Wed / Fri.",
  },
  {
    value: "weekly",
    label: "Once a week",
    sublabel: "One gentle moment of play each week.",
  },
] as const;

export type CadenceValue = (typeof CADENCE_OPTIONS)[number]["value"];