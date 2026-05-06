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
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-heading uppercase tracking-[0.25em] border border-border/50 bg-background/40 text-muted-foreground backdrop-blur-md">
          <span className="w-1 h-1 rounded-full bg-primary" />
          AI Content Lab
        </span>
      </motion.div>

      {/* Main heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="font-heading font-medium text-5xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight max-w-4xl"
      >
        <span className="block text-foreground">Create YouTube,</span>
        <span className="block mt-1 text-muted-foreground/80 italic font-light">effortlessly.</span>
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
          className="group inline-flex items-center gap-2 text-sm font-heading font-medium px-6 py-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
        >
          Start creating
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </motion.button>
        <motion.button
          onClick={onGetStarted}
          className="px-6 py-3 rounded-full text-sm font-heading font-medium border border-border/60 text-foreground hover:bg-muted/30 transition"
          whileHover={{ y: -1 }}
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

      {/* single subtle ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border border-border/20" />
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
    <section className="py-20 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 flex items-end justify-between"
      >
        <div>
          <p className="text-[10px] font-heading uppercase tracking-[0.25em] text-muted-foreground/70 mb-2">Toolkit</p>
          <h2 className="font-heading font-medium text-3xl sm:text-4xl tracking-tight text-foreground">
            Five tools. One workflow.
          </h2>
        </div>
      </motion.div>

      <div className="border-t border-border/40">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.button
              key={f.id}
              onClick={() => onSelect(f.id)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group w-full flex items-center gap-6 py-6 border-b border-border/40 text-left hover:bg-muted/10 transition-colors px-2"
            >
              <span className="text-[10px] font-heading tracking-[0.2em] text-muted-foreground/60 w-8">{f.num}</span>
              <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" strokeWidth={1.5} />
              <h3 className="font-heading font-medium text-lg sm:text-xl text-foreground tracking-tight w-44">{f.title}</h3>
              <p className="text-sm text-muted-foreground/80 hidden sm:block flex-1">{f.desc}</p>
              <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
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
      <header className="border-b border-border/30 backdrop-blur-2xl sticky top-0 z-50 bg-background/60">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.button
            onClick={() => setActiveTab(null)}
            className="flex items-center gap-2.5 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="h-7 w-7 rounded-md border border-border/60 flex items-center justify-center bg-background/50">
              <Youtube className="h-3.5 w-3.5 text-foreground" strokeWidth={1.5} />
            </div>
            <span className="font-heading font-medium text-sm tracking-tight text-foreground hidden sm:inline">
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
