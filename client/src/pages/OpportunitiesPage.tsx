/**
 * OpportunitiesPage — VantageIQ Design System
 * Opportunity landscape with impact/effort matrix, goal-setting levers,
 * and baseline vs. target comparison
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, TrendingUp, Zap, RefreshCw, Layers, Scissors, Settings2,
  ArrowRight, ChevronDown, ChevronUp, Info, CheckCircle2, Clock
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { opportunities, goalLevers, type Opportunity, type GoalLever } from "@/lib/data";
import { Link } from "wouter";

const typeIcons: Record<string, React.ElementType> = {
  automation: Zap,
  redesign: RefreshCw,
  consolidation: Layers,
  elimination: Scissors,
  optimization: Settings2,
};

const impactColors = {
  high: { bg: "oklch(0.95 0.06 15)", text: "oklch(0.50 0.18 15)", border: "oklch(0.60 0.20 15)" },
  medium: { bg: "oklch(0.94 0.07 75)", text: "oklch(0.45 0.15 75)", border: "oklch(0.72 0.16 75)" },
  low: { bg: "oklch(0.92 0.06 155)", text: "oklch(0.42 0.14 155)", border: "oklch(0.62 0.14 155)" },
};

const effortColors = {
  high: "oklch(0.60 0.20 15)",
  medium: "oklch(0.72 0.16 75)",
  low: "oklch(0.62 0.14 155)",
};

function OpportunityCard({ opp, index, onClick }: { opp: Opportunity; index: number; onClick: () => void }) {
  const Icon = typeIcons[opp.type] ?? Target;
  const impact = impactColors[opp.impact];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px oklch(0 0 0 / 0.08)" }}
      onClick={onClick}
      className="bg-card rounded-lg border border-border cursor-pointer overflow-hidden"
      style={{ borderLeftWidth: "3px", borderLeftColor: impact.border }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(0.94 0.07 75 / 0.4)" }}
          >
            <Icon size={17} style={{ color: "oklch(0.55 0.15 75)" }} />
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: impact.bg, color: impact.text }}
            >
              {opp.impact.toUpperCase()} IMPACT
            </span>
          </div>
        </div>

        <h3 className="text-sm font-semibold mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{opp.title}</h3>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-2">{opp.description}</p>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
          <div>
            <p className="section-label mb-0.5">Saving</p>
            <p className="text-sm font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.38 0.153 193.7)" }}>
              ${(opp.estimatedSaving / 1000).toFixed(0)}K/yr
            </p>
          </div>
          <div>
            <p className="section-label mb-0.5">Effort</p>
            <p className="text-sm font-semibold" style={{ color: effortColors[opp.effort] }}>
              {opp.effort.charAt(0).toUpperCase() + opp.effort.slice(1)}
            </p>
          </div>
          <div>
            <p className="section-label mb-0.5">Timeline</p>
            <p className="text-xs font-medium text-muted-foreground">{opp.estimatedTimeToValue}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LeverControl({ lever, index }: { lever: GoalLever; index: number }) {
  const [value, setValue] = useState(lever.currentValue);
  const progress = ((value - lever.baselineValue) / (lever.targetValue - lever.baselineValue)) * 100;
  const isImproving = lever.targetValue > lever.baselineValue ? value > lever.baselineValue : value < lever.baselineValue;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="p-4 rounded-lg border border-border bg-card"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{lever.name}</p>
          <p className="text-xs text-muted-foreground">{lever.description}</p>
        </div>
        <Badge variant="outline" className="text-xs">{lever.category}</Badge>
      </div>

      <div className="flex items-center justify-between mb-2 text-xs">
        <span className="text-muted-foreground">Baseline: <strong>{lever.baselineValue}{lever.unit}</strong></span>
        <span className="font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.38 0.153 193.7)" }}>
          {value}{lever.unit}
        </span>
        <span className="text-muted-foreground">Goal: <strong style={{ color: "oklch(0.72 0.16 75)" }}>{lever.targetValue}{lever.unit}</strong></span>
      </div>

      <Slider
        value={[value]}
        min={Math.min(lever.baselineValue, lever.targetValue) * 0.8}
        max={Math.max(lever.baselineValue, lever.targetValue) * 1.2}
        step={1}
        onValueChange={([v]) => setValue(v)}
        className="mb-3"
      />

      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: progress > 0 ? "oklch(0.62 0.14 155)" : "oklch(0.60 0.20 15)" }}
            animate={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs font-medium" style={{ color: progress > 0 ? "oklch(0.62 0.14 155)" : "oklch(0.60 0.20 15)" }}>
          {progress > 0 ? `+${Math.round(progress)}%` : `${Math.round(progress)}%`} to goal
        </span>
      </div>
    </motion.div>
  );
}

export default function OpportunitiesPage() {
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [activeTab, setActiveTab] = useState("opportunities");
  const [filterType, setFilterType] = useState("all");

  const totalSaving = opportunities.reduce((s, o) => s + o.estimatedSaving, 0);
  const highImpact = opportunities.filter(o => o.impact === "high").length;
  const quickWins = opportunities.filter(o => o.impact === "high" && o.effort === "low").length;

  const filteredOpps = filterType === "all"
    ? opportunities
    : opportunities.filter(o => o.type === filterType);

  const matrixData = opportunities.map(o => ({
    name: o.title.split(" ").slice(0, 3).join(" "),
    saving: o.estimatedSaving / 1000,
    impact: o.impact === "high" ? 3 : o.impact === "medium" ? 2 : 1,
    effort: o.effort === "high" ? 3 : o.effort === "medium" ? 2 : 1,
    fill: o.impact === "high" ? "oklch(0.60 0.20 15)" : o.impact === "medium" ? "oklch(0.72 0.16 75)" : "oklch(0.62 0.14 155)",
  }));

  return (
    <div className="p-6 space-y-6 page-enter">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Opportunity Analysis</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {opportunities.length} opportunities identified · ${(totalSaving / 1000000).toFixed(2)}M total estimated impact
          </p>
        </div>
        <Button className="gap-2" style={{ background: "oklch(0.38 0.153 193.7)", color: "white" }} asChild>
          <Link href="/report">
            <Target size={14} /> Generate Report
          </Link>
        </Button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Opportunities", value: opportunities.length.toString(), color: "oklch(0.38 0.153 193.7)" },
          { label: "High Impact", value: highImpact.toString(), color: "oklch(0.60 0.20 15)" },
          { label: "Quick Wins", value: quickWins.toString(), color: "oklch(0.62 0.14 155)" },
          { label: "Est. Annual Saving", value: `$${(totalSaving / 1000000).toFixed(2)}M`, color: "oklch(0.72 0.16 75)" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-lg border border-border p-4"
          >
            <p className="section-label mb-1">{stat.label}</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: stat.color }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="levers">Goal Levers</TabsTrigger>
          <TabsTrigger value="matrix">Impact Matrix</TabsTrigger>
        </TabsList>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="mt-4 space-y-4">
          {/* Type filter */}
          <div className="flex items-center gap-2">
            {["all", "automation", "redesign", "optimization", "consolidation", "elimination"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className="text-xs px-3 py-1.5 rounded-full border transition-all capitalize"
                style={{
                  background: filterType === type ? "oklch(0.38 0.153 193.7)" : "transparent",
                  color: filterType === type ? "white" : "oklch(0.50 0.01 240)",
                  borderColor: filterType === type ? "oklch(0.38 0.153 193.7)" : "oklch(0.88 0.005 240)",
                }}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filteredOpps.map((opp, i) => (
              <OpportunityCard key={opp.id} opp={opp} index={i} onClick={() => setSelectedOpp(opp)} />
            ))}
          </div>
        </TabsContent>

        {/* Goal Levers Tab */}
        <TabsContent value="levers" className="mt-4">
          <div className="mb-4 p-4 rounded-lg" style={{ background: "oklch(0.94 0.06 195 / 0.4)", borderLeft: "3px solid oklch(0.38 0.153 193.7)" }}>
            <div className="flex items-start gap-2">
              <Info size={14} style={{ color: "oklch(0.38 0.153 193.7)" }} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold" style={{ color: "oklch(0.28 0.153 193.7)" }}>How Goal Levers Work</p>
                <p className="text-xs mt-0.5" style={{ color: "oklch(0.38 0.153 193.7)" }}>
                  Adjust each lever to set your target goals. VantageIQ will calculate the projected impact on your organization and surface the specific opportunities that drive each lever toward your goal.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {goalLevers.map((lever, i) => (
              <LeverControl key={lever.id} lever={lever} index={i} />
            ))}
          </div>

          <div className="mt-6 p-5 rounded-lg border border-border bg-card">
            <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Projected Impact Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Revenue Growth Potential", value: "+18%", sub: "Based on conversion + retention levers" },
                { label: "Cost Reduction Potential", value: "-$1.2M", sub: "Annualized from automation + efficiency" },
                { label: "Time to Full Impact", value: "12 months", sub: "Assuming phased implementation" },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-xl font-bold mb-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.38 0.153 193.7)" }}>{item.value}</p>
                  <p className="text-xs font-medium mb-0.5">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full gap-2" style={{ background: "oklch(0.38 0.153 193.7)", color: "white" }} asChild>
              <Link href="/report">
                Generate Opportunity Report <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
        </TabsContent>

        {/* Impact Matrix Tab */}
        <TabsContent value="matrix" className="mt-4">
          <div className="bg-card rounded-lg border border-border p-5">
            <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Opportunity Savings by Area</h3>
            <p className="text-xs text-muted-foreground mb-4">Estimated annual savings per opportunity · Color = impact level</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={matrixData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.004 240)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "oklch(0.45 0.01 240)" }}
                  axisLine={false}
                  tickLine={false}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "oklch(0.55 0.01 240)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}K`}
                />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid oklch(0.90 0.005 240)", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(value: number) => [`$${value}K/yr`, "Est. Saving"]}
                />
                <Bar dataKey="saving" radius={[4, 4, 0, 0]}>
                  {matrixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="flex items-center gap-6 mt-4 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Impact legend:</span>
              {[
                { label: "High", color: "oklch(0.60 0.20 15)" },
                { label: "Medium", color: "oklch(0.72 0.16 75)" },
                { label: "Low", color: "oklch(0.62 0.14 155)" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: item.color }} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Opportunity Detail Sheet */}
      <Sheet open={!!selectedOpp} onOpenChange={() => setSelectedOpp(null)}>
        <SheetContent className="w-[540px] overflow-y-auto">
          {selectedOpp && (
            <div className="space-y-5">
              <SheetHeader>
                <div className="flex items-center gap-2 flex-wrap">
                  <SheetTitle style={{ fontFamily: "'DM Sans', sans-serif" }}>{selectedOpp.title}</SheetTitle>
                </div>
                <div className="flex items-center gap-2">
                  <span className="opportunity-badge">{selectedOpp.type}</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: impactColors[selectedOpp.impact].bg, color: impactColors[selectedOpp.impact].text }}
                  >
                    {selectedOpp.impact.toUpperCase()} IMPACT
                  </span>
                </div>
              </SheetHeader>

              <p className="text-sm text-muted-foreground leading-relaxed">{selectedOpp.description}</p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Est. Annual Saving", value: `$${(selectedOpp.estimatedSaving / 1000).toFixed(0)}K`, color: "oklch(0.38 0.153 193.7)" },
                  { label: "Effort Level", value: selectedOpp.effort.charAt(0).toUpperCase() + selectedOpp.effort.slice(1), color: effortColors[selectedOpp.effort] },
                  { label: "Time to Value", value: selectedOpp.estimatedTimeToValue, color: "oklch(0.35 0.01 240)" },
                ].map((m) => (
                  <div key={m.label} className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="section-label mb-1">{m.label}</p>
                    <p className="text-sm font-bold" style={{ color: m.color, fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Baseline vs Target */}
              <div className="p-4 rounded-lg border border-border">
                <h4 className="text-sm font-semibold mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Baseline → Target</h4>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-center">
                    <p className="section-label mb-0.5">Baseline</p>
                    <p className="text-xl font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{selectedOpp.baselineValue}</p>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max(0, Math.min(100,
                              selectedOpp.targetValue !== selectedOpp.baselineValue
                                ? ((selectedOpp.currentValue - selectedOpp.baselineValue) / (selectedOpp.targetValue - selectedOpp.baselineValue)) * 100
                                : 0
                            ))}%`,
                            background: "oklch(0.38 0.153 193.7)"
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">Current: {selectedOpp.currentValue}</p>
                  </div>
                  <div className="text-center">
                    <p className="section-label mb-0.5">Target</p>
                    <p className="text-xl font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.72 0.16 75)" }}>{selectedOpp.targetValue}</p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div>
                <h4 className="text-sm font-semibold mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Recommended Next Steps</h4>
                <div className="space-y-2">
                  {selectedOpp.nextSteps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/40"
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        style={{ background: "oklch(0.38 0.153 193.7)", color: "white" }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-sm">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <Button className="w-full gap-2" style={{ background: "oklch(0.38 0.153 193.7)", color: "white" }} asChild>
                <Link href="/report">
                  Include in Report <ArrowRight size={14} />
                </Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
