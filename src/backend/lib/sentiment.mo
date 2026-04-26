import SentimentTypes "../types/sentiment";
import Time "mo:core/Time";

module {
  public type MarketSentiment = SentimentTypes.MarketSentiment;

  public func defaultSentiment() : MarketSentiment {
    let now = Time.now();
    {
      overall = #Neutral;
      updatedAt = now;
      assets = [
        { asset = "BTC";  market = "Crypto"; level = #Neutral; note = ""; updatedAt = now; price = 0.0; priceChange24h = 0.0; trend = "neutral"; lastPriceUpdate = 0 },
        { asset = "ETH";  market = "Crypto"; level = #Neutral; note = ""; updatedAt = now; price = 0.0; priceChange24h = 0.0; trend = "neutral"; lastPriceUpdate = 0 },
        { asset = "BNB";  market = "Crypto"; level = #Neutral; note = ""; updatedAt = now; price = 0.0; priceChange24h = 0.0; trend = "neutral"; lastPriceUpdate = 0 },
        { asset = "SOL";  market = "Crypto"; level = #Neutral; note = ""; updatedAt = now; price = 0.0; priceChange24h = 0.0; trend = "neutral"; lastPriceUpdate = 0 },
        { asset = "XRP";  market = "Crypto"; level = #Neutral; note = ""; updatedAt = now; price = 0.0; priceChange24h = 0.0; trend = "neutral"; lastPriceUpdate = 0 },
        { asset = "DOGE"; market = "Crypto"; level = #Neutral; note = ""; updatedAt = now; price = 0.0; priceChange24h = 0.0; trend = "neutral"; lastPriceUpdate = 0 },
      ];
    };
  };

  public func getSentiment(ref : { var value : MarketSentiment }) : MarketSentiment {
    ref.value;
  };

  public func updateSentiment(ref : { var value : MarketSentiment }, data : MarketSentiment) {
    ref.value := data;
  };
};
