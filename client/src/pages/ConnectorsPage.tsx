/**
 * ConnectorsPage — VantageIQ Design System
 * Data source connection management with status, sync controls,
 * and credential configuration
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Cloud, Layers, Users, DollarSign, BarChart2, Database,
  Mail, GitBranch, MessageSquare, Package,
  CheckCircle2, AlertCircle, Clock, Wifi, WifiOff, Plus,
  RefreshCw, Settings, Trash2, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { dataSources, type DataSource } from "@/lib/data";

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

const statusConfig = {
  connected: { icon: CheckCircle2, color: "oklch(0.62 0.14 155)", bg: "oklch(0.92 0.06 155)", label: "Connected" },
  pending: { icon: Clock, color: "oklch(0.72 0.16 75)", bg: "oklch(0.94 0.07 75)", label: "Pending" },
  error: { icon: AlertCircle, color: "oklch(0.60 0.20 15)", bg: "oklch(0.95 0.06 15)", label: "Error" },
  not_connected: { icon: WifiOff, color: "oklch(0.65 0.01 240)", bg: "oklch(0.94 0.005 240)", label: "Not Connected" },
};

function ConnectorCard({ source, index, onConfigure }: { source: DataSource; index: number; onConfigure: (s: DataSource) => void }) {
  const Icon = iconMap[source.icon] ?? Database;
  const status = statusConfig[source.status];
  const StatusIcon = status.icon;
  const [syncing, setSyncing] = useState(false);

  const handleSync = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (source.status !== "connected") return;
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success(`${source.name} synced`, { description: `${source.recordCount?.toLocaleString()} records updated` });
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-lg border border-border p-5 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: source.status === "connected" ? "oklch(0.91 0.046 193.7)" : "oklch(0.94 0.005 240)" }}
          >
            <Icon size={18} style={{ color: source.status === "connected" ? "oklch(0.38 0.153 193.7)" : "oklch(0.55 0.01 240)" }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{source.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{source.category}</p>
          </div>
        </div>
        <span
          className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: status.bg, color: status.color }}
        >
          <StatusIcon size={10} />
          {status.label}
        </span>
      </div>

      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{source.description}</p>

      {source.status === "connected" && (
        <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-lg bg-muted/40">
          <div>
            <p className="section-label mb-0.5">Records</p>
            <p className="text-sm font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {source.recordCount?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="section-label mb-0.5">Last Sync</p>
            <p className="text-xs font-medium">{source.lastSync}</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        {source.status === "connected" ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1.5 text-xs"
              onClick={handleSync}
              disabled={syncing}
            >
              <RefreshCw size={11} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing…" : "Sync Now"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => onConfigure(source)}
            >
              <Settings size={11} /> Configure
            </Button>
          </>
        ) : source.status === "error" ? (
          <Button
            size="sm"
            className="flex-1 gap-1.5 text-xs"
            style={{ background: "oklch(0.60 0.20 15)", color: "white" }}
            onClick={() => onConfigure(source)}
          >
            <AlertCircle size={11} /> Fix Connection
          </Button>
        ) : source.status === "pending" ? (
          <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" disabled>
            <Clock size={11} /> Connecting…
          </Button>
        ) : (
          <Button
            size="sm"
            className="flex-1 gap-1.5 text-xs"
            style={{ background: "oklch(0.38 0.153 193.7)", color: "white" }}
            onClick={() => onConfigure(source)}
          >
            <Plus size={11} /> Connect
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export default function ConnectorsPage() {
  const [configSource, setConfigSource] = useState<DataSource | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const connected = dataSources.filter(s => s.status === "connected").length;
  const withIssues = dataSources.filter(s => s.status === "error" || s.status === "pending").length;

  const filtered = activeTab === "all"
    ? dataSources
    : activeTab === "connected"
    ? dataSources.filter(s => s.status === "connected")
    : activeTab === "issues"
    ? dataSources.filter(s => s.status !== "connected")
    : dataSources.filter(s => s.category === activeTab);

  const handleConnect = () => {
    toast.success("Connection initiated", { description: "Credentials validated. Syncing data…" });
    setConfigSource(null);
  };

  return (
    <div className="p-6 space-y-6 page-enter">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Data Connectors</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {connected} of {dataSources.length} sources connected · {withIssues > 0 ? `${withIssues} need attention` : "All healthy"}
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          style={{ background: "oklch(0.38 0.153 193.7)", color: "white" }}
          onClick={() => toast.info("Custom connector setup coming soon")}
        >
          <Plus size={13} /> Add Custom Source
        </Button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Connected", value: connected, color: "oklch(0.62 0.14 155)", bg: "oklch(0.92 0.06 155)" },
          { label: "Pending", value: dataSources.filter(s => s.status === "pending").length, color: "oklch(0.72 0.16 75)", bg: "oklch(0.94 0.07 75)" },
          { label: "Errors", value: dataSources.filter(s => s.status === "error").length, color: "oklch(0.60 0.20 15)", bg: "oklch(0.95 0.06 15)" },
          { label: "Not Connected", value: dataSources.filter(s => s.status === "not_connected").length, color: "oklch(0.55 0.01 240)", bg: "oklch(0.94 0.005 240)" },
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

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({dataSources.length})</TabsTrigger>
          <TabsTrigger value="connected">Connected ({connected})</TabsTrigger>
          <TabsTrigger value="issues">Issues ({withIssues})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((source, i) => (
              <ConnectorCard
                key={source.id}
                source={source}
                index={i}
                onConfigure={setConfigSource}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Configure Dialog */}
      <Dialog open={!!configSource} onOpenChange={() => setConfigSource(null)}>
        <DialogContent className="max-w-md">
          {configSource && (
            <>
              <DialogHeader>
                <DialogTitle style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {configSource.status === "connected" ? "Configure" : "Connect"} {configSource.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                {configSource.status === "error" && (
                  <div className="p-3 rounded-lg" style={{ background: "oklch(0.95 0.06 15 / 0.5)", borderLeft: "3px solid oklch(0.60 0.20 15)" }}>
                    <p className="text-xs font-medium" style={{ color: "oklch(0.50 0.18 15)" }}>
                      Connection failed: Invalid API credentials. Please re-enter your credentials below.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {configSource.category === "database" ? (
                    <>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Host / Connection String</Label>
                        <Input placeholder="postgresql://host:5432/dbname" className="h-9 text-sm font-mono" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Username</Label>
                          <Input placeholder="db_user" className="h-9 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Password</Label>
                          <Input type="password" placeholder="••••••••" className="h-9 text-sm" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1.5">
                        <Label className="text-xs">API Key / Client ID</Label>
                        <Input placeholder="Enter your API key" className="h-9 text-sm font-mono" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">API Secret / Client Secret</Label>
                        <Input type="password" placeholder="••••••••" className="h-9 text-sm" />
                      </div>
                      {(configSource.category === "crm" || configSource.category === "erp") && (
                        <div className="space-y-1.5">
                          <Label className="text-xs">Instance URL</Label>
                          <Input placeholder="https://yourorg.salesforce.com" className="h-9 text-sm" />
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                    <div>
                      <p className="text-xs font-medium">Auto-sync every 15 minutes</p>
                      <p className="text-xs text-muted-foreground">Keeps your data fresh automatically</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setConfigSource(null)}>Cancel</Button>
                  <Button
                    className="flex-1 gap-1.5"
                    style={{ background: "oklch(0.38 0.153 193.7)", color: "white" }}
                    onClick={handleConnect}
                  >
                    <Wifi size={13} />
                    {configSource.status === "connected" ? "Save Changes" : "Connect & Sync"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
