const POSTS = [
  {
    id: 1,
    date: "March 2025",
    content:
      "No presale. No allocation. Just a fair start for everyone who believes in something real.",
  },
  {
    id: 2,
    date: "July 2025",
    content:
      "The bonding curve is the closest thing to a truly fair launch that exists in crypto. Nobody buys cheap in the dark. Everyone enters on the same curve.",
  },
  {
    id: 3,
    date: "October 2025",
    content:
      "The January 2028 burn is a commitment to every holder who stayed through the noise.",
  },
  {
    id: 4,
    date: "January 2026",
    content: "A meme coin can have conviction. April 2, 2027 is the beginning.",
  },
  {
    id: 5,
    date: "March 2026",
    content:
      "Every early believer will be remembered. You were here before the world knew.",
  },
];

export function BinancePostsSection() {
  return (
    <section
      data-ocid="binance_posts.section"
      className="py-16 md:py-20"
      style={{ background: "#111111" }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h2
            className="font-display font-black text-3xl md:text-5xl tracking-tight"
            style={{ color: "#FFFFFF" }}
          >
            FROM THE DESK OF <span style={{ color: "#D4AF37" }}>DEMONZENO</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {POSTS.map((post, i) => (
            <div
              key={post.id}
              data-ocid={`binance_posts.item.${i + 1}`}
              className="p-5"
              style={{
                background: "#0a0a0a",
                borderLeft: "3px solid #D4AF37",
              }}
            >
              <div
                className="font-display font-black text-2xl mb-3 leading-none"
                style={{ color: "rgba(212,175,55,0.2)" }}
              >
                &ldquo;
              </div>
              <p
                className="text-sm font-bold leading-relaxed italic mb-4"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                {post.content}
              </p>
              <div className="flex items-center justify-between">
                <div
                  className="text-xs font-bold uppercase tracking-wide"
                  style={{ color: "#D4AF37" }}
                >
                  @Demon_Zeno
                </div>
                <div
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "#606060" }}
                >
                  {post.date}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="binance_posts.follow_button"
            className="btn-primary inline-flex items-center gap-2"
          >
            View All Posts on Binance Square
          </a>
        </div>
      </div>
    </section>
  );
}
