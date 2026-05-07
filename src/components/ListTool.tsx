import { useState, ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { LoadingSpinner } from "./LoadingSpinner";
import { ToolHeader } from "./ToolHeader";

interface ListToolProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  accent?: string;
  accent2?: string;
  placeholder: string;
  loadingText: string;
  successText: string;
  resultsTitle: string;
  generate: (topic: string) => Promise<string[]>;
  layout?: "list" | "chips";
}

export function ListTool({
  icon, eyebrow, title, description, accent, accent2,
  placeholder, loadingText, successText, resultsTitle, generate,
  layout = "list",
}: ListToolProps) {
  const [topic, setTopic] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error("Please enter a topic!");
    setLoading(true); setItems([]);
    try {
      const result = await generate(topic);
      setItems(result);
      toast.success(successText);
    } catch {
      toast.error("Generation failed");
    } finally { setLoading(false); }
  };

  const handleCopy = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(i);
    toast.success("Copied!");
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(layout === "chips" ? items.join(" ") : items.join("\n"));
    toast.success("All copied!");
  };

  return (
    <div className="space-y-6">
      <ToolHeader icon={icon} eyebrow={eyebrow} title={title} description={description} accent={accent} accent2={accent2} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex gap-3">
          <input
            className="input-glass flex-1"
            placeholder={placeholder}
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

      {loading && (<div className="glass-card p-6"><LoadingSpinner text={loadingText} /></div>)}

      <AnimatePresence>
        {!loading && items.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold gradient-text text-sm uppercase tracking-wider">{resultsTitle}</h3>
              <button onClick={copyAll} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Copy all</button>
            </div>
            {layout === "chips" ? (
              <div className="flex flex-wrap gap-2">
                {items.map((item, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleCopy(item, i)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted/40 hover:bg-muted/70 border border-border/40 hover:border-primary/40 transition-all"
                  >
                    {copiedIdx === i ? <Check className="h-3 w-3 inline text-neon-green" /> : item}
                  </motion.button>
                ))}
              </div>
            ) : (
              items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="group flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all"
                >
                  <span className="text-sm font-medium flex-1">{item}</span>
                  <button onClick={() => handleCopy(item, i)} className="p-2 rounded-md hover:bg-muted transition-colors flex-shrink-0">
                    {copiedIdx === i ? <Check className="h-4 w-4 text-neon-green" /> : <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />}
                  </button>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}