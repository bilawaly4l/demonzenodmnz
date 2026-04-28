import Set "mo:core/Set";
import Text "mo:core/Text";
import Sha256 "mo:sha2/Sha256";
import Time "mo:core/Time";

module {
  /// Convert a Blob to lowercase hex string
  public func blobToHex(b : Blob) : Text {
    let hexChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    var result = "";
    for (byte in b.values()) {
      let hi = byte.toNat() / 16;
      let lo = byte.toNat() % 16;
      result := result # hexChars[hi] # hexChars[lo];
    };
    result;
  };

  public func hashText(s : Text) : Text {
    let encoded = s.encodeUtf8();
    let hashBlob = Sha256.fromBlob(#sha256, encoded);
    blobToHex(hashBlob);
  };

  /// Single unified passcode for DemonZeno AI
  let AI_PASSCODE = "DemonZeno2420075112009BP";

  /// Validate the unified DemonZeno AI passcode.
  /// Returns true if the passcode matches, false otherwise.
  public func validatePasscode(passcode : Text) : Bool {
    hashText(passcode) == hashText(AI_PASSCODE);
  };

  public func generateToken() : Text {
    let t = Time.now();
    let encoded = ("dmnz-ai-session-" # t.toText()).encodeUtf8();
    let hashBlob = Sha256.fromBlob(#sha256, encoded);
    blobToHex(hashBlob);
  };

  public func validateSession(
    sessions : Set.Set<Text>,
    token : Text,
  ) : Bool {
    sessions.contains(token);
  };

  public func invalidateSession(
    sessions : Set.Set<Text>,
    token : Text,
  ) {
    sessions.remove(token);
  };
};
