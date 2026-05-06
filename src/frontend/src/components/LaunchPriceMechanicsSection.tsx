export function LaunchPriceMechanicsSection() {
  return (
    <section
      data-ocid="launch_price.section"
      className="py-16 md:py-20"
      style={{ background: "#0a0a0a" }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10">
          <h2
            className="font-display font-black text-4xl md:text-5xl tracking-tight"
            style={{ color: "#FFFFFF" }}
          >
            HOW DMNZ PRICE WORKS
          </h2>
          <p
            className="text-sm font-black uppercase tracking-widest mt-2"
            style={{ color: "#DC143C" }}
          >
            No launch price. There is a bonding curve.
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-10">
          {[
            {
              num: "01",
              title: "DMNZ launches on Blum's bonding curve",
              body: "April 2, 2027. Bonding curve is the only price mechanism — no set price, no IPO.",
            },
            {
              num: "02",
              title: "First buyer gets the lowest price",
              body: "Each buy after the first pushes the price up slightly. No 'insider' price — open to everyone simultaneously.",
            },
            {
              num: "03",
              title: "DMNZ hits the bonding curve target",
              body: "Enough buying moves DMNZ to open DEX trading. The January 2028 burn accelerates this milestone.",
            },
            {
              num: "04",
              title: "DemonZeno does NOT set the price",
              body: "The market does. By design — it's the only honest way to launch.",
            },
          ].map((step, i) => (
            <div
              key={step.num}
              data-ocid={`launch_price.step.${i + 1}`}
              className="flex gap-5 p-5"
              style={{
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.06)",
                borderLeft: "3px solid #DC143C",
              }}
            >
              <div
                className="shrink-0 w-7 h-7 flex items-center justify-center font-mono font-black text-xs"
                style={{ background: "#DC143C", color: "#FFFFFF" }}
              >
                {step.num}
              </div>
              <div>
                <p
                  className="font-display font-black text-sm uppercase tracking-wide mb-1"
                  style={{ color: "#FFFFFF" }}
                >
                  {step.title}
                </p>
                <p className="text-sm" style={{ color: "#A0A0A0" }}>
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="p-5"
          style={{
            background: "#111111",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p
            className="text-xs font-black uppercase tracking-widest mb-5"
            style={{ color: "rgba(255,255,255,0.30)" }}
          >
            Key Questions
          </p>
          <div className="flex flex-col gap-4">
            {[
              {
                q: "What will the price be at launch?",
                a: "Unknown. Set by the bonding curve, not DemonZeno.",
              },
              {
                q: "Can I lose money?",
                a: "Yes. Meme tokens are volatile. Never invest more than you can afford to lose.",
              },
              {
                q: "Is there a guaranteed price target?",
                a: "No. Anyone claiming to predict the DMNZ price is speculating.",
              },
              {
                q: "How is this different from a presale?",
                a: "Presale insiders buy before you at a lower price. With DMNZ, the curve starts fresh at launch — no hidden pre-launch activity.",
              },
            ].map((item, i) => (
              <div
                key={item.q}
                data-ocid={`launch_price.faq.${i + 1}`}
                className="flex flex-col gap-1"
              >
                <p className="text-sm font-bold" style={{ color: "#FFFFFF" }}>
                  {item.q}
                </p>
                <p className="text-sm" style={{ color: "#A0A0A0" }}>
                  {item.a}
                </p>
                {i < 3 && (
                  <div
                    className="mt-3"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
