import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { rankForPoints, type Rank } from "@/lib/azox-data";

type AzoxState = {
  points: number;
  rank: Rank;
  addPoints: (n: number) => void;
  completedTasks: Set<string>;
  completeTask: (id: string) => void;
  dailyClaimed: boolean;
  claimDaily: () => void;
  globalWins: number;
  referrals: number;
};

const AzoxContext = createContext<AzoxState | null>(null);

const STORAGE_KEY = "azox:state:v1";

type StoredState = {
  points: number;
  completedTasks: string[];
  dailyClaimedOn: string | null;
  globalWins: number;
  referrals: number;
};

const DEFAULT_STATE: StoredState = {
  points: 0,
  completedTasks: [],
  dailyClaimedOn: null,
  globalWins: 0,
  referrals: 0,
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function readStored(): StoredState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      points: typeof parsed.points === "number" ? parsed.points : 0,
      completedTasks: Array.isArray(parsed.completedTasks)
        ? parsed.completedTasks
        : [],
      dailyClaimedOn:
        typeof parsed.dailyClaimedOn === "string" ? parsed.dailyClaimedOn : null,
      globalWins: typeof parsed.globalWins === "number" ? parsed.globalWins : 0,
      referrals: typeof parsed.referrals === "number" ? parsed.referrals : 0,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function AzoxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate after mount so SSR and client markup match.
  useEffect(() => {
    setState(readStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable (private mode) — keep running in memory
    }
  }, [state, hydrated]);

  const addPoints = useCallback((n: number) => {
    setState((prev) => ({ ...prev, points: Math.max(0, prev.points + n) }));
  }, []);

  const completeTask = useCallback((id: string) => {
    setState((prev) =>
      prev.completedTasks.includes(id)
        ? prev
        : { ...prev, completedTasks: [...prev.completedTasks, id] },
    );
  }, []);

  const claimDaily = useCallback(() => {
    setState((prev) => {
      const day = today();
      if (prev.dailyClaimedOn === day) return prev;
      return { ...prev, dailyClaimedOn: day, points: prev.points + 50 };
    });
  }, []);

  const completedTasks = useMemo(
    () => new Set(state.completedTasks),
    [state.completedTasks],
  );
  const rank = useMemo(() => rankForPoints(state.points), [state.points]);
  const dailyClaimed = hydrated && state.dailyClaimedOn === today();

  const value = useMemo<AzoxState>(
    () => ({
      points: state.points,
      rank,
      addPoints,
      completedTasks,
      completeTask,
      dailyClaimed,
      claimDaily,
      globalWins: state.globalWins,
      referrals: state.referrals,
    }),
    [
      state.points,
      state.globalWins,
      state.referrals,
      rank,
      addPoints,
      completedTasks,
      completeTask,
      dailyClaimed,
      claimDaily,
    ],
  );

  return <AzoxContext.Provider value={value}>{children}</AzoxContext.Provider>;
}

export function useAzox() {
  const ctx = useContext(AzoxContext);
  if (!ctx) throw new Error("useAzox must be used within AzoxProvider");
  return ctx;
}
