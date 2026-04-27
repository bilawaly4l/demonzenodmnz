// Migration: drop insaneSessions (removed in AI unification)
// Old actor had both aiSessions and insaneSessions (Set<Text>).
// New actor has only aiSessions. This migration discards insaneSessions.

import Set "mo:core/Set";

module {
  type OldActor = {
    insaneSessions : Set.Set<Text>;
  };

  type NewActor = {};

  public func run(_old : OldActor) : NewActor {
    // insaneSessions is consumed and discarded — sessions are transient anyway
    {};
  };
};
