module {
  public type WhitepaperSection = {
    title   : Text;
    content : Text;
  };

  public type WhitepaperContent = {
    title     : Text;
    sections  : [WhitepaperSection];
    updatedAt : Int;
  };

  public type HolderBenefit = {
    id          : Text;
    title       : Text;
    description : Text;
    icon        : Text;
    active      : Bool;
  };

  // Signal of the Week (cross-references SignalTypes.Signal)
  public type SignalOfWeek = {
    signalId   : Text;
    comment    : Text;
    weekOf     : Text;
    featuredAt : Int;
  };
};
