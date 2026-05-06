import { ChevronDown } from "lucide-react";
import { useState } from "react";

const DMNZ_TERMS = [
  {
    term: "Bonding Curve",
    def: "Price automatically rises as more tokens are bought. Early buyers pay less — every purchase after them pushes the price higher.",
  },
  {
    term: "Buyback",
    def: "The project buys tokens back from the open market. For DMNZ this happens January 2028, immediately before the burn.",
  },
  {
    term: "Burn",
    def: "Tokens sent to a dead wallet permanently — gone from circulation forever. DMNZ burns 50% of supply on January 1, 2028.",
  },
  {
    term: "Fair Launch",
    def: "No presale. No private rounds. No team allocation. Everyone enters at the same price on the same day. The rarest thing in crypto.",
  },
  {
    term: "Meme Coin",
    def: "Community-driven token without traditional utility — but DMNZ backs it with a defined roadmap, a real burn event, and discipline.",
  },
  {
    term: "DMNZ",
    def: "The DemonZeno token. Launches April 2, 2027 via Blum Mini App. 100% fair launch, no team allocation, and a 50% supply burn in January 2028.",
  },
  {
    term: "OG Believer",
    def: "A title for the first 100 people who register on the DMNZ website before launch — permanently listed as founding community members.",
  },
  {
    term: "Blum Mini App",
    def: "A Telegram-based crypto launchpad. DMNZ launches exclusively here on April 2, 2027. You need Telegram — no separate wallet required.",
  },
];

export function GlossarySection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      id="glossary"
      data-ocid="glossary_simple.section"
      className="py-14 md:py-16"
      style={{ background: "oklch(0.115 0.015 265)" }}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h2
            className="font-display font-black text-4xl md:text-5xl tracking-tight"
            style={{ color: "#FFFFFF" }}
          >
            GLOSSARY
          </h2>
          <p
            className="text-xs font-bold uppercase tracking-widest mt-2"
            style={{ color: "oklch(0.62 0.16 190)" }}
          >
            Key DMNZ terms. One sentence each.
          </p>
        </div>

        <div className="flex flex-col gap-1.5" data-ocid="glossary_simple.list">
          {DMNZ_TERMS.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={item.term}
                data-ocid={`glossary_simple.item.${i + 1}`}
                className="overflow-hidden"
                style={{
                  background: "oklch(0.14 0.015 260)",
                  border: isOpen
                    ? "1px solid oklch(0.62 0.16 190 / 0.40)"
                    : "1px solid oklch(0.22 0.01 260)",
                  transition: "border-color 0.2s",
                }}
              >
                <button
                  type="button"
                  data-ocid={`glossary_simple.toggle.${i + 1}`}
                  className="w-full text-left flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span
                    className="font-display font-black text-sm uppercase tracking-wide"
                    style={{
                      color: isOpen
                        ? "oklch(0.62 0.16 190)"
                        : "oklch(0.90 0.005 260)",
                    }}
                  >
                    {item.term}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? "200px" : "0" }}
                >
                  <p className="px-5 pb-4 text-sm text-muted-foreground">
                    {item.def}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
