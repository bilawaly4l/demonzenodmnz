import List "mo:core/List";
import BinanceFeedTypes "../types/binance-feed";
import Common "../types/common";

module {
  public type BinancePost = BinanceFeedTypes.BinancePost;
  public type Result<T, E> = Common.Result<T, E>;

  public func getBinanceFeed(posts : List.List<BinancePost>) : [BinancePost] {
    // Return newest first
    posts.toArray().reverse();
  };

  public func addBinancePost(
    posts   : List.List<BinancePost>,
    nextId  : Nat,
    title   : Text,
    snippet : Text,
    url     : Text,
    date    : Text,
  ) : (BinancePost, Nat) {
    let post : BinancePost = {
      id      = nextId.toText();
      title;
      snippet;
      url;
      date;
    };
    posts.add(post);
    (post, nextId + 1);
  };

  public func updateBinancePost(
    posts   : List.List<BinancePost>,
    id      : Text,
    title   : Text,
    snippet : Text,
    url     : Text,
    date    : Text,
  ) : Result<BinancePost, Text> {
    var found : ?BinancePost = null;
    posts.mapInPlace(func(p) {
      if (p.id == id) {
        let updated : BinancePost = { p with title; snippet; url; date };
        found := ?updated;
        updated;
      } else { p };
    });
    switch (found) {
      case (?p) { #ok(p) };
      case null { #err("Post not found: " # id) };
    };
  };

  public func deleteBinancePost(
    posts : List.List<BinancePost>,
    id    : Text,
  ) : Result<(), Text> {
    let sizeBefore = posts.size();
    let kept = posts.filter(func(p) { p.id != id });
    posts.clear();
    posts.addAll(kept.values());
    if (posts.size() < sizeBefore) { #ok(()) } else { #err("Post not found: " # id) };
  };
};
