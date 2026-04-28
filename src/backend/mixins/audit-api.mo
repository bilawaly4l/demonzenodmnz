import List "mo:core/List";
import Set "mo:core/Set";
import AuditTypes "../types/audit";
import Common "../types/common";
import AuditLib "../lib/audit";
import AuthLib "../lib/auth";

mixin (
  auditLog : List.List<AuditTypes.AuditEntry>,
  sessions : Set.Set<Text>,
) {
  /// Admin: retrieve all audit log entries (newest first)
  public func getAuditLog(
    sessionToken : Text,
  ) : async Common.Result<[AuditTypes.AuditEntry], Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    #ok(AuditLib.getAuditLog(auditLog));
  };

  /// Admin: attempt rollback — returns the rollback payload for a given audit entry
  public func rollbackAdminAction(
    sessionToken : Text,
    entryId      : Text,
  ) : async Common.Result<Text, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    // Retrieve rollback payload; caller uses it to undo the action client-side
    let result = AuditLib.getRollbackData(auditLog, entryId);
    switch (result) {
      case (#ok(data)) {
        // Log the rollback attempt itself
        let _ = AuditLib.logEntry(
          auditLog, 0,
          "rollback_attempt", "Rolled back entry: " # entryId,
          sessionToken, null,
        );
        #ok(data);
      };
      case (#err(e)) { #err(e) };
    };
  };
};
