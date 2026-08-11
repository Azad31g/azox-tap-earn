import { useRef } from "react";
import { GRID, type Direction, type Item, type Position } from "./types";

const ITEM_GLYPH: Record<Item["kind"], string> = {
  coin: "🪙",
  diamond: "💎",
  heart: "❤️",
  lightning: "⚡",
  rock: "🪨",
};

export function GameBoard({
  snake,
  items,
  rocks,
  onSwipe,
  children,
}: {
  snake: Position[];
  items: Item[];
  rocks: Item[];
  onSwipe: (d: Direction) => void;
  children?: React.ReactNode;
}) {
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const cell = 100 / GRID;

  const handleStart = (e: React.PointerEvent) => {
    e.preventDefault();
    startRef.current = { x: e.clientX, y: e.clientY };
  };
  const handleEnd = (e: React.PointerEvent) => {
    e.preventDefault();
    const s = startRef.current;
    startRef.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;
    if (Math.abs(dx) > Math.abs(dy)) onSwipe(dx > 0 ? "right" : "left");
    else onSwipe(dy > 0 ? "down" : "up");
  };

  return (
    <div className="flex justify-center px-4">
      <div
        onPointerDown={handleStart}
        onPointerUp={handleEnd}
        onPointerCancel={() => (startRef.current = null)}
        className="relative aspect-square w-full max-w-[85vw] overflow-hidden rounded-2xl border-2 border-primary bg-[#0a0a0a]"
        style={{
          touchAction: "none",
          boxShadow:
            "0 0 24px rgba(163,230,53,0.45), inset 0 0 40px rgba(0,0,0,0.9)",
          backgroundImage:
            "linear-gradient(rgba(163,230,53,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(163,230,53,0.07) 1px, transparent 1px)",
          backgroundSize: `${cell}% ${cell}%`,
        }}
      >
        {[...rocks, ...items].map((it) => (
          <div
            key={`${it.kind}-${it.id}`}
            className="absolute grid place-items-center"
            style={{
              left: `${it.pos.x * cell}%`,
              top: `${it.pos.y * cell}%`,
              width: `${cell}%`,
              height: `${cell}%`,
              fontSize: "min(4.2vw, 22px)",
              filter:
                it.kind === "rock"
                  ? "grayscale(1) brightness(0.9)"
                  : "drop-shadow(0 0 6px rgba(255,255,255,0.25))",
            }}
          >
            <span aria-hidden="true">{ITEM_GLYPH[it.kind]}</span>
          </div>
        ))}

        {snake.map((seg, i) => (
          <div
            key={`${seg.x}-${seg.y}-${i}`}
            className="absolute grid place-items-center transition-all duration-100"
            style={{
              left: `${seg.x * cell}%`,
              top: `${seg.y * cell}%`,
              width: `${cell}%`,
              height: `${cell}%`,
              zIndex: snake.length - i,
            }}
          >
            {i === 0 ? (
              <span
                aria-hidden="true"
                className="grid size-[92%] place-items-center rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 32% 28%, #d9ff7a, #7bc32a 60%, #3f6b12)",
                  boxShadow:
                    "0 0 10px rgba(163,230,53,0.8), inset 0 -2px 4px rgba(0,0,0,0.4)",
                  fontSize: "min(3vw, 14px)",
                }}
              >
                🐍
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="block size-[86%] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 32% 28%, #cbfa6a, #6fb327 62%, #34590f)",
                  boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.45)",
                }}
              />
            )}
          </div>
        ))}

        {children}
      </div>
    </div>
  );
}
