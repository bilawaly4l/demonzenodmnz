import List "mo:core/List";
import Map "mo:core/Map";
import Set "mo:core/Set";

import SignalTypes "types/signals";
import FaqTypes "types/faqs";
import AnnTypes "types/announcements";
import AuditTypes "types/audit";
import CommunityTypes "types/community";
import AdminEnhancementsTypes "types/admin-enhancements";
import TokenLaunchTypes "types/token-launch";

import StatsTypes "types/stats";
import NotifyTypes "types/notify";
import SentimentTypes "types/sentiment";
import BurnTypes "types/burn";
import BinanceFeedTypes "types/binance-feed";
import RoadmapTypes "types/roadmap";

import AuthApi "mixins/auth-api";
import SignalsApi "mixins/signals-api";
import StatsApi "mixins/stats-api";
import FaqsApi "mixins/faqs-api";
import NotifyApi "mixins/notify-api";
import AnnouncementsApi "mixins/announcements-api";
import AuditApi "mixins/audit-api";
import AiApi "mixins/ai-api";
import SentimentApi "mixins/sentiment-api";
import BurnApi "mixins/burn-api";
import CommunityApi "mixins/community-api";
import BinanceFeedApi "mixins/binance-feed-api";
import RoadmapApi "mixins/roadmap-api";
import PriceFeedApi "mixins/price-feed-api";
import AdminConfigApi "mixins/admin-config-api";
import AdminEnhancementsApi "mixins/admin-enhancements-api";
import TokenLaunchApi "mixins/token-launch-api";

import SentimentLib "lib/sentiment";
import RoadmapLib "lib/roadmap";
import TokenLaunchLib "lib/token-launch";
import Time "mo:core/Time";
import Migration "migration";



