import { useStats } from "../hooks/useStats";

export function StatsBar() {
  const { data: stats, isLoading } = useStats();

  const items = stats
    ? [
        {
          label: "Total Signals",
          value: stats.totalSignals.toString(),
        },
        {
          label: "Win Rate",
          value: `${stats.winRate.toFixed(1)}%`,
        },
        {
          label: "Markets",
          value: stats.assetsCovered.toString(),
        },
        {
          label: "Assets Covered",
          value: stats.assetsCovered.toString(),
        },
      ]
    : null;

  if (isLoading) {
    return (
      <div data-ocid="stats_bar.loading_state" className="stats-bar">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="stats-item">
            <div className="skeleton h-8 w-16 rounded" />
            <div className="skeleton h-3 w-20 rounded mt-1" />
          </div>
        ))}
      </div>
    );
  }

  if (!items) return null;

  return (
    <div data-ocid="stats_bar.panel" className="stats-bar">
      {items.map(({ label, value }) => (
        <div key={label} className="stats-item">
          <span className="stats-value">{value}</span>
          <span className="stats-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
