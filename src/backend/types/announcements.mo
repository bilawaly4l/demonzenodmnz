module {
  public type Announcement = {
    id : Text;
    text : Text;
    link : ?Text;
    isActive : Bool;
    publishAt : ?Int;  // null = immediate; Int = nanosecond timestamp to publish at
  };
};
