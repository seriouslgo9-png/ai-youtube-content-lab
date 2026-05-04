import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description?: string;
  accent: string;   // hsl token name e.g. "var(--neon-purple)"
  accent2: string;
}

export function ToolHeader({ icon: Icon, eyebrow, title, description, accent, accent2 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="tool-header"
      style={{ ["--tool-accent" as any]: accent, ["--tool-accent-2" as any]: accent2 }}
    >
      <div className="relative z-10 flex items-center gap-5">
        <motion.div
          initial={{ scale: 0.6, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 14 }}
          className="orb-3d h-16 w-16 shrink-0"
        >
          <Icon className="h-7 w-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]" />
        </motion.div>
        <div className="min-w-0">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="font-heading font-semibold text-2xl sm:text-3xl tracking-tight leading-tight mt-1">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-muted-foreground/80 mt-1.5 max-w-md leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
