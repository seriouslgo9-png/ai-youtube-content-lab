import { motion } from "framer-motion";
import { Zap, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";

export function CreditsBadge() {
  const { profile } = useProfile();
  const navigate = useNavigate();
  if (!profile) return null;

  const isPaid = profile.plan !== "free";
  return (
    <motion.button
      onClick={() => navigate("/pricing")}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-semibold border transition-all ${
        isPaid
          ? "border-primary/40 bg-gradient-to-r from-primary/15 to-accent/15 text-foreground"
          : "border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40"
      }`}
      title={`Plan: ${profile.plan}`}
    >
      {isPaid ? <Crown className="h-3 w-3 text-primary" /> : <Zap className="h-3 w-3" />}
      <span>{profile.credits}</span>
      <span className="text-muted-foreground hidden sm:inline">credits</span>
    </motion.button>
  );
}