import { motion } from "framer-motion";

export function LoadingSpinner({ text = "Generating..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <motion.div
        className="h-10 w-10 rounded-full border-2 border-muted border-t-primary"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-sm text-muted-foreground animate-glow-pulse">{text}</p>
    </div>
  );
}
