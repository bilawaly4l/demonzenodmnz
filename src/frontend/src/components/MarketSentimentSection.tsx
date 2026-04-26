import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SentimentLevel as SentimentLevelEnum } from "../backend";
import { useMarketPrices } from "../hooks/useMarketPrices";
import { useMarketSentiment } from "../hooks/useMarketSentiment";
import type { AssetSentiment, PriceData, SentimentLevel } from "../types";
import { ScrollAnimation } from "./ScrollAnimation";

const SENTIMENT_CONFIG: Record<
  SentimentLevel,
  { label: string; color: string; bg: string; glow: string }
> = {
  [SentimentLevelEnum.Bullish]: {
    label: "Bullish",
    color: "oklch(0.7 0.18 145)",
    bg: "oklch(0.7 0.18 145 / 0.12)",
    glow: "oklch(0.7 0.18 145 / 0.25)",
  },
  [SentimentLevelEnum.Neutral]: {
    label: "Neutral",
    color: "oklch(0.75 0.15 70)",
    bg: "oklch(0.75 0.15 70 / 0.12)",
    glow: "oklch(0.75 0.15 70 / 0.2)",
  },
  [SentimentLevelEnum.Bearish]: {
    label: "Bearish",
    color: "oklch(0.65 0.2 22)",
    bg: "oklch(0.65 0.2 22 / 0.12)",
    glow: "oklch(0.65 0.2 22 / 0.2)",
  },
};

const ASSET_ICONS: Record<string, string> = {
  BTC: "₿",
  ETH: "Ξ",
  BNB: "B",
  SOL: "◎",
  XRP: "✕",
  DOGE: "Ð",
};

function SentimentBadge({ level }: { level: SentimentLevel }) {
  const cfg = SENTIMENT_CONFIG[level];
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

function TrendArrow({ trend }: { trend: string }) {
  if (trend === "up")
    return <span className="text-green-400 font-bold">↑</span>;
  if (trend === "down")
    return <span className="text-red-400 font-bold">↓</span>;
  return <span className="text-muted-foreground font-bold">→</span>;
}

function PriceChangeLabel({ change }: { change: number }) {
  const isPos = change >= 0;
  const color = isPos ? "text-green-400" : "text-red-400";
  const sign = isPos ? "+" : "";
  return (
    <span className={`text-xs font-mono font-semibold ${color}`}>
      {sign}
      {change.toFixed(2)}%
    </span>
  );
}

// CSS-animated inline chart — no external libraries
function InlineSparkChart({
  change,
  color,
}: {
  change: number;
  color: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Generate synthetic price path based on change direction
    const points: number[] = [];
    const n = 20;
    let val = 0.5;
    for (let i = 0; i < n; i++) {
      val += (Math.random() - 0.48) * 0.06 + (change > 0 ? 0.008 : -0.008);
      val = Math.max(0.1, Math.min(0.9, val));
      points.push(val);
    }

    const minV = Math.min(...points);
    const maxV = Math.max(...points);
    const range = maxV - minV || 0.1;

    ctx.beginPath();
    points.forEach((v, i) => {
      const x = (i / (n - 1)) * W;
      const y = H - ((v - minV) / range) * (H * 0.8) - H * 0.1;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Fill
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, `${color}33`);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.closePath();
  }, [change, color]);

  return <canvas ref={canvasRef} width={120} height={40} className="w-full" />;
}

function AnimatedPrice({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);
  const [highlight, setHighlight] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (value !== prev.current) {
      setHighlight(true);
      prev.current = value;
      setTimeout(() => {
        setDisplayed(value);
        setTimeout(() => setHighlight(false), 400);
      }, 50);
    }
  }, [value]);

  const fmt =
    displayed >= 1000
      ? displayed.toLocaleString("en-US", { maximumFractionDigits: 0 })
      : displayed.toFixed(displayed < 1 ? 5 : 2);

  return (
    <p
      className="font-mono font-bold text-lg transition-all duration-300"
      style={{
        color: highlight ? "oklch(0.92 0.2 155)" : "oklch(0.72 0.18 195)",
        transform: highlight ? "scale(1.04)" : "scale(1)",
      }}
    >
      ${fmt}
    </p>
  );
}

