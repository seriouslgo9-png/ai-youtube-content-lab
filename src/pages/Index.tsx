import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Image, Bot, TrendingUp, Type, Youtube } from "lucide-react";
import { ScriptGenerator } from "@/components/ScriptGenerator";
import { ThumbnailGenerator } from "@/components/ThumbnailGenerator";
import { AIChatbot } from "@/components/AIChatbot";
import { TrendingIdeas } from "@/components/TrendingIdeas";
import { TitleGenerator } from "@/components/TitleGenerator";

const tabs = [
  { id: "script", label: "Script Generator", icon: FileText },
  { id: "thumbnail", label: "Thumbnails", icon: Image },
  { id: "chat", label: "AI Strategist", icon: Bot },
  { id: "trending", label: "Trending Ideas", icon: TrendingUp },
  { id: "titles", label: "Title Generator", icon: Type },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabId>("script");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/30 backdrop-blur-xl sticky top-0 z-50 bg-background/60">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="p-2 rounded-xl neon-glow-purple bg-primary/20">
            <Youtube className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg gradient-text">AI YouTube Content Lab</h1>
            <p className="text-xs text-muted-foreground">Your AI-powered content creation suite</p>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <nav className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-heading font-medium whitespace-nowrap transition-all duration-300 border ${
                  isActive
                    ? "tab-active border-primary/40 text-foreground neon-glow-purple"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
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
      <footer className="border-t border-border/20 py-6 mt-12">
        <p className="text-center text-xs text-muted-foreground">
          AI YouTube Content Lab · Built with ❤️ · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
