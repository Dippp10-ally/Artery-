"use client";

// Fabri is ARTERY's resident AI curator — a floating chat widget that
// gives personalised art recommendations and guides patrons through the collection.

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  text: "Namaste. I am Fabri, your curator. I can guide you through our collection of Indian masterpieces and help you find the right artisan for your vision. How may I assist you?",
};

export function FabriChat() {
  const [open,    setOpen]    = useState(false);
  const [msgs,    setMsgs]    = useState<Message[]>([INITIAL_MESSAGE]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setMsgs((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/curate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          // Send recent history so Claude remembers the conversation
          history: msgs.slice(-8).map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json();
      setMsgs((prev) => [...prev, { role: "assistant", text: data.reply ?? "I'm unable to respond right now. Please try again shortly." }]);
    } catch {
      setMsgs((prev) => [...prev, { role: "assistant", text: "I seem to have lost connection. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90]">

      {/* Collapsed trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-ink text-cream p-4 rounded-full shadow-warm-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 group"
        >
          <Sparkles size={20} className="text-accent animate-pulse" />
          <span className="pr-1 font-serif text-sm hidden group-hover:block transition-all whitespace-nowrap">
            Ask Curator
          </span>
        </button>
      )}

      {/* Expanded chat panel */}
      {open && (
        <div className="bg-cream w-80 md:w-96 rounded-lg shadow-warm-lg border border-cream-dark flex flex-col animate-slide-up overflow-hidden">

          {/* Header */}
          <div className="bg-ink px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <Sparkles size={14} className="text-cream" />
              </div>
              <div>
                <p className="font-serif text-sm text-cream leading-none">Fabri</p>
                <p className="text-[10px] text-ink-faint mt-0.5">AI Art Curator</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-ink-faint hover:text-cream transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 space-y-3 bg-cream-card">
            {msgs.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2.5 rounded-lg text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent text-cream rounded-br-none"
                      : "bg-cream text-ink border border-cream-dark rounded-bl-none shadow-warm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-cream border border-cream-dark rounded-lg rounded-bl-none shadow-warm px-4 py-3 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-cream border-t border-cream-dark flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask for recommendations…"
              className="flex-1 input-warm text-sm"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="p-2 bg-ink text-cream rounded-md disabled:opacity-40 hover:bg-ink/80 transition-colors"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
