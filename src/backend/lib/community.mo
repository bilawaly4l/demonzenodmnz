import List "mo:core/List";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Common "../types/common";

module {
  // ── Profanity filter ───────────────────────────────────────────────────────
  let profanityList : [Text] = [
    "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "dick",
    "pussy", "cock", "whore", "nigger", "nigga", "faggot", "retard",
    "motherfucker", "fucked", "fucking", "bullshit", "crap",
    "piss", "twat", "wanker", "slut",
  ];

  public func containsProfanity(text : Text) : Bool {
    let lower = text.toLower();
    for (word in profanityList.values()) {
      if (lower.contains(#text word)) return true;
    };
    false;
  };

  // ── Early Believer wall ────────────────────────────────────────────────────

  public func submitEarlyBeliever(
    believers   : List.List<Common.EarlyBeliever>,
    seenHandles : Set.Set<Text>,
    handle      : Text,
  ) : Common.Result<Common.EarlyBeliever, Text> {
    if (handle.size() == 0) return #err("Handle cannot be empty");
    if (handle.size() > 50) return #err("Handle too long (max 50 characters)");
    if (believers.size() >= 10_000) return #err("Early Believer wall is full");
    if (seenHandles.contains(handle)) return #err("Handle already registered");
    let entry : Common.EarlyBeliever = {
      handle    = handle;
      timestamp = Time.now();
      index     = believers.size();
    };
    believers.add(entry);
    seenHandles.add(handle);
    #ok(entry);
  };

  // ── Hype wall ─────────────────────────────────────────────────────────────

  public func submitHypeMessage(
    messages : List.List<Common.HypeMessage>,
    handle   : Text,
    message  : Text,
  ) : Common.Result<Common.HypeMessage, Text> {
    if (handle.size() == 0) return #err("Handle cannot be empty");
    if (handle.size() > 50) return #err("Handle too long (max 50 characters)");
    if (message.size() == 0) return #err("Message cannot be empty");
    if (message.size() > 280) return #err("Message exceeds 280 characters");
    if (messages.size() >= 50_000) return #err("Hype wall is full");
    if (containsProfanity(message)) return #err("Message contains prohibited content");
    let entry : Common.HypeMessage = {
      handle    = handle;
      message   = message;
      timestamp = Time.now();
    };
    messages.add(entry);
    #ok(entry);
  };

  // ── First-100 pledge ───────────────────────────────────────────────────────

  public func submitFirst100(
    pledges     : List.List<Common.First100Entry>,
    seenHandles : Set.Set<Text>,
    handle      : Text,
  ) : Common.Result<Common.First100Entry, Text> {
    if (handle.size() == 0) return #err("Handle cannot be empty");
    if (handle.size() > 50) return #err("Handle too long (max 50 characters)");
    if (seenHandles.contains(handle)) return #err("Handle already pledged");
    let position = pledges.size() + 1;
    let isOG     = position <= 100;
    let entry : Common.First100Entry = {
      handle    = handle;
      timestamp = Time.now();
      position  = position;
      isOG      = isOG;
    };
    pledges.add(entry);
    seenHandles.add(handle);
    #ok(entry);
  };

  // ── Pre-launch interest form ───────────────────────────────────────────────

  public func submitInterest(
    interests   : List.List<Common.InterestEntry>,
    seenHandles : Set.Set<Text>,
    handle      : Text,
  ) : Common.Result<Common.InterestEntry, Text> {
    if (handle.size() == 0) return #err("Handle cannot be empty");
    if (handle.size() > 50) return #err("Handle too long (max 50 characters)");
    if (interests.size() >= 100_000) return #err("Interest list is full");
    if (seenHandles.contains(handle)) return #err("Handle already submitted");
    let entry : Common.InterestEntry = {
      handle    = handle;
      timestamp = Time.now();
    };
    interests.add(entry);
    seenHandles.add(handle);
    #ok(entry);
  };

  // ── Community pledge ──────────────────────────────────────────────────────

  public func addPledge(
    pledges : List.List<Common.CommunityPledge>,
    name    : Text,
  ) : Common.CommunityPledge {
    let entry : Common.CommunityPledge = {
      id        = pledges.size();
      name      = name;
      timestamp = Time.now();
    };
    pledges.add(entry);
    entry;
  };

  public func getPledges(pledges : List.List<Common.CommunityPledge>) : [Common.CommunityPledge] {
    pledges.toArray();
  };

  public func getPledgeCount(pledges : List.List<Common.CommunityPledge>) : Nat {
    pledges.size();
  };

  // ── Community submissions ─────────────────────────────────────────────────

  public func addSubmission(
    submissions : List.List<Common.CommunitySubmission>,
    description : Text,
    handle      : Text,
  ) : Common.Result<Common.CommunitySubmission, Text> {
    if (handle.size() == 0) return #err("Handle cannot be empty");
    if (handle.size() > 50) return #err("Handle too long (max 50 characters)");
    if (description.size() == 0) return #err("Description cannot be empty");
    if (description.size() > 500) return #err("Description exceeds 500 characters");
    if (containsProfanity(description)) return #err("Description contains prohibited content");
    let entry : Common.CommunitySubmission = {
      id              = submissions.size();
      description     = description;
      submitterHandle = handle;
      timestamp       = Time.now();
    };
    submissions.add(entry);
    #ok(entry);
  };

  public func getSubmissions(submissions : List.List<Common.CommunitySubmission>) : [Common.CommunitySubmission] {
    submissions.toArray();
  };
};
