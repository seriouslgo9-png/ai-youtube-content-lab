import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Send, User, Mic, MicOff, Volume2, VolumeX,
  Copy, RefreshCw, Square, Sparkles, Trash2, Check,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { chatWithAI } from "@/lib/ai-service";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

const QUICK_PROMPTS = [
  "📈 Why is my channel not growing?",
  "🎬 Give me 5 viral video ideas for this week",
  "🖼️ How do I make thumbnails that get clicks?",
  "🔍 Best YouTube SEO tips for 2026",
  "💰 How do small channels get monetized fast?",
];

export function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "Hey! 👋 I'm your AI content strategist with **voice & memory**. Ask me anything about YouTube growth, SEO, thumbnails, or pick a quick prompt below to get started!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState(1.05);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const voiceSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
  const ttsSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load available voices
  useEffect(() => {
    if (!ttsSupported) return;
    const load = () => {
      const all = window.speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang));
      setVoices(all);
      if (!selectedVoice && all.length) {
        const preferred =
          all.find((v) => /samantha|google us english|jenny|aria/i.test(v.name)) ||
          all.find((v) => /female/i.test(v.name)) ||
          all[0];
        setSelectedVoice(preferred.name);
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, [ttsSupported, selectedVoice]);

  // Strip markdown for cleaner spoken output
  const cleanForSpeech = (text: string) =>
    text
      .replace(/[`*_#>~]/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/\n+/g, ". ")
      .replace(/\s+/g, " ")
      .trim();

  const speak = (text: string) => {
    if (!ttsSupported || !voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(cleanForSpeech(text));
    utter.rate = rate;
    utter.pitch = 1;
    utter.volume = 1;
    const chosen = voices.find((v) => v.name === selectedVoice);
    if (chosen) utter.voice = chosen;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const stopSpeaking = () => {
    if (ttsSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  useEffect(() => {
    return () => {
      if (ttsSupported) window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [ttsSupported]);

  const toggleListening = () => {
    if (!voiceSupported) return;
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    let finalText = "";
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
        else interim += transcript;
      }
      setInput(finalText + interim);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => {
      setListening(false);
      if (finalText.trim()) {
        handleSend(finalText.trim());
      }
    };
    setListening(true);
    recognition.start();
  };

  const buildHistory = () =>
    messages
      .filter((m) => m.id !== "welcome")
      .slice(-8)
      .map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.content }));

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;
    stopSpeaking();
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    const history = buildHistory();
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await chatWithAI(userMsg.content, history);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "ai", content: reply },
      ]);
      speak(reply);
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

  const regenerateLast = async () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser || loading) return;
    setMessages((prev) => {
      const lastAiIdx = [...prev].map((m) => m.role).lastIndexOf("ai");
      return lastAiIdx > 0 ? prev.slice(0, lastAiIdx) : prev;
    });
    handleSend(lastUser.content);
  };

  const copyMessage = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: "welcome",
        role: "ai",
        content: "Fresh start! 🚀 What do you want to grow today?",
      },
    ]);
  };

  const showQuickPrompts = useMemo(
    () => messages.filter((m) => m.id !== "welcome").length === 0,
    [messages]
  );

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
        <div className="flex-1">
          <h2 className="text-lg font-heading font-semibold">AI Content Strategist</h2>
          <p className="text-xs text-muted-foreground">
            {speaking ? "🔊 Speaking..." : listening ? "🎤 Listening..." : "Ask about growth, SEO, content ideas"}
          </p>
        </div>
        {ttsSupported && voices.length > 0 && (
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="hidden sm:block text-xs bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-lg px-2 py-1.5 border border-border/50 focus:outline-none max-w-[140px]"
            title="Choose voice"
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name.length > 22 ? v.name.slice(0, 20) + "…" : v.name}
              </option>
            ))}
          </select>
        )}
        {ttsSupported && (
          <select
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="text-xs bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-lg px-2 py-1.5 border border-border/50 focus:outline-none"
            title="Speech speed"
          >
            <option value={0.8}>0.8x</option>
            <option value={1}>1x</option>
            <option value={1.05}>1.05x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
          </select>
        )}
        {speaking && (
          <button
            onClick={stopSpeaking}
            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            title="Stop speaking"
          >
            <Square className="h-4 w-4" />
          </button>
        )}
        {ttsSupported && (
          <button
            onClick={() => {
              if (speaking) stopSpeaking();
              setVoiceEnabled((v) => !v);
            }}
            className="p-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors"
            title={voiceEnabled ? "Mute voice" : "Enable voice"}
          >
            {voiceEnabled ? (
              <Volume2 className="h-4 w-4 text-secondary" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        )}
        <button
          onClick={clearChat}
          className="p-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors"
          title="Clear conversation"
        >
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 group ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-secondary" />
                </div>
              )}
              <div className={`max-w-[80%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={
                    msg.role === "user" ? "chat-bubble-user text-primary-foreground" : "chat-bubble-ai"
                  }
                >
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
                {msg.role === "ai" && msg.id !== "welcome" && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyMessage(msg.id, msg.content)}
                      className="p-1 rounded hover:bg-secondary/20 text-muted-foreground"
                      title="Copy"
                    >
                      {copiedId === msg.id ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                    <button
                      onClick={() => speak(msg.content)}
                      className="p-1 rounded hover:bg-secondary/20 text-muted-foreground"
                      title="Speak this"
                    >
                      <Volume2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={regenerateLast}
                      className="p-1 rounded hover:bg-secondary/20 text-muted-foreground"
                      title="Regenerate"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {showQuickPrompts && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 pt-2"
          >
            <div className="w-full flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Sparkles className="h-3 w-3" /> Quick prompts
            </div>
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p.replace(/^[^\s]+\s/, ""))}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary/10 hover:bg-secondary/20 text-secondary border border-border/50 transition-all hover:scale-105"
              >
                {p}
              </button>
            ))}
          </motion.div>
        )}

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
          {voiceSupported && (
            <button
              className={`p-3 rounded-lg transition-all ${
                listening
                  ? "bg-red-500/20 text-red-400 animate-pulse"
                  : "bg-secondary/10 hover:bg-secondary/20 text-secondary"
              }`}
              onClick={toggleListening}
              disabled={loading}
              title={listening ? "Stop listening" : "Speak your question"}
            >
              {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
          )}
          <input
            className="input-glass flex-1"
            placeholder={listening ? "Listening..." : "Ask or tap the mic to speak..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="btn-neon-cyan p-3 disabled:opacity-50"
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
