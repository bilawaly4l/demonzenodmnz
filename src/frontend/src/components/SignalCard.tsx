import { Card } from "@/components/ui/card";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Download,
  Maximize2,
  Shield,
  Target,
  ThumbsDown,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import { Confidence, ResultStatus, Timeframe } from "../backend.d";
import type { Direction, MarketType, Signal } from "../types";
import { SignalDetailModal } from "./SignalDetailModal";

interface SignalCardProps {
  signal: Signal;
  index: number;
  onClick?: (signal: Signal) => void;
  showExport?: boolean;
}

function directionBadge(direction: Direction) {
  return direction === "Buy" ? (
    <span className="badge-success flex items-center gap-0.5">
      <TrendingUp className="w-3 h-3" /> BUY
    </span>
  ) : (
    <span className="badge-danger flex items-center gap-0.5">
      <TrendingDown className="w-3 h-3" /> SELL
    </span>
  );
}

function resultBadge(result: ResultStatus) {
  if (result === ResultStatus.Win)
    return <span className="badge-success">WIN</span>;
  if (result === ResultStatus.Loss)
    return <span className="badge-danger">LOSS</span>;
  if (result === ResultStatus.Expired)
    return <span className="badge-expired">EXPIRED</span>;
  return <span className="badge-info">ACTIVE</span>;
}

function marketLabel(market: MarketType) {
  const colors: Record<string, string> = {
    Crypto: "text-primary bg-primary/10 border-primary/20",
    Forex: "text-chart-3 bg-chart-3/10 border-chart-3/20",
    Stock: "text-chart-5 bg-chart-5/10 border-chart-5/20",
  };
  const cls = colors[market] ?? "text-muted-foreground bg-muted";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${cls}`}>
      {market.toUpperCase()}
    </span>
  );
}

const CONFIDENCE_CLASS: Record<Confidence, string> = {
  [Confidence.Low]: "badge-confidence-low",
  [Confidence.Medium]: "badge-confidence-medium",
  [Confidence.High]: "badge-confidence-high",
};

const TIMEFRAME_CLASS: Record<Timeframe, string> = {
  [Timeframe.Scalp]: "badge-timeframe-scalp",
  [Timeframe.Swing]: "badge-timeframe-swing",
  [Timeframe.LongTerm]: "badge-timeframe-longterm",
};

const TIMEFRAME_LABEL: Record<Timeframe, string> = {
  [Timeframe.Scalp]: "Scalp",
  [Timeframe.Swing]: "Swing",
  [Timeframe.LongTerm]: "Long-term",
};

const CONFIDENCE_PCT: Record<Confidence, number> = {
  [Confidence.Low]: 35,
  [Confidence.Medium]: 65,
  [Confidence.High]: 88,
};

function relativeTime(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Circular confidence gauge SVG
function ConfidenceGauge({ confidence }: { confidence: Confidence }) {
  const pct = CONFIDENCE_PCT[confidence];
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const stroke = (pct / 100) * circumference;
  const color =
    confidence === Confidence.High
      ? "oklch(0.7 0.18 145)"
      : confidence === Confidence.Medium
        ? "oklch(0.65 0.14 70)"
        : "oklch(0.55 0.05 260)";

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
        <circle
          cx="21"
          cy="21"
          r={radius}
          fill="none"
          stroke="oklch(0.25 0.01 260)"
          strokeWidth="3"
        />
        <circle
          cx="21"
          cy="21"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${stroke} ${circumference}`}
          transform="rotate(-90 21 21)"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        <text
          x="21"
          y="25"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill={color}
        >
          {pct}%
        </text>
      </svg>
      <span className="text-[10px] text-muted-foreground">Conf.</span>
    </div>
  );
}

