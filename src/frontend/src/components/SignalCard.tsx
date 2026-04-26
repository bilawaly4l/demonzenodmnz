import { Card } from "@/components/ui/card";
import {
  Calendar,
  Download,
  Maximize2,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
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

// Export signal as branded PNG with confetti burst
function exportSignalCard(signal: Signal) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 440;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background
  ctx.fillStyle = "#0e0f14";
  ctx.fillRect(0, 0, 640, 440);

  // Gradient top bar
  const grad = ctx.createLinearGradient(0, 0, 640, 0);
  grad.addColorStop(0, "oklch(0.65 0.15 190 / 1)");
  grad.addColorStop(1, "oklch(0.5 0.18 210 / 1)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 7);

  // Red bottom bar accent
  ctx.fillStyle = "#7f1d1d";
  ctx.fillRect(0, 433, 640, 7);

  // Brand
  ctx.font = "bold 26px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText("Demon", 28, 50);
  ctx.fillStyle = "#2dd4bf";
  ctx.fillText("Zeno", 112, 50);
  ctx.font = "12px 'DM Sans', sans-serif";
  ctx.fillStyle = "#6b7280";
  ctx.fillText("Trading Signal", 28, 68);

  // Direction badge
  ctx.font = "bold 13px 'DM Sans', sans-serif";
  ctx.fillStyle = signal.direction === "Buy" ? "#22c55e" : "#ef4444";
  ctx.fillText(signal.direction === "Buy" ? "▲ BUY" : "▼ SELL", 560, 50);

  // Asset
  ctx.font = "bold 32px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#e2e8f0";
  ctx.fillText(signal.asset, 28, 115);

  // Confidence %
  const confPct = CONFIDENCE_PCT[signal.confidence];
  ctx.font = "bold 14px 'DM Sans', sans-serif";
  ctx.fillStyle =
    signal.confidence === Confidence.High
      ? "#4ade80"
      : signal.confidence === Confidence.Medium
        ? "#fbbf24"
        : "#94a3b8";
  ctx.fillText(`Confidence: ${confPct}%`, 28, 140);

  // Divider
  ctx.strokeStyle = "#1e2030";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(28, 156);
  ctx.lineTo(612, 156);
  ctx.stroke();

  // Price data
  const priceItems = [
    { label: "Entry", value: signal.entryPrice, color: "#e2e8f0" },
    { label: "TP1", value: signal.targetPrice, color: "#2dd4bf" },
    { label: "Stop Loss", value: signal.stopLoss, color: "#ef4444" },
  ];
  let px = 28;
  for (const item of priceItems) {
    ctx.font = "11px 'DM Sans', sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText(item.label, px, 185);
    ctx.font = "bold 18px 'JetBrains Mono', monospace";
    ctx.fillStyle = item.color;
    ctx.fillText(item.value, px, 210);
    px += 200;
  }

  // Timeframe + Market
  ctx.font = "12px 'DM Sans', sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText(
    `${signal.timeframe} · ${signal.marketType} · ${signal.datePosted}`,
    28,
    248,
  );

  // Notes
  if (signal.notes) {
    ctx.font = "13px 'DM Sans', sans-serif";
    ctx.fillStyle = "#64748b";
    const noteText =
      signal.notes.length > 80 ? `${signal.notes.slice(0, 80)}…` : signal.notes;
    ctx.fillText(noteText, 28, 280);
  }

  // QR placeholder (decorative)
  ctx.strokeStyle = "#1e2030";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(544, 280, 68, 68);
  ctx.font = "8px monospace";
  ctx.fillStyle = "#374151";
  ctx.fillText("DZ·QR", 556, 318);

  // Watermark
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.font = "bold 48px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#2dd4bf";
  ctx.translate(320, 360);
  ctx.rotate(-0.18);
  ctx.fillText("DemonZeno", -120, 0);
  ctx.restore();

  // Bottom brand text
  ctx.font = "italic bold 12px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#ef4444";
  ctx.globalAlpha = 0.9;
  ctx.textAlign = "right";
  ctx.fillText("DemonZeno · Master the Chaos", 612, 422);
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
  ctx.font = "11px monospace";
  ctx.fillStyle = "#374151";
  ctx.fillText(new Date().toLocaleString(), 28, 422);

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

// Confetti burst on export
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
    dot.style.cssText = `position:absolute;width:${size}px;height:${size}px;background:${color};border-radius:${Math.random() > 0.5 ? "50%" : "2px"};left:${x}%;top:-10px;transform:rotate(${Math.random() * 360}deg);animation:confettiFall ${duration}s ease-in forwards;animation-delay:${Math.random() * 0.5}s`;
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

export function SignalCard({
  signal,
  index,
  onClick,
  showExport = false,
}: SignalCardProps) {
  const isExpired = signal.result === ResultStatus.Expired;
  const [detailOpen, setDetailOpen] = useState(false);

  const handleExport = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      exportSignalCard(signal);
      triggerConfetti();
      toast.success("Signal card exported with DemonZeno watermark! 🎉");
    },
    [signal],
  );

  const handleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDetailOpen(true);
  }, []);

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
        {/* Hover shimmer */}
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
            {isExpired && (
              <span className="badge-expired text-xs line-through opacity-70">
                expired
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {directionBadge(signal.direction)}
            {resultBadge(signal.result)}
          </div>
        </div>

        {/* Main content: price grid + confidence gauge */}
        <div className="flex items-start gap-3">
          {/* Price grid */}
          <div className="grid grid-cols-3 gap-3 flex-1">
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
                <Target className="w-3 h-3" /> Target
              </span>
              <span className="font-mono font-semibold text-primary text-sm">
                {signal.targetPrice}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs flex items-center gap-1">
                <Shield className="w-3 h-3" /> Stop Loss
              </span>
              <span className="font-mono font-semibold text-destructive text-sm">
                {signal.stopLoss}
              </span>
            </div>
          </div>

          {/* Confidence gauge */}
          <ConfidenceGauge confidence={signal.confidence} />
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5">
          <span className={CONFIDENCE_CLASS[signal.confidence]}>
            {signal.confidence}
          </span>
          <span className={TIMEFRAME_CLASS[signal.timeframe]}>
            {TIMEFRAME_LABEL[signal.timeframe]}
          </span>
          {signal.sourceLabel && (
            <span className="label-source bg-muted/40 border border-border px-2 py-0.5 rounded-md text-xs text-muted-foreground">
              {signal.sourceLabel}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
          <span className="text-muted-foreground text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {relativeTime(signal.datePosted)}
          </span>
          <div className="flex items-center gap-1">
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
            <span className="text-primary text-xs font-medium flex items-center gap-1 ml-1">
              View →
            </span>
          </div>
        </div>
      </Card>

      {/* Full-screen detail modal */}
      {detailOpen && (
        <SignalDetailModal
          signal={signal}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </>
  );
}
