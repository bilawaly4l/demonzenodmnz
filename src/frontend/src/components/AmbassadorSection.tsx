const AMBASSADOR = {
  handle: "@dmnz_signal",
  initials: "DS",
  title: "Community Ambassador",
  region: "Pakistan",
  joined: "November 2025",
  quote:
    "I spread the word about DMNZ because I believe in the mission — not for profit, but for principle. This is the first meme coin I have seen that actually treats every buyer equally. No VIP list. No presale friends. Follow @Demon_Zeno and prepare. April 2, 2027 is the real thing.",
  posts: 28,
};

export function AmbassadorSection() {
  return (
    <section
      data-ocid="ambassador.section"
      className="py-20 md:py-24 scroll-anim"
      style={{ background: "#0a0a0a" }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="heading-xl mb-4">AMBASSADOR SPOTLIGHT</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Community members who represent DMNZ with integrity. Curated, not
            self-nominated.
          </p>
        </div>

        <div
          className="max-w-2xl mx-auto card-dmnz"
          style={{
            borderColor: "rgba(212,175,55,0.4)",
            borderWidth: "1px",
            position: "relative",
          }}
        >
          {/* Featured badge */}
          <div
            className="absolute top-4 right-4 px-3 py-1 text-xs font-bold uppercase tracking-widest"
            style={{
              background: "rgba(212,175,55,0.15)",
              border: "1px solid rgba(212,175,55,0.35)",
              color: "#d4af37",
            }}
          >
            Featured
          </div>

          <div className="flex items-start gap-5 mb-6">
            {/* Avatar */}
            <div
              className="w-14 h-14 flex-shrink-0 flex items-center justify-center font-display font-black text-lg"
              style={{
                background: "rgba(212,175,55,0.12)",
                border: "2px solid rgba(212,175,55,0.4)",
                color: "#d4af37",
              }}
            >
              {AMBASSADOR.initials}
            </div>

            <div className="min-w-0">
              <div
                className="font-display font-black text-xl mb-0.5"
                style={{ color: "#d4af37" }}
              >
                {AMBASSADOR.handle}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">
                {AMBASSADOR.title} &nbsp;|&nbsp; {AMBASSADOR.region}
              </div>
            </div>
          </div>

          <div
            className="text-foreground text-sm leading-relaxed italic mb-6"
            style={{
              borderLeft: "2px solid rgba(212,175,55,0.4)",
              paddingLeft: "1rem",
            }}
          >
            &ldquo;{AMBASSADOR.quote}&rdquo;
          </div>

          <div
            className="flex items-center gap-6 pt-5 text-xs text-muted-foreground"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span>
              Joined:{" "}
              <span style={{ color: "rgba(255,255,255,0.7)" }}>
                {AMBASSADOR.joined}
              </span>
            </span>
            <span>
              Binance Square Posts:{" "}
              <span style={{ color: "rgba(255,255,255,0.7)" }}>
                {AMBASSADOR.posts}
              </span>
            </span>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Want to be featured? Spread the word about DMNZ on Binance Square and
          tag{" "}
          <a
            href="https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:opacity-80 transition-smooth"
            style={{ color: "#d4af37" }}
          >
            @Demon_Zeno
          </a>
          .
        </p>
      </div>
    </section>
  );
}
