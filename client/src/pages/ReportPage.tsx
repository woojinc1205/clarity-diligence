/**
 * ReportPage — Clarity Design System
 * Full due diligence report with executive summary, findings,
 * opportunity landscape, roadmap, and projected impact
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Download, Share2, CheckCircle2, AlertTriangle, Lightbulb,
  Map, TrendingUp, ArrowRight, Clock, DollarSign, Target, ChevronDown, ChevronUp,
  Printer, RefreshCw, Zap, Layers, Scissors, Settings2
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Cell
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { reportSections, opportunities, kpis, processNodes } from "@/lib/data";

const sectionIcons: Record<string, React.ElementType> = {
  summary: FileText,
  finding: AlertTriangle,
  opportunity: Lightbulb,
  roadmap: Map,
  recommendation: TrendingUp,
};

const sectionColors: Record<string, string> = {
  summary: "oklch(0.42 0.12 195)",
  finding: "oklch(0.60 0.20 15)",
  opportunity: "oklch(0.72 0.16 75)",
  roadmap: "oklch(0.55 0.15 270)",
  recommendation: "oklch(0.62 0.14 155)",
};

const phaseData = [
  {
    phase: "Phase 1",
    label: "Quick Wins",
    duration: "Weeks 1–8",
    items: ["Lead Scoring Model", "Invoice Automation", "Contract Templates"],
    saving: 425,
    color: "oklch(0.62 0.14 155)",
  },
  {
    phase: "Phase 2",
    label: "Strategic Initiatives",
    duration: "Months 3–5",
    items: ["Proposal Automation (CPQ)", "Onboarding Consolidation"],
    saving: 445,
    color: "oklch(0.42 0.12 195)",
  },
  {
    phase: "Phase 3",
    label: "Foundational",
    duration: "Months 6–12",
    items: ["Renewal Automation", "Continuous Monitoring"],
    saving: 340,
    color: "oklch(0.72 0.16 75)",
  },
];

const impactData = [
  { name: "Sales Cycle", before: 45, after: 28, unit: "days" },
  { name: "Conversion Rate", before: 22, after: 40, unit: "%" },
  { name: "Onboarding Time", before: 10, after: 6, unit: "days" },
  { name: "Retention Rate", before: 74, after: 88, unit: "%" },
  { name: "Automation", before: 38, after: 65, unit: "%" },
];

function ReportSection({ section, index }: { section: typeof reportSections[0]; index: number }) {
  const [expanded, setExpanded] = useState(true);
  const Icon = sectionIcons[section.type] ?? FileText;
  const color = sectionColors[section.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-card rounded-lg border border-border overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}20` }}
          >
            <Icon size={16} style={{ color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{section.title}</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: `${color}15`, color }}
              >
                {section.type}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Section {section.priority} of {reportSections.length}</p>
          </div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0">
              <div className="w-full h-px bg-border mb-4" />
              <p className="text-sm leading-relaxed text-foreground/80">{section.content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ReportPage() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(true);

  const totalSaving = opportunities.reduce((s, o) => s + o.estimatedSaving, 0);

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      toast.success("Report generated", { description: "Due diligence report is ready to review" });
    }, 2000);
  };

  const handleExport = () => {
    toast.success("Export initiated", { description: "Report PDF will be ready in a moment" });
  };

  const handleShare = () => {
    toast.success("Share link copied", { description: "Report link copied to clipboard" });
  };

  return (
    <div className="p-6 space-y-6 page-enter">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Due Diligence Report</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Acme Consulting Group · Generated Jun 20, 2026 · Based on 6 data sources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleShare}>
            <Share2 size={13} /> Share
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport}>
            <Download size={13} /> Export PDF
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            style={{ background: "oklch(0.42 0.12 195)", color: "white" }}
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating…</>
            ) : (
              <><RefreshCw size={13} /> Regenerate</>
            )}
          </Button>
        </div>
      </div>

      {/* Report Cover */}
      <div
        className="rounded-xl p-8 relative overflow-hidden"
        style={{ background: "oklch(0.22 0.06 195)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(/manus-storage/clarity-hero-bg_de24f9b2.png)`,
            backgroundSize: "cover",
          }}
        />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img
                  src="/manus-storage/lumatrace-official-dark_a225acd4.png"
                  alt="Luma Trace"
                  className="h-6 object-contain"
                />
                <span className="text-sm font-semibold" style={{ color: "oklch(0.75 0.04 195)", fontFamily: "'DM Sans', sans-serif" }}>
                  Intelligence Report
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-1" style={{ color: "oklch(0.97 0.01 195)", fontFamily: "'DM Sans', sans-serif" }}>
                Organizational Due Diligence
              </h2>
              <p className="text-lg" style={{ color: "oklch(0.80 0.04 195)" }}>Acme Consulting Group</p>
              <p className="text-sm mt-2" style={{ color: "oklch(0.62 0.04 195)" }}>Q2 2026 · Confidential</p>
            </div>
            <div className="text-right">
              <p className="text-sm mb-1" style={{ color: "oklch(0.65 0.04 195)" }}>Total Opportunity Value</p>
              <p className="text-4xl font-bold" style={{ color: "oklch(0.72 0.16 75)", fontFamily: "'JetBrains Mono', monospace" }}>
                ${(totalSaving / 1000000).toFixed(2)}M
              </p>
              <p className="text-xs mt-1" style={{ color: "oklch(0.55 0.04 195)" }}>Estimated annual impact</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t" style={{ borderColor: "oklch(0.32 0.06 195)" }}>
            {[
              { label: "Data Sources", value: "6" },
              { label: "Processes Analyzed", value: processNodes.length.toString() },
              { label: "Opportunities Found", value: opportunities.length.toString() },
              { label: "Recommended Actions", value: "18" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold" style={{ color: "oklch(0.97 0.01 195)", fontFamily: "'JetBrains Mono', monospace" }}>{stat.value}</p>
                <p className="text-xs" style={{ color: "oklch(0.62 0.04 195)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Sections */}
      <div className="space-y-3">
        {reportSections.map((section, i) => (
          <ReportSection key={section.id} section={section} index={i} />
        ))}
      </div>

      {/* Projected Impact Chart */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Projected Impact — Before vs. After</h3>
        <p className="text-xs text-muted-foreground mb-4">Key metrics after full opportunity implementation</p>
        <div className="grid grid-cols-5 gap-3">
          {impactData.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="text-center p-3 rounded-lg bg-muted/40"
            >
              <p className="section-label mb-2">{item.name}</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-sm font-mono text-muted-foreground line-through">{item.before}{item.unit}</span>
                <ArrowRight size={12} className="text-muted-foreground" />
                <span className="text-sm font-mono font-bold" style={{ color: "oklch(0.62 0.14 155)" }}>{item.after}{item.unit}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "oklch(0.62 0.14 155)" }}
                  initial={{ width: `${(item.before / Math.max(item.before, item.after)) * 100}%` }}
                  animate={{ width: `${(item.after / Math.max(item.before, item.after)) * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Implementation Roadmap */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Implementation Roadmap</h3>
        <div className="grid grid-cols-3 gap-4">
          {phaseData.map((phase, i) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-lg border"
              style={{ borderColor: phase.color, borderTopWidth: "3px" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${phase.color}20`, color: phase.color }}
                >
                  {phase.phase}
                </span>
                <span className="text-xs text-muted-foreground">{phase.duration}</span>
              </div>
              <p className="text-sm font-semibold mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>{phase.label}</p>
              <div className="space-y-1.5 mb-3">
                {phase.items.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={12} style={{ color: phase.color }} />
                    <span className="text-xs">{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-border">
                <p className="section-label mb-0.5">Est. Saving</p>
                <p className="text-sm font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: phase.color }}>
                  ${phase.saving}K/yr
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="rounded-xl p-6 flex items-center justify-between"
        style={{ background: "oklch(0.94 0.07 75 / 0.3)", border: "1px solid oklch(0.85 0.10 75)" }}
      >
        <div>
          <h3 className="text-base font-semibold mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Ready to act on these insights?</h3>
          <p className="text-sm text-muted-foreground">Share this report with your team and start tracking progress in the dashboard.</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport}>
            <Download size={13} /> Download PDF
          </Button>
          <Button size="sm" className="gap-1.5" style={{ background: "oklch(0.42 0.12 195)", color: "white" }} onClick={handleShare}>
            <Share2 size={13} /> Share Report
          </Button>
        </div>
      </div>
    </div>
  );
}
