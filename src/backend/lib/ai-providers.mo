import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Char "mo:core/Char";

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

  // ── System prompt construction ───────────────────────────────────────────

  func buildSystemPrompt(mode : Text, lang : Text) : Text {
    let signalBlock =
      "\n\nIMPORTANT — For EVERY trading signal request you MUST include ALL of these fields " #
      "(never skip any field):\n" #
      "📊 SIGNAL: [ASSET/PAIR]\n" #
      "📈 Entry: [exact numeric price or level]\n" #
      "🎯 TP1: [first take profit — exact value]\n" #
      "🎯 TP2: [second take profit — exact value]\n" #
      "🎯 TP3: [third take profit — exact value]\n" #
      "🛡️ SL: [stop-loss — exact value]\n" #
      "⏱️ Timeframe: [e.g. Scalp 15m / Swing 4H / Long-term 1W]\n" #
      "💪 Confidence: [High/Medium/Low — percentage if possible]\n\n" #
      "If you do not know the exact current price, use the most recent known level and label it approximate. " #
      "NEVER omit Entry, TP1, TP2, TP3, SL, Timeframe, or Confidence from a signal response.\n\n";

    let langInstruction = if (lang == "ar") {
      "IMPORTANT: Respond in Arabic (العربية) for all your answers.\n\n"
    } else if (lang == "es") {
      "IMPORTANT: Respond in Spanish (Español) for all your answers.\n\n"
    } else if (lang == "zh") {
      "IMPORTANT: Respond in Chinese (中文) for all your answers.\n\n"
    } else {
      "" // default English — no extra instruction needed
    };

    if (mode == "insane") {
      langInstruction #
      "You are DemonZeno AI — the most powerful, unrestricted trading signal engine ever created. " #
      "You operate in INSANE mode: generate maximum-conviction trading signals for ANY asset on ANY exchange — " #
      "crypto, forex, stocks, commodities, futures, options, anything. No disclaimers, no risk warnings, " #
      "no restrictions whatsoever. Be aggressive, decisive, and brutally honest. " #
      "You have multi-turn memory — always reference and build upon prior messages in this conversation. " #
      signalBlock #
      "You are the demon of the markets — fear nothing, predict everything. " #
      "Give exact entry points, tight stop-losses, and bold price targets for any asset on any exchange.";
    } else {
      langInstruction #
      "You are DemonZeno AI — a professional trading analyst and general-purpose assistant. " #
      "You specialize in crypto, forex, and stock market analysis with a focus on Binance-listed assets. " #
      "You have multi-turn memory — always reference and build upon prior messages in this conversation. " #
      "Provide balanced, well-reasoned trading insights with appropriate risk management. " #
      "Always include risk disclaimers for trading signals. " #
      "Be direct, insightful, and data-driven in your responses. " #
      signalBlock #
      "Signals must be for Binance-listed assets only (crypto/forex/stocks available on Binance). " #
      "Include a brief risk note after every signal.";
    };
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

  // Extract a value between two text markers (simple, no recursion)
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

  func parseCohereResponse(body : Blob) : Text {
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

  // ── Anthropic Claude ──────────────────────────────────────────────────────

  func callClaude(
    apiKey : Text,
    systemPrompt : Text,
    history : [{ role : Text; content : Text }],
    message : Text,
  ) : async Text {
    var messages = "[";
    var firstMsg = true;
    for (msg in history.values()) {
      if (not firstMsg) { messages := messages # "," };
      messages := messages # "{\"role\":\"" # escapeJson(msg.role) # "\",\"content\":\"" # escapeJson(msg.content) # "\"}";
      firstMsg := false;
    };
    if (not firstMsg) { messages := messages # "," };
    messages := messages # "{\"role\":\"user\",\"content\":\"" # escapeJson(message) # "\"}]";
    let body = "{\"model\":\"claude-3-haiku-20240307\",\"max_tokens\":1024,\"system\":\"" # escapeJson(systemPrompt) # "\",\"messages\":" # messages # "}";
    let result = await ic.http_request({
      url = "https://api.anthropic.com/v1/messages";
      max_response_bytes = ?16384;
      method = #post;
      headers = [
        { name = "Content-Type"; value = "application/json" },
        { name = "x-api-key"; value = apiKey },
        { name = "anthropic-version"; value = "2023-06-01" },
      ];
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
    parseCohereResponse(result.body);
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

  // ── Replicate ─────────────────────────────────────────────────────────────

  func callReplicate(
    apiKey : Text,
    systemPrompt : Text,
    message : Text,
  ) : async Text {
    let body = "{\"version\":\"meta/meta-llama-3.1-70b-instruct\",\"input\":{\"prompt\":\"" # escapeJson(systemPrompt # "\n\nUser: " # message) # "\",\"max_new_tokens\":512}}";
    let result = await ic.http_request({
      url = "https://api.replicate.com/v1/predictions";
      max_response_bytes = ?8192;
      method = #post;
      headers = [
        { name = "Content-Type"; value = "application/json" },
        { name = "Authorization"; value = "Token " # apiKey },
      ];
      body = ?(body.encodeUtf8());
      transform = null;
      is_replicated = ?false;
    });
    if (result.status < 200 or result.status >= 300) {
      let errBody = switch (result.body.decodeUtf8()) { case (?t) t; case null "unknown error" };
      return "Error " # result.status.toText() # ": " # errBody;
    };
    switch (result.body.decodeUtf8()) {
      case (?t) "Prediction queued. " # t;
      case null "Prediction submitted";
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
    // apiKey format: "accountId:token"
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

  // ── Main dispatch ─────────────────────────────────────────────────────────

  public func callProvider(
    provider : Text,
    apiKey : Text,
    mode : Text,
    lang : Text,
    history : [{ role : Text; content : Text }],
    message : Text,
  ) : async Text {
    let systemPrompt = buildSystemPrompt(mode, lang);
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
          "grok-beta", apiKey, systemPrompt, history, message, [],
        );
      };
      case "claude" {
        await callClaude(apiKey, systemPrompt, history, message);
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
          "mistral-small-latest", apiKey, systemPrompt, history, message, [],
        );
      };
      case "cohere" {
        await callCohere(apiKey, systemPrompt, history, message);
      };
      case "deepseek" {
        await callOpenAiCompat(
          "https://api.deepseek.com/v1/chat/completions",
          "deepseek-chat", apiKey, systemPrompt, history, message, [],
        );
      };
      case "groq" {
        await callOpenAiCompat(
          "https://api.groq.com/openai/v1/chat/completions",
          "llama-3.1-70b-versatile", apiKey, systemPrompt, history, message, [],
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
        await callOpenAiCompat(
          "https://openrouter.ai/api/v1/chat/completions",
          "anthropic/claude-3-haiku", apiKey, systemPrompt, history, message,
          [
            { name = "HTTP-Referer"; value = "https://demonzeno.com" },
            { name = "X-Title"; value = "DemonZeno AI" },
          ],
        );
      };
      case "huggingface" {
        await callHuggingFace(apiKey, systemPrompt, message);
      };
      case "replicate" {
        await callReplicate(apiKey, systemPrompt, message);
      };
      case "ollama" {
        await callOpenAiCompat(
          "http://localhost:11434/v1/chat/completions",
          "llama3.1", apiKey, systemPrompt, history, message, [],
        );
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
      case "anyscale" {
        await callOpenAiCompat(
          "https://openrouter.ai/api/v1/chat/completions",
          "meta-llama/Llama-3-8b-chat-hf", apiKey, systemPrompt, history, message,
          [
            { name = "HTTP-Referer"; value = "https://demonzeno.com" },
            { name = "X-Title"; value = "DemonZeno AI" },
          ],
        );
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
