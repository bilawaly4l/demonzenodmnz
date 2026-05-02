// ─── Trading Plan Worksheet ───────────────────────────────────────────────────

import { Download, FileText } from "lucide-react";
import { useState } from "react";

interface TradingPlanWorksheetProps {
  tierColor: string;
}

const FIELDS: {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}[] = [
  {
    key: "style",
    label: "Trading Style",
    placeholder: "e.g. Swing trader, 4H timeframe",
  },
  {
    key: "pairs",
    label: "Preferred Pairs/Assets",
    placeholder: "e.g. BTC/USDT, EUR/USD, SPY",
  },
  { key: "risk", label: "Risk Per Trade (%)", placeholder: "e.g. 1%" },
  {
    key: "dailyMax",
    label: "Daily Max Loss Limit",
    placeholder: "e.g. 3% of account",
  },
  {
    key: "setupsI",
    label: "Setups I Trade",
    placeholder: "e.g. breakouts, trend pullbacks",
    multiline: true,
  },
  {
    key: "setupsAvoid",
    label: "Setups I Avoid",
    placeholder: "e.g. counter-trend, news spikes",
    multiline: true,
  },
  {
    key: "entryRules",
    label: "Entry Rules",
    placeholder: "e.g. RSI < 40, support bounce with volume",
    multiline: true,
  },
  {
    key: "exitRules",
    label: "Exit Rules",
    placeholder: "e.g. close 50% at 2R, trail remainder",
    multiline: true,
  },
];

export function TradingPlanWorksheet({ tierColor }: TradingPlanWorksheetProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  function handlePrint() {
    const html = `
      <html><head><title>My Trading Plan — DemonZeno Academy</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; max-width: 700px; margin: 40px auto; color: #111; }
        h1 { color: #1a1a2e; font-size: 1.6rem; border-bottom: 2px solid #0a9396; padding-bottom: 8px; }
        .field { margin: 16px 0; }
        .label { font-weight: 700; font-size: 0.85rem; color: #444; text-transform: uppercase; margin-bottom: 4px; }
        .value { border: 1px solid #ccc; border-radius: 6px; padding: 8px 12px; font-size: 0.9rem; min-height: 36px; }
        .footer { margin-top: 40px; font-size: 0.75rem; color: #888; border-top: 1px solid #eee; padding-top: 8px; }
      </style></head><body>
      <h1>😈 My DemonZeno Trading Plan</h1>
      <p style="color:#666;font-size:0.85rem;">Generated: ${new Date().toLocaleDateString()}</p>
      ${FIELDS.map((f) => `<div class="field"><div class="label">${f.label}</div><div class="value">${values[f.key] || "—"}</div></div>`).join("")}
      <div class="footer">DemonZeno Trading Academy — Master the Markets, Slay the Chaos, Trade Like a God.</div>
      </body></html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.print();
  }

  return (
    <div
      className="rounded-xl overflow-hidden my-3"
      style={{
        background: "oklch(0.16 0.01 260)",
        border: `1px solid ${tierColor}30`,
      }}
      data-ocid="academy.trading_plan_worksheet"
    >
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/5 transition-smooth"
        onClick={() => setOpen((p) => !p)}
        data-ocid="academy.trading_plan_toggle"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" style={{ color: tierColor }} />
          <p
            className="font-display font-bold text-xs uppercase tracking-widest"
            style={{ color: tierColor }}
          >
            Build Your Trading Plan
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          {FIELDS.map((f) =>
            f.multiline ? (
              <div key={f.key} className="flex flex-col gap-1">
                <label
                  htmlFor={`plan-${f.key}`}
                  className="text-xs font-semibold"
                  style={{ color: tierColor }}
                >
                  {f.label}
                </label>
                <textarea
                  id={`plan-${f.key}`}
                  value={values[f.key] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [f.key]: e.target.value }))
                  }
                  placeholder={f.placeholder}
                  rows={3}
                  data-ocid={`academy.plan.${f.key}`}
                  className="px-3 py-2 rounded-lg text-xs resize-none focus:outline-none transition-smooth"
                  style={{
                    background: "oklch(0.20 0.01 260)",
                    border: "1px solid oklch(0.28 0.01 260)",
                    color: "oklch(0.85 0.01 260)",
                  }}
                />
              </div>
            ) : (
              <div key={f.key} className="flex flex-col gap-1">
                <label
                  htmlFor={`plan-${f.key}-input`}
                  className="text-xs font-semibold"
                  style={{ color: tierColor }}
                >
                  {f.label}
                </label>
                <input
                  id={`plan-${f.key}-input`}
                  type="text"
                  value={values[f.key] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [f.key]: e.target.value }))
                  }
                  placeholder={f.placeholder}
                  data-ocid={`academy.plan.${f.key}_input`}
                  className="px-3 py-2 rounded-lg text-xs focus:outline-none transition-smooth"
                  style={{
                    background: "oklch(0.20 0.01 260)",
                    border: "1px solid oklch(0.28 0.01 260)",
                    color: "oklch(0.85 0.01 260)",
                  }}
                />
              </div>
            ),
          )}
          <button
            type="button"
            onClick={handlePrint}
            data-ocid="academy.plan.export_button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-smooth self-start"
            style={{ background: tierColor, color: "oklch(0.10 0.01 260)" }}
          >
            <Download className="w-3.5 h-3.5" />
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
}
