/**
 * DashboardPage — VantageIQ Stitch MD3 Design System
 * KPI cards: ghost icon top-right, teal delta chips, amber border-l-4 for opportunities
 * Charts: #002e2d primary line, #feae2c goal line, #717978 baseline dashed
 * Table: surface-container-low header, hover:bg-tertiary-fixed/5
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Minus, ArrowRight,
  Users, DollarSign, Zap, Clock, Target, AlertTriangle, CheckCircle2,
  MoreVertical, Lightbulb
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { kpis, trendData, processNodes, opportunities, type KPI, type ProcessNode } from "@/lib/data";
import { Link } from "wouter";

// Stitch color tokens
const C = {
  primary: "#002e2d",
  amber: "#feae2c",
  amberLight: "#ffddb4",
  amberText: "#6b4500",
  teal: "#76d6d5",
  tealLight: "rgba(118,214,213,0.2)",
  outline: "#717978",
  outlineVariant: "#c0c8c7",
  onSurface: "#0b1c30",
  onSurfaceVariant: "#414848",
  surfaceLowest: "#ffffff",
  surfaceLow: "#eff4ff",
  surfaceHigh: "#dce9ff",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  errorContainerText: "#93000a",
  green: "#166534",
  greenBg: "#dcfce7",
};

const kpiIcons: Record<string, React.ElementType> = {
  "Process Efficiency": Zap,
  "Total Operating Cost": DollarSign,
  "Headcount Utilization": Users,
  "Avg Cycle Time": Clock,
  "Revenue per Employee": TrendingUp,
  "Automation Coverage": Target,
  "Customer Satisfaction": CheckCircle2,
  "Identified Opportunities": Lightbulb,
};

function KPICard({ kpi, index, onClick }: { kpi: KPI; index: number; onClick: () => void }) {
  const Icon = kpiIcons[kpi.label] ?? TrendingUp;
  const isPositiveDelta = (kpi.positive && kpi.delta > 0) || (!kpi.positive && kpi.delta < 0);
  const isOpportunity = kpi.label === "Identified Opportunities";
  const isNeutral = kpi.delta === 0;
  const TrendIcon = kpi.trend === "up" ? TrendingUp : kpi.trend === "down" ? TrendingDown : Minus;

  const deltaColor = isNeutral
    ? C.outline
    : isPositiveDelta
    ? C.teal
    : C.error;
  const deltaBg = isNeutral
    ? "#e5eeff"
    : isPositiveDelta
    ? C.tealLight
    : C.errorContainer;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="relative overflow-hidden cursor-pointer rounded-lg border transition-shadow"
      style={{
        background: C.surfaceLowest,
        borderColor: C.outlineVariant,
        borderLeftWidth: isOpportunity ? "4px" : "1px",
        borderLeftColor: isOpportunity ? C.amber : C.outlineVariant,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        padding: "16px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
      }}
    >
      {/* Ghost icon top-right */}
      <div
        className="absolute top-0 right-0 p-3 opacity-[0.07] group-hover:opacity-[0.14] transition-opacity pointer-events-none"
      >
        <Icon size={48} />
      </div>

      <p className="text-xs mb-2" style={{ color: C.onSurfaceVariant, fontFamily: "'Inter', sans-serif" }}>
        {kpi.label}
      </p>

      <div className="flex items-baseline gap-2 mb-0">
        <span className="kpi-value-lg">{kpi.value}</span>
        {kpi.unit && kpi.unit !== "%" && (
          <span className="text-sm" style={{ color: C.onSurfaceVariant }}>{kpi.unit}</span>
        )}
      </div>

      <div className="flex items-center gap-1.5 mt-2">
        <span
          className="flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded"
          style={{ color: deltaColor, background: deltaBg, fontFamily: "'Inter', sans-serif" }}
        >
          <TrendIcon size={10} />
          {kpi.delta > 0 ? "+" : ""}{kpi.delta}{kpi.unit === "%" ? "pp" : ""}
        </span>
        <span className="text-xs" style={{ color: C.onSurfaceVariant, fontFamily: "'Inter', sans-serif" }}>
          {kpi.deltaLabel}
        </span>
      </div>
    </motion.div>
  );
}

