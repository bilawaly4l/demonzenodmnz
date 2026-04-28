module {
  public type FaqCategory = { #Signals; #DmnzToken; #GeneralTrading; #Platform };

  public type FAQ = {
    id : Text;
    question : Text;
    answer : Text;
    category : FaqCategory;
    helpfulCount : Nat;
    notHelpfulCount : Nat;
    order : Nat;
    timestamp : Int;
  };
};
