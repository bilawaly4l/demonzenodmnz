import Set "mo:core/Set";
import Text "mo:core/Text";
import Nat8 "mo:core/Nat8";
import Sha256 "mo:sha2/Sha256";
import Time "mo:core/Time";

module {
  /// SHA-256 hash of the passcode "252525"
  /// Validated on the backend — never trust client-side.
  public let PASSCODE_HASH : Text = "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5";

  /// Convert a Blob to lowercase hex string
  func blobToHex(b : Blob) : Text {
    let hexChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    var result = "";
    for (byte in b.values()) {
      let hi = byte.toNat() / 16;
      let lo = byte.toNat() % 16;
      result := result # hexChars[hi] # hexChars[lo];
    };
    result;
  };

  public func validatePasscode(passcode : Text) : Bool {
    let encoded = passcode.encodeUtf8();
    let hashBlob = Sha256.fromBlob(#sha256, encoded);
    let hashHex = blobToHex(hashBlob);
    hashHex == PASSCODE_HASH;
  };

  public func generateToken() : Text {
    let t = Time.now();
    let encoded = ("dmnz-session-" # t.toText()).encodeUtf8();
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
