import { useEffect, useState } from "react";
import { Copy, Check, Users, Coins, Zap, Trophy, Wallet, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAzox } from "@/components/azox/app-provider";
import { AzoxFooter } from "@/components/azox/footer";
import { RANKS, formatPoints, nextRank as getNextRank } from "@/lib/azox-data";
import { readStorage, writeStorage } from "@/lib/points";

const AIRDROP_KEYS = {
  address: "azox_wallet_address",
  registered: "azox_airdrop_registered",
  date: "azox_airdrop_date",
  balance: "azox_wallet_balance",
};

const MOCK_ADDRESS = "0x742d35Cc1C9aF5d3E3eF3a8";
const MOCK_BALANCE = 0.0021;
const FEE = 0.001;

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function AirdropSection() {
  const [address, setAddress] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    setAddress(readStorage<string | null>(AIRDROP_KEYS.address, null));
    setRegistered(readStorage<boolean>(AIRDROP_KEYS.registered, false));
    setDate(readStorage<string | null>(AIRDROP_KEYS.date, null));
    setBalance(readStorage<number>(AIRDROP_KEYS.balance, 0));
  }, []);

  const connect = () => {
    setModal(true);
    writeStorage(AIRDROP_KEYS.address, MOCK_ADDRESS);
    writeStorage(AIRDROP_KEYS.balance, MOCK_BALANCE);
    setAddress(MOCK_ADDRESS);
    setBalance(MOCK_BALANCE);
  };

  const payAndRegister = () => {
    setModal(true);
    if (balance >= FEE) {
      const today = new Date().toISOString().slice(0, 10);
      writeStorage(AIRDROP_KEYS.registered, true);
      writeStorage(AIRDROP_KEYS.date, today);
      setRegistered(true);
      setDate(today);
    }
  };

  const isConnected = Boolean(address);
  const hasBalance = balance >= FEE;

  const borderColor = registered ? "#a3e635" : "#FF7A18";
  const glow = registered
    ? "0 0 0 1px rgba(163, 230, 53, 0.3), 0 8px 24px rgba(163, 230, 53, 0.18)"
    : "0 0 0 1px rgba(255, 122, 24, 0.3), 0 8px 24px rgba(255, 122, 24, 0.18)";
  const titleColor = registered ? "#a3e635" : "#FF7A18";

  return (
    <>
      <section
        className="rounded-2xl p-4"
        style={{
          background: "#0d0d0d",
          border: `1px solid ${borderColor}`,
          boxShadow: glow,
        }}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xl">🪂</span>
          <h2 className="text-base font-bold" style={{ color: titleColor }}>
            Airdrop Registration
          </h2>
        </div>

        {!isConnected && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Register your wallet to qualify for the AZOX airdrop.
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                Fee:{" "}
                <span className="font-semibold text-foreground">{FEE} ETH</span>
              </p>
              <p>
                Network:{" "}
                <span className="font-semibold text-foreground">Robinhood Chain</span>
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Connect your wallet to register
            </p>
            <button
              onClick={connect}
              className="w-full rounded-xl py-2.5 text-sm font-semibold text-white"
              style={{ background: "#FF7A18" }}
            >
              <span className="flex items-center justify-center gap-2">
                <Wallet className="size-4" aria-hidden="true" /> Connect Wallet
              </span>
            </button>
          </div>
        )}

        {isConnected && !registered && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                <CheckCircle2 className="size-4" aria-hidden="true" />
              </div>
              <code className="text-xs text-foreground">{shortenAddress(address!)}</code>
            </div>
            <p className="text-xs text-muted-foreground">
              Balance:{" "}
              <span className="font-semibold text-foreground">
                {balance.toFixed(4)} ETH
              </span>
            </p>
            <button
              onClick={payAndRegister}
              disabled={!hasBalance}
              className="w-full rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: hasBalance ? "#FF7A18" : "#555555" }}
            >
              Pay {FEE} ETH & Register
            </button>
            {!hasBalance && (
              <p className="text-center text-xs text-muted-foreground">
                Insufficient ETH balance
              </p>
            )}
          </div>
        )}

        {registered && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                <CheckCircle2 className="size-4" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-primary">Airdrop Eligible!</h3>
            </div>
            <code className="block text-xs text-foreground">
              {shortenAddress(address!)}
            </code>
            <p className="text-xs text-muted-foreground">Registered on {date}</p>
          </div>
        )}
      </section>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setModal(false)}
        >
          <div
            className="relative w-full max-w-xs rounded-2xl p-6 text-center"
            style={{
              background: "#0d0d0d",
              border: "1px solid #FF7A18",
              boxShadow: "0 0 24px rgba(255,122,24,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModal(false)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
            <div className="mb-3 text-3xl">🔗</div>
            <h3 className="mb-2 text-base font-bold" style={{ color: "#FF7A18" }}>
              Wallet connection coming soon!
            </h3>
            <p className="text-xs text-muted-foreground">
              Smart contract is being deployed.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export function ProfilePage() {
  const { user, points, rank, completedTasks, referrals } = useAzox();
  const [copied, setCopied] = useState(false);
  const referral = user.referralLink;
  const nextRank = getNextRank(points);

  const progress = nextRank
    ? Math.min(
        100,
        ((points - rank.threshold) / (nextRank.threshold - rank.threshold)) *
          100,
      )
    : 100;


  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referral);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const stats = [
    { label: "Total Points", value: formatPoints(points), icon: Coins },
    { label: "Current Rank", value: rank.key, icon: Trophy },
    { label: "Tasks Done", value: String(completedTasks.size), icon: Zap },
    { label: "Referrals", value: String(referrals), icon: Users },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Identity */}
      <section className="glass glow-purple flex items-center gap-3 rounded-2xl p-4">
        <Avatar className="size-14 border border-accent/40">
          <AvatarFallback className="bg-accent/15 text-lg font-bold text-accent">
            {user.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold">{user.name}</p>
          <p className="text-xs text-muted-foreground">
            @{user.username} · joined {user.joinedAt}
          </p>
        </div>
        <span
          className="rounded-full border px-2.5 py-1 text-[11px] font-semibold"
          style={{ color: rank.color, borderColor: rank.color }}
        >
          {rank.key}
        </span>
      </section>

      <AirdropSection />

      {/* Stats grid */}
      <section className="grid grid-cols-2 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass rounded-2xl p-4">
              <Icon className="size-4 text-accent" aria-hidden="true" />
              <p className="mt-2 text-lg font-bold tabular-nums">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          );
        })}
      </section>

      {/* Rank progress */}
      <section className="glass rounded-2xl p-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-semibold" style={{ color: rank.color }}>
            {rank.key}
          </span>
          {nextRank ? (
            <span className="text-muted-foreground">
              {formatPoints(nextRank.threshold - points)} to{" "}
              <span style={{ color: nextRank.color }}>{nextRank.key}</span>
            </span>
          ) : (
            <span className="text-gold">Max rank reached</span>
          )}
        </div>
        <Progress value={progress} className="h-2 bg-secondary" />
      </section>

      {/* Referral */}
      <section className="glass rounded-2xl p-4">
        <p className="text-sm font-bold">Your referral link</p>
        <p className="mb-3 text-xs text-muted-foreground">
          Invite friends and earn bonus points together.
        </p>
        <div className="flex items-center gap-2">
          <code className="min-w-0 flex-1 truncate rounded-xl border border-border bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
            {referral}
          </code>
          <Button
            onClick={copy}
            className="rounded-xl bg-accent font-semibold text-accent-foreground hover:bg-accent/90"
          >
            {copied ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </section>

      {/* All ranks */}
      <section className="glass rounded-2xl p-4">
        <h2 className="mb-3 text-sm font-bold">Rank ladder</h2>
        <ul className="flex flex-col gap-2">
          {RANKS.map((r) => (
            <li
              key={r.key}
              className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs"
            >
              <span className="font-semibold" style={{ color: r.color }}>
                {r.key}
              </span>
              <span className="text-muted-foreground">
                {formatPoints(r.threshold)}+ · {r.pointsPerFinger}/finger
              </span>
            </li>
          ))}
        </ul>
      </section>

      <AzoxFooter variant="profile" />
    </div>
  );
}
