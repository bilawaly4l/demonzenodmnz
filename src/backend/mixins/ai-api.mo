import Set "mo:core/Set";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Common "../types/common";
import AiTypes "../types/ai";
import AiAuth "../lib/ai-auth";
import AiProviders "../lib/ai-providers";

mixin (
  aiSessions : Set.Set<Text>,
  insaneSessions : Set.Set<Text>,
  adminSessions : Set.Set<Text>,
  // API keys stored per provider
  geminiKey : { var value : Text },
  openaiKey : { var value : Text },
  grokKey : { var value : Text },
  claudeKey : { var value : Text },
  perplexityKey : { var value : Text },
  mistralKey : { var value : Text },
  cohereKey : { var value : Text },
  deepseekKey : { var value : Text },
  groqKey : { var value : Text },
  togetherKey : { var value : Text },
  fireworksKey : { var value : Text },
  openrouterKey : { var value : Text },
  huggingfaceKey : { var value : Text },
  replicateKey : { var value : Text },
  ollamaKey : { var value : Text },
  // Additional providers
  ai21Key : { var value : Text },
  nlpcloudKey : { var value : Text },
  anyscaleKey : { var value : Text },
  cerebrasKey : { var value : Text },
  sambanovaKey : { var value : Text },
  cloudflareKey : { var value : Text },
  novitaKey : { var value : Text },
  moonshotKey : { var value : Text },
  zhipuKey : { var value : Text },
  upstageKey : { var value : Text },
) {

  // ── Per-session supplementary state ──────────────────────────────────────
  // Trade journals keyed by sessionToken
  let journalMap = Map.empty<Text, List.List<AiTypes.JournalEntry>>();
  // Response ratings keyed by sessionToken
  let ratingMap = Map.empty<Text, List.List<AiTypes.ResponseRating>>();
  // Language preference keyed by sessionToken
  let langMap = Map.empty<Text, Text>();
  // Cached daily briefing
  let dailyBriefingRef = { var value : Text = "" };
  let dailyBriefingDate = { var value : Int = 0 };

  // ── AI Session Management ─────────────────────────────────────────────────

  /// Validate passcode, return (sessionToken, mode) on success.
  /// "normal" or "insane" mode is returned so the frontend knows which was unlocked.
  public func validateAiPasscode(
    passcode : Text,
  ) : async Common.Result<(Text, Text), Text> {
    switch (AiAuth.validatePasscodeWithMode(passcode)) {
      case (?#Normal) {
        let token = AiAuth.generateToken();
        aiSessions.add(token);
        #ok((token, "normal"));
      };
      case (?#Insane) {
        let token = AiAuth.generateToken();
        insaneSessions.add(token);
        aiSessions.add(token); // also valid for general AI session checks
        #ok((token, "insane"));
      };
      case null {
        #err("Invalid passcode");
      };
    };
  };

  /// Check if a session token is valid (Normal or Insane).
  public query func validateAiSession(token : Text) : async Bool {
    AiAuth.validateSession(aiSessions, token);
  };

  /// Check if a session token is an Insane-tier session.
  public query func validateInsaneSession(token : Text) : async Bool {
    AiAuth.validateSession(insaneSessions, token);
  };

  public func invalidateAiSession(token : Text) : async () {
    AiAuth.invalidateSession(aiSessions, token);
    AiAuth.invalidateSession(insaneSessions, token);
    journalMap.remove(token);
    ratingMap.remove(token);
    langMap.remove(token);
  };

  // ── AI Message Routing ────────────────────────────────────────────────────

  /// Send a message to an AI provider with full conversation history.
  /// The mode is validated server-side: Insane mode requires an insane session token.
  public func sendAiMessage(
    sessionToken : Text,
    message : Text,
    provider : Text,
    mode : Text,
    history : [AiTypes.ChatMessage],
  ) : async Common.Result<Text, Text> {
    // Validate AI session
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    // Insane mode requires an insane-tier session token; downgrade if not authorized
    let effectiveMode = if (mode == "insane") {
      if (AiAuth.validateSession(insaneSessions, sessionToken)) "insane" else "normal"
    } else {
      "normal"
    };
    // Get language preference for this session
    let lang = switch (langMap.get(sessionToken)) {
      case (?l) l;
      case null "en";
    };
    // Look up API key for the requested provider — fall back to openrouter if empty
    let apiKey = getProviderKey(provider);
    let (finalProvider, finalKey) = if (apiKey == "") {
      let fallbackKey = openrouterKey.value;
      if (fallbackKey == "") {
        return #err("No API key configured for provider '" # provider # "'. Please configure at least the OpenRouter key.");
      };
      ("openrouter", fallbackKey);
    } else {
      (provider, apiKey);
    };
    // Make the HTTP outcall with full history and language
    let response = await AiProviders.callProvider(finalProvider, finalKey, effectiveMode, lang, history, message);
    if (response == "") {
      return #err("Empty response from provider");
    };
    #ok(response);
  };

  // ── AI signal backtesting ─────────────────────────────────────────────────

  public func backtestSignal(signal : Text, sessionToken : Text) : async Common.Result<Text, Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    if (hasNoProvider()) {
      return #err("No AI provider configured. Please set at least one API key.");
    };
    let (prov, key) = getBestAvailableKey();
    let prompt = "Perform a detailed backtesting analysis of the following trading signal. " #
      "Analyze how this signal would have performed historically based on typical market conditions for this asset. " #
      "Include: approximate win rate for similar setups, average R:R achieved, market regime when this works best, " #
      "and any historical precedents. Be specific and data-driven.\n\nSignal to backtest:\n" # signal;
    let response = await AiProviders.callProvider(prov, key, "normal", "en", [], prompt);
    if (response == "") return #err("Empty response from provider");
    #ok(response);
  };

  // ── Daily market briefing ─────────────────────────────────────────────────

  public query func getDailyBriefing() : async Text {
    dailyBriefingRef.value;
  };

  public func generateDailyBriefing(sessionToken : Text) : async Common.Result<Text, Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    if (hasNoProvider()) {
      return #err("No AI provider configured.");
    };
    let (prov, key) = getBestAvailableKey();
    let prompt = "Generate a concise daily market briefing for crypto traders. " #
      "Cover: overall market sentiment (bullish/bearish/neutral), top 3 coins to watch today with brief reason, " #
      "key support/resistance levels for BTC and ETH, and one high-probability trade setup with entry/TP/SL. " #
      "Format it cleanly with emoji headers. Be professional and specific.";
    let response = await AiProviders.callProvider(prov, key, "normal", "en", [], prompt);
    if (response == "") return #err("Empty response from provider");
    dailyBriefingRef.value := response;
    dailyBriefingDate.value := Time.now();
    #ok(response);
  };

  // ── Trade journal ─────────────────────────────────────────────────────────

  public func addJournalEntry(
    entry : AiTypes.JournalEntry,
    sessionToken : Text,
  ) : async Common.Result<Text, Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    let journal = switch (journalMap.get(sessionToken)) {
      case (?j) j;
      case null {
        let j = List.empty<AiTypes.JournalEntry>();
        journalMap.add(sessionToken, j);
        j;
      };
    };
    journal.add(entry);
    #ok(entry.id);
  };

  public query func getJournalEntries(sessionToken : Text) : async Common.Result<[AiTypes.JournalEntry], Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    switch (journalMap.get(sessionToken)) {
      case (?j) #ok(j.toArray());
      case null #ok([]);
    };
  };

  public func clearJournal(sessionToken : Text) : async Common.Result<(), Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    switch (journalMap.get(sessionToken)) {
      case (?j) { j.clear(); #ok(()) };
      case null #ok(());
    };
  };

  // ── AI-powered FAQ ────────────────────────────────────────────────────────
  // No auth required — publicly accessible

  public func askFaq(question : Text) : async Text {
    if (hasNoProvider()) {
      return "DemonZeno AI is not yet configured. Please ask the admin to set up an API key.";
    };
    let (prov, key) = getBestAvailableKey();
    let systemContext = "You are a helpful assistant for the DemonZeno platform. " #
      "Answer questions about DemonZeno using only the following knowledge base:\n\n" #
      "- DemonZeno is an anime-inspired crypto trading signals platform.\n" #
      "- DemonZeno provides FREE daily trading signals on Binance Square @DemonZeno.\n" #
      "- The AI has two modes: Normal (for Binance assets) and Insane (for any asset/exchange).\n" #
      "- DMNZ is the platform's meme token launching via Telegram Mini App on Blum in 2027.\n" #
      "- 2026: Community building on Binance.\n" #
      "- 2027: DMNZ token launch via Blum on Telegram.\n" #
      "- 2028: Massive Buyback & Burn — reduces supply, increases token price, triggers bonding curve for exchange listings.\n" #
      "- 100% fair launch, no presale, no allocation, no vesting.\n" #
      "- Official social links: Binance Square @DemonZeno and Twitter @ZenoDemon.\n" #
      "- Slogan: 'DemonZeno: Master the Chaos, Slay the Market, and Trade Like a God.'\n" #
      "- Admin passcode is required to access the admin dashboard (256-bit SHA validated).\n" #
      "Answer concisely and in DemonZeno's confident, anime-inspired voice. " #
      "If the question is not covered by the knowledge base, say so politely.";
    await AiProviders.callProvider(prov, key, "normal", "en", [], systemContext # "\n\nQuestion: " # question);
  };

  // ── Session recap ─────────────────────────────────────────────────────────

  public func getSessionRecap(
    history : [AiTypes.ChatMessage],
    sessionToken : Text,
  ) : async Common.Result<Text, Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    if (history.size() == 0) {
      return #ok("No signals or insights discussed yet in this session.");
    };
    if (hasNoProvider()) {
      return #err("No AI provider configured.");
    };
    let (prov, key) = getBestAvailableKey();
    // Build a compact transcript from history
    var transcript = "";
    for (msg in history.values()) {
      if (msg.role == "user") {
        transcript := transcript # "User: " # msg.content # "\n";
      } else if (msg.role == "assistant") {
        transcript := transcript # "AI: " # msg.content # "\n";
      };
    };
    let prompt = "Summarize this trading session. List all signals discussed with their key details " #
      "(asset, entry, TP1/TP2/TP3, SL, timeframe), any market insights shared, and overall session theme. " #
      "Be concise and well-structured with emoji headers.\n\nSession transcript:\n" # transcript;
    let response = await AiProviders.callProvider(prov, key, "normal", "en", [], prompt);
    if (response == "") return #err("Empty response from provider");
    #ok(response);
  };

  // ── Multi-language support ────────────────────────────────────────────────

  public func setAiLanguage(lang : Text, sessionToken : Text) : async Common.Result<(), Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    let supported = ["en", "ar", "es", "zh"];
    let isSupported = supported.find(func(l) { l == lang });
    switch (isSupported) {
      case null return #err("Unsupported language. Supported: en, ar, es, zh");
      case _ {};
    };
    langMap.add(sessionToken, lang);
    #ok(());
  };

  public query func getAiLanguage(sessionToken : Text) : async Common.Result<Text, Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    switch (langMap.get(sessionToken)) {
      case (?l) #ok(l);
      case null #ok("en");
    };
  };

  // ── Response rating ───────────────────────────────────────────────────────

  public func rateAiResponse(
    messageId : Text,
    rating : Int,
    sessionToken : Text,
  ) : async Common.Result<(), Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    if (rating != 1 and rating != -1) {
      return #err("Rating must be 1 (thumbs up) or -1 (thumbs down)");
    };
    let ratings = switch (ratingMap.get(sessionToken)) {
      case (?r) r;
      case null {
        let r = List.empty<AiTypes.ResponseRating>();
        ratingMap.add(sessionToken, r);
        r;
      };
    };
    let newRating : AiTypes.ResponseRating = {
      messageId;
      rating;
      timestamp = Time.now();
    };
    // Update if exists, otherwise add
    var found = false;
    ratings.mapInPlace(func(r) {
      if (r.messageId == messageId) {
        found := true;
        newRating;
      } else {
        r;
      };
    });
    if (not found) {
      ratings.add(newRating);
    };
    #ok(());
  };

  public query func getSessionRatings(sessionToken : Text) : async Common.Result<[AiTypes.ResponseRating], Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    switch (ratingMap.get(sessionToken)) {
      case (?r) #ok(r.toArray());
      case null #ok([]);
    };
  };

  // ── Admin API Key Management ──────────────────────────────────────────────

  public func setAiApiKey(
    adminToken : Text,
    provider : Text,
    key : Text,
  ) : async Common.Result<(), Text> {
    if (not adminSessions.contains(adminToken)) {
      return #err("Invalid admin session");
    };
    switch (provider) {
      case "gemini"      { geminiKey.value := key };
      case "openai"      { openaiKey.value := key };
      case "gpt4o"       { openaiKey.value := key };
      case "grok"        { grokKey.value := key };
      case "claude"      { claudeKey.value := key };
      case "perplexity"  { perplexityKey.value := key };
      case "mistral"     { mistralKey.value := key };
      case "cohere"      { cohereKey.value := key };
      case "deepseek"    { deepseekKey.value := key };
      case "groq"        { groqKey.value := key };
      case "together"    { togetherKey.value := key };
      case "fireworks"   { fireworksKey.value := key };
      case "openrouter"  { openrouterKey.value := key };
      case "huggingface" { huggingfaceKey.value := key };
      case "replicate"   { replicateKey.value := key };
      case "ollama"      { ollamaKey.value := key };
      case "ai21"        { ai21Key.value := key };
      case "nlpcloud"    { nlpcloudKey.value := key };
      case "anyscale"    { anyscaleKey.value := key };
      case "cerebras"    { cerebrasKey.value := key };
      case "sambanova"   { sambanovaKey.value := key };
      case "cloudflare"  { cloudflareKey.value := key };
      case "novita"      { novitaKey.value := key };
      case "moonshot"    { moonshotKey.value := key };
      case "zhipu"       { zhipuKey.value := key };
      case "upstage"     { upstageKey.value := key };
      case _ { return #err("Unknown provider: " # provider) };
    };
    #ok(());
  };

  public query func getAiProviderStatus() : async [(Text, Bool)] {
    [
      ("gemini",      geminiKey.value != ""),
      ("openai",      openaiKey.value != ""),
      ("grok",        grokKey.value != ""),
      ("claude",      claudeKey.value != ""),
      ("perplexity",  perplexityKey.value != ""),
      ("mistral",     mistralKey.value != ""),
      ("cohere",      cohereKey.value != ""),
      ("deepseek",    deepseekKey.value != ""),
      ("groq",        groqKey.value != ""),
      ("together",    togetherKey.value != ""),
      ("fireworks",   fireworksKey.value != ""),
      ("openrouter",  openrouterKey.value != ""),
      ("huggingface", huggingfaceKey.value != ""),
      ("replicate",   replicateKey.value != ""),
      ("ollama",      ollamaKey.value != ""),
      ("ai21",        ai21Key.value != ""),
      ("nlpcloud",    nlpcloudKey.value != ""),
      ("anyscale",    anyscaleKey.value != ""),
      ("cerebras",    cerebrasKey.value != ""),
      ("sambanova",   sambanovaKey.value != ""),
      ("cloudflare",  cloudflareKey.value != ""),
      ("novita",      novitaKey.value != ""),
      ("moonshot",    moonshotKey.value != ""),
      ("zhipu",       zhipuKey.value != ""),
      ("upstage",     upstageKey.value != ""),
    ];
  };

  // ── Private helpers ───────────────────────────────────────────────────────

  func getProviderKey(provider : Text) : Text {
    switch (provider) {
      case "gemini"      { geminiKey.value };
      case "openai"      { openaiKey.value };
      case "gpt4o"       { openaiKey.value };
      case "grok"        { grokKey.value };
      case "claude"      { claudeKey.value };
      case "perplexity"  { perplexityKey.value };
      case "mistral"     { mistralKey.value };
      case "cohere"      { cohereKey.value };
      case "deepseek"    { deepseekKey.value };
      case "groq"        { groqKey.value };
      case "together"    { togetherKey.value };
      case "fireworks"   { fireworksKey.value };
      case "openrouter"  { openrouterKey.value };
      case "huggingface" { huggingfaceKey.value };
      case "replicate"   { replicateKey.value };
      case "ollama"      { ollamaKey.value };
      case "ai21"        { ai21Key.value };
      case "nlpcloud"    { nlpcloudKey.value };
      case "anyscale"    { anyscaleKey.value };
      case "cerebras"    { cerebrasKey.value };
      case "sambanova"   { sambanovaKey.value };
      case "cloudflare"  { cloudflareKey.value };
      case "novita"      { novitaKey.value };
      case "moonshot"    { moonshotKey.value };
      case "zhipu"       { zhipuKey.value };
      case "upstage"     { upstageKey.value };
      case _             { "" };
    };
  };

  /// Returns (provider, apiKey) for the best available provider (priority order).
  /// Returns ("", "") when no provider has a key configured.
  func getBestAvailableKey() : (Text, Text) {
    let priority = [
      ("openrouter",  openrouterKey.value),
      ("gemini",      geminiKey.value),
      ("groq",        groqKey.value),
      ("mistral",     mistralKey.value),
      ("deepseek",    deepseekKey.value),
      ("together",    togetherKey.value),
      ("openai",      openaiKey.value),
      ("claude",      claudeKey.value),
      ("perplexity",  perplexityKey.value),
      ("cohere",      cohereKey.value),
      ("grok",        grokKey.value),
      ("fireworks",   fireworksKey.value),
      ("cerebras",    cerebrasKey.value),
      ("ai21",        ai21Key.value),
    ];
    for ((prov, key) in priority.values()) {
      if (key != "") return (prov, key);
    };
    ("", "");
  };

  func hasNoProvider() : Bool {
    let (_, key) = getBestAvailableKey();
    key == "";
  };
};
