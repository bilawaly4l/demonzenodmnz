import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Types "../types/faqs";
import Common "../types/common";

module {
  public type FAQ = Types.FAQ;
  public type FaqCategory = Types.FaqCategory;
  public type Result<T, E> = Common.Result<T, E>;

  public func addFaq(
    faqs : List.List<FAQ>,
    nextId : Nat,
    question : Text,
    answer : Text,
    category : FaqCategory,
  ) : (FAQ, Nat) {
    let order = faqs.size();
    let faq : FAQ = {
      id = nextId.toText();
      question;
      answer;
      category;
      helpfulCount = 0;
      notHelpfulCount = 0;
      order;
      timestamp = Time.now();
    };
    faqs.add(faq);
    (faq, nextId + 1);
  };

  public func updateFaq(
    faqs : List.List<FAQ>,
    id : Text,
    question : Text,
    answer : Text,
    category : FaqCategory,
  ) : Result<FAQ, Text> {
    var found : ?FAQ = null;
    faqs.mapInPlace(func(f) {
      if (f.id == id) {
        let updated : FAQ = { f with question; answer; category };
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

  public func rateFaq(
    faqs : List.List<FAQ>,
    id : Text,
    helpful : Bool,
  ) : Result<(), Text> {
    var found = false;
    faqs.mapInPlace(func(f) {
      if (f.id == id) {
        found := true;
        if (helpful) {
          { f with helpfulCount = f.helpfulCount + 1 };
        } else {
          { f with notHelpfulCount = f.notHelpfulCount + 1 };
        };
      } else { f };
    });
    if (found) { #ok(()) } else { #err("FAQ not found: " # id) };
  };

  func compareByOrder(a : FAQ, b : FAQ) : { #less; #equal; #greater } {
    Nat.compare(a.order, b.order);
  };

  public func getFaqs(faqs : List.List<FAQ>) : [FAQ] {
    let arr = faqs.toArray();
    // Sort by order field ascending
    arr.sort(compareByOrder);
  };

  public func getFaqsByCategory(faqs : List.List<FAQ>, category : FaqCategory) : [FAQ] {
    let filtered = faqs.filter(func(f) {
      switch (category) {
        case (#Signals) { switch (f.category) { case (#Signals) true; case _ false } };
        case (#DmnzToken) { switch (f.category) { case (#DmnzToken) true; case _ false } };
        case (#GeneralTrading) { switch (f.category) { case (#GeneralTrading) true; case _ false } };
        case (#Platform) { switch (f.category) { case (#Platform) true; case _ false } };
      };
    });
    let arr = filtered.toArray();
    arr.sort(compareByOrder);
  };
};
