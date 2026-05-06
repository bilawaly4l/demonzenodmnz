import { useState } from "react";
import { useCommunityStats, useSubmitInterest } from "../hooks/useCommunity";

export function PreLaunchInterestSection() {
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const submit = useSubmitInterest();
  const { data: stats } = useCommunityStats();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = handle.trim();
    if (!trimmed.startsWith("@")) {
      setError("Handle must start with @");
      return;
    }
    setError("");
    submit.mutate(trimmed, {
      onSuccess: () => {
        setSuccess(true);
        setHandle("");
      },
      onError: (e) => setError(e.message),
    });
  }

  return (
    <section
      data-ocid="pre_launch_interest.section"
      className="py-16 md:py-20"
      style={{ background: "oklch(0.115 0.015 265)" }}
    >
      <div className="container mx-auto px-4 max-w-xl text-center">
        <div
          className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full"
          style={{
            background: "oklch(0.62 0.16 190 / 0.10)",
            border: "1px solid oklch(0.62 0.16 190 / 0.30)",
          }}
        >
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "oklch(0.62 0.16 190)" }}
          >
            Signal Your Interest
          </span>
        </div>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
          Are You{" "}
          <span style={{ color: "oklch(0.62 0.16 190)" }}>Ready for DMNZ</span>?
        </h2>
        <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
          Enter your Binance Square handle to show your interest in the DMNZ
          launch. No commitment — just letting the community know you&apos;re
          watching.
        </p>

        {stats && (
          <div
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
            style={{
              background: "oklch(0.62 0.16 190 / 0.08)",
              border: "1px solid oklch(0.62 0.16 190 / 0.20)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "oklch(0.62 0.16 190)" }}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: "oklch(0.62 0.16 190)" }}
            >
              {Number(stats.interestCount)} community members interested
            </span>
          </div>
        )}

        <div
          className="rounded-2xl p-7"
          style={{
            background: "oklch(0.14 0.015 260)",
            border: "1px solid oklch(0.62 0.16 190 / 0.25)",
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              data-ocid="pre_launch_interest.input"
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
                className="text-xs"
                style={{ color: "oklch(0.65 0.22 25)" }}
                data-ocid="pre_launch_interest.field_error"
              >
                {error}
              </p>
            )}
            {success && (
              <div
                className="rounded-xl p-3 text-sm font-semibold"
                style={{
                  background: "oklch(0.65 0.18 145 / 0.12)",
                  color: "oklch(0.70 0.16 145)",
                }}
                data-ocid="pre_launch_interest.success_state"
              >
                Interest recorded! You&apos;re watching the launch.
              </div>
            )}
            <button
              type="submit"
              data-ocid="pre_launch_interest.submit_button"
              disabled={submit.isPending}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60"
              style={{
                background: "oklch(0.62 0.16 190)",
                color: "oklch(0.10 0.01 260)",
              }}
            >
              {submit.isPending ? "Recording..." : "I'm Watching DMNZ"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
