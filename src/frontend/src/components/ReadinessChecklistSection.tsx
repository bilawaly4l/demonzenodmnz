import { useState } from "react";

const CHECKLIST = [
  { id: "telegram", label: "Have Telegram installed" },
  { id: "blum", label: "Have the Blum Mini App" },
  { id: "binance", label: "Follow @Demon_Zeno on Binance Square" },
  { id: "dmnz", label: "Know when to buy — April 2, 2027" },
];

export function ReadinessChecklistSection() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const score = checked.size;
  const allDone = score === CHECKLIST.length;

  return (
    <section
      data-ocid="readiness_checklist.section"
      className="py-16 md:py-20"
      style={{ background: "oklch(0.115 0.015 265)" }}
    >
      <div className="container mx-auto px-4 max-w-xl text-center">
        <h2
          className="font-display font-black text-4xl md:text-5xl tracking-tight mb-2"
          style={{ color: "#FFFFFF" }}
        >
          ARE YOU READY?
        </h2>
        <p
          className="text-xs font-bold uppercase tracking-widest mb-8"
          style={{ color: "oklch(0.62 0.16 190)" }}
        >
          Check off before April 2, 2027
        </p>

        <div
          className="p-6 mb-4"
          style={{
            background: "oklch(0.14 0.015 260)",
            border: `1px solid ${
              allDone ? "oklch(0.65 0.18 145 / 0.50)" : "oklch(0.22 0.01 260)"
            }`,
            transition: "border-color 0.3s",
          }}
        >
          <div className="flex flex-col gap-2 mb-6">
            {CHECKLIST.map(({ id, label }) => {
              const isChecked = checked.has(id);
              return (
                <button
                  key={id}
                  type="button"
                  data-ocid={`readiness_checklist.item.${id}`}
                  onClick={() => toggle(id)}
                  className="flex items-center gap-4 w-full text-left px-4 py-3 transition-all duration-200"
                  style={{
                    background: isChecked
                      ? "oklch(0.65 0.18 145 / 0.10)"
                      : "oklch(0.18 0.01 260)",
                    border: `1px solid ${
                      isChecked
                        ? "oklch(0.65 0.18 145 / 0.40)"
                        : "oklch(0.26 0.01 260)"
                    }`,
                  }}
                >
                  <div
                    className="w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                    style={{
                      borderColor: isChecked
                        ? "oklch(0.65 0.18 145)"
                        : "oklch(0.40 0.01 260)",
                      background: isChecked
                        ? "oklch(0.65 0.18 145)"
                        : "transparent",
                    }}
                  >
                    {isChecked && (
                      <span className="text-xs text-black font-black leading-none">
                        ✓
                      </span>
                    )}
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: isChecked
                        ? "oklch(0.70 0.16 145)"
                        : "oklch(0.80 0.005 260)",
                    }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex-1 h-1 overflow-hidden"
              style={{ background: "oklch(0.20 0.01 260)" }}
            >
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${(score / CHECKLIST.length) * 100}%`,
                  background: allDone
                    ? "oklch(0.65 0.18 145)"
                    : "oklch(0.62 0.16 190)",
                }}
              />
            </div>
            <span
              className="text-xs font-black"
              style={{
                color: allDone
                  ? "oklch(0.65 0.18 145)"
                  : "oklch(0.62 0.16 190)",
              }}
            >
              {score}/{CHECKLIST.length}
            </span>
          </div>

          {allDone && (
            <div
              className="p-3 text-center"
              style={{
                background: "oklch(0.65 0.18 145 / 0.12)",
                border: "1px solid oklch(0.65 0.18 145 / 0.35)",
              }}
              data-ocid="readiness_checklist.success_state"
            >
              <p
                className="font-display font-black text-sm uppercase tracking-widest"
                style={{ color: "oklch(0.70 0.16 145)" }}
              >
                100% READY FOR D-DAY
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
