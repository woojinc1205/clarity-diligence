/**
 * AppLayout — Clarity Design System
 * Corporate Modernism: Dark teal sidebar + white content canvas
 * Persistent sidebar with icon+label nav, collapsible on mobile
 */

import { useState } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  GitBranch,
  Lightbulb,
  FileText,
  Plug,
  Settings,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const navItems = [
  { path: "/dashboard", label: "Overview", icon: LayoutDashboard, badge: null },
  { path: "/process", label: "Process Map", icon: GitBranch, badge: null },
  { path: "/opportunities", label: "Opportunities", icon: Lightbulb, badge: "6" },
  { path: "/report", label: "Report", icon: FileText, badge: null },
  { path: "/connectors", label: "Connectors", icon: Plug, badge: "1" },
];

const bottomItems = [
  { path: "/settings", label: "Settings", icon: Settings },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [location, navigate] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success("Data sources synced", {
        description: "6 sources · 284,100+ records updated",
      });
    }, 2000);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 232 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col h-full overflow-hidden flex-shrink-0"
        style={{ background: "oklch(0.22 0.06 195)" }}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b" style={{ borderColor: "oklch(0.32 0.06 195)" }}>
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <img
              src="/manus-storage/vantageiq-logo-dark_87cc60c6.svg"
              alt="VantageIQ"
              className="w-32 flex-shrink-0 object-contain"
            />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="font-bold text-lg tracking-tight overflow-hidden whitespace-nowrap sr-only"
                  style={{ color: "oklch(0.95 0.02 195)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  VantageIQ
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Org Context */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 py-3 border-b"
              style={{ borderColor: "oklch(0.32 0.06 195)" }}
            >
              <p className="text-xs font-medium mb-0.5" style={{ color: "oklch(0.65 0.04 195)" }}>Organization</p>
              <p className="text-sm font-semibold truncate" style={{ color: "oklch(0.92 0.02 195)", fontFamily: "'DM Sans', sans-serif" }}>Acme Consulting Group</p>
              <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.04 195)" }}>6 sources · synced 4m ago</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav Items */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Tooltip key={item.path} delayDuration={collapsed ? 0 : 9999}>
                <TooltipTrigger asChild>
                  <Link href={item.path}>
                    <motion.div
                      whileHover={{ x: collapsed ? 0 : 2 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-3 px-2.5 py-2.5 rounded-md transition-colors relative group"
                      style={{
                        background: isActive ? "oklch(0.42 0.12 195)" : "transparent",
                        color: isActive ? "oklch(0.97 0.01 195)" : "oklch(0.72 0.04 195)",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLDivElement).style.background = "oklch(0.30 0.08 195)";
                          (e.currentTarget as HTMLDivElement).style.color = "oklch(0.90 0.02 195)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLDivElement).style.background = "transparent";
                          (e.currentTarget as HTMLDivElement).style.color = "oklch(0.72 0.04 195)";
                        }
                      }}
                    >
                      {isActive && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                          style={{ background: "oklch(0.72 0.16 75)" }}
                        />
                      )}
                      <Icon size={18} className="flex-shrink-0" />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="text-sm font-medium overflow-hidden whitespace-nowrap flex-1"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {!collapsed && item.badge && (
                        <span
                          className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ background: "oklch(0.72 0.16 75)", color: "oklch(0.20 0.05 75)" }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="ml-2">
                    {item.label}
                    {item.badge && <span className="ml-1.5 text-amber-500">({item.badge})</span>}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom Nav */}
        <div className="py-3 px-2 border-t space-y-0.5" style={{ borderColor: "oklch(0.32 0.06 195)" }}>
          {bottomItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            return (
              <Tooltip key={item.path} delayDuration={collapsed ? 0 : 9999}>
                <TooltipTrigger asChild>
                  <Link href={item.path}>
                    <div
                      className="flex items-center gap-3 px-2.5 py-2.5 rounded-md transition-colors cursor-pointer"
                      style={{
                        background: isActive ? "oklch(0.42 0.12 195)" : "transparent",
                        color: isActive ? "oklch(0.97 0.01 195)" : "oklch(0.60 0.04 195)",
                      }}
                    >
                      <Icon size={18} className="flex-shrink-0" />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="text-sm font-medium overflow-hidden whitespace-nowrap"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </Link>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            );
          })}

          {/* User avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className="flex items-center gap-3 px-2.5 py-2.5 rounded-md cursor-pointer transition-colors"
                style={{ color: "oklch(0.60 0.04 195)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "oklch(0.30 0.08 195)";
                  (e.currentTarget as HTMLDivElement).style.color = "oklch(0.90 0.02 195)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "transparent";
                  (e.currentTarget as HTMLDivElement).style.color = "oklch(0.60 0.04 195)";
                }}
              >
                <div
                  className="w-[18px] h-[18px] rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: "oklch(0.42 0.12 195)", color: "white" }}
                >
                  A
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium overflow-hidden whitespace-nowrap"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Alex Morgan
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-48">
              <DropdownMenuItem><User size={14} className="mr-2" />Profile</DropdownMenuItem>
              <DropdownMenuItem><HelpCircle size={14} className="mr-2" />Help & Docs</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut size={14} className="mr-2" />Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-8 border-t transition-colors"
          style={{
            borderColor: "oklch(0.32 0.06 195)",
            color: "oklch(0.55 0.04 195)",
            background: "transparent",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.30 0.08 195)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-card border-b border-border flex-shrink-0 z-10">
          {/* Breadcrumb / Page Title */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Acme Consulting Group</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {navItems.find(n => location.startsWith(n.path))?.label ?? "Overview"}
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={handleSync}
              disabled={syncing}
            >
              <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing..." : "Sync"}
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground relative" onClick={() => toast.info("Search coming soon")}>
              <Search size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground relative" onClick={() => toast.info("No new notifications")}>
              <Bell size={16} />
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: "oklch(0.72 0.16 75)" }}
              />
            </Button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ml-1"
              style={{ background: "oklch(0.42 0.12 195)" }}
            >
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
