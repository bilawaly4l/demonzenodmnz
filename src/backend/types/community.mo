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
};
