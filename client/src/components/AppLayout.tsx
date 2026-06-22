/**
 * AppLayout — VantageIQ Stitch MD3 Design System
 * Sidebar: #002e2d (primary-container), active: border-l-4 teal, amber badges
 * Topbar: surface-container-lowest, breadcrumb, sync/search/bell/avatar
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

// Stitch color tokens
const C = {
  sidebar: "#002e2d",
  sidebarBorder: "rgba(255,255,255,0.08)",
  sidebarText: "#a5cecc",
  sidebarTextMuted: "rgba(165,206,204,0.6)",
  sidebarActive: "rgba(255,255,255,0.12)",
  sidebarHover: "rgba(255,255,255,0.07)",
  sidebarActiveBorder: "#76d6d5",
  amber: "#feae2c",
  amberText: "#6b4500",
  onSurface: "#0b1c30",
  onSurfaceVariant: "#414848",
  outlineVariant: "#c0c8c7",
  surfaceLowest: "#ffffff",
  primaryBtn: "#001717",
};

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

  const currentPage = navItems.find(n => location === n.path || (n.path !== "/" && location.startsWith(n.path)));

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f8f9ff" }}>
      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col h-full overflow-hidden flex-shrink-0 shadow-none"
        style={{ background: C.sidebar }}
      >
        {/* Logo */}
        <div
          className="flex items-center h-16 px-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${C.sidebarBorder}` }}
        >
          <Link href="/dashboard" className="flex items-center gap-2 min-w-0 overflow-hidden">
            <img
              src="/manus-storage/vantageiq-logo-dark_87cc60c6.svg"
              alt="VantageIQ"
              className="flex-shrink-0 object-contain"
              style={{ height: "28px", width: collapsed ? "28px" : "auto", maxWidth: collapsed ? "28px" : "160px", objectPosition: "left" }}
            />
          </Link>
        </div>

        {/* Org Context */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-3 overflow-hidden"
              style={{ borderBottom: `1px solid ${C.sidebarBorder}` }}
            >
              <p className="text-xs font-medium mb-0.5" style={{ color: C.sidebarTextMuted, fontFamily: "'Inter', sans-serif" }}>
                Organization
              </p>
              <p className="text-sm font-semibold truncate" style={{ color: "#ffffff", fontFamily: "'DM Sans', sans-serif" }}>
                Acme Consulting Group
              </p>
              <p className="text-xs mt-0.5" style={{ color: C.sidebarTextMuted, fontFamily: "'Inter', sans-serif" }}>
                6 sources · synced 4m ago
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav Items */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Tooltip key={item.path} delayDuration={collapsed ? 0 : 9999}>
                <TooltipTrigger asChild>
                  <Link href={item.path}>
                    <motion.div
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-3 py-2.5 transition-colors relative"
                      style={{
                        paddingLeft: collapsed ? "20px" : "24px",
                        paddingRight: collapsed ? "20px" : "16px",
                        background: isActive ? C.sidebarActive : "transparent",
                        color: isActive ? "#ffffff" : C.sidebarText,
                        borderLeft: isActive ? `4px solid ${C.sidebarActiveBorder}` : "4px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLDivElement).style.background = C.sidebarHover;
                          (e.currentTarget as HTMLDivElement).style.color = "#ffffff";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLDivElement).style.background = "transparent";
                          (e.currentTarget as HTMLDivElement).style.color = C.sidebarText;
                        }
                      }}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="text-sm whitespace-nowrap flex-1"
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: isActive ? 600 : 400,
                            }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {!collapsed && item.badge && (
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: C.amber, color: C.amberText }}
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
                    {item.badge && <span className="ml-1.5" style={{ color: C.amber }}>({item.badge})</span>}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom Nav */}
        <div className="py-2" style={{ borderTop: `1px solid ${C.sidebarBorder}` }}>
          {bottomItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            return (
              <Tooltip key={item.path} delayDuration={collapsed ? 0 : 9999}>
                <TooltipTrigger asChild>
                  <Link href={item.path}>
                    <div
                      className="flex items-center gap-3 py-2.5 transition-colors"
                      style={{
                        paddingLeft: collapsed ? "20px" : "24px",
                        paddingRight: collapsed ? "20px" : "16px",
                        background: isActive ? C.sidebarActive : "transparent",
                        color: isActive ? "#ffffff" : C.sidebarText,
                        borderLeft: isActive ? `4px solid ${C.sidebarActiveBorder}` : "4px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLDivElement).style.background = C.sidebarHover;
                          (e.currentTarget as HTMLDivElement).style.color = "#ffffff";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLDivElement).style.background = "transparent";
                          (e.currentTarget as HTMLDivElement).style.color = C.sidebarText;
                        }
                      }}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="text-sm whitespace-nowrap"
                            style={{ fontFamily: "'Inter', sans-serif" }}
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

          {/* User */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className="flex items-center gap-3 py-2.5 cursor-pointer transition-colors"
                style={{
                  paddingLeft: collapsed ? "20px" : "24px",
                  paddingRight: collapsed ? "20px" : "16px",
                  color: C.sidebarText,
                  borderLeft: "4px solid transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = C.sidebarHover;
                  (e.currentTarget as HTMLDivElement).style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "transparent";
                  (e.currentTarget as HTMLDivElement).style.color = C.sidebarText;
                }}
              >
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: C.amber, color: C.amberText }}
                >
                  A
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm whitespace-nowrap"
                      style={{ fontFamily: "'Inter', sans-serif" }}
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
          className="flex items-center justify-center h-8 transition-colors flex-shrink-0"
          style={{
            borderTop: `1px solid ${C.sidebarBorder}`,
            color: C.sidebarTextMuted,
            background: "transparent",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.sidebarHover; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </motion.aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header
          className="h-16 flex items-center justify-between px-6 flex-shrink-0 z-10"
          style={{
            background: C.surfaceLowest,
            borderBottom: `1px solid ${C.outlineVariant}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2" style={{ color: C.onSurfaceVariant }}>
            <span className="text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              Acme Consulting Group
            </span>
            <span className="text-sm opacity-40">/</span>
            <span
              className="text-sm font-semibold"
              style={{ color: C.onSurface, fontFamily: "'DM Sans', sans-serif" }}
            >
              {currentPage?.label ?? "Overview"}
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-sm"
              style={{ color: C.onSurfaceVariant, fontFamily: "'Inter', sans-serif" }}
              onClick={handleSync}
              disabled={syncing}
            >
              <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing..." : "Sync"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              style={{ color: C.onSurfaceVariant }}
              onClick={() => toast.info("Search coming soon")}
            >
              <Search size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              style={{ color: C.onSurfaceVariant }}
              onClick={() => toast.info("No new notifications")}
            >
              <Bell size={16} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white"
                style={{ background: "#ba1a1a" }}
              />
            </Button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ml-1 cursor-pointer"
              style={{ background: C.amber, color: C.amberText }}
            >
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto" style={{ background: "#f8f9ff" }}>
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
