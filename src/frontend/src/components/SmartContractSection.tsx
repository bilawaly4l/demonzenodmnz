import { Clock, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

export function SmartContractSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText("TBA — published on April 2, 2027")
      .catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      data-ocid="contract.section"
      className="py-16 md:py-20"
      style={{ background: "#111111" }}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 mb-5 text-xs font-bold uppercase tracking-widest"
            style={{
              background: "rgba(220,20,60,0.1)",
              border: "1px solid rgba(220,20,60,0.3)",
              borderRadius: "2px",
              color: "#DC143C",
            }}
          >
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            LAUNCHING APRIL 2, 2027
          </span>
          <h2
            className="font-display font-black text-3xl md:text-4xl tracking-tight mb-4"
            style={{ color: "#FFFFFF" }}
          >
            CONTRACT <span style={{ color: "#DC143C" }}>ADDRESS</span>
          </h2>
          <p className="text-sm" style={{ color: "#A0A0A0" }}>
            DMNZ token contract address will be published here on launch day —
            April 2, 2027
          </p>
        </div>

        <div
          className="p-6"
          style={{
            background: "#0a0a0a",
            border: "1px solid rgba(220,20,60,0.4)",
            borderRadius: "4px",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "#A0A0A0" }}
          >
            DMNZ Contract Address (TON / Blum)
          </p>
          <div
            className="flex items-center gap-3 p-4 mb-4"
            style={{
              background: "#111111",
              border: "1px solid rgba(220,20,60,0.25)",
              borderRadius: "2px",
            }}
          >
            <code
              className="flex-1 font-mono text-sm tracking-widest truncate"
              style={{ color: "rgba(220,20,60,0.6)" }}
            >
              0x________________________________ [TBA on Launch Day]
            </code>
            <button
              type="button"
              onClick={handleCopy}
              data-ocid="contract.copy_button"
              aria-label="Copy placeholder address"
              className="shrink-0 p-2 transition-smooth"
              style={{
                color: copied ? "#22c55e" : "#A0A0A0",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "2px",
                background: "transparent",
              }}
            >
              <Copy className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div
            className="flex items-start gap-3 p-4"
            style={{
              background: "rgba(220,20,60,0.06)",
              border: "1px solid rgba(220,20,60,0.2)",
              borderRadius: "2px",
            }}
          >
            <ExternalLink
              className="w-4 h-4 mt-0.5 shrink-0"
              style={{ color: "#DC143C" }}
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed" style={{ color: "#A0A0A0" }}>
              <strong style={{ color: "#DC143C" }}>SECURITY NOTICE:</strong>
              Only trust the contract address displayed on this page or
              published by{" "}
              <a
                href="https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white transition-smooth"
                style={{ color: "#DC143C" }}
              >
                @Demon_Zeno
              </a>{" "}
              on Binance Square. Never buy from unofficial sources.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
