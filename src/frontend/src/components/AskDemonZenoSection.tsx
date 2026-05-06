import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQS = [
  {
    q: "When does DMNZ launch?",
    a: "April 2, 2027. On Blum Mini App. That date does not move.",
  },
  {
    q: "How do I buy DMNZ?",
    a: "Follow @Demon_Zeno on Binance Square. Then open Blum Mini App inside Telegram, find DemonZeno DMNZ, and buy.",
  },
  {
    q: "Why Blum?",
    a: "Fair-launch bonding curve. No presale, no insider access — every buyer enters at the same starting price.",
  },
  {
    q: "Will there be more tokens created after launch?",
    a: "No. Supply is fixed at launch. The January 2028 burn reduces it further.",
  },
  {
    q: "What happens on January 1, 2028?",
    a: "Massive buyback and permanent burn. DemonZeno sends DMNZ to a provably dead wallet — forever.",
  },
  {
    q: "Can I sell DMNZ after buying?",
    a: "Yes. Through Blum, the same way you bought. No lock-up period.",
  },
  {
    q: "Is DMNZ available on any other platform?",
    a: "Only Blum at launch. Any other listing before April 2, 2027 is fake — do not interact.",
  },
  {
    q: "How do I know this is not a rug pull?",
    a: "Public identity. No team tokens. No presale. The creator's reputation is permanently attached. That is the accountability.",
  },
  {
    q: "What is the maximum supply?",
    a: "1 billion DMNZ. The January 2028 burn permanently decreases it.",
  },
  {
    q: "What if I miss the launch on April 2, 2027?",
    a: "DMNZ continues trading on Blum. But early buyers get lower bonding curve prices — missing launch means paying whatever the market has set.",
  },
  {
    q: "Is DemonZeno buying DMNZ himself?",
    a: "Yes. Through the same Blum interface as everyone else, on launch day, at the same bonding curve price.",
  },
  {
    q: "How do I contact DemonZeno?",
    a: "@Demon_Zeno on Binance Square only. I do not DM about investments. If someone claiming to be me contacts you privately, it is a scam.",
  },
];

function FAQItem({
  faq,
  index,
}: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: "1px solid var(--border)",
      }}
    >
      <button
        type="button"
        data-ocid={`ask_demonzeno.faq.item.${index + 1}`}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left transition-colors duration-200"
        aria-expanded={open}
      >
        <span
          className="text-sm font-bold leading-snug pr-2"
          style={{ color: "var(--foreground)" }}
        >
          {faq.q}
        </span>
        <ChevronDown
          className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
          style={{
            color: open ? "var(--primary)" : "var(--muted-foreground)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      {open && (
        <div className="pb-4">
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            {faq.a}
          </p>
        </div>
      )}
    </div>
  );
}

export function AskDemonZenoSection() {
  return (
    <section
      id="faq"
      data-ocid="ask_demonzeno.section"
      className="py-16 md:py-20"
      style={{ background: "var(--background)" }}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-10">
          <h2
            className="font-display font-black text-4xl md:text-5xl tracking-tight"
            style={{ color: "#FFFFFF" }}
          >
            ASK DEMONZENO
          </h2>
          <p
            className="text-xs font-bold uppercase tracking-widest mt-2"
            style={{ color: "var(--muted-foreground)" }}
          >
            Direct answers. No marketing. No spin.
          </p>
        </div>

        <div
          data-ocid="ask_demonzeno.faq.list"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            padding: "0 1.5rem",
          }}
        >
          {FAQS.map((faq, i) => (
            <FAQItem key={faq.q} faq={faq} index={i} />
          ))}
        </div>

        <p
          className="text-xs text-center mt-6"
          style={{ color: "var(--muted-foreground)" }}
        >
          More questions?{" "}
          <a
            href="https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="ask_demonzeno.binance.link"
            className="font-bold"
            style={{ color: "var(--primary)" }}
          >
            Ask on Binance Square @Demon_Zeno
          </a>
        </p>
      </div>
    </section>
  );
}
