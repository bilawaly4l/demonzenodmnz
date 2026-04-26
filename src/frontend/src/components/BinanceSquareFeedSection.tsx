import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ExternalLink } from "lucide-react";
import { SiBinance } from "react-icons/si";
import { useBinanceFeed } from "../hooks/useBinanceFeed";
import { ScrollAnimation } from "./ScrollAnimation";

export function BinanceSquareFeedSection() {
  const { posts, isLoading } = useBinanceFeed();

  return (
    <section
      id="binance-feed"
      data-ocid="binance_feed.section"
      className="py-24 bg-muted/30 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <ScrollAnimation>
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest block mb-3">
              Signals Feed
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground">
              Binance Square Feed
            </h2>
            <p className="text-muted-foreground mt-3 text-base">
              Daily free signals and market insights from{" "}
              <a
                href="https://www.binance.com/en/square/profile/@DemonZeno"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                @DemonZeno
              </a>{" "}
              on Binance Square.
            </p>
          </div>
        </ScrollAnimation>

        {isLoading ? (
          <div
            data-ocid="binance_feed.loading_state"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {["a", "b", "c", "d", "e"].map((k) => (
              <div
                key={k}
                className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3"
              >
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div
            data-ocid="binance_feed.empty_state"
            className="flex flex-col items-center gap-5 py-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <SiBinance className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground text-xl">
                No posts yet
              </p>
              <p className="text-muted-foreground text-sm mt-2 max-w-sm">
                Follow{" "}
                <a
                  href="https://www.binance.com/en/square/profile/@DemonZeno"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  @DemonZeno on Binance Square
                </a>{" "}
                for daily free trading signals.
              </p>
            </div>
            <a
              href="https://www.binance.com/en/square/profile/@DemonZeno"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="binance_feed.follow.link"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-smooth hover:opacity-80"
              style={{
                background: "oklch(0.72 0.18 195 / 0.15)",
                color: "oklch(0.72 0.18 195)",
                border: "1px solid oklch(0.72 0.18 195 / 0.3)",
              }}
            >
              <SiBinance className="w-4 h-4" />
              Open Binance Square Profile
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.slice(0, 5).map((post, i) => (
                <ScrollAnimation key={post.id} delay={i * 80}>
                  <div
                    data-ocid={`binance_feed.post.item.${i + 1}`}
                    className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 card-elevated hover:border-primary/30 transition-smooth h-full"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <SiBinance className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-primary truncate">
                          @DemonZeno
                        </p>
                        {post.date && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.date}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-foreground text-sm leading-snug line-clamp-2 mb-1.5">
                        {post.title}
                      </h3>
                      {post.snippet && (
                        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                          {post.snippet}
                        </p>
                      )}
                    </div>

                    <a
                      href={
                        post.url ||
                        "https://www.binance.com/en/square/profile/@DemonZeno"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ocid={`binance_feed.post.link.${i + 1}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mt-auto"
                    >
                      Read on Binance Square
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </ScrollAnimation>
              ))}
            </div>

            <ScrollAnimation delay={200}>
              <div className="mt-8 text-center">
                <a
                  href="https://www.binance.com/en/square/profile/@DemonZeno"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="binance_feed.view_all.link"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-smooth hover:opacity-80"
                  style={{
                    background: "oklch(0.72 0.18 195 / 0.12)",
                    color: "oklch(0.72 0.18 195)",
                    border: "1px solid oklch(0.72 0.18 195 / 0.28)",
                  }}
                >
                  <SiBinance className="w-4 h-4" />
                  View All Posts @DemonZeno
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </ScrollAnimation>
          </>
        )}
      </div>
    </section>
  );
}
