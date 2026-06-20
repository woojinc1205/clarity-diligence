/**
 * LoginPage — Clarity Design System
 * Split layout: left = hero with brand visual, right = login form
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Shield, BarChart2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("alex@acmeconsulting.com");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1200);
  };

  const handleDemo = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Brand Hero */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-12"
        style={{ background: "oklch(0.22 0.06 195)" }}
      >
        {/* Background visual */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(/manus-storage/clarity-hero-bg_de24f9b2.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.22 0.06 195 / 0.9) 0%, oklch(0.28 0.08 195 / 0.7) 100%)" }} />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 flex items-center gap-3"
        >
          <img
            src="/manus-storage/clarity-logo-mark_f49e8b7e.png"
            alt="Clarity"
            className="w-10 h-10 object-contain"
          />
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ color: "oklch(0.95 0.02 195)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Clarity
          </span>
        </motion.div>

        {/* Hero copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative z-10"
        >
          <h1
            className="text-4xl font-bold leading-tight mb-4"
            style={{ color: "oklch(0.97 0.01 195)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Where is your organization leaving value on the table?
          </h1>
          <p className="text-lg leading-relaxed mb-10" style={{ color: "oklch(0.75 0.04 195)" }}>
            Connect your business systems. Map your end-to-end processes. Identify the opportunities that move the needle.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3">
            {[
              { icon: BarChart2, text: "Full organizational transparency in one view" },
              { icon: Zap, text: "AI-powered opportunity identification" },
              { icon: Shield, text: "Baseline → Goal → Impact reporting" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.42 0.12 195)" }}
                >
                  <item.icon size={15} style={{ color: "oklch(0.90 0.04 195)" }} />
                </div>
                <span className="text-sm" style={{ color: "oklch(0.80 0.03 195)" }}>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom stat strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 flex gap-8"
        >
          {[
            { value: "$1.2M", label: "Avg. identified savings" },
            { value: "6 wks", label: "Time to first insight" },
            { value: "94%", label: "Client satisfaction" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-2xl font-bold" style={{ color: "oklch(0.72 0.16 75)", fontFamily: "'JetBrains Mono', monospace" }}>{stat.value}</p>
              <p className="text-xs" style={{ color: "oklch(0.62 0.04 195)" }}>{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <img
              src="/manus-storage/clarity-logo-mark_f49e8b7e.png"
              alt="Clarity"
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Clarity</span>
          </div>

          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Sign in to your workspace</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Don't have an account?{" "}
            <a href="#" className="font-medium" style={{ color: "oklch(0.42 0.12 195)" }} onClick={(e) => { e.preventDefault(); }}>
              Request access
            </a>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Work email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="h-10"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" defaultChecked />
              <Label htmlFor="remember" className="text-sm text-muted-foreground font-normal cursor-pointer">
                Keep me signed in for 30 days
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-10 font-semibold gap-2"
              style={{ background: "oklch(0.42 0.12 195)", color: "white" }}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <>Sign in <ArrowRight size={15} /></>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">or</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-10 gap-2 font-medium"
            onClick={handleDemo}
            disabled={loading}
          >
            Explore with demo data
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-8">
            By signing in, you agree to Clarity's{" "}
            <a href="#" className="underline underline-offset-2">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-2">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
