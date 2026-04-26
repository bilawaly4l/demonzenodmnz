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
};
