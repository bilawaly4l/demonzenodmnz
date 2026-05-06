import { useState } from "react";
import {
  useEarlyBelievers,
  useSubmitEarlyBeliever,
} from "../hooks/useCommunity";

function validateHandle(h: string) {
  const trimmed = h.trim();
  if (!trimmed.startsWith("@")) return "Handle must start with @";
  if (trimmed.length < 3 || trimmed.length > 30)
    return "Handle must be 3–30 characters";
  return null;
}

export function EarlyBelieverSection() {
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { data: believers = [], isLoading } = useEarlyBelievers();
  const submit = useSubmitEarlyBeliever();

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
      id="community"
      data-ocid="early_believer.section"
      className="py-16 md:py-20"
      style={{ background: "oklch(0.10 0.01 260)" }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h2
            className="font-display font-black text-4xl md:text-5xl tracking-tight mb-2"
            style={{ color: "#FFFFFF" }}
          >
            SIGN YOUR NAME.
          </h2>
          <p
            className="font-display font-bold text-xl md:text-2xl"
            style={{ color: "oklch(0.62 0.16 190)" }}
          >
            JOIN THE MOVEMENT.
          </p>
        </div>

        <div
          className="p-7 mb-8 max-w-lg mx-auto"
          style={{
            background: "oklch(0.14 0.015 260)",
            border: "1px solid oklch(0.62 0.16 190 / 0.25)",
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              id="believer-handle"
              type="text"
              data-ocid="early_believer.input"
              placeholder="@YourHandle"
              value={handle}
              onChange={(e) => {
                setHandle(e.target.value);
                setError("");
                setSuccess(false);
              }}
              maxLength={30}
              className="w-full px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors"
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
                data-ocid="early_believer.field_error"
              >
                {error}
              </p>
            )}
            {success && (
              <div
                className="p-3 text-sm font-black text-center uppercase tracking-widest"
                style={{
                  background: "oklch(0.65 0.18 145 / 0.12)",
                  color: "oklch(0.70 0.16 145)",
                }}
                data-ocid="early_believer.success_state"
              >
                YOU'RE ON THE WALL.
              </div>
            )}
            <button
              type="submit"
              data-ocid="early_believer.submit_button"
              disabled={submit.isPending}
              className="w-full py-3.5 font-black text-sm uppercase tracking-widest transition-all duration-200 disabled:opacity-60"
              style={{
                background: "oklch(0.62 0.16 190)",
                color: "oklch(0.10 0.01 260)",
              }}
            >
              {submit.isPending ? "Submitting..." : "Claim Your Spot"}
            </button>
          </form>
        </div>

        {isLoading ? (
          <div className="text-center" data-ocid="early_believer.loading_state">
            <div
              className="inline-block w-5 h-5 rounded-full border-2 animate-spin"
              style={{
                borderColor: "oklch(0.62 0.16 190)",
                borderTopColor: "transparent",
              }}
            />
          </div>
        ) : believers.length === 0 ? (
          <div
            className="text-center py-8"
            data-ocid="early_believer.empty_state"
            style={{
              background: "oklch(0.14 0.015 260)",
              border: "1px solid oklch(0.22 0.01 260)",
            }}
          >
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              BE THE FIRST
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-muted-foreground text-center mb-4">
              <span
                style={{ color: "oklch(0.62 0.16 190)" }}
                className="font-black"
              >
                {believers.length}
              </span>{" "}
              Early Believers
            </p>
            <div
              className="flex flex-wrap gap-2 justify-center"
              data-ocid="early_believer.list"
            >
              {believers.map((b, i) => (
                <span
                  key={b.handle}
                  data-ocid={`early_believer.item.${i + 1}`}
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide"
                  style={{
                    background: "oklch(0.62 0.16 190 / 0.12)",
                    border: "1px solid oklch(0.62 0.16 190 / 0.30)",
                    color: "oklch(0.62 0.16 190)",
                  }}
                >
                  {b.handle}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
