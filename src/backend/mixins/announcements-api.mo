import List "mo:core/List";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Order "mo:core/Order";
import AnnTypes "../types/announcements";
import AuditTypes "../types/audit";
import Common "../types/common";
import AnnLib "../lib/announcements";
import AuditLib "../lib/audit";
import AuthLib "../lib/auth";

mixin (
  announcements   : List.List<AnnTypes.Announcement>,
  annIdCounter    : { var value : Nat },
  auditLog        : List.List<AuditTypes.AuditEntry>,
  auditIdCounter  : { var value : Nat },
  sessions        : Set.Set<Text>,
) {
  /// Public: get all active, published announcements (sorted: pinned first)
  public query func getAnnouncements() : async [AnnTypes.Announcement] {
    let all = announcements.toArray();
    let active = AnnLib.getActiveAnnouncements(all);
    // Pinned first, then by timestamp descending
    active.sort(func(a : AnnTypes.Announcement, b : AnnTypes.Announcement) : Order.Order {
      if (a.isPinned and not b.isPinned) { #less }
      else if (not a.isPinned and b.isPinned) { #greater }
      else if (a.timestamp > b.timestamp) { #less }
      else if (a.timestamp < b.timestamp) { #greater }
      else { #equal }
    });
  };

  /// Admin: get all announcements (including inactive/scheduled)
  public func getAllAnnouncements(
    sessionToken : Text,
  ) : async Common.Result<[AnnTypes.Announcement], Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let arr = announcements.toArray();
    // Newest first
    #ok(arr.reverse());
  };

  /// Admin: create a new announcement
  public func addAnnouncement(
    sessionToken : Text,
    title        : Text,
    body         : Text,
    category     : AnnTypes.AnnouncementCategory,
    link         : ?Text,
    isPinned     : Bool,
    publishAt    : ?Int,
  ) : async Common.Result<AnnTypes.Announcement, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let (ann, newId) = AnnLib.makeAnnouncement(annIdCounter.value, title, body, category, link, isPinned, publishAt);
    announcements.add(ann);
    annIdCounter.value := newId;
    let action = switch (publishAt) {
      case (?_) { "schedule_announcement" };
      case null { "add_announcement" };
    };
    auditIdCounter.value := AuditLib.logEntry(
      auditLog, auditIdCounter.value,
      action, "Added announcement: " # title,
      sessionToken, null,
    );
    #ok(ann);
  };

  /// Admin: update an existing announcement
  public func updateAnnouncement(
    sessionToken : Text,
    id           : Text,
    title        : Text,
    body         : Text,
    category     : AnnTypes.AnnouncementCategory,
    link         : ?Text,
    isPinned     : Bool,
    isActive     : Bool,
    publishAt    : ?Int,
  ) : async Common.Result<AnnTypes.Announcement, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    var found : ?AnnTypes.Announcement = null;
    announcements.mapInPlace(func(a) {
      if (a.id == id) {
        let updated : AnnTypes.Announcement = { a with title; body; category; link; isPinned; isActive; publishAt };
        found := ?updated;
        updated;
      } else { a };
    });
    switch (found) {
      case (?ann) {
        auditIdCounter.value := AuditLib.logEntry(
          auditLog, auditIdCounter.value,
          "update_announcement", "Updated announcement: " # id,
          sessionToken, null,
        );
        #ok(ann);
      };
      case null { #err("Announcement not found: " # id) };
    };
  };

  /// Admin: delete an announcement
  public func deleteAnnouncement(
    sessionToken : Text,
    id           : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let before = announcements.size();
    let kept = announcements.filter(func(a) { a.id != id });
    announcements.clear();
    announcements.addAll(kept.values());
    if (announcements.size() < before) {
      auditIdCounter.value := AuditLib.logEntry(
        auditLog, auditIdCounter.value,
        "delete_announcement", "Deleted announcement: " # id,
        sessionToken, null,
      );
      #ok(());
    } else {
      #err("Announcement not found: " # id);
    };
  };

  /// Admin: pin or unpin an announcement
  public func pinAnnouncement(
    sessionToken : Text,
    id           : Text,
    pin          : Bool,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    var found = false;
    announcements.mapInPlace(func(a) {
      if (a.id == id) {
        found := true;
        { a with isPinned = pin };
      } else { a };
    });
    if (found) {
      auditIdCounter.value := AuditLib.logEntry(
        auditLog, auditIdCounter.value,
        "pin_announcement", "Pinned=" # (if (pin) "true" else "false") # " for " # id,
        sessionToken, null,
      );
      #ok(());
    } else {
      #err("Announcement not found: " # id);
    };
  };
};
