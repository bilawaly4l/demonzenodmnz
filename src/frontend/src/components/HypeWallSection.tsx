import { useState } from "react";
import { useHypeMessages, useSubmitHypeMessage } from "../hooks/useCommunity";
import type { HypeMessage } from "../types";

const MAX_CHARS = 280;

export function HypeWallSection() {
  const [handle, setHandle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { data: messages = [], isLoading } = useHypeMessages();
  const submit = useSubmitHypeMessage();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!handle.trim().startsWith("@")) {
      setError("Handle must start with @");
      return;
    }
    if (!message.trim()) {
      setError("Write your message");
      return;
    }
    if (message.length > MAX_CHARS) {
      setError(`Max ${MAX_CHARS} characters`);
      return;
    }
    setError("");
    submit.mutate(
      { handle: handle.trim(), message: message.trim() },
      {
        onSuccess: () => {
          setSuccess(true);
          setHandle("");
          setMessage("");
        },
        onError: (e) => setError(e.message),
      },
    );
  }

  return (
    <section
      data-ocid="hype_wall.section"
      className="py-16 md:py-20"
      style={{ background: "oklch(0.10 0.01 260)" }}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h2
            className="font-display font-black text-4xl md:text-5xl tracking-tight"
            style={{ color: "#FFFFFF" }}
          >
            THE HYPE WALL
          </h2>
          <p
            className="text-xs font-bold uppercase tracking-widest mt-2"
            style={{ color: "oklch(0.70 0.18 25)" }}
          >
            Why do you believe? Say it.
          </p>
        </div>

        <div
          className="p-7 mb-8 max-w-lg mx-auto"
          style={{
            background: "oklch(0.14 0.015 260)",
            border: "1px solid oklch(0.55 0.22 25 / 0.25)",
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              data-ocid="hype_wall.handle_input"
              placeholder="@YourHandle"
              value={handle}
              onChange={(e) => {
                setHandle(e.target.value);
                setError("");
                setSuccess(false);
              }}
              maxLength={30}
              className="w-full px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
              style={{
                background: "oklch(0.18 0.01 260)",
                border: "1px solid oklch(0.28 0.01 260)",
              }}
            />
            <div className="relative">
              <textarea
                data-ocid="hype_wall.message_input"
                placeholder="Why do you believe in DMNZ?"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value.slice(0, MAX_CHARS));
                  setError("");
                  setSuccess(false);
                }}
                rows={3}
                className="w-full px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
                style={{
                  background: "oklch(0.18 0.01 260)",
                  border: "1px solid oklch(0.28 0.01 260)",
                }}
              />
              <span
                className="absolute bottom-3 right-3 text-xs"
                style={{
                  color:
                    message.length > MAX_CHARS * 0.9
                      ? "oklch(0.70 0.18 25)"
                      : "oklch(0.50 0.01 260)",
                }}
              >
                {message.length}/{MAX_CHARS}
              </span>
            </div>
            {error && (
              <p
                className="text-xs"
                style={{ color: "oklch(0.65 0.22 25)" }}
                data-ocid="hype_wall.field_error"
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
                data-ocid="hype_wall.success_state"
              >
                POSTED.
              </div>
            )}
            <button
              type="submit"
              data-ocid="hype_wall.submit_button"
              disabled={submit.isPending}
              className="py-3 font-black text-sm uppercase tracking-widest transition-all disabled:opacity-60"
              style={{
                background: "oklch(0.55 0.22 25)",
                color: "oklch(0.97 0.002 260)",
              }}
            >
              {submit.isPending ? "Posting..." : "Post to Hype Wall"}
            </button>
          </form>
        </div>

        {isLoading ? (
          <div className="text-center" data-ocid="hype_wall.loading_state">
            <div
              className="inline-block w-5 h-5 rounded-full border-2 animate-spin"
              style={{
                borderColor: "oklch(0.70 0.18 25)",
                borderTopColor: "transparent",
              }}
            />
          </div>
        ) : messages.length === 0 ? (
          <div
            className="text-center py-8"
            data-ocid="hype_wall.empty_state"
            style={{
              background: "oklch(0.14 0.015 260)",
              border: "1px solid oklch(0.22 0.01 260)",
            }}
          >
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              BE THE FIRST TO POST
            </p>
          </div>
        ) : (
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="hype_wall.list"
          >
            {messages.map((m: HypeMessage, i) => (
              <div
                key={`${m.handle}-${i}`}
                data-ocid={`hype_wall.item.${i + 1}`}
                className="p-5 flex flex-col gap-3"
                style={{
                  background: "oklch(0.14 0.015 260)",
                  border: "1px solid oklch(0.22 0.01 260)",
                }}
              >
                <p className="text-sm text-foreground leading-relaxed">
                  {m.message}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span
                    className="text-xs font-bold"
                    style={{ color: "oklch(0.62 0.16 190)" }}
                  >
                    {m.handle}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(
                      Number(m.timestamp) / 1_000_000,
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
