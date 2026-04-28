module {
  // AiMode removed — unified DemonZeno AI uses a single session store

  public type ChatMessage = {
    role      : Text;
    content   : Text;
    provider  : ?Text;
    timestamp : Int;
  };

  public type AiRequest = {
    sessionToken : Text;
    message      : Text;
    history      : [ChatMessage];
  };

  public type AiProviderConfig = {
    name   : Text;
    hasKey : Bool;
  };

  /// Trade journal entry for tracking P&L per session
  public type JournalEntry = {
    id         : Text;
    asset      : Text;       // e.g. "BTC/USDT"
    direction  : Text;       // "LONG" | "SHORT"
    entryPrice : Float;
    exitPrice  : ?Float;
    lots       : Float;      // position size
    notes      : Text;
    timestamp  : Int;
    pnl        : ?Float;
  };

  /// Response rating: 1 = thumbs up, -1 = thumbs down
  public type ResponseRating = {
    messageId : Text;
    rating    : Int;
    timestamp : Int;
  };
};
