import { useCallback, useEffect, useRef, useState } from "react";
import type { Direction } from "./types";

const ARROWS = {
  UP: "↑",
  DOWN: "↓",
  LEFT: "←",
  RIGHT: "→",
} as const;

const LOWER: Record<"UP" | "DOWN" | "LEFT" | "RIGHT", Direction> = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};

export function Joystick({ onMove }: { onMove: (d: Direction) => void }) {
  const [dir, setDir] = useState<Direction>("right");
  const didInit = useRef(false);

  const handleDirection = useCallback((d: "UP" | "DOWN" | "LEFT" | "RIGHT") => {
    const opposites = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    } as const;
    setDir((prev) => {
      const prevUpper = prev.toUpperCase() as keyof typeof opposites;
      if (opposites[d] === prevUpper) return prev;
      return LOWER[d];
    });
  }, []);

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      return;
    }
    // eslint-disable-next-line no-console
    console.log("[joystick] onMove", dir);
    onMove(dir);
  }, [dir, onMove]);

  const button = (d: "UP" | "DOWN" | "LEFT" | "RIGHT") => (
    <button
      key={d}
      type="button"
      aria-label={`Move ${LOWER[d]}`}
      style={{
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
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDirection(d);
      }}
    >
      {ARROWS[d]}
    </button>
  );

  return (
    <div
      className="flex justify-center py-4"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
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
        {button("UP")}
        <div />
        {button("LEFT")}
        <div
          style={{ backgroundColor: "#1a1a1a", borderRadius: "50%" }}
        />
        {button("RIGHT")}
        <div />
        {button("DOWN")}
        <div />
      </div>
    </div>
  );
}
