import { AZOX_IMAGES } from "./azox-images";

export type RankKey =
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
  | "Epic"
  | "Legendary";

export type Rank = {
  key: RankKey;
  threshold: number;
  pointsPerFinger: number;
  color: string;
};

export const RANKS: Rank[] = [
  { key: "Bronze", threshold: 0, pointsPerFinger: 1, color: "#b87333" },
  { key: "Silver", threshold: 10_000, pointsPerFinger: 2, color: "#c0c7d0" },
  { key: "Gold", threshold: 25_000, pointsPerFinger: 3, color: "#f5c542" },
  { key: "Platinum", threshold: 100_000, pointsPerFinger: 4, color: "#7fd1e0" },
  { key: "Diamond", threshold: 500_000, pointsPerFinger: 5, color: "#67e8f9" },
  { key: "Epic", threshold: 1_000_000, pointsPerFinger: 6, color: "#7c3aed" },
  {
    key: "Legendary",
    threshold: 10_000_000,
    pointsPerFinger: 7,
    color: "#f5c542",
  },
];

export function rankForPoints(points: number): Rank {
  let current: Rank = RANKS[0]!;
  for (const r of RANKS) {
    if (points >= r.threshold) current = r;
  }
  return current;
}

export function nextRank(points: number): Rank | null {
  const sorted = [...RANKS].sort((a, b) => a.threshold - b.threshold);
  for (const r of sorted) {
    if (points < r.threshold) return r;
  }
  return null;
}

export type Game = {
  id: string;
  name: string;
  image: string;
  tag: string;
};

export const GAMES: Game[] = [
  {
    id: "video-ads",
    name: "Azox Word",
    image: AZOX_IMAGES["video-ads"],
    tag: "Daily",
  },
  {
    id: "global-button",
    name: "The Global Button",
    image: AZOX_IMAGES["global-button"],
    tag: "Live",
  },
  {
    id: "question-day",
    name: "AZOX Question Day",
    image: AZOX_IMAGES["question-day"],
    tag: "Daily",
  },
  { id: "box", name: "AZOX Box", image: AZOX_IMAGES.box, tag: "Loot" },
  {
    id: "clicker-frenzy",
    name: "Clicker Frenzy",
    image: AZOX_IMAGES["clicker-frenzy"],
    tag: "Arcade",
  },
  { id: "snake", name: "AZOX Snake", image: AZOX_IMAGES.snake, tag: "Arcade" },
  { id: "shoot", name: "AZOX Shoot", image: AZOX_IMAGES.shoot, tag: "Arcade" },
  {
    id: "tak-bom",
    name: "AZOX Tak Bom",
    image: AZOX_IMAGES["tak-bom"],
    tag: "Arcade",
  },
];

export const CATEGORIES = [
  "Blockchain",
  "AI",
  "AI Agent",
  "Trading",
  "Analysis",
  "Gaming",
  "Economic",
  "Learning",
];

export type SocialTask = {
  id: string;
  platform: string;
  label: string;
  points: number;
};

