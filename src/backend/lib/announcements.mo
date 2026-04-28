import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Types "../types/announcements";
import Common "../types/common";

module {
  public type Announcement = Types.Announcement;
  public type AnnouncementCategory = Types.AnnouncementCategory;
  public type Result<T, E> = Common.Result<T, E>;

  /// Returns only active, published announcements from the list
  public func getActiveAnnouncements(list : [Announcement]) : [Announcement] {
    let now = Time.now();
    list.filter(func(ann) {
      if (not ann.isActive) return false;
      switch (ann.publishAt) {
        case (?at) { at <= now };
        case null  { true };
      };
    });
  };

  /// Build a new Announcement record
  public func makeAnnouncement(
    nextId    : Nat,
    title     : Text,
    body      : Text,
    category  : AnnouncementCategory,
    link      : ?Text,
    isPinned  : Bool,
    publishAt : ?Int,
  ) : (Announcement, Nat) {
    let ann : Announcement = {
      id        = nextId.toText();
      title;
      body;
      category;
      link;
      isActive  = true;
      isPinned;
      publishAt;
      timestamp = Time.now();
    };
    (ann, nextId + 1);
  };
};
