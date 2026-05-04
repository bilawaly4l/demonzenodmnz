import List "mo:core/List";
import RoadmapTypes "types/roadmap";
import RoadmapLib "lib/roadmap";
import RoadmapApi "mixins/roadmap-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  // ── Roadmap state ─────────────────────────────────────────────────────────
  let roadmapMilestones = List.fromArray<RoadmapTypes.RoadmapMilestone>(RoadmapLib.defaultMilestones());

  // ── Mixins ────────────────────────────────────────────────────────────────
  include RoadmapApi(roadmapMilestones);
};
