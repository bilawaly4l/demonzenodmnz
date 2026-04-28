import List "mo:core/List";
import Time "mo:core/Time";
import AuditTypes "../types/audit";
import Common "../types/common";

module {
  public type AuditEntry = AuditTypes.AuditEntry;
  public type Result<T, E> = Common.Result<T, E>;

  /// Append a new audit entry to the log
  public func logEntry(
    auditLog     : List.List<AuditEntry>,
    nextId       : Nat,
    action       : Text,
    details      : Text,
    adminToken   : Text,
    rollbackData : ?Text,
  ) : Nat {
    let entry : AuditEntry = {
      id           = nextId.toText();
      timestamp    = Time.now();
      action;
      details;
      adminToken;
      rollbackData;
    };
    auditLog.add(entry);
    nextId + 1;
  };

  /// Return all audit entries as an array (newest first)
  public func getAuditLog(auditLog : List.List<AuditEntry>) : [AuditEntry] {
    auditLog.toArray().reverse();
  };

  /// Attempt to rollback the action described by an audit entry.
  /// Returns the rollbackData payload if present, so the caller can act on it.
  public func getRollbackData(
    auditLog : List.List<AuditEntry>,
    entryId  : Text,
  ) : Result<Text, Text> {
    switch (auditLog.find(func(e) { e.id == entryId })) {
      case null { #err("Audit entry not found: " # entryId) };
      case (?entry) {
        switch (entry.rollbackData) {
          case null { #err("No rollback data for entry: " # entryId) };
          case (?data) { #ok(data) };
        };
      };
    };
  };
};
