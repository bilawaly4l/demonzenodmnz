import { ExternalLink } from "lucide-react";
import { Twitter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiBinance } from "react-icons/si";
import { useCommunityCounter } from "../hooks/useCommunityCounter";
import { ScrollAnimation } from "./ScrollAnimation";

function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
    const start = performance.now();
    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.floor(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
      else setValue(target);
    }
    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);

  return value;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

interface StatCardProps {
  icon: React.ReactNode;
  platform: string;
  handle: string;
  count: number;
  url: string;
  color: string;
  accentBg: string;
  borderColor: string;
}

function StatCard({
  icon,
  platform,
  handle,
  count,
  url,
  color,
  accentBg,
  borderColor,
}: StatCardProps) {
  const animated = useCountUp(count);

  return (
    <div
      className="bg-card rounded-2xl p-7 flex flex-col items-center gap-4 border transition-smooth hover:scale-[1.02]"
      style={{ borderColor }}
      data-ocid={`community_counter.${platform.toLowerCase().replace(/\s+/g, "_")}.card`}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
        style={{ background: accentBg, color }}
      >
        {icon}
      </div>
      <div className="text-center">
        <p className="text-muted-foreground text-sm font-medium">{platform}</p>
        <p className="font-mono text-sm font-semibold mt-0.5" style={{ color }}>
          {handle}
        </p>
      </div>
      {count > 0 ? (
        <p
          className="font-display font-black text-5xl leading-none"
          style={{ color }}
        >
          {formatCount(animated)}
        </p>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p className="font-display font-black text-5xl leading-none text-muted-foreground/40">
            0
          </p>
          <p className="text-xs text-muted-foreground">Join us!</p>
        </div>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        data-ocid={`community_counter.${platform.toLowerCase().replace(/\s+/g, "_")}.link`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-smooth hover:opacity-80"
        style={{
          background: accentBg,
          color,
          border: `1px solid ${borderColor}`,
        }}
      >
        Follow {handle}
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}

export function CommunityCounterSection() {
  const { data, isLoading } = useCommunityCounter();
  const binanceCount = data ? Number(data.binanceCount) : 0;
  const twitterCount = data ? Number(data.twitterCount) : 0;

  return (
    <section
      id="community-counter"
      data-ocid="community_counter.section"
      className="py-24 bg-muted/30 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <ScrollAnimation>
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest block mb-3">
              Community
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground">
              Growing Together
            </h2>
            <p className="text-muted-foreground mt-3 text-base">
              Follow DemonZeno for daily free signals and token updates.
            </p>
          </div>
        </ScrollAnimation>

        {isLoading ? (
          <div
            data-ocid="community_counter.loading_state"
            className="grid md:grid-cols-2 gap-6"
          >
            {["bn", "tw"].map((k) => (
              <div
                key={k}
                className="bg-card border border-border rounded-2xl p-7 h-56 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <ScrollAnimation delay={0}>
              <StatCard
                icon={<SiBinance />}
                platform="Binance Square"
                handle="@DemonZeno"
                count={binanceCount}
                url="https://www.binance.com/en/square/profile/@DemonZeno"
                color="oklch(0.72 0.18 195)"
                accentBg="oklch(0.72 0.18 195 / 0.1)"
                borderColor="oklch(0.72 0.18 195 / 0.35)"
              />
            </ScrollAnimation>
            <ScrollAnimation delay={100}>
              <StatCard
                icon={<Twitter className="w-7 h-7" />}
                platform="Twitter / X"
                handle="@ZenoDemon"
                count={twitterCount}
                url="https://twitter.com/ZenoDemon"
                color="oklch(0.7 0.1 220)"
                accentBg="oklch(0.7 0.1 220 / 0.1)"
                borderColor="oklch(0.7 0.1 220 / 0.35)"
              />
            </ScrollAnimation>
          </div>
        )}
      </div>
    </section>
  );
}