(with migration = Migration.run)
actor {
  // Session tokens (cleared on canister restart; frontend clears on tab close)
  let sessions = Set.empty<Text>();

  // Signals
  let signals = List.empty<SignalTypes.Signal>();
  let signalIdCounter = { var value : Nat = 0 };

  // Signal templates
  let signalTemplates = List.empty<SignalTypes.SignalTemplate>();
  let templateIdCounter = { var value : Nat = 0 };

  // Signal of the Day (stores signal ID string)
  let signalOfTheDayRef = { var value : ?Text = null };

  // Audit log
  let auditLog = List.empty<AuditTypes.AuditEntry>();
  let auditIdCounter = { var value : Nat = 0 };

  // Stats config
  let statsConfigRef = { var value : StatsTypes.StatsConfig = { useManual = false; manualStats = null } };

  // FAQs
  let faqs = List.empty<FaqTypes.FAQ>();
  let faqIdCounter = { var value : Nat = 0 };
  let faqsSeeded = { var value : Bool = false };

  // Notify Me entries
  let notifyEntries = List.empty<NotifyTypes.NotifyMe>();
  let notifyIdCounter = { var value : Nat = 0 };

  // Newsletter ban list (emails that cannot receive notifications)
  let bannedEmails = Set.empty<Text>();

  // Announcements (multi-announcement list)
  let announcements = List.empty<AnnTypes.Announcement>();
  let annIdCounter = { var value : Nat = 0 };

  // Market sentiment (includes real-time price fields)
  let sentimentRef = { var value : SentimentTypes.MarketSentiment = SentimentLib.defaultSentiment() };

  // Price cache for real-time token prices
  let priceCache = { var value : [SentimentTypes.PriceData] = [] };
  let priceCacheTime = { var value : Int = 0 };

  // Burn tracker
  let burnRef = { var value : BurnTypes.BurnTracker = { totalBurned = 0; lastUpdated = Time.now() } };

  // Burn schedule (seeded with planned post-2028 burn events)
  let burnSchedule = List.empty<BurnTypes.BurnScheduleEntry>();
  let burnIdCounter = { var value : Nat = 0 };
  let burnScheduleSeeded = { var value : Bool = false };

  // Community counters (Binance Square + Twitter)
  let communityRef = { var value : CommunityTypes.CommunityCounter = { binanceCount = 0; twitterCount = 0; lastUpdated = Time.now() } };

  // Quote rotator
  let quotes = List.empty<CommunityTypes.DemonZenoQuote>();
  let quoteIdCounter = { var value : Nat = 0 };
  let quotesSeeded = { var value : Bool = false };

  // Testimonials wall
  let testimonials = List.empty<CommunityTypes.Testimonial>();
  let testimonialIdCounter = { var value : Nat = 0 };

  // Community milestones
  let milestones = List.empty<CommunityTypes.CommunityMilestone>();
  let milestoneIdCounter = { var value : Nat = 0 };

  // Top Traders wall
  let topTraders = List.empty<CommunityTypes.TopTrader>();
  let topTraderIdCounter = { var value : Nat = 0 };

  // Community Q&A
  let communityQuestions = List.empty<CommunityTypes.CommunityQuestion>();
  let questionIdCounter = { var value : Nat = 0 };

  // Binance feed posts (manually curated)
  let binancePosts = List.empty<BinanceFeedTypes.BinancePost>();
  let binancePostIdCounter = { var value : Nat = 0 };

  // Roadmap milestones (seeded with defaults)
  let roadmapMilestones = List.fromArray<RoadmapTypes.RoadmapMilestone>(RoadmapLib.defaultMilestones());

  // Unified DemonZeno AI sessions
  let aiSessions = Set.empty<Text>();

  // AI provider API keys (empty by default; set via admin dashboard)
  let geminiKey      = { var value : Text = "" };
  let openaiKey      = { var value : Text = "" };
  let grokKey        = { var value : Text = "" };
  let claudeKey      = { var value : Text = "" };
  let perplexityKey  = { var value : Text = "" };
  let mistralKey     = { var value : Text = "" };
  let cohereKey      = { var value : Text = "" };
  let deepseekKey    = { var value : Text = "" };
  let groqKey        = { var value : Text = "" };
  let togetherKey    = { var value : Text = "" };
  let fireworksKey   = { var value : Text = "" };
  let openrouterKey  = { var value : Text = "" };
  let huggingfaceKey = { var value : Text = "" };
  let replicateKey   = { var value : Text = "" };
  let ollamaKey      = { var value : Text = "" };
  // Additional providers
  let ai21Key        = { var value : Text = "" };
  let nlpcloudKey    = { var value : Text = "" };
  let anyscaleKey    = { var value : Text = "" };
  let cerebrasKey    = { var value : Text = "" };
  let sambanovaKey   = { var value : Text = "" };
  let cloudflareKey  = { var value : Text = "" };
  let novitaKey      = { var value : Text = "" };
  let moonshotKey    = { var value : Text = "" };
  let zhipuKey       = { var value : Text = "" };
  let upstageKey     = { var value : Text = "" };

  // Token launch — whitepaper
  let whitepaperRef = { var value : TokenLaunchTypes.WhitepaperContent = TokenLaunchLib.defaultWhitepaper() };

  // Whitepaper URL (downloadable PDF link)
  let whitepaperUrlRef = { var value : ?Text = null };

  // Holder benefits (seeded with defaults)
  let holderBenefits = List.empty<TokenLaunchTypes.HolderBenefit>();
  let benefitsSeeded = { var value : Bool = false };

  // Signal of the Week
  let signalOfWeekRef = { var value : ?TokenLaunchTypes.SignalOfWeek = null };

  // Burn events schedule (post-2028)
  let burnEvents = List.empty<TokenLaunchTypes.BurnEvent>();
  let burnEventIdCounter = { var value : Nat = 0 };

  // Hype milestones toward launch
  let hypeMilestones = List.empty<TokenLaunchTypes.HypeMilestone>();
  let hypeMilestoneIdCounter = { var value : Nat = 0 };
  let hypeMilestonesSeeded = { var value : Bool = false };

  // Admin enhancements state
  let pushNotifications = List.empty<AdminEnhancementsTypes.PushNotification>();
  let pushNotifIdCounter = { var value : Nat = 0 };
  let marketBannerRef = { var value : ?AdminEnhancementsTypes.MarketMoodBanner = null };
  let maintenanceRef = { var value : AdminEnhancementsTypes.MaintenanceMode = { enabled = false; message = ""; updatedAt = 0 } };
  let auditSnapshots = List.empty<AdminEnhancementsTypes.AuditSnapshot>();
  let snapshotIdCounter = { var value : Nat = 0 };
  let abTests = List.empty<AdminEnhancementsTypes.AbTestInternal>();
  let abTestIdCounter = { var value : Nat = 0 };
  let activityMap = Map.empty<Text, Nat>();

  // Mixins
  include AuthApi(sessions);
  include SignalsApi(signals, signalIdCounter, auditLog, auditIdCounter, sessions, signalOfTheDayRef, signalTemplates, templateIdCounter);
  include StatsApi(signals, notifyEntries, statsConfigRef, sessions);
  include FaqsApi(faqs, faqIdCounter, sessions, faqsSeeded);
  include NotifyApi(notifyEntries, notifyIdCounter, sessions, bannedEmails);
  include AnnouncementsApi(announcements, annIdCounter, auditLog, auditIdCounter, sessions);
  include AuditApi(auditLog, sessions);
  include SentimentApi(sentimentRef, sessions);
  include BurnApi(burnRef, sessions, burnSchedule, burnIdCounter, burnScheduleSeeded);
  include CommunityApi(
    communityRef,
    sessions,
    quotes,
    quoteIdCounter,
    quotesSeeded,
    testimonials,
    testimonialIdCounter,
    milestones,
    milestoneIdCounter,
    topTraders,
    topTraderIdCounter,
    communityQuestions,
    questionIdCounter,
  );
  include BinanceFeedApi(binancePosts, binancePostIdCounter, sessions);
  include RoadmapApi(roadmapMilestones, sessions);
  include PriceFeedApi(sentimentRef, priceCache, priceCacheTime);
  include AdminConfigApi(sessions);
  include TokenLaunchApi(
    sessions,
    whitepaperRef,
    holderBenefits,
    benefitsSeeded,
    signalOfWeekRef,
    signals,
    whitepaperUrlRef,
    burnEvents,
    burnEventIdCounter,
    hypeMilestones,
    hypeMilestoneIdCounter,
    hypeMilestonesSeeded,
  );
  include AdminEnhancementsApi(
    pushNotifications,
    pushNotifIdCounter,
    marketBannerRef,
    maintenanceRef,
    auditSnapshots,
    snapshotIdCounter,
    abTests,
    abTestIdCounter,
    activityMap,
    auditLog,
    auditIdCounter,
    sessions,
    signals,
  );
  include AiApi(
    aiSessions,
    sessions,
    geminiKey,
    openaiKey,
    grokKey,
    claudeKey,
    perplexityKey,
    mistralKey,
    cohereKey,
    deepseekKey,
    groqKey,
    togetherKey,
    fireworksKey,
    openrouterKey,
    huggingfaceKey,
    replicateKey,
    ollamaKey,
    ai21Key,
    nlpcloudKey,
    anyscaleKey,
    cerebrasKey,
    sambanovaKey,
    cloudflareKey,
    novitaKey,
    moonshotKey,
    zhipuKey,
    upstageKey,
  );
};
