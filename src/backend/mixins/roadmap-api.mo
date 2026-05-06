import List "mo:core/List";
import RoadmapTypes "../types/roadmap";
import RoadmapLib "../lib/roadmap";

mixin (
  roadmapMilestones : List.List<RoadmapTypes.RoadmapMilestone>,
) {
  /// Get all roadmap milestones (public — no auth required).
  public query func getRoadmap() : async [RoadmapTypes.RoadmapMilestone] {
    roadmapMilestones.toArray();
  };

  /// Get static DMNZ token info (public — no auth required).
  public query func getTokenInfo() : async RoadmapTypes.TokenInfo {
    RoadmapLib.getTokenInfo();
  };
};

