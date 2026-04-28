import List "mo:core/List";
import Set "mo:core/Set";
import Text "mo:core/Text";
import FaqTypes "../types/faqs";
import Common "../types/common";
import FaqsLib "../lib/faqs";
import AuthLib "../lib/auth";

mixin (
  faqs : List.List<FaqTypes.FAQ>,
  faqIdCounter : { var value : Nat },
  sessions : Set.Set<Text>,
  faqsSeeded : { var value : Bool },
) {

  // ── FAQ pre-seed ──────────────────────────────────────────────────────────

  func seedDefaultFaqs() {
    if (faqsSeeded.value) return;
    faqsSeeded.value := true;
    if (faqs.size() > 0) return; // already has data

    let defaults : [(Text, Text, FaqTypes.FaqCategory)] = [
      (
        "What is DemonZeno?",
        "DemonZeno is a free trading signals platform providing daily signals for crypto, forex, and stocks. All signals are delivered through the DemonZeno AI and posted publicly on Binance Square.",
        #Platform,
      ),
      (
        "Where can I get DemonZeno's free trading signals?",
        "DemonZeno provides daily free trading signals on Binance Square. Follow @DemonZeno on Binance Square to get signals for crypto, forex, and stocks every day — completely free.",
        #Signals,
      ),
      (
        "Is DemonZeno free?",
        "Yes. DemonZeno's trading signals are completely free. Daily signals are posted on Binance Square @DemonZeno at no cost.",
        #Platform,
      ),
      (
        "How do I use DemonZeno AI?",
        "Visit the AI section and enter the access code to unlock DemonZeno AI. The unified DemonZeno AI (passcode: DemonZeno2420075112009BP) provides real-time trading signals for any crypto, forex, and stocks — plus code writing, Q&A, and more, all powered by 50+ AI providers running in the backend.",
        #Platform,
      ),
      (
        "What is DMNZ token?",
        "DMNZ is the DemonZeno meme token launching April 2, 2028 via a Telegram Mini App on Blum. It is a 100% fair launch — no presale, no allocation, no vesting. The 2028 Buyback & Burn event will reduce supply, increase price, and trigger the bonding curve for listings on other exchanges.",
        #DmnzToken,
      ),
      (
        "When does DMNZ launch?",
        "DMNZ launches on April 2, 2028 via a Telegram Mini App on the Blum platform.",
        #DmnzToken,
      ),
      (
        "What is the DMNZ token roadmap?",
        "2026: Community building on Binance. 2027: DMNZ token launch via BLUM Mini App on Telegram. 2028: Massive Buyback & Burn to reduce supply, increase token price, and trigger the bonding curve for listings on other exchanges.",
        #DmnzToken,
      ),
      (
        "What exchanges will DMNZ list on?",
        "After the 2028 Buyback & Burn event triggers the bonding curve, DMNZ will list on additional exchanges beyond Blum. The community building phase (2026) and fair launch (2027) precede this milestone.",
        #DmnzToken,
      ),
      (
        "Is there a presale for DMNZ?",
        "No. DMNZ is a 100% fair launch with no presale, no private allocation, no whitelist, and no KYC. Everyone participates on equal terms.",
        #DmnzToken,
      ),
      (
        "Are the trading signals on Binance only?",
        "DemonZeno AI provides real-time signals for any crypto token, Forex pairs (EURUSD, GBPUSD, USDJPY, etc.), and stocks (AAPL, TSLA, NVDA, etc.). Daily free signals are also posted on Binance Square @DemonZeno.",
        #Signals,
      ),
      (
        "How accurate are DemonZeno's signals?",
        "Every DemonZeno AI signal includes an Entry price, Stop Loss, and three Take Profit levels (TP1, TP2, TP3) with a confidence rating. Signals are generated using real-time data from 50+ AI providers for maximum accuracy.",
        #Signals,
      ),
      (
        "What is a trading signal?",
        "A trading signal is a recommendation to buy or sell an asset at a specific price. DemonZeno signals always include: Entry price (where to enter), Stop Loss (risk management), and three Take Profit targets (TP1, TP2, TP3) for maximum reward.",
        #GeneralTrading,
      ),
      (
        "What is Stop Loss?",
        "A Stop Loss is a price level where you exit a trade to limit your losses. Always set your Stop Loss before entering a trade — it is the foundation of risk management and a core part of every DemonZeno signal.",
        #GeneralTrading,
      ),
      (
        "What is Take Profit?",
        "Take Profit (TP) is a target price where you exit a trade to lock in gains. DemonZeno signals provide three Take Profit levels: TP1 (safe), TP2 (standard), TP3 (maximum) — allowing you to scale out of your position.",
        #GeneralTrading,
      ),
      (
        "What is BLUM?",
        "BLUM is a Telegram Mini App platform that enables fair-launch token trading directly within Telegram. DemonZeno (DMNZ) will launch exclusively on BLUM on April 2, 2028.",
        #DmnzToken,
      ),
      (
        "What is the 2028 Buyback & Burn?",
        "In 2028, DemonZeno will execute a massive Buyback & Burn campaign with three goals: (1) Reduce DMNZ circulating supply, (2) Increase token price, (3) Trigger the bonding curve to qualify DMNZ for listings on other crypto exchanges.",
        #DmnzToken,
      ),
      (
        "How do I follow DemonZeno?",
        "Follow DemonZeno on Binance Square @DemonZeno for daily free trading signals. Follow @ZenoDemon on Twitter for updates and announcements.",
        #Platform,
      ),
      (
        "What assets does DemonZeno cover?",
        "DemonZeno covers crypto (BTC, ETH, BNB, SOL, and 100+ altcoins), Forex pairs (EURUSD, GBPUSD, USDJPY, and more), and stocks (AAPL, TSLA, NVDA, AMZN, and more). All signals include full Entry/SL/TP1/TP2/TP3 levels.",
        #Signals,
      ),
      (
        "Is DemonZeno financial advice?",
        "No. DemonZeno signals are for educational and informational purposes only. Always do your own research (DYOR) and never invest more than you can afford to lose.",
        #GeneralTrading,
      ),
      (
        "How do I unlock DemonZeno AI?",
        "Navigate to the AI section and enter the passcode DemonZeno2420075112009BP to unlock the full DemonZeno AI — powered by 50+ AI providers for signals, Q&A, code writing, and more.",
        #Platform,
      ),
    ];
    var idCounter = faqIdCounter.value;
    for ((q, a, cat) in defaults.values()) {
      let (_, newId) = FaqsLib.addFaq(faqs, idCounter, q, a, cat);
      idCounter := newId;
    };
    faqIdCounter.value := idCounter;
  };

  // ── Public API ─────────────────────────────────────────────────────────────

  /// Initialize default FAQs if none exist. Call once on startup.
  public func initFaqs() : async () {
    seedDefaultFaqs();
  };

  public func addFaq(
    sessionToken : Text,
    question     : Text,
    answer       : Text,
    category     : FaqTypes.FaqCategory,
  ) : async Common.Result<FaqTypes.FAQ, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let (faq, newId) = FaqsLib.addFaq(faqs, faqIdCounter.value, question, answer, category);
    faqIdCounter.value := newId;
    #ok(faq);
  };

  public func updateFaq(
    sessionToken : Text,
    id           : Text,
    question     : Text,
    answer       : Text,
    category     : FaqTypes.FaqCategory,
  ) : async Common.Result<FaqTypes.FAQ, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    FaqsLib.updateFaq(faqs, id, question, answer, category);
  };

  public func deleteFaq(
    sessionToken : Text,
    id           : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    FaqsLib.deleteFaq(faqs, id);
  };

  public func reorderFaqs(
    sessionToken : Text,
    orderedIds   : [Text],
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    FaqsLib.reorderFaqs(faqs, orderedIds);
  };

  /// Public: rate a FAQ as helpful or not
  public func rateFaq(id : Text, helpful : Bool) : async Common.Result<(), Text> {
    FaqsLib.rateFaq(faqs, id, helpful);
  };

  public query func getFaqs() : async [FaqTypes.FAQ] {
    if (not faqsSeeded.value) {
      // Return empty — seeding must be explicitly triggered via initFaqs
      [];
    } else {
      FaqsLib.getFaqs(faqs);
    };
  };

  public query func getFaqsByCategory(category : FaqTypes.FaqCategory) : async [FaqTypes.FAQ] {
    FaqsLib.getFaqsByCategory(faqs, category);
  };
};
