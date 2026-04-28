import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ResultStatus } from "../backend.d";
import { useSignals } from "../hooks/useSignals";
import type { Signal } from "../types";

interface WeekBucket {
  week: string;
  Wins: number;
  Losses: number;
  WinRate: number;
}

const CHART_WIN = "oklch(0.7 0.18 145)";
const CHART_LOSS = "oklch(0.55 0.22 25)";
const CHART_COLORS = [
  "oklch(0.65 0.15 190)",
  "oklch(0.55 0.22 25)",
  "oklch(0.7 0.18 145)",
  "oklch(0.6 0.15 260)",
  "oklch(0.65 0.15 85)",
];

function getWeekKey(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const mon = new Date(d.setDate(diff));
    return mon.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

function buildChartData(signals: Signal[]): WeekBucket[] {
  const buckets = new Map<string, WeekBucket>();
  const completed = signals.filter(
    (s) => s.result === ResultStatus.Win || s.result === ResultStatus.Loss,
  );
  for (const s of completed) {
    const key = getWeekKey(s.datePosted);
    if (!buckets.has(key)) {
      buckets.set(key, { week: key, Wins: 0, Losses: 0, WinRate: 0 });
    }
    const b = buckets.get(key)!;
    if (s.result === ResultStatus.Win) b.Wins++;
    else b.Losses++;
  }
  for (const b of buckets.values()) {
    const total = b.Wins + b.Losses;
    b.WinRate = total > 0 ? Math.round((b.Wins / total) * 100) : 0;
  }
  const ordered: WeekBucket[] = [];
  const seen = new Set<string>();
  for (const s of completed) {
    const key = getWeekKey(s.datePosted);
    if (!seen.has(key)) {
      seen.add(key);
      const b = buckets.get(key);
      if (b) ordered.push(b);
    }
  }
  return ordered;
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg text-sm">
      {label && (
        <p className="font-display font-semibold text-foreground mb-2">
          {label}
        </p>
      )}
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full inline-block shrink-0"
            style={{ background: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Win/Loss Bar Chart ────────────────────────────────────────────────────
function WinLossBarChart({ signals }: { signals: Signal[] }) {
  const chartData = buildChartData(signals);

  if (chartData.length === 0) {
    return (
      <div
        data-ocid="performance_chart.bar.empty_state"
        className="h-48 flex flex-col items-center justify-center gap-3 text-center"
      >
        <span className="text-3xl">📊</span>
        <p className="text-muted-foreground text-sm">
          No completed signals yet
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={chartData}
        margin={{ top: 4, right: 8, left: -16, bottom: 4 }}
        barCategoryGap="30%"
        barGap={4}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="oklch(var(--border))"
          opacity={0.4}
        />
        <XAxis
          dataKey="week"
          tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend
          wrapperStyle={{
            fontSize: 12,
            color: "oklch(var(--muted-foreground))",
          }}
        />
        <Bar dataKey="Wins" fill={CHART_WIN} radius={[4, 4, 0, 0]} />
        <Bar dataKey="Losses" fill={CHART_LOSS} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Win/Loss Donut Chart ─────────────────────────────────────────────────
function WinLossDonut({ signals }: { signals: Signal[] }) {
  const wins = signals.filter((s) => s.result === ResultStatus.Win).length;
  const losses = signals.filter((s) => s.result === ResultStatus.Loss).length;
  const active = signals.filter((s) => s.result === ResultStatus.Active).length;
  const donutData = [
    { name: "Wins", value: wins },
    { name: "Losses", value: losses },
    { name: "Active", value: active },
  ].filter((d) => d.value > 0);

  const total = wins + losses + active;
  const winRate =
    wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0;

  if (total === 0) {
    return (
      <div
        data-ocid="performance_chart.donut.empty_state"
        className="h-40 flex flex-col items-center justify-center gap-2 text-center"
      >
        <p className="text-muted-foreground text-sm">No signal data yet</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0" style={{ width: 140, height: 140 }}>
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              strokeWidth={2}
              stroke="oklch(var(--card))"
            >
              {donutData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-bold text-lg font-mono text-foreground">
            {winRate}%
          </span>
          <span className="text-xs text-muted-foreground">win rate</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {donutData.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm shrink-0"
              style={{
                backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
              }}
            />
            <span className="text-sm text-foreground">{entry.name}</span>
            <span className="text-sm font-mono text-muted-foreground ml-2">
              {entry.value}
            </span>
          </div>
        ))}
        <p className="text-xs text-muted-foreground mt-1">
          {total} total signals
        </p>
      </div>
    </div>
  );
}

// ─── Market Type Bar Chart ─────────────────────────────────────────────────
function MarketTypeChart({ signals }: { signals: Signal[] }) {
  const markets = ["Crypto", "Forex", "Stock"];
  const data = markets
    .map((m) => ({
      name: m,
      count: signals.filter((s) => s.marketType === m).length,
    }))
    .filter((d) => d.count > 0);

  if (data.length === 0) {
    return (
      <div
        data-ocid="performance_chart.market.empty_state"
        className="h-32 flex items-center justify-center text-muted-foreground text-sm"
      >
        No market data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart
        data={data}
        margin={{ top: 4, right: 8, left: -16, bottom: 4 }}
        barCategoryGap="40%"
      >
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<ChartTooltip />} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Main Export — Full Chart Panel ───────────────────────────────────────
export function SignalPerformanceChart() {
  const { data: signals = [], isLoading } = useSignals();

  if (isLoading) {
    return (
      <div data-ocid="performance_chart.loading_state" className="space-y-4">
        {[1, 2].map((n) => (
          <div
            key={n}
            className="h-52 bg-card border border-border rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div data-ocid="performance_chart.panel" className="flex flex-col gap-5">
      {/* Win/Loss Bar Chart */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <p className="text-sm font-semibold text-foreground mb-4">
          Win / Loss by Week
        </p>
        <WinLossBarChart signals={signals} />
      </div>

      {/* Bottom row: donut + market type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-sm font-semibold text-foreground mb-4">
            Win / Loss Ratio
          </p>
          <WinLossDonut signals={signals} />
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-sm font-semibold text-foreground mb-4">
            Signals by Market
          </p>
          <MarketTypeChart signals={signals} />
        </div>
      </div>
    </div>
  );
}
