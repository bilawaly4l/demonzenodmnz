import { useState } from "react";

const INITIAL_POSTS = [
  {
    handle: "@crypto_wolf_pk",
    message:
      "Been following @Demon_Zeno on Binance Square for months. First time I actually trust a meme coin launch. Fair start, real person behind it. DMNZ is different.",
  },
  {
    handle: "@blum_trader_88",
    message:
      "No presale, no team allocation — this is what we needed. The Blum bonding curve model means I enter at the same price as everyone else. Exactly what a fair launch should look like.",
  },
  {
    handle: "@holdersunite",
    message:
      "Read the whitepaper. Read the roadmap. The January 2028 burn is a real milestone with a real date. DMNZ has more transparency than projects with entire marketing teams.",
  },
  {
    handle: "@dmnz_community",
    message:
      "April 2, 2027 is marked on my calendar. Blum app is installed. Following @Demon_Zeno since day one. Early believer. Full conviction.",
  },
];

export function DmnzInWildSection() {
  const [posts, setPosts] =
    useState<{ handle: string; message: string }[]>(INITIAL_POSTS);
  const [handle, setHandle] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit() {
    const h = handle.trim();
    const m = message.trim();
    if (!h || !m) {
      setError("Both handle and message are required.");
      return;
    }
    if (m.length > 280) {
      setError("Message must be 280 characters or fewer.");
      return;
    }
    setError("");
    setPosts((prev) => [{ handle: h, message: m }, ...prev]);
    setHandle("");
    setMessage("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <section
      data-ocid="wild.section"
      className="py-20 md:py-24 scroll-anim"
      style={{ background: "#111111" }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="heading-xl mb-4">DMNZ IN THE WILD</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Community posts about DMNZ. Submit yours and be listed here
            alongside other early believers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submit form */}
          <div
            className="card-dmnz"
            style={{ borderColor: "rgba(220,20,60,0.25)" }}
          >
            <h3
              className="font-display font-black text-base uppercase tracking-widest mb-5"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Submit Your Post
            </h3>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                data-ocid="wild.handle_input"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Your Binance Square handle"
                className="w-full px-3 py-2.5 text-sm bg-transparent text-foreground placeholder:text-muted-foreground"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  outline: "none",
                }}
              />
              <textarea
                data-ocid="wild.message_textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What you said about DMNZ (max 280 chars)"
                rows={4}
                className="w-full px-3 py-2.5 text-sm bg-transparent text-foreground placeholder:text-muted-foreground resize-none"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  outline: "none",
                }}
              />
              <div className="text-xs text-muted-foreground text-right">
                {message.length}/280
              </div>
              {error && (
                <p
                  data-ocid="wild.field_error"
                  className="text-xs"
                  style={{ color: "#dc143c" }}
                >
                  {error}
                </p>
              )}
              {submitted && (
                <p
                  data-ocid="wild.success_state"
                  className="text-xs font-bold"
                  style={{ color: "#d4af37" }}
                >
                  Post added. You are now part of the DMNZ record.
                </p>
              )}
              <button
                type="button"
                data-ocid="wild.submit_button"
                onClick={handleSubmit}
                className="btn-primary w-full"
              >
                Submit Your Post
              </button>
            </div>
          </div>

          {/* Post grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {posts.slice(0, 6).map((post, i) => (
              <div
                key={`${post.handle}-${i}`}
                data-ocid={`wild.item.${i + 1}`}
                className="card-dmnz"
                style={{ borderLeft: "2px solid rgba(220,20,60,0.4)" }}
              >
                <p className="text-foreground text-sm leading-relaxed mb-4">
                  {post.message}
                </p>
                <span
                  className="text-xs font-bold uppercase tracking-wide"
                  style={{ color: "#d4af37" }}
                >
                  {post.handle}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
