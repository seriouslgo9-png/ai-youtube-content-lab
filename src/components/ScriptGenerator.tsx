import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Download, Trash2, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { LoadingSpinner } from "./LoadingSpinner";
import { generateScript, saveScript, getSavedScripts, deleteScript, type SavedScript } from "@/lib/ai-service";
import { ToolHeader } from "./ToolHeader";

export function ScriptGenerator() {
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedScripts, setSavedScripts] = useState<SavedScript[]>(getSavedScripts);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic first!");
      return;
    }
    setLoading(true);
    setScript("");
    try {
      const result = await generateScript(topic);
      setScript(result);
      const saved = saveScript(topic, result);
      setSavedScripts(getSavedScripts());
      toast.success("Script generated successfully! 🎬");
    } catch {
      toast.error("Failed to generate script");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    toast.success("Copied to clipboard! 📋");
  };

  const handleDownload = () => {
    const blob = new Blob([script], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `script-${topic.replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Script downloaded! 📥");
  };

  const handleDelete = (id: string) => {
    deleteScript(id);
    setSavedScripts(getSavedScripts());
    toast.success("Script deleted");
  };

  const handleReuse = (s: SavedScript) => {
    setTopic(s.topic);
    setScript(s.content);
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        icon={FileText}
        eyebrow="Create"
        title="Script Generator"
        description="Turn any topic into a complete, ready-to-record script."
        accent="var(--neon-purple)"
        accent2="var(--neon-pink)"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex gap-3">
          <input
            className="input-glass flex-1"
            placeholder="Enter your video topic (e.g., 'AI in everyday life')"
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
        {topic && (
          <p className="text-xs text-muted-foreground mt-2">
            Character count: {topic.length}
          </p>
        )}
      </motion.div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card p-6"
          >
            <LoadingSpinner text="Crafting your script with AI..." />
          </motion.div>
        )}

        {script && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold gradient-text">Generated Script</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  title="Copy"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="prose prose-invert prose-sm max-w-none text-foreground/90">
              <ReactMarkdown>{script}</ReactMarkdown>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {script.length} characters · {script.split(/\s+/).length} words
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {savedScripts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="font-heading font-semibold mb-4 text-muted-foreground text-sm uppercase tracking-wider">
            Previous Scripts
          </h3>
          <div className="space-y-2">
            {savedScripts.slice(0, 5).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <button
                  onClick={() => handleReuse(s)}
                  className="text-sm text-left truncate flex-1 mr-3 hover:text-primary transition-colors"
                >
                  {s.topic}
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
