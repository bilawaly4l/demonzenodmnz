import List "mo:core/List";
import Set "mo:core/Set";
import Common "../types/common";
import CommunityLib "../lib/community";

mixin (
  earlyBelievers        : List.List<Common.EarlyBeliever>,
  earlyBelieversHandles : Set.Set<Text>,
  hypeMessages          : List.List<Common.HypeMessage>,
  first100Pledges       : List.List<Common.First100Entry>,
  first100Handles       : Set.Set<Text>,
  interestSubmissions   : List.List<Common.InterestEntry>,
  interestHandles       : Set.Set<Text>,
  communityPledges      : List.List<Common.CommunityPledge>,
  communitySubmissions  : List.List<Common.CommunitySubmission>,
) {
  /// Submit a Binance Square handle to the Early Believer wall.
  public func submitEarlyBeliever(handle : Text) : async Common.Result<Common.EarlyBeliever, Text> {
    CommunityLib.submitEarlyBeliever(earlyBelievers, earlyBelieversHandles, handle);
  };

  /// Get all Early Believer entries.
  public query func getEarlyBelievers() : async [Common.EarlyBeliever] {
    earlyBelievers.toArray();
  };

  /// Post a hype message to the Hype wall.
  public func submitHypeMessage(handle : Text, message : Text) : async Common.Result<Common.HypeMessage, Text> {
    CommunityLib.submitHypeMessage(hypeMessages, handle, message);
  };

  /// Get all hype wall messages.
  public query func getHypeMessages() : async [Common.HypeMessage] {
    hypeMessages.toArray();
  };

  /// Submit a First-100 pledge (first 100 unique handles receive isOG=true).
  public func submitFirst100(handle : Text) : async Common.Result<Common.First100Entry, Text> {
    CommunityLib.submitFirst100(first100Pledges, first100Handles, handle);
  };

  /// Get all First-100 pledge entries.
  public query func getFirst100() : async [Common.First100Entry] {
    first100Pledges.toArray();
  };

  /// Submit a pre-launch interest form entry.
  public func submitInterest(handle : Text) : async Common.Result<Common.InterestEntry, Text> {
    CommunityLib.submitInterest(interestSubmissions, interestHandles, handle);
  };

  /// Get all pre-launch interest entries.
  public query func getInterestSubmissions() : async [Common.InterestEntry] {
    interestSubmissions.toArray();
  };

  /// Get aggregated community counts.
  public query func getCommunityStats() : async Common.CommunityStats {
    {
      earlyBelieverCount = earlyBelievers.size();
      hypeCount          = hypeMessages.size();
      first100Count      = first100Pledges.size();
      interestCount      = interestSubmissions.size();
      pledgeCount        = communityPledges.size();
      submissionCount    = communitySubmissions.size();
    };
  };

  /// Submit a community pledge (returns updated total pledge count).
  public func submitPledge(name : Text) : async Nat {
    ignore CommunityLib.addPledge(communityPledges, name);
    CommunityLib.getPledgeCount(communityPledges);
  };

  /// Get total number of community pledges.
  public query func getPledgeCount() : async Nat {
    CommunityLib.getPledgeCount(communityPledges);
  };

  /// Submit a community post / verified supporter entry.
  public func submitCommunityPost(description : Text, handle : Text) : async Bool {
    switch (CommunityLib.addSubmission(communitySubmissions, description, handle)) {
      case (#ok(_)) true;
      case (#err(_)) false;
    };
  };

  /// Get all community post submissions.
  public query func getCommunityPosts() : async [Common.CommunitySubmission] {
    CommunityLib.getSubmissions(communitySubmissions);
  };
};