function AssetCard({
  asset,
  priceData,
}: {
  asset: AssetSentiment;
  priceData: PriceData | undefined;
}) {
  const cfg = SENTIMENT_CONFIG[asset.level];
  const [expanded, setExpanded] = useState(false);

  const updatedTime = asset.updatedAt
    ? new Date(Number(asset.updatedAt) / 1_000_000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const price = priceData?.price ?? asset.price ?? 0;
  const change24h = priceData?.priceChange24h ?? asset.priceChange24h ?? 0;
  const trend = priceData?.trend ?? asset.trend ?? "flat";
  const chartColor =
    change24h >= 0 ? "oklch(0.7 0.18 145)" : "oklch(0.65 0.22 25)";

  return (
    <div
      className="bg-card border rounded-2xl flex flex-col card-elevated transition-smooth hover:scale-[1.01]"
      style={{ borderColor: cfg.glow }}
    >
      <div className="p-5 flex flex-col gap-3">
        {/* Asset icon + name + badge */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg shrink-0"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {ASSET_ICONS[asset.asset] ?? asset.asset[0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <p className="font-display font-bold text-foreground">
                {asset.asset}
              </p>
              <SentimentBadge level={asset.level} />
            </div>
          </div>
        </div>

        {/* Price row with animation */}
        {price > 0 ? (
          <div className="flex items-center gap-2">
            <AnimatedPrice value={price} />
            <PriceChangeLabel change={change24h} />
            <TrendArrow trend={trend} />
          </div>
        ) : null}

        {/* Admin note */}
        {asset.note && (
          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
            {asset.note}
          </p>
        )}

        {/* Expand chart button */}
        <button
          type="button"
          data-ocid={`market_sentiment.${asset.asset.toLowerCase()}.chart_toggle`}
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-smooth mt-1 w-fit"
        >
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
          {expanded ? "Hide" : "Show"} chart
        </button>
      </div>

      {/* Expandable chart */}
      {expanded && price > 0 && (
        <div
          className="px-4 pb-4 pt-1 border-t"
          style={{ borderColor: `${cfg.glow}66` }}
        >
          <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">
            24h Price Movement (Simulated)
          </p>
          <InlineSparkChart change={change24h} color={chartColor} />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>24h ago</span>
            <span>Now</span>
          </div>
        </div>
      )}

      {/* Updated time */}
      {updatedTime && (
        <p className="text-xs text-muted-foreground/60 px-5 pb-3 mt-auto">
          Updated {updatedTime}
        </p>
      )}
    </div>
  );
}

function OverallSentimentBadge({ level }: { level: SentimentLevel }) {
  const cfg = SENTIMENT_CONFIG[level];
  return (
    <div
      className="inline-flex items-center gap-3 rounded-full px-8 py-4 mx-auto"
      style={{
        background: cfg.bg,
        boxShadow: `0 0 40px ${cfg.glow}`,
        border: `1px solid ${cfg.glow}`,
      }}
    >
      <span
        className="w-3 h-3 rounded-full animate-pulse"
        style={{ background: cfg.color }}
      />
      <span
        className="font-display font-bold text-2xl uppercase tracking-widest"
        style={{ color: cfg.color }}
      >
        {cfg.label}
      </span>
    </div>
  );
}

// 60s refresh countdown
function RefreshCountdown({ lastUpdated }: { lastUpdated: number }) {
  const [secs, setSecs] = useState(60);
  useEffect(() => {
    if (!lastUpdated) return;
    const nextRefresh = lastUpdated + 60_000;
    function tick() {
      const remaining = Math.max(
        0,
        Math.ceil((nextRefresh - Date.now()) / 1000),
      );
      setSecs(remaining);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  return (
    <p className="text-center text-xs text-muted-foreground mt-6">
      {secs > 0 ? `Refreshing in ${secs}s` : "Refreshing…"}
    </p>
  );
}

export function MarketSentimentSection() {
  const { data: sentiment, isLoading: sentLoading } = useMarketSentiment();
  const { prices, isLoading: pricesLoading, lastUpdated } = useMarketPrices();
  const isLoading = sentLoading || pricesLoading;

  const priceMap: Record<string, PriceData> = {};
  for (const p of prices) {
    priceMap[p.asset] = p;
  }

  return (
    <section
      id="market-sentiment"
      data-ocid="market_sentiment.section"
      className="py-24 bg-background relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 0%, oklch(0.65 0.15 190 / 0.04), transparent)",
        }}
      />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <ScrollAnimation>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-3 block">
              Sentiment
            </span>
          </ScrollAnimation>
          <ScrollAnimation delay={80}>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground">
              Live Market Sentiment
            </h2>
          </ScrollAnimation>
          <ScrollAnimation delay={140}>
            <p className="text-muted-foreground mt-3 text-base">
              Real-time prices and admin-updated sentiment indicators — click
              any asset to expand its chart.
            </p>
          </ScrollAnimation>
        </div>

        {/* Overall sentiment */}
        <ScrollAnimation delay={180}>
          <div className="flex justify-center mb-12">
            {isLoading ? (
              <Skeleton className="h-16 w-56 rounded-full" />
            ) : sentiment ? (
              <OverallSentimentBadge level={sentiment.overall} />
            ) : (
              <div
                className="inline-flex items-center gap-3 rounded-full px-8 py-4 border border-border"
                data-ocid="market_sentiment.overall.empty_state"
              >
                <span className="text-muted-foreground text-sm">
                  No sentiment data yet — admin will update soon.
                </span>
              </div>
            )}
          </div>
        </ScrollAnimation>

        {/* Asset grid */}
        {isLoading ? (
          <div
            data-ocid="market_sentiment.loading_state"
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {["a", "b", "c", "d", "e", "f"].map((k) => (
              <div
                key={k}
                className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : sentiment && sentiment.assets.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sentiment.assets.map((asset, i) => (
              <ScrollAnimation key={asset.asset} delay={i * 70}>
                <AssetCard asset={asset} priceData={priceMap[asset.asset]} />
              </ScrollAnimation>
            ))}
          </div>
        ) : (
          <div
            data-ocid="market_sentiment.assets.empty_state"
            className="flex flex-col items-center gap-4 py-16 text-center"
          >
            <div className="text-4xl">📊</div>
            <p className="font-display font-semibold text-foreground text-xl">
              Sentiment data loading…
            </p>
            <p className="text-muted-foreground text-sm max-w-sm">
              The admin updates market sentiment indicators manually. Check back
              shortly.
            </p>
          </div>
        )}

        {/* Last updated + refresh countdown */}
        {sentiment && (
          <ScrollAnimation delay={100}>
            <p className="text-center text-xs text-muted-foreground mt-6">
              Sentiment last updated:{" "}
              {new Date(
                Number(sentiment.updatedAt) / 1_000_000,
              ).toLocaleString()}
            </p>
          </ScrollAnimation>
        )}
        {lastUpdated ? <RefreshCountdown lastUpdated={lastUpdated} /> : null}
      </div>
    </section>
  );
}
