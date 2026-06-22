/**
 * DashboardPage — Clarity Design System
 * High-level organizational overview with KPI cards, trend charts,
 * department breakdown, and drill-down capability
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Minus, ArrowRight, ChevronDown,
  Users, DollarSign, Zap, Clock, Target, AlertTriangle, CheckCircle2, Info
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { kpis, trendData, processNodes, opportunities, type KPI, type ProcessNode } from "@/lib/data";
import { Link } from "wouter";

const kpiIcons: Record<string, React.ElementType> = {
  "Process Efficiency": Zap,
  "Total Operating Cost": DollarSign,
  "Headcount Utilization": Users,
  "Avg Cycle Time": Clock,
  "Revenue per Employee": TrendingUp,
  "Automation Coverage": Target,
  "Customer Satisfaction": CheckCircle2,
  "Identified Opportunities": AlertTriangle,
};

function KPICard({ kpi, index, onClick }: { kpi: KPI; index: number; onClick: () => void }) {
  const Icon = kpiIcons[kpi.label] ?? TrendingUp;
  const isPositiveDelta = (kpi.positive && kpi.delta > 0) || (!kpi.positive && kpi.delta < 0);
  const TrendIcon = kpi.trend === "up" ? TrendingUp : kpi.trend === "down" ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px oklch(0 0 0 / 0.08)" }}
      onClick={onClick}
      className="bg-card rounded-lg border border-border p-5 cursor-pointer transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "oklch(0.91 0.046 193.7)" }}
        >
          <Icon size={17} style={{ color: "oklch(0.38 0.153 193.7)" }} />
        </div>
        <span className="section-label">{kpi.category}</span>
      </div>

      <div className="mb-1">
        <span className="kpi-value-lg">{kpi.value}</span>
        {kpi.unit && <span className="text-sm text-muted-foreground ml-1">{kpi.unit}</span>}
      </div>

      <p className="text-xs text-muted-foreground mb-2">{kpi.label}</p>

      <div className="flex items-center gap-1.5">
        <TrendIcon
          size={12}
          style={{ color: isPositiveDelta ? "oklch(0.62 0.14 155)" : "oklch(0.60 0.20 15)" }}
        />
        <span
          className="text-xs font-medium"
          style={{ color: isPositiveDelta ? "oklch(0.62 0.14 155)" : "oklch(0.60 0.20 15)" }}
        >
          {kpi.delta > 0 ? "+" : ""}{kpi.delta}{kpi.unit === "%" ? "pp" : ""}
        </span>
        <span className="text-xs text-muted-foreground">{kpi.deltaLabel}</span>
      </div>
    </motion.div>
  );
}

function ProcessStatusRow({ node, index, onClick }: { node: ProcessNode; index: number; onClick: () => void }) {
  const statusColors = {
    optimal: { bg: "oklch(0.92 0.06 155)", text: "oklch(0.42 0.14 155)", dot: "oklch(0.62 0.14 155)" },
    warning: { bg: "oklch(0.94 0.07 75)", text: "oklch(0.45 0.15 75)", dot: "oklch(0.72 0.16 75)" },
    critical: { bg: "oklch(0.95 0.06 15)", text: "oklch(0.50 0.18 15)", dot: "oklch(0.60 0.20 15)" },
    opportunity: { bg: "oklch(0.92 0.06 193.7)", text: "oklch(0.35 0.10 193.7)", dot: "oklch(0.38 0.153 193.7)" },
  };
  const colors = statusColors[node.status];

  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className="group cursor-pointer hover:bg-muted/40 transition-colors"
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full" style={{ background: colors.dot }} />
          <span className="text-sm font-medium">{node.name}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-xs text-muted-foreground">{node.department}</span>
      </td>
      <td className="py-3 px-4">
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: colors.bg, color: colors.text }}
        >
          {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm font-mono">${(node.cost / 1000).toFixed(0)}K</span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Progress value={node.automationRate} className="w-16 h-1.5" />
          <span className="text-xs text-muted-foreground">{node.automationRate}%</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-xs text-muted-foreground">{node.cycleTime}d</span>
      </td>
      <td className="py-3 px-4">
        <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </td>
    </motion.tr>
  );
}

export default function DashboardPage() {
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<ProcessNode | null>(null);

  const criticalCount = processNodes.filter(n => n.status === "critical").length;
  const opportunityCount = processNodes.filter(n => n.status === "opportunity").length;
  const totalCost = processNodes.reduce((sum, n) => sum + n.cost, 0);

  return (
    <div className="p-6 space-y-6 page-enter">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Organizational Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            6 data sources · 284,100+ records · Last synced 4 minutes ago
          </p>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle size={11} /> {criticalCount} Critical
            </Badge>
          )}
          {opportunityCount > 0 && (
            <span className="opportunity-badge">
              <span className="opportunity-dot" />
              {opportunityCount} Opportunities
            </span>
          )}
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <Link href="/report">
              <Target size={13} /> Generate Report
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <KPICard key={kpi.id} kpi={kpi} index={i} onClick={() => setSelectedKPI(kpi)} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Process Efficiency Trend */}
        <div className="col-span-2 bg-card rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Process Efficiency — Baseline vs. Goal</h3>
              <p className="text-xs text-muted-foreground">Current trajectory toward 85% target</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded" style={{ background: "oklch(0.38 0.153 193.7)" }} />
                <span className="text-muted-foreground">Current</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded border-dashed border" style={{ borderColor: "oklch(0.72 0.16 75)" }} />
                <span className="text-muted-foreground">Goal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded" style={{ background: "oklch(0.75 0.01 240)" }} />
                <span className="text-muted-foreground">Baseline</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData.processEfficiency} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gapGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.72 0.16 75)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="oklch(0.72 0.16 75)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.38 0.153 193.7)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="oklch(0.38 0.153 193.7)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.004 240)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.55 0.01 240)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "oklch(0.55 0.01 240)" }} axisLine={false} tickLine={false} domain={[55, 95]} />
              <Tooltip
                contentStyle={{ background: "white", border: "1px solid oklch(0.90 0.005 240)", borderRadius: "8px", fontSize: "12px" }}
                formatter={(value: unknown) => { const v = value as number | null; return v !== null ? [`${v}%`, ""] : ["—", ""]; }}
              />
              <Area type="monotone" dataKey="goal" stroke="oklch(0.72 0.16 75)" strokeWidth={1.5} strokeDasharray="4 3" fill="url(#gapGradient)" dot={false} />
              <Area type="monotone" dataKey="current" stroke="oklch(0.38 0.153 193.7)" strokeWidth={2} fill="url(#currentGradient)" dot={{ r: 3, fill: "oklch(0.38 0.153 193.7)", strokeWidth: 0 }} connectNulls={false} />
              <Line type="monotone" dataKey="baseline" stroke="oklch(0.75 0.01 240)" strokeWidth={1} dot={false} strokeDasharray="2 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Cost Breakdown */}
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Cost by Department</h3>
            <p className="text-xs text-muted-foreground">Total: ${(totalCost / 1000).toFixed(0)}K / month</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendData.departmentCosts} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: "oklch(0.55 0.01 240)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}M`} />
              <YAxis type="category" dataKey="dept" tick={{ fontSize: 11, fill: "oklch(0.35 0.01 240)" }} axisLine={false} tickLine={false} width={72} />
              <Tooltip
                contentStyle={{ background: "white", border: "1px solid oklch(0.90 0.005 240)", borderRadius: "8px", fontSize: "12px" }}
                formatter={(value: number) => [`$${value}M`, "Cost"]}
              />
              <Bar dataKey="cost" fill="oklch(0.38 0.153 193.7)" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Process Table */}
      <div className="bg-card rounded-lg border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>End-to-End Process Map</h3>
            <p className="text-xs text-muted-foreground">{processNodes.length} processes · Click any row to drill down</p>
          </div>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs" asChild>
            <Link href="/process">
              View full map <ArrowRight size={12} />
            </Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Process", "Department", "Status", "Monthly Cost", "Automation", "Cycle Time", ""].map((h) => (
                  <th key={h} className="py-2.5 px-4 text-left section-label">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processNodes.map((node, i) => (
                <ProcessStatusRow
                  key={node.id}
                  node={node}
                  index={i}
                  onClick={() => setSelectedProcess(node)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Opportunities Preview */}
      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Top Opportunities</h3>
            <p className="text-xs text-muted-foreground">Ranked by impact-to-effort ratio</p>
          </div>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs" asChild>
            <Link href="/opportunities">
              View all <ArrowRight size={12} />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {opportunities.slice(0, 3).map((opp, i) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="p-4 rounded-lg border"
              style={{ borderColor: "oklch(0.90 0.005 240)", borderLeftWidth: "3px", borderLeftColor: "oklch(0.72 0.16 75)" }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="opportunity-badge">{opp.type}</span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: opp.impact === "high" ? "oklch(0.60 0.20 15)" : opp.impact === "medium" ? "oklch(0.72 0.16 75)" : "oklch(0.62 0.14 155)" }}
                >
                  {opp.impact.toUpperCase()}
                </span>
              </div>
              <h4 className="text-sm font-semibold mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{opp.title}</h4>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{opp.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium" style={{ color: "oklch(0.38 0.153 193.7)" }}>
                  +${(opp.estimatedSaving / 1000).toFixed(0)}K/yr
                </span>
                <span className="text-xs text-muted-foreground">{opp.estimatedTimeToValue}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* KPI Drill-down Sheet */}
      <Sheet open={!!selectedKPI} onOpenChange={() => setSelectedKPI(null)}>
        <SheetContent className="w-[480px] overflow-y-auto">
          {selectedKPI && (
            <div className="space-y-6">
              <SheetHeader>
                <SheetTitle style={{ fontFamily: "'DM Sans', sans-serif" }}>{selectedKPI.label}</SheetTitle>
                <p className="text-sm text-muted-foreground">{selectedKPI.category} · Detailed breakdown</p>
              </SheetHeader>

              <div className="p-5 rounded-lg" style={{ background: "oklch(0.91 0.046 193.7)" }}>
                <p className="section-label mb-1">Current Value</p>
                <div className="flex items-baseline gap-2">
                  <span className="kpi-value-lg">{selectedKPI.value}</span>
                  {selectedKPI.unit && <span className="text-muted-foreground">{selectedKPI.unit}</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{selectedKPI.deltaLabel}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>6-Month Trend</h4>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={trendData.costTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="drillGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.38 0.153 193.7)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="oklch(0.38 0.153 193.7)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.004 240)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
                    <Area type="monotone" dataKey="value" stroke="oklch(0.38 0.153 193.7)" strokeWidth={2} fill="url(#drillGrad)" dot={{ r: 3, fill: "oklch(0.38 0.153 193.7)", strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Related Opportunities</h4>
                {opportunities.slice(0, 2).map((opp) => (
                  <div key={opp.id} className="p-3 rounded-lg border border-border mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{opp.title}</span>
                      <span className="text-xs font-mono" style={{ color: "oklch(0.38 0.153 193.7)" }}>+${(opp.estimatedSaving / 1000).toFixed(0)}K</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{opp.estimatedTimeToValue}</p>
                  </div>
                ))}
              </div>

              <Button className="w-full gap-2" style={{ background: "oklch(0.38 0.153 193.7)", color: "white" }} asChild>
                <Link href="/opportunities">
                  View All Opportunities <ArrowRight size={14} />
                </Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Process Drill-down Sheet */}
      <Sheet open={!!selectedProcess} onOpenChange={() => setSelectedProcess(null)}>
        <SheetContent className="w-[480px] overflow-y-auto">
          {selectedProcess && (
            <div className="space-y-5">
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <SheetTitle style={{ fontFamily: "'DM Sans', sans-serif" }}>{selectedProcess.name}</SheetTitle>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: selectedProcess.status === "optimal" ? "oklch(0.92 0.06 155)" : selectedProcess.status === "critical" ? "oklch(0.95 0.06 15)" : selectedProcess.status === "opportunity" ? "oklch(0.92 0.06 193.7)" : "oklch(0.94 0.07 75)",
                      color: selectedProcess.status === "optimal" ? "oklch(0.42 0.14 155)" : selectedProcess.status === "critical" ? "oklch(0.50 0.18 15)" : selectedProcess.status === "opportunity" ? "oklch(0.35 0.10 193.7)" : "oklch(0.45 0.15 75)",
                    }}
                  >
                    {selectedProcess.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{selectedProcess.department} · {selectedProcess.description}</p>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Monthly Cost", value: `$${(selectedProcess.cost / 1000).toFixed(0)}K`, icon: DollarSign },
                  { label: "Headcount", value: `${selectedProcess.headcount} FTE`, icon: Users },
                  { label: "Cycle Time", value: `${selectedProcess.cycleTime} days`, icon: Clock },
                  { label: "Automation", value: `${selectedProcess.automationRate}%`, icon: Zap },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 rounded-lg bg-muted/50">
                    <p className="section-label mb-1">{stat.label}</p>
                    <p className="text-lg font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Automation Coverage</h4>
                <div className="flex items-center gap-3">
                  <Progress value={selectedProcess.automationRate} className="flex-1 h-2" />
                  <span className="text-sm font-mono">{selectedProcess.automationRate}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedProcess.automationRate < 40 ? "Below average — automation opportunity identified" : selectedProcess.automationRate < 70 ? "Moderate — room for improvement" : "Well automated"}
                </p>
              </div>

              {selectedProcess.status !== "optimal" && (
                <div className="p-4 rounded-lg" style={{ background: "oklch(0.94 0.07 75 / 0.3)", borderLeft: "3px solid oklch(0.72 0.16 75)" }}>
                  <div className="flex items-start gap-2">
                    <Info size={14} style={{ color: "oklch(0.55 0.15 75)" }} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium" style={{ color: "oklch(0.40 0.12 75)" }}>Action Required</p>
                      <p className="text-xs mt-0.5" style={{ color: "oklch(0.50 0.10 75)" }}>
                        {selectedProcess.status === "critical"
                          ? "This process is a critical bottleneck. Immediate redesign recommended."
                          : selectedProcess.status === "opportunity"
                          ? "Automation opportunity identified. See Opportunities page for details."
                          : "Performance below target. Review staffing and tooling."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button className="w-full gap-2" style={{ background: "oklch(0.38 0.153 193.7)", color: "white" }} asChild>
                <Link href="/process">
                  View Full Process Map <ArrowRight size={14} />
                </Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
