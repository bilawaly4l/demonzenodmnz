import List "mo:core/List";
import Set "mo:core/Set";
import RoadmapTypes "types/roadmap";
import RoadmapLib "lib/roadmap";
import Common "types/common";
import RoadmapApi "mixins/roadmap-api";
import CommunityApi "mixins/community-api";

actor {
  // ── Roadmap state ─────────────────────────────────────────────────────────
  let roadmapMilestones = List.fromArray<RoadmapTypes.RoadmapMilestone>(RoadmapLib.defaultMilestones());

  // ── Early Believer wall ───────────────────────────────────────────────────
  let earlyBelievers        = List.empty<Common.EarlyBeliever>();
  let earlyBelieversHandles = Set.empty<Text>();

  // ── Hype wall ─────────────────────────────────────────────────────────────
  let hypeMessages = List.empty<Common.HypeMessage>();

  // ── First-100 pledge ──────────────────────────────────────────────────────
  let first100Pledges = List.empty<Common.First100Entry>();
  let first100Handles = Set.empty<Text>();

  // ── Pre-launch interest form ───────────────────────────────────────────────
  let interestSubmissions = List.empty<Common.InterestEntry>();
  let interestHandles     = Set.empty<Text>();

  // ── Community pledges ─────────────────────────────────────────────────────
  let communityPledges     = List.empty<Common.CommunityPledge>();

  // ── Community submissions ─────────────────────────────────────────────────
  let communitySubmissions = List.empty<Common.CommunitySubmission>();

  // ── Mixins ────────────────────────────────────────────────────────────────
  include RoadmapApi(roadmapMilestones);
  include CommunityApi(
    earlyBelievers,
    earlyBelieversHandles,
    hypeMessages,
    first100Pledges,
    first100Handles,
    interestSubmissions,
    interestHandles,
    communityPledges,
    communitySubmissions,
  );
};
