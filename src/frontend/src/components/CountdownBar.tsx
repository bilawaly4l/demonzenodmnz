import { useEffect, useState } from "react";
import { SiBinance } from "react-icons/si";

const LAUNCH_DATE = new Date("2027-04-02T00:00:00Z");

function getTimeLeft() {
  const now = Date.now();
  const diff = LAUNCH_DATE.getTime() - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function CountdownBar() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      data-ocid="countdown_bar.panel"
      className="w-full flex items-center justify-between px-4"
      style={{
        height: "38px",
        background: "#0a0a0a",
        borderBottom: "1px solid var(--primary)",
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      {/* Left label */}
      <span
        className="hidden sm:block text-xs font-bold uppercase tracking-widest"
        style={{
          color: "var(--primary)",
          letterSpacing: "0.14em",
          whiteSpace: "nowrap",
        }}
      >
        DMNZ LAUNCHES ON BLUM
      </span>
      <span
        className="sm:hidden text-xs font-bold uppercase tracking-widest"
        style={{ color: "var(--primary)", letterSpacing: "0.12em" }}
      >
        DMNZ
      </span>

      {/* Center countdown */}
      <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
        {timeLeft ? (
          <>
            <span className="flex items-center gap-0.5">
              <span
                className="tabular-nums"
                style={{ color: "var(--foreground)" }}
              >
                {pad(timeLeft.days)}
              </span>
              <span style={{ color: "var(--muted-foreground)" }}>D</span>
            </span>
            <span style={{ color: "var(--muted-foreground)" }}>:</span>
            <span className="flex items-center gap-0.5">
              <span
                className="tabular-nums"
                style={{ color: "var(--foreground)" }}
              >
                {pad(timeLeft.hours)}
              </span>
              <span style={{ color: "var(--muted-foreground)" }}>H</span>
            </span>
            <span style={{ color: "var(--muted-foreground)" }}>:</span>
            <span className="flex items-center gap-0.5">
              <span
                className="tabular-nums"
                style={{ color: "var(--foreground)" }}
              >
                {pad(timeLeft.minutes)}
              </span>
              <span style={{ color: "var(--muted-foreground)" }}>M</span>
            </span>
            <span style={{ color: "var(--muted-foreground)" }}>:</span>
            <span className="flex items-center gap-0.5">
              <span
                className="tabular-nums"
                style={{ color: "var(--primary)" }}
              >
                {pad(timeLeft.seconds)}
              </span>
              <span style={{ color: "var(--muted-foreground)" }}>S</span>
            </span>
          </>
        ) : (
          <span
            className="uppercase tracking-widest font-bold"
            style={{ color: "var(--primary)" }}
          >
            DMNZ IS LIVE ON BLUM
          </span>
        )}
      </div>

      {/* Right CTA */}
      <a
        href="https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink"
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="countdown_bar.follow.link"
        className="hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-smooth"
        style={{
          color: "var(--muted-foreground)",
          letterSpacing: "0.1em",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = "var(--primary)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color =
            "var(--muted-foreground)";
        }}
      >
        <SiBinance className="w-3 h-3" />
        FOLLOW @Demon_Zeno
      </a>
    </div>
  );
}
