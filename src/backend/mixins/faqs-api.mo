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
        "DemonZeno is a free trading signals platform providing daily signals for crypto, forex, and stocks. All signals are for assets listed on Binance, delivered through the DemonZeno AI and posted publicly on Binance Square."
      ),
      (
        "Where can I find DemonZeno daily free signals?",
        "DemonZeno provides daily free trading signals on Binance Square. Follow @DemonZeno on Binance Square to get daily signals for crypto, forex, and stocks — all completely free."
      ),
      (
        "How do I use DemonZeno AI?",
        "Visit the /ai page and enter the access code to unlock DemonZeno AI. Normal mode (code: 2420075112009) provides balanced market analysis for Binance-listed assets. Insane mode unlocks unrestricted signal generation for any asset on any exchange."
      ),
      (
        "What is the DMNZ token?",
        "DMNZ is the DemonZeno meme token. It launches on April 2, 2028 via a Telegram Mini App on the BLUM platform. 100% fair launch — no presale, no allocation, no KYC required."
      ),
      (
        "What is the DMNZ token roadmap?",
        "2026: Community building on Binance. 2027: DMNZ token launch via BLUM Mini App on Telegram. 2028: Massive Buyback & Burn to reduce supply, increase token price, and trigger the bonding curve for listings on other exchanges."
      ),
      (
        "Is there a presale for DMNZ?",
        "No. DMNZ is a 100% fair launch with no presale, no private allocation, no whitelist, and no KYC. Everyone participates on equal terms."
      ),
      (
        "Are the trading signals on Binance only?",
        "Yes — all publicly posted signals are for assets listed on Binance (crypto, forex, and select stocks available on Binance). DemonZeno AI in Insane mode can generate signals for any asset on any exchange."
      ),
      (
        "Is there a fee to use DemonZeno?",
        "No. All trading signals and the DemonZeno AI are completely free. There is no subscription, no registration, and no payment required."
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
