import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Image, Bot, TrendingUp, Type, Youtube,
  Zap, ArrowRight, Star, LogIn, LogOut, LayoutDashboard, Crown,
} from "lucide-react";
import { ScriptGenerator } from "@/components/ScriptGenerator";
import { ThumbnailGenerator } from "@/components/ThumbnailGenerator";
import { AIChatbot } from "@/components/AIChatbot";
import { TrendingIdeas } from "@/components/TrendingIdeas";
import { TitleGenerator } from "@/components/TitleGenerator";
import { FloatingBubbles } from "@/components/FloatingBubbles";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RobotBot } from "@/components/RobotBot";
import { useAuth } from "@/hooks/useAuth";
import { CreditsBadge } from "@/components/CreditsBadge";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const tabs = [
  { id: "script", label: "Script", icon: FileText },
  { id: "thumbnail", label: "Thumbnail", icon: Image },
  { id: "chat", label: "Strategist", icon: Bot },
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "titles", label: "Titles", icon: Type },
] as const;

type TabId = (typeof tabs)[number]["id"];

const stats = [
  { label: "Scripts Generated", value: "10K+", icon: FileText },
  { label: "Active Creators", value: "2.5K+", icon: Star },
  { label: "AI Models", value: "5+", icon: Zap },
];

function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative py-24 md:py-32 flex flex-col items-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-heading uppercase tracking-[0.25em] border border-primary/30 bg-primary/10 text-primary backdrop-blur-xl shadow-[0_0_30px_-8px_hsla(265,90%,65%,0.5)]">
          <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--neon-purple))]" />
          AI Content Lab
        </span>
      </motion.div>

      {/* Main heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="font-heading font-semibold text-5xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight max-w-4xl"
      >
        <span className="block text-foreground">Create YouTube</span>
        <span className="block mt-1"><span className="gradient-text">magic</span> <span className="text-foreground">with</span> <span className="gradient-text-pink">AI</span></span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed"
      >
        Scripts, thumbnails, titles and ideas — generated in seconds. A quiet toolkit for loud creators.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-10 flex flex-col sm:flex-row gap-3"
      >
        <motion.button
          onClick={onGetStarted}
          className="btn-neon group inline-flex items-center gap-2 text-sm px-7 py-3.5 rounded-full"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          Start creating
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </motion.button>
        <motion.button
          onClick={onGetStarted}
          className="px-7 py-3.5 rounded-full text-sm font-heading font-medium border border-border/60 text-foreground bg-background/30 backdrop-blur-xl hover:border-primary/40 hover:bg-background/50 transition shadow-[0_8px_30px_-12px_hsla(0,0%,0%,0.4)]"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          Explore tools
        </motion.button>
      </motion.div>

      {/* Stats — minimal inline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-16 flex items-center gap-8 text-xs text-muted-foreground"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-2">
            <span className="font-heading font-medium text-foreground tabular-nums">{stat.value}</span>
            <span className="opacity-70">{stat.label}</span>
          </div>
        ))}
      </motion.div>

      {/* glowing rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10">
        {[400, 600, 820].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border"
            style={{
              width: size, height: size, left: -size/2, top: -size/2,
              borderColor: `hsla(265, 90%, 65%, ${0.18 - i*0.05})`,
              boxShadow: i === 0 ? "0 0 80px -10px hsla(265,90%,65%,0.25)" : undefined,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 50 + i*20, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>
    </section>
  );
}

function FeatureCards({ onSelect }: { onSelect: (id: TabId) => void }) {
  const features = [
    { id: "script" as TabId, icon: FileText, title: "Script", desc: "Long-form scripts in seconds.", num: "01" },
    { id: "thumbnail" as TabId, icon: Image, title: "Thumbnail", desc: "High-CTR cover images.", num: "02" },
    { id: "chat" as TabId, icon: Bot, title: "Strategist", desc: "On-demand growth advice.", num: "03" },
    { id: "trending" as TabId, icon: TrendingUp, title: "Trending", desc: "Ideas that ride the wave.", num: "04" },
    { id: "titles" as TabId, icon: Type, title: "Titles", desc: "Headlines that get clicks.", num: "05" },
  ];

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 text-center"
      >
        <p className="text-[10px] font-heading uppercase tracking-[0.25em] text-primary/80 mb-3">Toolkit</p>
        <h2 className="font-heading font-semibold text-3xl sm:text-4xl tracking-tight text-foreground">
          Five tools. <span className="gradient-text">One workflow.</span>
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => {
          const Icon = f.icon;
          const palette = [
            { a: "var(--neon-purple)", b: "var(--neon-pink)" },
            { a: "var(--neon-pink)", b: "var(--neon-purple)" },
            { a: "var(--neon-cyan)", b: "var(--neon-green)" },
            { a: "var(--neon-green)", b: "var(--neon-cyan)" },
            { a: "var(--neon-purple)", b: "var(--neon-cyan)" },
          ][i % 5];
          return (
            <motion.button
              key={f.id}
              onClick={() => onSelect(f.id)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="neon-tile group"
              style={{ ["--tile-accent" as any]: palette.a, ["--tile-accent-2" as any]: palette.b }}
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle at 30% 25%, hsla(0,0%,100%,0.35), transparent 45%), linear-gradient(140deg, hsl(${palette.a}), hsl(${palette.b}))`,
                    boxShadow: `0 8px 24px -8px hsla(${palette.a} / 0.6), inset 0 1px 0 hsla(0,0%,100%,0.35)`,
                  }}
                >
                  <Icon className="h-5 w-5 text-white drop-shadow" strokeWidth={2} />
                </div>
                <span className="text-[10px] font-heading tracking-[0.2em] text-muted-foreground/60">{f.num}</span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-1.5 tracking-tight">{f.title}</h3>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">{f.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ArrowRight className="h-3 w-3" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabId | null>(null);
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const handleSelectTool = (id: TabId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (profile && profile.credits <= 0) {
      toast.error("Out of credits! Upgrade to keep creating.", {
        action: { label: "Upgrade", onClick: () => navigate("/pricing") },
      });
      return;
    }
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen relative">
      <FloatingBubbles />
      {!activeTab && <RobotBot />}

      {/* Mesh gradient overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: [
            "radial-gradient(ellipse 80% 50% at 50% -10%, hsla(265,90%,65%,0.15) 0%, transparent 60%)",
            "radial-gradient(ellipse 60% 50% at 90% 80%, hsla(190,95%,50%,0.1) 0%, transparent 50%)",
            "radial-gradient(ellipse 50% 40% at 5% 50%, hsla(330,85%,60%,0.08) 0%, transparent 50%)",
            "radial-gradient(ellipse 40% 30% at 50% 100%, hsla(145,80%,50%,0.06) 0%, transparent 50%)",
          ].join(", "),
        }}
      />

      {/* Header */}
      <header className="border-b border-border/20 backdrop-blur-2xl sticky top-0 z-50 bg-background/40 shadow-[0_8px_40px_-20px_hsla(265,90%,65%,0.3)]">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.button
            onClick={() => setActiveTab(null)}
            className="flex items-center gap-2.5 group"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="h-8 w-8 rounded-xl flex items-center justify-center bg-primary/15 border border-primary/30 backdrop-blur-xl"
              animate={{ boxShadow: [
                "0 0 15px hsla(265,90%,65%,0.2)",
                "0 0 30px hsla(265,90%,65%,0.45)",
                "0 0 15px hsla(265,90%,65%,0.2)",
              ]}}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Youtube className="h-4 w-4 text-primary" />
            </motion.div>
            <span className="font-heading font-semibold text-sm tracking-tight gradient-text hidden sm:inline">
              AI Content Lab
            </span>
          </motion.button>

          <div className="flex items-center gap-4">
            {activeTab && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setActiveTab(null)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-heading"
              >
                ← Back to Home
              </motion.button>
            )}
            <ThemeToggle />
            <motion.button
              onClick={() => navigate("/pricing")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-semibold border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all"
            >
              <Crown className="h-3 w-3" />
              Pricing
            </motion.button>
            {user && <CreditsBadge />}
            {user && (
              <motion.button
                onClick={() => navigate("/dashboard")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-semibold border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
              >
                <LayoutDashboard className="h-3 w-3" />
                <span className="hidden sm:inline">Dashboard</span>
              </motion.button>
            )}
            {user ? (
              <motion.button
                onClick={signOut}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-semibold border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                title={user.email ?? ""}
              >
                <LogOut className="h-3 w-3" />
                <span className="hidden sm:inline">Sign out</span>
              </motion.button>
            ) : (
              <motion.button
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-semibold bg-gradient-to-r from-[hsl(0,85%,55%)] to-[hsl(330,85%,60%)] text-white shadow-lg"
              >
                <LogIn className="h-3 w-3" />
                Sign in
              </motion.button>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-neon-green"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[10px] font-semibold text-neon-green uppercase tracking-wider">Live</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {!activeTab ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <HeroSection onGetStarted={() => handleSelectTool("script")} />
              <FeatureCards onSelect={handleSelectTool} />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="container max-w-5xl mx-auto px-4 py-8"
            >
              {/* Tool tabs */}
              <nav className="flex gap-2 overflow-x-auto pb-6 mb-6 scrollbar-none">
                {tabs.map((tab, i) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-heading font-medium whitespace-nowrap transition-all duration-300 border ${
                        isActive
                          ? "border-primary/30 text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20"
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 rounded-2xl bg-muted/40 border border-border/60"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      <Icon className="h-3.5 w-3.5 relative z-10" strokeWidth={1.5} />
                      <span className="hidden sm:inline relative z-10">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </nav>

              {/* Tool content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  {activeTab === "script" && <ScriptGenerator />}
                  {activeTab === "thumbnail" && <ThumbnailGenerator />}
                  {activeTab === "chat" && <AIChatbot />}
                  {activeTab === "trending" && <TrendingIdeas />}
                  {activeTab === "titles" && <TitleGenerator />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/10 py-10 mt-16 relative z-10">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <Youtube className="h-4 w-4 text-primary" />
            <span className="font-heading font-semibold text-sm gradient-text">AI Content Lab</span>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Built with ❤️ & AI · {new Date().getFullYear()}
          </p>
          <div className="flex gap-1.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full"
                style={{
                  backgroundColor: [
                    "hsl(var(--neon-purple))",
                    "hsl(var(--neon-cyan))",
                    "hsl(var(--neon-pink))",
                    "hsl(var(--neon-green))",
                    "hsl(var(--neon-purple))",
                  ][i],
                }}
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
