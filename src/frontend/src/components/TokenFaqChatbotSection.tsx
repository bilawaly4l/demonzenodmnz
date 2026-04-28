import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActor } from "@caffeineai/core-infrastructure";
import { Bot, Send } from "lucide-react";
import { useRef, useState } from "react";
import { createActor } from "../backend";
import { ScrollAnimation } from "./ScrollAnimation";

interface ChatMsg {
  role: "user" | "bot";
  content: string;
}

const SUGGESTED = [
  "What is DMNZ?",
  "When does DMNZ launch?",
  "How does the burn work?",
  "What is Blum?",
  "Is there a presale?",
];

export function TokenFaqChatbotSection() {
  const { actor } = useActor(createActor);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "bot",
      content:
        "Hey, I'm DemonZeno's token FAQ bot. Ask me anything about DMNZ — the token, launch, burn mechanics, or Blum platform.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function send(question: string) {
    const q = question.trim();
    if (!q || !actor) return;
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setLoading(true);
    try {
      const answer = await actor.askTokenFaq(q);
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          content:
            answer || "I don't have an answer for that yet. Check back soon.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "bot", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <section
      id="token-faq-chatbot"
      data-ocid="token_faq_chatbot.section"
      className="py-20 bg-background"
    >
      <div className="container mx-auto px-4 max-w-2xl">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-8 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Token Bot
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              Ask About DMNZ
            </h2>
            <p className="text-muted-foreground text-sm">
              A dedicated mini AI for all your DMNZ token questions.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={100}>
          <div
            className="bg-card border border-border rounded-2xl overflow-hidden card-elevated"
            data-ocid="token_faq_chatbot.panel"
          >
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/20">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground text-sm">
                  DMNZ Token Bot
                </p>
                <p className="text-muted-foreground text-xs">
                  Powered by DemonZeno AI
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-4 p-5 h-72 overflow-y-auto">
              {messages.map((msg, i) => (
                <div
                  key={`msg-${msg.role}-${i}`}
                  data-ocid={`token_faq_chatbot.message.${i + 1}`}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {msg.role === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted/40 text-foreground rounded-tl-sm"}`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div
                  data-ocid="token_faq_chatbot.loading_state"
                  className="flex gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-muted/40 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                    <span
                      className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggested chips */}
            {messages.length <= 1 && (
              <div className="px-5 pb-3 flex flex-wrap gap-2">
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    type="button"
                    data-ocid="token_faq_chatbot.suggestion.button"
                    onClick={() => send(q)}
                    className="text-xs bg-muted/40 text-foreground border border-border rounded-full px-3 py-1.5 hover:border-primary/40 hover:text-primary transition-smooth"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 px-4 py-4 border-t border-border bg-muted/10"
            >
              <Input
                data-ocid="token_faq_chatbot.input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about DMNZ…"
                disabled={loading}
                className="bg-background border-input text-sm"
              />
              <Button
                type="submit"
                data-ocid="token_faq_chatbot.submit_button"
                disabled={loading || !input.trim()}
                className="btn-primary px-4 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
