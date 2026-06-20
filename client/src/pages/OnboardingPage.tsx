/**
 * OnboardingPage — Clarity Design System
 * Multi-step onboarding: org setup → data source connection → review
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Database, Cloud, Users, BarChart2, Package, Mail, GitBranch, MessageSquare, DollarSign, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { dataSources } from "@/lib/data";

const STEPS = [
  { id: 1, label: "Organization" },
  { id: 2, label: "Connect Sources" },
  { id: 3, label: "Review" },
];

const iconMap: Record<string, React.ElementType> = {
  cloud: Cloud,
  layers: Layers,
  users: Users,
  "dollar-sign": DollarSign,
  "bar-chart-2": BarChart2,
  database: Database,
  mail: Mail,
  "git-branch": GitBranch,
  "message-square": MessageSquare,
  package: Package,
};

export default function OnboardingPage() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState("");
  const [industry, setIndustry] = useState("");
  const [selected, setSelected] = useState<string[]>(["ds1", "ds2", "ds3", "ds4", "ds5", "ds6"]);

  const toggleSource = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <img
            src="/manus-storage/lumatrace-official-light.png"
            alt="Luma Trace"
            className="h-8 object-contain"
          />

        </div>
        <button
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => navigate("/dashboard")}
        >
          Skip setup →
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-12">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
                  style={{
                    background: step > s.id ? "oklch(0.42 0.12 195)" : step === s.id ? "oklch(0.42 0.12 195)" : "oklch(0.92 0.004 240)",
                    color: step >= s.id ? "white" : "oklch(0.55 0.015 240)",
                  }}
                >
                  {step > s.id ? <Check size={14} /> : s.id}
                </div>
                <span className="text-xs mt-1.5 font-medium" style={{ color: step >= s.id ? "oklch(0.42 0.12 195)" : "oklch(0.60 0.01 240)" }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="w-24 h-0.5 mx-2 mb-5 transition-all duration-500"
                  style={{ background: step > s.id ? "oklch(0.42 0.12 195)" : "oklch(0.88 0.005 240)" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Set up your organization</h2>
                <p className="text-muted-foreground mb-8">This helps Luma Trace contextualize your data and benchmarks.</p>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <Label>Organization name</Label>
                    <Input
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="Acme Consulting Group"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Industry</Label>
                    <Input
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="Management Consulting"
                      className="h-10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Company size</Label>
                      <Input placeholder="50–200 employees" className="h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Annual revenue range</Label>
                      <Input placeholder="$10M–$50M" className="h-10" />
                    </div>
                  </div>
                </div>

                <Button
                  className="mt-8 gap-2"
                  style={{ background: "oklch(0.42 0.12 195)", color: "white" }}
                  onClick={() => setStep(2)}
                >
                  Continue <ChevronRight size={15} />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Connect your data sources</h2>
                <p className="text-muted-foreground mb-6">Select the systems you want Luma Trace to analyze. You can add more later.</p>

                <div className="grid grid-cols-2 gap-3">
                  {dataSources.map((source) => {
                    const Icon = iconMap[source.icon] ?? Database;
                    const isSelected = selected.includes(source.id);
                    return (
                      <motion.div
                        key={source.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => toggleSource(source.id)}
                        className="p-4 rounded-lg border cursor-pointer transition-all"
                        style={{
                          borderColor: isSelected ? "oklch(0.42 0.12 195)" : "oklch(0.90 0.005 240)",
                          background: isSelected ? "oklch(0.94 0.06 195)" : "white",
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center"
                            style={{ background: isSelected ? "oklch(0.42 0.12 195)" : "oklch(0.94 0.005 240)" }}
                          >
                            <Icon size={15} style={{ color: isSelected ? "white" : "oklch(0.50 0.01 240)" }} />
                          </div>
                          {isSelected && (
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ background: "oklch(0.42 0.12 195)" }}
                            >
                              <Check size={11} color="white" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{source.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{source.description}</p>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex gap-3 mt-8">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button
                    className="gap-2"
                    style={{ background: "oklch(0.42 0.12 195)", color: "white" }}
                    onClick={() => setStep(3)}
                    disabled={selected.length === 0}
                  >
                    Continue with {selected.length} source{selected.length !== 1 ? "s" : ""} <ChevronRight size={15} />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>You're ready to go</h2>
                <p className="text-muted-foreground mb-8">Luma Trace will begin analyzing your data. Initial insights are ready in minutes.</p>

                <div className="rounded-xl border border-border p-6 bg-card space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Organization</span>
                    <span className="text-sm text-muted-foreground">{orgName || "Acme Consulting Group"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Data sources connected</span>
                    <Badge style={{ background: "oklch(0.94 0.06 195)", color: "oklch(0.30 0.10 195)" }}>
                      {selected.length} sources
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Initial analysis</span>
                    <span className="text-sm" style={{ color: "oklch(0.62 0.14 155)" }}>Ready in ~3 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Auto-sync frequency</span>
                    <span className="text-sm text-muted-foreground">Every 15 minutes</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button
                    className="gap-2"
                    style={{ background: "oklch(0.42 0.12 195)", color: "white" }}
                    onClick={handleFinish}
                  >
                    Launch Dashboard <ChevronRight size={15} />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
