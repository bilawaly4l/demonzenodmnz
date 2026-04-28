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
  aiSessions    : Set.Set<Text>,
  adminSessions : Set.Set<Text>,
  // API keys stored per provider
  geminiKey      : { var value : Text },
  openaiKey      : { var value : Text },
  grokKey        : { var value : Text },
  claudeKey      : { var value : Text },
  perplexityKey  : { var value : Text },
  mistralKey     : { var value : Text },
  cohereKey      : { var value : Text },
  deepseekKey    : { var value : Text },
  groqKey        : { var value : Text },
  togetherKey    : { var value : Text },
  fireworksKey   : { var value : Text },
  openrouterKey  : { var value : Text },
  huggingfaceKey : { var value : Text },
  replicateKey   : { var value : Text },
  ollamaKey      : { var value : Text },
  // Additional providers
  ai21Key        : { var value : Text },
  nlpcloudKey    : { var value : Text },
  anyscaleKey    : { var value : Text },
  cerebrasKey    : { var value : Text },
  sambanovaKey   : { var value : Text },
  cloudflareKey  : { var value : Text },
  novitaKey      : { var value : Text },
  moonshotKey    : { var value : Text },
  zhipuKey       : { var value : Text },
  upstageKey     : { var value : Text },
) {

  // ── Per-session supplementary state ──────────────────────────────────────
  let journalMapV2    = Map.empty<Text, List.List<AiTypes.JournalEntry>>();
  let ratingMap       = Map.empty<Text, List.List<AiTypes.ResponseRating>>();
  let langMap         = Map.empty<Text, Text>();
  let dailyBriefingRef  = { var value : Text = "" };
  let dailyBriefingDate = { var value : Int  = 0  };

  // ── Build provider keys record for smart routing ──────────────────────────

  func providerKeys() : {
    openrouter : Text; gemini    : Text; groq      : Text; deepseek  : Text;
    grok       : Text; mistral   : Text; openai    : Text; cohere    : Text;
    together   : Text; fireworks : Text; perplexity: Text; cerebras  : Text;
    ai21       : Text; huggingface: Text; nlpcloud : Text; cloudflare: Text;
    novita     : Text; moonshot  : Text; zhipu     : Text; upstage   : Text;
    sambanova  : Text; anyscale  : Text; replicate : Text; ollama    : Text;
    claude     : Text;
  } {
    {
      openrouter  = openrouterKey.value;
      gemini      = geminiKey.value;
      groq        = groqKey.value;
      deepseek    = deepseekKey.value;
      grok        = grokKey.value;
      mistral     = mistralKey.value;
      openai      = openaiKey.value;
      cohere      = cohereKey.value;
      together    = togetherKey.value;
      fireworks   = fireworksKey.value;
      perplexity  = perplexityKey.value;
      cerebras    = cerebrasKey.value;
      ai21        = ai21Key.value;
      huggingface = huggingfaceKey.value;
      nlpcloud    = nlpcloudKey.value;
      cloudflare  = cloudflareKey.value;
      novita      = novitaKey.value;
      moonshot    = moonshotKey.value;
      zhipu       = zhipuKey.value;
      upstage     = upstageKey.value;
      sambanova   = sambanovaKey.value;
      anyscale    = anyscaleKey.value;
      replicate   = replicateKey.value;
      ollama      = ollamaKey.value;
      claude      = claudeKey.value;
    };
  };

  // ── Session helpers ───────────────────────────────────────────────────────

  func sessionLang(token : Text) : Text {
    switch (langMap.get(token)) {
      case (?l) l;
      case null "en";
    };
  };

  // ── AI Session Management ─────────────────────────────────────────────────

  /// Validate the unified DemonZeno AI passcode and return a session token.
  public func validateAiPasscode(passcode : Text) : async Common.Result<Text, Text> {
    if (AiAuth.validatePasscode(passcode)) {
      let token = AiAuth.generateToken();
      aiSessions.add(token);
      #ok(token);
    } else {
      #err("Invalid passcode");
    };
  };

  /// Check if a session token is valid.
  public query func validateAiSession(token : Text) : async Bool {
    AiAuth.validateSession(aiSessions, token);
  };

  public func invalidateAiSession(token : Text) : async () {
    AiAuth.invalidateSession(aiSessions, token);
    journalMapV2.remove(token);
    ratingMap.remove(token);
    langMap.remove(token);
  };

  // ── AI Message Routing ────────────────────────────────────────────────────

  /// Send a message through DemonZeno AI — auto-routes to the best provider.
  /// The `provider` parameter is accepted for API compatibility but ignored;
  /// the backend always auto-selects the best available provider.
  public func sendAiMessage(
    sessionToken : Text,
    message      : Text,
    provider     : Text,
    history      : [AiTypes.ChatMessage],
  ) : async Common.Result<Text, Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    let lang = sessionLang(sessionToken);
    // Strip AiTypes.ChatMessage fields down to what the provider layer expects
    let plainHistory = history.map(func(m) { { role = m.role; content = m.content } });
    let response = await AiProviders.routeAndSendMessage(
      providerKeys(), lang, plainHistory, message,
    );
    if (response == "") return #err("Empty response from provider");
    #ok(response);
  };

  // ── AI Signal Backtesting ─────────────────────────────────────────────────

  public func backtestSignal(signal : Text, sessionToken : Text) : async Common.Result<Text, Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    let prompt =
      "Perform a detailed backtesting analysis of the following trading signal. " #
      "Analyze how this signal would have performed historically based on typical market conditions for this asset. " #
      "Include: approximate win rate for similar setups, average risk-to-reward achieved, market regime when this works best, " #
      "and any historical precedents. Be specific and data-driven.\n\nSignal to backtest:\n" # signal;
    let response = await AiProviders.routeAndSendMessage(providerKeys(), "en", [], prompt);
    if (response == "") return #err("Empty response from provider");
    #ok(response);
  };

  // ── Daily Market Briefing ─────────────────────────────────────────────────

  public query func getDailyBriefing() : async Text {
    dailyBriefingRef.value;
  };

  public func generateDailyBriefing(sessionToken : Text) : async Common.Result<Text, Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    let prompt =
      "Generate a concise daily market briefing for crypto traders. " #
      "Cover: overall market sentiment (bullish/bearish/neutral), top 3 coins to watch today with brief reason, " #
      "key support/resistance levels for BTC and ETH, and one high-probability trade setup with entry/TP/SL. " #
      "Format it cleanly with emoji headers. Be professional and specific.";
    let response = await AiProviders.routeAndSendMessage(providerKeys(), "en", [], prompt);
    if (response == "") return #err("Empty response from provider");
    dailyBriefingRef.value  := response;
    dailyBriefingDate.value := Time.now();
    #ok(response);
  };

  // ── Trade Journal ─────────────────────────────────────────────────────────

  public func addJournalEntry(
    entry        : AiTypes.JournalEntry,
    sessionToken : Text,
  ) : async Common.Result<Text, Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    let journal = switch (journalMapV2.get(sessionToken)) {
      case (?j) j;
      case null {
        let j = List.empty<AiTypes.JournalEntry>();
        journalMapV2.add(sessionToken, j);
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
    switch (journalMapV2.get(sessionToken)) {
      case (?j) #ok(j.toArray());
      case null  #ok([]);
    };
  };

  public func clearJournal(sessionToken : Text) : async Common.Result<(), Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    switch (journalMapV2.get(sessionToken)) {
      case (?j) { j.clear(); #ok(()) };
      case null  #ok(());
    };
  };

  // ── AI-Powered FAQ ────────────────────────────────────────────────────────

  public func askFaq(question : Text) : async Text {
    let knowledgeBase =
      "You are a helpful assistant for the DemonZeno platform. " #
      "Answer questions about DemonZeno using only the following knowledge base:\n\n" #
      "- DemonZeno is an anime-inspired crypto trading signals platform.\n" #
      "- DemonZeno provides FREE daily trading signals on Binance Square @DemonZeno.\n" #
      "- DemonZeno AI is a single unified AI that handles all requests: trading signals, Q&A, code, and more.\n" #
      "- DMNZ is the platform's meme token launching via Telegram Mini App on Blum in 2027.\n" #
      "- 2026: Community building on Binance.\n" #
      "- 2027: DMNZ token launch via Blum on Telegram.\n" #
      "- 2028: Massive Buyback & Burn — reduces supply, increases token price, triggers bonding curve for exchange listings.\n" #
      "- 100% fair launch, no presale, no allocation, no vesting.\n" #
      "- Official social links: Binance Square @DemonZeno and Twitter @ZenoDemon.\n" #
      "- Slogan: 'DemonZeno: Master the Chaos, Slay the Market, and Trade Like a God.'\n" #
      "Answer concisely in DemonZeno's confident, anime-inspired voice. " #
      "If the question is not covered by the knowledge base, say so politely.";
    await AiProviders.routeAndSendMessage(
      providerKeys(), "en", [],
      knowledgeBase # "\n\nQuestion: " # question,
    );
  };

  /// DMNZ-token-specific FAQ — answers only from token metadata context.
  public func askTokenFaq(question : Text) : async Text {
    let tokenContext =
      "You are a dedicated DemonZeno Token (DMNZ) FAQ assistant. " #
      "Only answer questions about the DMNZ token using this knowledge base:\n\n" #
      "- Token name: DemonZeno | Ticker: DMNZ\n" #
      "- 100% fair launch — no presale, no allocation, no vesting schedule\n" #
      "- Launch platform: Telegram Mini App via Blum\n" #
      "- Launch date: April 2, 2028\n" #
      "- 2028 Buyback & Burn event: reduce supply, increase token price, trigger bonding curve for major exchange listings\n" #
      "- Bonding curve mechanic: burn event moves DMNZ onto external centralised and decentralised exchanges\n" #
      "- BLUM is a Telegram-based launchpad for Mini App tokens — DemonZeno launches there\n" #
      "- Post-launch benefits: reduced supply through burns, community perks, exchange listings\n" #
      "- No KYC, no whitelist, no ambassador program, no presale tiers\n" #
      "- Follow the project: Binance Square @DemonZeno | Twitter @ZenoDemon\n" #
      "Answer concisely and in DemonZeno's confident voice. " #
      "If the question is outside this scope, politely redirect the user.";
    await AiProviders.routeAndSendMessage(
      providerKeys(), "en", [],
      tokenContext # "\n\nQuestion: " # question,
    );
  };

  // ── Session Recap ─────────────────────────────────────────────────────────

  public func getSessionRecap(
    history      : [AiTypes.ChatMessage],
    sessionToken : Text,
  ) : async Common.Result<Text, Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    if (history.size() == 0) {
      return #ok("No signals or insights discussed yet in this session.");
    };
    var transcript = "";
    for (msg in history.values()) {
      if (msg.role == "user") {
        transcript := transcript # "User: " # msg.content # "\n";
      } else if (msg.role == "assistant") {
        transcript := transcript # "AI: " # msg.content # "\n";
      };
    };
    let prompt =
      "Summarize this trading session. List all signals discussed with their key details " #
      "(asset, entry, TP1/TP2/TP3, SL, timeframe), any market insights shared, and overall session theme. " #
      "Be concise and well-structured with emoji headers.\n\nSession transcript:\n" # transcript;
    let response = await AiProviders.routeAndSendMessage(providerKeys(), "en", [], prompt);
    if (response == "") return #err("Empty response from provider");
    #ok(response);
  };

  // ── Multi-Language Support ────────────────────────────────────────────────

  public func setAiLanguage(lang : Text, sessionToken : Text) : async Common.Result<(), Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    let supported = ["en", "ar", "es", "zh"];
    let isSupported = supported.find(func(l) { l == lang });
    switch (isSupported) {
      case null return #err("Unsupported language. Supported: en, ar, es, zh");
      case _    {};
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
      case null  #ok("en");
    };
  };

  // ── Response Rating ───────────────────────────────────────────────────────

  public func rateAiResponse(
    messageId    : Text,
    rating       : Int,
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
      case null  #ok([]);
    };
  };

  // ── Post-Trade Analysis ───────────────────────────────────────────────────

  /// Ask the AI to analyze what happened after a trade closed.
  public func generatePostTradeAnalysis(
    signal       : Text,
    outcome      : Text,
    sessionToken : Text,
  ) : async Common.Result<Text, Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    let prompt =
      "Provide a detailed post-trade analysis for the following completed trade.\n\n" #
      "Original Signal:\n" # signal # "\n\n" #
      "Trade Outcome:\n" # outcome # "\n\n" #
      "Analysis should include:\n" #
      "1. What went right or wrong with the entry\n" #
      "2. Whether the stop loss and take profits were reasonable\n" #
      "3. What market conditions affected the outcome\n" #
      "4. Key lessons learned from this trade\n" #
      "5. How to improve the setup next time\n\n" #
      "Be specific, constructive, and educational.";
    let response = await AiProviders.routeAndSendMessage(providerKeys(), "en", [], prompt);
    if (response == "") return #err("Empty response from provider");
    #ok(response);
  };

  // ── Price Prediction ──────────────────────────────────────────────────────

  /// Ask the AI for a short-term price prediction with confidence level.
  public func generatePricePrediction(
    asset        : Text,
    sessionToken : Text,
  ) : async Common.Result<Text, Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    let prompt =
      "Provide a short-term price prediction for " # asset # ".\n\n" #
      "Format your response as:\n" #
      "📈 PRICE PREDICTION: " # asset # "\n" #
      "⏱ Timeframe: [24h/48h/7d]\n" #
      "🎯 Target: $[price]\n" #
      "📊 Confidence: [High/Medium/Low] — [brief reason]\n" #
      "🔑 Key Factors: [3 bullet points driving this prediction]\n" #
      "⚠️ Risk: [what could invalidate this prediction]\n\n" #
      "IMPORTANT: This is an AI estimate based on technical and market analysis patterns. " #
      "Always label it as an estimate, not financial advice.";
    let response = await AiProviders.routeAndSendMessage(providerKeys(), "en", [], prompt);
    if (response == "") return #err("Empty response from provider");
    #ok(response);
  };

  // ── Signal Comparison ─────────────────────────────────────────────────────

  /// Compare two assets side-by-side and determine which is the stronger trade.
  public func compareSignals(
    asset1       : Text,
    asset2       : Text,
    sessionToken : Text,
  ) : async Common.Result<Text, Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    let prompt =
      "Compare the current trading opportunities for " # asset1 # " vs " # asset2 # ".\n\n" #
      "For each asset provide:\n" #
      "- Current trend direction\n" #
      "- Key support/resistance levels\n" #
      "- Recommended trade direction (LONG/SHORT)\n" #
      "- Approximate Entry, SL, TP1, TP2, TP3\n" #
      "- Confidence score (1–10)\n\n" #
      "Then give a final verdict: which asset offers the stronger trade opportunity right now and why.\n\n" #
      "Format clearly with emoji headers and a comparison table.";
    let response = await AiProviders.routeAndSendMessage(providerKeys(), "en", [], prompt);
    if (response == "") return #err("Empty response from provider");
    #ok(response);
  };

  // ── News Impact Analysis ──────────────────────────────────────────────────

  /// Paste a news headline and get an AI rating of its market impact.
  public func analyzeNewsImpact(
    headline     : Text,
    sessionToken : Text,
  ) : async Common.Result<Text, Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    let prompt =
      "Analyze the potential market impact of the following news headline:\n\n" #
      "\"" # headline # "\"\n\n" #
      "Provide:\n" #
      "📰 HEADLINE ANALYSIS\n" #
      "🔥 Impact Level: [High/Medium/Low/Neutral]\n" #
      "📈 Expected Market Direction: [Bullish/Bearish/Neutral] for [affected assets]\n" #
      "⏱ Duration: [Short-term/Medium-term/Long-term]\n" #
      "🎯 Most Affected Assets: [list top 3 affected coins/pairs]\n" #
      "💡 Trading Insight: [how to position around this news]\n" #
      "⚠️ Disclaimer: This is AI analysis, not financial advice.";
    let response = await AiProviders.routeAndSendMessage(providerKeys(), "en", [], prompt);
    if (response == "") return #err("Empty response from provider");
    #ok(response);
  };

  // ── AI Signal Chaining ────────────────────────────────────────────────────

  /// Generate a complete multi-step trading plan: entry → management → exit.
  public func generateSignalChain(
    asset        : Text,
    sessionToken : Text,
  ) : async Common.Result<Text, Text> {
    if (not AiAuth.validateSession(aiSessions, sessionToken)) {
      return #err("Invalid or expired AI session");
    };
    let prompt =
      "Create a complete multi-step trading plan for " # asset # ".\n\n" #
      "Include ALL of the following in order:\n\n" #
      "1. 🎯 INITIAL ENTRY SIGNAL\n" #
      "   Entry: $X | SL: $X | TP1: $X | TP2: $X | TP3: $X\n\n" #
      "2. 📊 TRADE MANAGEMENT\n" #
      "   - When to move SL to breakeven\n" #
      "   - When to take partial profits\n" #
      "   - Position sizing recommendation\n\n" #
      "3. 🔄 RE-ENTRY SETUP\n" #
      "   - If TP1 is hit, where to re-enter for a continuation\n" #
      "   - If SL is hit, where the next valid setup forms\n\n" #
      "4. 🏁 EXIT STRATEGY\n" #
      "   - Final exit levels\n" #
      "   - Warning signals to exit early\n\n" #
      "5. ⚠️ RISK ASSESSMENT\n" #
      "   - Max risk per trade\n" #
      "   - Market conditions that invalidate this plan";
    let response = await AiProviders.routeAndSendMessage(providerKeys(), "en", [], prompt);
    if (response == "") return #err("Empty response from provider");
    #ok(response);
  };

  // ── Admin API Key Management ──────────────────────────────────────────────

  public func setAiApiKey(
    adminToken : Text,
    provider   : Text,
    key        : Text,
  ) : async Common.Result<(), Text> {
    if (not adminSessions.contains(adminToken)) {
      return #err("Invalid admin session");
    };
    switch (provider) {
      case "gemini"      { geminiKey.value      := key };
      case "openai"      { openaiKey.value      := key };
      case "gpt4o"       { openaiKey.value      := key };
      case "grok"        { grokKey.value        := key };
      case "claude"      { claudeKey.value      := key };
      case "perplexity"  { perplexityKey.value  := key };
      case "mistral"     { mistralKey.value     := key };
      case "cohere"      { cohereKey.value      := key };
      case "deepseek"    { deepseekKey.value    := key };
      case "groq"        { groqKey.value        := key };
      case "together"    { togetherKey.value    := key };
      case "fireworks"   { fireworksKey.value   := key };
      case "openrouter"  { openrouterKey.value  := key };
      case "huggingface" { huggingfaceKey.value := key };
      case "replicate"   { replicateKey.value   := key };
      case "ollama"      { ollamaKey.value      := key };
      case "ai21"        { ai21Key.value        := key };
      case "nlpcloud"    { nlpcloudKey.value    := key };
      case "anyscale"    { anyscaleKey.value    := key };
      case "cerebras"    { cerebrasKey.value    := key };
      case "sambanova"   { sambanovaKey.value   := key };
      case "cloudflare"  { cloudflareKey.value  := key };
      case "novita"      { novitaKey.value      := key };
      case "moonshot"    { moonshotKey.value    := key };
      case "zhipu"       { zhipuKey.value       := key };
      case "upstage"     { upstageKey.value     := key };
      case _ { return #err("Unknown provider: " # provider) };
    };
    #ok(());
  };

  public query func getAiProviderStatus() : async [(Text, Bool)] {
    [
      ("gemini",      geminiKey.value      != ""),
      ("openai",      openaiKey.value      != ""),
      ("grok",        grokKey.value        != ""),
      ("claude",      claudeKey.value      != ""),
      ("perplexity",  perplexityKey.value  != ""),
      ("mistral",     mistralKey.value     != ""),
      ("cohere",      cohereKey.value      != ""),
      ("deepseek",    deepseekKey.value    != ""),
      ("groq",        groqKey.value        != ""),
      ("together",    togetherKey.value    != ""),
      ("fireworks",   fireworksKey.value   != ""),
      ("openrouter",  openrouterKey.value  != ""),
      ("huggingface", huggingfaceKey.value != ""),
      ("replicate",   replicateKey.value   != ""),
      ("ollama",      ollamaKey.value      != ""),
      ("ai21",        ai21Key.value        != ""),
      ("nlpcloud",    nlpcloudKey.value    != ""),
      ("anyscale",    anyscaleKey.value    != ""),
      ("cerebras",    cerebrasKey.value    != ""),
      ("sambanova",   sambanovaKey.value   != ""),
      ("cloudflare",  cloudflareKey.value  != ""),
      ("novita",      novitaKey.value      != ""),
      ("moonshot",    moonshotKey.value    != ""),
      ("zhipu",       zhipuKey.value       != ""),
      ("upstage",     upstageKey.value     != ""),
    ];
  };
};
