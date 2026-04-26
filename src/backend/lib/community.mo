import CommunityTypes "../types/community";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  public type CommunityCounter  = CommunityTypes.CommunityCounter;
  public type DemonZenoQuote    = CommunityTypes.DemonZenoQuote;
  public type Testimonial       = CommunityTypes.Testimonial;
  public type CommunityMilestone = CommunityTypes.CommunityMilestone;

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
    let active = quotes.filter(func(q) { q.active });
    active.toArray();
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
    let active = testimonials.filter(func(t) { t.active });
    active.toArray();
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
    milestones : List.List<CommunityMilestone>,
    idCounter  : { var value : Nat },
    title      : Text,
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
    milestones   : List.List<CommunityMilestone>,
    id           : Text,
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
};
