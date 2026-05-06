import { useState } from "react";

const PLEDGE_TEXT =
  "I believe in DMNZ. I will never FUD. I will hold with conviction.";

const RECENT_PLEDGERS = [
  { handle: "@crypto_warrior_pk", time: "2 hours ago" },
  { handle: "@blum_believer", time: "5 hours ago" },
  { handle: "@dmnz_holder_01", time: "1 day ago" },
  { handle: "@zenoarmy", time: "2 days ago" },
  { handle: "@fair_launch_only", time: "3 days ago" },
  { handle: "@hodl_demon", time: "4 days ago" },
];

export function CommunityPledgeSection() {
  const [name, setName] = useState("");
  const [pledged, setPledged] = useState(false);
  const [error, setError] = useState("");

  function handlePledge() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Enter your Binance Square handle.");
      return;
    }
    setError("");
    setPledged(true);
  }

  return (
    <section
      data-ocid="pledge.section"
      className="py-16 md:py-20"
      style={{ background: "#0a0a0a" }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2
            className="font-display font-black text-4xl md:text-5xl tracking-tight"
            style={{ color: "#FFFFFF" }}
          >
            THE DMNZ PLEDGE
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div
            style={{
              background: "#111111",
              border: "1px solid rgba(220,20,60,0.3)",
              padding: "2rem",
            }}
          >
            <div
              className="text-base font-display font-black italic leading-snug mb-6"
              style={{
                color: "#ffffff",
                borderLeft: "3px solid #dc143c",
                paddingLeft: "1rem",
              }}
            >
              &ldquo;{PLEDGE_TEXT}&rdquo;
            </div>

            <div
              className="text-center font-display font-black text-5xl mb-1"
              style={{ color: "#dc143c" }}
            >
              847
            </div>
            <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-8">
              Pledges Taken
            </p>

            {pledged ? (
              <div
                data-ocid="pledge.success_state"
                className="text-center p-4"
                style={{
                  background: "rgba(212,175,55,0.08)",
                  border: "1px solid rgba(212,175,55,0.3)",
                }}
              >
                <div
                  className="font-display font-black text-xl"
                  style={{ color: "#d4af37" }}
                >
                  PLEDGE TAKEN.
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  data-ocid="pledge.input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePledge()}
                  placeholder="@YourHandle"
                  className="w-full px-4 py-3 text-sm bg-transparent text-foreground placeholder:text-muted-foreground"
                  style={{
                    border: "1px solid rgba(255,255,255,0.15)",
                    outline: "none",
                  }}
                />
                {error && (
                  <p
                    data-ocid="pledge.field_error"
                    className="text-xs"
                    style={{ color: "#dc143c" }}
                  >
                    {error}
                  </p>
                )}
                <button
                  type="button"
                  data-ocid="pledge.submit_button"
                  onClick={handlePledge}
                  className="w-full py-3 font-black text-sm uppercase tracking-widest transition-all duration-200"
                  style={{
                    background: "#dc143c",
                    color: "#ffffff",
                  }}
                >
                  Take the Pledge
                </button>
              </div>
            )}
          </div>

          <div>
            <h3
              className="font-display font-black text-xs uppercase tracking-widest mb-5"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Recent Pledgers
            </h3>
            <div className="flex flex-col gap-2">
              {RECENT_PLEDGERS.map((p, i) => (
                <div
                  key={p.handle}
                  data-ocid={`pledge.item.${i + 1}`}
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span
                    className="text-sm font-bold"
                    style={{ color: "#d4af37" }}
                  >
                    {p.handle}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {p.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
