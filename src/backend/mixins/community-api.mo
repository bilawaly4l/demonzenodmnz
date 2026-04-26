import Set "mo:core/Set";
import List "mo:core/List";
import CommunityTypes "../types/community";
import Common "../types/common";
import CommunityLib "../lib/community";
import AuthLib "../lib/auth";

mixin (
  communityRef    : { var value : CommunityLib.CommunityCounter },
  sessions        : Set.Set<Text>,
  quotes          : List.List<CommunityLib.DemonZenoQuote>,
  quoteIdCounter  : { var value : Nat },
  quotesSeeded    : { var value : Bool },
  testimonials    : List.List<CommunityLib.Testimonial>,
  testimonialIdCounter : { var value : Nat },
  milestones      : List.List<CommunityLib.CommunityMilestone>,
  milestoneIdCounter : { var value : Nat },
) {
  // ── Community counter ──────────────────────────────────────────────────────

  public query func getCommunityCounter() : async CommunityTypes.CommunityCounter {
    CommunityLib.getCommunityCounter(communityRef);
  };

  public func setCommunityCounter(
    adminToken : Text,
    data       : CommunityTypes.CommunityCounter,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, adminToken)) {
      return #err("Unauthorized");
    };
    CommunityLib.setCommunityCounter(communityRef, data);
    #ok(());
  };

  // ── Quote rotator ──────────────────────────────────────────────────────────

  public query func getQuotes() : async [CommunityTypes.DemonZenoQuote] {
    if (not quotesSeeded.value) {
      // Return defaults inline if not seeded yet
      CommunityLib.defaultQuotes();
    } else {
      CommunityLib.getQuotes(quotes);
    };
  };

  public func addQuote(
    quote      : Text,
    author     : Text,
    sessionToken : Text,
  ) : async Common.Result<Text, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    if (not quotesSeeded.value) {
      let defaults = CommunityLib.defaultQuotes();
      for (q in defaults.values()) {
        quotes.add(q);
      };
      quoteIdCounter.value := defaults.size();
      quotesSeeded.value := true;
    };
    let id = CommunityLib.addQuote(quotes, quoteIdCounter, quote, author);
    #ok(id);
  };

  public func deleteQuote(id : Text, sessionToken : Text) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    CommunityLib.deleteQuote(quotes, id);
    #ok(());
  };

  // ── Testimonials ───────────────────────────────────────────────────────────

  public query func getTestimonials() : async [CommunityTypes.Testimonial] {
    CommunityLib.getTestimonials(testimonials);
  };

  public func addTestimonial(
    name         : Text,
    content      : Text,
    winAmount    : ?Text,
    asset        : ?Text,
    sessionToken : Text,
  ) : async Common.Result<Text, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let id = CommunityLib.addTestimonial(testimonials, testimonialIdCounter, name, content, winAmount, asset);
    #ok(id);
  };

  public func deleteTestimonial(id : Text, sessionToken : Text) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    CommunityLib.deleteTestimonial(testimonials, id);
    #ok(());
  };

  // ── Community milestones ───────────────────────────────────────────────────

  public query func getMilestones() : async [CommunityTypes.CommunityMilestone] {
    CommunityLib.getMilestones(milestones);
  };

  public func addMilestone(
    title        : Text,
    description  : Text,
    sessionToken : Text,
  ) : async Common.Result<Text, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let id = CommunityLib.addMilestone(milestones, milestoneIdCounter, title, description);
    #ok(id);
  };

  public func markMilestoneReached(
    id            : Text,
    celebrateDays : Nat,
    sessionToken  : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    CommunityLib.markMilestoneReached(milestones, id, celebrateDays);
    #ok(());
  };
};
