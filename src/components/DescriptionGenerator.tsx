import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlignLeft, Sparkles, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { generateDescription } from "@/lib/ai-service";
import { LoadingSpinner } from "./LoadingSpinner";
import { ToolHeader } from "./ToolHeader";

export function DescriptionGenerator() {
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error("Please enter a topic!");
    setLoading(true); setText("");
    try {
      const result = await generateDescription(topic);
      setText(result);
      toast.success("Description ready! 📝");
    } catch { toast.error("Failed to generate"); }
    finally { setLoading(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        icon={AlignLeft}
        eyebrow="SEO"
        title="Description Generator"
        description="SEO-optimized descriptions with chapters and CTAs."
        accent="var(--neon-purple)"
        accent2="var(--neon-cyan)"
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex gap-3">
          <input
            className="input-glass flex-1"
            placeholder="Enter your video topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
          <button className="btn-neon flex items-center gap-2 whitespace-nowrap disabled:opacity-50" onClick={handleGenerate} disabled={loading}>
            <Sparkles className="h-4 w-4" />
            Generate
          </button>
        </div>
      </motion.div>

      {loading && (<div className="glass-card p-6"><LoadingSpinner text="Writing description..." /></div>)}

      <AnimatePresence>
        {!loading && text && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold gradient-text text-sm uppercase tracking-wider">Description</h3>
              <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                {copied ? <Check className="h-3.5 w-3.5 text-neon-green" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-foreground/90 font-sans leading-relaxed">{text}</pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}