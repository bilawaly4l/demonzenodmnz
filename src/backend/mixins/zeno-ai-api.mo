import Outcall "mo:caffeineai-http-outcalls/outcall";
import ZenoAiLib "../lib/zeno-ai";
import ZenoAiTypes "../types/zeno-ai";

mixin () {

  /// Public query transformer for Gemini HTTP response normalisation.
  public query func zenoAiTransform(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  /// Ask Zeno AI a trading education question.
  /// Powered by the Gemini API — restricted to trading and finance education topics.
  public func askZenoAi(question : Text) : async ZenoAiTypes.ZenoAiResponse {
    await ZenoAiLib.ask(question, zenoAiTransform);
  };
};
