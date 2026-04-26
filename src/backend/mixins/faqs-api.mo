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

    let defaults : [(Text, Text)] = [
      (
        "What is DemonZeno?",
        "DemonZeno is a free trading signals platform providing daily signals for crypto, forex, and stocks. All signals are delivered through the DemonZeno AI and posted publicly on Binance Square."
      ),
      (
        "Where can I get DemonZeno's free trading signals?",
        "DemonZeno provides daily free trading signals on Binance Square. Follow @DemonZeno on Binance Square to get signals for crypto, forex, and stocks every day — completely free."
      ),
      (
        "Is DemonZeno free?",
        "Yes. DemonZeno's trading signals are completely free. Daily signals are posted on Binance Square @DemonZeno at no cost."
      ),
      (
        "How do I use DemonZeno AI?",
        "Visit the AI section and enter the access code to unlock DemonZeno AI. Normal mode (code: 2420075112009) provides real-time trading signals for crypto, forex, and stocks. Insane mode unlocks unrestricted signal generation for any asset on any exchange."
      ),
      (
        "What is DMNZ token?",
        "DMNZ is the DemonZeno meme token launching April 2, 2028 via a Telegram Mini App on Blum. It is a 100% fair launch — no presale, no allocation, no vesting. The 2028 Buyback & Burn event will reduce supply, increase price, and trigger the bonding curve for listings on other exchanges."
      ),
      (
        "When does DMNZ launch?",
        "DMNZ launches on April 2, 2028 via a Telegram Mini App on the Blum platform."
      ),
      (
        "What is the DMNZ token roadmap?",
        "2026: Community building on Binance. 2027: DMNZ token launch via BLUM Mini App on Telegram. 2028: Massive Buyback & Burn to reduce supply, increase token price, and trigger the bonding curve for listings on other exchanges."
      ),
      (
        "What exchanges will DMNZ list on?",
        "After the 2028 Buyback & Burn event triggers the bonding curve, DMNZ will list on additional exchanges beyond Blum. The community building phase (2026) and fair launch (2027) precede this milestone."
      ),
      (
        "Is there a presale for DMNZ?",
        "No. DMNZ is a 100% fair launch with no presale, no private allocation, no whitelist, and no KYC. Everyone participates on equal terms."
      ),
      (
        "Are the trading signals on Binance only?",
        "DemonZeno AI provides real-time signals for any crypto token, Forex pairs (EURUSD, GBPUSD, USDJPY, etc.), and stocks (AAPL, TSLA, NVDA, etc.). Daily free signals are also posted on Binance Square @DemonZeno."
      ),
    ];
    var idCounter = faqIdCounter.value;
    for ((q, a) in defaults.values()) {
      let (_, newId) = FaqsLib.addFaq(faqs, idCounter, q, a);
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
    question : Text,
    answer : Text,
  ) : async Common.Result<FaqTypes.FAQ, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let (faq, newId) = FaqsLib.addFaq(faqs, faqIdCounter.value, question, answer);
    faqIdCounter.value := newId;
    #ok(faq);
  };

  public func updateFaq(
    sessionToken : Text,
    id : Text,
    question : Text,
    answer : Text,
  ) : async Common.Result<FaqTypes.FAQ, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    FaqsLib.updateFaq(faqs, id, question, answer);
  };

  public func deleteFaq(
    sessionToken : Text,
    id : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    FaqsLib.deleteFaq(faqs, id);
  };

  public func reorderFaqs(
    sessionToken : Text,
    orderedIds : [Text],
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    FaqsLib.reorderFaqs(faqs, orderedIds);
  };

  public query func getFaqs() : async [FaqTypes.FAQ] {
    FaqsLib.getFaqs(faqs);
  };
};
