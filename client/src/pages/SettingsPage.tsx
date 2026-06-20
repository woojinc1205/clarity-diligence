/**
 * SettingsPage — Clarity Design System
 * Organization settings, user management, notification preferences,
 * and data governance controls
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Bell, Shield, Key, Palette, Globe, ChevronRight, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const teamMembers = [
  { name: "Alex Morgan", email: "alex@acmeconsulting.com", role: "Admin", avatar: "A" },
  { name: "Jordan Lee", email: "jordan@acmeconsulting.com", role: "Analyst", avatar: "J" },
  { name: "Sam Rivera", email: "sam@acmeconsulting.com", role: "Viewer", avatar: "S" },
  { name: "Chris Park", email: "chris@acmeconsulting.com", role: "Analyst", avatar: "C" },
];

const roleColors: Record<string, { bg: string; text: string }> = {
  Admin: { bg: "oklch(0.92 0.06 195)", text: "oklch(0.35 0.10 195)" },
  Analyst: { bg: "oklch(0.94 0.07 75)", text: "oklch(0.45 0.15 75)" },
  Viewer: { bg: "oklch(0.94 0.005 240)", text: "oklch(0.45 0.01 240)" },
};

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success("Settings saved");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 page-enter">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your organization, team, and preferences</p>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          style={{ background: "oklch(0.42 0.12 195)", color: "white" }}
          onClick={handleSave}
        >
          {saved ? <><Check size={13} /> Saved</> : <><Save size={13} /> Save Changes</>}
        </Button>
      </div>

      <Tabs defaultValue="organization">
        <TabsList>
          <TabsTrigger value="organization" className="gap-1.5"><Building2 size={13} />Organization</TabsTrigger>
          <TabsTrigger value="team" className="gap-1.5"><Users size={13} />Team</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5"><Bell size={13} />Notifications</TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5"><Shield size={13} />Security</TabsTrigger>
        </TabsList>

        {/* Organization Tab */}
        <TabsContent value="organization" className="mt-6 space-y-6">
          <div className="bg-card rounded-lg border border-border p-5">
            <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Organization Profile</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Organization Name</Label>
                <Input defaultValue="Acme Consulting Group" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Industry</Label>
                <Input defaultValue="Management Consulting" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Company Size</Label>
                <Select defaultValue="50-200">
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1–10 employees</SelectItem>
                    <SelectItem value="10-50">10–50 employees</SelectItem>
                    <SelectItem value="50-200">50–200 employees</SelectItem>
                    <SelectItem value="200-1000">200–1,000 employees</SelectItem>
                    <SelectItem value="1000+">1,000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Fiscal Year Start</Label>
                <Select defaultValue="january">
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="january">January</SelectItem>
                    <SelectItem value="april">April</SelectItem>
                    <SelectItem value="july">July</SelectItem>
                    <SelectItem value="october">October</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-5">
            <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Data & Analysis Preferences</h3>
            <div className="space-y-4">
              {[
                { label: "Auto-sync data sources", desc: "Automatically sync connected sources every 15 minutes", defaultOn: true },
                { label: "Anomaly detection alerts", desc: "Get notified when metrics deviate significantly from baseline", defaultOn: true },
                { label: "Benchmark comparisons", desc: "Compare your metrics against industry benchmarks", defaultOn: false },
                { label: "Historical data retention", desc: "Keep 24 months of historical data for trend analysis", defaultOn: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.defaultOn} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-5">
            <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Reporting Defaults</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Default Report Period</Label>
                <Select defaultValue="quarterly">
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="cad">CAD (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="mt-6 space-y-4">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Team Members</h3>
              <Button
                size="sm"
                className="gap-1.5 text-xs"
                style={{ background: "oklch(0.42 0.12 195)", color: "white" }}
                onClick={() => toast.info("Invite flow coming soon")}
              >
                + Invite Member
              </Button>
            </div>
            <div className="divide-y divide-border">
              {teamMembers.map((member, i) => (
                <motion.div
                  key={member.email}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: `oklch(${0.35 + i * 0.04} 0.12 ${195 + i * 25})` }}
                    >
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: roleColors[member.role].bg, color: roleColors[member.role].text }}
                    >
                      {member.role}
                    </span>
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => toast.info("Role management coming soon")}>
                      Edit
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-5">
            <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Role Permissions</h3>
            <div className="space-y-2">
              {[
                { role: "Admin", perms: ["View all data", "Edit settings", "Manage team", "Generate reports", "Configure connectors"] },
                { role: "Analyst", perms: ["View all data", "Generate reports", "Configure goal levers"] },
                { role: "Viewer", perms: ["View dashboard", "View reports"] },
              ].map((item) => (
                <div key={item.role} className="p-3 rounded-lg bg-muted/40">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: roleColors[item.role].bg, color: roleColors[item.role].text }}
                    >
                      {item.role}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.perms.map((perm) => (
                      <span key={perm} className="text-xs bg-background border border-border px-2 py-0.5 rounded">{perm}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <div className="bg-card rounded-lg border border-border p-5 space-y-4">
            <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Notification Preferences</h3>
            {[
              { category: "Opportunities", items: [
                { label: "New opportunity identified", desc: "When Clarity finds a new opportunity in your data", on: true },
                { label: "Opportunity impact update", desc: "When estimated impact changes significantly", on: false },
              ]},
              { category: "Data & Sync", items: [
                { label: "Sync failures", desc: "When a data source fails to sync", on: true },
                { label: "Data anomalies", desc: "When metrics deviate more than 15% from baseline", on: true },
              ]},
              { category: "Reports", items: [
                { label: "Report ready", desc: "When a generated report is complete", on: true },
                { label: "Weekly digest", desc: "Weekly summary of key metrics and changes", on: false },
              ]},
            ].map((group) => (
              <div key={group.category}>
                <p className="section-label mb-2">{group.category}</p>
                {group.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-border last:border-b-0">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.on} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6 space-y-4">
          <div className="bg-card rounded-lg border border-border p-5 space-y-4">
            <h3 className="text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Authentication</h3>
            <div className="space-y-1.5">
              <Label className="text-xs">Current Password</Label>
              <Input type="password" placeholder="••••••••" className="h-9 max-w-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <div className="space-y-1.5">
                <Label className="text-xs">New Password</Label>
                <Input type="password" placeholder="••••••••" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Confirm Password</Label>
                <Input type="password" placeholder="••••••••" className="h-9" />
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => toast.success("Password updated")}>Update Password</Button>
          </div>

          <div className="bg-card rounded-lg border border-border p-5">
            <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Security Settings</h3>
            {[
              { label: "Two-factor authentication", desc: "Require 2FA for all team members", on: false },
              { label: "SSO / SAML", desc: "Single sign-on via your identity provider", on: false },
              { label: "Session timeout", desc: "Auto-logout after 8 hours of inactivity", on: true },
              { label: "Audit log", desc: "Track all user actions and data access", on: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.on} />
              </div>
            ))}
          </div>

          <div className="bg-card rounded-lg border border-border p-5">
            <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>API Access</h3>
            <p className="text-xs text-muted-foreground mb-3">Use API keys to access Clarity data programmatically</p>
            <div className="flex items-center gap-2">
              <Input
                value="ck_live_••••••••••••••••••••••••••••••••"
                readOnly
                className="h-9 font-mono text-xs flex-1"
              />
              <Button variant="outline" size="sm" onClick={() => toast.success("API key copied")}>Copy</Button>
              <Button variant="outline" size="sm" onClick={() => toast.info("New API key generated")}>Regenerate</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
