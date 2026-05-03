import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, X, MessageCircle, Volume2, VolumeX } from "lucide-react";
import { chatWithAI } from "@/lib/ai-service";

type Msg = { role: "user" | "ai"; content: string };

export function RobotBot() {
  const robotRef = useRef<HTMLDivElement>(null);
  const leftPupil = useRef<HTMLDivElement>(null);
  const rightPupil = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", content: "Hi! I'm Nova 🤖 — ask me anything about YouTube growth!" },
  ]);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [listening, setListening] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const recRef = useRef<any>(null);
  const ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const srSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  // Eye + head tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!robotRef.current) return;
      const rect = robotRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const max = 6;
      const px = (dx / dist) * Math.min(max, Math.abs(dx) / 18);
      const py = (dy / dist) * Math.min(max, Math.abs(dy) / 18);
      [leftPupil.current, rightPupil.current].forEach((el) => {
        if (el) el.style.transform = `translate(${px}px, ${py}px)`;
      });
      // Subtle 3D head tilt
      setTilt({
        x: Math.max(-12, Math.min(12, dy / 30)),
        y: Math.max(-15, Math.min(15, dx / 30)),
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const speak = (text: string) => {
    if (!ttsSupported || !voiceOn) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[`*_#>~]/g, "").replace(/\[(.*?)\]\(.*?\)/g, "$1");
    const u = new SpeechSynthesisUtterance(clean);
    u.rate = 1.05;
    u.pitch = 1.15;
    const voices = window.speechSynthesis.getVoices();
    const v =
      voices.find((v) => /samantha|google us english|jenny|aria|female/i.test(v.name)) ||
      voices.find((v) => /^en/i.test(v.lang));
    if (v) u.voice = v;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const stopSpeak = () => {
    if (ttsSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const send = async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    stopSpeak();
    const history = messages.slice(-6).map((m) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.content,
    }));
    setMessages((p) => [...p, { role: "user", content: q }]);
    setInput("");
    setLoading(true);
    try {
      const reply = await chatWithAI(q, history);
      setMessages((p) => [...p, { role: "ai", content: reply }]);
      speak(reply);
    } catch {
      setMessages((p) => [
        ...p,
        { role: "ai", content: "Oops, my circuits glitched. Try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleListen = () => {
    if (!srSupported) return;
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = true;
    r.continuous = false;
    recRef.current = r;
    let final = "";
    r.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setInput(final + interim);
    };
    r.onend = () => {
      setListening(false);
      if (final.trim()) send(final.trim());
    };
    r.onerror = () => setListening(false);
    setListening(true);
    r.start();
  };

  return (
    <>
      {/* Robot character */}
      <motion.div
        ref={robotRef}
        className="fixed bottom-6 right-6 z-40 cursor-pointer select-none"
        style={{ perspective: 800 }}
        onClick={() => setOpen((o) => !o)}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            transform: `rotateX(${-tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.15s ease-out",
          }}
          className="relative"
        >
          {/* Glow under */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-3 rounded-full bg-primary/40 blur-xl" />

          {/* Antenna */}
          <div className="relative w-28 h-28 mx-auto">
            <div className="absolute left-1/2 -top-5 -translate-x-1/2 w-1 h-5 bg-gradient-to-b from-secondary to-primary rounded-full" />
            <motion.div
              className="absolute left-1/2 -top-7 -translate-x-1/2 w-3 h-3 rounded-full bg-secondary"
              animate={{
                boxShadow: [
                  "0 0 8px hsla(190,95%,50%,0.6)",
                  "0 0 20px hsla(190,95%,50%,1)",
                  "0 0 8px hsla(190,95%,50%,0.6)",
                ],
                scale: speaking ? [1, 1.4, 1] : 1,
              }}
              transition={{ duration: speaking ? 0.4 : 1.5, repeat: Infinity }}
            />

            {/* Head — 3D shaded */}
            <div
              className="relative w-28 h-24 rounded-3xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, hsl(220,15%,28%) 0%, hsl(220,20%,18%) 50%, hsl(220,25%,12%) 100%)",
                boxShadow:
                  "inset 6px 6px 12px hsla(0,0%,100%,0.08), inset -6px -6px 12px hsla(0,0%,0%,0.5), 0 14px 30px hsla(265,90%,55%,0.35), 0 0 0 1px hsla(190,95%,50%,0.25)",
              }}
            >
              {/* Visor */}
              <div
                className="absolute top-4 left-3 right-3 h-12 rounded-2xl flex items-center justify-around px-3"
                style={{
                  background:
                    "linear-gradient(160deg, hsl(220,40%,8%), hsl(220,50%,4%))",
                  boxShadow:
                    "inset 0 2px 4px hsla(0,0%,0%,0.8), 0 0 12px hsla(190,95%,50%,0.4)",
                }}
              >
                {/* Eyes */}
                {[leftPupil, rightPupil].map((ref, i) => (
                  <div
                    key={i}
                    className="relative w-6 h-6 rounded-full bg-background/40 flex items-center justify-center overflow-hidden"
                    style={{
                      boxShadow: "inset 0 0 4px hsla(0,0%,0%,0.8)",
                    }}
                  >
                    <div
                      ref={ref}
                      className="w-3.5 h-3.5 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle at 30% 30%, hsl(190,100%,80%), hsl(190,95%,50%) 60%, hsl(265,90%,55%) 100%)",
                        boxShadow:
                          "0 0 10px hsla(190,95%,50%,0.9), 0 0 4px hsla(265,90%,65%,0.8)",
                        transition: "transform 0.08s ease-out",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Mouth — animated when speaking */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-0.5 items-end h-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full bg-secondary"
                    animate={
                      speaking
                        ? { height: [4, 10, 4], opacity: [0.6, 1, 0.6] }
                        : { height: 3, opacity: 0.5 }
                    }
                    transition={{
                      duration: 0.4,
                      repeat: speaking ? Infinity : 0,
                      delay: i * 0.08,
                    }}
                    style={{
                      boxShadow: "0 0 6px hsla(190,95%,50%,0.8)",
                    }}
                  />
                ))}
              </div>

              {/* Cheek lights */}
              <div className="absolute top-10 left-1.5 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_hsla(330,85%,60%,0.9)]" />
              <div className="absolute top-10 right-1.5 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_hsla(330,85%,60%,0.9)]" />
            </div>

            {/* Neck */}
            <div
              className="mx-auto w-6 h-2 rounded-b"
              style={{
                background: "linear-gradient(180deg, hsl(220,20%,18%), hsl(220,25%,10%))",
              }}
            />
            {/* Body hint */}
            <div
              className="mx-auto w-20 h-3 rounded-2xl -mt-0.5"
              style={{
                background:
                  "linear-gradient(145deg, hsl(220,15%,25%), hsl(220,25%,10%))",
                boxShadow: "0 6px 14px hsla(265,90%,55%,0.3)",
              }}
            />
          </div>

          {!open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-8 -left-20 px-3 py-1 rounded-full text-xs font-heading bg-background/80 backdrop-blur border border-primary/30 text-foreground whitespace-nowrap"
            >
              Ask me! <MessageCircle className="inline h-3 w-3 ml-1" />
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-44 right-6 z-40 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border/50 bg-background/90 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: 420 }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div>
                <div className="font-heading font-semibold text-sm">Nova</div>
                <div className="text-[10px] text-muted-foreground">
                  {speaking ? "🔊 Speaking..." : listening ? "🎤 Listening..." : "Online"}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (speaking) stopSpeak();
                    setVoiceOn((v) => !v);
                  }}
                  className="p-1.5 rounded-lg hover:bg-muted/40"
                  title="Toggle voice"
                >
                  {voiceOn ? (
                    <Volume2 className="h-4 w-4 text-secondary" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => {
                    stopSpeak();
                    setOpen(false);
                  }}
                  className="p-1.5 rounded-lg hover:bg-muted/40"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`text-sm px-3 py-2 rounded-2xl max-w-[85%] ${
                    m.role === "user"
                      ? "ml-auto bg-primary/20 text-foreground"
                      : "bg-muted/40 text-foreground"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="bg-muted/40 px-3 py-2 rounded-2xl w-fit flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="p-2 border-t border-border/50 flex gap-2">
              {srSupported && (
                <button
                  onClick={toggleListen}
                  className={`p-2 rounded-lg ${
                    listening
                      ? "bg-red-500/20 text-red-400 animate-pulse"
                      : "bg-secondary/10 text-secondary hover:bg-secondary/20"
                  }`}
                >
                  {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              )}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask Nova..."
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-muted/30 border border-border/50 focus:outline-none focus:border-primary/50"
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}