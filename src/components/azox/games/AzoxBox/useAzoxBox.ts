import { useCallback, useEffect, useRef, useState } from "react";
import { useAzox } from "@/components/azox/app-provider";
import { haptic } from "@/lib/telegram";

export const BOXES_PER_DAY = 20;
export const SESSION_SECONDS = 70;
export const MAX_WINNERS = 65000;
export const BOX_REWARD = 1600;

const SLOT_SECONDS = Math.floor((24 * 3600) / BOXES_PER_DAY); // 4320s = 72 min

export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Deterministic 20-times-per-day schedule (seconds from midnight). */
export function generateDailySchedule(dateStr: string): number[] {
  const seed = dateStr.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  let rng = seed;
  const random = () => {
    rng = (rng * 1664525 + 1013904223) & 0xffffffff;
    return Math.abs(rng) / 0xffffffff;
  };
  const times: number[] = [];
  for (let i = 0; i < BOXES_PER_DAY; i++) {
    const slotStart = i * SLOT_SECONDS;
    const span = SLOT_SECONDS - SESSION_SECONDS;
    times.push(slotStart + Math.floor(random() * span));
  }
  return times.sort((a, b) => a - b);
}

export function getSchedule(dateStr: string): number[] {
  const key = `azoxBox_schedule_${dateStr}`;
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed) && parsed.length === BOXES_PER_DAY) {
          return parsed as number[];
        }
      }
    } catch {
      /* ignore corrupt entries */
    }
  }
  const schedule = generateDailySchedule(dateStr);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(schedule));
  }
  return schedule;
}

export function getCurrentSession(schedule: number[], secondsFromMidnight: number): number | null {
  for (let i = 0; i < schedule.length; i++) {
    const start = schedule[i]!;
    if (secondsFromMidnight >= start && secondsFromMidnight < start + SESSION_SECONDS) {
      return i;
    }
  }
  return null;
}

export function formatCountdown(secondsLeft: number): string {
  const total = Math.max(0, Math.floor(secondsLeft));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function readOpened(dateStr: string): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(`azoxBox_opened_${dateStr}`);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    return Array.isArray(parsed) ? (parsed as number[]) : [];
  } catch {
    return [];
  }
}

function readNumber(key: string): number {
  if (typeof window === "undefined") return 0;
  const n = Number(window.localStorage.getItem(key));
  return Number.isFinite(n) ? n : 0;
}

export function useAzoxBox() {
  const { addPoints } = useAzox();
  const [now, setNow] = useState(() => new Date());
  const [hydrated, setHydrated] = useState(false);
  const [today, setToday] = useState(() => dateKey(new Date()));
  const [schedule, setSchedule] = useState<number[]>([]);
  const [opened, setOpened] = useState<number[]>([]);
  const [winners, setWinners] = useState(0);
  const [pointsToday, setPointsToday] = useState(0);
  const [justOpened, setJustOpened] = useState(false);
  const busy = useRef(false);

  // Tick + midnight rollover
  useEffect(() => {
    const id = window.setInterval(() => {
      const d = new Date();
      setNow(d);
      const key = dateKey(d);
      setToday((prev) => (prev === key ? prev : key));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setSchedule(getSchedule(today));
    setOpened(readOpened(today));
    setWinners(readNumber("azoxBox_winners"));
    setPointsToday(readNumber(`azoxBox_lastPoints_${today}`));
    setHydrated(true);
    // pre-generate tomorrow's schedule
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    getSchedule(dateKey(tomorrow));
  }, [today]);

  const secondsFromMidnight = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const sessionIndex = schedule.length ? getCurrentSession(schedule, secondsFromMidnight) : null;
  const hasOpened = sessionIndex !== null && opened.includes(sessionIndex);
  const spotsLeft = Math.max(0, MAX_WINNERS - winners);
  const isActive = sessionIndex !== null && spotsLeft > 0;

  const secondsRemaining =
    sessionIndex === null ? 0 : schedule[sessionIndex]! + SESSION_SECONDS - secondsFromMidnight;

  const nextIndex = schedule.findIndex((t) => t > secondsFromMidnight);
  const timeUntilNext =
    nextIndex === -1
      ? 24 * 3600 - secondsFromMidnight + (schedule[0] ?? 0)
      : schedule[nextIndex]! - secondsFromMidnight;
  const nextBoxNumber = nextIndex === -1 ? 1 : nextIndex + 1;

  // Missed: a session already passed since last opened, and none active
  const lastPassed = (() => {
    let idx = -1;
    for (let i = 0; i < schedule.length; i++) {
      if (schedule[i]! + SESSION_SECONDS <= secondsFromMidnight) idx = i;
    }
    return idx;
  })();
  const missedRecently =
    lastPassed >= 0 &&
    secondsFromMidnight - (schedule[lastPassed]! + SESSION_SECONDS) < 300;
  const missed = !isActive && missedRecently && !opened.includes(lastPassed);

  useEffect(() => {
    if (sessionIndex === null) setJustOpened(false);
  }, [sessionIndex]);

  const openBox = useCallback(() => {
    if (busy.current) return;
    const d = new Date();
    const secs = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
    const key = dateKey(d);
    const sched = getSchedule(key);
    const idx = getCurrentSession(sched, secs);
    if (idx === null) return;
    const already = readOpened(key);
    if (already.includes(idx)) return;
    const w = readNumber("azoxBox_winners");
    if (w >= MAX_WINNERS) return;

    busy.current = true;
    const nextOpened = [...already, idx];
    window.localStorage.setItem(`azoxBox_opened_${key}`, JSON.stringify(nextOpened));
    window.localStorage.setItem("azoxBox_winners", String(w + 1));
    const pts = readNumber(`azoxBox_lastPoints_${key}`) + BOX_REWARD;
    window.localStorage.setItem(`azoxBox_lastPoints_${key}`, String(pts));
    window.localStorage.setItem("azoxBox_lastPoints", String(pts));

    setOpened(nextOpened);
    setWinners(w + 1);
    setPointsToday(pts);
    setJustOpened(true);
    addPoints(BOX_REWARD);
    haptic("medium");
    window.setTimeout(() => {
      busy.current = false;
    }, 600);
  }, [addPoints]);

  return {
    hydrated,
    schedule,
    isActive,
    hasOpened,
    justOpened,
    missed,
    sessionIndex,
    boxNumberToday: sessionIndex === null ? nextBoxNumber : sessionIndex + 1,
    nextBoxNumber,
    secondsRemaining: Math.max(0, secondsRemaining),
    timeUntilNext: Math.max(0, timeUntilNext),
    spotsLeft,
    openedCount: opened.length,
    pointsToday,
    openBox,
  };
}
