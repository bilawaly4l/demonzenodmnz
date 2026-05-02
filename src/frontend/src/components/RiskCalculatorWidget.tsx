// ─── Risk Calculator Widget ───────────────────────────────────────────────────

import { Calculator } from "lucide-react";
import { useState } from "react";

interface RiskCalculatorWidgetProps {
  tierColor: string;
}

export function RiskCalculatorWidget({ tierColor }: RiskCalculatorWidgetProps) {
  const [accountSize, setAccountSize] = useState("");
  const [riskPct, setRiskPct] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");

  const acc = Number.parseFloat(accountSize) || 0;
  const rp = Number.parseFloat(riskPct) || 0;
  const ep = Number.parseFloat(entryPrice) || 0;
  const sl = Number.parseFloat(stopLoss) || 0;
  const tp = Number.parseFloat(takeProfit) || 0;

  const dollarRisk = acc * (rp / 100);
  const slDist = Math.abs(ep - sl);
  const units = slDist > 0 ? dollarRisk / slDist : 0;
  const tpDist = Math.abs(tp - ep);
  const rrRatio = slDist > 0 ? tpDist / slDist : 0;
  const isValid = acc > 0 && rp > 0 && ep > 0 && sl > 0;

  const inputStyle = {
    background: "oklch(0.20 0.01 260)",
    border: "1px solid oklch(0.28 0.01 260)",
    color: "oklch(0.85 0.01 260)",
  };

  return (
    <div
      className="rounded-xl overflow-hidden my-3"
      style={{
        background: "oklch(0.16 0.01 260)",
        border: `1px solid ${tierColor}30`,
      }}
      data-ocid="academy.risk_calculator"
    >
      <div
        className="px-4 py-2.5 flex items-center gap-2"
        style={{
          background: `${tierColor}10`,
          borderBottom: `1px solid ${tierColor}20`,
        }}
      >
        <Calculator className="w-4 h-4" style={{ color: tierColor }} />
        <p
          className="font-display font-bold text-xs uppercase tracking-widest"
          style={{ color: tierColor }}
        >
          Risk Calculator
        </p>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          {(
            [
              [
                "Account Size ($)",
                accountSize,
                setAccountSize,
                "academy.risk_calc.account",
              ],
              ["Risk %", riskPct, setRiskPct, "academy.risk_calc.risk_pct"],
              [
                "Entry Price",
                entryPrice,
                setEntryPrice,
                "academy.risk_calc.entry",
              ],
              ["Stop Loss", stopLoss, setStopLoss, "academy.risk_calc.sl"],
              [
                "Take Profit (opt)",
                takeProfit,
                setTakeProfit,
                "academy.risk_calc.tp",
              ],
            ] as [string, string, (v: string) => void, string][]
          ).map(([label, val, setter, ocid]) => (
            <div key={label} className="flex flex-col gap-1">
              <label htmlFor={ocid} className="text-xs text-muted-foreground">
                {label}
              </label>
              <input
                id={ocid}
                type="number"
                value={val}
                onChange={(e) => setter(e.target.value)}
                placeholder="0"
                data-ocid={ocid}
                className="px-3 py-2 rounded-lg text-xs focus:outline-none transition-smooth"
                style={inputStyle}
              />
            </div>
          ))}
        </div>
        {isValid && (
          <div
            className="rounded-lg p-3 grid grid-cols-2 gap-2"
            style={{
              background: `${tierColor}08`,
              border: `1px solid ${tierColor}20`,
            }}
          >
            <div>
              <p className="text-xs text-muted-foreground">Dollar Risk</p>
              <p className="text-sm font-bold" style={{ color: tierColor }}>
                ${dollarRisk.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Position Size</p>
              <p className="text-sm font-bold" style={{ color: tierColor }}>
                {units.toFixed(4)} units
              </p>
            </div>
            {tp > 0 && (
              <div>
                <p className="text-xs text-muted-foreground">R:R Ratio</p>
                <p
                  className="text-sm font-bold"
                  style={{
                    color: rrRatio >= 2 ? "oklch(0.70 0.18 145)" : tierColor,
                  }}
                >
                  1:{rrRatio.toFixed(2)}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">SL Distance</p>
              <p className="text-sm font-bold" style={{ color: tierColor }}>
                {slDist.toFixed(4)}
              </p>
            </div>
          </div>
        )}
        {!isValid && (
          <p className="text-xs text-muted-foreground text-center py-2">
            Fill in Account Size, Risk %, Entry Price, and Stop Loss to
            calculate.
          </p>
        )}
      </div>
    </div>
  );
}
