import { useCallback, useEffect, useState } from "react";
import type { Direction } from "./types";

const ARROWS: Record<Direction, string> = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};

const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const GRID_POSITIONS: { dir: Direction; gridArea: string }[] = [
  { dir: "up", gridArea: "1 / 2" },
  { dir: "left", gridArea: "2 / 1" },
  { dir: "right", gridArea: "2 / 3" },
  { dir: "down", gridArea: "3 / 2" },
];

export function Joystick({ onMove }: { onMove: (d: Direction) => void }) {
  const [dir, setDir] = useState<Direction>("right");

  const changeDirection = useCallback((next: Direction) => {
    setDir((prev) => {
      if (OPPOSITE[prev] === next) return prev;
      onMove(next);
      return next;
    });
  }, [onMove]);


  return (
    <div
      className="flex justify-center py-4"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "56px 56px 56px",
          gridTemplateRows: "56px 56px 56px",
          gap: "4px",
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div />
        {GRID_POSITIONS.map(({ dir, gridArea }) => (
          <button
            key={dir}
            type="button"
            aria-label={`Move ${dir}`}
            onPointerDown={(e) => {
              e.preventDefault();
              changeDirection(dir);
            }}
            style={{
              gridArea,
              width: "56px",
              height: "56px",
              backgroundColor: "#166534",
              border: "2px solid #22c55e",
              borderRadius: "8px",
              color: "#22c55e",
              fontSize: "24px",
              cursor: "pointer",
              touchAction: "none",
              userSelect: "none",
              WebkitUserSelect: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {ARROWS[dir]}
          </button>
        ))}
        <div
          style={{ gridArea: "2 / 2", backgroundColor: "#1a1a1a", borderRadius: "50%" }}
        />
      </div>
    </div>
  );
}



