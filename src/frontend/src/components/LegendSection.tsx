export function LegendSection() {
  return (
    <section
      id="story"
      data-ocid="legend.section"
      className="py-16 md:py-20 relative overflow-hidden"
      style={{ background: "oklch(0.10 0.01 260)" }}
    >
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Character image */}
          <div className="flex justify-center md:justify-start">
            <img
              src="/assets/demonzeno-real.png"
              alt="The Legend of DemonZeno"
              className="w-56 md:w-72 drop-shadow-2xl"
              style={{
                clipPath: "inset(0 8% 20% 8%)",
                filter: "contrast(1.08) brightness(0.9)",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/assets/demonzeno-character.png";
              }}
            />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-5">
            <h2
              className="font-display font-black uppercase"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                letterSpacing: "-0.03em",
                lineHeight: "1.05",
                color: "var(--foreground)",
              }}
            >
              THE LEGEND OF{" "}
              <span style={{ color: "oklch(0.62 0.16 190)" }}>DEMONZENO</span>
            </h2>

            <p
              className="text-base font-semibold leading-snug"
              style={{ color: "var(--muted-foreground)" }}
            >
              Not a whale. Not a VC. Not an insider.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              He walked the market alone — disciplined, unbreakable, waiting
              while others panicked. The cold force that turns patience into
              power.
            </p>

            <blockquote
              className="border-l-2 pl-4 text-sm font-bold uppercase tracking-wide"
              style={{
                borderColor: "oklch(0.62 0.16 190)",
                color: "oklch(0.62 0.16 190)",
              }}
            >
              &ldquo;BORN FROM DARKNESS. FORGED IN DISCIPLINE.&rdquo;
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
