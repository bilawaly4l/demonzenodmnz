/// Migration module: upgrades from previous version to current version.
///
/// Incompatible changes handled:
///   1. announcementRef (?OldAnnouncement) dropped → announcements List seeded with old data
///   2. auditLog AuditEntry gains adminToken, rollbackData
///   3. faqs FAQ gains category, helpfulCount, notHelpfulCount, timestamp
///   4. signals Signal gains tp1, tp2, tp3, providerLabel, templateId, voteUp, voteDown, tags
///   5. journalMap renamed journalMapV2 with new JournalEntry type (old data dropped)
import NewAnnTypes "./types/announcements";
import NewAuditTypes "./types/audit";
import NewFaqTypes "./types/faqs";
import NewSignalTypes "./types/signals";
import List "mo:core/List";
import Map "mo:core/Map";

module {
  // ── Old types (inline — do NOT import from .old/) ───────────────────────────

  type OldAnnouncement = {
    id        : Text;
    text      : Text;
    link      : ?Text;
    isActive  : Bool;
    publishAt : ?Int;
  };

  type OldAuditEntry = {
    id        : Text;
    timestamp : Int;
    action    : Text;
    details   : Text;
  };

  type OldFAQ = {
    id       : Text;
    question : Text;
    answer   : Text;
    order    : Nat;
  };

  type OldMarketType   = { #Crypto; #Forex; #Stock };
  type OldDirection    = { #Buy; #Sell };
  type OldResultStatus = { #Active; #Win; #Loss; #Expired };
  type OldConfidence   = { #Low; #Medium; #High };
  type OldTimeframe    = { #Scalp; #Swing; #LongTerm };

  type OldSignal = {
    id          : Text;
    asset       : Text;
    marketType  : OldMarketType;
    direction   : OldDirection;
    entryPrice  : Text;
    targetPrice : Text;
    stopLoss    : Text;
    datePosted  : Text;
    result      : OldResultStatus;
    notes       : Text;
    confidence  : OldConfidence;
    sourceLabel : Text;
    expiry      : ?Int;
    timeframe   : OldTimeframe;
    isDraft     : Bool;
    publishAt   : ?Int;
  };

  // Old JournalEntry type — consumed and dropped (journalMap renamed to journalMapV2)
  type OldJournalEntry = {
    id         : Text;
    signal     : Text;
    entryPrice : Float;
    exitPrice  : ?Float;
    notes      : Text;
    timestamp  : Int;
    pnl        : ?Float;
  };

  // ── Input / Output record types ─────────────────────────────────────────────

  type OldActor = {
    announcementRef : { var value : ?OldAnnouncement };
    annIdCounter    : { var value : Nat };
    auditLog        : List.List<OldAuditEntry>;
    faqs            : List.List<OldFAQ>;
    signals         : List.List<OldSignal>;
    // journalMap consumed and dropped (data intentionally discarded; renamed to journalMapV2)
    journalMap      : Map.Map<Text, List.List<OldJournalEntry>>;
  };

  type NewActor = {
    announcements   : List.List<NewAnnTypes.Announcement>;
    annIdCounter    : { var value : Nat };
    auditLog        : List.List<NewAuditTypes.AuditEntry>;
    faqs            : List.List<NewFaqTypes.FAQ>;
    signals         : List.List<NewSignalTypes.Signal>;
    // journalMapV2 is a new field — no migration output needed (gets fresh initializer)
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────

  func migrateSignal(s : OldSignal) : NewSignalTypes.Signal {
    {
      id            = s.id;
      asset         = s.asset;
      marketType    = s.marketType;
      direction     = s.direction;
      entryPrice    = s.entryPrice;
      targetPrice   = s.targetPrice;
      stopLoss      = s.stopLoss;
      tp1           = "";
      tp2           = "";
      tp3           = "";
      datePosted    = s.datePosted;
      result        = s.result;
      notes         = s.notes;
      confidence    = s.confidence;
      sourceLabel   = s.sourceLabel;
      providerLabel = "";
      expiry        = s.expiry;
      timeframe     = s.timeframe;
      isDraft       = s.isDraft;
      publishAt     = s.publishAt;
      templateId    = null;
      voteUp        = 0;
      voteDown      = 0;
      tags          = [];
    }
  };

  func migrateAuditEntry(e : OldAuditEntry) : NewAuditTypes.AuditEntry {
    {
      id           = e.id;
      timestamp    = e.timestamp;
      action       = e.action;
      details      = e.details;
      adminToken   = "";
      rollbackData = null;
    }
  };

  func migrateFaq(f : OldFAQ) : NewFaqTypes.FAQ {
    {
      id              = f.id;
      question        = f.question;
      answer          = f.answer;
      category        = #Signals;
      helpfulCount    = 0;
      notHelpfulCount = 0;
      order           = f.order;
      timestamp       = 0;
    }
  };

  func migrateOldAnn(old : OldAnnouncement) : NewAnnTypes.Announcement {
    {
      id        = old.id;
      title     = "Announcement";
      body      = old.text;
      category  = #General;
      link      = old.link;
      isActive  = old.isActive;
      isPinned  = false;
      publishAt = old.publishAt;
      timestamp = 0;
    }
  };

  // ── Migration entry point ───────────────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    // Migrate auditLog
    let newAuditLog = List.empty<NewAuditTypes.AuditEntry>();
    for (e in old.auditLog.values()) {
      newAuditLog.add(migrateAuditEntry(e));
    };

    // Migrate faqs
    let newFaqs = List.empty<NewFaqTypes.FAQ>();
    for (f in old.faqs.values()) {
      newFaqs.add(migrateFaq(f));
    };

    // Migrate signals
    let newSignals = List.empty<NewSignalTypes.Signal>();
    for (s in old.signals.values()) {
      newSignals.add(migrateSignal(s));
    };

    // Consume journalMap (intentionally dropped — renamed to journalMapV2)
    ignore old.journalMap;

    // Seed announcements from old announcementRef if present
    let newAnnouncements = List.empty<NewAnnTypes.Announcement>();
    switch (old.announcementRef.value) {
      case null {};
      case (?oldAnn) { newAnnouncements.add(migrateOldAnn(oldAnn)) };
    };

    {
      announcements   = newAnnouncements;
      annIdCounter    = { var value = old.annIdCounter.value };
      auditLog        = newAuditLog;
      faqs            = newFaqs;
      signals         = newSignals;
    }
  };
};
