import { Timeframe as TfEnum } from "../backend";
import type { MarketFilter, Timeframe } from "../types";

interface FilterBarProps {
  active: MarketFilter;
  onChange: (filter: MarketFilter) => void;
  activeTimeframe?: Timeframe | "All";
  onTimeframeChange?: (tf: Timeframe | "All") => void;
}

const MARKET_FILTERS: MarketFilter[] = ["All", "Crypto", "Forex", "Stocks"];
const TIMEFRAME_FILTERS: Array<{ value: Timeframe | "All"; label: string }> = [
  { value: "All" as const, label: "All" },
  { value: TfEnum.Scalp, label: "Scalp" },
  { value: TfEnum.Swing, label: "Swing" },
  { value: TfEnum.LongTerm, label: "Long-term" },
];

function TabGroup<T extends string>({
  items,
  active,
  onChange,
  ocidPrefix,
  labelMap,
}: {
  items: T[];
  active: T;
  onChange: (v: T) => void;
  ocidPrefix: string;
  labelMap?: Record<string, string>;
}) {
  return (
    <div
      className="flex gap-1 bg-card border border-border rounded-xl p-1 w-fit"
      role="tablist"
    >
      {items.map((item) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={active === item}
          data-ocid={`${ocidPrefix}.${item.toLowerCase()}.tab`}
          onClick={() => onChange(item)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth ${
            active === item
              ? "bg-primary text-primary-foreground shadow-subtle"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          {labelMap?.[item] ?? item}
        </button>
      ))}
    </div>
  );
}

export function FilterBar({
  active,
  onChange,
  activeTimeframe = "All",
  onTimeframeChange,
}: FilterBarProps) {
  const timeframeValues = TIMEFRAME_FILTERS.map((t) => t.value);
  const labelMap = Object.fromEntries(
    TIMEFRAME_FILTERS.map((t) => [t.value, t.label]),
  ) as Record<string, string>;

  return (
    <div
      data-ocid="signals.filter.tab"
      className="flex flex-col items-center gap-2"
      aria-label="Filter signals"
    >
      <TabGroup
        items={MARKET_FILTERS}
        active={active}
        onChange={onChange}
        ocidPrefix="signals.market_filter"
      />
      {onTimeframeChange && (
        <TabGroup
          items={timeframeValues}
          active={activeTimeframe}
          onChange={onTimeframeChange}
          ocidPrefix="signals.timeframe_filter"
          labelMap={labelMap}
        />
      )}
    </div>
  );
}
