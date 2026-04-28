module {
  public type CommunityCounter = {
    binanceCount : Nat;
    twitterCount : Nat;
    lastUpdated  : Int;
  };

  // Quote rotator
  public type DemonZenoQuote = {
    id     : Text;
    quote  : Text;
    author : Text;
    active : Bool;
  };

  // Testimonials wall
  public type Testimonial = {
    id        : Text;
    name      : Text;
    content   : Text;
    winAmount : ?Text;
    asset     : ?Text;
    active    : Bool;
    createdAt : Int;
  };

  // Community milestones
  public type CommunityMilestone = {
    id             : Text;
    title          : Text;
    description    : Text;
    reached        : Bool;
    reachedAt      : ?Int;
    celebrateUntil : ?Int;
  };

  // Top Traders wall
  public type TopTrader = {
    id          : Text;
    name        : Text;
    bio         : Text;
    achievement : Text;
    week        : Text;
    isActive    : Bool;
    createdAt   : Int;
  };

  // Community Q&A
  public type CommunityQuestion = {
    id        : Text;
    question  : Text;
    answer    : ?Text;
    isPinned  : Bool;
    votes     : Nat;
    timestamp : Int;
    isActive  : Bool;
  };
};
