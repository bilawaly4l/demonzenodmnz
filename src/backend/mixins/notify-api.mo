import List "mo:core/List";
import Set "mo:core/Set";
import Text "mo:core/Text";
import NotifyTypes "../types/notify";
import Common "../types/common";
import NotifyLib "../lib/notify";
import AuthLib "../lib/auth";

mixin (
  notifyEntries : List.List<NotifyTypes.NotifyMe>,
  notifyIdCounter : { var value : Nat },
  sessions : Set.Set<Text>,
  bannedEmails : Set.Set<Text>,
) {
  public func submitNotifyMe(
    name : ?Text,
    contact : Text,
  ) : async Common.Result<(), Text> {
    if (contact == "") {
      return #err("Contact is required");
    };
    // Check banned list
    if (bannedEmails.contains(contact)) {
      return #err("Email not eligible");
    };
    let (_, newId) = NotifyLib.submitNotifyMe(notifyEntries, notifyIdCounter.value, name, contact);
    notifyIdCounter.value := newId;
    #ok(());
  };

  public func getNotifyMeList(
    sessionToken : Text,
  ) : async Common.Result<[NotifyTypes.NotifyMe], Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    #ok(NotifyLib.getNotifyMeList(notifyEntries));
  };

  // ── Newsletter ban list management ────────────────────────────────────────

  public func banEmail(
    sessionToken : Text,
    email : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    if (email == "") {
      return #err("Email is required");
    };
    bannedEmails.add(email);
    #ok(());
  };

  public func unbanEmail(
    sessionToken : Text,
    email : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    bannedEmails.remove(email);
    #ok(());
  };

  public func getBannedEmails(
    sessionToken : Text,
  ) : async Common.Result<[Text], Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    #ok(bannedEmails.toArray());
  };
};
