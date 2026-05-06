export function LetterToBelieverSection() {
  return (
    <section
      data-ocid="letter.section"
      className="py-16 md:py-20"
      style={{ background: "#111111" }}
    >
      <div className="max-w-3xl mx-auto px-4">
        <h2
          className="font-display font-black text-4xl md:text-5xl tracking-tight mb-10"
          style={{ color: "#FFFFFF" }}
        >
          TO EARLY BELIEVERS
        </h2>

        <div
          style={{
            background: "rgba(17,17,17,0.9)",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "2.5rem",
          }}
        >
          <p
            className="text-xs font-black uppercase tracking-widest mb-8"
            style={{ color: "rgba(212,175,55,0.6)" }}
          >
            You believed before the world did.
          </p>

          <div className="space-y-4">
            <p
              className="font-display font-black text-lg"
              style={{ color: "#FFFFFF" }}
            >
              You found DMNZ before the charts moved.
            </p>
            <p
              className="font-display font-black text-lg"
              style={{ color: "rgba(255,255,255,0.80)" }}
            >
              You read the roadmap. You understood the fair launch. You saw the
              mission.
            </p>
            <p
              className="font-display font-black text-lg"
              style={{ color: "rgba(255,255,255,0.80)" }}
            >
              The burn in January 2028 is for you. Every milestone on this
              roadmap is for you.
            </p>
            <p
              className="font-display font-black text-xl"
              style={{ color: "oklch(0.62 0.16 190)" }}
            >
              I am committed. I am not going anywhere.
            </p>
          </div>

          <div
            className="mt-8 pt-6 flex flex-col items-end gap-1"
            style={{ borderTop: "2px solid #d4af37" }}
          >
            <span
              className="font-display font-black text-2xl"
              style={{ color: "#d4af37" }}
            >
              DemonZeno
            </span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Creator of DMNZ &nbsp;|&nbsp; @Demon_Zeno on Binance Square
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
