import Set "mo:core/Set";
import Common "../types/common";
import AuthLib "../lib/auth";

/// Admin-level configuration queries — session-gated, admin-only.
mixin (sessions : Set.Set<Text>) {
  /// Returns a JSON-formatted admin config payload with feature flags and metadata.
  /// Validates admin session before returning.
  public func getAdminConfig(adminToken : Text) : async Common.Result<Text, Text> {
    if (not AuthLib.validateSession(sessions, adminToken)) {
      return #err("Unauthorized");
    };
    let config = "{" #
      "\"version\":\"3.0.0\"," #
      "\"projectName\":\"DemonZeno\"," #
      "\"ticker\":\"DMNZ\"," #
      "\"launchDate\":\"April 2, 2028\"," #
      "\"launchPlatform\":\"BLUM Mini App on Telegram\"," #
      "\"fairLaunch\":true," #
      "\"presale\":false," #
      "\"socialLinks\":{" #
        "\"binanceSquare\":\"https://www.binance.com/square/profile/DemonZeno\"," #
        "\"twitter\":\"https://twitter.com/ZenoDemon\"" #
      "}," #
      "\"features\":{" #
        "\"signals\":true," #
        "\"aiNormal\":true," #
        "\"aiInsane\":true," #
        "\"adminDashboard\":true," #
        "\"burnTracker\":true," #
        "\"communityCounter\":true," #
        "\"binanceFeed\":true," #
        "\"roadmap\":true," #
        "\"priceFeeds\":true," #
        "\"faq\":true," #
        "\"announcements\":true," #
        "\"notifyMe\":true" #
      "}," #
      "\"adminTabs\":[" #
        "\"signals\"," #
        "\"stats\"," #
        "\"faq\"," #
        "\"notify\"," #
        "\"announcements\"," #
        "\"scheduling\"," #
        "\"analytics\"," #
        "\"audit\"," #
        "\"bulkImport\"," #
        "\"aiKeys\"," #
        "\"burnTracker\"," #
        "\"communityCounter\"," #
        "\"binanceFeed\"," #
        "\"roadmap\"" #
      "]" #
    "}";
    #ok(config);
  };
};
