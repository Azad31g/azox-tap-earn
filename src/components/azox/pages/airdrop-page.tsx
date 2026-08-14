import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown, Wallet, CheckCircle2 } from "lucide-react";
import { readStorage, writeStorage } from "@/lib/points";

const KEYS = {
  address: "azox_wallet_address",
  registered: "azox_airdrop_registered",
  date: "azox_airdrop_date",
  balance: "azox_wallet_balance",
};

const MOCK_ADDRESS = "0x742d35Cc1C9aF5d3E3eF3a8";
const MOCK_BALANCE = 0.0021;
const FEE = 0.001;
const ORANGE = "#FF7A18";
const GREEN = "#a3e635";

function shorten(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

const STEPS = [
  { icon: "🔗", text: "Connect your wallet" },
  { icon: "✅", text: "Confirm registration" },
  { icon: "🎁", text: "Receive AZOX tokens" },
];

const WALLETS = ["MetaMask", "WalletConnect", "Trust Wallet", "Phantom"];
const WALLET_ICONS: Record<string, string> = {
  MetaMask: "🦊",
  WalletConnect: "🔵",
  "Trust Wallet": "🛡️",
  Phantom: "👻",
};

const FAQ = [
  {
    q: "What is the AZOX Airdrop?",
    a: "AZOX token distribution to early community members on Robinhood Chain.",
  },
  {
    q: "Why is a fee required?",
    a: "The 0.001 ETH fee confirms wallet ownership and prevents bot registrations.",
  },
  {
    q: "When will tokens be distributed?",
    a: "Distribution date will be announced in our official channels.",
  },
  {
    q: "How many tokens will I receive?",
    a: "Distribution is based on your points rank and activity on the platform.",
  },
];

function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      {pieces.map((i) => (
        <span
          key={i}
          className="absolute block size-2 rounded-sm"
          style={{
            left: `${(i * 37) % 100}%`,
            top: "-10%",
            background: i % 3 === 0 ? ORANGE : i % 3 === 1 ? GREEN : "#ffffff",
            animation: `azox-confetti 1.6s ${(i % 8) * 0.12}s ease-in forwards`,
          }}
        />
      ))}
      <style>{`@keyframes azox-confetti{to{transform:translateY(320px) rotate(540deg);opacity:0}}`}</style>
    </div>
  );
}

