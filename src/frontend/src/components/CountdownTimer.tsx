import { useCountdown } from "../hooks/useCountdown";

interface CountdownTimerProps {
  className?: string;
  compact?: boolean;
}

export function CountdownTimer({
  className = "",
  compact = false,
}: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isLive } = useCountdown();

  if (isLive) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/20 border border-primary/40 text-primary font-display font-semibold text-sm animate-pulse-glow">
          <span className="w-2 h-2 rounded-full bg-primary inline-block" />
          Launch is Live!
        </span>
      </div>
    );
  }

  const units = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Mins", value: minutes },
    { label: "Secs", value: seconds },
  ];

  if (compact) {
    return (
      <div
        className={`flex items-center gap-3 ${className}`}
        aria-label="Countdown to launch"
      >
        {units.map(({ label, value }, i) => (
          <div key={label} className="flex items-center gap-1">
            <span className="font-display font-bold text-foreground tabular-nums text-lg">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-muted-foreground text-xs">{label}</span>
            {i < 3 && <span className="text-primary font-bold ml-1">:</span>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${className}`} aria-label="Countdown to launch">
      {units.map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center bg-card/60 border border-border/50 rounded-xl px-4 py-3 min-w-[70px] backdrop-blur-sm"
        >
          <span className="font-display font-bold text-foreground tabular-nums text-3xl leading-none">
            {String(value).padStart(2, "0")}
          </span>
          <span className="text-muted-foreground text-xs mt-1 uppercase tracking-wider">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
