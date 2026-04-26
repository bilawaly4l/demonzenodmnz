module {
  public type SentimentLevel = { #Bullish; #Neutral; #Bearish };

  public type AssetSentiment = {
    asset            : Text;
    market           : Text;
    level            : SentimentLevel;
    note             : Text;
    updatedAt        : Int;
    // Real-time price fields
    price            : Float;
    priceChange24h   : Float;
    trend            : Text;   // "up" | "down" | "neutral"
    lastPriceUpdate  : Int;
  };

  public type MarketSentiment = {
    overall   : SentimentLevel;
    assets    : [AssetSentiment];
    updatedAt : Int;
  };

  public type PriceData = {
    asset          : Text;
    price          : Float;
    priceChange24h : Float;
    trend          : Text;   // "up" | "down" | "neutral"
    updatedAt      : Int;
  };
};
