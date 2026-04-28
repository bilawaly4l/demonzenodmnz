import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Award,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  FileText,
  Globe,
  Lightbulb,
  Link2,
  LogOut,
  Menu,
  RotateCcw,
  Send,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import type { JournalEntry } from "../backend.d";
import { useAiSession } from "../contexts/AiSessionContext";
import { useSignalAccuracy } from "../contexts/SignalAccuracyContext";
import {
  type AiMessage,
  useInvalidateAiSession,
  useSendAiMessage,
} from "../hooks/useAiChat";

type AiMessageWithMeta = AiMessage & {
  signalId?: string;
  rating?: 1 | -1 | null;
  messageId?: string;
};

const LANGUAGE_LABELS: Record<string, string> = {
  en: "🇬🇧 EN",
  ar: "🇸🇦 AR",
  es: "🇪🇸 ES",
  zh: "🇨🇳 ZH",
};

const LANGUAGE_INSTRUCTION: Record<string, string> = {
  ar: " [Respond in Arabic only]",
  es: " [Respond in Spanish only]",
  zh: " [Respond in Chinese only]",
  en: "",
};

// --- Extract signal data from AI response ---
function extractSignalData(content: string) {
  if (
    !content.includes("📊 SIGNAL:") &&
    !content.toLowerCase().includes("entry:") &&
    !content.toLowerCase().includes("entry zone:")
  )
    return null;
  const lines = content.split("\n");
  const get = (keys: string[]) => {
    for (const key of keys) {
      const line = lines.find((l) =>
        l.toLowerCase().includes(key.toLowerCase()),
      );
      if (line) {
        const match = line.match(/:\s*(.+)/);
        if (match) return match[1].trim().replace(/\*\*/g, "");
      }
    }
    return "";
  };

  const asset =
    get(["📊 SIGNAL:", "SIGNAL:"]).replace(/\*\*/g, "").trim() || "";
  const entry = get(["Entry Zone:", "Entry:", "entry zone", "entry price"]);
  const tp1 = get(["TP1:", "tp1"]);
  const tp2 = get(["TP2:", "tp2"]);
  const tp3 = get(["TP3:", "tp3"]);
  const sl = get(["Stop Loss:", "SL:", "stop loss"]);
  const timeframe = get(["Timeframe:", "timeframe"]);
  const confidenceStr = get(["Confidence:", "confidence"]).toLowerCase();
  const confidence = confidenceStr.includes("high")
    ? 85
    : confidenceStr.includes("medium")
      ? 65
      : confidenceStr.includes("low")
        ? 35
        : 70;

  if (!entry && !tp1) return null;
  return { asset, entry, tp1, tp2, tp3, sl, timeframe, confidence };
}

type SignalData = NonNullable<ReturnType<typeof extractSignalData>>;

