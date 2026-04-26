import SentimentTypes "../types/sentiment";
import SentimentLib "../lib/sentiment";
import PriceFeedLib "../lib/price-feed";
import Time "mo:core/Time";

mixin (
  sentimentRef : { var value : SentimentLib.MarketSentiment },
  priceCache : { var value : [SentimentTypes.PriceData] },
  priceCacheTime : { var value : Int },
) {
  // Cache TTL: 60 seconds in nanoseconds
  let CACHE_TTL_NS : Int = 60_000_000_000;

  /// Public query: return cached market prices.
  /// Returns empty array if cache has never been populated.
  public query func getMarketPrices() : async [SentimentTypes.PriceData] {
    priceCache.value;
  };

  /// Update call: fetch fresh prices from CoinGecko and update cache + sentiment assets.
  /// Rate-limited to once per 60 seconds.
  public func refreshMarketPrices() : async [SentimentTypes.PriceData] {
    let now = Time.now();
    // Return cached if fresh
    if (now - priceCacheTime.value < CACHE_TTL_NS and priceCache.value.size() > 0) {
      return priceCache.value;
    };
    let prices = await PriceFeedLib.fetchAllPrices();
    if (prices.size() > 0) {
      priceCache.value := prices;
      priceCacheTime.value := now;
      // Also update the sentiment asset prices
      let currentSentiment = sentimentRef.value;
      let updatedAssets = currentSentiment.assets.map(
        func(a : SentimentTypes.AssetSentiment) : SentimentTypes.AssetSentiment {
          let priceOpt = prices.find(func(p : SentimentTypes.PriceData) : Bool { p.asset == a.asset });
          switch (priceOpt) {
            case (?pd) {
              // Derive sentiment level from price change
              let level = if (pd.priceChange24h > 2.0) { #Bullish }
                          else if (pd.priceChange24h < -2.0) { #Bearish }
                          else { a.level };
              { a with
                price = pd.price;
                priceChange24h = pd.priceChange24h;
                trend = pd.trend;
                lastPriceUpdate = now;
                level;
              };
            };
            case null { a };
          };
        }
      );
      sentimentRef.value := { currentSentiment with assets = updatedAssets; updatedAt = now };
    };
    priceCache.value;
  };
};
