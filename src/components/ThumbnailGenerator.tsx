import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Sparkles, Download } from "lucide-react";
import { toast } from "sonner";
import { LoadingSpinner } from "./LoadingSpinner";

function drawThumbnail(canvas: HTMLCanvasElement, idea: string) {
  const ctx = canvas.getContext("2d")!;
  canvas.width = 1280;
  canvas.height = 720;

  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, 1280, 720);
  const hues = [
    [280, 200],
    [330, 190],
    [200, 300],
    [160, 280],
  ];
  const pick = hues[Math.floor(Math.random() * hues.length)];
  grad.addColorStop(0, `hsl(${pick[0]}, 80%, 15%)`);
  grad.addColorStop(0.5, `hsl(${(pick[0] + pick[1]) / 2}, 70%, 20%)`);
  grad.addColorStop(1, `hsl(${pick[1]}, 80%, 10%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1280, 720);

  // Decorative circles
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * 1280,
      Math.random() * 720,
      50 + Math.random() * 100,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = `hsla(${pick[0] + Math.random() * 60}, 80%, 50%, 0.1)`;
    ctx.fill();
  }

  // Title text
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Shadow
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 5;

  // Main text
  const words = idea.toUpperCase().split(" ");
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    if ((currentLine + " " + word).length > 20) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += " " + word;
    }
  }
  if (currentLine.trim()) lines.push(currentLine.trim());

  const fontSize = lines.length > 3 ? 60 : lines.length > 2 ? 72 : 85;
  ctx.font = `bold ${fontSize}px 'Space Grotesk', Arial, sans-serif`;
  ctx.fillStyle = "#ffffff";

  const totalHeight = lines.length * (fontSize + 10);
  const startY = 360 - totalHeight / 2 + fontSize / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, 640, startY + i * (fontSize + 10));
  });

  // Accent bar
  ctx.shadowColor = "transparent";
  const barGrad = ctx.createLinearGradient(340, 0, 940, 0);
  barGrad.addColorStop(0, `hsl(${pick[0]}, 90%, 60%)`);
  barGrad.addColorStop(1, `hsl(${pick[1]}, 90%, 60%)`);
  ctx.fillStyle = barGrad;
  ctx.fillRect(440, startY + lines.length * (fontSize + 10) + 10, 400, 6);
}

export function ThumbnailGenerator() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = async () => {
    if (!idea.trim()) {
      toast.error("Please enter a thumbnail idea!");
      return;
    }
    setLoading(true);
    setGenerated(false);

    await new Promise((r) => setTimeout(r, 1500));

    if (canvasRef.current) {
      drawThumbnail(canvasRef.current, idea);
      setGenerated(true);
      toast.success("Thumbnail generated! 🎨");
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `thumbnail-${idea.replace(/\s+/g, "-").toLowerCase()}.png`;
    a.click();
    toast.success("Thumbnail downloaded! 📥");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-accent/20">
            <Image className="h-5 w-5 text-accent" />
          </div>
          <h2 className="text-xl font-heading font-semibold">Thumbnail Generator</h2>
        </div>

        <div className="flex gap-3">
          <input
            className="input-glass flex-1"
            placeholder="Describe your thumbnail idea (e.g., 'AI Takes Over YouTube')"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
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

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card p-6"
          >
            <LoadingSpinner text="Creating your thumbnail..." />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <canvas
          ref={canvasRef}
          className={`w-full rounded-lg transition-all duration-500 ${
            generated
              ? "opacity-100 hover:scale-[1.02] cursor-pointer"
              : "opacity-0 h-0"
          }`}
          style={generated ? { aspectRatio: "16/9" } : {}}
        />
        {generated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end mt-4"
          >
            <button
              onClick={handleDownload}
              className="btn-neon-cyan flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PNG
            </button>
          </motion.div>
        )}
        {!generated && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <Image className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Your thumbnail will appear here</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
