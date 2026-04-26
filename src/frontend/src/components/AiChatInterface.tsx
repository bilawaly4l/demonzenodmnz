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
  LogOut,
  Menu,
  RotateCcw,
  Send,
  Shield,
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
import { useSession } from "../contexts/SessionContext";
import { useSignalAccuracy } from "../contexts/SignalAccuracyContext";
import {
  AI_PROVIDERS,
  type AiMessage,
  type AiMode,
  type AiProvider,
  type AiProviderStatus,
  useInvalidateAiSession,
  useSendAiMessage,
} from "../hooks/useAiChat";
import { AiAdminPanel } from "./AiAdminPanel";

type AiMessageWithSignal = AiMessage & {
  signalId?: string;
  rating?: 1 | -1 | null;
  messageId?: string;
};

const ADMIN_TRIGGER =
  "DemonZeno: Master the Chaos, Slay the Market, and Trade Like a God./BP2420075112009";

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
function exportAiSignalCard(
  content: string,
  provider: string,
  mode: AiMode,
  signal?: SignalData,
) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 460;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#0e0f14";
  ctx.fillRect(0, 0, 640, 460);

  // Top gradient bar
  const grad = ctx.createLinearGradient(0, 0, 640, 0);
  grad.addColorStop(0, "oklch(0.65 0.15 190 / 1)");
  grad.addColorStop(1, "oklch(0.5 0.18 210 / 1)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 7);

  if (mode === "insane") {
    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(0, 453, 640, 7);
  }

  // Brand
  ctx.font = "bold 24px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText("Demon", 28, 50);
  ctx.fillStyle = "#2dd4bf";
  ctx.fillText("Zeno", 116, 50);
  ctx.font = "bold 11px 'DM Sans', sans-serif";
  ctx.fillStyle = mode === "insane" ? "#ef4444" : "#2dd4bf";
  ctx.fillText(mode.toUpperCase(), 190, 46);

  const provLabel =
    AI_PROVIDERS.find((p) => p.provider === provider)?.label ?? provider;
  ctx.font = "11px 'DM Sans', sans-serif";
  ctx.fillStyle = "#6b7280";
  ctx.fillText(`via ${provLabel}`, 28, 68);

  // Divider
  ctx.strokeStyle = "#1e2030";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(28, 82);
  ctx.lineTo(612, 82);
  ctx.stroke();

  // Signal card data section
  if (signal && (signal.entry || signal.tp1)) {
    ctx.font = "bold 18px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#2dd4bf";
    ctx.fillText(signal.asset ? `📊 ${signal.asset}` : "📊 SIGNAL", 28, 115);

    // Confidence arc
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

  // Message lines
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

  // QR placeholder
  ctx.strokeStyle = "#1e2030";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(556, 370, 56, 56);
  ctx.font = "7px monospace";
  ctx.fillStyle = "#374151";
  ctx.textAlign = "center";
  ctx.fillText("DZ·QR", 584, 402);
  ctx.textAlign = "left";

  // Watermark
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.font = "bold 52px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#2dd4bf";
  ctx.translate(320, 370);
  ctx.rotate(-0.18);
  ctx.fillText("DemonZeno", -130, 0);
  ctx.restore();

  // Bottom
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

// --- Embedded Signal Card (in chat) ---
function InlineSignalCard({
  signal,
  index,
  mode,
  onBacktest,
  onLogTrade,
}: {
  signal: SignalData;
  index: number;
  mode: AiMode;
  onBacktest: (s: SignalData) => void;
  onLogTrade: (s: SignalData) => void;
}) {
  const accentColor =
    mode === "insane" ? "oklch(0.7 0.2 22)" : "oklch(0.65 0.15 190)";
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
          <span className="text-xs font-bold" style={{ color: accentColor }}>
            📊 {signal.asset || "SIGNAL"}
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded"
            style={{
              background: "oklch(0.65 0.15 190 / 0.15)",
              color: "oklch(0.75 0.15 190)",
            }}
          >
            {signal.timeframe || "—"}
          </span>
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
          data-ocid={`ai_chat.signal_card.chain_button.${index}`}
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

// --- Mode Badge ---
function ModeBadge({ mode, onClick }: { mode: AiMode; onClick: () => void }) {
  return (
    <button
      type="button"
      data-ocid="ai_chat.mode.toggle"
      onClick={onClick}
      className={
        mode === "insane"
          ? "badge-mode-insane cursor-pointer hover:opacity-80 transition-opacity"
          : "badge-mode-normal cursor-pointer hover:opacity-80 transition-opacity"
      }
      aria-label={`Switch to ${mode === "normal" ? "Insane" : "Normal"} mode`}
    >
      {mode === "normal" ? "NORMAL" : "INSANE 🔥"}
    </button>
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
          style={{ height: "115%" }}
        />
      </div>
      <div className="chat-message-ai">
        <div className="typing-indicator">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

// --- Provider Status Dot ---
function StatusDot({ available }: { available: boolean }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full shrink-0 mr-1.5"
      style={{
        background: available ? "oklch(0.7 0.18 145)" : "oklch(0.45 0.01 260)",
      }}
      aria-hidden="true"
    />
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
  return (
    <div
      data-ocid="ai_chat.journal.panel"
      className="mx-4 mb-2 rounded-xl border border-border bg-card p-3 max-h-60 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">
            AI Trade Journal
          </span>
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
                  {entry.signal}
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
  const [exitPrice, setExitPrice] = useState<string>("");
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
      signal: signal.asset || "Unknown",
      entryPrice,
      exitPrice: exitPrice ? Number.parseFloat(exitPrice) : undefined,
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

        <div className="flex flex-col gap-2">
          <label
            className="text-xs text-muted-foreground"
            htmlFor="entry-price"
          >
            Entry Price
          </label>
          <input
            id="entry-price"
            type="number"
            value={entryPrice}
            onChange={(e) =>
              setEntryPrice(Number.parseFloat(e.target.value) || 0)
            }
            className="h-9 rounded-lg px-3 text-sm bg-background border border-border text-foreground"
            data-ocid="ai_chat.log_trade.entry_input"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-muted-foreground" htmlFor="exit-price">
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
            id="exit-price"
            type="number"
            value={exitPrice}
            onChange={(e) => setExitPrice(e.target.value)}
            className="h-9 rounded-lg px-3 text-sm bg-background border border-border text-foreground"
            data-ocid="ai_chat.log_trade.exit_input"
            placeholder="Leave blank if trade is open"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-muted-foreground" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm bg-background border border-border text-foreground resize-none"
            rows={2}
            data-ocid="ai_chat.log_trade.notes_textarea"
            placeholder="Trade notes..."
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

// --- Session Recap Modal ---
function RecapModal({
  recap,
  onClose,
}: {
  recap: string;
  onClose: () => void;
}) {
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
  mode,
  onRate,
  onBacktest,
  onLogTrade,
}: {
  message: AiMessageWithSignal;
  index: number;
  mode: AiMode;
  onRate: (msgId: string, rating: 1 | -1) => void;
  onBacktest: (signal: SignalData) => void;
  onLogTrade: (signal: SignalData) => void;
}) {
  const isUser = message.role === "user";
  const { markWin, markLoss } = useSignalAccuracy();
  const providerLabel = AI_PROVIDERS.find(
    (p) => p.provider === message.provider,
  )?.label;
  const signalData = !isUser ? extractSignalData(message.content) : null;
  const signalId = message.signalId;
  const msgId = message.messageId ?? `msg-${message.timestamp}`;

  function copyContent() {
    navigator.clipboard.writeText(message.content);
    toast.success("Copied to clipboard");
  }

  function handleExport() {
    exportAiSignalCard(
      message.content,
      message.provider ?? "default",
      mode,
      signalData ?? undefined,
    );
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
          style={{ height: "115%" }}
        />
      </div>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        {/* Provider + time */}
        <div className="flex items-center gap-2 flex-wrap">
          {providerLabel && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded self-start bg-primary/15 text-primary">
              {providerLabel}
            </span>
          )}
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

        {/* Message bubble */}
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

        {/* Inline signal card */}
        {signalData && (
          <InlineSignalCard
            signal={signalData}
            index={index}
            mode={mode}
            onBacktest={onBacktest}
            onLogTrade={onLogTrade}
          />
        )}

        {/* Action row */}
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

          {/* Rating buttons */}
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

          {/* Win/Loss tracking */}
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
function EmptyState({
  isInsane,
  onSuggestion,
}: {
  isInsane: boolean;
  onSuggestion: (q: string) => void;
}) {
  const suggestions = isInsane
    ? [
        "BTC 10x leverage signal",
        "Best altcoins right now",
        "Short TSLA setup",
        "SOL entry for tonight",
      ]
    : [
        "BTC/USDT signal",
        "ETH long or short?",
        "Top Binance plays today",
        "Scalp setup for SOL",
      ];

  return (
    <div
      data-ocid="ai_chat.empty_state"
      className="flex flex-col items-center justify-center py-16 gap-5 text-center"
    >
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-primary/[0.12] border border-primary/30">
          <Zap className="w-10 h-10 text-primary" strokeWidth={2} />
        </div>
        {isInsane && (
          <div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse bg-destructive"
            aria-hidden="true"
          />
        )}
      </div>
      <div>
        <h2 className="font-display font-bold text-xl text-foreground">
          DemonZeno AI is ready
        </h2>
        <p className="text-muted-foreground text-sm mt-1 max-w-sm">
          {isInsane
            ? "INSANE MODE — Unrestricted signals for any asset on any exchange."
            : "Ask for trading signals with 3 TPs, stop loss & entry. Binance-listed assets."}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
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
        <span className="text-primary/80 font-semibold">Tip:</span> Signals
        include Entry · TP1 · TP2 · TP3 · Stop Loss with Confidence meter
      </p>
    </div>
  );
}

// --- Admin Passcode Prompt ---
function AdminPasscodePrompt({
  onAuthenticated,
}: {
  onAuthenticated: (token: string) => void;
}) {
  const { actor } = useActor(createActor);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit() {
    if (!actor || !code.trim()) return;
    setLoading(true);
    setErr(null);
    try {
      const result = await actor.validatePasscode(code.trim());
      if (result.__kind__ === "ok") {
        onAuthenticated(result.ok);
      } else {
        setErr("Invalid admin passcode.");
      }
    } catch {
      setErr("Connection error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 py-6 px-4">
      <Shield className="w-8 h-8 text-primary" />
      <p className="text-sm font-semibold text-foreground">
        Admin Authentication Required
      </p>
      <div className="flex gap-2 w-full max-w-xs">
        <input
          type="password"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setErr(null);
          }}
          placeholder="Admin passcode"
          className="flex-1 h-8 rounded-lg px-3 text-xs bg-background border border-border text-foreground"
          data-ocid="admin_panel.passcode.input"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        <Button
          size="sm"
          disabled={loading}
          onClick={handleSubmit}
          data-ocid="admin_panel.passcode.submit_button"
          className="h-8 text-xs"
        >
          {loading ? "..." : "Enter"}
        </Button>
      </div>
      {err && <p className="text-xs text-destructive">{err}</p>}
    </div>
  );
}

// ========== MAIN COMPONENT ==========
export function AiChatInterface() {
  const {
    aiSessionToken,
    clearAiSession,
    aiMode,
    setAiMode,
    aiLanguage,
    setAiLanguage,
  } = useAiSession();
  const { sessionToken } = useSession();
  const { invalidate } = useInvalidateAiSession();
  const { send, isLoading } = useSendAiMessage();
  const { actor } = useActor(createActor);
  const { addAiSignal } = useSignalAccuracy();

  const [messages, setMessages] = useState<AiMessageWithSignal[]>([]);
  const [input, setInput] = useState("");
  const [provider, setProvider] = useState<AiProvider>("default");
  const [providerStatuses, setProviderStatuses] = useState<
    Map<AiProvider, boolean>
  >(new Map());
  const [showAccuracy, setShowAccuracy] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [adminSessionToken, setAdminSessionToken] = useState<string | null>(
    sessionToken,
  );
  const [showAdminPasscodePrompt, setShowAdminPasscodePrompt] = useState(false);
  const [mobileToolbarOpen, setMobileToolbarOpen] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [dailyBriefing, setDailyBriefing] = useState<string | null>(null);
  const [recapContent, setRecapContent] = useState<string | null>(null);
  const [logTradeSignal, setLogTradeSignal] = useState<SignalData | null>(null);
  const [isLoadingRecap, setIsLoadingRecap] = useState(false);
  const [isBacktesting, setIsBacktesting] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageCount = messages.length;

  // Fetch provider status on mount
  useEffect(() => {
    if (!actor) return;
    actor
      .getAiProviderStatus()
      .then((statuses) => {
        const map = new Map<AiProvider, boolean>();
        for (const [prov, available] of statuses) {
          map.set(prov as AiProvider, available);
        }
        setProviderStatuses(map);
      })
      .catch(() => {});
  }, [actor]);

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

  // Sync admin session from main context
  useEffect(() => {
    if (sessionToken) setAdminSessionToken(sessionToken);
  }, [sessionToken]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll after messages/loading change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messageCount, isLoading]);

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
        // Silently fail — UI already updated
      }
    },
    [actor, aiSessionToken],
  );

  // Handle signal backtesting
  const handleBacktest = useCallback(
    async (signal: SignalData) => {
      if (!actor || !aiSessionToken || isBacktesting) return;
      setIsBacktesting(true);
      const signalText = `Asset: ${signal.asset}, Entry: ${signal.entry}, TP1: ${signal.tp1}, TP2: ${signal.tp2}, TP3: ${signal.tp3}, SL: ${signal.sl}, Timeframe: ${signal.timeframe}`;
      try {
        const result = await actor.backtestSignal(signalText, aiSessionToken);
        if (result.__kind__ === "ok") {
          const backtestMsg: AiMessageWithSignal = {
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
        provider: m.provider,
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

  // Language change — persist and optionally notify backend
  const handleLanguageChange = useCallback(
    async (lang: string) => {
      setAiLanguage(lang as "en" | "ar" | "es" | "zh");
      if (actor && aiSessionToken) {
        try {
          await actor.setAiLanguage(lang, aiSessionToken);
        } catch {
          /* silently fail */
        }
      }
      toast.success(`Language set to ${LANGUAGE_LABELS[lang]}`);
    },
    [actor, aiSessionToken, setAiLanguage],
  );

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading || !aiSessionToken) return;

    // Check for secret admin unlock phrase
    if (text === ADMIN_TRIGGER) {
      setInput("");
      if (adminSessionToken) {
        setAdminUnlocked(true);
        setAdminPanelOpen(true);
      } else {
        setAdminUnlocked(true);
        setAdminPanelOpen(true);
        setShowAdminPasscodePrompt(true);
      }
      const sysMsg: AiMessage = {
        role: "assistant",
        content:
          "🔐 Admin access unlocked. The admin dashboard is now available for this session.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, sysMsg]);
      return;
    }

    // Check via backend for admin unlock (additional check)
    if (text.includes("/BP2420075112009")) {
      if (actor) {
        try {
          const adminToken = await actor.checkAdminUnlockPhrase(text);
          if (adminToken !== null) {
            setInput("");
            setAdminUnlocked(true);
            setAdminPanelOpen(true);
            if (adminToken) setAdminSessionToken(adminToken);
            const sysMsg: AiMessage = {
              role: "assistant",
              content:
                "🔐 Admin access granted. Dashboard is open for this session.",
              timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, sysMsg]);
            return;
          }
        } catch {
          /* continue to normal send */
        }
      }
    }

    // Apply language instruction suffix
    const langSuffix = LANGUAGE_INSTRUCTION[aiLanguage] ?? "";
    const messageWithLang = langSuffix ? `${text}${langSuffix}` : text;

    const userMsg: AiMessage = {
      role: "user",
      content: text, // Show original, not suffixed
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Pass full history with language instruction
    const historyWithLang = [
      ...messages,
      { ...userMsg, content: messageWithLang },
    ];
    const reply = await send(
      aiSessionToken,
      messageWithLang,
      provider,
      aiMode ?? "normal",
      historyWithLang,
    );

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
          provider: reply.provider ?? "default",
        });
      }
      const newMsg: AiMessageWithSignal = {
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
    provider,
    aiMode,
    aiLanguage,
    messages,
    send,
    addAiSignal,
    adminSessionToken,
    actor,
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

  function toggleMode() {
    setAiMode(aiMode === "normal" ? "insane" : "normal");
  }

  const isInsane = aiMode === "insane";

  const enrichedProviders: AiProviderStatus[] = AI_PROVIDERS.map((p) => ({
    ...p,
    available: providerStatuses.has(p.provider)
      ? (providerStatuses.get(p.provider) ?? false)
      : p.available,
  }));

  return (
    <>
      <div
        data-ocid="ai_chat.panel"
        className="flex flex-col"
        style={{
          height: "100dvh",
          background: isInsane
            ? "linear-gradient(180deg, oklch(0.145 0.01 260) 0%, oklch(0.16 0.02 22) 100%)"
            : "oklch(0.145 0.01 260)",
        }}
      >
        {/* Header */}
        <header
          className="flex items-center gap-2 px-3 py-2.5 shrink-0 bg-card border-b border-border"
          style={{ boxShadow: "0 1px 24px oklch(0 0 0 / 0.3)" }}
        >
          {/* Logo + title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-border">
              <img
                src="/assets/demonzeno-character.png"
                alt="DemonZeno AI"
                className="w-full object-cover object-top"
                style={{ height: "115%" }}
              />
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-sm leading-none text-foreground truncate">
                Demon<span className="text-primary">Zeno</span>{" "}
                <span className="text-muted-foreground font-normal">AI</span>
              </h1>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">
                25+ AI providers
              </p>
            </div>
          </div>

          {/* Mode badge */}
          <div className="flex items-center gap-1 ml-1 shrink-0">
            <ModeBadge mode={aiMode ?? "normal"} onClick={toggleMode} />
          </div>

          {/* Desktop toolbar */}
          <div className="hidden md:flex items-center gap-1.5 ml-auto shrink-0">
            {/* Language selector */}
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

            {/* Provider selector */}
            <Select
              value={provider}
              onValueChange={(v) => setProvider(v as AiProvider)}
            >
              <SelectTrigger
                data-ocid="ai_chat.provider.select"
                className="h-8 text-xs w-36 bg-background border-border"
              >
                <SelectValue placeholder="AI Provider" />
              </SelectTrigger>
              <SelectContent>
                {enrichedProviders.map((p) => (
                  <SelectItem
                    key={p.provider}
                    value={p.provider}
                    className="text-xs"
                  >
                    <span className="flex items-center">
                      <StatusDot available={p.available} />
                      {p.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
            {adminUnlocked && adminSessionToken && (
              <Button
                variant="ghost"
                size="sm"
                data-ocid="ai_chat.admin.open_modal_button"
                onClick={() => setAdminPanelOpen((v) => !v)}
                className="text-primary hover:text-primary h-8 px-2 gap-1 text-xs"
              >
                <Shield className="w-3.5 h-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              data-ocid="ai_chat.clear_button"
              onClick={clearChat}
              className="text-muted-foreground hover:text-foreground h-8 px-2 gap-1 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              data-ocid="ai_chat.logout_button"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground h-8 px-2 gap-1 text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-1 ml-auto shrink-0">
            {adminUnlocked && adminSessionToken && (
              <Button
                variant="ghost"
                size="sm"
                data-ocid="ai_chat.admin.open_modal_button"
                onClick={() => setAdminPanelOpen((v) => !v)}
                className="text-primary h-8 w-8 p-0"
              >
                <Shield className="w-3.5 h-3.5" />
              </Button>
            )}
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
                  data-ocid="ai_chat.language.select"
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
              <Select
                value={provider}
                onValueChange={(v) => {
                  setProvider(v as AiProvider);
                  setMobileToolbarOpen(false);
                }}
              >
                <SelectTrigger
                  data-ocid="ai_chat.provider.select"
                  className="h-8 text-xs flex-1 bg-background border-border"
                >
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  {enrichedProviders.map((p) => (
                    <SelectItem
                      key={p.provider}
                      value={p.provider}
                      className="text-xs"
                    >
                      <span className="flex items-center">
                        <StatusDot available={p.available} />
                        {p.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-1 flex-wrap">
              {[
                {
                  icon: Award,
                  label: "Tracker",
                  action: () => {
                    setShowAccuracy((v) => !v);
                    setMobileToolbarOpen(false);
                  },
                  ocid: "ai_chat.accuracy.toggle",
                },
                {
                  icon: FileText,
                  label: "Journal",
                  action: () => {
                    setShowJournal((v) => !v);
                    setMobileToolbarOpen(false);
                  },
                  ocid: "ai_chat.journal.toggle",
                },
                {
                  icon: Lightbulb,
                  label: "FAQ",
                  action: () => {
                    setShowFaq((v) => !v);
                    setMobileToolbarOpen(false);
                  },
                  ocid: "ai_chat.faq.toggle",
                },
                {
                  icon: BarChart3,
                  label: "Recap",
                  action: () => {
                    handleSessionRecap();
                    setMobileToolbarOpen(false);
                  },
                  ocid: "ai_chat.recap.button",
                },
                {
                  icon: RotateCcw,
                  label: "Clear",
                  action: () => {
                    clearChat();
                    setMobileToolbarOpen(false);
                  },
                  ocid: "ai_chat.clear_button",
                },
                {
                  icon: LogOut,
                  label: "Logout",
                  action: handleLogout,
                  ocid: "ai_chat.logout_button",
                },
              ].map(({ icon: Icon, label, action, ocid }) => (
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

        {/* Admin passcode prompt */}
        {adminUnlocked && showAdminPasscodePrompt && !adminSessionToken && (
          <div className="mx-4 mt-2 rounded-xl border border-primary/30 bg-card">
            <AdminPasscodePrompt
              onAuthenticated={(token) => {
                setAdminSessionToken(token);
                setShowAdminPasscodePrompt(false);
              }}
            />
          </div>
        )}

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-3 md:px-4 py-6"
        >
          <div className="max-w-3xl mx-auto flex flex-col gap-5">
            {messages.length === 0 && (
              <EmptyState
                isInsane={isInsane}
                onSuggestion={(q) => setInput(q)}
              />
            )}

            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.timestamp}
                message={msg}
                index={i + 1}
                mode={aiMode ?? "normal"}
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
              placeholder={
                isInsane
                  ? "Ask anything — no restrictions…"
                  : "Ask for a Binance signal… (Enter to send)"
              }
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
            {isInsane
              ? "⚡ INSANE MODE: Unrestricted AI — No financial advice. Trade at your own risk."
              : "DemonZeno AI may be wrong. Always do your own research. Not financial advice."}
          </p>
        </div>
      </div>

      {/* Admin panel overlay */}
      {adminUnlocked &&
        adminPanelOpen &&
        adminSessionToken &&
        !showAdminPasscodePrompt && (
          <AiAdminPanel
            sessionToken={adminSessionToken}
            onClose={() => setAdminPanelOpen(false)}
          />
        )}

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
    </>
  );
}
