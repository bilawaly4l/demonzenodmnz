import List "mo:core/List";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Types "../types/faqs";
import Common "../types/common";

module {
  public type FAQ = Types.FAQ;
  public type Result<T, E> = Common.Result<T, E>;

  public func addFaq(
    faqs : List.List<FAQ>,
    nextId : Nat,
    question : Text,
    answer : Text,
  ) : (FAQ, Nat) {
    let order = faqs.size();
    let faq : FAQ = {
      id = nextId.toText();
      question;
      answer;
      order;
    };
    faqs.add(faq);
    (faq, nextId + 1);
  };

  public func updateFaq(
    faqs : List.List<FAQ>,
    id : Text,
    question : Text,
    answer : Text,
  ) : Result<FAQ, Text> {
    var found : ?FAQ = null;
    faqs.mapInPlace(func(f) {
      if (f.id == id) {
        let updated : FAQ = { f with question; answer };
        found := ?updated;
        updated;
      } else {
        f;
      };
    });
    switch (found) {
      case (?f) { #ok(f) };
      case null { #err("FAQ not found: " # id) };
    };
  };

  public func deleteFaq(
    faqs : List.List<FAQ>,
    id : Text,
  ) : Result<(), Text> {
    let before = faqs.size();
    let filtered = faqs.filter(func(f) { f.id != id });
    let after = filtered.size();
    if (before == after) {
      return #err("FAQ not found: " # id);
    };
    faqs.clear();
    faqs.append(filtered);
    // Reassign orders after deletion
    var idx = 0;
    faqs.mapInPlace(func(f) {
      let updated : FAQ = { f with order = idx };
      idx += 1;
      updated;
    });
    #ok(());
  };

  public func reorderFaqs(
    faqs : List.List<FAQ>,
    orderedIds : [Text],
  ) : Result<(), Text> {
    // Verify all IDs exist
    for (id in orderedIds.values()) {
      let exists = faqs.find(func(f) { f.id == id });
      switch (exists) {
        case null { return #err("FAQ not found: " # id) };
        case (?_) {};
      };
    };
    // Assign new order positions based on orderedIds array
    faqs.mapInPlace(func(f) {
      let posOpt = orderedIds.findIndex(func(id) { id == f.id });
      switch (posOpt) {
        case (?pos) { { f with order = pos } };
        case null { f };
      };
    });
    #ok(());
  };

  func compareByOrder(a : FAQ, b : FAQ) : { #less; #equal; #greater } {
    Nat.compare(a.order, b.order);
  };

  public func getFaqs(faqs : List.List<FAQ>) : [FAQ] {
    let arr = faqs.toArray();
    // Sort by order field ascending
    arr.sort(compareByOrder);
  };
};
