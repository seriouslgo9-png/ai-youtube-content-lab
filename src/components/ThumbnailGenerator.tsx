import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Sparkles, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { LoadingSpinner } from "./LoadingSpinner";
import { generateThumbnail } from "@/lib/ai-service";
import { ToolHeader } from "./ToolHeader";

export function ThumbnailGenerator() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!idea.trim()) {
      toast.error("Please enter a thumbnail idea!");
      return;
    }
    setLoading(true);
    setImageUrl(null);

    try {
      const url = await generateThumbnail(idea);
      setImageUrl(url);
      toast.success("Thumbnail generated! 🎨");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate thumbnail");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `thumbnail-${idea.replace(/\s+/g, "-").toLowerCase()}.png`;
    a.click();
    toast.success("Thumbnail downloaded! 📥");
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        icon={Image}
        eyebrow="Visualize"
        title="Thumbnail Generator"
        description="Unique, professional thumbnails crafted by AI in seconds."
        accent="var(--neon-pink)"
        accent2="var(--neon-purple)"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex gap-3">
          <input
            className="input-glass flex-1"
            placeholder="Describe your thumbnail (e.g., 'AI Takes Over YouTube 2025')"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleGenerate()}
          />
          <button
            className="btn-neon flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card p-6"
          >
            <LoadingSpinner text="AI is creating your thumbnail... this may take 15-30 seconds" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        {imageUrl ? (
          <div className="space-y-4">
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={imageUrl}
              alt="AI Generated Thumbnail"
              className="w-full rounded-lg shadow-2xl hover:scale-[1.02] transition-transform cursor-pointer"
              style={{ aspectRatio: "16/9", objectFit: "cover" }}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">AI-generated thumbnail</p>
              <div className="flex gap-2">
                <button
                  onClick={handleGenerate}
                  className="btn-neon flex items-center gap-2 text-sm"
                  disabled={loading}
                >
                  <RefreshCw className="h-3 w-3" />
                  Regenerate
                </button>
                <button
                  onClick={handleDownload}
                  className="btn-neon-cyan flex items-center gap-2 text-sm"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        ) : !loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <Image className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Your AI-generated thumbnail will appear here</p>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