function StatusChip({ status }: { status: ProcessNode["status"] }) {
  const map = {
    optimal: { bg: C.greenBg, color: C.green, label: "Healthy" },
    warning: { bg: C.amberLight, color: C.amberText, label: "Warning" },
    critical: { bg: C.errorContainer, color: C.errorContainerText, label: "Critical" },
    opportunity: { bg: "#e0f2fe", color: "#0369a1", label: "Opportunity" },
  };
  const s = map[status];
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded"
      style={{ background: s.bg, color: s.color, fontFamily: "'Inter', sans-serif" }}
    >
      {s.label}
    </span>
  );
}

function ProcessRow({ node, index, onClick }: { node: ProcessNode; index: number; onClick: () => void }) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className="group cursor-pointer transition-colors border-b"
      style={{ borderColor: C.outlineVariant }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "rgba(118,214,213,0.05)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
    >
      <td className="py-3 px-4">
        <span className="text-sm font-medium" style={{ color: C.onSurface, fontFamily: "'Inter', sans-serif" }}>
          {node.name}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className="text-xs" style={{ color: C.onSurfaceVariant, fontFamily: "'Inter', sans-serif" }}>
          {node.department}
        </span>
      </td>
      <td className="py-3 px-4 text-right">
        <span className="text-sm" style={{ color: C.onSurface, fontFamily: "'Inter', sans-serif" }}>
          {node.cycleTime}d
        </span>
      </td>
      <td className="py-3 px-4 text-right">
        <span className="text-sm font-medium" style={{ fontFamily: "'DM Mono', 'JetBrains Mono', monospace", color: C.onSurface }}>
          ${(node.cost / 1000).toFixed(0)}K
        </span>
      </td>
      <td className="py-3 px-4 text-center">
        <StatusChip status={node.status} />
      </td>
      <td className="py-3 px-4 text-center">
        <ArrowRight
          size={16}
          className="mx-auto opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: C.onSurfaceVariant }}
        />
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
    <div className="p-6 space-y-6 page-enter" style={{ maxWidth: "1440px", margin: "0 auto" }}>
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-headline-lg" style={{ color: C.onSurface }}>
            Organizational Overview
          </h1>
          <p className="text-body-sm mt-1" style={{ color: C.onSurfaceVariant }}>
            6 data sources · 284,100+ records · Last synced 4 minutes ago
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {criticalCount > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-md border"
              style={{
                background: C.errorContainer,
                color: C.errorContainerText,
                borderColor: `${C.error}33`,
              }}
            >
              <AlertTriangle size={13} />
              {criticalCount} Critical
            </div>
          )}
          {opportunityCount > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-md border"
              style={{
                background: C.amberLight,
                color: C.amberText,
                borderColor: `${C.amber}33`,
              }}
            >
              <Lightbulb size={13} />
              {opportunityCount} Opportunities
            </div>
          )}
          <Button
            size="sm"
            className="ml-2"
            style={{ background: C.primary, color: "#ffffff", fontFamily: "'Inter', sans-serif" }}
            asChild
          >
            <Link href="/report">Generate Report</Link>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Process Efficiency Trend */}
        <div
          className="rounded-lg border flex flex-col"
          style={{ background: C.surfaceLowest, borderColor: C.outlineVariant, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          <div
            className="p-4 flex items-center justify-between"
            style={{ borderBottom: `1px solid ${C.outlineVariant}` }}
          >
            <h3 className="text-headline-sm" style={{ color: C.onSurface }}>
              Process Efficiency — Baseline vs. Goal
            </h3>
            <button style={{ color: C.onSurfaceVariant }}>
              <MoreVertical size={16} />
            </button>
          </div>
          <div className="p-4 flex-1">
            <div className="flex items-center gap-4 mb-3 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded" style={{ background: C.primary }} />
                <span style={{ color: C.onSurfaceVariant }}>Current</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded" style={{ background: C.amber }} />
                <span style={{ color: C.onSurfaceVariant }}>Goal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 border-t-2 border-dashed" style={{ borderColor: C.outline }} />
                <span style={{ color: C.onSurfaceVariant }}>Baseline</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData.processEfficiency} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="goalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.amber} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={C.amber} stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.primary} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={C.primary} stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.outlineVariant} opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.onSurfaceVariant }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.onSurfaceVariant }} axisLine={false} tickLine={false} domain={[55, 95]} />
                <Tooltip
                  contentStyle={{ background: "white", border: `1px solid ${C.outlineVariant}`, borderRadius: "8px", fontSize: "12px" }}
                  formatter={(value: unknown) => {
                    const v = value as number | null;
                    return v !== null ? [`${v}%`, ""] : ["—", ""];
                  }}
                />
                <Area type="monotone" dataKey="goal" stroke={C.amber} strokeWidth={2} fill="url(#goalGrad)" dot={false} />
                <Area type="monotone" dataKey="current" stroke={C.primary} strokeWidth={2.5} fill="url(#currentGrad)" dot={{ r: 3, fill: C.primary, strokeWidth: 0 }} connectNulls={false} />
                <Line type="monotone" dataKey="baseline" stroke={C.outline} strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost by Department */}
        <div
          className="rounded-lg border flex flex-col"
          style={{ background: C.surfaceLowest, borderColor: C.outlineVariant, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          <div
            className="p-4 flex items-center justify-between"
            style={{ borderBottom: `1px solid ${C.outlineVariant}` }}
          >
            <div>
              <h3 className="text-headline-sm" style={{ color: C.onSurface }}>Cost by Department</h3>
              <p className="text-body-sm mt-0.5" style={{ color: C.onSurfaceVariant }}>
                Total: ${(totalCost / 1000).toFixed(0)}K / month
              </p>
            </div>
            <button style={{ color: C.onSurfaceVariant }}>
              <MoreVertical size={16} />
            </button>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-around gap-3">
            {trendData.departmentCosts.map((dept, i) => (
              <div key={dept.dept} className="flex items-center gap-3">
                <div className="w-24 text-right text-xs truncate" style={{ color: C.onSurfaceVariant, fontFamily: "'Inter', sans-serif" }}>
                  {dept.dept}
                </div>
                <div className="flex-1 h-6 rounded overflow-hidden flex" style={{ background: C.surfaceHigh }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(dept.cost / 1.4) * 100}%` }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="h-full rounded-l"
                    style={{ background: C.primary, maxWidth: "70%" }}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(dept.cost / 1.4) * 25}%` }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="h-full"
                    style={{ background: C.teal, maxWidth: "20%" }}
                  />
                </div>
                <div className="w-14 text-right text-xs font-semibold" style={{ color: C.onSurface, fontFamily: "'DM Mono', monospace" }}>
                  ${dept.cost}M
                </div>
              </div>
            ))}
            <div className="flex justify-center gap-6 mt-1 text-xs" style={{ color: C.onSurfaceVariant, fontFamily: "'Inter', sans-serif" }}>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: C.primary }} />
                Fixed Costs
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: C.teal }} />
                Variable Costs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Table */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{ background: C.surfaceLowest, borderColor: C.outlineVariant, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      >
        <div
          className="flex items-center justify-between px-4 py-4"
          style={{ borderBottom: `1px solid ${C.outlineVariant}`, background: C.surfaceLowest }}
        >
          <h3 className="text-headline-sm" style={{ color: C.onSurface }}>End-to-End Process Map</h3>
          <Link href="/process">
            <button
              className="flex items-center gap-1 text-xs font-medium transition-colors"
              style={{ color: C.teal, fontFamily: "'Inter', sans-serif" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = C.primary; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = C.teal; }}
            >
              View full map <ArrowRight size={14} />
            </button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: C.surfaceLow, borderBottom: `1px solid ${C.outlineVariant}` }}>
                {["Process Name", "Department", "Lead Time", "Cost (Annual)", "Health", ""].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: C.onSurfaceVariant, fontFamily: "'Inter', sans-serif" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processNodes.map((node, i) => (
                <ProcessRow
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
      <div
        className="rounded-lg border p-5"
        style={{ background: C.surfaceLowest, borderColor: C.outlineVariant, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-headline-sm" style={{ color: C.onSurface }}>Top Opportunities</h3>
            <p className="text-body-sm mt-0.5" style={{ color: C.onSurfaceVariant }}>Ranked by impact-to-effort ratio</p>
          </div>
          <Link href="/opportunities">
            <button
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: C.teal, fontFamily: "'Inter', sans-serif" }}
            >
              View all <ArrowRight size={14} />
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {opportunities.slice(0, 3).map((opp, i) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="p-4 rounded-lg border"
              style={{
                borderColor: C.outlineVariant,
                borderLeftWidth: "4px",
                borderLeftColor: C.amber,
                background: C.surfaceLowest,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: C.amberLight, color: C.amberText, fontFamily: "'Inter', sans-serif" }}
                >
                  {opp.type}
                </span>
                <span
                  className="text-xs font-bold uppercase"
                  style={{
                    color: opp.impact === "high" ? C.error : opp.impact === "medium" ? C.amberText : C.green,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {opp.impact}
                </span>
              </div>
              <h4 className="text-sm font-semibold mb-1" style={{ color: C.onSurface, fontFamily: "'DM Sans', sans-serif" }}>
                {opp.title}
              </h4>
              <p className="text-xs mb-3 line-clamp-2" style={{ color: C.onSurfaceVariant, fontFamily: "'Inter', sans-serif" }}>
                {opp.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: C.primary, fontFamily: "'DM Mono', monospace" }}>
                  +${(opp.estimatedSaving / 1000).toFixed(0)}K/yr
                </span>
                <span className="text-xs" style={{ color: C.onSurfaceVariant, fontFamily: "'Inter', sans-serif" }}>
                  {opp.estimatedTimeToValue}
                </span>
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
                <SheetTitle className="text-headline-sm" style={{ color: C.onSurface }}>
                  {selectedKPI.label}
                </SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg" style={{ background: C.surfaceLow }}>
                  <p className="text-xs mb-1" style={{ color: C.onSurfaceVariant }}>Current Value</p>
                  <p className="kpi-value-lg">{selectedKPI.value}{selectedKPI.unit}</p>
                </div>
                <div className="p-4 rounded-lg" style={{ background: C.surfaceLow }}>
                  <p className="text-xs mb-1" style={{ color: C.onSurfaceVariant }}>Target</p>
                  <p className="kpi-value-lg">{selectedKPI.target ?? "—"}{selectedKPI.target ? selectedKPI.unit : ""}</p>
                </div>
              </div>
              {selectedKPI.target && (() => {
                const current = parseFloat(String(selectedKPI.value).replace(/[^0-9.]/g, ""));
                const target = parseFloat(String(selectedKPI.target).replace(/[^0-9.]/g, ""));
                const pct = isNaN(current) || isNaN(target) || target === 0 ? 0 : Math.min(100, Math.round((current / target) * 100));
                return (
                  <div>
                    <div className="flex justify-between text-xs mb-2" style={{ color: C.onSurfaceVariant }}>
                      <span>Progress to target</span>
                      <span>{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })()}
              <div>
                <h4 className="text-sm font-semibold mb-3" style={{ color: C.onSurface }}>Trend (12 months)</h4>
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={trendData.processEfficiency}>
                    <defs>
                      <linearGradient id="kpiGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.primary} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={C.primary} stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.outlineVariant} opacity={0.5} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.onSurfaceVariant }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: C.onSurfaceVariant }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "6px" }} />
                    <Area type="monotone" dataKey="current" stroke={C.primary} strokeWidth={2} fill="url(#kpiGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {selectedKPI.insight && (
                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: C.onSurface }}>Insights</h4>
                  <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
                    {selectedKPI.insight}
                  </p>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Process Drill-down Sheet */}
      <Sheet open={!!selectedProcess} onOpenChange={() => setSelectedProcess(null)}>
        <SheetContent className="w-[480px] overflow-y-auto">
          {selectedProcess && (
            <div className="space-y-6">
              <SheetHeader>
                <SheetTitle className="text-headline-sm" style={{ color: C.onSurface }}>
                  {selectedProcess.name}
                </SheetTitle>
              </SheetHeader>
              <div className="flex items-center gap-2">
                <StatusChip status={selectedProcess.status} />
                <span className="text-xs" style={{ color: C.onSurfaceVariant }}>{selectedProcess.department}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Monthly Cost", value: `$${(selectedProcess.cost / 1000).toFixed(0)}K` },
                  { label: "Cycle Time", value: `${selectedProcess.cycleTime}d` },
                  { label: "Automation", value: `${selectedProcess.automationRate}%` },
                ].map(m => (
                  <div key={m.label} className="p-3 rounded-lg text-center" style={{ background: C.surfaceLow }}>
                    <p className="text-xs mb-1" style={{ color: C.onSurfaceVariant }}>{m.label}</p>
                    <p className="kpi-value">{m.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2" style={{ color: C.onSurfaceVariant }}>
                  <span>Automation Coverage</span>
                  <span>{selectedProcess.automationRate}%</span>
                </div>
                <Progress value={selectedProcess.automationRate} className="h-2" />
              </div>
              {selectedProcess.recommendation && (
                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: C.onSurface }}>Recommended Action</h4>
                  <p className="text-sm" style={{ color: C.onSurfaceVariant }}>{selectedProcess.recommendation}</p>
                </div>
              )}
              <Button
                className="w-full"
                style={{ background: C.primary, color: "#ffffff" }}
                asChild
              >
                <Link href="/opportunities">View Related Opportunities</Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
