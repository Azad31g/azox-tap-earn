import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import type { Direction } from "./types";

const BUTTONS: {
  dir: Direction;
  label: string;
  pos: string;
  Icon: typeof ChevronUp;
}[] = [
  { dir: "up", label: "Move up", pos: "top-2 left-1/2 -translate-x-1/2", Icon: ChevronUp },
  { dir: "down", label: "Move down", pos: "bottom-2 left-1/2 -translate-x-1/2", Icon: ChevronDown },
  { dir: "left", label: "Move left", pos: "left-2 top-1/2 -translate-y-1/2", Icon: ChevronLeft },
  { dir: "right", label: "Move right", pos: "right-2 top-1/2 -translate-y-1/2", Icon: ChevronRight },
];

export function Joystick({ onMove }: { onMove: (d: Direction) => void }) {
  const [active, setActive] = useState<Direction | null>(null);

  return (
    <div className="flex justify-center py-4">
      <div
        className="relative size-52 rounded-full border border-primary/40 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.06),rgba(0,0,0,0.9))]"
        style={{ boxShadow: "0 0 30px hsl(var(--primary) / 0.25), inset 0 0 40px rgba(0,0,0,0.8)" }}
      >
        {BUTTONS.map(({ dir, label, pos, Icon }) => (
          <button
            key={dir}
            type="button"
            aria-label={label}
            onPointerDown={(e) => {
              e.preventDefault();
              setActive(dir);
              onMove(dir);
            }}
            onPointerUp={() => setActive(null)}
            onPointerLeave={() => setActive(null)}
            className={`absolute grid size-16 place-items-center rounded-full text-primary transition-all ${pos} ${
              active === dir ? "scale-90 bg-primary/20" : "bg-transparent"
            }`}
            style={
              active === dir
                ? { boxShadow: "0 0 18px hsl(var(--primary) / 0.7)" }
                : undefined
            }
          >
            <Icon className="size-8" strokeWidth={3} aria-hidden="true" />
          </button>
        ))}
        <div
          className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_30%,#3a3a3a,#0b0b0b)]"
          style={{ boxShadow: "inset 0 2px 6px rgba(255,255,255,0.15), 0 6px 18px rgba(0,0,0,0.8)" }}
        />
      </div>
    </div>
  );
}
