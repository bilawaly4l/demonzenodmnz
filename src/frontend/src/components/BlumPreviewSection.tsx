import { ScrollAnimation } from "./ScrollAnimation";

export function BlumPreviewSection() {
  return (
    <section
      id="blum-preview"
      data-ocid="blum_preview.section"
      className="py-24 bg-muted/30 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 70% 50%, oklch(0.65 0.15 190 / 0.05), transparent)",
        }}
      />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text side */}
          <ScrollAnimation direction="left">
            <div className="flex flex-col gap-6">
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">
                Token Launch
              </span>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground leading-tight">
                DMNZ on{" "}
                <span style={{ color: "oklch(0.65 0.15 190)" }}>BLUM</span>
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Launching exclusively as a Telegram Mini App on the BLUM
                platform — April 2, 2028. 100% fair launch, no presale, no
                insiders. The most democratic token launch ever.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Launch Date", value: "April 2, 2028" },
                  { label: "Platform", value: "BLUM — Telegram Mini App" },
                  { label: "Launch Type", value: "100% Fair Launch" },
                  { label: "Presale", value: "None" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2.5 border-b border-border/60 last:border-0"
                  >
                    <span className="text-muted-foreground text-sm">
                      {label}
                    </span>
                    <span
                      className="font-semibold text-sm font-mono"
                      style={{ color: "oklch(0.72 0.18 195)" }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>

          {/* Phone mockup side */}
          <ScrollAnimation direction="right">
            <div className="flex justify-center">
              {/* Floating phone container */}
              <div
                className="animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                {/* Phone frame */}
                <div
                  className="relative w-56 rounded-[2.5rem] border-4 overflow-hidden"
                  style={{
                    background: "oklch(0.12 0.015 260)",
                    borderColor: "oklch(0.65 0.15 190)",
                    boxShadow:
                      "0 0 40px oklch(0.65 0.15 190 / 0.3), 0 20px 60px oklch(0 0 0 / 0.4)",
                    height: "480px",
                  }}
                >
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 rounded-b-2xl bg-card z-20" />

                  {/* Screen content */}
                  <div className="flex flex-col h-full pt-6">
                    {/* Telegram-style header */}
                    <div
                      className="px-4 py-3 flex items-center gap-3 border-b"
                      style={{ borderColor: "oklch(0.65 0.15 190 / 0.2)" }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                        style={{
                          background: "oklch(0.65 0.15 190 / 0.2)",
                          color: "oklch(0.72 0.18 195)",
                        }}
                      >
                        DZ
                      </div>
                      <div>
                        <p
                          className="font-display font-bold text-xs"
                          style={{ color: "oklch(0.72 0.18 195)" }}
                        >
                          DMNZ on BLUM
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Telegram Mini App
                        </p>
                      </div>
                    </div>

                    {/* Mini app content */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
                      {/* Logo area */}
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black font-display"
                        style={{
                          background: "oklch(0.65 0.15 190 / 0.2)",
                          color: "oklch(0.72 0.18 195)",
                          border: "1px solid oklch(0.65 0.15 190 / 0.4)",
                        }}
                      >
                        DZ
                      </div>
                      <p
                        className="font-display font-bold text-base text-center"
                        style={{ color: "oklch(0.72 0.18 195)" }}
                      >
                        DemonZeno (DMNZ)
                      </p>

                      {/* Launch date card */}
                      <div
                        className="w-full rounded-xl p-3 text-center"
                        style={{
                          background: "oklch(0.65 0.22 22 / 0.12)",
                          border: "1px solid oklch(0.65 0.22 22 / 0.35)",
                        }}
                      >
                        <p className="text-xs text-muted-foreground">
                          Fair Launch Date
                        </p>
                        <p
                          className="font-display font-bold text-sm mt-0.5"
                          style={{ color: "oklch(0.75 0.2 22)" }}
                        >
                          April 2, 2028
                        </p>
                      </div>

                      {/* Fake button */}
                      <div
                        className="w-full py-3 rounded-xl text-center text-sm font-bold"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.65 0.15 190), oklch(0.55 0.18 210))",
                          color: "oklch(0.1 0 0)",
                        }}
                      >
                        Fair Launch ⚡
                      </div>

                      <p className="text-xs text-muted-foreground text-center">
                        No presale · No insiders · 100% fair
                      </p>
                    </div>

                    {/* Bottom bar */}
                    <div
                      className="h-12 flex items-center justify-center gap-4 px-4 border-t"
                      style={{ borderColor: "oklch(0.65 0.15 190 / 0.15)" }}
                    >
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      <div
                        className="w-8 h-1 rounded-full"
                        style={{ background: "oklch(0.65 0.15 190 / 0.5)" }}
                      />
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* Phone shadow */}
                <div
                  className="mx-auto mt-2 rounded-full"
                  style={{
                    width: "140px",
                    height: "12px",
                    background: "oklch(0.65 0.15 190 / 0.15)",
                    filter: "blur(8px)",
                  }}
                />
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
