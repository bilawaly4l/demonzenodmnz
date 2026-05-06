const STEPS = [
  {
    number: "01",
    title: "OPEN BLUM APP",
    note: "Telegram Mini App only. No other platform.",
  },
  {
    number: "02",
    title: "FIND DMNZ TOKEN",
    note: 'Search "DemonZeno" — confirm ticker: DMNZ.',
  },
  {
    number: "03",
    title: "MATCH CONTRACT ADDRESS",
    note: "Published here on April 2, 2027. No exceptions.",
  },
];

export function FairLaunchVerificationSection() {
  return (
    <section
      data-ocid="verification.section"
      className="py-16 md:py-20"
      style={{ background: "#111111" }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h2
            className="font-display font-black text-3xl md:text-5xl tracking-tight mb-3"
            style={{ color: "#FFFFFF" }}
          >
            VERIFY DMNZ <span style={{ color: "#DC143C" }}>ON BLUM</span>
          </h2>
          <p
            className="text-xs uppercase tracking-widest"
            style={{ color: "#606060" }}
          >
            Three steps. No guessing. No trusting strangers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              data-ocid={`verification.step.${i + 1}`}
              className="p-6"
              style={{
                background: "#0a0a0a",
                borderLeft: "3px solid #DC143C",
              }}
            >
              <div
                className="font-display font-black text-5xl leading-none mb-4"
                style={{ color: "rgba(220,20,60,0.12)" }}
              >
                {step.number}
              </div>
              <h3
                className="font-display font-black text-base uppercase tracking-widest mb-3"
                style={{ color: "#FFFFFF" }}
              >
                {step.title}
              </h3>
              <p className="text-xs font-bold" style={{ color: "#D4AF37" }}>
                {step.note}
              </p>
            </div>
          ))}
        </div>

        <div
          className="mt-6 text-center py-3 px-4"
          style={{
            background: "rgba(220,20,60,0.04)",
            border: "1px solid rgba(220,20,60,0.15)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "rgba(220,20,60,0.7)" }}
          >
            Contract address released only on April 2, 2027 — on this site.
          </p>
        </div>
      </div>
    </section>
  );
}
