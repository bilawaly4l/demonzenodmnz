import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText } from "lucide-react";
import { createActor } from "../backend";
import type { WhitepaperContent } from "../types";
import { ScrollAnimation } from "./ScrollAnimation";

function useWhitepaper() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<WhitepaperContent>({
    queryKey: ["whitepaper"],
    queryFn: async () => {
      if (!actor) return { title: "", updatedAt: BigInt(0), sections: [] };
      return actor.getWhitepaper();
    },
    enabled: !!actor && !isFetching,
    staleTime: 600_000,
  });
}

const FALLBACK: WhitepaperContent = {
  title: "DemonZeno (DMNZ) — Token One-Pager",
  updatedAt: BigInt(0),
  sections: [
    {
      title: "Overview",
      content:
        "DemonZeno (DMNZ) is an anime-inspired meme token launching on April 2, 2028 via Telegram Mini App on Blum. It is 100% fair launch — no presale, no private sale, no VC allocation.",
    },
    {
      title: "Mission",
      content:
        "To democratize trading intelligence through free daily signals, an AI-powered platform, and a community-owned token that puts power in the hands of every trader.",
    },
    {
      title: "Token",
      content:
        "Ticker: DMNZ | Platform: Blum (Telegram Mini App) | Launch: April 2, 2028 | Type: Meme Token, 100% Fair Launch | Supply: To be announced at launch",
    },
    {
      title: "Tokenomics",
      content:
        "100% Fair Launch. Zero presale. Zero insider allocation. Zero vesting schedules. Every participant gets in on equal terms — the way a community token should be.",
    },
    {
      title: "Roadmap",
      content:
        "2026: Community building on Binance Square and Twitter, growing the DemonZeno signal following. 2027: DMNZ token launch via BLUM mini app on Telegram. 2028: Massive Buyback & Burn campaign to reduce supply, increase price, and trigger the bonding curve for exchange listings.",
    },
    {
      title: "Community",
      content:
        "Follow DemonZeno on Binance Square (@DemonZeno) for daily free trading signals. Follow on Twitter (@ZenoDemon) for market updates and token news.",
    },
    {
      title: "Disclaimer",
      content:
        "DMNZ is a meme token created for entertainment and community purposes. This document does not constitute financial advice. All trading involves significant risk. Never invest more than you can afford to lose.",
    },
  ],
};

export function WhitepaperSection() {
  const { data, isLoading } = useWhitepaper();
  const wp = data && data.sections.length > 0 ? data : FALLBACK;

  function handlePrint() {
    window.print();
  }

  return (
    <section
      id="whitepaper"
      data-ocid="whitepaper.section"
      className="py-20 bg-muted/30"
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-8 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Document
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              DMNZ One-Pager
            </h2>
            <p className="text-muted-foreground text-sm">
              Everything you need to know about DemonZeno and DMNZ in one
              document.
            </p>
            <Button
              data-ocid="whitepaper.download.button"
              onClick={handlePrint}
              variant="outline"
              className="border-primary/40 text-primary hover:bg-primary/10 gap-2 w-fit mx-auto mt-2"
            >
              <Download className="w-4 h-4" />
              Download / Print
            </Button>
          </div>
        </ScrollAnimation>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((k) => (
              <Skeleton key={k} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : (
          <ScrollAnimation delay={100}>
            {/* Printable document */}
            <div
              id="whitepaper-doc"
              data-ocid="whitepaper.document.panel"
              className="bg-card border border-border rounded-2xl p-8 card-elevated print:shadow-none print:border-0"
            >
              {/* Document header */}
              <div className="flex items-start justify-between gap-4 mb-8 pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-display font-bold text-foreground text-xl">
                      {wp.title}
                    </h1>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      DemonZeno · DMNZ Token ·{" "}
                      {wp.updatedAt && Number(wp.updatedAt) > 0
                        ? `Updated ${new Date(Number(wp.updatedAt) / 1_000_000).toLocaleDateString()}`
                        : "Version 1.0 — April 2028 Launch Edition"}
                    </p>
                  </div>
                </div>
                <div
                  className="shrink-0 px-3 py-1.5 rounded-full border text-xs font-bold uppercase"
                  style={{
                    borderColor: "oklch(0.65 0.15 190 / 0.4)",
                    color: "oklch(0.65 0.15 190)",
                    background: "oklch(0.65 0.15 190 / 0.08)",
                  }}
                >
                  DMNZ
                </div>
              </div>

              {/* Sections */}
              <div className="flex flex-col gap-7">
                {wp.sections.map((section, i) => (
                  <div
                    key={section.title}
                    data-ocid={`whitepaper.section.${i + 1}`}
                    className="flex flex-col gap-3"
                  >
                    <h3 className="font-display font-bold text-foreground text-base flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {section.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed pl-3.5">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between gap-4 flex-wrap">
                <p className="text-muted-foreground text-xs">
                  © {new Date().getFullYear()} DemonZeno ·{" "}
                  <span className="text-primary">@DemonZeno</span> on Binance
                  Square
                </p>
                <p className="text-muted-foreground text-xs">
                  Launch: April 2, 2028 · Blum Mini App
                </p>
              </div>
            </div>
          </ScrollAnimation>
        )}
      </div>
    </section>
  );
}
