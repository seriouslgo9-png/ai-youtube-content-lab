import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, Trash2, Copy, Sparkles, History, Gift } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FloatingBubbles } from "@/components/FloatingBubbles";

interface Generation {
  id: string;
  tool: string;
  prompt: string | null;
  result: string | null;
  created_at: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile } = useProfile();
  const [items, setItems] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("generations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setItems((data as Generation[]) || []);
        setLoading(false);
      });
  }, [user]);

  const remove = async (id: string) => {
    await supabase.from("generations").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Deleted");
  };

  const copyReferral = () => {
    if (!profile?.referral_code) return;
    const url = `${window.location.origin}/login?ref=${profile.referral_code}`;
    navigator.clipboard.writeText(url);
    toast.success("Referral link copied!");
  };

  const planLimit = profile?.plan === "business" ? 2500 : profile?.plan === "pro" ? 500 : 10;
  const used = Math.max(0, planLimit - (profile?.credits ?? 0));
  const pct = Math.min(100, (used / planLimit) * 100);

  return (
    <div className="min-h-screen relative">
      <FloatingBubbles />
      <div className="relative z-10 container max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 font-heading"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="font-heading font-bold text-3xl sm:text-4xl mb-8">
          Your <span className="gradient-text">Dashboard</span>
        </h1>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-hover p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">
              <Sparkles className="h-3 w-3" /> Plan
            </div>
            <div className="font-heading font-bold text-2xl capitalize">{profile?.plan ?? "free"}</div>
            <button
              onClick={() => navigate("/pricing")}
              className="mt-3 text-xs font-heading font-semibold text-primary hover:underline"
            >
              {profile?.plan === "free" ? "Upgrade →" : "Manage plan →"}
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-hover p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">
              <Zap className="h-3 w-3" /> Credits
            </div>
            <div className="font-heading font-bold text-2xl">
              {profile?.credits ?? 0}
              <span className="text-sm text-muted-foreground font-normal"> / {planLimit}</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-muted/40 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${pct}%` }} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-hover p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">
              <Gift className="h-3 w-3" /> Refer & earn
            </div>
            <div className="font-heading font-bold text-sm truncate">{profile?.referral_code ?? "—"}</div>
            <button
              onClick={copyReferral}
              className="mt-3 flex items-center gap-1 text-xs font-heading font-semibold text-primary hover:underline"
            >
              <Copy className="h-3 w-3" /> Copy link
            </button>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <History className="h-4 w-4 text-primary" />
          <h2 className="font-heading font-bold text-xl">Recent generations</h2>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-sm">Loading…</p>
        ) : items.length === 0 ? (
          <div className="glass-card-hover p-8 text-center text-sm text-muted-foreground">
            No generations yet. Head back and create something! ✨
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card-hover p-4 flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary font-heading font-semibold">
                      {it.tool}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(it.created_at).toLocaleString()}
                    </span>
                  </div>
                  {it.prompt && <p className="text-sm font-medium truncate">{it.prompt}</p>}
                  {it.result && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{it.result}</p>
                  )}
                </div>
                <button
                  onClick={() => remove(it.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}