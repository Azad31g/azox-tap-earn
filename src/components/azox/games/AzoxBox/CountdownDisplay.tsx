export function CountdownDisplay({
  label,
  seconds,
  className,
}: {
  label?: string;
  seconds: number;
  className?: string;
}) {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const text = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  return (
    <div className={className}>
      {label ? (
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      ) : null}
      <p className="font-mono text-4xl font-extrabold text-primary tabular-nums drop-shadow-[0_0_12px_rgba(97,209,32,0.6)]">
        {text}
      </p>
    </div>
  );
}

export default CountdownDisplay;
