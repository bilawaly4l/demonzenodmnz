import CommunityTypes "../types/community";
import List "mo:core/List";
import Time "mo:core/Time";
import Common "../types/common";

module {
  public type CommunityCounter   = CommunityTypes.CommunityCounter;
  public type DemonZenoQuote     = CommunityTypes.DemonZenoQuote;
  public type Testimonial        = CommunityTypes.Testimonial;
  public type CommunityMilestone = CommunityTypes.CommunityMilestone;
  public type TopTrader          = CommunityTypes.TopTrader;
  public type CommunityQuestion  = CommunityTypes.CommunityQuestion;
  public type Result<T, E>       = Common.Result<T, E>;

  // ── Community counter ────────────────────────────────────────────────────

  public func getCommunityCounter(ref : { var value : CommunityCounter }) : CommunityCounter {
    ref.value;
  };

  public func setCommunityCounter(ref : { var value : CommunityCounter }, data : CommunityCounter) {
    ref.value := data;
  };

  // ── Quote rotator ────────────────────────────────────────────────────────

  public func defaultQuotes() : [DemonZenoQuote] {
    [
      {
        id     = "q1";
        quote  = "The market does not reward the timid. Enter with conviction, exit with discipline, and let chaos be your ally.";
        author = "DemonZeno";
        active = true;
      },
      {
        id     = "q2";
        quote  = "Every candle tells a story. Learn to read the silence between the wicks — that's where real edge lives.";
        author = "DemonZeno";
        active = true;
      },
      {
        id     = "q3";
        quote  = "Risk management is not fear — it is the sword that keeps you alive long enough to win the war.";
        author = "DemonZeno";
        active = true;
      },
      {
        id     = "q4";
        quote  = "Stop chasing green candles. The trader who waits for the perfect setup slays more demons than the one who trades every shadow.";
        author = "DemonZeno";
        active = true;
      },
      {
        id     = "q5";
        quote  = "Master the chaos of the market and you master yourself. That is the true power of DemonZeno.";
        author = "DemonZeno";
        active = true;
      },
    ];
  };

  public func getQuotes(quotes : List.List<DemonZenoQuote>) : [DemonZenoQuote] {
    quotes.filter(func(q) { q.active }).toArray();
  };

  public func addQuote(
    quotes    : List.List<DemonZenoQuote>,
    idCounter : { var value : Nat },
    quote     : Text,
    author    : Text,
  ) : Text {
    idCounter.value += 1;
    let id = "q" # idCounter.value.toText();
    quotes.add({ id; quote; author; active = true });
    id;
  };

  public func deleteQuote(quotes : List.List<DemonZenoQuote>, id : Text) {
    quotes.mapInPlace(func(q) {
      if (q.id == id) { { q with active = false } } else { q };
    });
  };

  // ── Testimonials ─────────────────────────────────────────────────────────

  public func getTestimonials(testimonials : List.List<Testimonial>) : [Testimonial] {
    testimonials.filter(func(t) { t.active }).toArray();
  };

  public func addTestimonial(
    testimonials : List.List<Testimonial>,
    idCounter    : { var value : Nat },
    name         : Text,
    content      : Text,
    winAmount    : ?Text,
    asset        : ?Text,
  ) : Text {
    idCounter.value += 1;
    let id = "t" # idCounter.value.toText();
    testimonials.add({
      id;
      name;
      content;
      winAmount;
      asset;
      active    = true;
      createdAt = Time.now();
    });
    id;
  };

  public func deleteTestimonial(testimonials : List.List<Testimonial>, id : Text) {
    testimonials.mapInPlace(func(t) {
      if (t.id == id) { { t with active = false } } else { t };
    });
  };

  // ── Community milestones ─────────────────────────────────────────────────

  public func getMilestones(milestones : List.List<CommunityMilestone>) : [CommunityMilestone] {
    milestones.toArray();
  };

  public func addMilestone(
    milestones  : List.List<CommunityMilestone>,
    idCounter   : { var value : Nat },
    title       : Text,
    description : Text,
  ) : Text {
    idCounter.value += 1;
    let id = "m" # idCounter.value.toText();
    milestones.add({
      id;
      title;
      description;
      reached        = false;
      reachedAt      = null;
      celebrateUntil = null;
    });
    id;
  };

  public func markMilestoneReached(
    milestones    : List.List<CommunityMilestone>,
    id            : Text,
    celebrateDays : Nat,
  ) {
    let now = Time.now();
    let celebrateUntil = now + (celebrateDays * 86_400_000_000_000);
    milestones.mapInPlace(func(m) {
      if (m.id == id) {
        { m with reached = true; reachedAt = ?now; celebrateUntil = ?celebrateUntil };
      } else { m };
    });
  };

  // ── Top Traders ──────────────────────────────────────────────────────────

  public func getTopTraders(traders : List.List<TopTrader>) : [TopTrader] {
    traders.filter(func(t) { t.isActive }).toArray();
  };

  public func addTopTrader(
    traders     : List.List<TopTrader>,
    idCounter   : { var value : Nat },
    name        : Text,
    bio         : Text,
    achievement : Text,
    week        : Text,
  ) : Text {
    idCounter.value += 1;
    let id = "tt" # idCounter.value.toText();
    traders.add({
      id;
      name;
      bio;
      achievement;
      week;
      isActive  = true;
      createdAt = Time.now();
    });
    id;
  };

  public func deleteTopTrader(traders : List.List<TopTrader>, id : Text) {
    traders.mapInPlace(func(t) {
      if (t.id == id) { { t with isActive = false } } else { t };
    });
  };

  // ── Community Questions ───────────────────────────────────────────────────

  public func getCommunityQuestions(questions : List.List<CommunityQuestion>) : [CommunityQuestion] {
    questions.filter(func(q) { q.isActive }).toArray();
  };

  public func submitCommunityQuestion(
    questions : List.List<CommunityQuestion>,
    idCounter : { var value : Nat },
    question  : Text,
  ) : Text {
    idCounter.value += 1;
    let id = "cq" # idCounter.value.toText();
    questions.add({
      id;
      question;
      answer    = null;
      isPinned  = false;
      votes     = 0;
      timestamp = Time.now();
      isActive  = true;
    });
    id;
  };

  public func pinCommunityQuestion(
    questions : List.List<CommunityQuestion>,
    id        : Text,
    answer    : Text,
  ) : Result<(), Text> {
    var found = false;
    questions.mapInPlace(func(q) {
      if (q.id == id) {
        found := true;
        { q with isPinned = true; answer = ?answer };
      } else { q };
    });
    if (found) { #ok(()) } else { #err("Question not found: " # id) };
  };

  public func voteCommunityQuestion(
    questions : List.List<CommunityQuestion>,
    id        : Text,
  ) : Result<(), Text> {
    var found = false;
    questions.mapInPlace(func(q) {
      if (q.id == id) {
        found := true;
        { q with votes = q.votes + 1 };
      } else { q };
    });
    if (found) { #ok(()) } else { #err("Question not found: " # id) };
  };

  public func deleteCommunityQuestion(questions : List.List<CommunityQuestion>, id : Text) {
    questions.mapInPlace(func(q) {
      if (q.id == id) { { q with isActive = false } } else { q };
    });
  };
};
