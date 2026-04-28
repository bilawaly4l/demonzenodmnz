module {
  public type AnnouncementCategory = { #General; #Signal; #Token; #Admin; #Alert };

  public type Announcement = {
    id : Text;
    title : Text;
    body : Text;
    category : AnnouncementCategory;
    link : ?Text;
    isActive : Bool;
    isPinned : Bool;
    publishAt : ?Int;  // null = immediate; Int = nanosecond timestamp to publish at
    timestamp : Int;
  };
};
