import { Button } from "@/components/ui/button";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  Download,
  ExternalLink,
  Shield,
  Target,
  ThumbsDown,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import { Confidence, ResultStatus, Timeframe } from "../backend.d";
import type { Signal } from "../types";

interface SignalDetailModalProps {
  signal: Signal;
  onClose: () => void;
}

const CONFIDENCE_CLASSES: Record<Confidence, string> = {
  [Confidence.Low]: "badge-confidence-low",
  [Confidence.Medium]: "badge-confidence-medium",
  [Confidence.High]: "badge-confidence-high",
};

const TIMEFRAME_LABEL: Record<Timeframe, string> = {
  [Timeframe.Scalp]: "Scalp",
  [Timeframe.Swing]: "Swing",
  [Timeframe.LongTerm]: "Long-term",
};

const TIMEFRAME_CLASSES: Record<Timeframe, string> = {
  [Timeframe.Scalp]: "badge-timeframe-scalp",
  [Timeframe.Swing]: "badge-timeframe-swing",
  [Timeframe.LongTerm]: "badge-timeframe-longterm",
};

const CONFIDENCE_PCT: Record<Confidence, number> = {
  [Confidence.Low]: 35,
  [Confidence.Medium]: 65,
  [Confidence.High]: 88,
};

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatExpiry(expiry: bigint | undefined): string {
  if (expiry == null) return "No expiry";
  try {
    const ms = Number(expiry) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function resultBadge(result: ResultStatus) {
  if (result === ResultStatus.Win)
    return (
      <span className="badge-success px-3 py-1.5 rounded-lg text-sm font-semibold">
        ✓ WIN
      </span>
    );
  if (result === ResultStatus.Loss)
    return (
      <span className="badge-danger px-3 py-1.5 rounded-lg text-sm font-semibold">
        ✗ LOSS
      </span>
    );
  if (result === ResultStatus.Expired)
    return (
      <span className="badge-expired px-3 py-1.5 rounded-lg text-sm font-semibold">
        EXPIRED
      </span>
    );
  return (
    <span className="badge-info px-3 py-1.5 rounded-lg text-sm font-semibold">
      ● ACTIVE
    </span>
  );
}

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
    onSuccess: () => qc.invalidateQueries({ queryKey: ["signals"] }),
  });
}

