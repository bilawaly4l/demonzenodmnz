export function OriginStorySection() {
  return (
    <section
      data-ocid="origin_story.section"
      className="py-16 md:py-20"
      style={{ background: "oklch(0.115 0.015 265)" }}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <h2
          className="font-display font-black uppercase mb-10"
          style={{
            fontSize: "clamp(1.75rem, 4vw, 3rem)",
            letterSpacing: "-0.03em",
            color: "var(--foreground)",
          }}
        >
          WHO IS <span style={{ color: "oklch(0.70 0.18 70)" }}>DEMONZENO</span>
          ?
        </h2>

        <div
          className="p-8 flex flex-col gap-5 relative"
          style={{
            background: "oklch(0.14 0.015 260)",
            border: "1px solid oklch(0.22 0.01 260)",
            borderLeft: "3px solid oklch(0.70 0.18 70)",
          }}
        >
          <p
            className="text-base font-bold leading-snug"
            style={{ color: "var(--foreground)" }}
          >
            I was tired of the rigged game. I built DMNZ so no one holds an
            advantage over you.
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            I started with a chart and an obsession. Every loss was a lesson I
            couldn&apos;t afford to repeat.
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            DMNZ is the token of that journey &mdash; 100% fair launch, no
            presale, no team tokens. Everyone in at the same price. That&apos;s
            the foundation.
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            The January 2028 burn is my commitment. I won&apos;t disappear. I
            won&apos;t dump. This is a long game.
          </p>

          <div
            className="pt-4 border-t flex items-center gap-3"
            style={{ borderColor: "oklch(0.22 0.01 260)" }}
          >
            <img
              src="/assets/demonzeno-real.png"
              alt="DemonZeno"
              className="w-10 h-10 rounded-full object-cover object-top"
              style={{ border: "2px solid oklch(0.62 0.16 190 / 0.50)" }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/assets/demonzeno-character.png";
              }}
            />
            <div>
              <p className="font-display font-bold text-foreground text-sm">
                DemonZeno
              </p>
              <a
                href="https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:underline"
                style={{ color: "oklch(0.62 0.16 190)" }}
              >
                @Demon_Zeno on Binance Square
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