// Export signal as branded PNG with confetti
function exportSignalCard(signal: Signal) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#0e0f14";
  ctx.fillRect(0, 0, 640, 480);

  const grad = ctx.createLinearGradient(0, 0, 640, 0);
  grad.addColorStop(0, "#2dd4bf");
  grad.addColorStop(1, "#38bdf8");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 7);
  ctx.fillStyle = "#7f1d1d";
  ctx.fillRect(0, 473, 640, 7);

  ctx.font = "bold 26px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText("Demon", 28, 50);
  ctx.fillStyle = "#2dd4bf";
  ctx.fillText("Zeno", 112, 50);
  ctx.font = "12px 'DM Sans', sans-serif";
  ctx.fillStyle = "#6b7280";
  ctx.fillText("Trading Signal", 28, 68);

  ctx.font = "bold 13px 'DM Sans', sans-serif";
  ctx.fillStyle = signal.direction === "Buy" ? "#22c55e" : "#ef4444";
  ctx.fillText(signal.direction === "Buy" ? "▲ BUY" : "▼ SELL", 560, 50);

  ctx.font = "bold 32px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#e2e8f0";
  ctx.fillText(signal.asset, 28, 115);

  const confPct = CONFIDENCE_PCT[signal.confidence];
  ctx.font = "bold 14px 'DM Sans', sans-serif";
  ctx.fillStyle =
    signal.confidence === Confidence.High
      ? "#4ade80"
      : signal.confidence === Confidence.Medium
        ? "#fbbf24"
        : "#94a3b8";
  ctx.fillText(`Confidence: ${confPct}%`, 28, 140);

  if (signal.providerLabel) {
    ctx.font = "11px 'DM Sans', sans-serif";
    ctx.fillStyle = "#4b5563";
    ctx.fillText(`Provider: ${signal.providerLabel}`, 400, 140);
  }

  ctx.strokeStyle = "#1e2030";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(28, 156);
  ctx.lineTo(612, 156);
  ctx.stroke();

  // Price data: Entry, SL, TP1, TP2, TP3
  const priceItems = [
    { label: "Entry", value: signal.entryPrice, color: "#e2e8f0" },
    { label: "TP1", value: signal.tp1 || signal.targetPrice, color: "#2dd4bf" },
    { label: "TP2", value: signal.tp2, color: "#4ade80" },
    { label: "TP3", value: signal.tp3, color: "#86efac" },
    { label: "Stop Loss", value: signal.stopLoss, color: "#ef4444" },
  ];
  let py = 185;
  let col = 0;
  for (const item of priceItems) {
    const px = 28 + col * 124;
    ctx.font = "11px 'DM Sans', sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText(item.label, px, py);
    ctx.font = "bold 15px 'JetBrains Mono', monospace";
    ctx.fillStyle = item.color;
    ctx.fillText(item.value || "—", px, py + 20);
    col++;
  }

  ctx.font = "12px 'DM Sans', sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText(
    `${signal.timeframe} · ${signal.marketType} · ${signal.datePosted}`,
    28,
    248,
  );

  if (signal.notes) {
    ctx.font = "13px 'DM Sans', sans-serif";
    ctx.fillStyle = "#64748b";
    const note =
      signal.notes.length > 80 ? `${signal.notes.slice(0, 80)}…` : signal.notes;
    ctx.fillText(note, 28, 280);
  }

  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.font = "bold 48px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#2dd4bf";
  ctx.translate(320, 380);
  ctx.rotate(-0.18);
  ctx.fillText("DemonZeno", -120, 0);
  ctx.restore();

  ctx.font = "italic bold 12px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#ef4444";
  ctx.globalAlpha = 0.9;
  ctx.textAlign = "right";
  ctx.fillText("DemonZeno · Master the Chaos", 612, 462);
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
  ctx.font = "11px monospace";
  ctx.fillStyle = "#374151";
  ctx.fillText(new Date().toLocaleString(), 28, 462);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `demonzeno-${signal.asset.replace("/", "-")}-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

function triggerConfetti() {
  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden";
  document.body.appendChild(container);
  const colors = ["#38bdf8", "#2dd4bf", "#ef4444", "#22c55e", "#fbbf24"];
  for (let i = 0; i < 60; i++) {
    const dot = document.createElement("div");
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 4;
    const x = Math.random() * 100;
    const duration = Math.random() * 1.5 + 1;
    dot.style.cssText = `position:absolute;width:${size}px;height:${size}px;background:${color};border-radius:${Math.random() > 0.5 ? "50%" : "2px"};left:${x}%;top:-10px;animation:confettiFall ${duration}s ease-in forwards;animation-delay:${Math.random() * 0.5}s`;
    container.appendChild(dot);
  }
  const style = document.createElement("style");
  style.textContent =
    "@keyframes confettiFall{from{transform:translateY(-20px) rotate(0deg);opacity:1}to{transform:translateY(110vh) rotate(720deg);opacity:0}}";
  document.head.appendChild(style);
  setTimeout(() => {
    container.remove();
    style.remove();
  }, 3000);
}

// Voting
function useVoteSignal() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      direction,
    }: { id: string; direction: "up" | "down" }) => {
      if (!actor) throw new Error("Not connected");
      return actor.voteOnSignal(id, direction === "up" ? "Up" : "Down");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["signals"] });
    },
  });
}

export function SignalCard({
  signal,
  index,
  onClick,
  showExport = false,
}: SignalCardProps) {
  const isExpired = signal.result === ResultStatus.Expired;
  const [detailOpen, setDetailOpen] = useState(false);
  const voteSignal = useVoteSignal();

  const handleExport = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      exportSignalCard(signal);
      triggerConfetti();
      toast.success("Signal exported with DemonZeno watermark! 🎉");
      // Haptic feedback on mobile
      if (navigator.vibrate) navigator.vibrate(50);
    },
    [signal],
  );

  const handleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDetailOpen(true);
  }, []);

  function handleVote(e: React.MouseEvent, direction: "up" | "down") {
    e.stopPropagation();
    voteSignal.mutate({ id: signal.id, direction });
    if (navigator.vibrate) navigator.vibrate(30);
  }

  return (
    <>
      <Card
        data-ocid={`signals.item.${index}`}
        onClick={() => {
          if (onClick) onClick(signal);
          else setDetailOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            if (onClick) onClick(signal);
            else setDetailOpen(true);
          }
        }}
        tabIndex={0}
        aria-label={`Open signal detail for ${signal.asset}`}
        className={`group bg-card border-border hover:border-primary/50 transition-smooth card-elevated p-5 flex flex-col gap-4 cursor-pointer relative overflow-hidden ${isExpired ? "opacity-70" : ""}`}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.65 0.15 190 / 0.03) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />

        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {marketLabel(signal.marketType)}
            <span className="font-display font-bold text-foreground text-lg leading-tight">
              {signal.asset}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {directionBadge(signal.direction)}
            {resultBadge(signal.result)}
          </div>
        </div>

        {/* Main content: price grid + confidence gauge */}
        <div className="flex items-start gap-3">
          <div className="grid grid-cols-3 gap-2 flex-1">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Entry
              </span>
              <span className="font-mono font-semibold text-foreground text-sm">
                {signal.entryPrice}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs flex items-center gap-1">
                <Target className="w-3 h-3" /> TP1
              </span>
              <span className="font-mono font-semibold text-primary text-sm">
                {signal.tp1 || signal.targetPrice}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs flex items-center gap-1">
                <Shield className="w-3 h-3" /> SL
              </span>
              <span className="font-mono font-semibold text-destructive text-sm">
                {signal.stopLoss}
              </span>
            </div>
          </div>
          <ConfidenceGauge confidence={signal.confidence} />
        </div>

        {/* TP2 + TP3 row */}
        {(signal.tp2 || signal.tp3) && (
          <div className="grid grid-cols-2 gap-2">
            {signal.tp2 && (
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
                  TP2
                </span>
                <span className="font-mono font-semibold text-primary/80 text-sm">
                  {signal.tp2}
                </span>
              </div>
            )}
            {signal.tp3 && (
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
                  TP3
                </span>
                <span className="font-mono font-semibold text-primary/60 text-sm">
                  {signal.tp3}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5">
          <span className={CONFIDENCE_CLASS[signal.confidence]}>
            {signal.confidence}
          </span>
          <span className={TIMEFRAME_CLASS[signal.timeframe]}>
            {TIMEFRAME_LABEL[signal.timeframe]}
          </span>
          {signal.providerLabel && (
            <span className="label-source bg-primary/5 border border-primary/15 px-2 py-0.5 rounded-md text-[10px] text-primary/70 font-medium">
              {signal.providerLabel}
            </span>
          )}
        </div>

        {/* Footer: date + votes + actions */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
          <span className="text-muted-foreground text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {relativeTime(signal.datePosted)}
          </span>
          <div className="flex items-center gap-1.5">
            {/* Vote buttons */}
            <button
              type="button"
              data-ocid={`signals.vote_up.${index}`}
              onClick={(e) => handleVote(e, "up")}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs text-muted-foreground hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
              aria-label="Vote up"
            >
              <ThumbsUp className="w-3 h-3" />
              <span>{Number(signal.voteUp)}</span>
            </button>
            <button
              type="button"
              data-ocid={`signals.vote_down.${index}`}
              onClick={(e) => handleVote(e, "down")}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              aria-label="Vote down"
            >
              <ThumbsDown className="w-3 h-3" />
              <span>{Number(signal.voteDown)}</span>
            </button>
            {showExport && (
              <button
                type="button"
                data-ocid={`signals.export_button.${index}`}
                onClick={handleExport}
                className="p-1 rounded text-muted-foreground hover:text-primary transition-colors"
                aria-label="Export signal card"
                title="Export as branded PNG"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              data-ocid={`signals.expand_button.${index}`}
              onClick={handleExpand}
              className="p-1 rounded text-muted-foreground hover:text-primary transition-colors"
              aria-label="View full signal detail"
              title="Full-screen detail"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Card>

      {detailOpen && (
        <SignalDetailModal
          signal={signal}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </>
  );
}
