import Text "mo:core/Text";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import Types "../types/zeno-ai";

module {

  let GEMINI_API_KEY = "AIzaSyCYX3MmN6tK_4QsETugnyacc2WegHjUybY";

  func geminiUrl() : Text {
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" # GEMINI_API_KEY;
  };

  let SYSTEM_PROMPT = "You are Zeno AI, a trading education assistant for DemonZeno Academy. Answer ONLY trading and finance education questions. Be clear, educational, concise, and reference DemonZeno teaching philosophy: discipline, risk management, and continuous learning. If a question is not related to trading, finance, or investment education, politely decline and redirect the user to ask a trading-related question. Never provide financial advice — only education.";

  /// Strip headers from an HTTP response — use this in query transform functions.
  public func transformResponse(input : Outcall.TransformationInput) : Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  /// Ask Zeno AI a trading education question using the Gemini API.
  public func ask(question : Text, transformFn : Outcall.Transform) : async Types.ZenoAiResponse {
    if (question.size() == 0) {
      return { answer = "Please ask a trading question and I will be happy to help!"; success = false };
    };

    let fullPrompt = "[SYSTEM: " # SYSTEM_PROMPT # "]\n\nUser question: " # question;
    let requestBody = buildGeminiRequest(fullPrompt);

    let headers : [Outcall.Header] = [
      { name = "Content-Type"; value = "application/json" },
    ];

    try {
      let responseText = await Outcall.httpPostRequest(geminiUrl(), headers, requestBody, transformFn);
      let answer = extractGeminiText(responseText);
      { answer; success = true };
    } catch (_e) {
      {
        answer = "Zeno AI is temporarily unavailable. Please try again in a moment. Remember: The market rewards those who are patient. — DemonZeno";
        success = false;
      };
    };
  };

  /// Build the Gemini API JSON request body.
  func buildGeminiRequest(prompt : Text) : Text {
    let escaped = escapeJson(prompt);
    let part1 = "{\"contents\":[{\"parts\":[{\"text\":\"";
    let part2 = "\"}]}],\"generationConfig\":{\"temperature\":0.7,\"maxOutputTokens\":1024}}";
    part1 # escaped # part2;
  };

  /// Escape a text string for embedding in a JSON string value.
  func escapeJson(s : Text) : Text {
    let bs = "\\";
    s
      .replace(#text bs, bs # bs)
      .replace(#text "\n", bs # "n")
      .replace(#text "\r", bs # "r")
      .replace(#text "\t", bs # "t");
  };

  /// Extract the text value from a Gemini API JSON response.
  /// Finds the first occurrence of "text":" and extracts until the closing quote.
  func extractGeminiText(response : Text) : Text {
    let marker = "text\":\"";
    switch (findSubstring(response, marker)) {
      case null {
        "I received a response but could not parse it. Please try again."
      };
      case (?startIdx) {
        let contentStart = startIdx + marker.size();
        let chars = response.toArray();
        var result = "";
        var j = contentStart;
        var done = false;
        while (j < chars.size() and not done) {
          let c = chars[j];
          let cn = Char.toNat32(c);
          // Check for backslash (92) or quote (34)
          if (cn == 92) {
            // backslash — skip next char (take it as literal)
            j := j + 1;
            if (j < chars.size()) {
              result := result # Text.fromChar(chars[j]);
            };
          } else if (cn == 34) {
            // closing quote
            done := true;
          } else {
            result := result # Text.fromChar(c);
          };
          j := j + 1;
        };
        if (result.size() == 0) {
          "Zeno AI returned an empty answer. Please rephrase your question."
        } else {
          result
        };
      };
    };
  };

  /// Find the starting index of needle in haystack. Returns null if not found.
  func findSubstring(haystack : Text, needle : Text) : ?Nat {
    let h = haystack.toArray();
    let n = needle.toArray();
    let hn = h.size();
    let nn = n.size();
    if (nn == 0) return ?0;
    if (hn < nn) return null;
    let limit : Nat = hn - nn; // safe: hn >= nn enforced above (Nat subtraction is fine)
    var i = 0;
    var found = false;
    var foundIdx = 0;
    while (i <= limit and not found) {
      var matchOk = true;
      var k = 0;
      while (k < nn and matchOk) {
        if (h[i + k] != n[k]) { matchOk := false };
        k := k + 1;
      };
      if (matchOk) {
        found := true;
        foundIdx := i;
      };
      i := i + 1;
    };
    if (found) ?foundIdx else null;
  };
};
