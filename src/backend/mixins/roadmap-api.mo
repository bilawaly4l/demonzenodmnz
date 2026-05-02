import List "mo:core/List";
import RoadmapTypes "../types/roadmap";
import Common "../types/common";
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

  /// Admin: update a milestone's completed status by its id.
  public func adminUpdateMilestone(id : Text, completed : Bool) : async Common.Result<(), Text> {
    let found = roadmapMilestones.find(func(m : RoadmapTypes.RoadmapMilestone) : Bool { m.id == id });
    switch (found) {
      case null { #err("Milestone not found: " # id) };
      case (?_) {
        roadmapMilestones.mapInPlace(func(m : RoadmapTypes.RoadmapMilestone) : RoadmapTypes.RoadmapMilestone {
          if (m.id == id) { { m with completed } } else { m };
        });
        #ok(());
      };
    };
  };
};
