import { useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import type { Direction } from "./types";

const BUTTONS: {
  dir: Direction;
  label: string;
  pos: string;
  Icon: typeof ChevronUp;
}[] = [
  { dir: "up", label: "Move up", pos: "top-1 left-1/2 -translate-x-1/2", Icon: ChevronUp },
  { dir: "down", label: "Move down", pos: "bottom-1 left-1/2 -translate-x-1/2", Icon: ChevronDown },
  { dir: "left", label: "Move left", pos: "left-1 top-1/2 -translate-y-1/2", Icon: ChevronLeft },
  { dir: "right", label: "Move right", pos: "right-1 top-1/2 -translate-y-1/2", Icon: ChevronRight },
];

export function Joystick({ onMove }: { onMove: (d: Direction) => void }) {
  const [active, setActive] = useState<Direction | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const fire = (d: Direction) => {
    setActive(d);
    onMove(d);
    window.setTimeout(() => setActive(null), 120);
  };

  const dragTo = (x: number, y: number) => {
    const s = dragStart.current;
    if (!s) return;
    const dx = x - s.x;
    const dy = y - s.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    dragStart.current = { x, y };
    if (Math.abs(dx) > Math.abs(dy)) fire(dx > 0 ? "right" : "left");
    else fire(dy > 0 ? "down" : "up");
  };

  return (
    <div className="flex justify-center py-4">
      <div
        className="relative size-52 rounded-full border border-primary/40 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.06),rgba(0,0,0,0.9))]"
        style={{
          touchAction: "none",
          boxShadow: "0 0 30px rgba(34,197,94,0.25), inset 0 0 40px rgba(0,0,0,0.8)",
        }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          if (t) dragStart.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          const t = e.touches[0];
          if (t) dragTo(t.clientX, t.clientY);
        }}
        onTouchEnd={() => (dragStart.current = null)}
      >
        {BUTTONS.map(({ dir, label, pos, Icon }) => (
          <button
            key={dir}
            type="button"
            aria-label={label}
            onClick={() => fire(dir)}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              fire(dir);
            }}
            className={`pointer-events-auto absolute grid size-14 place-items-center rounded-full text-primary transition-all ${pos} ${
              active === dir ? "scale-90 bg-primary/20" : "bg-transparent"
            }`}
            style={
              active === dir
                ? { boxShadow: "0 0 18px rgba(34,197,94,0.7)" }
                : undefined
            }
          >
            <Icon className="size-8" strokeWidth={3} aria-hidden="true" />
          </button>
        ))}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_30%,#3a3a3a,#0b0b0b)]"
          style={{ boxShadow: "inset 0 2px 6px rgba(255,255,255,0.15), 0 6px 18px rgba(0,0,0,0.8)" }}
        />
      </div>
    </div>
  );
}
