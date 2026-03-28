import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Type, Sparkles, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { generateTitles } from "@/lib/ai-service";
import { LoadingSpinner } from "./LoadingSpinner";

export function TitleGenerator() {
  const [topic, setTopic] = useState("");
  const [titles, setTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic!");
      return;
    }
    setLoading(true);
    setTitles([]);
    try {
      const result = await generateTitles(topic);
      setTitles(result);
      toast.success("Titles generated! ✍️");
    } catch {
      toast.error("Failed to generate titles");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (title: string, idx: number) => {
    navigator.clipboard.writeText(title);
    setCopiedIdx(idx);
    toast.success("Title copied!");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-neon-cyan/20">
            <Type className="h-5 w-5 text-neon-cyan" />
          </div>
          <h2 className="text-xl font-heading font-semibold">Title Generator</h2>
        </div>

        <div className="flex gap-3">
          <input
            className="input-glass flex-1"
            placeholder="Enter your video topic (e.g., 'Machine Learning')"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
          <button
            className="btn-neon flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            onClick={handleGenerate}
            disabled={loading}
          >
            <Sparkles className="h-4 w-4" />
            Generate
          </button>
        </div>
      </motion.div>

      {loading && (
        <div className="glass-card p-6">
          <LoadingSpinner text="Crafting catchy titles..." />
        </div>
      )}

      <AnimatePresence>
        {!loading && titles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 space-y-3"
          >
            <h3 className="font-heading font-semibold gradient-text text-sm uppercase tracking-wider mb-4">
              Generated Titles
            </h3>
            {titles.map((title, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-300"
              >
                <span className="text-sm font-medium flex-1 mr-3">{title}</span>
                <button
                  onClick={() => handleCopy(title, i)}
                  className="p-2 rounded-md hover:bg-muted transition-colors flex-shrink-0"
                >
                  {copiedIdx === i ? (
                    <Check className="h-4 w-4 text-neon-green" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
