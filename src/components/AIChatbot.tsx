import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
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
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speaking, setSpeaking] = useState(false);
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
    utter.rate = 1.05;
    utter.pitch = 1;
    utter.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => /en-US/i.test(v.lang) && /female|samantha|google us/i.test(v.name)) ||
      voices.find((v) => /en/i.test(v.lang));
    if (preferred) utter.voice = preferred;
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

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;
    stopSpeaking();
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
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