function ConfidenceBar({ confidence }: { confidence: Confidence }) {
  const pct = CONFIDENCE_PCT[confidence];
  const color =
    confidence === Confidence.High
      ? "oklch(0.7 0.18 145)"
      : confidence === Confidence.Medium
        ? "oklch(0.65 0.14 70)"
        : "oklch(0.55 0.05 260)";
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">AI Confidence</span>
        <span className="font-bold" style={{ color }}>
          {pct}%
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function SignalDetailModal({ signal, onClose }: SignalDetailModalProps) {
  const voteSignal = useVoteSignal();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleVote = useCallback(
    (direction: "up" | "down") => {
      voteSignal.mutate({ id: signal.id, direction });
      toast.success(direction === "up" ? "Voted up! 👍" : "Voted down! 👎");
      if (navigator.vibrate) navigator.vibrate(30);
    },
    [signal.id, voteSignal],
  );

  const tweetText = encodeURIComponent(
    `🚀 ${signal.direction.toUpperCase()} Signal: ${signal.asset} | Entry: ${signal.entryPrice} | TP1: ${signal.tp1 || signal.targetPrice} | SL: ${signal.stopLoss} via @DemonZeno #Binance #Trading`,
  );
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
  const isExpired = signal.result === ResultStatus.Expired;

  // Build price levels list
  const priceLevels = [
    {
      icon: <TrendingUp className="w-4 h-4" />,
      label: "Entry",
      value: signal.entryPrice,
      cls: "text-foreground",
    },
    {
      icon: <Target className="w-4 h-4" />,
      label: "TP1",
      value: signal.tp1 || signal.targetPrice,
      cls: "text-primary",
    },
    {
      icon: <Target className="w-4 h-4" />,
      label: "TP2",
      value: signal.tp2,
      cls: "text-primary/80",
    },
    {
      icon: <Target className="w-4 h-4" />,
      label: "TP3",
      value: signal.tp3,
      cls: "text-primary/60",
    },
    {
      icon: <Shield className="w-4 h-4" />,
      label: "Stop Loss",
      value: signal.stopLoss,
      cls: "text-destructive",
    },
  ].filter((p) => p.value);

  return (
    <dialog
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent w-full h-full max-w-none max-h-none m-0 p-4"
      aria-label={`Signal detail: ${signal.asset}`}
      data-ocid="signal_detail.dialog"
      open
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
      />

      <div
        className={`relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col ${isExpired ? "opacity-80" : ""}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-6 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                  signal.marketType === "Crypto"
                    ? "text-primary bg-primary/10 border-primary/20"
                    : signal.marketType === "Forex"
                      ? "text-chart-3 bg-chart-3/10 border-chart-3/20"
                      : "text-chart-5 bg-chart-5/10 border-chart-5/20"
                }`}
              >
                {signal.marketType.toUpperCase()}
              </span>
              {signal.providerLabel && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/5 border border-primary/15 text-primary/70">
                  {signal.providerLabel}
                </span>
              )}
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground">
              {signal.asset}
            </h2>
          </div>
          <button
            type="button"
            data-ocid="signal_detail.close_button"
            onClick={onClose}
            aria-label="Close signal detail"
            className="shrink-0 w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-6">
          {/* Direction + Result */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              {signal.direction === "Buy" ? (
                <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/30 rounded-lg px-3 py-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="font-display font-bold text-primary text-lg">
                    BUY ↑
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                  <TrendingDown className="w-4 h-4 text-destructive" />
                  <span className="font-display font-bold text-destructive text-lg">
                    SELL ↓
                  </span>
                </div>
              )}
            </div>
            {resultBadge(signal.result)}
          </div>

          {/* Price levels grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {priceLevels.map(({ icon, label, value, cls }) => (
              <div
                key={label}
                className="bg-muted/40 border border-border rounded-xl p-3 flex flex-col gap-1.5"
              >
                <span className="text-muted-foreground text-xs flex items-center gap-1">
                  {icon} {label}
                </span>
                <span
                  className={`font-mono font-bold text-sm break-all ${cls}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Confidence bar */}
          <ConfidenceBar confidence={signal.confidence} />

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={CONFIDENCE_CLASSES[signal.confidence]}>
              {signal.confidence} Confidence
            </span>
            <span className={TIMEFRAME_CLASSES[signal.timeframe]}>
              {TIMEFRAME_LABEL[signal.timeframe]}
            </span>
            {signal.sourceLabel && (
              <span className="label-source bg-muted/40 border border-border px-2 py-1 rounded-md text-xs">
                {signal.sourceLabel}
              </span>
            )}
          </div>

          {/* Dates */}
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Posted: </span>
              <span className="text-foreground font-medium">
                {formatDate(signal.datePosted)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Expiry: </span>
              <span className="text-foreground font-medium">
                {formatExpiry(signal.expiry)}
              </span>
            </div>
          </div>

          {/* Notes */}
          {signal.notes && (
            <div className="bg-muted/30 border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">
                Notes
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {signal.notes}
              </p>
            </div>
          )}

          {/* Voting */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Rate this signal:
            </span>
            <button
              type="button"
              data-ocid="signal_detail.vote_up.button"
              onClick={() => handleVote("up")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 hover:bg-emerald-400/20 transition-smooth"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              {Number(signal.voteUp)}
            </button>
            <button
              type="button"
              data-ocid="signal_detail.vote_down.button"
              onClick={() => handleVote("down")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-destructive bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 transition-smooth"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              {Number(signal.voteDown)}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 border-t border-border mt-2 flex flex-wrap items-center gap-3">
          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="signal_detail.share.button"
            className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-primary/10 transition-smooth"
          >
            <ExternalLink className="w-4 h-4" />
            Share on X / Twitter
          </a>
          <Button
            variant="outline"
            data-ocid="signal_detail.cancel_button"
            onClick={onClose}
            className="border-border text-muted-foreground hover:text-foreground"
          >
            Close
          </Button>
        </div>
      </div>
    </dialog>
  );
}
