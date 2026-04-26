import List "mo:core/List";
import RoadmapTypes "../types/roadmap";
import Common "../types/common";

module {
  public type RoadmapMilestone = RoadmapTypes.RoadmapMilestone;
  public type Result<T, E> = Common.Result<T, E>;

  public func getRoadmap(milestones : List.List<RoadmapMilestone>) : [RoadmapMilestone] {
    milestones.toArray();
  };

  /// Default roadmap milestones as defined in the project brief
  public func defaultMilestones() : [RoadmapMilestone] {
    [
      {
        year = "2026";
        title = "Community Building";
        description = "Build the DemonZeno community on Binance Square. Daily free trading signals, follower growth, and brand establishment across crypto markets.";
        completed = false;
      },
      {
        year = "2027";
        title = "DMNZ Token Launch";
        description = "Launch the DMNZ meme token via BLUM Mini App on Telegram. 100% fair launch — no presale, no private allocation, no whitelist. Everyone participates on equal terms.";
        completed = false;
      },
      {
        year = "2028";
        title = "Buyback & Burn";
        description = "Execute a massive Buyback & Burn campaign to reduce DMNZ supply, increase token price, and trigger the bonding curve for listings on other major exchanges.";
        completed = false;
      },
    ];
  };
};