export const SOCIAL_TASKS: { platform: string; tasks: SocialTask[] }[] = [
  {
    platform: "Telegram",
    tasks: [
      {
        id: "tg-1",
        platform: "Telegram",
        label: "Join AZOX Community",
        points: 100,
      },
      { id: "tg-2", platform: "Telegram", label: "Join AZOX Coin", points: 100 },
    ],
  },
  {
    platform: "X (Twitter)",
    tasks: [
      {
        id: "x-1",
        platform: "X (Twitter)",
        label: "Follow Azad_Bashqaly",
        points: 150,
      },
      {
        id: "x-2",
        platform: "X (Twitter)",
        label: "Follow AZOX Coin",
        points: 150,
      },
      {
        id: "x-3",
        platform: "X (Twitter)",
        label: "Follow Solana",
        points: 100,
      },
      {
        id: "x-4",
        platform: "X (Twitter)",
        label: "Follow Raydium",
        points: 100,
      },
      {
        id: "x-5",
        platform: "X (Twitter)",
        label: "Follow SOL Foundation",
        points: 100,
      },
      {
        id: "x-6",
        platform: "X (Twitter)",
        label: "Follow Phantom",
        points: 100,
      },
      { id: "x-7", platform: "X (Twitter)", label: "Follow OKX", points: 100 },
      {
        id: "x-8",
        platform: "X (Twitter)",
        label: "Follow MetaMask",
        points: 100,
      },
      {
        id: "x-9",
        platform: "X (Twitter)",
        label: "Follow Trust Wallet",
        points: 100,
      },
    ],
  },
  {
    platform: "Instagram",
    tasks: [
      {
        id: "ig-1",
        platform: "Instagram",
        label: "Follow Azad Bashqaly",
        points: 150,
      },
      {
        id: "ig-2",
        platform: "Instagram",
        label: "Follow AZOX Coin",
        points: 150,
      },
      { id: "ig-3", platform: "Instagram", label: "Follow Solana", points: 70 },
      {
        id: "ig-4",
        platform: "Instagram",
        label: "Follow Phantom",
        points: 100,
      },
      {
        id: "ig-5",
        platform: "Instagram",
        label: "Follow MetaMask",
        points: 50,
      },
      {
        id: "ig-6",
        platform: "Instagram",
        label: "Follow Trust Wallet",
        points: 50,
      },
      { id: "ig-7", platform: "Instagram", label: "Follow OKX", points: 30 },
    ],
  },
  {
    platform: "TikTok",
    tasks: [
      {
        id: "tt-1",
        platform: "TikTok",
        label: "Follow Azad Bashqaly",
        points: 100,
      },
      { id: "tt-2", platform: "TikTok", label: "Follow AZOX Coin", points: 100 },
      { id: "tt-3", platform: "TikTok", label: "Follow Phantom", points: 50 },
    ],
  },
  {
    platform: "YouTube",
    tasks: [
      {
        id: "yt-1",
        platform: "YouTube",
        label: "Subscribe Azox Coin",
        points: 150,
      },
      {
        id: "yt-2",
        platform: "YouTube",
        label: "Subscribe Phantom",
        points: 100,
      },
      {
        id: "yt-3",
        platform: "YouTube",
        label: "Subscribe MetaMask",
        points: 100,
      },
      {
        id: "yt-4",
        platform: "YouTube",
        label: "Subscribe Trust Wallet",
        points: 100,
      },
      {
        id: "yt-5",
        platform: "YouTube",
        label: "Subscribe Solana",
        points: 100,
      },
      { id: "yt-6", platform: "YouTube", label: "Subscribe OKX", points: 100 },
    ],
  },
  {
    platform: "Discord",
    tasks: [
      {
        id: "dc-1",
        platform: "Discord",
        label: "Join AZOX Server",
        points: 100,
      },
    ],
  },
];

export type LeaderboardUser = {
  name: string;
  points: number;
  avatar?: string;
};

// Demo leaderboard data per rank.
export const LEADERBOARD: Record<RankKey, LeaderboardUser[]> = {
  Legendary: [
    { name: "cryptoKing", points: 14_200_000 },
    { name: "azox_whale", points: 11_900_000 },
    { name: "solana_max", points: 10_400_000 },
  ],
  Epic: [
    { name: "tap_master", points: 4_300_000 },
    { name: "degen_dana", points: 2_100_000 },
    { name: "nightowl", points: 1_050_000 },
  ],
  Diamond: [
    { name: "gem_hunter", points: 820_000 },
    { name: "frostbyte", points: 640_000 },
    { name: "lumina", points: 520_000 },
  ],
  Platinum: [
    { name: "steel_fox", points: 320_000 },
    { name: "orbit", points: 180_000 },
    { name: "pulse", points: 105_000 },
  ],
  Gold: [
    { name: "goldrush", points: 84_000 },
    { name: "midas", points: 55_000 },
    { name: "sunny", points: 26_000 },
  ],
  Silver: [
    { name: "silverlining", points: 22_000 },
    { name: "mercury", points: 14_000 },
    { name: "breeze", points: 10_100 },
  ],
  Bronze: [
    { name: "newcomer", points: 8_400 },
    { name: "rookie_99", points: 3_200 },
    { name: "starter", points: 450 },
  ],
};

export function formatPoints(n: number): string {
  return n.toLocaleString("en-US");
}
