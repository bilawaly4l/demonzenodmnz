import TokenLaunchTypes "../types/token-launch";
import SignalTypes "../types/signals";
import Common "../types/common";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Order "mo:core/Order";

module {
  public type WhitepaperSection = TokenLaunchTypes.WhitepaperSection;
  public type WhitepaperContent = TokenLaunchTypes.WhitepaperContent;
  public type HolderBenefit     = TokenLaunchTypes.HolderBenefit;
  public type SignalOfWeek      = TokenLaunchTypes.SignalOfWeek;
  public type BurnEvent         = TokenLaunchTypes.BurnEvent;
  public type HypeMilestone     = TokenLaunchTypes.HypeMilestone;
  public type TokenData         = TokenLaunchTypes.TokenData;
  public type Result<T, E>      = Common.Result<T, E>;

  // ── Whitepaper ─────────────────────────────────────────────────────────────

  public func defaultWhitepaper() : WhitepaperContent {
    {
      title     = "DemonZeno (DMNZ) — Token Overview";
      updatedAt = 0;
      sections  = [
        {
          title   = "Overview";
          content = "DemonZeno (DMNZ) is a community-driven meme token launching exclusively via the BLUM Telegram Mini App. Powered by a devoted community of traders, signal followers, and believers in the DemonZeno philosophy: Master the Chaos, Slay the Market, and Trade Like a God.";
        },
        {
          title   = "Mission";
          content = "To build the strongest free trading signal community in crypto — with a token that rewards true believers and burns supply to drive long-term value. No VC backing. No insider allocations. Pure community power.";
        },
        {
          title   = "Token (DMNZ)";
          content = "Token Name: DemonZeno\nTicker: DMNZ\nLaunch Platform: BLUM Telegram Mini App\nLaunch Date: April 2, 2028\nBlockchain: Determined at launch\nSupply: 100% fair launch — all tokens distributed to the public.";
        },
        {
          title   = "Tokenomics";
          content = "100% Fair Launch. No presale. No private sale. No team allocation. No VC allocation. No vesting schedule. Every DMNZ token enters the market on equal footing. The community owns the token — period.";
        },
        {
          title   = "Roadmap";
          content = "2026 — Community Building: Growing the DemonZeno signal community on Binance Square. Free daily signals, education, and engagement.\n\n2027 — DMNZ Token Launch: Launching DMNZ as a meme token via the BLUM Telegram Mini App. 100% fair launch, community-first.\n\n2028 — Buyback & Burn Campaign: A massive buyback and burn operation for three strategic purposes: (1) Reduce circulating supply. (2) Increase token price. (3) Trigger the bonding curve to qualify for listings on other exchanges.";
        },
        {
          title   = "Community";
          content = "Follow DemonZeno for free daily trading signals:\n- Binance Square: @DemonZeno\n- Twitter: @ZenoDemon\n\nJoin the movement. Trade like a god.";
        },
        {
          title   = "Disclaimer";
          content = "DMNZ is a meme token created for community and entertainment purposes. Nothing on this platform constitutes financial advice. Trading cryptocurrencies involves significant risk. Always do your own research (DYOR) and never invest more than you can afford to lose.";
        },
      ];
    };
  };

  public func getWhitepaper(ref : { var value : WhitepaperContent }) : WhitepaperContent {
    ref.value;
  };

  public func updateWhitepaper(ref : { var value : WhitepaperContent }, content : WhitepaperContent) {
    ref.value := { content with updatedAt = Time.now() };
  };

  public func getWhitepaperUrl(urlRef : { var value : ?Text }) : ?Text {
    urlRef.value;
  };

  public func setWhitepaperUrl(urlRef : { var value : ?Text }, url : Text) {
    urlRef.value := ?url;
  };

  // ── Holder benefits ────────────────────────────────────────────────────────

  public func defaultHolderBenefits() : [HolderBenefit] {
    [
      {
        id          = "hb1";
        title       = "Priority Signal Access";
        description = "DMNZ holders get first access to high-confidence signals before they are posted publicly on Binance Square.";
        icon        = "🎯";
        active      = true;
      },
      {
        id          = "hb2";
        title       = "Burn Benefit";
        description = "Every buyback and burn reduces circulating supply — directly increasing the scarcity and value of your DMNZ holdings.";
        icon        = "🔥";
        active      = true;
      },
      {
        id          = "hb3";
        title       = "Community Governance";
        description = "DMNZ holders have a voice in key community decisions — from signal categories to burn schedules and platform direction.";
        icon        = "🗳️";
        active      = true;
      },
      {
        id          = "hb4";
        title       = "Exchange Listing Upside";
        description = "The 2028 burn campaign is designed to trigger the bonding curve for listings on additional exchanges — early holders benefit most.";
        icon        = "📈";
        active      = true;
      },
      {
        id          = "hb5";
        title       = "DemonZeno Inner Circle";
        description = "Top DMNZ holders are recognised in the Hall of Fame and gain access to exclusive community channels and announcements.";
        icon        = "⚔️";
        active      = true;
      },
    ];
  };

  public func getHolderBenefits(benefits : List.List<HolderBenefit>) : [HolderBenefit] {
    benefits.filter(func(b) { b.active }).toArray();
  };

  // ── Signal of the Week ─────────────────────────────────────────────────────

  public func setSignalOfWeek(
    ref      : { var value : ?SignalOfWeek },
    signalId : Text,
    comment  : Text,
    weekOf   : Text,
  ) {
    ref.value := ?{ signalId; comment; weekOf; featuredAt = Time.now() };
  };

  public func getSignalOfWeek(
    ref     : { var value : ?SignalOfWeek },
    signals : List.List<SignalTypes.Signal>,
  ) : ?(SignalTypes.Signal, Text, Text, Int) {
    switch (ref.value) {
      case null { null };
      case (?sow) {
        switch (signals.find(func(s) { s.id == sow.signalId })) {
          case null { null };
          case (?sig) { ?(sig, sow.comment, sow.weekOf, sow.featuredAt) };
        };
      };
    };
  };

  // ── Burn Events ────────────────────────────────────────────────────────────

  public func getBurnSchedule(burnEvents : List.List<BurnEvent>) : [BurnEvent] {
    burnEvents.toArray();
  };

  public func addBurnEvent(
    burnEvents : List.List<BurnEvent>,
    idCounter  : { var value : Nat },
    date       : Text,
    amount     : Text,
    reason     : Text,
  ) : (BurnEvent, Nat) {
    idCounter.value += 1;
    let id = "burn-" # idCounter.value.toText();
    let event : BurnEvent = {
      id;
      date;
      amount;
      reason;
      executed  = false;
      createdAt = Time.now();
    };
    burnEvents.add(event);
    (event, idCounter.value);
  };

  public func markBurnEventExecuted(
    burnEvents : List.List<BurnEvent>,
    id         : Text,
  ) : Result<(), Text> {
    var found = false;
    burnEvents.mapInPlace(func(e) {
      if (e.id == id) {
        found := true;
        { e with executed = true };
      } else { e };
    });
    if (found) { #ok(()) } else { #err("Burn event not found: " # id) };
  };

  // ── Hype Milestones ────────────────────────────────────────────────────────

  public func defaultHypeMilestones() : [HypeMilestone] {
    [
      { id = "hm1"; title = "1,000 Community Members";    targetCount = 1000;   achieved = false; achievedAt = null; order = 0 },
      { id = "hm2"; title = "5,000 Binance Followers";    targetCount = 5000;   achieved = false; achievedAt = null; order = 1 },
      { id = "hm3"; title = "10,000 Signal Subscribers";  targetCount = 10000;  achieved = false; achievedAt = null; order = 2 },
      { id = "hm4"; title = "50,000 Platform Visitors";   targetCount = 50000;  achieved = false; achievedAt = null; order = 3 },
      { id = "hm5"; title = "Token Launch April 2, 2028"; targetCount = 100000; achieved = false; achievedAt = null; order = 4 },
    ];
  };

  public func getHypeMilestones(milestones : List.List<HypeMilestone>) : [HypeMilestone] {
    let arr = milestones.toArray();
    arr.sort(func(a : HypeMilestone, b : HypeMilestone) : Order.Order { Nat.compare(a.order, b.order) });
  };

  public func addHypeMilestone(
    milestones  : List.List<HypeMilestone>,
    idCounter   : { var value : Nat },
    title       : Text,
    targetCount : Nat,
  ) : HypeMilestone {
    idCounter.value += 1;
    let order = milestones.size();
    let m : HypeMilestone = {
      id          = "hm-" # idCounter.value.toText();
      title;
      targetCount;
      achieved    = false;
      achievedAt  = null;
      order;
    };
    milestones.add(m);
    m;
  };

  public func markHypeMilestoneAchieved(
    milestones : List.List<HypeMilestone>,
    id         : Text,
  ) : Result<(), Text> {
    var found = false;
    milestones.mapInPlace(func(m) {
      if (m.id == id) {
        found := true;
        { m with achieved = true; achievedAt = ?Time.now() };
      } else { m };
    });
    if (found) { #ok(()) } else { #err("Milestone not found: " # id) };
  };

  // ── Token Data ─────────────────────────────────────────────────────────────

  public func defaultTokenData() : TokenData {
    {
      supply         = "100% Fair Launch";
      burnedAmount   = "0";
      launchDate     = "April 2, 2028";
      launchPlatform = "Telegram Mini App via Blum";
      ticker         = "DMNZ";
      name           = "DemonZeno";
    };
  };
};
