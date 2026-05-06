import { useState } from "react";
import { useFirst100, useSubmitFirst100 } from "../hooks/useCommunity";
import type { First100Entry } from "../types";

const OG_LIMIT = 100;

function validateHandle(h: string) {
  const trimmed = h.trim();
  if (!trimmed.startsWith("@")) return "Handle must start with @";
  if (trimmed.length < 3 || trimmed.length > 30)
    return "Must be 3–30 characters";
  return null;
}

export function First100Section() {
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { data: entries = [], isLoading } = useFirst100();
  const submit = useSubmitFirst100();
  const count = entries.length;
  const isFull = count >= OG_LIMIT;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateHandle(handle);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    submit.mutate(handle.trim(), {
      onSuccess: () => {
        setSuccess(true);
        setHandle("");
      },
      onError: (e) => setError(e.message),
    });
  }

  return (
    <section
      data-ocid="first100.section"
      className="py-16 md:py-20"
      style={{ background: "oklch(0.115 0.015 265)" }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full"
            style={{
              background: "oklch(0.70 0.18 70 / 0.10)",
              border: "1px solid oklch(0.70 0.18 70 / 0.35)",
            }}
          >
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "oklch(0.70 0.18 70)" }}
            >
              FIRST 100 OG BELIEVERS
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
            Secure Your{" "}
            <span style={{ color: "oklch(0.70 0.18 70)" }}>OG Status</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
            Only 100 slots available. The first 100 people to pledge their
            Binance Square handle get the exclusive OG Believer badge
            permanently on the wall.
          </p>
          {/* Slot counter */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <span
                className="font-display font-black text-4xl"
                style={{ color: "oklch(0.70 0.18 70)" }}
              >
                {count}/{OG_LIMIT}
              </span>
              <span className="text-sm text-muted-foreground">
                OG slots claimed
              </span>
            </div>
            <div
              className="w-64 h-3 rounded-full overflow-hidden"
              style={{ background: "oklch(0.20 0.01 260)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, (count / OG_LIMIT) * 100)}%`,
                  background:
                    "linear-gradient(90deg, oklch(0.70 0.18 70), oklch(0.65 0.15 70))",
                }}
              />
            </div>
            {isFull && (
              <p className="text-xs" style={{ color: "oklch(0.70 0.18 25)" }}>
                OG slots are full — still join the community below!
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <div
          className="rounded-2xl p-7 mb-8 max-w-lg mx-auto"
          style={{
            background: "oklch(0.14 0.015 260)",
            border: `1px solid ${isFull ? "oklch(0.22 0.01 260)" : "oklch(0.70 0.18 70 / 0.30)"}`,
            opacity: isFull ? 0.7 : 1,
          }}
        >
          {isFull ? (
            <p className="text-center text-sm text-muted-foreground">
              All 100 OG slots are taken. Follow{" "}
              <a
                href="https://www.binance.com/en/square/profile/@Demon_Zeno"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "oklch(0.62 0.16 190)" }}
              >
                @Demon_Zeno
              </a>{" "}
              on Binance Square to stay part of the community.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="og-handle"
                  className="block text-sm font-semibold text-foreground mb-2"
                >
                  Your Binance Square Handle
                </label>
                <input
                  id="og-handle"
                  type="text"
                  data-ocid="first100.input"
                  placeholder="@YourHandle"
                  value={handle}
                  onChange={(e) => {
                    setHandle(e.target.value);
                    setError("");
                    setSuccess(false);
                  }}
                  maxLength={30}
                  className="w-full px-4 py-3 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none"
                  style={{
                    background: "oklch(0.18 0.01 260)",
                    border: error
                      ? "1px solid oklch(0.55 0.22 25 / 0.8)"
                      : "1px solid oklch(0.28 0.01 260)",
                  }}
                />
                {error && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: "oklch(0.65 0.22 25)" }}
                    data-ocid="first100.field_error"
                  >
                    {error}
                  </p>
                )}
              </div>
              {success && (
                <div
                  className="rounded-xl p-3 text-sm font-semibold text-center"
                  style={{
                    background: "oklch(0.65 0.18 145 / 0.12)",
                    color: "oklch(0.70 0.16 145)",
                  }}
                  data-ocid="first100.success_state"
                >
                  OG Believer status secured! Your handle is on the wall.
                </div>
              )}
              <button
                type="submit"
                data-ocid="first100.submit_button"
                disabled={submit.isPending}
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-60"
                style={{
                  background: "oklch(0.70 0.18 70)",
                  color: "oklch(0.10 0.01 260)",
                }}
              >
                {submit.isPending
                  ? "Claiming..."
                  : `Claim OG Slot #${count + 1}`}
              </button>
            </form>
          )}
        </div>

        {/* Wall */}
        {isLoading ? (
          <div className="text-center" data-ocid="first100.loading_state">
            <div
              className="inline-block w-6 h-6 rounded-full border-2 animate-spin"
              style={{
                borderColor: "oklch(0.70 0.18 70)",
                borderTopColor: "transparent",
              }}
            />
          </div>
        ) : entries.length === 0 ? (
          <div
            className="text-center py-8 rounded-2xl"
            data-ocid="first100.empty_state"
            style={{
              background: "oklch(0.14 0.015 260)",
              border: "1px solid oklch(0.22 0.01 260)",
            }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              NO OG BELIEVERS YET
            </p>
            <p className="text-sm text-muted-foreground">
              No OG Believers yet — be the first!
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
            data-ocid="first100.list"
          >
            {entries.map((e: First100Entry, i) => (
              <div
                key={e.handle}
                data-ocid={`first100.item.${i + 1}`}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={{
                  background: "oklch(0.14 0.015 260)",
                  border:
                    i < OG_LIMIT
                      ? "1px solid oklch(0.70 0.18 70 / 0.30)"
                      : "1px solid oklch(0.22 0.01 260)",
                }}
              >
                <span
                  className="font-mono text-xs font-bold shrink-0"
                  style={{
                    color:
                      i < OG_LIMIT
                        ? "oklch(0.70 0.18 70)"
                        : "oklch(0.50 0.01 260)",
                  }}
                >
                  #{i + 1}
                </span>
                <span className="text-xs text-foreground truncate">
                  {e.handle}
                </span>
                {i < OG_LIMIT && (
                  <span
                    className="ml-auto text-xs"
                    style={{ color: "oklch(0.70 0.18 70)" }}
                  >
                    OG
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
