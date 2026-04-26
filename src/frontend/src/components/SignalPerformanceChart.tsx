import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
}

function getWeekKey(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    // Get Monday of that week
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
      buckets.set(key, { week: key, Wins: 0, Losses: 0 });
    }
    const b = buckets.get(key)!;
    if (s.result === ResultStatus.Win) b.Wins++;
    else b.Losses++;
  }

  // Sort by first appearance in completed
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

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="font-display font-semibold text-foreground mb-2">
        Week of {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function SignalPerformanceChart() {
  const { data: signals = [], isLoading } = useSignals();
  const chartData = buildChartData(signals);

  if (isLoading) {
    return (
      <div
        data-ocid="performance_chart.loading_state"
        className="h-64 bg-card border border-border rounded-2xl animate-pulse"
      />
    );
  }

  if (chartData.length === 0) {
    return (
      <div
        data-ocid="performance_chart.empty_state"
        className="h-64 bg-card border border-border rounded-2xl flex flex-col items-center justify-center gap-3 text-center p-6"
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-2xl">📊</span>
        </div>
        <p className="font-display font-semibold text-foreground">
          No completed signals yet
        </p>
        <p className="text-muted-foreground text-sm max-w-xs">
          Win/loss trend will appear here once signals are resolved.
        </p>
      </div>
    );
  }

  return (
    <div
      data-ocid="performance_chart.panel"
      className="bg-card border border-border rounded-2xl p-6"
    >
      <ResponsiveContainer width="100%" height={280}>
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
            tick={{ fontSize: 12, fill: "oklch(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "oklch(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              fontSize: 12,
              color: "oklch(var(--muted-foreground))",
            }}
          />
          <Bar
            dataKey="Wins"
            fill="oklch(var(--chart-win))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="Losses"
            fill="oklch(var(--chart-loss))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
