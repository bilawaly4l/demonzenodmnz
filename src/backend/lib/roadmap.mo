import List "mo:core/List";
import RoadmapTypes "../types/roadmap";

module {
  public type RoadmapMilestone = RoadmapTypes.RoadmapMilestone;

  public func getRoadmap(milestones : List.List<RoadmapMilestone>) : [RoadmapMilestone] {
    milestones.toArray();
  };

  /// Updated roadmap milestones per confirmed requirements:
  /// 2026: Community Building Year
  /// April 2, 2027: DMNZ created on Blum
  /// January 1, 2028: Huge buyback & burn
  public func defaultMilestones() : [RoadmapMilestone] {
    [
      {
        id          = "2026";
        year        = "2026";
        date        = null;
        title       = "Community Building Year";
        description = "Build the DemonZeno community across Binance Square and Twitter. Daily free trading signals, follower growth, and brand establishment. This entire year is dedicated to building the strongest possible community before DMNZ launch.";
        completed   = false;
      },
      {
        id          = "2027";
        year        = "2027";
        date        = ?"April 2, 2027";
        title       = "DMNZ Created on Blum";
        description = "The DMNZ meme token is officially created on the Telegram Mini App via Blum on April 2nd, 2027. 100% community-driven — no presale, no private allocation, fair launch for everyone.";
        completed   = false;
      },
      {
        id          = "2028";
        year        = "2028";
        date        = ?"January 1, 2028";
        title       = "Huge Buyback & Burn";
        description = "A massive buyback and burn campaign to drastically reduce the DMNZ supply, increase value, and hit the bonding curve — enabling listings on major exchanges and driving token appreciation.";
        completed   = false;
      },
    ];
  };

  /// Static DMNZ token info
  public func getTokenInfo() : RoadmapTypes.TokenInfo {
    {
      name           = "DemonZeno";
      ticker         = "DMNZ";
      description    = "DMNZ is the official meme token of the DemonZeno trading community — powered by education, community, and a relentless drive to master the markets.";
      launchPlatform = "Telegram Mini App via Blum";
      socialLinks    = [
        { name = "Binance Square"; url = "https://www.binance.com/en/square/profile/DemonZeno" },
        { name = "Twitter / X";    url = "https://twitter.com/ZenoDemon" },
      ];
      slogan         = "Master the Chaos. Trade Like a God.";
      totalSupply    = "Community-determined at launch";
      distribution   = "100% fair launch — no presale, no private allocation, no team tokens. All tokens distributed equally to the community.";
    };
  };
};
