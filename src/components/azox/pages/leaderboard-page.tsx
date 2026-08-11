import { useState } from "react";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LEADERBOARD, RANKS, formatPoints, type RankKey } from "@/lib/azox-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const RANK_ORDER: RankKey[] = [
  "Legendary",
  "Epic",
  "Diamond",
  "Platinum",
  "Gold",
  "Silver",
  "Bronze",
];

function rankColor(key: RankKey) {
  return RANKS.find((r) => r.key === key)?.color ?? "#ffffff";
}

export function LeaderboardPage() {
  const [active, setActive] = useState<RankKey>("Legendary");
  const users = [...LEADERBOARD[active]].sort((a, b) => b.points - a.points);
  const activeThreshold = RANKS.find((r) => r.key === active)?.threshold ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold">Global Ranking</h1>
        <p className="text-sm text-muted-foreground">
          7 ranks, sorted by total points.
        </p>
      </div>

      {/* Founder feature */}
      <section className="glass glow-purple flex items-center gap-3 rounded-2xl p-4">
        <Avatar className="size-12 border border-primary/40">
          <AvatarFallback className="bg-primary/20 font-bold text-foreground">
            AB
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Crown className="size-4 text-gold" aria-hidden="true" />
            <p className="text-sm font-bold">Azad Bashqali</p>
          </div>
          <p className="text-xs text-muted-foreground">Founder — AZOX Token</p>
        </div>
        <span
          className="rounded-full border px-2.5 py-1 text-[11px] font-semibold"
          style={{
            color: rankColor("Legendary"),
            borderColor: rankColor("Legendary"),
          }}
        >
          Legendary
        </span>
      </section>

      {/* Rank tabs */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {RANK_ORDER.map((key) => {
          const isActive = key === active;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                isActive
                  ? "border-transparent text-background"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
              style={isActive ? { backgroundColor: rankColor(key) } : undefined}
            >
              {key}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <section className="glass rounded-2xl p-2">
        <div className="flex items-center justify-between px-3 py-2">
          <h2 className="text-sm font-bold" style={{ color: rankColor(active) }}>
            {active}
          </h2>
          <span className="text-[11px] text-muted-foreground">
            {activeThreshold === 0
              ? "Starter"
              : `+${formatPoints(activeThreshold)}`}
          </span>
        </div>
        <ul className="flex flex-col">
          {users.map((u, i) => (
            <li
              key={u.name}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-secondary/40"
            >
              <span
                className={cn(
                  "w-5 text-center text-sm font-bold tabular-nums",
                  i === 0 ? "text-gold" : "text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              <Avatar className="size-9">
                <AvatarFallback className="bg-secondary text-xs font-semibold">
                  {u.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {u.name}
              </span>
              <span className="text-sm font-bold tabular-nums text-gold">
                {formatPoints(u.points)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
