import SentimentTypes "../types/sentiment";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat32 "mo:core/Nat32";

module {
  public type PriceData = SentimentTypes.PriceData;

  // IC management canister types for HTTP outcalls
  type HttpHeader = { name : Text; value : Text };
  type HttpRequestResult = {
    status : Nat;
    headers : [HttpHeader];
    body : Blob;
  };
  type HttpRequestArgs = {
    url : Text;
    max_response_bytes : ?Nat64;
    method : { #get; #head; #post };
    headers : [HttpHeader];
    body : ?Blob;
    transform : ?{
      function : shared ({ response : HttpRequestResult; context : Blob }) -> async HttpRequestResult;
      context : Blob;
    };
    is_replicated : ?Bool;
  };

  let ic = actor "aaaaa-aa" : actor {
    http_request : (HttpRequestArgs) -> async HttpRequestResult;
  };

  /// Extract a JSON number value for a given key from a flat JSON fragment.
  func extractJsonNumber(json : Text, key : Text) : ?Float {
    let search = "\"" # key # "\":";
    let parts = json.split(#text search);
    ignore parts.next();
    switch (parts.next()) {
      case null null;
      case (?afterKey) {
        var numStr = "";
        var started = false;
        var done = false;
        for (c in afterKey.toIter()) {
          if (not done) {
            let code = c.toNat32();
            let isDigit = code >= 48 and code <= 57;
            let isMinus = code == 45;
            let isDot   = code == 46;
            if (isDigit or isMinus or isDot) {
              numStr := numStr # Text.fromChar(c);
              started := true;
            } else if (started) {
              done := true;
            };
          };
        };
        if (numStr == "" or numStr == "-") {
          null;
        } else {
          // Parse float: split on '.'
          let splitParts = numStr.split(#char '.');
          let rawInt = switch (splitParts.next()) { case (?s) s; case null "0" };
          let rawFrac = switch (splitParts.next()) { case (?s) s; case null "" };
          var result : Float = 0.0;
          var negative = false;
          let cleanInt = if (rawInt.size() > 0 and rawInt.toArray()[0] == '-') {
            negative := true;
            Text.fromIter(rawInt.toIter().drop(1));
          } else {
            rawInt;
          };
          for (c in cleanInt.toIter()) {
            let d = c.toNat32().toNat();
            if (d >= 48 and d <= 57) {
              result := result * 10.0 + (d - 48 : Nat).toFloat();
            };
          };
          var fracMul : Float = 0.1;
          for (c in rawFrac.toIter()) {
            let d = c.toNat32().toNat();
            if (d >= 48 and d <= 57) {
              result := result + (d - 48 : Nat).toFloat() * fracMul;
              fracMul := fracMul * 0.1;
            };
          };
          if (negative) result := -result;
          ?result
        };
      };
    };
  };

  func trendFromChange(change : Float) : Text {
    if (change > 0.5) "up"
    else if (change < -0.5) "down"
    else "neutral";
  };

  /// Fetch real-time prices for BTC, ETH, BNB, SOL, XRP, DOGE from CoinGecko
  public func fetchAllPrices() : async [PriceData] {
    let url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,ripple,dogecoin&vs_currencies=usd&include_24hr_change=true";
    let result = try {
      await ic.http_request({
        url;
        max_response_bytes = ?8192;
        method = #get;
        headers = [{ name = "Accept"; value = "application/json" }];
        body = null;
        transform = null;
        is_replicated = ?false;
      });
    } catch (_) {
      return [];
    };
    if (result.status < 200 or result.status >= 300) {
      return [];
    };
    let bodyText = switch (result.body.decodeUtf8()) {
      case (?t) t;
      case null return [];
    };
    let now = Time.now();
    let assetMapping : [(Text, Text)] = [
      ("BTC",  "bitcoin"),
      ("ETH",  "ethereum"),
      ("BNB",  "binancecoin"),
      ("SOL",  "solana"),
      ("XRP",  "ripple"),
      ("DOGE", "dogecoin"),
    ];
    var prices : [PriceData] = [];
    for ((symbol, coinId) in assetMapping.values()) {
      let coinSearch = "\"" # coinId # "\":{";
      let coinParts = bodyText.split(#text coinSearch);
      ignore coinParts.next();
      let priceData : PriceData = switch (coinParts.next()) {
        case null {
          { asset = symbol; price = 0.0; priceChange24h = 0.0; trend = "neutral"; updatedAt = now };
        };
        case (?coinJson) {
          let price = switch (extractJsonNumber(coinJson, "usd")) {
            case (?p) p;
            case null 0.0;
          };
          let change = switch (extractJsonNumber(coinJson, "usd_24h_change")) {
            case (?c) c;
            case null 0.0;
          };
          {
            asset = symbol;
            price;
            priceChange24h = change;
            trend = trendFromChange(change);
            updatedAt = now;
          };
        };
      };
      prices := prices.concat([priceData]);
    };
    prices;
  };
};
