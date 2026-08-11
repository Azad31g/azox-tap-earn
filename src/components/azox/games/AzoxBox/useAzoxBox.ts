import { useCallback, useEffect, useRef, useState } from "react";
import { useAzox } from "@/components/azox/app-provider";
import { haptic } from "@/lib/telegram";

export const BOXES_PER_DAY = 20;
export const SESSION_SECONDS = 70;
export const MAX_WINNERS = 65000;
export const BOX_REWARD = 1600;

export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Completely random (but date-seeded) schedule: up to 20 boxes, wildly varying gaps. */
export function generateDailySchedule(dateStr: string): number[] {
  const dateSeed = dateStr
    .split("")
    .reduce((a, c, i) => a + c.charCodeAt(0) * (i + 7) * 31, 0);

  let rng = dateSeed ^ 0xdeadbeef;
  const seededRandom = () => {
    rng ^= rng << 13;
    rng ^= rng >> 17;
    rng ^= rng << 5;
    return Math.abs(rng % 1000) / 1000;
  };

  const totalSeconds = 24 * 60 * 60;
  const times: number[] = [];

  let lastTime = Math.floor(seededRandom() * 3600);

  for (let i = 0; i < BOXES_PER_DAY; i++) {
    times.push(lastTime);

    const minGap = 900;
    const maxGap = 5400;
    const gap = minGap + Math.floor(seededRandom() * (maxGap - minGap));

    lastTime += gap + SESSION_SECONDS;

    if (lastTime >= totalSeconds - SESSION_SECONDS) break;
  }

  return times;
}

export function getSchedule(dateStr: string): number[] {
  const key = `azoxBox_schedule_v2_${dateStr}`;
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed) && parsed.length > 0) return parsed as number[];
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

/** How many boxes have already appeared (started) today. */
export function countAppeared(schedule: number[], secondsFromMidnight: number): number {
  return schedule.filter((t) => t <= secondsFromMidnight).length;
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

export function secondsFromMidnight(d: Date): number {
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
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
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    getSchedule(dateKey(tomorrow));
  }, [today]);

  const secs = secondsFromMidnight(now);
  const sessionIndex = schedule.length ? getCurrentSession(schedule, secs) : null;
  const hasOpened = sessionIndex !== null && opened.includes(sessionIndex);
  const spotsLeft = Math.max(0, MAX_WINNERS - winners);
  const isActive = sessionIndex !== null && spotsLeft > 0;

  const secondsRemaining =
    sessionIndex === null ? 0 : schedule[sessionIndex]! + SESSION_SECONDS - secs;

  // Missed: a session closed within the last 5 minutes and wasn't opened
  const lastPassed = (() => {
    let idx = -1;
    for (let i = 0; i < schedule.length; i++) {
      if (schedule[i]! + SESSION_SECONDS <= secs) idx = i;
    }
    return idx;
  })();
  const missedRecently =
    lastPassed >= 0 && secs - (schedule[lastPassed]! + SESSION_SECONDS) < 300;
  const missed = !isActive && missedRecently && !opened.includes(lastPassed);

  useEffect(() => {
    if (sessionIndex === null) setJustOpened(false);
  }, [sessionIndex]);

  const openBox = useCallback(() => {
    if (busy.current) return;
    const d = new Date();
    const s = secondsFromMidnight(d);
    const key = dateKey(d);
    const sched = getSchedule(key);
    const idx = getCurrentSession(sched, s);
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
    secondsRemaining: Math.max(0, secondsRemaining),
    spotsLeft,
    appearedToday: schedule.length ? countAppeared(schedule, secs) : 0,
    openedCount: opened.length,
    pointsToday,
    openBox,
  };
}
