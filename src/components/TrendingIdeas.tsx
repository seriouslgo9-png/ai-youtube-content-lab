import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, RefreshCw, Copy } from "lucide-react";
import { toast } from "sonner";
import { getTrendingIdeas } from "@/lib/ai-service";
import { LoadingSpinner } from "./LoadingSpinner";

export function TrendingIdeas() {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await getTrendingIdeas();
      setIdeas(result);
      toast.success("Fresh trending ideas loaded! 🔥");
    } catch {
      toast.error("Failed to load ideas");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (idea: string) => {
    navigator.clipboard.writeText(idea);
    toast.success("Idea copied!");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neon-green/20">
              <TrendingUp className="h-5 w-5 text-neon-green" />
            </div>
            <h2 className="text-xl font-heading font-semibold">Trending Ideas</h2>
          </div>
          <button
            className="btn-neon flex items-center gap-2 disabled:opacity-50"
            onClick={handleGenerate}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {ideas.length ? "Refresh" : "Generate"}
          </button>
        </div>

        {loading && <LoadingSpinner text="Finding trending ideas..." />}

        <AnimatePresence>
          {!loading && ideas.length > 0 && (
            <motion.div className="grid gap-3 sm:grid-cols-2">
              {ideas.map((idea, i) => (
                <motion.div
                  key={idea}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  onClick={() => handleCopy(idea)}
                >
                  <span className="text-sm font-medium">{idea}</span>
                  <Copy className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && ideas.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-sm">
            Click generate to discover trending video ideas 🚀
          </p>
        )}
      </motion.div>
    </div>
  );
}
