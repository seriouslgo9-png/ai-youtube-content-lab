import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Youtube, Sparkles, Loader2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { FloatingBubbles } from "@/components/FloatingBubbles";
import { useToast } from "@/hooks/use-toast";

const authSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

export default function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = authSchema.safeParse({ email: email.trim(), password });
    if (!parsed.success) {
      toast({
        title: "Check your input",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } =
      mode === "signup"
        ? await supabase.auth.signUp({
            email: parsed.data.email,
            password: parsed.data.password,
            options: { emailRedirectTo: window.location.origin },
          })
        : await supabase.auth.signInWithPassword({
            email: parsed.data.email,
            password: parsed.data.password,
          });
    setLoading(false);
    if (error) {
      toast({
        title: mode === "signup" ? "Couldn't sign up" : "Couldn't sign in",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: mode === "signup" ? "Account created! 🎬" : "Welcome back! 🎬",
      description: "Logging you in...",
    });
    navigate("/", { replace: true });
  };

  const googleSignIn = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setLoading(false);
      toast({ title: "Google sign-in failed", description: String(result.error.message ?? result.error), variant: "destructive" });
      return;
    }
    if (result.redirected) return; // browser will redirect
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <FloatingBubbles />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, hsla(0,85%,60%,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 100%, hsla(265,90%,65%,0.15) 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-8 sm:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              animate={{ boxShadow: ["0 0 20px hsla(0,85%,60%,0.3)", "0 0 40px hsla(0,85%,60%,0.6)", "0 0 20px hsla(0,85%,60%,0.3)"] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="p-4 rounded-2xl bg-gradient-to-br from-[hsl(0,85%,55%)] to-[hsl(330,85%,60%)] mb-4"
            >
              <Youtube className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="font-heading font-bold text-3xl">
              <span className="gradient-text">AI Content Lab</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-2 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              Sign in to unlock your creator toolkit
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="flex bg-card/30 border border-border/50 rounded-lg p-1 mb-5">
                {(["signin", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 text-sm font-heading font-medium rounded-md transition-all ${
                      mode === m
                        ? "bg-gradient-to-r from-[hsl(0,85%,55%)] to-[hsl(330,85%,60%)] text-white shadow-lg"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m === "signin" ? "Sign in" : "Sign up"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@youtube.com"
                    className="input-glass pl-10"
                    autoFocus
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "signup" ? "Create a password (6+ chars)" : "Your password"}
                    className="input-glass pl-10"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-neon w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {mode === "signup" ? "Create account" : "Sign in"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              <motion.button
                onClick={googleSignIn}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/70 transition-all disabled:opacity-50 font-heading font-medium text-sm"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </motion.button>
            </motion.div>
          </AnimatePresence>

          <p className="text-[10px] text-center text-muted-foreground mt-8">
            By continuing, you agree to our magical AI terms ✨
          </p>
        </div>
      </motion.div>
    </div>
  );
}