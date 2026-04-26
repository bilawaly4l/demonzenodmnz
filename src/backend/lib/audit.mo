import Array "mo:core/Array";
import List "mo:core/List";
import Time "mo:core/Time";
import AuditTypes "../types/audit";

module {
  public type AuditEntry = AuditTypes.AuditEntry;

  /// Append a new audit entry to the log
  public func logEntry(
    auditLog : List.List<AuditEntry>,
    nextId : Nat,
    action : Text,
    details : Text,
  ) : Nat {
    let entry : AuditEntry = {
      id = nextId.toText();
      timestamp = Time.now();
      action;
      details;
    };
    auditLog.add(entry);
    nextId + 1;
  };

  /// Return all audit entries as an array (newest first)
  public func getAuditLog(auditLog : List.List<AuditEntry>) : [AuditEntry] {
    let arr = auditLog.toArray();
    arr.reverse();
  };
};
