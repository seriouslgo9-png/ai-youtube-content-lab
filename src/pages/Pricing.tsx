import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FloatingBubbles } from "@/components/FloatingBubbles";

const plans = [
  {
    id: "free" as const,
    name: "Starter",
    price: "$0",
    period: "forever",
    icon: Sparkles,
    credits: 10,
    gradient: "from-muted to-muted",
    features: [
      "10 generations / month",
      "All 5 AI tools",
      "Basic AI models",
      "Community support",
    ],
  },
  {
    id: "pro" as const,
    name: "Creator Pro",
    price: "$19",
    period: "/ month",
    icon: Zap,
    credits: 500,
    popular: true,
    gradient: "from-[hsl(265,90%,65%)] to-[hsl(330,85%,60%)]",
    features: [
      "500 generations / month",
      "Premium AI models (GPT-5, Gemini Pro)",
      "Voice agent unlimited",
      "Export to PDF & CSV",
      "Priority email support",
      "Generation history",
    ],
  },
  {
    id: "business" as const,
    name: "Studio",
    price: "$49",
    period: "/ month",
    icon: Crown,
    credits: 2500,
    gradient: "from-[hsl(190,95%,50%)] to-[hsl(265,90%,65%)]",
    features: [
      "2,500 generations / month",
      "All Pro features",
      "Team seats (up to 5)",
      "API access",
      "White-label exports",
      "Dedicated account manager",
    ],
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, refresh } = useProfile();

  const handleSelect = async (planId: "free" | "pro" | "business") => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (planId === "free") {
      toast.info("You're on the Starter plan");
      return;
    }
    // Demo mode: instant upgrade. Wire real payments later.
    const newCredits = planId === "pro" ? 500 : 2500;
    const { error } = await supabase
      .from("profiles")
      .update({ plan: planId, credits: newCredits })
      .eq("id", user.id);
    if (error) {
      toast.error("Upgrade failed");
      return;
    }
    await refresh();
    toast.success(`Welcome to ${planId === "pro" ? "Creator Pro" : "Studio"}! 🎉`);
    navigate("/");
  };

  return (
    <div className="min-h-screen relative">
      <FloatingBubbles />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, hsla(265,90%,65%,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 80%, hsla(190,95%,50%,0.1) 0%, transparent 50%)",
        }}
      />
      <div className="relative z-10 container max-w-6xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 font-heading"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="text-center mb-14">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading font-bold text-4xl sm:text-6xl"
          >
            <span className="gradient-text">Pricing</span> built for{" "}
            <span className="gradient-text-pink">creators</span>
          </motion.h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Start free. Upgrade when you're ready to scale your channel with unlimited AI power.
          </p>
          {profile && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border border-border/50 bg-muted/20">
              Current plan: <span className="font-semibold capitalize">{profile.plan}</span> ·{" "}
              {profile.credits} credits left
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p, i) => {
            const Icon = p.icon;
            const isCurrent = profile?.plan === p.id;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card-hover p-7 relative flex flex-col ${
                  p.popular ? "ring-2 ring-primary/40 scale-[1.02]" : ""
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-gradient-to-r from-[hsl(265,90%,65%)] to-[hsl(330,85%,60%)] text-white shadow-lg">
                    Most Popular
                  </span>
                )}
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center mb-4`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-heading font-bold text-xl">{p.name}</h3>
                <div className="mt-2 mb-5">
                  <span className="font-heading font-bold text-4xl">{p.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">{p.period}</span>
                </div>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-neon-green shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelect(p.id)}
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-lg font-heading font-semibold text-sm transition-all ${
                    isCurrent
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : p.popular
                      ? "btn-neon"
                      : "border border-border/50 hover:bg-muted/30 text-foreground"
                  }`}
                >
                  {isCurrent ? "Current plan" : p.id === "free" ? "Get started" : `Upgrade to ${p.name}`}
                </button>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          💳 Demo mode — payments not yet connected. Plans switch instantly for testing.
        </p>
      </div>
    </div>
  );
}