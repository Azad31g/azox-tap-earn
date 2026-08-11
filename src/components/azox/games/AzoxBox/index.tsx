import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { BoxAnimation } from "./BoxAnimation";
import { CountdownDisplay } from "./CountdownDisplay";
import { BOXES_PER_DAY, BOX_REWARD, MAX_WINNERS, SESSION_SECONDS, useAzoxBox } from "./useAzoxBox";

export default function AzoxBox() {
  const box = useAzoxBox();

  const phase = box.justOpened
    ? "opened"
    : box.isActive && !box.hasOpened
      ? "active"
      : ("idle" as const);

  return (
    <div
      className={`flex min-h-[70dvh] flex-col gap-6 ${
        phase === "active" ? "azox-box-bg" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <Link
          to="/gaming"
          aria-label="Back to gaming hub"
          className="glass grid size-9 place-items-center rounded-xl text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
        <h1 className="text-lg font-extrabold">AZOX Box</h1>
      </div>

      <div className="glass flex flex-1 flex-col items-center justify-center gap-5 rounded-3xl p-6 text-center">
        {!box.hydrated ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <>
            <BoxAnimation phase={phase} />

            {phase === "opened" ? (
              <>
                <p className="text-2xl font-extrabold text-[#FFD166]">
                  +{BOX_REWARD.toLocaleString()} AZOX Points! 🎉
                </p>
                <p className="text-sm text-muted-foreground">Come back for the next box in</p>
                <CountdownDisplay seconds={box.timeUntilNext} />
              </>
            ) : box.isActive && box.hasOpened ? (
              <>
                <p className="text-lg font-bold text-primary">Already opened ✅</p>
                <p className="text-xs text-muted-foreground">
                  Box {box.boxNumberToday} of {BOXES_PER_DAY} today
                </p>
                <CountdownDisplay label="Next box in" seconds={box.timeUntilNext} />
              </>
            ) : box.isActive ? (
              <>
                <p className="animate-pulse text-2xl font-extrabold text-[#FF7A18]">
                  🎁 BOX IS OPEN!
                </p>
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    box.openBox();
                  }}
                  className="rounded-2xl bg-[#FF7A18] px-10 py-5 text-xl font-extrabold text-black shadow-[0_0_30px_#FF7A18] active:scale-95"
                >
                  OPEN BOX
                </button>
                <div className="w-full max-w-xs">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#FF7A18] transition-[width] duration-1000 ease-linear"
                      style={{
                        width: `${(box.secondsRemaining / SESSION_SECONDS) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[#FF7A18]">
                    {box.secondsRemaining} seconds remaining
                  </p>
                </div>
              </>
            ) : box.missed ? (
              <>
                <p className="text-lg font-bold text-destructive">⏰ Box closed! You missed it</p>
                <CountdownDisplay label="Next box in" seconds={box.timeUntilNext} />
                <p className="text-xs text-muted-foreground">
                  Next up: box {box.nextBoxNumber} of {BOXES_PER_DAY}
                </p>
              </>
            ) : (
              <>
                <CountdownDisplay label="Next box in" seconds={box.timeUntilNext} />
                <p className="text-sm text-muted-foreground">
                  Opens {BOXES_PER_DAY} times daily at random times
                </p>
                <p className="text-xs text-muted-foreground">
                  {MAX_WINNERS.toLocaleString()} spots per box • {BOX_REWARD.toLocaleString()} points
                  each
                </p>
                <p className="text-xs font-semibold text-primary">
                  Box {box.nextBoxNumber} of {BOXES_PER_DAY} today
                </p>
              </>
            )}

            <p className="text-[11px] text-muted-foreground">
              Opened today: {box.openedCount}/{BOXES_PER_DAY} • Earned{" "}
              {box.pointsToday.toLocaleString()} pts
            </p>
          </>
        )}
      </div>
    </div>
  );
}