// --- Export AI signal as branded PNG ---
function exportAiSignalCard(content: string, signal?: SignalData) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 460;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#0e0f14";
  ctx.fillRect(0, 0, 640, 460);

  const grad = ctx.createLinearGradient(0, 0, 640, 0);
  grad.addColorStop(0, "#2dd4bf");
  grad.addColorStop(1, "#38bdf8");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 7);

  ctx.font = "bold 24px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText("Demon", 28, 50);
  ctx.fillStyle = "#2dd4bf";
  ctx.fillText("Zeno", 116, 50);
  ctx.font = "bold 11px 'DM Sans', sans-serif";
  ctx.fillStyle = "#ef4444";
  ctx.fillText("AI", 188, 46);
  ctx.font = "11px 'DM Sans', sans-serif";
  ctx.fillStyle = "#6b7280";
  ctx.fillText("Powered by 50+ AI Providers", 28, 68);

  ctx.strokeStyle = "#1e2030";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(28, 82);
  ctx.lineTo(612, 82);
  ctx.stroke();

  if (signal && (signal.entry || signal.tp1)) {
    ctx.font = "bold 18px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#2dd4bf";
    ctx.fillText(signal.asset ? `📊 ${signal.asset}` : "📊 SIGNAL", 28, 115);

    const confPct = signal.confidence;
    const cx = 580;
    const cy = 110;
    const r = 22;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "#1e2030";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(
      cx,
      cy,
      r,
      -Math.PI / 2,
      -Math.PI / 2 + (confPct / 100) * Math.PI * 2,
    );
    ctx.strokeStyle = "#2dd4bf";
    ctx.stroke();
    ctx.font = "bold 9px monospace";
    ctx.fillStyle = "#2dd4bf";
    ctx.textAlign = "center";
    ctx.fillText(`${confPct}%`, cx, cy + 4);
    ctx.textAlign = "left";

    const fields = [
      { l: "Entry", v: signal.entry, c: "#e2e8f0" },
      { l: "TP1", v: signal.tp1, c: "#22c55e" },
      { l: "TP2", v: signal.tp2, c: "#4ade80" },
      { l: "TP3", v: signal.tp3, c: "#86efac" },
      { l: "Stop Loss", v: signal.sl, c: "#ef4444" },
      { l: "Timeframe", v: signal.timeframe, c: "#94a3b8" },
    ].filter((f) => f.v);

    let row = 0;
    for (const field of fields) {
      const col = row % 3;
      const colRow = Math.floor(row / 3);
      const fx = 28 + col * 200;
      const fy = 145 + colRow * 52;
      ctx.font = "10px 'DM Sans', sans-serif";
      ctx.fillStyle = "#6b7280";
      ctx.fillText(field.l, fx, fy);
      ctx.font = "bold 16px 'JetBrains Mono', monospace";
      ctx.fillStyle = field.c;
      const display =
        field.v.length > 14 ? `${field.v.slice(0, 14)}…` : field.v;
      ctx.fillText(display, fx, fy + 22);
      row++;
    }

    ctx.strokeStyle = "#1e2030";
    ctx.beginPath();
    ctx.moveTo(28, 262);
    ctx.lineTo(612, 262);
    ctx.stroke();
  }

  const startY = signal && (signal.entry || signal.tp1) ? 285 : 100;
  const lines = content
    .replace(/\*\*/g, "")
    .split("\n")
    .filter((l) => l.trim())
    .slice(0, 8);

  ctx.font = "13px 'DM Sans', sans-serif";
  let y = startY;
  for (const line of lines) {
    if (y > 400) break;
    const trimmed = line.trim();
    if (trimmed.startsWith("📊") || trimmed.includes("SIGNAL")) {
      ctx.fillStyle = "#2dd4bf";
      ctx.font = "bold 13px 'DM Sans', sans-serif";
    } else if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "13px 'DM Sans', sans-serif";
    } else {
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "13px 'DM Sans', sans-serif";
    }
    const maxW = 570;
    let display = trimmed;
    while (ctx.measureText(display).width > maxW && display.length > 0) {
      display = `${display.slice(0, -4)}…`;
    }
    ctx.fillText(display, 28, y);
    y += 20;
  }

  ctx.strokeStyle = "#1e2030";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(556, 370, 56, 56);
  ctx.font = "7px monospace";
  ctx.fillStyle = "#374151";
  ctx.textAlign = "center";
  ctx.fillText("DZ·QR", 584, 402);
  ctx.textAlign = "left";

  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.font = "bold 52px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#2dd4bf";
  ctx.translate(320, 370);
  ctx.rotate(-0.18);
  ctx.fillText("DemonZeno", -130, 0);
  ctx.restore();

  ctx.font = "italic bold 12px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#ef4444";
  ctx.globalAlpha = 0.85;
  ctx.textAlign = "right";
  ctx.fillText("DemonZeno · Master the Chaos, Trade Like a God", 612, 446);
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
  ctx.font = "10px monospace";
  ctx.fillStyle = "#374151";
  ctx.fillText(new Date().toLocaleString(), 28, 446);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `demonzeno-signal-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

// --- Confetti burst ---
function triggerConfetti() {
  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden";
  document.body.appendChild(container);
  const colors = ["#38bdf8", "#2dd4bf", "#ef4444", "#22c55e", "#fbbf24"];
  for (let i = 0; i < 60; i++) {
    const dot = document.createElement("div");
    const color = colors[i % colors.length];
    const size = Math.random() * 8 + 4;
    const x = Math.random() * 100;
    const dur = Math.random() * 1.5 + 1;
    dot.style.cssText = `position:absolute;width:${size}px;height:${size}px;background:${color};border-radius:${Math.random() > 0.5 ? "50%" : "2px"};left:${x}%;top:-10px;animation:confettiFall ${dur}s ease-in forwards;animation-delay:${Math.random() * 0.5}s`;
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

// --- Confidence Gauge ---
function ConfidenceMeter({ pct }: { pct: number }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const stroke = (pct / 100) * circumference;
  const color =
    pct >= 75
      ? "oklch(0.7 0.18 145)"
      : pct >= 50
        ? "oklch(0.65 0.14 70)"
        : "oklch(0.55 0.05 260)";
  return (
    <div className="flex items-center gap-1.5">
      <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="oklch(0.25 0.01 260)"
          strokeWidth="3.5"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`${stroke} ${circumference}`}
          transform="rotate(-90 24 24)"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        <text
          x="24"
          y="28"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill={color}
        >
          {pct}%
        </text>
      </svg>
      <div className="flex flex-col">
        <span className="text-[10px] text-muted-foreground">Confidence</span>
        <span className="text-xs font-semibold" style={{ color }}>
          {pct >= 75 ? "HIGH" : pct >= 50 ? "MED" : "LOW"}
        </span>
      </div>
    </div>
  );
}

// --- Inline Signal Card ---
function InlineSignalCard({
  signal,
  index,
  onBacktest,
  onLogTrade,
}: {
  signal: SignalData;
  index: number;
  onBacktest: (s: SignalData) => void;
  onLogTrade: (s: SignalData) => void;
}) {
  return (
    <div
      data-ocid={`ai_chat.signal_card.${index}`}
      className="rounded-xl border p-3 mt-2"
      style={{
        borderColor: "oklch(0.65 0.15 190 / 0.3)",
        background: "oklch(0.16 0.015 260)",
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold"
            style={{ color: "oklch(0.65 0.15 190)" }}
          >
            📊 {signal.asset || "SIGNAL"}
          </span>
          {signal.timeframe && (
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                background: "oklch(0.65 0.15 190 / 0.15)",
                color: "oklch(0.75 0.15 190)",
              }}
            >
              {signal.timeframe}
            </span>
          )}
        </div>
        <ConfidenceMeter pct={signal.confidence} />
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs mb-2">
        {[
          { l: "Entry", v: signal.entry, c: "text-foreground" },
          { l: "TP1", v: signal.tp1, c: "text-green-400" },
          { l: "TP2", v: signal.tp2, c: "text-green-300" },
          { l: "TP3", v: signal.tp3, c: "text-green-200" },
          { l: "Stop Loss", v: signal.sl, c: "text-destructive" },
        ]
          .filter((f) => f.v)
          .map((f) => (
            <div key={f.l} className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-[10px]">{f.l}</span>
              <span className={`font-mono font-semibold ${f.c}`}>{f.v}</span>
            </div>
          ))}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          data-ocid={`ai_chat.signal_card.backtest_button.${index}`}
          onClick={() => onBacktest(signal)}
          className="h-6 px-2 text-[10px] gap-1 text-muted-foreground hover:text-primary"
        >
          <BarChart3 className="w-3 h-3" />
          Backtest
        </Button>
        <Button
          variant="ghost"
          size="sm"
          data-ocid={`ai_chat.signal_card.log_button.${index}`}
          onClick={() => onLogTrade(signal)}
          className="h-6 px-2 text-[10px] gap-1 text-muted-foreground hover:text-primary"
        >
          <BookOpen className="w-3 h-3" />
          Log Trade
        </Button>
      </div>
    </div>
  );
}

// --- Typing Indicator ---
function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-border bg-card">
        <img
          src="/assets/demonzeno-character.png"
          alt="DemonZeno AI"
          className="w-full object-cover object-top"
          style={{
            height: "136%",
            clipPath: "inset(0 0 18% 0)",
            marginBottom: "-18%",
          }}
        />
      </div>
      <div className="chat-message-ai">
        <div className="flex items-center gap-1 py-1 px-1">
          <span className="text-xs text-muted-foreground mr-2">
            DemonZeno AI is thinking
          </span>
          <div className="typing-indicator">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Accuracy Stats Panel ---
function AccuracyPanel({ onClose }: { onClose: () => void }) {
  const { stats, signals } = useSignalAccuracy();
  return (
    <div
      data-ocid="ai_chat.accuracy.panel"
      className="mx-4 mb-2 rounded-xl border border-border bg-card p-3"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">
            Signal Accuracy Tracker
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 text-muted-foreground"
          aria-label="Close tracker"
        >
          <ChevronUp className="w-3 h-3" />
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-2">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Wins", value: stats.wins, color: "text-green-400" },
          { label: "Losses", value: stats.losses, color: "text-destructive" },
          {
            label: "Win Rate",
            value: `${stats.winRate.toFixed(0)}%`,
            color: "text-primary",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg bg-background border border-border p-2 text-center"
          >
            <p className={`text-lg font-bold font-display ${item.color}`}>
              {item.value}
            </p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
      {signals.length === 0 && (
        <p className="text-xs text-muted-foreground text-center">
          No signals tracked yet. AI signals will appear here.
        </p>
      )}
    </div>
  );
}

// --- Journal Panel ---
function JournalPanel({
  entries,
  onClose,
  onClear,
}: {
  entries: JournalEntry[];
  onClose: () => void;
  onClear: () => void;
}) {
  const totalPnl = entries.reduce((sum, e) => sum + (e.pnl ?? 0), 0);
  return (
    <div
      data-ocid="ai_chat.journal.panel"
      className="mx-4 mb-2 rounded-xl border border-border bg-card p-3 max-h-64 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">
            AI Trade Journal
          </span>
          {entries.length > 0 && (
            <span
              className={`text-xs font-bold ${totalPnl >= 0 ? "text-green-400" : "text-destructive"}`}
            >
              {totalPnl >= 0 ? "+" : ""}
              {totalPnl.toFixed(2)}% P&L
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {entries.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-6 px-2 text-xs text-destructive hover:text-destructive"
            >
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-muted-foreground"
            aria-label="Close journal"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
      {entries.length === 0 ? (
        <p
          data-ocid="ai_chat.journal.empty_state"
          className="text-xs text-muted-foreground text-center py-4"
        >
          No trades logged yet. Use "Log Trade" on any signal card.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map((entry, i) => (
            <div
              key={entry.id}
              data-ocid={`ai_chat.journal.item.${i + 1}`}
              className="rounded-lg bg-background border border-border p-2 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-foreground truncate max-w-[180px]">
                  {entry.asset} {entry.direction}
                </span>
                {entry.pnl != null && (
                  <span
                    className={
                      entry.pnl >= 0 ? "text-green-400" : "text-destructive"
                    }
                  >
                    {entry.pnl >= 0 ? "+" : ""}
                    {entry.pnl.toFixed(2)}%
                  </span>
                )}
              </div>
              <div className="flex gap-3 text-muted-foreground mt-0.5">
                <span>Entry: {entry.entryPrice}</span>
                {entry.exitPrice != null && (
                  <span>Exit: {entry.exitPrice}</span>
                )}
                {entry.lots > 0 && <span>Lots: {entry.lots}</span>}
              </div>
              {entry.notes && (
                <p className="text-muted-foreground mt-0.5 truncate">
                  {entry.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Log Trade Form ---
function LogTradeForm({
  signal,
  onSubmit,
  onClose,
}: {
  signal: SignalData;
  onSubmit: (entry: Omit<JournalEntry, "id" | "timestamp">) => Promise<void>;
  onClose: () => void;
}) {
  const [entryPrice, setEntryPrice] = useState(
    signal.entry
      ? Number.parseFloat(signal.entry.replace(/[^0-9.]/g, "")) || 0
      : 0,
  );
  const [exitPrice, setExitPrice] = useState("");
  const [lots, setLots] = useState("0.01");
  const [direction, setDirection] = useState("Buy");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const pnl =
    exitPrice && entryPrice
      ? (
          ((Number.parseFloat(exitPrice) - entryPrice) / entryPrice) *
          100
        ).toFixed(2)
      : null;

  async function handleSubmit() {
    setLoading(true);
    await onSubmit({
      asset: signal.asset || "Unknown",
      direction,
      entryPrice,
      exitPrice: exitPrice ? Number.parseFloat(exitPrice) : undefined,
      lots: Number.parseFloat(lots) || 0,
      pnl: pnl ? Number.parseFloat(pnl) : undefined,
      notes,
    });
    setLoading(false);
    onClose();
  }

  return (
    <div
      data-ocid="ai_chat.log_trade.dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 0.7)" }}
    >
      <div className="bg-card border border-border rounded-2xl p-5 w-full max-w-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-foreground">
            Log Trade — {signal.asset}
          </h3>
          <button
            type="button"
            onClick={onClose}
            data-ocid="ai_chat.log_trade.close_button"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs text-muted-foreground"
              htmlFor="lt-direction"
            >
              Direction
            </label>
            <select
              id="lt-direction"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="h-9 rounded-lg px-3 text-sm bg-background border border-border text-foreground"
              data-ocid="ai_chat.log_trade.direction_select"
            >
              <option value="Buy">Buy / Long</option>
              <option value="Sell">Sell / Short</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground" htmlFor="lt-lots">
              Lot Size
            </label>
            <input
              id="lt-lots"
              type="number"
              value={lots}
              onChange={(e) => setLots(e.target.value)}
              className="h-9 rounded-lg px-3 text-sm bg-background border border-border text-foreground"
              data-ocid="ai_chat.log_trade.lots_input"
              step="0.01"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground" htmlFor="lt-entry">
            Entry Price
          </label>
          <input
            id="lt-entry"
            type="number"
            value={entryPrice}
            onChange={(e) =>
              setEntryPrice(Number.parseFloat(e.target.value) || 0)
            }
            className="h-9 rounded-lg px-3 text-sm bg-background border border-border text-foreground"
            data-ocid="ai_chat.log_trade.entry_input"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground" htmlFor="lt-exit">
            Exit Price (optional)
            {pnl && (
              <span
                className={`ml-2 font-semibold ${Number.parseFloat(pnl) >= 0 ? "text-green-400" : "text-destructive"}`}
              >
                {Number.parseFloat(pnl) >= 0 ? "+" : ""}
                {pnl}% P&L
              </span>
            )}
          </label>
          <input
            id="lt-exit"
            type="number"
            value={exitPrice}
            onChange={(e) => setExitPrice(e.target.value)}
            className="h-9 rounded-lg px-3 text-sm bg-background border border-border text-foreground"
            data-ocid="ai_chat.log_trade.exit_input"
            placeholder="Leave blank if trade is open"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground" htmlFor="lt-notes">
            Notes
          </label>
          <textarea
            id="lt-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm bg-background border border-border text-foreground resize-none"
            rows={2}
            data-ocid="ai_chat.log_trade.notes_textarea"
            placeholder="Trade notes…"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="ai_chat.log_trade.cancel_button"
            className="flex-1 text-xs"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            data-ocid="ai_chat.log_trade.submit_button"
            className="flex-1 text-xs btn-primary"
          >
            {loading ? "Saving…" : "Log Trade"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- Generic Feature Modal ---
function FeatureModal({
  title,
  content,
  loading,
  onClose,
  inputPlaceholder,
  inputLabel,
  onSubmit,
  secondInput,
  secondLabel,
  secondPlaceholder,
}: {
  title: string;
  content: string | null;
  loading: boolean;
  onClose: () => void;
  inputPlaceholder?: string;
  inputLabel?: string;
  onSubmit?: (val: string, val2?: string) => void;
  secondInput?: boolean;
  secondLabel?: string;
  secondPlaceholder?: string;
}) {
  const [val, setVal] = useState("");
  const [val2, setVal2] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 0.75)" }}
      data-ocid="ai_chat.feature.dialog"
    >
      <div className="bg-card border border-border rounded-2xl p-5 w-full max-w-lg max-h-[80vh] overflow-y-auto flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-foreground text-base">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            data-ocid="ai_chat.feature.close_button"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {onSubmit && !content && (
          <div className="flex flex-col gap-3">
            {inputLabel && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="feat-input"
                  className="text-xs text-muted-foreground"
                >
                  {inputLabel}
                </label>
                <input
                  id="feat-input"
                  type="text"
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  placeholder={inputPlaceholder}
                  className="h-9 rounded-lg px-3 text-sm bg-background border border-border text-foreground"
                  data-ocid="ai_chat.feature.input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && val.trim())
                      onSubmit(val.trim(), val2.trim() || undefined);
                  }}
                />
              </div>
            )}
            {secondInput && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="feat-input-2"
                  className="text-xs text-muted-foreground"
                >
                  {secondLabel}
                </label>
                <input
                  id="feat-input-2"
                  type="text"
                  value={val2}
                  onChange={(e) => setVal2(e.target.value)}
                  placeholder={secondPlaceholder}
                  className="h-9 rounded-lg px-3 text-sm bg-background border border-border text-foreground"
                  data-ocid="ai_chat.feature.second_input"
                />
              </div>
            )}
            <Button
              onClick={() => {
                if (val.trim()) onSubmit(val.trim(), val2.trim() || undefined);
              }}
              disabled={loading || !val.trim()}
              data-ocid="ai_chat.feature.submit_button"
              className="btn-primary"
            >
              {loading ? "Generating…" : "Generate"}
            </Button>
          </div>
        )}

        {loading && (
          <div
            data-ocid="ai_chat.feature.loading_state"
            className="flex items-center gap-3 py-4"
          >
            <div className="typing-indicator">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
            <span className="text-sm text-muted-foreground">
              DemonZeno AI is working…
            </span>
          </div>
        )}

        {content && (
          <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words bg-background rounded-xl p-4 border border-border">
            {content}
          </div>
        )}

        {content && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs gap-1"
              onClick={() => {
                navigator.clipboard.writeText(content);
                toast.success("Copied!");
              }}
            >
              <Copy className="w-3 h-3" />
              Copy
            </Button>
            <Button
              onClick={onClose}
              data-ocid="ai_chat.feature.confirm_button"
              size="sm"
              className="flex-1 text-xs btn-primary"
            >
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Session Recap Modal ---
function RecapModal({
  recap,
  onClose,
}: { recap: string; onClose: () => void }) {
  return (
    <div
      data-ocid="ai_chat.recap.dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 0.8)" }}
    >
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-foreground">
            📋 Session Recap
          </h3>
          <button
            type="button"
            onClick={onClose}
            data-ocid="ai_chat.recap.close_button"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close recap"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {recap}
        </p>
        <Button
          onClick={onClose}
          data-ocid="ai_chat.recap.confirm_button"
          className="btn-primary"
        >
          Close
        </Button>
      </div>
    </div>
  );
}

// --- FAQ Panel ---
function FaqPanel({
  actor,
  onClose,
}: {
  actor: { askFaq: (q: string) => Promise<string> } | null;
  onClose: () => void;
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim() || !actor) return;
    setLoading(true);
    try {
      const result = await actor.askFaq(question.trim());
      setAnswer(result);
    } catch {
      setAnswer("Sorry, I couldn't answer that right now. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      data-ocid="ai_chat.faq.panel"
      className="mx-4 mb-2 rounded-xl border border-border bg-card p-3"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">
            Ask DemonZeno FAQ
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 text-muted-foreground"
          aria-label="Close FAQ"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAsk();
          }}
          placeholder="Ask anything about DemonZeno or DMNZ…"
          className="flex-1 h-8 rounded-lg px-3 text-xs bg-background border border-border text-foreground"
          data-ocid="ai_chat.faq.input"
        />
        <Button
          size="sm"
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          className="h-8 text-xs btn-primary"
          data-ocid="ai_chat.faq.submit_button"
        >
          {loading ? "…" : "Ask"}
        </Button>
      </div>
      {answer && (
        <div className="rounded-lg bg-background border border-border p-2 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </div>
  );
}

// --- Daily Briefing Banner ---
function DailyBriefingBanner({ briefing }: { briefing: string }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div
      data-ocid="ai_chat.briefing.panel"
      className="mx-3 md:mx-4 mt-2 rounded-xl border bg-card overflow-hidden"
      style={{ borderColor: "oklch(0.65 0.15 190 / 0.3)" }}
    >
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-left"
        style={{ color: "oklch(0.75 0.15 190)" }}
        data-ocid="ai_chat.briefing.toggle"
      >
        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
        <span className="flex-1">📊 Daily Market Briefing</span>
        {collapsed ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronUp className="w-3 h-3" />
        )}
      </button>
      {!collapsed && (
        <div className="px-3 pb-3 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap border-t border-border/40 pt-2">
          {briefing}
        </div>
      )}
    </div>
  );
}

// --- Message Bubble ---
function MessageBubble({
  message,
  index,
  onRate,
  onBacktest,
  onLogTrade,
}: {
  message: AiMessageWithMeta;
  index: number;
  onRate: (msgId: string, rating: 1 | -1) => void;
  onBacktest: (signal: SignalData) => void;
  onLogTrade: (signal: SignalData) => void;
}) {
  const isUser = message.role === "user";
  const { markWin, markLoss } = useSignalAccuracy();
  const signalData = !isUser ? extractSignalData(message.content) : null;
  const signalId = message.signalId;
  const msgId = message.messageId ?? `msg-${message.timestamp}`;

  function copyContent() {
    navigator.clipboard.writeText(message.content);
    toast.success("Copied to clipboard");
  }

  function handleExport() {
    exportAiSignalCard(message.content, signalData ?? undefined);
    triggerConfetti();
    toast.success("Signal card exported! 🎉");
  }

  if (isUser) {
    return (
      <div
        data-ocid={`ai_chat.message.item.${index}`}
        className="flex items-end justify-end gap-3"
      >
        <div className="chat-message-user">
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-sm text-primary-foreground bg-primary">
          A
        </div>
      </div>
    );
  }

  return (
    <div
      data-ocid={`ai_chat.message.item.${index}`}
      className="flex items-start gap-3"
    >
      <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-border bg-card">
        <img
          src="/assets/demonzeno-character.png"
          alt="DemonZeno AI"
          className="w-full object-cover object-top"
          style={{
            height: "136%",
            clipPath: "inset(0 0 18% 0)",
            marginBottom: "-18%",
          }}
        />
      </div>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded"
            style={{
              background: "oklch(0.65 0.15 190 / 0.12)",
              color: "oklch(0.72 0.14 190)",
            }}
          >
            DemonZeno AI
          </span>
          {signalData && (
            <Badge
              variant="outline"
              className="text-xs h-5 px-1.5"
              style={{
                borderColor: "oklch(0.65 0.15 190 / 0.4)",
                color: "oklch(0.75 0.15 190)",
              }}
            >
              📊 Signal
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="chat-message-ai group relative">
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words pr-6">
            {message.content}
          </p>
          <button
            type="button"
            onClick={copyContent}
            aria-label="Copy message"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
          >
            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        {signalData && (
          <InlineSignalCard
            signal={signalData}
            index={index}
            onBacktest={onBacktest}
            onLogTrade={onLogTrade}
          />
        )}

        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            data-ocid={`ai_chat.message.export_button.${index}`}
            onClick={handleExport}
            className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-primary"
          >
            <Download className="w-3 h-3" />
            Export
          </Button>
          <Button
            variant="ghost"
            size="sm"
            data-ocid={`ai_chat.message.thumbsup_button.${index}`}
            onClick={() => onRate(msgId, 1)}
            className={`h-6 px-2 text-xs gap-1 transition-colors ${message.rating === 1 ? "text-green-400" : "text-muted-foreground hover:text-green-400"}`}
          >
            <ThumbsUp className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            data-ocid={`ai_chat.message.thumbsdown_button.${index}`}
            onClick={() => onRate(msgId, -1)}
            className={`h-6 px-2 text-xs gap-1 transition-colors ${message.rating === -1 ? "text-destructive" : "text-muted-foreground hover:text-destructive"}`}
          >
            <ThumbsDown className="w-3 h-3" />
          </Button>
          {signalId && (
            <>
              <Button
                variant="ghost"
                size="sm"
                data-ocid={`ai_chat.message.win_button.${index}`}
                onClick={() => markWin(signalId)}
                className="h-6 px-2 text-xs gap-1 hover:text-green-400 text-muted-foreground"
              >
                W
              </Button>
              <Button
                variant="ghost"
                size="sm"
                data-ocid={`ai_chat.message.loss_button.${index}`}
                onClick={() => markLoss(signalId)}
                className="h-6 px-2 text-xs gap-1 hover:text-destructive text-muted-foreground"
              >
                L
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Empty State ---
function EmptyState({ onSuggestion }: { onSuggestion: (q: string) => void }) {
  const suggestions = [
    "BTC/USDT signal with Entry, SL, TP1/TP2/TP3",
    "ETH long or short analysis",
    "EUR/USD forex signal for today",
    "AAPL stock entry & exit",
    "Write a Python trading bot",
    "Full signal chain for SOL",
    "Compare BTC vs ETH right now",
    "What is market regime today?",
  ];
  return (
    <div
      data-ocid="ai_chat.empty_state"
      className="flex flex-col items-center justify-center py-14 gap-5 text-center"
    >
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{
          background: "oklch(0.65 0.15 190 / 0.10)",
          border: "1px solid oklch(0.65 0.15 190 / 0.25)",
          boxShadow: "0 0 30px oklch(0.65 0.15 190 / 0.15)",
        }}
      >
        <Zap
          className="w-10 h-10"
          style={{ color: "oklch(0.65 0.15 190)" }}
          strokeWidth={2}
        />
      </div>
      <div>
        <h2 className="font-display font-bold text-xl text-foreground">
          DemonZeno AI — Ready
        </h2>
        <p className="text-muted-foreground text-sm mt-1.5 max-w-sm leading-relaxed">
          Powered by 50+ AI providers silently working in the background. Ask
          for signals, analysis, code, or anything else.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center max-w-sm">
        {suggestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSuggestion(q)}
            className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-smooth"
          >
            {q}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground max-w-xs">
        <span className="text-primary/80 font-semibold">
          Every signal includes:
        </span>{" "}
        Entry · TP1 · TP2 · TP3 · Stop Loss · Confidence
      </p>
    </div>
  );
}

// ─── Feature toolbar button definition ────────────────────────────────────
type FeatureType =
  | "signalOfDay"
  | "briefing"
  | "recap"
  | "backtest"
  | "chain"
  | "compare"
  | "predict"
  | "postTrade"
  | null;

// ========== MAIN COMPONENT ==========
export function AiChatInterface() {
  const { aiSessionToken, clearAiSession, aiLanguage, setAiLanguage } =
    useAiSession();
  const { invalidate } = useInvalidateAiSession();
  const { send, isLoading } = useSendAiMessage();
  const { actor } = useActor(createActor);
  const { addAiSignal } = useSignalAccuracy();

  const [messages, setMessages] = useState<AiMessageWithMeta[]>([]);
  const [input, setInput] = useState("");
  const [showAccuracy, setShowAccuracy] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [mobileToolbarOpen, setMobileToolbarOpen] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [dailyBriefing, setDailyBriefing] = useState<string | null>(null);
  const [recapContent, setRecapContent] = useState<string | null>(null);
  const [logTradeSignal, setLogTradeSignal] = useState<SignalData | null>(null);
  const [isLoadingRecap, setIsLoadingRecap] = useState(false);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [activeFeature, setActiveFeature] = useState<FeatureType>(null);
  const [featureContent, setFeatureContent] = useState<string | null>(null);
  const [featureLoading, setFeatureLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageCount = messages.length;

  // Fetch daily briefing on mount
  useEffect(() => {
    if (!actor) return;
    actor
      .getDailyBriefing()
      .then((briefing) => {
        if (briefing?.trim()) setDailyBriefing(briefing);
      })
      .catch(() => {});
  }, [actor]);

  // Load journal entries
  useEffect(() => {
    if (!actor || !aiSessionToken) return;
    actor
      .getJournalEntries(aiSessionToken)
      .then((result) => {
        if (result.__kind__ === "ok") setJournalEntries(result.ok);
      })
      .catch(() => {});
  }, [actor, aiSessionToken]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message/loading change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messageCount, isLoading]);

  function openFeature(f: FeatureType) {
    setActiveFeature(f);
    setFeatureContent(null);
  }

  function closeFeature() {
    setActiveFeature(null);
    setFeatureContent(null);
    setFeatureLoading(false);
  }

  // Feature: Signal of the Day
  async function handleSignalOfDay() {
    if (!actor) return;
    setFeatureLoading(true);
    try {
      const signal = await actor.getSignalOfTheDay();
      if (signal) {
        const txt =
          `📊 **SIGNAL OF THE DAY: ${signal.asset}**\n\n` +
          `Direction: ${signal.direction}\n` +
          `Entry: ${signal.entryPrice}\n` +
          `TP1: ${signal.tp1}\n` +
          `TP2: ${signal.tp2}\n` +
          `TP3: ${signal.tp3}\n` +
          `Stop Loss: ${signal.stopLoss}\n` +
          `Timeframe: ${signal.timeframe}\n` +
          `Confidence: ${signal.confidence}`;
        setFeatureContent(txt);
        // Push to chat as well
        const aiMsg: AiMessageWithMeta = {
          role: "assistant",
          content: txt,
          timestamp: Date.now(),
          messageId: `sotd-${Date.now()}`,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setFeatureContent(
          "No Signal of the Day has been set yet. Check back later!",
        );
      }
    } catch {
      setFeatureContent("Could not fetch Signal of the Day. Please try again.");
    } finally {
      setFeatureLoading(false);
    }
  }

  // Feature: Generate daily briefing
  async function handleGenerateBriefing() {
    if (!actor || !aiSessionToken) return;
    setFeatureLoading(true);
    try {
      const result = await actor.generateDailyBriefing(aiSessionToken);
      if (result.__kind__ === "ok") {
        setDailyBriefing(result.ok);
        setFeatureContent(result.ok);
      } else {
        setFeatureContent("Could not generate briefing. Try again.");
      }
    } catch {
      setFeatureContent("Failed to generate briefing.");
    } finally {
      setFeatureLoading(false);
    }
  }

  // Feature: Signal chain
  async function handleSignalChain(asset: string) {
    if (!actor || !aiSessionToken || !asset) return;
    setFeatureLoading(true);
    try {
      const result = await actor.generateSignalChain(asset, aiSessionToken);
      if (result.__kind__ === "ok") {
        setFeatureContent(result.ok);
        const aiMsg: AiMessageWithMeta = {
          role: "assistant",
          content: result.ok,
          timestamp: Date.now(),
          messageId: `chain-${Date.now()}`,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setFeatureContent("Failed to generate signal chain.");
      }
    } catch {
      setFeatureContent("Signal chain failed. Try again.");
    } finally {
      setFeatureLoading(false);
    }
  }

  // Feature: Compare signals
  async function handleCompare(asset1: string, asset2: string) {
    if (!actor || !aiSessionToken) return;
    setFeatureLoading(true);
    try {
      const result = await actor.compareSignals(asset1, asset2, aiSessionToken);
      if (result.__kind__ === "ok") {
        setFeatureContent(result.ok);
        const aiMsg: AiMessageWithMeta = {
          role: "assistant",
          content: result.ok,
          timestamp: Date.now(),
          messageId: `compare-${Date.now()}`,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setFeatureContent("Comparison failed. Try again.");
      }
    } catch {
      setFeatureContent("Could not compare signals.");
    } finally {
      setFeatureLoading(false);
    }
  }

  // Feature: Price prediction
  async function handlePricePrediction(asset: string) {
    if (!actor || !aiSessionToken) return;
    setFeatureLoading(true);
    try {
      const result = await actor.generatePricePrediction(asset, aiSessionToken);
      if (result.__kind__ === "ok") {
        setFeatureContent(result.ok);
        const aiMsg: AiMessageWithMeta = {
          role: "assistant",
          content: result.ok,
          timestamp: Date.now(),
          messageId: `predict-${Date.now()}`,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setFeatureContent("Price prediction failed.");
      }
    } catch {
      setFeatureContent("Could not generate prediction.");
    } finally {
      setFeatureLoading(false);
    }
  }

  // Feature: Post trade analysis
  async function handlePostTrade(signal: string, outcome: string) {
    if (!actor || !aiSessionToken) return;
    setFeatureLoading(true);
    try {
      const result = await actor.generatePostTradeAnalysis(
        signal,
        outcome,
        aiSessionToken,
      );
      if (result.__kind__ === "ok") {
        setFeatureContent(result.ok);
      } else {
        setFeatureContent("Post-trade analysis failed.");
      }
    } catch {
      setFeatureContent("Could not generate analysis.");
    } finally {
      setFeatureLoading(false);
    }
  }

  // Handle message rating
  const handleRate = useCallback(
    async (msgId: string, rating: 1 | -1) => {
      if (!actor || !aiSessionToken) return;
      setMessages((prev) =>
        prev.map((m) =>
          (m.messageId ?? `msg-${m.timestamp}`) === msgId
            ? { ...m, rating }
            : m,
        ),
      );
      try {
        await actor.rateAiResponse(msgId, BigInt(rating), aiSessionToken);
      } catch {
        // Silently fail
      }
    },
    [actor, aiSessionToken],
  );

  // Backtest
  const handleBacktest = useCallback(
    async (signal: SignalData) => {
      if (!actor || !aiSessionToken || isBacktesting) return;
      setIsBacktesting(true);
      const signalText = `Asset: ${signal.asset}, Entry: ${signal.entry}, TP1: ${signal.tp1}, TP2: ${signal.tp2}, TP3: ${signal.tp3}, SL: ${signal.sl}, Timeframe: ${signal.timeframe}`;
      try {
        const result = await actor.backtestSignal(signalText, aiSessionToken);
        if (result.__kind__ === "ok") {
          const backtestMsg: AiMessageWithMeta = {
            role: "assistant",
            content: `📊 **Backtest Result**\n\n${result.ok}`,
            timestamp: Date.now(),
            messageId: `backtest-${Date.now()}`,
          };
          setMessages((prev) => [...prev, backtestMsg]);
        } else {
          toast.error("Backtest failed. Try again.");
        }
      } catch {
        toast.error("Could not run backtest.");
      } finally {
        setIsBacktesting(false);
      }
    },
    [actor, aiSessionToken, isBacktesting],
  );

  // Log trade to journal
  const handleLogTrade = useCallback(
    async (entry: Omit<JournalEntry, "id" | "timestamp">) => {
      if (!actor || !aiSessionToken) return;
      const fullEntry: JournalEntry = {
        ...entry,
        id: `j-${Date.now()}`,
        timestamp: BigInt(Date.now()),
      };
      try {
        await actor.addJournalEntry(fullEntry, aiSessionToken);
        setJournalEntries((prev) => [...prev, fullEntry]);
        toast.success("Trade logged to journal!");
      } catch {
        toast.error("Could not log trade.");
      }
    },
    [actor, aiSessionToken],
  );

  // Clear journal
  const handleClearJournal = useCallback(async () => {
    if (!actor || !aiSessionToken) return;
    try {
      await actor.clearJournal(aiSessionToken);
      setJournalEntries([]);
      toast.success("Journal cleared.");
    } catch {
      toast.error("Could not clear journal.");
    }
  }, [actor, aiSessionToken]);

  // Session recap
  const handleSessionRecap = useCallback(async () => {
    if (!actor || !aiSessionToken || isLoadingRecap) return;
    setIsLoadingRecap(true);
    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: BigInt(m.timestamp),
      }));
      const result = await actor.getSessionRecap(history, aiSessionToken);
      if (result.__kind__ === "ok") {
        setRecapContent(result.ok);
      } else {
        toast.error("Could not generate recap.");
      }
    } catch {
      toast.error("Recap failed.");
    } finally {
      setIsLoadingRecap(false);
    }
  }, [actor, aiSessionToken, messages, isLoadingRecap]);

  // Language change
  const handleLanguageChange = useCallback(
    async (lang: string) => {
      setAiLanguage(lang as "en" | "ar" | "es" | "zh");
      if (actor && aiSessionToken) {
        try {
          await actor.setAiLanguage(lang, aiSessionToken);
        } catch {
          // silently fail
        }
      }
      toast.success(`Language: ${LANGUAGE_LABELS[lang]}`);
    },
    [actor, aiSessionToken, setAiLanguage],
  );

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading || !aiSessionToken) return;

    const langSuffix = LANGUAGE_INSTRUCTION[aiLanguage] ?? "";
    const messageWithLang = langSuffix ? `${text}${langSuffix}` : text;

    const userMsg: AiMessage = {
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const historyWithLang = [
      ...messages,
      { ...userMsg, content: messageWithLang },
    ];

    const reply = await send(aiSessionToken, messageWithLang, historyWithLang);

    if (reply) {
      const sigData = extractSignalData(reply.content);
      let signalId: string | undefined;
      if (sigData) {
        signalId = addAiSignal({
          asset: sigData.asset,
          entry: sigData.entry,
          tp1: sigData.tp1,
          tp2: sigData.tp2,
          tp3: sigData.tp3,
          sl: sigData.sl,
          timeframe: sigData.timeframe,
          confidence: `${sigData.confidence}%`,
          provider: "DemonZeno AI",
        });
      }
      const newMsg: AiMessageWithMeta = {
        ...reply,
        signalId,
        messageId: `msg-${reply.timestamp}`,
      };
      setMessages((prev) => [...prev, newMsg]);
    }
  }, [
    input,
    isLoading,
    aiSessionToken,
    aiLanguage,
    messages,
    send,
    addAiSignal,
  ]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleLogout() {
    if (aiSessionToken) {
      await invalidate(aiSessionToken);
    }
    clearAiSession();
  }

  function clearChat() {
    setMessages([]);
    textareaRef.current?.focus();
  }

  // Feature toolbar items
  const featureButtons = [
    {
      icon: TrendingUp,
      label: "Signal of Day",
      ocid: "ai_chat.feature.signal_of_day",
      action: () => {
        openFeature("signalOfDay");
        handleSignalOfDay();
      },
    },
    {
      icon: BarChart3,
      label: "Daily Briefing",
      ocid: "ai_chat.feature.daily_briefing",
      action: () => {
        openFeature("briefing");
        handleGenerateBriefing();
      },
    },
    {
      icon: Link2,
      label: "Signal Chain",
      ocid: "ai_chat.feature.signal_chain",
      action: () => openFeature("chain"),
    },
    {
      icon: Copy,
      label: "Compare",
      ocid: "ai_chat.feature.compare",
      action: () => openFeature("compare"),
    },
    {
      icon: Zap,
      label: "Price Predict",
      ocid: "ai_chat.feature.price_predict",
      action: () => openFeature("predict"),
    },
    {
      icon: BookOpen,
      label: "Post-Trade",
      ocid: "ai_chat.feature.post_trade",
      action: () => openFeature("postTrade"),
    },
  ];

  return (
    <>
      <div
        data-ocid="ai_chat.panel"
        className="flex flex-col"
        style={{ height: "100dvh", background: "oklch(0.145 0.01 260)" }}
      >
        {/* Header */}
        <header
          className="flex items-center gap-2 px-3 py-2.5 shrink-0 bg-card border-b border-border"
          style={{ boxShadow: "0 1px 24px oklch(0 0 0 / 0.3)" }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-border">
              <img
                src="/assets/demonzeno-character.png"
                alt="DemonZeno AI"
                className="w-full object-cover object-top"
                style={{
                  height: "136%",
                  clipPath: "inset(0 0 18% 0)",
                  marginBottom: "-18%",
                }}
              />
            </div>
            <div className="min-w-0">
              <h1
                className="font-display font-bold text-sm leading-none truncate"
                style={{ color: "oklch(0.97 0.005 260)" }}
              >
                Demon<span style={{ color: "oklch(0.65 0.15 190)" }}>Zeno</span>{" "}
                <span style={{ color: "oklch(0.65 0.15 190 / 0.7)" }}>AI</span>
              </h1>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">
                50+ providers · Auto-routing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 ml-1 shrink-0">
            <span
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: "oklch(0.65 0.15 190 / 0.12)",
                color: "oklch(0.72 0.14 190)",
                border: "1px solid oklch(0.65 0.15 190 / 0.25)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
                style={{ background: "oklch(0.65 0.15 190)" }}
              />
              LIVE
            </span>
          </div>

          {/* Desktop toolbar */}
          <div className="hidden md:flex items-center gap-1 ml-auto shrink-0 flex-wrap">
            <Select value={aiLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger
                data-ocid="ai_chat.language.select"
                className="h-8 text-xs w-20 bg-background border-border gap-1"
              >
                <Globe className="w-3 h-3 shrink-0" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
                  <SelectItem key={code} value={code} className="text-xs">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {featureButtons.map(({ icon: Icon, label, ocid, action }) => (
              <Button
                key={label}
                variant="ghost"
                size="sm"
                data-ocid={ocid}
                onClick={action}
                className="text-muted-foreground hover:text-foreground h-8 px-2 gap-1 text-xs"
                title={label}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{label}</span>
              </Button>
            ))}

            <Button
              variant="ghost"
              size="sm"
              data-ocid="ai_chat.accuracy.toggle"
              onClick={() => setShowAccuracy((v) => !v)}
              className="text-muted-foreground hover:text-foreground h-8 px-2 gap-1 text-xs"
              title="Signal Accuracy Tracker"
            >
              <Award className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              data-ocid="ai_chat.journal.toggle"
              onClick={() => setShowJournal((v) => !v)}
              className="text-muted-foreground hover:text-foreground h-8 px-2 gap-1 text-xs"
              title="Trade Journal"
            >
              <FileText className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              data-ocid="ai_chat.faq.toggle"
              onClick={() => setShowFaq((v) => !v)}
              className="text-muted-foreground hover:text-foreground h-8 px-2 gap-1 text-xs"
              title="Ask FAQ"
            >
              <Lightbulb className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              data-ocid="ai_chat.recap.button"
              onClick={handleSessionRecap}
              disabled={messages.length === 0 || isLoadingRecap}
              className="text-muted-foreground hover:text-foreground h-8 px-2 gap-1 text-xs"
              title="Session Recap"
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              data-ocid="ai_chat.clear_button"
              onClick={clearChat}
              className="text-muted-foreground hover:text-foreground h-8 px-2 gap-1 text-xs"
              title="Clear chat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              data-ocid="ai_chat.logout_button"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground h-8 px-2 gap-1 text-xs"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-1 ml-auto shrink-0">
            <Button
              variant="ghost"
              size="sm"
              data-ocid="ai_chat.mobile_toolbar.toggle"
              onClick={() => setMobileToolbarOpen((v) => !v)}
              className="text-muted-foreground h-8 w-8 p-0"
              aria-label="Toggle toolbar"
            >
              {mobileToolbarOpen ? (
                <X className="w-3.5 h-3.5" />
              ) : (
                <Menu className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        </header>

        {/* Mobile collapsible toolbar */}
        {mobileToolbarOpen && (
          <div className="md:hidden flex flex-col gap-2 px-3 py-2.5 bg-card border-b border-border shrink-0">
            <div className="flex gap-2">
              <Select
                value={aiLanguage}
                onValueChange={(v) => {
                  handleLanguageChange(v);
                  setMobileToolbarOpen(false);
                }}
              >
                <SelectTrigger
                  data-ocid="ai_chat.language.select.mobile"
                  className="h-8 text-xs flex-1 bg-background border-border"
                >
                  <Globe className="w-3 h-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
                    <SelectItem key={code} value={code} className="text-xs">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-1 flex-wrap">
              {[
                ...featureButtons.map(
                  ({ icon: Icon, label, ocid, action }) => ({
                    Icon,
                    label,
                    ocid: `${ocid}.mobile`,
                    action: () => {
                      action();
                      setMobileToolbarOpen(false);
                    },
                  }),
                ),
                {
                  Icon: Award,
                  label: "Tracker",
                  ocid: "ai_chat.accuracy.toggle.mobile",
                  action: () => {
                    setShowAccuracy((v) => !v);
                    setMobileToolbarOpen(false);
                  },
                },
                {
                  Icon: FileText,
                  label: "Journal",
                  ocid: "ai_chat.journal.toggle.mobile",
                  action: () => {
                    setShowJournal((v) => !v);
                    setMobileToolbarOpen(false);
                  },
                },
                {
                  Icon: Lightbulb,
                  label: "FAQ",
                  ocid: "ai_chat.faq.toggle.mobile",
                  action: () => {
                    setShowFaq((v) => !v);
                    setMobileToolbarOpen(false);
                  },
                },
                {
                  Icon: BarChart3,
                  label: "Recap",
                  ocid: "ai_chat.recap.button.mobile",
                  action: () => {
                    handleSessionRecap();
                    setMobileToolbarOpen(false);
                  },
                },
                {
                  Icon: RotateCcw,
                  label: "Clear",
                  ocid: "ai_chat.clear_button.mobile",
                  action: () => {
                    clearChat();
                    setMobileToolbarOpen(false);
                  },
                },
                {
                  Icon: LogOut,
                  label: "Logout",
                  ocid: "ai_chat.logout_button.mobile",
                  action: handleLogout,
                },
              ].map(({ Icon, label, ocid, action }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="sm"
                  data-ocid={ocid}
                  onClick={action}
                  className="flex-1 text-muted-foreground hover:text-foreground h-8 gap-1 text-xs min-w-[60px]"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Accuracy tracker */}
        {showAccuracy && (
          <AccuracyPanel onClose={() => setShowAccuracy(false)} />
        )}

        {/* Journal */}
        {showJournal && (
          <JournalPanel
            entries={journalEntries}
            onClose={() => setShowJournal(false)}
            onClear={handleClearJournal}
          />
        )}

        {/* FAQ panel */}
        {showFaq && (
          <FaqPanel actor={actor} onClose={() => setShowFaq(false)} />
        )}

        {/* Daily Briefing */}
        {dailyBriefing && <DailyBriefingBanner briefing={dailyBriefing} />}

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-3 md:px-4 py-6"
        >
          <div className="max-w-3xl mx-auto flex flex-col gap-5">
            {messages.length === 0 && (
              <EmptyState onSuggestion={(q) => setInput(q)} />
            )}
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.timestamp}
                message={msg}
                index={i + 1}
                onRate={handleRate}
                onBacktest={handleBacktest}
                onLogTrade={(signal) => setLogTradeSignal(signal)}
              />
            ))}
            {(isLoading || isBacktesting) && <TypingIndicator />}
          </div>
        </div>

        {/* Input footer */}
        <div className="shrink-0 px-3 md:px-4 py-3 bg-card border-t border-border">
          <div className="max-w-3xl mx-auto flex gap-2 md:gap-3 items-end">
            <Textarea
              ref={textareaRef}
              data-ocid="ai_chat.message.input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for a signal, market analysis, code, or anything… (Enter to send)"
              rows={1}
              className="resize-none min-h-[44px] max-h-32 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary text-sm leading-relaxed"
            />
            <Button
              data-ocid="ai_chat.send_button"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="btn-primary shrink-0 w-11 h-11 p-0 rounded-xl"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-muted-foreground text-xs text-center mt-1.5">
            DemonZeno AI may be wrong. Always do your own research. Not
            financial advice.
          </p>
        </div>
      </div>

      {/* Log Trade Form */}
      {logTradeSignal && (
        <LogTradeForm
          signal={logTradeSignal}
          onSubmit={handleLogTrade}
          onClose={() => setLogTradeSignal(null)}
        />
      )}

      {/* Session Recap Modal */}
      {recapContent && (
        <RecapModal
          recap={recapContent}
          onClose={() => setRecapContent(null)}
        />
      )}

      {/* Feature Modals */}
      {activeFeature === "signalOfDay" && (
        <FeatureModal
          title="📊 Signal of the Day"
          content={featureContent}
          loading={featureLoading}
          onClose={closeFeature}
        />
      )}
      {activeFeature === "briefing" && (
        <FeatureModal
          title="📈 Daily Market Briefing"
          content={featureContent}
          loading={featureLoading}
          onClose={closeFeature}
        />
      )}
      {activeFeature === "chain" && (
        <FeatureModal
          title="🔗 Signal Chain — Full Trading Plan"
          content={featureContent}
          loading={featureLoading}
          onClose={closeFeature}
          inputLabel="Asset (e.g. BTC/USDT, EUR/USD, AAPL)"
          inputPlaceholder="Enter asset…"
          onSubmit={(asset) => handleSignalChain(asset)}
        />
      )}
      {activeFeature === "compare" && (
        <FeatureModal
          title="⚔️ Compare Two Assets"
          content={featureContent}
          loading={featureLoading}
          onClose={closeFeature}
          inputLabel="Asset 1 (e.g. BTC/USDT)"
          inputPlaceholder="Asset 1…"
          secondInput
          secondLabel="Asset 2 (e.g. ETH/USDT)"
          secondPlaceholder="Asset 2…"
          onSubmit={(a1, a2) => handleCompare(a1, a2 ?? "")}
        />
      )}
      {activeFeature === "predict" && (
        <FeatureModal
          title="🔮 Price Prediction"
          content={featureContent}
          loading={featureLoading}
          onClose={closeFeature}
          inputLabel="Asset (e.g. BTC, ETH, EUR/USD)"
          inputPlaceholder="Enter asset…"
          onSubmit={(asset) => handlePricePrediction(asset)}
        />
      )}
      {activeFeature === "postTrade" && (
        <FeatureModal
          title="📋 Post-Trade Analysis"
          content={featureContent}
          loading={featureLoading}
          onClose={closeFeature}
          inputLabel="Signal (e.g. BTC LONG Entry 67000, TP1 69000, SL 65000)"
          inputPlaceholder="Describe the signal…"
          secondInput
          secondLabel="Outcome (e.g. Hit TP1, stopped out at SL)"
          secondPlaceholder="What happened…"
          onSubmit={(signal, outcome) => handlePostTrade(signal, outcome ?? "")}
        />
      )}
    </>
  );
}
