import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Image, Bot, TrendingUp, Type, Youtube, Sparkles } from "lucide-react";
import { ScriptGenerator } from "@/components/ScriptGenerator";
import { ThumbnailGenerator } from "@/components/ThumbnailGenerator";
import { AIChatbot } from "@/components/AIChatbot";
import { TrendingIdeas } from "@/components/TrendingIdeas";
import { TitleGenerator } from "@/components/TitleGenerator";
import { FloatingBubbles } from "@/components/FloatingBubbles";

const tabs = [
  { id: "script", label: "Script Generator", icon: FileText, color: "neon-purple" },
  { id: "thumbnail", label: "Thumbnails", icon: Image, color: "neon-pink" },
  { id: "chat", label: "AI Strategist", icon: Bot, color: "neon-cyan" },
  { id: "trending", label: "Trending Ideas", icon: TrendingUp, color: "neon-green" },
  { id: "titles", label: "Title Generator", icon: Type, color: "neon-purple" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabId>("script");

  return (
    <div className="min-h-screen relative">
      <FloatingBubbles />

      {/* Mesh gradient overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, hsla(265,90%,65%,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, hsla(190,95%,50%,0.08) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 10% 60%, hsla(330,85%,60%,0.06) 0%, transparent 50%)",
        }}
      />

      {/* Header */}
      <header className="border-b border-border/20 backdrop-blur-2xl sticky top-0 z-50 bg-background/40">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2.5 rounded-2xl bg-primary/15 border border-primary/20"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 0 20px hsla(265,90%,65%,0.2)",
                  "0 0 40px hsla(265,90%,65%,0.4)",
                  "0 0 20px hsla(265,90%,65%,0.2)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Youtube className="h-6 w-6 text-primary" />
            </motion.div>
            <div>
              <h1 className="font-heading font-bold text-xl gradient-text flex items-center gap-2">
                AI YouTube Content Lab
                <Sparkles className="h-4 w-4 text-secondary" />
              </h1>
              <p className="text-xs text-muted-foreground">AI-powered content creation suite</p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20">
            <motion.div
              className="w-2 h-2 rounded-full bg-neon-green"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-medium text-neon-green">AI Online</span>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8 relative z-10">
        {/* Tab Navigation */}
        <nav className="flex gap-2 overflow-x-auto pb-6 mb-8 scrollbar-none">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-heading font-medium whitespace-nowrap transition-all duration-300 border ${
                  isActive
                    ? "border-primary/30 text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20"
                }`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 rounded-2xl neon-glow-purple"
                    style={{
                      background: "linear-gradient(135deg, hsla(265,90%,65%,0.15), hsla(190,95%,50%,0.08))",
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <Icon className="h-4 w-4 relative z-10" />
                <span className="hidden sm:inline relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {activeTab === "script" && <ScriptGenerator />}
            {activeTab === "thumbnail" && <ThumbnailGenerator />}
            {activeTab === "chat" && <AIChatbot />}
            {activeTab === "trending" && <TrendingIdeas />}
            {activeTab === "titles" && <TitleGenerator />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/10 py-8 mt-16 relative z-10">
        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-xs text-muted-foreground">
            AI YouTube Content Lab · Built with ❤️ · {new Date().getFullYear()}
          </p>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full bg-primary/40"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
