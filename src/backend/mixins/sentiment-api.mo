import Set "mo:core/Set";
import CommonTypes "../types/common";
import SentimentTypes "../types/sentiment";
import SentimentLib "../lib/sentiment";
import AuthLib "../lib/auth";

mixin (
  sentimentRef : { var value : SentimentLib.MarketSentiment },
  sessions     : Set.Set<Text>,
) {
  public query func getMarketSentiment() : async SentimentTypes.MarketSentiment {
    SentimentLib.getSentiment(sentimentRef);
  };

  public func updateMarketSentiment(
    token     : Text,
    sentiment : SentimentTypes.MarketSentiment,
  ) : async CommonTypes.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, token)) {
      return #err("Unauthorized");
    };
    SentimentLib.updateSentiment(sentimentRef, sentiment);
    #ok(());
  };
};
