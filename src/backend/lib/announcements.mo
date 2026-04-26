import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Types "../types/announcements";
import Common "../types/common";

module {
  public type Announcement = Types.Announcement;
  public type Result<T, E> = Common.Result<T, E>;

  /// Returns the announcement only if it is active AND its publishAt has passed (or is null)
  public func getAnnouncement(current : ?Announcement) : ?Announcement {
    switch (current) {
      case (?ann) {
        if (not ann.isActive) return null;
        switch (ann.publishAt) {
          case (?at) {
            if (Time.now() >= at) { ?ann } else { null };
          };
          case null { ?ann };
        };
      };
      case null { null };
    };
  };

  public func setAnnouncement(
    current : ?Announcement,
    nextId : Nat,
    text : Text,
    link : ?Text,
    publishAt : ?Int,
  ) : (Announcement, Nat) {
    let id = switch (current) {
      case (?ann) { ann.id };
      case null { nextId.toText() };
    };
    let newNextId = switch (current) {
      case (?_) { nextId };
      case null { nextId + 1 };
    };
    let ann : Announcement = { id; text; link; isActive = true; publishAt };
    (ann, newNextId);
  };

  public func toggleAnnouncement(current : ?Announcement) : Result<(Announcement, Bool), Text> {
    switch (current) {
      case (?ann) {
        let updated : Announcement = { ann with isActive = not ann.isActive };
        #ok((updated, updated.isActive));
      };
      case null {
        #err("No announcement set");
      };
    };
  };
};
