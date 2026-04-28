import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Bell,
  Download,
  FileText,
  Layers,
  Loader2,
  Plus,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import type {
  BinancePost,
  BurnTracker,
  CommunityCounter,
  Confidence,
  Direction,
  MarketType,
  Timeframe,
} from "../backend";
import { AnnouncementCategory } from "../backend";
import { useAnalytics } from "../hooks/useAnalytics";
import { useAuditLog } from "../hooks/useAuditLog";
import { useSignals } from "../hooks/useSignals";

interface AiAdminPanelProps {
  sessionToken: string;
  onClose: () => void;
}

// ── Signals Tab ──────────────────────────────────────────────────────────────
function SignalsTab({ sessionToken }: { sessionToken: string }) {
  const { data: signals = [], isLoading } = useSignals();
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [asset, setAsset] = useState("BTC/USDT");
  const [entry, setEntry] = useState("");
  const [tp, setTp] = useState("");
  const [sl, setSl] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleDelete(id: string) {
    if (!actor) return;
    setDeleting(id);
    try {
      await actor.deleteSignal(sessionToken, id);
      qc.invalidateQueries({ queryKey: ["signals"] });
      toast.success("Signal deleted");
    } catch {
      toast.error("Failed to delete signal");
    } finally {
      setDeleting(null);
    }
  }

  async function handleAdd() {
    if (!actor || !asset || !entry || !tp || !sl) return;
    setAdding(true);
    try {
      await actor.addSignal(
        sessionToken,
        asset,
        "Crypto" as MarketType,
        "Buy" as Direction,
        entry,
        tp,
        sl,
        tp, // tp1
        tp, // tp2
        tp, // tp3
        "", // notes
        "Medium" as Confidence,
        "DemonZeno AI", // sourceLabel
        "DemonZeno AI", // providerLabel
        null, // expiry
        "Scalp" as Timeframe,
        false,
        null, // publishAt
        null, // templateId
        [], // tags
      );
      qc.invalidateQueries({ queryKey: ["signals"] });
      toast.success("Signal added");
      setShowAdd(false);
      setAsset("BTC/USDT");
      setEntry("");
      setTp("");
      setSl("");
    } catch {
      toast.error("Failed to add signal");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {signals.length} signals
        </span>
        <Button
          size="sm"
          data-ocid="admin_panel.signals.add_button"
          onClick={() => setShowAdd((v) => !v)}
          className="h-7 text-xs gap-1"
          style={{
            background: "oklch(0.65 0.15 190)",
            color: "oklch(0.1 0 0)",
          }}
        >
          <Plus className="w-3 h-3" />
          Add Signal
        </Button>
      </div>

      {showAdd && (
        <div className="rounded-xl p-4 border border-border bg-background flex flex-col gap-2">
          <p className="text-xs font-semibold text-foreground">
            Quick Add Signal
          </p>
          <Input
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            placeholder="Asset (e.g. BTC/USDT)"
            className="h-8 text-xs"
          />
          <div className="grid grid-cols-3 gap-2">
            <Input
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Entry"
              className="h-8 text-xs"
            />
            <Input
              value={tp}
              onChange={(e) => setTp(e.target.value)}
              placeholder="Target"
              className="h-8 text-xs"
            />
            <Input
              value={sl}
              onChange={(e) => setSl(e.target.value)}
              placeholder="Stop Loss"
              className="h-8 text-xs"
            />
          </div>
          <Button
            size="sm"
            disabled={adding}
            onClick={handleAdd}
            data-ocid="admin_panel.signals.submit_button"
            className="h-7 text-xs self-end"
          >
            {adding ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      ) : signals.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">
          No signals yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {signals.map((sig, i) => (
            <div
              key={sig.id}
              data-ocid={`admin_panel.signals.item.${i + 1}`}
              className="flex items-center gap-2 rounded-lg px-3 py-2 bg-background border border-border"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {sig.asset}
                </p>
                <p className="text-xs text-muted-foreground">
                  {sig.direction} · {sig.marketType}
                </p>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">
                {sig.result}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                data-ocid={`admin_panel.signals.delete_button.${i + 1}`}
                onClick={() => handleDelete(sig.id)}
                disabled={deleting === sig.id}
                className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 shrink-0"
              >
                {deleting === sig.id ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Newsletter Tab ────────────────────────────────────────────────────────────
function NewsletterTab({ sessionToken }: { sessionToken: string }) {
  const { actor } = useActor(createActor);
  const [email, setEmail] = useState("");
  const [banning, setBanning] = useState(false);
  const [bannedEmails, setBannedEmails] = useState<string[]>([]);
  const [unbanning, setUnbanning] = useState<string | null>(null);
  const [loadingBanned, setLoadingBanned] = useState(false);

  async function loadBanned() {
    if (!actor) return;
    setLoadingBanned(true);
    try {
      const result = await actor.getBannedEmails(sessionToken);
      if (result.__kind__ === "ok") setBannedEmails(result.ok);
    } catch {
      /* ignore */
    } finally {
      setLoadingBanned(false);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: load banned emails on mount only
  useEffect(() => {
    loadBanned();
  }, []);

  async function handleBan() {
    if (!actor || !email.trim()) return;
    setBanning(true);
    try {
      await actor.banEmail(sessionToken, email.trim());
      toast.success(`Banned ${email}`);
      setEmail("");
      loadBanned();
    } catch {
      toast.error("Failed to ban email");
    } finally {
      setBanning(false);
    }
  }

  async function handleUnban(e: string) {
    if (!actor) return;
    setUnbanning(e);
    try {
      await actor.unbanEmail(sessionToken, e);
      toast.success(`Unbanned ${e}`);
      loadBanned();
    } catch {
      toast.error("Failed to unban email");
    } finally {
      setUnbanning(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          className="h-8 text-xs flex-1"
          data-ocid="admin_panel.newsletter.ban_input"
        />
        <Button
          size="sm"
          disabled={banning || !email.trim()}
          onClick={handleBan}
          data-ocid="admin_panel.newsletter.ban_button"
          className="h-8 text-xs px-3"
          style={{ background: "oklch(0.55 0.22 25 / 0.8)", color: "#fff" }}
        >
          {banning ? <Loader2 className="w-3 h-3 animate-spin" /> : "Ban"}
        </Button>
      </div>

      {loadingBanned ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        </div>
      ) : bannedEmails.length === 0 ? (
        <p className="text-muted-foreground text-xs text-center py-4">
          No banned emails.
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs text-muted-foreground font-semibold">
            Banned ({bannedEmails.length})
          </p>
          {bannedEmails.map((e, i) => (
            <div
              key={e}
              data-ocid={`admin_panel.newsletter.banned.item.${i + 1}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/25"
            >
              <span className="text-xs text-foreground flex-1 truncate">
                {e}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUnban(e)}
                disabled={unbanning === e}
                data-ocid={`admin_panel.newsletter.unban_button.${i + 1}`}
                className="h-6 px-2 text-xs text-primary hover:bg-primary/10 shrink-0"
              >
                {unbanning === e ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  "Unban"
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Announcements Tab ─────────────────────────────────────────────────────────
function AnnouncementsTab({ sessionToken }: { sessionToken: string }) {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!actor || !text.trim()) return;
    setSaving(true);
    try {
      await actor.addAnnouncement(
        sessionToken,
        text.trim(), // title
        text.trim(), // body (same as title for quick post)
        AnnouncementCategory.General,
        link.trim() || null,
        false, // isPinned
        null, // publishAt
      );
      qc.invalidateQueries({ queryKey: ["announcement"] });
      toast.success("Announcement saved");
      setText("");
      setLink("");
    } catch {
      toast.error("Failed to save announcement");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Announcement text…"
        rows={3}
        data-ocid="admin_panel.announcements.textarea"
        className="text-xs resize-none bg-background border-border"
      />
      <Input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Link URL (optional)"
        data-ocid="admin_panel.announcements.link_input"
        className="h-8 text-xs"
      />
      <Button
        size="sm"
        disabled={saving || !text.trim()}
        onClick={handleSave}
        data-ocid="admin_panel.announcements.save_button"
        className="h-8 text-xs"
        style={{
          background: "oklch(0.65 0.15 190)",
          color: "oklch(0.1 0 0)",
        }}
      >
        {saving ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          "Save Announcement"
        )}
      </Button>
    </div>
  );
}

// ── Analytics Tab ─────────────────────────────────────────────────────────────
function AnalyticsTab({ sessionToken }: { sessionToken: string }) {
  const { data: analytics, isLoading } = useAnalytics(sessionToken);
  const { actor } = useActor(createActor);
  const [downloading, setDownloading] = useState(false);

  async function handleCsvDownload() {
    if (!actor) return;
    setDownloading(true);
    try {
      const result = await actor.getAnalyticsCsv(sessionToken);
      if (result.__kind__ === "ok") {
        const blob = new Blob([result.ok], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "demonzeno-analytics.csv";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      toast.error("Failed to download CSV");
    } finally {
      setDownloading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        {[
          {
            label: "Total Notify Me",
            value: Number(analytics?.totalNotifyMe ?? 0),
          },
          {
            label: "By Market",
            value: analytics?.signalsByMarket?.length ?? 0,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl p-3 bg-background border border-border"
          >
            <p className="text-lg font-bold text-primary font-display">
              {item.value}
            </p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>

      {analytics?.signalsByMarket && analytics.signalsByMarket.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-muted-foreground">
            Signals by Market
          </p>
          {analytics.signalsByMarket.map((m, i) => (
            <div
              key={m.market}
              data-ocid={`admin_panel.analytics.market.${i + 1}`}
              className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-background border border-border"
            >
              <span className="text-xs text-foreground">{m.market}</span>
              <span className="text-xs font-bold text-primary">
                {Number(m.count)}
              </span>
            </div>
          ))}
        </div>
      )}

      <Button
        size="sm"
        onClick={handleCsvDownload}
        disabled={downloading}
        data-ocid="admin_panel.analytics.download_button"
        className="h-8 text-xs gap-1"
        variant="outline"
      >
        {downloading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Download className="w-3 h-3" />
        )}
        Download CSV
      </Button>
    </div>
  );
}

// ── Audit Log Tab ─────────────────────────────────────────────────────────────
function AuditLogTab({ sessionToken }: { sessionToken: string }) {
  const { data: entries = [], isLoading } = useAuditLog(sessionToken);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <p className="text-muted-foreground text-sm text-center py-8">
        No audit log entries.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry, i) => (
        <div
          key={entry.id}
          data-ocid={`admin_panel.audit.item.${i + 1}`}
          className="rounded-lg px-3 py-2 bg-background border border-border"
        >
          <p className="text-xs font-semibold text-foreground">
            {entry.action}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(Number(entry.timestamp) / 1_000_000).toLocaleString()} —{" "}
            {entry.details}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Content Tab ───────────────────────────────────────────────────────────────
function ContentTab({ sessionToken }: { sessionToken: string }) {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  // Burn tracker
  const [totalBurned, setTotalBurned] = useState("");
  const [savingBurn, setSavingBurn] = useState(false);

  // Community counter
  const [binanceCount, setBinanceCount] = useState("");
  const [twitterCount, setTwitterCount] = useState("");
  const [savingCounter, setSavingCounter] = useState(false);

  // Binance feed
  const [feedPosts, setFeedPosts] = useState<BinancePost[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postSnippet, setPostSnippet] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [postDate, setPostDate] = useState("");
  const [addingPost, setAddingPost] = useState(false);
  const [deletingPost, setDeletingPost] = useState<string | null>(null);

  async function loadFeed() {
    if (!actor) return;
    setLoadingFeed(true);
    try {
      const posts = await actor.getBinanceFeed();
      setFeedPosts(posts);
    } catch {
      /* ignore */
    } finally {
      setLoadingFeed(false);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: load feed on mount only
  useEffect(() => {
    loadFeed();
  }, []);

  async function handleSaveBurn() {
    if (!actor || !totalBurned.trim()) return;
    setSavingBurn(true);
    try {
      const data: BurnTracker = {
        totalBurned: BigInt(totalBurned.trim()),
        lastUpdated: BigInt(Date.now()) * 1_000_000n,
      };
      const r = await actor.setBurnTracker(sessionToken, data);
      if (r.__kind__ === "ok") {
        qc.invalidateQueries({ queryKey: ["burnTracker"] });
        toast.success("Burn tracker updated");
        setTotalBurned("");
      } else {
        toast.error(r.err);
      }
    } catch {
      toast.error("Failed to update burn tracker");
    } finally {
      setSavingBurn(false);
    }
  }

  async function handleSaveCounter() {
    if (!actor || !binanceCount.trim() || !twitterCount.trim()) return;
    setSavingCounter(true);
    try {
      const data: CommunityCounter = {
        binanceCount: BigInt(binanceCount.trim()),
        twitterCount: BigInt(twitterCount.trim()),
        lastUpdated: BigInt(Date.now()) * 1_000_000n,
      };
      const r = await actor.setCommunityCounter(sessionToken, data);
      if (r.__kind__ === "ok") {
        qc.invalidateQueries({ queryKey: ["communityCounter"] });
        toast.success("Community counter updated");
        setBinanceCount("");
        setTwitterCount("");
      } else {
        toast.error(r.err);
      }
    } catch {
      toast.error("Failed to update community counter");
    } finally {
      setSavingCounter(false);
    }
  }

  async function handleAddPost() {
    if (!actor || !postTitle.trim() || !postUrl.trim() || !postDate.trim())
      return;
    setAddingPost(true);
    try {
      const r = await actor.addBinancePost(
        sessionToken,
        postTitle.trim(),
        postSnippet.trim(),
        postUrl.trim(),
        postDate.trim(),
      );
      if (r.__kind__ === "ok") {
        qc.invalidateQueries({ queryKey: ["binanceFeed"] });
        toast.success("Post added");
        setPostTitle("");
        setPostSnippet("");
        setPostUrl("");
        setPostDate("");
        loadFeed();
      } else {
        toast.error(r.err);
      }
    } catch {
      toast.error("Failed to add post");
    } finally {
      setAddingPost(false);
    }
  }

  async function handleDeletePost(id: string) {
    if (!actor) return;
    setDeletingPost(id);
    try {
      const r = await actor.deleteBinancePost(sessionToken, id);
      if (r.__kind__ === "ok") {
        qc.invalidateQueries({ queryKey: ["binanceFeed"] });
        toast.success("Post deleted");
        loadFeed();
      } else {
        toast.error(r.err);
      }
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeletingPost(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Burn Tracker */}
      <div className="rounded-xl p-4 border border-border bg-background flex flex-col gap-3">
        <p className="text-xs font-bold text-foreground uppercase tracking-widest">
          🔥 Burn Tracker
        </p>
        <div className="flex gap-2">
          <Input
            value={totalBurned}
            onChange={(e) => setTotalBurned(e.target.value)}
            placeholder="Total burned (integer)"
            className="h-8 text-xs flex-1"
            data-ocid="admin_panel.content.burn_input"
            type="number"
          />
          <Button
            size="sm"
            disabled={savingBurn || !totalBurned.trim()}
            onClick={handleSaveBurn}
            data-ocid="admin_panel.content.burn_save_button"
            className="h-8 text-xs px-3 shrink-0"
            style={{
              background: "oklch(0.65 0.15 190)",
              color: "oklch(0.1 0 0)",
            }}
          >
            {savingBurn ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>

      {/* Community Counter */}
      <div className="rounded-xl p-4 border border-border bg-background flex flex-col gap-3">
        <p className="text-xs font-bold text-foreground uppercase tracking-widest">
          👥 Community Counter
        </p>
        <Input
          value={binanceCount}
          onChange={(e) => setBinanceCount(e.target.value)}
          placeholder="Binance followers count"
          className="h-8 text-xs"
          data-ocid="admin_panel.content.binance_count_input"
          type="number"
        />
        <Input
          value={twitterCount}
          onChange={(e) => setTwitterCount(e.target.value)}
          placeholder="Twitter followers count"
          className="h-8 text-xs"
          data-ocid="admin_panel.content.twitter_count_input"
          type="number"
        />
        <Button
          size="sm"
          disabled={
            savingCounter || !binanceCount.trim() || !twitterCount.trim()
          }
          onClick={handleSaveCounter}
          data-ocid="admin_panel.content.counter_save_button"
          className="h-8 text-xs self-end px-4"
          style={{
            background: "oklch(0.65 0.15 190)",
            color: "oklch(0.1 0 0)",
          }}
        >
          {savingCounter ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            "Save"
          )}
        </Button>
      </div>

      {/* Binance Square Feed */}
      <div className="rounded-xl p-4 border border-border bg-background flex flex-col gap-3">
        <p className="text-xs font-bold text-foreground uppercase tracking-widest">
          📡 Binance Square Feed
        </p>
        <Input
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          placeholder="Post title"
          className="h-8 text-xs"
          data-ocid="admin_panel.content.post_title_input"
        />
        <Textarea
          value={postSnippet}
          onChange={(e) => setPostSnippet(e.target.value)}
          placeholder="Snippet / preview text"
          rows={2}
          className="text-xs resize-none bg-background border-border"
          data-ocid="admin_panel.content.post_snippet_input"
        />
        <Input
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
          placeholder="Post URL"
          className="h-8 text-xs"
          data-ocid="admin_panel.content.post_url_input"
        />
        <Input
          value={postDate}
          onChange={(e) => setPostDate(e.target.value)}
          placeholder="Date (e.g. 2025-04-25)"
          className="h-8 text-xs"
          data-ocid="admin_panel.content.post_date_input"
        />
        <Button
          size="sm"
          disabled={
            addingPost ||
            !postTitle.trim() ||
            !postUrl.trim() ||
            !postDate.trim()
          }
          onClick={handleAddPost}
          data-ocid="admin_panel.content.post_add_button"
          className="h-8 text-xs gap-1 self-end px-4"
          style={{
            background: "oklch(0.65 0.15 190)",
            color: "oklch(0.1 0 0)",
          }}
        >
          {addingPost ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <>
              <Plus className="w-3 h-3" />
              Add Post
            </>
          )}
        </Button>

        {/* Feed table */}
        {loadingFeed ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          </div>
        ) : feedPosts.length === 0 ? (
          <p
            className="text-muted-foreground text-xs text-center py-3"
            data-ocid="admin_panel.content.feed.empty_state"
          >
            No posts yet.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5 mt-1">
            <p className="text-xs text-muted-foreground font-semibold">
              Posts ({feedPosts.length})
            </p>
            {feedPosts.map((post, i) => (
              <div
                key={post.id}
                data-ocid={`admin_panel.content.feed.item.${i + 1}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {post.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {post.date}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid={`admin_panel.content.feed.delete_button.${i + 1}`}
                  onClick={() => handleDeletePost(post.id)}
                  disabled={deletingPost === post.id}
                  className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 shrink-0"
                >
                  {deletingPost === post.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Trash2 className="w-3 h-3" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Admin Panel ──────────────────────────────────────────────────────────
export function AiAdminPanel({ sessionToken, onClose }: AiAdminPanelProps) {
  return (
    <div
      data-ocid="admin_panel.dialog"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
      style={{ background: "oklch(0 0 0 / 0.75)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="relative w-full max-w-2xl m-4 rounded-2xl border border-border"
        style={{
          background: "oklch(0.14 0.015 260)",
          boxShadow: "0 32px 80px oklch(0 0 0 / 0.6)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/15 border border-primary/30">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-foreground text-sm">
              Admin Dashboard
            </h2>
            <p className="text-xs text-muted-foreground">
              Session-local · DemonZeno AI Access
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            data-ocid="admin_panel.close_button"
            onClick={onClose}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground shrink-0"
            aria-label="Close admin panel"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="signals" className="w-full">
          <TabsList className="w-full rounded-none border-b border-border bg-transparent h-auto p-0">
            {[
              {
                value: "signals",
                icon: <BarChart3 className="w-3 h-3" />,
                label: "Signals",
              },
              {
                value: "newsletter",
                icon: <Bell className="w-3 h-3" />,
                label: "Newsletter",
              },
              {
                value: "announcements",
                icon: <FileText className="w-3 h-3" />,
                label: "Announce",
              },
              {
                value: "analytics",
                icon: <BarChart3 className="w-3 h-3" />,
                label: "Analytics",
              },
              {
                value: "audit",
                icon: <Shield className="w-3 h-3" />,
                label: "Audit Log",
              },
              {
                value: "content",
                icon: <Layers className="w-3 h-3" />,
                label: "Content",
              },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                data-ocid={`admin_panel.${tab.value}.tab`}
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary text-xs py-3 gap-1"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="h-[460px]">
            <div className="p-5">
              <TabsContent value="signals" className="mt-0">
                <SignalsTab sessionToken={sessionToken} />
              </TabsContent>
              <TabsContent value="newsletter" className="mt-0">
                <NewsletterTab sessionToken={sessionToken} />
              </TabsContent>
              <TabsContent value="announcements" className="mt-0">
                <AnnouncementsTab sessionToken={sessionToken} />
              </TabsContent>
              <TabsContent value="analytics" className="mt-0">
                <AnalyticsTab sessionToken={sessionToken} />
              </TabsContent>
              <TabsContent value="audit" className="mt-0">
                <AuditLogTab sessionToken={sessionToken} />
              </TabsContent>
              <TabsContent value="content" className="mt-0">
                <ContentTab sessionToken={sessionToken} />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}
