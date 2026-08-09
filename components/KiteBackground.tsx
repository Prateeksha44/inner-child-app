function Kite() {
  return (
    <svg viewBox="0 0 60 70" className="w-10 h-12" aria-hidden="true">
      <polygon points="30,4 50,26 30,60 10,26" fill="#F2975B" stroke="#E07A3E" strokeWidth="1.5" />
      <line x1="30" y1="4" x2="30" y2="60" stroke="#E07A3E" strokeWidth="1" />
      <line x1="10" y1="26" x2="50" y2="26" stroke="#E07A3E" strokeWidth="1" />
      <path
        d="M30 60 C 27 65, 33 66, 30 70"
        stroke="#9CB380"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

type KiteBackgroundProps = {
  position?: "top" | "bottom" | "both";
};

export default function KiteBackground({ position = "both" }: KiteBackgroundProps) {
  const showTop = position === "top" || position === "both";
  const showBottom = position === "bottom" || position === "both";

  return (
    <>
      {showTop && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex gap-10 pointer-events-none select-none">
          <Kite />
          <Kite />
          <Kite />
        </div>
      )}

      {showBottom && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-10 pointer-events-none select-none">
          <Kite />
          <Kite />
          <Kite />
        </div>
      )}
    </>
  );
}