module {
  /// A single milestone on the DMNZ token roadmap.
  public type RoadmapMilestone = {
    id          : Text;
    year        : Text;  // e.g. "2026"
    date        : ?Text; // e.g. ?"April 2, 2027"
    title       : Text;
    description : Text;
    completed   : Bool;
  };

  /// Static DMNZ token information
  public type TokenInfo = {
    name           : Text;
    ticker         : Text;
    description    : Text;
    launchPlatform : Text;
    socialLinks    : [{ name : Text; url : Text }];
    slogan         : Text;
    totalSupply    : Text;
    distribution   : Text;
  };
};
