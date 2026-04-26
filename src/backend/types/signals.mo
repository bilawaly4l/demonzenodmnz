module {
  public type MarketType = { #Crypto; #Forex; #Stock };
  public type Direction = { #Buy; #Sell };
  public type ResultStatus = { #Active; #Win; #Loss; #Expired };
  public type Confidence = { #Low; #Medium; #High };
  public type Timeframe = { #Scalp; #Swing; #LongTerm };

  public type Signal = {
    id : Text;
    asset : Text;
    marketType : MarketType;
    direction : Direction;
    entryPrice : Text;
    targetPrice : Text;
    stopLoss : Text;
    datePosted : Text;
    result : ResultStatus;
    notes : Text;
    // New fields
    confidence : Confidence;
    sourceLabel : Text;
    expiry : ?Int;
    timeframe : Timeframe;
    isDraft : Bool;
    publishAt : ?Int;
  };

  /// Input type for creating or bulk-importing signals (no generated fields)
  public type SignalInput = {
    asset : Text;
    marketType : MarketType;
    direction : Direction;
    entryPrice : Text;
    targetPrice : Text;
    stopLoss : Text;
    notes : Text;
    confidence : Confidence;
    sourceLabel : Text;
    expiry : ?Int;
    timeframe : Timeframe;
    isDraft : Bool;
    publishAt : ?Int;
  };
};
