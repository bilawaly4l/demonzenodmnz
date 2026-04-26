import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Types "../types/notify";

module {
  public type NotifyMe = Types.NotifyMe;

  public func submitNotifyMe(
    entries : List.List<NotifyMe>,
    nextId : Nat,
    name : ?Text,
    contact : Text,
  ) : (NotifyMe, Nat) {
    let now = Time.now();
    let entry : NotifyMe = {
      id = nextId.toText();
      name;
      contact;
      dateSubmitted = now.toText();
    };
    entries.add(entry);
    (entry, nextId + 1);
  };

  public func getNotifyMeList(entries : List.List<NotifyMe>) : [NotifyMe] {
    entries.toArray();
  };
};
