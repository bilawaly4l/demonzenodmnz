import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Char "mo:core/Char";

module {
  // ── IC Management Canister types for HTTP outcalls ───────────────────────
  type HttpHeader = { name : Text; value : Text };
  type HttpRequestResult = {
    status  : Nat;
    headers : [HttpHeader];
    body    : Blob;
  };
  type HttpRequestArgs = {
    url               : Text;
    max_response_bytes : ?Nat64;
    method            : { #get; #head; #post };
    headers           : [HttpHeader];
    body              : ?Blob;
    transform         : ?{
      function : shared ({ response : HttpRequestResult; context : Blob }) -> async HttpRequestResult;
      context  : Blob;
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
      "📍 Entry: $[exact price] | SL: $[exact price] | TP1: $[exact price] | TP2: $[exact price] | TP3: $[exact price]\n" #
      "⏱ Timeframe: [timeframe]\n" #
      "📊 Confidence: [High/Medium/Low]\n" #
      "⚠️ Risk Warning: [brief note]\n\n" #
      "Always provide signals for ANY asset type: crypto (BTC, ETH, any altcoin), " #
      "forex (EUR/USD, GBP/USD, USD/JPY, etc.), stocks (AAPL, TSLA, NVDA, etc.). " #
      "Use the most recent known price levels. Provide approximate prices based on recent market data if exact real-time data is unavailable. " #
      "NEVER omit Entry, Stop Loss, TP1, TP2, or TP3 from a signal response. " #
      "Label them clearly: Entry: $X.XX | SL: $X.XX | TP1: $X.XX | TP2: $X.XX | TP3: $X.XX\n\n";

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
      if (code == 92)      { out := out # "\\\\" }
      else if (code == 34) { out := out # "\\\"" }
      else if (code == 10) { out := out # "\\n"  }
      else if (code == 13) { out := out # "\\r"  }
      else if (code == 9)  { out := out # "\\t"  }
      else { out := out # Text.fromChar(c) };
    };
    out;
  };

  // ── Robust JSON string extractor ─────────────────────────────────────────
  // Extracts a JSON string value after a given key, handling escaped quotes.

  func extractJsonStringValue(haystack : Text, key : Text) : ?Text {
    // Find "key":"  or  "key": "
    let searchPattern = "\"" # key # "\":\"";
    let searchPatternSpaced = "\"" # key # "\": \"";

    func extractAfterPrefix(prefix : Text) : ?Text {
      let parts = haystack.split(#text prefix);
      ignore parts.next();
      switch (parts.next()) {
        case null null;
        case (?afterPrefix) {
          // Now scan char-by-char, respecting backslash escapes
          let dq : Char = Char.fromNat32(34); // double-quote character
          var result = "";
          var escaped = false;
          var done = false;
          for (c in afterPrefix.toIter()) {
            if (done) {
              // skip
            } else if (escaped) {
              // Previous char was backslash; emit escaped form and continue
              if (c == 'n') { result := result # "\n" }
              else if (c == 'r') { result := result # "\r" }
              else if (c == 't') { result := result # "\t" }
              else if (c == dq) { result := result # Text.fromChar(dq) }
              else if (c == '\\') { result := result # "\\" }
              else { result := result # Text.fromChar(c) };
              escaped := false;
            } else if (c == '\\') {
              escaped := true;
            } else if (c == dq) {
              done := true;
            } else {
              result := result # Text.fromChar(c);
            };
          };
          if (result == "") null else ?result;
        };
      };
    };

    switch (extractAfterPrefix(searchPattern)) {
      case (?t) ?t;
      case null { extractAfterPrefix(searchPatternSpaced) };
    };
  };

  // ── Simple fallback: extract content between two literal markers ─────────

  func extractBetween(haystack : Text, start : Text, end_ : Text) : ?Text {
    let startParts = haystack.split(#text start);
    ignore startParts.next();
    switch (startParts.next()) {
      case null null;
      case (?afterStart) {
        let endParts = afterStart.split(#text end_);
        switch (endParts.next()) {
          case (?content) if (content == "") null else ?content;
          case null null;
        };
      };
    };
  };

  // ── OpenAI-compatible response parser ────────────────────────────────────

  func parseOpenAiResponse(body : Blob) : Text {
    let bodyText = switch (body.decodeUtf8()) {
      case (?t) t;
      case null return "No response received from AI provider";
    };
    // Try extracting the content field robustly
    switch (extractJsonStringValue(bodyText, "content")) {
      case (?t) if (t.size() > 0) t else bodyText;
      case null {
        // Fallback: look for plain "content":"..."
        switch (extractBetween(bodyText, "\"content\":\"", "\"")) {
          case (?t) if (t.size() > 0) t else bodyText;
          case null bodyText;
        };
      };
    };
  };

  // ── Gemini response parser ────────────────────────────────────────────────

  func parseGeminiResponse(body : Blob) : Text {
    let bodyText = switch (body.decodeUtf8()) {
      case (?t) t;
      case null return "No response received from AI provider";
    };
    // Gemini: .candidates[0].content.parts[0].text
    switch (extractJsonStringValue(bodyText, "text")) {
      case (?t) if (t.size() > 0) t else bodyText;
      case null {
        switch (extractBetween(bodyText, "\"text\": \"", "\"")) {
          case (?t) if (t.size() > 0) t else bodyText;
          case null bodyText;
        };
      };
    };
  };

  // ── OpenAI-compatible body builder ────────────────────────────────────────

  func buildOpenAiBody(
    model      : Text,
    systemPrompt : Text,
    history    : [{ role : Text; content : Text }],
    message    : Text,
    maxTokens  : Nat,
  ) : Text {
    var messages = "[{\"role\":\"system\",\"content\":\"" # escapeJson(systemPrompt) # "\"}";
    for (msg in history.values()) {
      messages := messages # ",{\"role\":\"" # escapeJson(msg.role) # "\",\"content\":\"" # escapeJson(msg.content) # "\"}";
    };
    messages := messages # ",{\"role\":\"user\",\"content\":\"" # escapeJson(message) # "\"}]";
    "{\"model\":\"" # model # "\",\"messages\":" # messages # ",\"max_tokens\":" # maxTokens.toText() # ",\"temperature\":0.7}";
  };

  // ── Generic OpenAI-compatible call ────────────────────────────────────────

  func callOpenAiCompat(
    url          : Text,
    model        : Text,
    apiKey       : Text,
    systemPrompt : Text,
    history      : [{ role : Text; content : Text }],
    message      : Text,
    extraHeaders : [HttpHeader],
  ) : async Text {
    let body = buildOpenAiBody(model, systemPrompt, history, message, 2048);
    let baseHeaders : [HttpHeader] = [
      { name = "Content-Type";  value = "application/json" },
      { name = "Authorization"; value = "Bearer " # apiKey  },
    ];
    let allHeaders = baseHeaders.concat(extraHeaders);
    let result = await ic.http_request({
      url;
      max_response_bytes = ?32768;
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
    apiKey       : Text,
    systemPrompt : Text,
    history      : [{ role : Text; content : Text }],
    message      : Text,
  ) : async Text {
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" # apiKey;
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
      max_response_bytes = ?32768;
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

  // ── OpenRouter (aggregates 40+ models, including free tier) ──────────────

  func callOpenRouter(
    apiKey       : Text,
    systemPrompt : Text,
    history      : [{ role : Text; content : Text }],
    message      : Text,
    model        : Text,
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
        { name = "X-Title";     value = "DemonZeno AI"           },
      ],
    );
  };

  // ── Groq (free tier — llama-3.1-8b-instant) ──────────────────────────────

  func callGroq(
    apiKey       : Text,
    systemPrompt : Text,
    history      : [{ role : Text; content : Text }],
    message      : Text,
  ) : async Text {
    await callOpenAiCompat(
      "https://api.groq.com/openai/v1/chat/completions",
      "llama-3.1-8b-instant",
      apiKey,
      systemPrompt,
      history,
      message,
      [],
    );
  };

  // ── Together AI ───────────────────────────────────────────────────────────

  func callTogether(
    apiKey       : Text,
    systemPrompt : Text,
    history      : [{ role : Text; content : Text }],
    message      : Text,
  ) : async Text {
    await callOpenAiCompat(
      "https://api.together.xyz/v1/chat/completions",
      "meta-llama/Llama-3-8b-chat-hf",
      apiKey,
      systemPrompt,
      history,
      message,
      [],
    );
  };

  // ── HuggingFace keyed inference ───────────────────────────────────────────

  func callHuggingFaceKeyed(
    apiKey       : Text,
    systemPrompt : Text,
    message      : Text,
  ) : async Text {
    let prompt = "<s>[INST] " # escapeJson(systemPrompt) # " [/INST] [INST] " # escapeJson(message) # " [/INST]";
    let body = "{\"inputs\":\"" # prompt # "\",\"parameters\":{\"max_new_tokens\":1024,\"return_full_text\":false}}";
    let result = await ic.http_request({
      url = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
      max_response_bytes = ?16384;
      method = #post;
      headers = [
        { name = "Content-Type";  value = "application/json" },
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
      case (?t) if (t.size() > 0) t else bodyText;
      case null bodyText;
    };
  };

  // ── Cohere ────────────────────────────────────────────────────────────────

  func callCohere(
    apiKey       : Text,
    systemPrompt : Text,
    history      : [{ role : Text; content : Text }],
    message      : Text,
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
        { name = "Content-Type";  value = "application/json" },
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
    switch (extractJsonStringValue(bodyText, "text")) {
      case (?t) if (t.size() > 0) t else bodyText;
      case null bodyText;
    };
  };

  // ── NLP Cloud ─────────────────────────────────────────────────────────────

  func callNlpCloud(
    apiKey       : Text,
    systemPrompt : Text,
    history      : [{ role : Text; content : Text }],
    message      : Text,
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
        { name = "Content-Type";  value = "application/json" },
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
    switch (extractJsonStringValue(bodyText, "response")) {
      case (?t) if (t.size() > 0) t else bodyText;
      case null bodyText;
    };
  };

  // ── Cloudflare Workers AI ─────────────────────────────────────────────────

  func callCloudflare(
    apiKey       : Text,
    systemPrompt : Text,
    history      : [{ role : Text; content : Text }],
    message      : Text,
  ) : async Text {
    let parts = apiKey.split(#char ':');
    let accountId = switch (parts.next()) {
      case (?id) id;
      case null return "Error: Cloudflare key must be 'accountId:token'";
    };
    let token = switch (parts.next()) {
      case (?t) t;
      case null return "Error: Cloudflare key must be 'accountId:token'";
    };
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
        { name = "Content-Type";  value = "application/json" },
        { name = "Authorization"; value = "Bearer " # token   },
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
    switch (extractJsonStringValue(bodyText, "response")) {
      case (?t) if (t.size() > 0) t else bodyText;
      case null bodyText;
    };
  };

  // ── Helper: is response an error? ────────────────────────────────────────

  func isError(response : Text) : Bool {
    response.startsWith(#text "Error ") or
    response == "" or
    response == "No response" or
    response == "No response received from AI provider" or
    response.startsWith(#text "Error: Cloudflare");
  };

  // ── Smart routing: detect request type ───────────────────────────────────

  func isSignalRequest(message : Text) : Bool {
    let lower = message.toLower();
    lower.contains(#text "signal")   or
    lower.contains(#text "trade")    or
    lower.contains(#text "entry")    or
    lower.contains(#text "buy")      or
    lower.contains(#text "sell")     or
    lower.contains(#text "long")     or
    lower.contains(#text "short")    or
    lower.contains(#text "btc")      or
    lower.contains(#text "eth")      or
    lower.contains(#text "forex")    or
    lower.contains(#text "chart")    or
    lower.contains(#text "analysis") or
    lower.contains(#text "price");
  };

  func isCodeRequest(message : Text) : Bool {
    let lower = message.toLower();
    lower.contains(#text "code")     or
    lower.contains(#text "function") or
    lower.contains(#text "script")   or
    lower.contains(#text "program")  or
    lower.contains(#text "debug")    or
    lower.contains(#text "implement") or
    lower.contains(#text "write a");
  };

  // ── Service unavailable fallback ─────────────────────────────────────────

  func unavailableMessage() : Text {
    "⚡ DemonZeno AI — Service Temporarily Unavailable\n\n" #
    "All AI providers are currently unreachable or unconfigured. This can happen when:\n" #
    "• No API keys have been configured by the admin\n" #
    "• All providers are experiencing high load\n" #
    "• Network connectivity issues on the IC\n\n" #
    "**What to do:**\n" #
    "• Ask the admin to configure at least one API key (OpenRouter recommended — gives access to 40+ models)\n" #
    "• Groq free tier is available at api.groq.com with a free account\n" #
    "• Try again in a few moments\n\n" #
    "DemonZeno: Master the Chaos, Slay the Market, and Trade Like a God. 🔥";
  };

  // ── Main smart routing function ───────────────────────────────────────────

  /// Route the message through the best available provider chain.
  /// Fallback order: Groq → Together AI → OpenRouter free → HuggingFace → Gemini → extended providers
  public func routeAndSendMessage(
    providerKeys : {
      openrouter  : Text; gemini    : Text; groq      : Text; deepseek  : Text;
      grok        : Text; mistral   : Text; openai    : Text; cohere    : Text;
      together    : Text; fireworks : Text; perplexity: Text; cerebras  : Text;
      ai21        : Text; huggingface: Text; nlpcloud : Text; cloudflare: Text;
      novita      : Text; moonshot  : Text; zhipu     : Text; upstage   : Text;
      sambanova   : Text; anyscale  : Text; replicate : Text; ollama    : Text;
      claude      : Text;
    },
    lang    : Text,
    history : [{ role : Text; content : Text }],
    message : Text,
  ) : async Text {
    let systemPrompt = buildSystemPrompt(lang);

    // ── PRIORITY 1: Groq (fastest free tier) ─────────────────────────────
    if (providerKeys.groq != "") {
      let r = await callGroq(providerKeys.groq, systemPrompt, history, message);
      if (not isError(r)) return r;
    };

    // ── PRIORITY 2: Together AI ───────────────────────────────────────────
    if (providerKeys.together != "") {
      let r = await callTogether(providerKeys.together, systemPrompt, history, message);
      if (not isError(r)) return r;
    };

    // ── PRIORITY 3: OpenRouter free models ───────────────────────────────
    if (providerKeys.openrouter != "") {
      let r = await callOpenRouter(
        providerKeys.openrouter, systemPrompt, history, message,
        "mistralai/mistral-7b-instruct:free",
      );
      if (not isError(r)) return r;
    };

    // ── PRIORITY 4: HuggingFace keyed ────────────────────────────────────
    if (providerKeys.huggingface != "") {
      let r = await callHuggingFaceKeyed(providerKeys.huggingface, systemPrompt, message);
      if (not isError(r)) return r;
    };

    // ── PRIORITY 5: Gemini free tier ──────────────────────────────────────
    if (providerKeys.gemini != "") {
      let r = await callGemini(providerKeys.gemini, systemPrompt, history, message);
      if (not isError(r)) return r;
    };

    // ── EXTENDED FALLBACKS by request type ───────────────────────────────

    if (isSignalRequest(message)) {
      // Signal-optimised: DeepSeek → Grok → OpenRouter GPT-4o
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
      if (providerKeys.openrouter != "") {
        let r = await callOpenRouter(
          providerKeys.openrouter, systemPrompt, history, message, "openai/gpt-4o",
        );
        if (not isError(r)) return r;
      };
    } else if (isCodeRequest(message)) {
      // Code: GPT-4o via OpenRouter → Mistral → Claude via OpenRouter
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
      // General Q&A: Grok → GPT-4o via OpenRouter
      if (providerKeys.grok != "") {
        let r = await callOpenAiCompat(
          "https://api.x.ai/v1/chat/completions",
          "grok-2",
          providerKeys.grok, systemPrompt, history, message, [],
        );
        if (not isError(r)) return r;
      };
      if (providerKeys.openrouter != "") {
        let r = await callOpenRouter(
          providerKeys.openrouter, systemPrompt, history, message, "openai/gpt-4o",
        );
        if (not isError(r)) return r;
      };
    };

    // ── FINAL SWEEP: all remaining providers ─────────────────────────────
    if (providerKeys.mistral != "") {
      let r = await callOpenAiCompat(
        "https://api.mistral.ai/v1/chat/completions",
        "mistral-large-latest",
        providerKeys.mistral, systemPrompt, history, message, [],
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
    if (providerKeys.openai != "") {
      let r = await callOpenAiCompat(
        "https://api.openai.com/v1/chat/completions",
        "gpt-4o-mini",
        providerKeys.openai, systemPrompt, history, message, [],
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

    // ── ALL PROVIDERS FAILED ─────────────────────────────────────────────
    unavailableMessage();
  };

  // ── Legacy single-provider dispatch (kept for FAQ / backtesting helpers) ──

  public func callProvider(
    provider     : Text,
    apiKey       : Text,
    lang         : Text,
    history      : [{ role : Text; content : Text }],
    message      : Text,
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
        await callGroq(apiKey, systemPrompt, history, message);
      };
      case "together" {
        await callTogether(apiKey, systemPrompt, history, message);
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
        await callHuggingFaceKeyed(apiKey, systemPrompt, message);
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
