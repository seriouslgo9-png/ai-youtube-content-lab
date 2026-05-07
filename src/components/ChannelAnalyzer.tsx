import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Sparkles, Copy, Check, Youtube } from "lucide-react";
import { toast } from "sonner";
import { analyzeChannel } from "@/lib/ai-service";
import { LoadingSpinner } from "./LoadingSpinner";
import { ToolHeader } from "./ToolHeader";

const isValidYouTubeUrl = (v: string) => {
  const s = v.trim();
  if (!s) return false;
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(s) || /^@[\w.-]{2,}$/.test(s);
};

export function ChannelAnalyzer() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!isValidYouTubeUrl(url)) {
      return toast.error("Paste a valid YouTube channel URL or @handle");
    }
    setLoading(true); setReport("");
    try {
      const result = await analyzeChannel(url);
      setReport(result);
      toast.success("Channel audit ready! 📊");
    } catch {
      toast.error("Failed to analyze channel");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        icon={BarChart3}
        eyebrow="Audit"
        title="Channel Analyzer"
        description="Paste any YouTube channel link — get a brutally honest growth audit."
        accent="var(--neon-pink)"
        accent2="var(--neon-cyan)"
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
            <input
              className="input-glass w-full pl-9"
              placeholder="https://youtube.com/@yourchannel"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />
          </div>
          <button
            className="btn-neon flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            onClick={handleAnalyze}
            disabled={loading}
          >
            <Sparkles className="h-4 w-4" />
            Analyze
          </button>
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground/70">
          Tip: works with full URLs (youtube.com/@handle, /channel/ID, /c/name) or just an @handle.
        </p>
      </motion.div>

      {loading && (
        <div className="glass-card p-6">
          <LoadingSpinner text="Auditing channel..." />
        </div>
      )}

      <AnimatePresence>
        {!loading && report && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold gradient-text text-sm uppercase tracking-wider">
                Channel Audit Report
              </h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-neon-green" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-foreground/90 font-sans leading-relaxed">{report}</pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
