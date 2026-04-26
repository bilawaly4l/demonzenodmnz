import List "mo:core/List";
import Set "mo:core/Set";
import RoadmapTypes "../types/roadmap";
import Common "../types/common";
import RoadmapLib "../lib/roadmap";
import AuthLib "../lib/auth";

mixin (
  roadmapMilestones : List.List<RoadmapTypes.RoadmapMilestone>,
  sessions          : Set.Set<Text>,
) {
  public query func getRoadmap() : async [RoadmapTypes.RoadmapMilestone] {
    RoadmapLib.getRoadmap(roadmapMilestones);
  };

  /// Admin: add or replace a roadmap milestone
  public func setRoadmapMilestone(
    adminToken  : Text,
    year        : Text,
    title       : Text,
    description : Text,
    completed   : Bool,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, adminToken)) {
      return #err("Unauthorized");
    };
    // If a milestone for this year already exists, replace it
    var found = false;
    roadmapMilestones.mapInPlace(func(m) {
      if (m.year == year) {
        found := true;
        { m with title; description; completed };
      } else { m };
    });
    if (not found) {
      roadmapMilestones.add({ year; title; description; completed });
    };
    #ok(());
  };
};
