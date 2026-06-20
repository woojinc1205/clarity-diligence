/**
 * ProcessPage — Clarity Design System
 * End-to-end process visualization with swim lanes, status indicators,
 * and detailed drill-down panels
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, DollarSign, Users, Clock, Zap, Info, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { processNodes, opportunities, type ProcessNode } from "@/lib/data";

const statusConfig = {
  optimal: { bg: "oklch(0.92 0.06 155)", text: "oklch(0.42 0.14 155)", border: "oklch(0.62 0.14 155)", label: "Optimal" },
  warning: { bg: "oklch(0.94 0.07 75)", text: "oklch(0.45 0.15 75)", border: "oklch(0.72 0.16 75)", label: "Warning" },
  critical: { bg: "oklch(0.95 0.06 15)", text: "oklch(0.50 0.18 15)", border: "oklch(0.60 0.20 15)", label: "Critical" },
  opportunity: { bg: "oklch(0.92 0.06 195)", text: "oklch(0.35 0.10 195)", border: "oklch(0.42 0.12 195)", label: "Opportunity" },
};

const departments = Array.from(new Set(processNodes.map(n => n.department)));

function ProcessNodeCard({ node, index, onClick }: { node: ProcessNode; index: number; onClick: () => void }) {
  const config = statusConfig[node.status];
  const relatedOpps = opportunities.filter(o => o.processIds.includes(node.id));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      whileHover={{ y: -2, boxShadow: "0 6px 20px oklch(0 0 0 / 0.10)" }}
      onClick={onClick}
      className="relative cursor-pointer rounded-lg border-2 p-3 min-w-[140px] max-w-[160px] bg-card transition-shadow"
      style={{ borderColor: config.border }}
    >
      {/* Status dot */}
      <div
        className="absolute top-2 right-2 w-2 h-2 rounded-full"
        style={{ background: config.border }}
      />

      {/* Opportunity pulse */}
      {relatedOpps.length > 0 && (
        <div className="absolute -top-1.5 -right-1.5">
          <span
            className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
            style={{ background: "oklch(0.72 0.16 75)" }}
          >
            {relatedOpps.length}
          </span>
        </div>
      )}

      <p className="text-xs font-semibold leading-tight mb-2 pr-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {node.name}
      </p>

      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <DollarSign size={9} className="text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">${(node.cost / 1000).toFixed(0)}K/mo</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={9} className="text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">{node.cycleTime}d cycle</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${node.automationRate}%`, background: "oklch(0.42 0.12 195)" }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">{node.automationRate}%</span>
        </div>
      </div>

      <span
        className="inline-block mt-2 text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
        style={{ background: config.bg, color: config.text }}
      >
        {config.label}
      </span>
    </motion.div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center flex-shrink-0 mx-1">
      <div className="w-6 h-px bg-border" />
      <ChevronRight size={12} className="text-muted-foreground -ml-1" />
    </div>
  );
}

export default function ProcessPage() {
  const [selectedNode, setSelectedNode] = useState<ProcessNode | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredNodes = filterStatus === "all"
    ? processNodes
    : processNodes.filter(n => n.status === filterStatus);

  const relatedOpps = selectedNode ? opportunities.filter(o => o.processIds.includes(selectedNode.id)) : [];

  const totalCost = processNodes.reduce((s, n) => s + n.cost, 0);
  const avgAutomation = Math.round(processNodes.reduce((s, n) => s + n.automationRate, 0) / processNodes.length);
  const avgCycleTime = (processNodes.reduce((s, n) => s + n.cycleTime, 0) / processNodes.length).toFixed(1);

  return (
    <div className="p-6 space-y-6 page-enter">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Process Map</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {processNodes.length} processes across {departments.length} departments · Click any node to drill down
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(["all", "critical", "warning", "opportunity", "optimal"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className="text-xs px-3 py-1.5 rounded-full border transition-all"
              style={{
                background: filterStatus === status ? "oklch(0.42 0.12 195)" : "transparent",
                color: filterStatus === status ? "white" : "oklch(0.50 0.01 240)",
                borderColor: filterStatus === status ? "oklch(0.42 0.12 195)" : "oklch(0.88 0.005 240)",
              }}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Monthly Cost", value: `$${(totalCost / 1000).toFixed(0)}K`, color: "oklch(0.42 0.12 195)" },
          { label: "Avg Automation Rate", value: `${avgAutomation}%`, color: "oklch(0.62 0.14 155)" },
          { label: "Avg Cycle Time", value: `${avgCycleTime}d`, color: "oklch(0.72 0.16 75)" },
          { label: "Critical Processes", value: `${processNodes.filter(n => n.status === "critical").length}`, color: "oklch(0.60 0.20 15)" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-lg border border-border p-4"
          >
            <p className="section-label mb-1">{stat.label}</p>
            <p className="text-xl font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace", color: stat.color }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Process Flow — Swim Lanes */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>End-to-End Process Flow</h3>
          <p className="text-xs text-muted-foreground">Swim-lane view by department · Amber badges = linked opportunities</p>
        </div>

        <div className="overflow-x-auto">
          {departments.map((dept, deptIndex) => {
            const deptNodes = filteredNodes.filter(n => n.department === dept);
            if (deptNodes.length === 0) return null;

            return (
              <div
                key={dept}
                className="flex items-stretch border-b border-border last:border-b-0"
              >
                {/* Lane label */}
                <div
                  className="w-28 flex-shrink-0 flex items-center justify-center px-3 py-4 border-r border-border"
                  style={{ background: deptIndex % 2 === 0 ? "oklch(0.97 0.003 195)" : "oklch(0.985 0.002 240)" }}
                >
                  <span
                    className="text-xs font-semibold text-center leading-tight"
                    style={{ color: "oklch(0.42 0.12 195)", fontFamily: "'DM Sans', sans-serif", writingMode: "horizontal-tb" }}
                  >
                    {dept}
                  </span>
                </div>

                {/* Nodes */}
                <div className="flex items-center gap-0 px-4 py-4 flex-wrap">
                  {deptNodes.map((node, i) => (
                    <div key={node.id} className="flex items-center">
                      <ProcessNodeCard
                        node={node}
                        index={deptIndex * 3 + i}
                        onClick={() => setSelectedNode(node)}
                      />
                      {i < deptNodes.length - 1 && <Arrow />}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Status legend:</span>
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.border }} />
            <span>{cfg.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: "oklch(0.72 0.16 75)" }}>1</div>
          <span>Linked opportunities</span>
        </div>
      </div>

      {/* Process Detail Sheet */}
      <Sheet open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <SheetContent className="w-[520px] overflow-y-auto">
          {selectedNode && (
            <div className="space-y-5">
              <SheetHeader>
                <div className="flex items-center gap-2 flex-wrap">
                  <SheetTitle style={{ fontFamily: "'DM Sans', sans-serif" }}>{selectedNode.name}</SheetTitle>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: statusConfig[selectedNode.status].bg,
                      color: statusConfig[selectedNode.status].text,
                    }}
                  >
                    {statusConfig[selectedNode.status].label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{selectedNode.department} · {selectedNode.description}</p>
              </SheetHeader>

              <Tabs defaultValue="overview">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="opportunities" className="flex-1">
                    Opportunities {relatedOpps.length > 0 && `(${relatedOpps.length})`}
                  </TabsTrigger>
                  <TabsTrigger value="people" className="flex-1">People</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Monthly Cost", value: `$${(selectedNode.cost / 1000).toFixed(0)}K`, icon: DollarSign },
                      { label: "Headcount", value: `${selectedNode.headcount} FTE`, icon: Users },
                      { label: "Cycle Time", value: `${selectedNode.cycleTime} days`, icon: Clock },
                      { label: "Automation", value: `${selectedNode.automationRate}%`, icon: Zap },
                    ].map((stat) => (
                      <div key={stat.label} className="p-3 rounded-lg bg-muted/50">
                        <p className="section-label mb-1">{stat.label}</p>
                        <p className="text-lg font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium">Automation Coverage</span>
                      <span className="text-sm font-mono">{selectedNode.automationRate}%</span>
                    </div>
                    <Progress value={selectedNode.automationRate} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Industry benchmark: 55–70% for this process type
                    </p>
                  </div>

                  {selectedNode.status !== "optimal" && (
                    <div
                      className="p-4 rounded-lg"
                      style={{ background: "oklch(0.94 0.07 75 / 0.3)", borderLeft: "3px solid oklch(0.72 0.16 75)" }}
                    >
                      <p className="text-sm font-semibold mb-1" style={{ color: "oklch(0.40 0.12 75)" }}>
                        {selectedNode.status === "critical" ? "Critical Issue" : selectedNode.status === "opportunity" ? "Opportunity Identified" : "Performance Warning"}
                      </p>
                      <p className="text-xs" style={{ color: "oklch(0.50 0.10 75)" }}>
                        {selectedNode.status === "critical"
                          ? "This process is significantly impacting overall efficiency. Immediate action recommended."
                          : selectedNode.status === "opportunity"
                          ? `${relatedOpps.length} automation or redesign opportunity${relatedOpps.length !== 1 ? "ies" : "y"} identified for this process.`
                          : "Performance metrics are below target. Review resource allocation and tooling."}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="opportunities" className="space-y-3 mt-4">
                  {relatedOpps.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Zap size={24} className="mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No opportunities linked to this process</p>
                    </div>
                  ) : (
                    relatedOpps.map((opp) => (
                      <div key={opp.id} className="p-4 rounded-lg border border-border">
                        <div className="flex items-start justify-between mb-2">
                          <span className="opportunity-badge">{opp.type}</span>
                          <span className="text-xs font-mono font-semibold" style={{ color: "oklch(0.42 0.12 195)" }}>
                            +${(opp.estimatedSaving / 1000).toFixed(0)}K/yr
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{opp.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{opp.description}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>Impact: <strong style={{ color: opp.impact === "high" ? "oklch(0.60 0.20 15)" : "oklch(0.72 0.16 75)" }}>{opp.impact}</strong></span>
                          <span>Effort: <strong>{opp.effort}</strong></span>
                          <span>{opp.estimatedTimeToValue}</span>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="people" className="space-y-4 mt-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="section-label mb-2">Team Allocation</p>
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {Array.from({ length: Math.min(selectedNode.headcount, 5) }).map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: `oklch(${0.35 + i * 0.05} 0.12 ${195 + i * 20})` }}
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                        {selectedNode.headcount > 5 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-muted flex items-center justify-center text-xs font-medium">
                            +{selectedNode.headcount - 5}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{selectedNode.headcount} FTE</p>
                        <p className="text-xs text-muted-foreground">{selectedNode.department} team</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="section-label mb-1">Cost per FTE</p>
                    <p className="text-lg font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      ${Math.round(selectedNode.cost / selectedNode.headcount / 1000).toFixed(0)}K/mo
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
