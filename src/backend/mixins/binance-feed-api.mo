import List "mo:core/List";
import Set "mo:core/Set";
import BinanceFeedTypes "../types/binance-feed";
import Common "../types/common";
import BinanceFeedLib "../lib/binance-feed";
import AuthLib "../lib/auth";

mixin (
  binancePosts         : List.List<BinanceFeedTypes.BinancePost>,
  binancePostIdCounter : { var value : Nat },
  sessions             : Set.Set<Text>,
) {
  public query func getBinanceFeed() : async [BinanceFeedTypes.BinancePost] {
    BinanceFeedLib.getBinanceFeed(binancePosts);
  };

  public func addBinancePost(
    adminToken : Text,
    title      : Text,
    snippet    : Text,
    url        : Text,
    date       : Text,
  ) : async Common.Result<BinanceFeedTypes.BinancePost, Text> {
    if (not AuthLib.validateSession(sessions, adminToken)) {
      return #err("Unauthorized");
    };
    let (post, newId) = BinanceFeedLib.addBinancePost(binancePosts, binancePostIdCounter.value, title, snippet, url, date);
    binancePostIdCounter.value := newId;
    #ok(post);
  };

  public func updateBinancePost(
    adminToken : Text,
    id         : Text,
    title      : Text,
    snippet    : Text,
    url        : Text,
    date       : Text,
  ) : async Common.Result<BinanceFeedTypes.BinancePost, Text> {
    if (not AuthLib.validateSession(sessions, adminToken)) {
      return #err("Unauthorized");
    };
    BinanceFeedLib.updateBinancePost(binancePosts, id, title, snippet, url, date);
  };

  public func deleteBinancePost(
    adminToken : Text,
    id         : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, adminToken)) {
      return #err("Unauthorized");
    };
    BinanceFeedLib.deleteBinancePost(binancePosts, id);
  };
};
