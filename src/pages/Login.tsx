import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, ArrowRight, Youtube, Sparkles, Loader2, KeyRound, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { FloatingBubbles } from "@/components/FloatingBubbles";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type Channel = "email" | "phone";
type Step = "identifier" | "otp";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{6,14}$/, "Use international format e.g. +14155550123");

export default function Login() {
  const [channel, setChannel] = useState<Channel>("email");
  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = identifier.trim();
    const parsed =
      channel === "email" ? emailSchema.safeParse(value) : phoneSchema.safeParse(value);
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
      channel === "email"
        ? await supabase.auth.signInWithOtp({
            email: parsed.data,
            options: { emailRedirectTo: window.location.origin, shouldCreateUser: true },
          })
        : await supabase.auth.signInWithOtp({
            phone: parsed.data,
            options: { shouldCreateUser: true },
          });
    setLoading(false);
    if (error) {
      toast({ title: "Couldn't send code", description: error.message, variant: "destructive" });
      return;
    }
    setStep("otp");
    toast({
      title: "Code sent ✨",
      description:
        channel === "email"
          ? `Check ${parsed.data} for your 6-digit code`
          : `We texted a code to ${parsed.data}`,
    });
  };

  const verifyOtp = async (code: string) => {
    setLoading(true);
    const { error } =
      channel === "email"
        ? await supabase.auth.verifyOtp({
            email: identifier.trim(),
            token: code,
            type: "email",
          })
        : await supabase.auth.verifyOtp({
            phone: identifier.trim(),
            token: code,
            type: "sms",
          });
    setLoading(false);
    if (error) {
      toast({ title: "Invalid code", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Welcome! 🎬", description: "Logging you in..." });
    navigate("/", { replace: true });
  };

  const onOtpChange = (val: string) => {
    setOtp(val);
    if (val.length === 6) verifyOtp(val);
  };

  const resend = async () => {
    setOtp("");
    await sendOtp({ preventDefault: () => {} } as React.FormEvent);
  };

  const googleSignIn = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setLoading(false);
      toast({
        title: "Google sign-in failed",
        description: String(result.error.message ?? result.error),
        variant: "destructive",
      });
      return;
    }
    if (result.redirected) return;
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
              animate={{
                boxShadow: [
                  "0 0 20px hsla(0,85%,60%,0.3)",
                  "0 0 40px hsla(0,85%,60%,0.6)",
                  "0 0 20px hsla(0,85%,60%,0.3)",
                ],
              }}
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
              {step === "identifier"
                ? "Sign in with a one-time code"
                : "Enter the 6-digit code we sent you"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "identifier" ? (
              <motion.div
                key="identifier"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div className="flex bg-card/30 border border-border/50 rounded-lg p-1 mb-5">
                  {(["email", "phone"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setChannel(c);
                        setIdentifier("");
                      }}
                      className={`flex-1 py-2 text-sm font-heading font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
                        channel === c
                          ? "bg-gradient-to-r from-[hsl(0,85%,55%)] to-[hsl(330,85%,60%)] text-white shadow-lg"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {c === "email" ? <Mail className="h-3.5 w-3.5" /> : <Phone className="h-3.5 w-3.5" />}
                      {c === "email" ? "Email" : "Phone"}
                    </button>
                  ))}
                </div>

                <form onSubmit={sendOtp} className="space-y-4">
                  <div className="relative">
                    {channel === "email" ? (
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    )}
                    <input
                      type={channel === "email" ? "email" : "tel"}
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={channel === "email" ? "you@youtube.com" : "+14155550123"}
                      className="input-glass pl-10"
                      autoFocus
                    />
                  </div>
                  {channel === "phone" && (
                    <p className="text-[11px] text-muted-foreground -mt-2 px-1">
                      Use international format with country code (e.g. +91, +1).
                    </p>
                  )}
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
                        Send code
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
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <KeyRound className="h-4 w-4" />
                  <span className="truncate max-w-[220px]">{identifier}</span>
                </div>

                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={onOtpChange}
                    disabled={loading}
                    autoFocus
                  >
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="h-12 w-11 text-lg font-heading"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  Code delivered{" "}
                  <span className="gradient-text font-heading font-semibold">
                    by Madhav Singla
                  </span>
                </p>

                {loading && (
                  <div className="flex justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("identifier");
                      setOtp("");
                    }}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Change {channel}
                  </button>
                  <button
                    type="button"
                    onClick={resend}
                    disabled={loading}
                    className="text-[hsl(0,85%,65%)] hover:text-[hsl(0,85%,75%)] font-heading font-medium disabled:opacity-50"
                  >
                    Resend code
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-[10px] text-center text-muted-foreground mt-8">
            By continuing, you agree to our magical AI terms ✨
          </p>
        </div>
      </motion.div>
    </div>
  );
}