export function AirdropPage() {
  const [address, setAddress] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [modal, setModal] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    setAddress(readStorage<string | null>(KEYS.address, null));
    setRegistered(readStorage<boolean>(KEYS.registered, false));
    setDate(readStorage<string | null>(KEYS.date, null));
    setBalance(readStorage<number>(KEYS.balance, 0));
  }, []);

  const connect = () => {
    setModal(true);
    writeStorage(KEYS.address, MOCK_ADDRESS);
    writeStorage(KEYS.balance, MOCK_BALANCE);
    setAddress(MOCK_ADDRESS);
    setBalance(MOCK_BALANCE);
  };

  const register = () => {
    if (balance < FEE) return;
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    writeStorage(KEYS.registered, true);
    writeStorage(KEYS.date, today);
    setRegistered(true);
    setDate(today);
    setConfetti(true);
    window.setTimeout(() => setConfetti(false), 2200);
  };

  const testRegistration = () => {
    writeStorage(KEYS.address, MOCK_ADDRESS);
    writeStorage(KEYS.balance, MOCK_BALANCE);
    setAddress(MOCK_ADDRESS);
    setBalance(MOCK_BALANCE);
    register();
  };

  const isConnected = Boolean(address);
  const hasBalance = balance >= FEE;

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <header className="flex items-center gap-3">
        <Link
          to="/profile"
          aria-label="Back to profile"
          className="flex size-9 items-center justify-center rounded-xl border border-border bg-secondary/40 text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-lg font-bold">AZOX Airdrop</h1>
          <p className="text-xs text-muted-foreground">Register your wallet</p>
        </div>
      </header>

      {/* Hero */}
      <section
        className="rounded-2xl p-6 text-center"
        style={{
          background: "#0d0d0d",
          border: `1px solid ${ORANGE}`,
          boxShadow: "0 0 0 1px rgba(255,122,24,0.25), 0 10px 32px rgba(255,122,24,0.2)",
        }}
      >
        <div style={{ fontSize: 64, lineHeight: 1 }}>🪂</div>
        <h2 className="mt-3 text-base font-bold" style={{ color: ORANGE }}>
          AZOX Airdrop Registration
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Register once to qualify for AZOX token distribution
        </p>
        <div
          className="mx-auto mt-4 h-0.5 w-20 rounded-full"
          style={{ background: ORANGE }}
        />
      </section>

      {/* How it works */}
      <section className="glass rounded-2xl p-4">
        <h2 className="mb-3 text-sm font-bold">How it works</h2>
        <ul className="flex flex-col gap-3">
          {STEPS.map((s, i) => (
            <li key={s.text} className="flex items-center gap-3">
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
                style={{ color: GREEN, borderColor: GREEN }}
              >
                {i + 1}
              </span>
              <span className="text-sm" style={{ color: GREEN }}>
                {s.icon} {s.text}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Wallet card */}
      <section
        className="relative rounded-2xl p-5"
        style={{
          background: "#0d0d0d",
          border: `1px solid ${registered ? GREEN : ORANGE}`,
          boxShadow: registered
            ? "0 8px 24px rgba(163,230,53,0.18)"
            : "0 8px 24px rgba(255,122,24,0.18)",
        }}
      >
        {confetti && <Confetti />}

        {!isConnected && (
          <div className="space-y-3">
            <h2 className="text-base font-bold" style={{ color: ORANGE }}>
              Connect Your Wallet
            </h2>
            <p className="text-xs text-muted-foreground">
              Supported: MetaMask, WalletConnect, Trust Wallet
            </p>
            <span
              className="inline-block rounded-full border px-2.5 py-1 text-[11px] font-semibold"
              style={{ color: ORANGE, borderColor: ORANGE }}
            >
              Robinhood Chain
            </span>
            <button
              onClick={connect}
              className="w-full rounded-xl py-3 text-sm font-bold text-white"
              style={{ background: ORANGE }}
            >
              🔗 Connect Wallet
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              One-time registration required
            </p>
          </div>
        )}

        {isConnected && !registered && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4" style={{ color: GREEN }} aria-hidden="true" />
              <h2 className="text-sm font-bold">Wallet Connected</h2>
            </div>
            <code className="block text-xs text-foreground">{shorten(address!)}</code>
            <p className="text-xs text-muted-foreground">
              Balance:{" "}
              <span className="font-semibold text-foreground">
                {balance.toFixed(4)} ETH
              </span>
            </p>
            {hasBalance ? (
              <p className="text-xs font-semibold" style={{ color: GREEN }}>
                ✓ Sufficient balance
              </p>
            ) : (
              <p className="text-xs font-semibold" style={{ color: ORANGE }}>
                ⚠ Insufficient balance
              </p>
            )}
            <button
              onClick={register}
              disabled={!hasBalance}
              className="w-full rounded-xl py-3 text-sm font-bold text-white disabled:cursor-not-allowed"
              style={{ background: hasBalance ? ORANGE : "#555555" }}
            >
              Register Now
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              {hasBalance
                ? "0.001 ETH • One-time fee"
                : "You need at least 0.001 ETH"}
            </p>
          </div>
        )}

        {registered && (
          <div className="space-y-2 text-center">
            <div style={{ fontSize: 48, lineHeight: 1 }}>✅</div>
            <h2 className="text-base font-bold" style={{ color: GREEN }}>
              You are Airdrop Eligible!
            </h2>
            <p className="text-xs text-muted-foreground">
              Wallet: <code className="text-foreground">{shorten(address ?? MOCK_ADDRESS)}</code>
            </p>
            <p className="text-xs text-muted-foreground">Registered on: {date}</p>
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="glass rounded-2xl p-4">
        <h2 className="mb-3 text-sm font-bold">FAQ</h2>
        <ul className="flex flex-col gap-2">
          {FAQ.map((item, i) => {
            const open = openFaq === i;
            return (
              <li
                key={item.q}
                className="rounded-xl border border-border bg-secondary/40"
              >
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-xs font-semibold"
                >
                  {item.q}
                  <ChevronDown
                    className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {open && (
                  <p className="px-3 pb-3 text-xs text-muted-foreground">{item.a}</p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Hidden test helper */}
      <button
        onClick={testRegistration}
        className="mx-auto text-[10px] text-transparent select-none"
        aria-label="Test registration"
      >
        Test Registration
      </button>

      {/* Bottom sheet modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setModal(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl p-5"
            style={{
              background: "#0d0d0d",
              border: `1px solid ${ORANGE}`,
              boxShadow: "0 -8px 32px rgba(255,122,24,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center gap-2">
              <Wallet className="size-5" style={{ color: ORANGE }} aria-hidden="true" />
              <h2 className="text-base font-bold" style={{ color: ORANGE }}>
                Connect Wallet
              </h2>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Wallet connection with smart contract is being finalized. Coming very
              soon!
            </p>
            <ul className="mb-4 flex flex-col gap-2">
              {WALLETS.map((w) => (
                <li
                  key={w}
                  className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-colors hover:bg-secondary/70"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <span aria-hidden="true">{WALLET_ICONS[w]}</span> {w}
                  </span>
                  <span
                    className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                    style={{ color: ORANGE, borderColor: ORANGE }}
                  >
                    Coming soon
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setModal(false)}
              className="w-full rounded-xl border border-border py-2.5 text-sm font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
