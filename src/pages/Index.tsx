import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Image, Bot, TrendingUp, Type, Youtube,
  Sparkles, Zap, Wand2, ArrowRight, Star, LogIn, LogOut, LayoutDashboard, Crown,
} from "lucide-react";
import { ScriptGenerator } from "@/components/ScriptGenerator";
import { ThumbnailGenerator } from "@/components/ThumbnailGenerator";
import { AIChatbot } from "@/components/AIChatbot";
import { TrendingIdeas } from "@/components/TrendingIdeas";
import { TitleGenerator } from "@/components/TitleGenerator";
import { FloatingBubbles } from "@/components/FloatingBubbles";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { CreditsBadge } from "@/components/CreditsBadge";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const tabs = [
  { id: "script", label: "Script Generator", icon: FileText, emoji: "🎬" },
  { id: "thumbnail", label: "Thumbnails", icon: Image, emoji: "🎨" },
  { id: "chat", label: "AI Strategist", icon: Bot, emoji: "🤖" },
  { id: "trending", label: "Trending Ideas", icon: TrendingUp, emoji: "🔥" },
  { id: "titles", label: "Title Generator", icon: Type, emoji: "✨" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const stats = [
  { label: "Scripts Generated", value: "10K+", icon: FileText },
  { label: "Active Creators", value: "2.5K+", icon: Star },
  { label: "AI Models", value: "5+", icon: Zap },
];

function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative py-16 md:py-24 flex flex-col items-center text-center px-4">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-heading font-semibold border border-primary/30 bg-primary/10 text-primary">
          <Sparkles className="h-3 w-3" />
          Powered by Advanced AI
          <Sparkles className="h-3 w-3" />
        </span>
      </motion.div>

      {/* Main heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="font-heading font-bold text-4xl sm:text-5xl md:text-7xl leading-tight max-w-4xl"
      >
        <span className="block text-foreground">Create YouTube</span>
        <span className="block mt-2">
          <span className="gradient-text">Magic</span>
          {" "}
          <span className="text-foreground">with</span>
          {" "}
          <span className="gradient-text-pink">AI</span>
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-muted-foreground text-base sm:text-lg max-w-2xl leading-relaxed"
      >
        Generate viral scripts, eye-catching thumbnails, and winning content strategies
        — all powered by cutting-edge AI. Your secret weapon for YouTube growth.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-10 flex flex-col sm:flex-row gap-4"
      >
        <motion.button
          onClick={onGetStarted}
          className="btn-neon group flex items-center gap-2 text-base px-8 py-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Wand2 className="h-5 w-5" />
          Start Creating
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </motion.button>
        <motion.button
          onClick={onGetStarted}
          className="px-8 py-4 rounded-lg text-base font-heading font-semibold border border-border/50 text-foreground bg-muted/20 backdrop-blur-sm hover:bg-muted/40 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Tools
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-16 grid grid-cols-3 gap-6 sm:gap-12"
      >
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex flex-col items-center gap-1">
            <motion.span
              className="font-heading font-bold text-2xl sm:text-3xl gradient-text"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + i * 0.15, type: "spring" }}
            >
              {stat.value}
            </motion.span>
            <span className="text-xs sm:text-sm text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Decorative rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {[300, 500, 700].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border border-primary/5"
            style={{
              width: size,
              height: size,
              left: -size / 2,
              top: -size / 2,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 40 + i * 20, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>
    </section>
  );
}

function FeatureCards({ onSelect }: { onSelect: (id: TabId) => void }) {
  const features = [
    {
      id: "script" as TabId,
      icon: FileText,
      title: "Script Generator",
      desc: "Generate complete, engaging YouTube scripts in seconds with AI.",
      gradient: "from-primary to-accent",
      glowClass: "neon-glow-purple",
    },
    {
      id: "thumbnail" as TabId,
      icon: Image,
      title: "Thumbnail Creator",
      desc: "Design stunning thumbnails that boost your click-through rate.",
      gradient: "from-accent to-primary",
      glowClass: "neon-glow-pink",
    },
    {
      id: "chat" as TabId,
      icon: Bot,
      title: "AI Strategist",
      desc: "Chat with AI for personalized growth & content strategies.",
      gradient: "from-secondary to-neon-green",
      glowClass: "neon-glow-cyan",
    },
    {
      id: "trending" as TabId,
      icon: TrendingUp,
      title: "Trending Ideas",
      desc: "Discover what's trending and never run out of content ideas.",
      gradient: "from-neon-green to-secondary",
      glowClass: "neon-glow-cyan",
    },
    {
      id: "titles" as TabId,
      icon: Type,
      title: "Title Generator",
      desc: "Craft click-worthy titles that rank and attract viewers.",
      gradient: "from-primary to-secondary",
      glowClass: "neon-glow-purple",
    },
  ];

  return (
    <section className="py-12 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-foreground">
          Powerful <span className="gradient-text">AI Tools</span> at Your Fingertips
        </h2>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto text-sm">
          Everything you need to create viral YouTube content — all in one place.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.button
              key={f.id}
              onClick={() => onSelect(f.id)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`glass-card-hover p-6 text-left group cursor-pointer`}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 group-hover:${f.glowClass} transition-shadow`}>
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Try it now <ArrowRight className="h-3 w-3" />
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
      <header className="border-b border-border/10 backdrop-blur-2xl sticky top-0 z-50 bg-background/30">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.button
            onClick={() => setActiveTab(null)}
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="p-2 rounded-xl bg-primary/15 border border-primary/20"
              animate={{
                boxShadow: [
                  "0 0 15px hsla(265,90%,65%,0.15)",
                  "0 0 30px hsla(265,90%,65%,0.3)",
                  "0 0 15px hsla(265,90%,65%,0.15)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Youtube className="h-5 w-5 text-primary" />
            </motion.div>
            <span className="font-heading font-bold text-base gradient-text hidden sm:inline">
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
                          className="absolute inset-0 rounded-2xl neon-glow-purple"
                          style={{
                            background: "linear-gradient(135deg, hsla(265,90%,65%,0.12), hsla(190,95%,50%,0.06))",
                          }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      <span className="relative z-10">{tab.emoji}</span>
                      <Icon className="h-4 w-4 relative z-10" />
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
