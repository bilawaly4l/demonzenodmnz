export function VisionSection() {
  return (
    <section
      data-ocid="vision.section"
      className="py-16 md:py-24 relative overflow-hidden"
      style={{ background: "oklch(0.10 0.01 260)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, oklch(0.62 0.16 190 / 0.04) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        <h2
          className="font-display font-black uppercase mb-8"
          style={{
            fontSize: "clamp(1.75rem, 4vw, 3rem)",
            letterSpacing: "-0.03em",
            color: "var(--foreground)",
          }}
        >
          THE <span style={{ color: "oklch(0.62 0.16 190)" }}>VISION</span>
        </h2>

        <div
          className="p-8 flex flex-col gap-5"
          style={{
            background: "oklch(0.14 0.015 260)",
            border: "1px solid oklch(0.62 0.16 190 / 0.20)",
            borderLeft: "3px solid oklch(0.62 0.16 190)",
          }}
        >
          <p
            className="font-display font-black text-lg uppercase leading-snug"
            style={{ color: "var(--foreground)", letterSpacing: "-0.01em" }}
          >
            Build the most disciplined meme token community in crypto.
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            Not one more rug. Not one more presale. A fair launch where every
            holder entered at the same price &mdash; and the January 2028 burn
            is a commitment already made, not a promise to be broken.
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
                — DemonZeno
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
