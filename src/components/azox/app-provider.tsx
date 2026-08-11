import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { usePoints } from "@/hooks/usePoints";
import { useTasks } from "@/hooks/useTasks";
import { useUser, type AzoxUser } from "@/hooks/useUser";
import type { Rank } from "@/lib/azox-data";

type AzoxState = {
  user: AzoxUser;
  points: number;
  rank: Rank;
  nextRank: Rank | null;
  progress: number;
  level: number;
  addPoints: (n: number) => void;
  tap: (fingers?: number) => number;
  completedTasks: Set<string>;
  completeTask: (id: string) => void;
  dailyClaimed: boolean;
  claimDaily: () => void;
  globalWins: number;
  referrals: number;
};

const AzoxContext = createContext<AzoxState | null>(null);

export function AzoxProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const {
    points,
    rank,
    nextRank,
    progress,
    level,
    addPoints,
    tap,
    globalWins,
  } = usePoints();
  const { completedTasks, completeTask, dailyClaimed, claimDaily } =
    useTasks(addPoints);

  const value = useMemo<AzoxState>(
    () => ({
      user,
      points,
      rank,
      nextRank,
      progress,
      level,
      addPoints,
      tap,
      completedTasks,
      completeTask,
      dailyClaimed,
      claimDaily,
      globalWins,
      referrals: 0,
    }),
    [
      user,
      points,
      rank,
      nextRank,
      progress,
      level,
      addPoints,
      tap,
      completedTasks,
      completeTask,
      dailyClaimed,
      claimDaily,
      globalWins,
    ],
  );

  return <AzoxContext.Provider value={value}>{children}</AzoxContext.Provider>;
}

export function useAzox() {
  const ctx = useContext(AzoxContext);
  if (!ctx) throw new Error("useAzox must be used within AzoxProvider");
  return ctx;
}
