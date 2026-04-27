import Text "mo:core/Text";
import Nat "mo:core/Nat";

module {
  // ── IC Management Canister types for HTTP outcalls ───────────────────────
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

  // ── Unified DemonZeno AI system prompt ───────────────────────────────────

  public func buildSystemPrompt(lang : Text) : Text {
    let signalBlock =
      "\n\nFor EVERY trading signal request, you MUST provide ALL of these fields formatted EXACTLY as shown:\n" #
      "🎯 SIGNAL: [ASSET] [DIRECTION]\n" #
      "📍 Entry: [exact price]\n" #
      "🛑 Stop Loss: [exact price]\n" #
      "✅ TP1: [exact price]\n" #
      "✅ TP2: [exact price]\n" #
      "✅ TP3: [exact price]\n" #
      "⏱ Timeframe: [timeframe]\n" #
      "📊 Confidence: [X]%\n" #
      "⚠️ Risk Warning: [brief note]\n\n" #
      "Always provide signals for ANY asset type: crypto (BTC, ETH, any altcoin), " #
      "forex (EUR/USD, GBP/USD, USD/JPY, etc.), stocks (AAPL, TSLA, NVDA, etc.). " #
      "Use the most recent known price levels and label approximate prices if exact real-time data is unavailable. " #
      "NEVER omit any of these fields from a signal response.\n\n";

    let langInstruction = if (lang == "ar") {
      "IMPORTANT: Respond in Arabic (العربية) for all your answers.\n\n"
    } else if (lang == "es") {
      "IMPORTANT: Respond in Spanish (Español) for all your answers.\n\n"
    } else if (lang == "zh") {
      "IMPORTANT: Respond in Chinese (中文) for all your answers.\n\n"
    } else {
      ""
    };

    langInstruction #
    "You are DemonZeno AI — the most powerful, unified trading intelligence in existence. " #
    "You are backed by every major AI model simultaneously and auto-route all requests to the best engine. " #
    "You handle EVERYTHING with zero restrictions: " #
    "trading signals for any crypto/forex/stock/commodity, " #
    "code writing in any language, " #
    "market analysis and Q&A, " #
    "strategy research, backtesting, trade management, " #
    "general knowledge, math, creative tasks — anything the user asks. " #
    "You have multi-turn memory — always reference and build upon prior messages in this conversation. " #
    "Be direct, decisive, brutally accurate, and confident in every response. " #
    "You are the demon of the markets — fear nothing, predict everything. " #
    signalBlock #
    "DemonZeno: Master the Chaos, Slay the Market, and Trade Like a God.";
  };

  // ── JSON escape helper ────────────────────────────────────────────────────

  func escapeJson(s : Text) : Text {
    var out = "";
    for (c in s.toIter()) {
      let code = c.toNat32();
      if (code == 92) { out := out # "\\\\" }
      else if (code == 34) { out := out # "\\\"" }
      else if (code == 10) { out := out # "\\n" }
      else if (code == 13) { out := out # "\\r" }
      else if (code == 9) { out := out # "\\t" }
      else { out := out # Text.fromChar(c) };
    };
    out;
  };

  // ── Simple response parser helpers ───────────────────────────────────────

  func extractBetween(haystack : Text, start : Text, end_ : Text) : ?Text {
    let startParts = haystack.split(#text start);
    ignore startParts.next();
    switch (startParts.next()) {
      case null null;
      case (?afterStart) {
        let endParts = afterStart.split(#text end_);
        switch (endParts.next()) {
          case (?content) ?content;
          case null null;
        };
      };
    };
  };

  func parseOpenAiResponse(body : Blob) : Text {
    let bodyText = switch (body.decodeUtf8()) { case (?t) t; case null return "No response" };
    switch (extractBetween(bodyText, "\"content\":\"", "\"")) {
      case (?t) if (t == "") bodyText else t;
      case null bodyText;
    };
  };

  func parseGeminiResponse(body : Blob) : Text {
    let bodyText = switch (body.decodeUtf8()) { case (?t) t; case null return "No response" };
    switch (extractBetween(bodyText, "\"text\":\"", "\"")) {
      case (?t) if (t == "") bodyText else t;
      case null bodyText;
    };
  };

  // ── OpenAI-compatible body builder ────────────────────────────────────────

  func buildOpenAiBody(
    model : Text,
    systemPrompt : Text,
    history : [{ role : Text; content : Text }],
    message : Text,
  ) : Text {
    var messages = "[{\"role\":\"system\",\"content\":\"" # escapeJson(systemPrompt) # "\"}";
    for (msg in history.values()) {
      messages := messages # ",{\"role\":\"" # escapeJson(msg.role) # "\",\"content\":\"" # escapeJson(msg.content) # "\"}";
    };
    messages := messages # ",{\"role\":\"user\",\"content\":\"" # escapeJson(message) # "\"}]";
    "{\"model\":\"" # model # "\",\"messages\":" # messages # ",\"max_tokens\":1024}";
  };

  // ── Generic OpenAI-compatible call ────────────────────────────────────────

  func callOpenAiCompat(
    url : Text,
    model : Text,
    apiKey : Text,
    systemPrompt : Text,
    history : [{ role : Text; content : Text }],
    message : Text,
    extraHeaders : [HttpHeader],
  ) : async Text {
    let body = buildOpenAiBody(model, systemPrompt, history, message);
    let baseHeaders : [HttpHeader] = [
      { name = "Content-Type"; value = "application/json" },
      { name = "Authorization"; value = "Bearer " # apiKey },
    ];
    let allHeaders = baseHeaders.concat(extraHeaders);
    let result = await ic.http_request({
      url;
      max_response_bytes = ?16384;
      method = #post;
      headers = allHeaders;
      body = ?(body.encodeUtf8());
      transform = null;
      is_replicated = ?false;
    });
    if (result.status < 200 or result.status >= 300) {
      let errBody = switch (result.body.decodeUtf8()) { case (?t) t; case null "unknown error" };
      return "Error " # result.status.toText() # ": " # errBody;
    };
    parseOpenAiResponse(result.body);
  };

  // ── Gemini ────────────────────────────────────────────────────────────────

  func callGemini(
    apiKey : Text,
    systemPrompt : Text,
    history : [{ role : Text; content : Text }],
    message : Text,
  ) : async Text {
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" # apiKey;
    var contents = "[";
    var firstMsg = true;
    for (msg in history.values()) {
      let geminiRole = if (msg.role == "assistant") "model" else "user";
      if (not firstMsg) { contents := contents # "," };
      contents := contents # "{\"role\":\"" # geminiRole # "\",\"parts\":[{\"text\":\"" # escapeJson(msg.content) # "\"}]}";
      firstMsg := false;
    };
    if (not firstMsg) { contents := contents # "," };
    contents := contents # "{\"role\":\"user\",\"parts\":[{\"text\":\"" # escapeJson(message) # "\"}]}]";
    let body = "{\"system_instruction\":{\"parts\":[{\"text\":\"" # escapeJson(systemPrompt) # "\"}]},\"contents\":" # contents # "}";
    let result = await ic.http_request({
      url;
      max_response_bytes = ?16384;
      method = #post;
      headers = [{ name = "Content-Type"; value = "application/json" }];
      body = ?(body.encodeUtf8());
      transform = null;
      is_replicated = ?false;
    });
    if (result.status < 200 or result.status >= 300) {
      let errBody = switch (result.body.decodeUtf8()) { case (?t) t; case null "unknown error" };
      return "Error " # result.status.toText() # ": " # errBody;
    };
    parseGeminiResponse(result.body);
  };

  // ── OpenRouter (ultimate fallback — aggregates 40+ models) ───────────────

  func callOpenRouter(
    apiKey : Text,
    systemPrompt : Text,
    history : [{ role : Text; content : Text }],
    message : Text,
    model : Text,
  ) : async Text {
    await callOpenAiCompat(
      "https://openrouter.ai/api/v1/chat/completions",
      model,
      apiKey,
      systemPrompt,
      history,
      message,
      [
        { name = "HTTP-Referer"; value = "https://demonzeno.com" },
        { name = "X-Title"; value = "DemonZeno AI" },
      ],
    );
  };

  // ── Cohere ────────────────────────────────────────────────────────────────

  func callCohere(
    apiKey : Text,
    systemPrompt : Text,
    history : [{ role : Text; content : Text }],
    message : Text,
  ) : async Text {
    var chatHistory = "[";
    var firstMsg = true;
    for (msg in history.values()) {
      if (not firstMsg) { chatHistory := chatHistory # "," };
      let cohereRole = if (msg.role == "assistant") "CHATBOT" else "USER";
      chatHistory := chatHistory # "{\"role\":\"" # cohereRole # "\",\"message\":\"" # escapeJson(msg.content) # "\"}";
      firstMsg := false;
    };
    chatHistory := chatHistory # "]";
    let body = "{\"message\":\"" # escapeJson(message) # "\",\"preamble\":\"" # escapeJson(systemPrompt) # "\",\"chat_history\":" # chatHistory # "}";
    let result = await ic.http_request({
      url = "https://api.cohere.ai/v1/chat";
      max_response_bytes = ?16384;
      method = #post;
      headers = [
        { name = "Content-Type"; value = "application/json" },
        { name = "Authorization"; value = "Bearer " # apiKey },
      ];
      body = ?(body.encodeUtf8());
      transform = null;
      is_replicated = ?false;
    });
    if (result.status < 200 or result.status >= 300) {
      let errBody = switch (result.body.decodeUtf8()) { case (?t) t; case null "unknown error" };
      return "Error " # result.status.toText() # ": " # errBody;
    };
    let bodyText = switch (result.body.decodeUtf8()) { case (?t) t; case null return "No response" };
    switch (extractBetween(bodyText, "\"text\":\"", "\"")) {
      case (?t) if (t == "") bodyText else t;
      case null bodyText;
    };
  };

  // ── HuggingFace ───────────────────────────────────────────────────────────

  func callHuggingFace(
    apiKey : Text,
    systemPrompt : Text,
    message : Text,
  ) : async Text {
    let body = "{\"inputs\":\"" # escapeJson(systemPrompt # "\n\nUser: " # message) # "\"}";
    let result = await ic.http_request({
      url = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large";
      max_response_bytes = ?8192;
      method = #post;
      headers = [
        { name = "Content-Type"; value = "application/json" },
        { name = "Authorization"; value = "Bearer " # apiKey },
      ];
      body = ?(body.encodeUtf8());
      transform = null;
      is_replicated = ?false;
    });
    if (result.status < 200 or result.status >= 300) {
      let errBody = switch (result.body.decodeUtf8()) { case (?t) t; case null "unknown error" };
      return "Error " # result.status.toText() # ": " # errBody;
    };
    let bodyText = switch (result.body.decodeUtf8()) { case (?t) t; case null return "No response" };
    switch (extractBetween(bodyText, "\"generated_text\":\"", "\"")) {
      case (?t) if (t == "") bodyText else t;
      case null bodyText;
    };
  };

  // ── NLP Cloud ─────────────────────────────────────────────────────────────

  func callNlpCloud(
    apiKey : Text,
    systemPrompt : Text,
    history : [{ role : Text; content : Text }],
    message : Text,
  ) : async Text {
    var historyArr = "[";
    var i = 0;
    var firstPair = true;
    while (i + 1 < history.size()) {
      let userMsg = history[i];
      let assistantMsg = history[i + 1];
      if (userMsg.role == "user" and assistantMsg.role == "assistant") {
        if (not firstPair) { historyArr := historyArr # "," };
        historyArr := historyArr # "{\"input\":\"" # escapeJson(userMsg.content) # "\",\"response\":\"" # escapeJson(assistantMsg.content) # "\"}";
        firstPair := false;
      };
      i := i + 2;
    };
    historyArr := historyArr # "]";
    let body = "{\"context\":\"" # escapeJson(systemPrompt) # "\",\"history\":" # historyArr # ",\"input\":\"" # escapeJson(message) # "\"}";
    let result = await ic.http_request({
      url = "https://api.nlpcloud.io/v1/gpu/finetuned-llama-3-70b/chatbot";
      max_response_bytes = ?8192;
      method = #post;
      headers = [
        { name = "Content-Type"; value = "application/json" },
        { name = "Authorization"; value = "Bearer " # apiKey },
      ];
      body = ?(body.encodeUtf8());
      transform = null;
      is_replicated = ?false;
    });
    if (result.status < 200 or result.status >= 300) {
      let errBody = switch (result.body.decodeUtf8()) { case (?t) t; case null "unknown error" };
      return "Error " # result.status.toText() # ": " # errBody;
    };
    let bodyText = switch (result.body.decodeUtf8()) { case (?t) t; case null return "No response" };
    switch (extractBetween(bodyText, "\"response\":\"", "\"")) {
      case (?t) if (t == "") bodyText else t;
      case null bodyText;
    };
  };

  // ── Cloudflare Workers AI ─────────────────────────────────────────────────

  func callCloudflare(
    apiKey : Text,
    systemPrompt : Text,
    history : [{ role : Text; content : Text }],
    message : Text,
  ) : async Text {
    let parts = apiKey.split(#char ':');
    let accountId = switch (parts.next()) { case (?id) id; case null return "Error: Cloudflare key must be 'accountId:token'" };
    let token = switch (parts.next()) { case (?t) t; case null return "Error: Cloudflare key must be 'accountId:token'" };
    let url = "https://api.cloudflare.com/client/v4/accounts/" # accountId # "/ai/run/@cf/meta/llama-2-7b-chat-fp16";
    var messages = "[{\"role\":\"system\",\"content\":\"" # escapeJson(systemPrompt) # "\"}";
    for (msg in history.values()) {
      messages := messages # ",{\"role\":\"" # escapeJson(msg.role) # "\",\"content\":\"" # escapeJson(msg.content) # "\"}";
    };
    messages := messages # ",{\"role\":\"user\",\"content\":\"" # escapeJson(message) # "\"}]";
    let body = "{\"messages\":" # messages # "}";
    let result = await ic.http_request({
      url;
      max_response_bytes = ?8192;
      method = #post;
      headers = [
        { name = "Content-Type"; value = "application/json" },
        { name = "Authorization"; value = "Bearer " # token },
      ];
      body = ?(body.encodeUtf8());
      transform = null;
      is_replicated = ?false;
    });
    if (result.status < 200 or result.status >= 300) {
      let errBody = switch (result.body.decodeUtf8()) { case (?t) t; case null "unknown error" };
      return "Error " # result.status.toText() # ": " # errBody;
    };
    let bodyText = switch (result.body.decodeUtf8()) { case (?t) t; case null return "No response" };
    switch (extractBetween(bodyText, "\"response\":\"", "\"")) {
      case (?t) if (t == "") bodyText else t;
      case null bodyText;
    };
  };

  // ── Helper: is response an error string? ─────────────────────────────────

  func isError(response : Text) : Bool {
    response.startsWith(#text "Error ") or response == "" or response == "No response";
  };

  // ── Smart routing: detect request type from message content ───────────────

  func isSignalRequest(message : Text) : Bool {
    let lower = message.toLower();
    lower.contains(#text "signal") or
    lower.contains(#text "trade") or
    lower.contains(#text "entry") or
    lower.contains(#text "buy") or
    lower.contains(#text "sell") or
    lower.contains(#text "long") or
    lower.contains(#text "short") or
    lower.contains(#text "btc") or
    lower.contains(#text "eth") or
    lower.contains(#text "forex") or
    lower.contains(#text "chart") or
    lower.contains(#text "analysis") or
    lower.contains(#text "price");
  };

  func isCodeRequest(message : Text) : Bool {
    let lower = message.toLower();
    lower.contains(#text "code") or
    lower.contains(#text "function") or
    lower.contains(#text "script") or
    lower.contains(#text "program") or
    lower.contains(#text "debug") or
    lower.contains(#text "error") or
    lower.contains(#text "implement") or
    lower.contains(#text "write a");
  };

  // ── Main smart routing function ───────────────────────────────────────────

  /// Route the message through the best available provider chain.
  /// Provider param is ignored — backend auto-routes.
  /// Tries primary → secondary → OpenRouter fallback.
  public func routeAndSendMessage(
    providerKeys : {
      openrouter : Text;
      gemini : Text;
      groq : Text;
      deepseek : Text;
      grok : Text;
      mistral : Text;
      openai : Text;
      cohere : Text;
      together : Text;
      fireworks : Text;
      perplexity : Text;
      cerebras : Text;
      ai21 : Text;
      huggingface : Text;
      nlpcloud : Text;
      cloudflare : Text;
      novita : Text;
      moonshot : Text;
      zhipu : Text;
      upstage : Text;
      sambanova : Text;
      anyscale : Text;
      replicate : Text;
      ollama : Text;
      claude : Text;
    },
    lang : Text,
    history : [{ role : Text; content : Text }],
    message : Text,
  ) : async Text {
    let systemPrompt = buildSystemPrompt(lang);

    // Build priority chain based on request type
    // For signals: Groq (fast) → DeepSeek → Grok → OpenRouter(GPT-4o)
    // For code: OpenRouter(GPT-4o) → Mistral → OpenRouter(Claude)
    // For general: Gemini → Grok → OpenRouter(GPT-4o)
    // OpenRouter is always the final fallback

    if (isSignalRequest(message)) {
      // Signal route: speed + accuracy priority
      if (providerKeys.groq != "") {
        let r = await callOpenAiCompat(
          "https://api.groq.com/openai/v1/chat/completions",
          "llama-3.3-70b-versatile",
          providerKeys.groq, systemPrompt, history, message, [],
        );
        if (not isError(r)) return r;
      };
      if (providerKeys.deepseek != "") {
        let r = await callOpenAiCompat(
          "https://api.deepseek.com/chat/completions",
          "deepseek-chat",
          providerKeys.deepseek, systemPrompt, history, message, [],
        );
        if (not isError(r)) return r;
      };
      if (providerKeys.grok != "") {
        let r = await callOpenAiCompat(
          "https://api.x.ai/v1/chat/completions",
          "grok-2",
          providerKeys.grok, systemPrompt, history, message, [],
        );
        if (not isError(r)) return r;
      };
    } else if (isCodeRequest(message)) {
      // Code route: GPT-4o → Mistral → Claude via OpenRouter
      if (providerKeys.openrouter != "") {
        let r = await callOpenRouter(
          providerKeys.openrouter, systemPrompt, history, message, "openai/gpt-4o",
        );
        if (not isError(r)) return r;
      };
      if (providerKeys.mistral != "") {
        let r = await callOpenAiCompat(
          "https://api.mistral.ai/v1/chat/completions",
          "mistral-large-latest",
          providerKeys.mistral, systemPrompt, history, message, [],
        );
        if (not isError(r)) return r;
      };
      if (providerKeys.openrouter != "") {
        let r = await callOpenRouter(
          providerKeys.openrouter, systemPrompt, history, message, "anthropic/claude-3.5-sonnet",
        );
        if (not isError(r)) return r;
      };
    } else {
      // General Q&A route: Gemini → Grok → OpenRouter
      if (providerKeys.gemini != "") {
        let r = await callGemini(providerKeys.gemini, systemPrompt, history, message);
        if (not isError(r)) return r;
      };
      if (providerKeys.grok != "") {
        let r = await callOpenAiCompat(
          "https://api.x.ai/v1/chat/completions",
          "grok-2",
          providerKeys.grok, systemPrompt, history, message, [],
        );
        if (not isError(r)) return r;
      };
    };

    // Universal fallback: OpenRouter (aggregates 40+ models)
    if (providerKeys.openrouter != "") {
      let r = await callOpenRouter(
        providerKeys.openrouter, systemPrompt, history, message, "openai/gpt-4o",
      );
      if (not isError(r)) return r;
    };

    // Secondary fallbacks if OpenRouter also unavailable
    if (providerKeys.gemini != "") {
      let r = await callGemini(providerKeys.gemini, systemPrompt, history, message);
      if (not isError(r)) return r;
    };
    if (providerKeys.groq != "") {
      let r = await callOpenAiCompat(
        "https://api.groq.com/openai/v1/chat/completions",
        "llama-3.3-70b-versatile",
        providerKeys.groq, systemPrompt, history, message, [],
      );
      if (not isError(r)) return r;
    };
    if (providerKeys.mistral != "") {
      let r = await callOpenAiCompat(
        "https://api.mistral.ai/v1/chat/completions",
        "mistral-large-latest",
        providerKeys.mistral, systemPrompt, history, message, [],
      );
      if (not isError(r)) return r;
    };
    if (providerKeys.deepseek != "") {
      let r = await callOpenAiCompat(
        "https://api.deepseek.com/chat/completions",
        "deepseek-chat",
        providerKeys.deepseek, systemPrompt, history, message, [],
      );
      if (not isError(r)) return r;
    };
    if (providerKeys.together != "") {
      let r = await callOpenAiCompat(
        "https://api.together.xyz/v1/chat/completions",
        "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
        providerKeys.together, systemPrompt, history, message, [],
      );
      if (not isError(r)) return r;
    };
    if (providerKeys.fireworks != "") {
      let r = await callOpenAiCompat(
        "https://api.fireworks.ai/inference/v1/chat/completions",
        "accounts/fireworks/models/llama-v3p1-70b-instruct",
        providerKeys.fireworks, systemPrompt, history, message, [],
      );
      if (not isError(r)) return r;
    };
    if (providerKeys.perplexity != "") {
      let r = await callOpenAiCompat(
        "https://api.perplexity.ai/chat/completions",
        "llama-3.1-sonar-small-128k-online",
        providerKeys.perplexity, systemPrompt, history, message, [],
      );
      if (not isError(r)) return r;
    };
    if (providerKeys.cohere != "") {
      let r = await callCohere(providerKeys.cohere, systemPrompt, history, message);
      if (not isError(r)) return r;
    };
    if (providerKeys.cerebras != "") {
      let r = await callOpenAiCompat(
        "https://api.cerebras.ai/v1/chat/completions",
        "llama3.1-8b",
        providerKeys.cerebras, systemPrompt, history, message, [],
      );
      if (not isError(r)) return r;
    };
    if (providerKeys.ai21 != "") {
      let r = await callOpenAiCompat(
        "https://api.ai21.com/studio/v1/chat/completions",
        "jamba-1.5-mini",
        providerKeys.ai21, systemPrompt, history, message, [],
      );
      if (not isError(r)) return r;
    };
    if (providerKeys.novita != "") {
      let r = await callOpenAiCompat(
        "https://api.novita.ai/v3/openai/chat/completions",
        "meta-llama/llama-3.1-8b-instruct",
        providerKeys.novita, systemPrompt, history, message, [],
      );
      if (not isError(r)) return r;
    };
    if (providerKeys.sambanova != "") {
      let r = await callOpenAiCompat(
        "https://api.sambanova.ai/v1/chat/completions",
        "Meta-Llama-3.1-8B-Instruct",
        providerKeys.sambanova, systemPrompt, history, message, [],
      );
      if (not isError(r)) return r;
    };
    if (providerKeys.moonshot != "") {
      let r = await callOpenAiCompat(
        "https://api.moonshot.cn/v1/chat/completions",
        "moonshot-v1-8k",
        providerKeys.moonshot, systemPrompt, history, message, [],
      );
      if (not isError(r)) return r;
    };
    if (providerKeys.zhipu != "") {
      let r = await callOpenAiCompat(
        "https://open.bigmodel.cn/api/paas/v4/chat/completions",
        "glm-4-flash",
        providerKeys.zhipu, systemPrompt, history, message, [],
      );
      if (not isError(r)) return r;
    };
    if (providerKeys.upstage != "") {
      let r = await callOpenAiCompat(
        "https://api.upstage.ai/v1/solar/chat/completions",
        "solar-pro",
        providerKeys.upstage, systemPrompt, history, message, [],
      );
      if (not isError(r)) return r;
    };
    if (providerKeys.nlpcloud != "") {
      let r = await callNlpCloud(providerKeys.nlpcloud, systemPrompt, history, message);
      if (not isError(r)) return r;
    };
    if (providerKeys.cloudflare != "") {
      let r = await callCloudflare(providerKeys.cloudflare, systemPrompt, history, message);
      if (not isError(r)) return r;
    };
    if (providerKeys.huggingface != "") {
      let r = await callHuggingFace(providerKeys.huggingface, systemPrompt, message);
      if (not isError(r)) return r;
    };

    // No provider configured
    "DemonZeno AI is not yet configured. Please ask the admin to set up at least one API key (OpenRouter recommended for access to 40+ models).";
  };

  // ── Legacy single-provider dispatch (kept for FAQ / backtesting helpers) ──

  public func callProvider(
    provider : Text,
    apiKey : Text,
    lang : Text,
    history : [{ role : Text; content : Text }],
    message : Text,
  ) : async Text {
    let systemPrompt = buildSystemPrompt(lang);
    switch (provider) {
      case "gemini" {
        await callGemini(apiKey, systemPrompt, history, message);
      };
      case "openai" {
        await callOpenAiCompat(
          "https://api.openai.com/v1/chat/completions",
          "gpt-4o-mini", apiKey, systemPrompt, history, message, [],
        );
      };
      case "grok" {
        await callOpenAiCompat(
          "https://api.x.ai/v1/chat/completions",
          "grok-2", apiKey, systemPrompt, history, message, [],
        );
      };
      case "perplexity" {
        await callOpenAiCompat(
          "https://api.perplexity.ai/chat/completions",
          "llama-3.1-sonar-small-128k-online", apiKey, systemPrompt, history, message, [],
        );
      };
      case "mistral" {
        await callOpenAiCompat(
          "https://api.mistral.ai/v1/chat/completions",
          "mistral-large-latest", apiKey, systemPrompt, history, message, [],
        );
      };
      case "cohere" {
        await callCohere(apiKey, systemPrompt, history, message);
      };
      case "deepseek" {
        await callOpenAiCompat(
          "https://api.deepseek.com/chat/completions",
          "deepseek-chat", apiKey, systemPrompt, history, message, [],
        );
      };
      case "groq" {
        await callOpenAiCompat(
          "https://api.groq.com/openai/v1/chat/completions",
          "llama-3.3-70b-versatile", apiKey, systemPrompt, history, message, [],
        );
      };
      case "together" {
        await callOpenAiCompat(
          "https://api.together.xyz/v1/chat/completions",
          "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", apiKey, systemPrompt, history, message, [],
        );
      };
      case "fireworks" {
        await callOpenAiCompat(
          "https://api.fireworks.ai/inference/v1/chat/completions",
          "accounts/fireworks/models/llama-v3p1-70b-instruct", apiKey, systemPrompt, history, message, [],
        );
      };
      case "openrouter" {
        await callOpenRouter(apiKey, systemPrompt, history, message, "openai/gpt-4o");
      };
      case "huggingface" {
        await callHuggingFace(apiKey, systemPrompt, message);
      };
      case "ai21" {
        await callOpenAiCompat(
          "https://api.ai21.com/studio/v1/chat/completions",
          "jamba-1.5-mini", apiKey, systemPrompt, history, message, [],
        );
      };
      case "nlpcloud" {
        await callNlpCloud(apiKey, systemPrompt, history, message);
      };
      case "cerebras" {
        await callOpenAiCompat(
          "https://api.cerebras.ai/v1/chat/completions",
          "llama3.1-8b", apiKey, systemPrompt, history, message, [],
        );
      };
      case "sambanova" {
        await callOpenAiCompat(
          "https://api.sambanova.ai/v1/chat/completions",
          "Meta-Llama-3.1-8B-Instruct", apiKey, systemPrompt, history, message, [],
        );
      };
      case "cloudflare" {
        await callCloudflare(apiKey, systemPrompt, history, message);
      };
      case "novita" {
        await callOpenAiCompat(
          "https://api.novita.ai/v3/openai/chat/completions",
          "meta-llama/llama-3.1-8b-instruct", apiKey, systemPrompt, history, message, [],
        );
      };
      case "moonshot" {
        await callOpenAiCompat(
          "https://api.moonshot.cn/v1/chat/completions",
          "moonshot-v1-8k", apiKey, systemPrompt, history, message, [],
        );
      };
      case "zhipu" {
        await callOpenAiCompat(
          "https://open.bigmodel.cn/api/paas/v4/chat/completions",
          "glm-4-flash", apiKey, systemPrompt, history, message, [],
        );
      };
      case "upstage" {
        await callOpenAiCompat(
          "https://api.upstage.ai/v1/solar/chat/completions",
          "solar-pro", apiKey, systemPrompt, history, message, [],
        );
      };
      case _ {
        "Unsupported provider: " # provider;
      };
    };
  };
};
