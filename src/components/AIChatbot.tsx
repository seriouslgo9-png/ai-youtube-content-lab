import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { chatWithAI } from "@/lib/ai-service";
import { LoadingSpinner } from "./LoadingSpinner";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

export function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "Hey! 👋 I'm your AI content strategist. Ask me anything about growing your YouTube channel, content ideas, SEO, thumbnails, or engagement strategies!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await chatWithAI(userMsg.content);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "ai", content: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          content: "Sorry, something went wrong. Please try again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card flex flex-col"
      style={{ height: "calc(100vh - 280px)", minHeight: 400 }}
    >
      <div className="flex items-center gap-3 p-4 border-b border-border/50">
        <div className="p-2 rounded-lg bg-secondary/20">
          <Bot className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h2 className="text-lg font-heading font-semibold">AI Content Strategist</h2>
          <p className="text-xs text-muted-foreground">Ask about growth, SEO, content ideas</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-secondary" />
                </div>
              )}
              <div
                className={`max-w-[80%] ${
                  msg.role === "user" ? "chat-bubble-user text-primary-foreground" : "chat-bubble-ai"
                }`}
              >
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
              {msg.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
              <Bot className="h-4 w-4 text-secondary" />
            </div>
            <div className="chat-bubble-ai">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-muted-foreground"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-border/50">
        <div className="flex gap-3">
          <input
            className="input-glass flex-1"
            placeholder="Ask about content strategy, SEO, growth tips..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="btn-neon-cyan p-3 disabled:opacity-50"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
