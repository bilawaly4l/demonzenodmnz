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
    tp1 : Text;
    tp2 : Text;
    tp3 : Text;
    datePosted : Text;
    result : ResultStatus;
    notes : Text;
    confidence : Confidence;
    sourceLabel : Text;
    providerLabel : Text;
    expiry : ?Int;
    timeframe : Timeframe;
    isDraft : Bool;
    publishAt : ?Int;
    templateId : ?Text;
    voteUp : Nat;
    voteDown : Nat;
    tags : [Text];
  };

  /// Input type for creating or bulk-importing signals (no generated fields)
  public type SignalInput = {
    asset : Text;
    marketType : MarketType;
    direction : Direction;
    entryPrice : Text;
    targetPrice : Text;
    stopLoss : Text;
    tp1 : Text;
    tp2 : Text;
    tp3 : Text;
    notes : Text;
    confidence : Confidence;
    sourceLabel : Text;
    providerLabel : Text;
    expiry : ?Int;
    timeframe : Timeframe;
    isDraft : Bool;
    publishAt : ?Int;
    templateId : ?Text;
    tags : [Text];
  };

  public type SignalTemplate = {
    id : Text;
    name : Text;
    asset : Text;
    marketType : MarketType;
    direction : Direction;
    timeframe : Timeframe;
    confidence : Confidence;
    notes : Text;
    createdAt : Int;
  };
};
