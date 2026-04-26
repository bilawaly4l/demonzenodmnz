import List "mo:core/List";
import Set "mo:core/Set";
import Text "mo:core/Text";
import AnnTypes "../types/announcements";
import AuditTypes "../types/audit";
import Common "../types/common";
import AnnLib "../lib/announcements";
import AuditLib "../lib/audit";
import AuthLib "../lib/auth";

mixin (
  announcementRef : { var value : ?AnnTypes.Announcement },
  annIdCounter : { var value : Nat },
  auditLog : List.List<AuditTypes.AuditEntry>,
  auditIdCounter : { var value : Nat },
  sessions : Set.Set<Text>,
) {
  public query func getAnnouncement() : async ?AnnTypes.Announcement {
    AnnLib.getAnnouncement(announcementRef.value);
  };

  /// publishAt: null = immediate; Int (nanoseconds) = future timestamp
  public func setAnnouncement(
    sessionToken : Text,
    text : Text,
    link : ?Text,
    publishAt : ?Int,
  ) : async Common.Result<AnnTypes.Announcement, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let (ann, newId) = AnnLib.setAnnouncement(announcementRef.value, annIdCounter.value, text, link, publishAt);
    announcementRef.value := ?ann;
    annIdCounter.value := newId;
    let action = switch (publishAt) {
      case (?_) { "schedule_announcement" };
      case null { "set_announcement" };
    };
    auditIdCounter.value := AuditLib.logEntry(auditLog, auditIdCounter.value, action, "Set announcement: " # text);
    #ok(ann);
  };

  public func toggleAnnouncement(
    sessionToken : Text,
  ) : async Common.Result<Bool, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    switch (AnnLib.toggleAnnouncement(announcementRef.value)) {
      case (#ok((updated, isActive))) {
        announcementRef.value := ?updated;
        let action = if (isActive) { "enable_announcement" } else { "disable_announcement" };
        auditIdCounter.value := AuditLib.logEntry(auditLog, auditIdCounter.value, action, "Toggled announcement visibility");
        #ok(isActive);
      };
      case (#err(e)) { #err(e) };
    };
  };
};
