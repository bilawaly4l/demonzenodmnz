import { Bot, ChevronDown, ChevronUp, Send, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { useZenoAi } from "../hooks/useZenoAi";

interface ZenoAiLessonProps {
  lessonTitle: string;
  tierColor: string;
}

export function ZenoAiLesson({ lessonTitle, tierColor }: ZenoAiLessonProps) {
  const { messages, sendMessage, isLoading } = useZenoAi();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setInput("");
    await sendMessage(text);
    setTimeout(
      () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const handleExplain = () => {
    void handleSend(
      `Explain this trading lesson in simple terms: "${lessonTitle}"`,
    );
    setOpen(true);
  };

  const handlePractice = () => {
    void handleSend(
      `Generate a challenging practice question about: "${lessonTitle}". Give 4 answer options and the correct answer.`,
    );
    setOpen(true);
  };

  return (
    <div
      className="rounded-xl overflow-hidden mt-4"
      style={{
        background: `${tierColor}06`,
        border: `1px solid ${tierColor}20`,
      }}
      data-ocid="academy.lesson.zeno_ai"
    >
      {/* Header */}
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/5 transition-smooth"
        onClick={() => setOpen((p) => !p)}
        data-ocid="academy.lesson.zeno_ai_toggle"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Bot className="w-4 h-4 shrink-0" style={{ color: tierColor }} />
          <span
            className="font-display font-bold text-sm"
            style={{ color: tierColor }}
          >
            Ask Zeno AI
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            — trading questions only
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {messages.length > 0 && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full font-bold"
              style={{ background: `${tierColor}20`, color: tierColor }}
            >
              {messages.length}
            </span>
          )}
          {open ? (
            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          {/* Quick action buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-ocid="academy.lesson.zeno_explain_button"
              onClick={handleExplain}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-smooth disabled:opacity-50"
              style={{
                background: `${tierColor}15`,
                border: `1px solid ${tierColor}30`,
                color: tierColor,
              }}
            >
              <Sparkles className="w-3 h-3" />
              Explain this lesson
            </button>
            <button
              type="button"
              data-ocid="academy.lesson.zeno_practice_button"
              onClick={handlePractice}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-smooth disabled:opacity-50"
              style={{
                background: `${tierColor}15`,
                border: `1px solid ${tierColor}30`,
                color: tierColor,
              }}
            >
              <Bot className="w-3 h-3" />
              Give me a practice question
            </button>
          </div>

          {/* Messages */}
          {messages.length > 0 && (
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {messages.map((msg, i) => (
                <div
                  key={`${msg.timestamp}-${i}`}
                  className={`rounded-lg px-3 py-2 text-xs leading-relaxed ${
                    msg.role === "user" ? "ml-6 text-right" : "mr-6"
                  }`}
                  style={{
                    background:
                      msg.role === "user"
                        ? `${tierColor}20`
                        : "oklch(0.20 0.01 260)",
                    color:
                      msg.role === "user" ? tierColor : "oklch(0.80 0.01 260)",
                  }}
                >
                  {msg.role === "assistant" && (
                    <span
                      className="font-bold mr-1"
                      style={{ color: tierColor }}
                    >
                      😈 Zeno:
                    </span>
                  )}
                  {msg.content}
                </div>
              ))}
              {isLoading && (
                <div
                  className="rounded-lg px-3 py-2 mr-6 text-xs"
                  style={{
                    background: "oklch(0.20 0.01 260)",
                    color: "oklch(0.55 0.01 260)",
                  }}
                  data-ocid="academy.lesson.zeno_loading_state"
                >
                  😈 Zeno is thinking…
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void handleSend(input)}
              placeholder="Ask about this lesson…"
              disabled={isLoading}
              data-ocid="academy.lesson.zeno_input"
              className="flex-1 px-3 py-2 rounded-lg text-xs border focus:outline-none transition-smooth"
              style={{
                background: "oklch(0.18 0.01 260)",
                borderColor: `${tierColor}30`,
                color: "oklch(0.85 0.01 260)",
              }}
            />
            <button
              type="button"
              data-ocid="academy.lesson.zeno_send_button"
              onClick={() => void handleSend(input)}
              disabled={isLoading || !input.trim()}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-smooth disabled:opacity-40"
              style={{ background: tierColor, color: "oklch(0.10 0.01 260)" }}
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
