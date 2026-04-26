import Set "mo:core/Set";
import Text "mo:core/Text";
import Common "../types/common";
import AuthLib "../lib/auth";

mixin (sessions : Set.Set<Text>) {
  public func validatePasscode(
    passcode : Text,
  ) : async Common.Result<Text, Text> {
    if (AuthLib.validatePasscode(passcode)) {
      let token = AuthLib.generateToken();
      sessions.add(token);
      #ok(token);
    } else {
      #err("Invalid passcode");
    };
  };

  public query func validateSession(token : Text) : async Bool {
    AuthLib.validateSession(sessions, token);
  };

  public func invalidateSession(token : Text) : async () {
    AuthLib.invalidateSession(sessions, token);
  };
};
