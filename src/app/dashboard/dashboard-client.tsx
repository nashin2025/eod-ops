"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useRouter, usePathname } from "next/navigation";
import { Calendar, Users, MapPin, CheckCircle, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Activity, BarChart3, PieChart, DollarSign, ShoppingCart, Clock, ArrowUpRight, ArrowDownRight, Minus, Plus, Search, Bell, Sun, Moon, Menu, X, ChevronLeft, ChevronRight, User, LogOut, Settings, Archive, Package, Map, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggleCompact } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/components/providers/ThemeProvider";

interface Event {
  id: string;
  title: string;
  atoll: string;
  island: string;
  eventLocation?: string;
  status: string;
  participantCount: number;
  eventDate?: string;
  createdAt?: string;
  contact?: string;
  comment?: string;
}

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
}

interface KPIData {
  label: string;
  value: string;
  delta: number;
  deltaLabel: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
  sparkline: number[];
}

interface ChartDataPoint {
  label: string;
  value: number;
}

const navItems = [
  { section: "MAIN", items: [
    { icon: BarChart3, label: "Overview", path: "/dashboard" },
    { icon: Calendar, label: "Events", path: "/dashboard/events" },
    { icon: Users, label: "Members", path: "/dashboard/members" },
    { icon: Map, label: "Island Map", path: "/dashboard/map" },
  ]},
  { section: "ANALYTICS", items: [
    { icon: Package, label: "Equipment", path: "/dashboard/equipment" },
    { icon: Archive, label: "Archive", path: "/dashboard/archive" },
  ]},
  { section: "ACCOUNT", items: [
    { icon: User, label: "My Profile", path: "/dashboard/profile" },
    { icon: Settings, label: "Admin Panel", path: "/dashboard/admin" },
  ]},
];

const kpiData: KPIData[] = [
  {
    label: "Total Revenue",
    value: "$127,430",
    delta: 12.5,
    deltaLabel: "vs last month",
    icon: <DollarSign className="h-5 w-5" />,
    trend: "up",
    sparkline: [45, 52, 38, 65, 71, 58, 82, 78, 92, 88, 95, 102]
  },
  {
    label: "Active Users",
    value: "2,847",
    delta: 8.2,
    deltaLabel: "vs last week",
    icon: <Users className="h-5 w-5" />,
    trend: "up",
    sparkline: [2100, 2150, 2080, 2200, 2340, 2290, 2450, 2510, 2600, 2680, 2750, 2847]
  },
  {
    label: "Conversion Rate",
    value: "3.24%",
    delta: -2.1,
    deltaLabel: "vs last month",
    icon: <TrendingUp className="h-5 w-5" />,
    trend: "down",
    sparkline: [3.8, 3.6, 3.7, 3.5, 3.4, 3.3, 3.4, 3.2, 3.1, 3.15, 3.2, 3.24]
  },
  {
    label: "Avg. Session",
    value: "4m 32s",
    delta: 5.7,
    deltaLabel: "vs last week",
    icon: <Clock className="h-5 w-5" />,
    trend: "up",
    sparkline: [240, 255, 248, 262, 270, 265, 272, 275, 270, 273, 271, 272]
  },
];

const revenueData: ChartDataPoint[] = [
  { label: "Jan", value: 42000 },
  { label: "Feb", value: 38000 },
  { label: "Mar", value: 52000 },
  { label: "Apr", value: 48000 },
  { label: "May", value: 61000 },
  { label: "Jun", value: 55000 },
  { label: "Jul", value: 67000 },
  { label: "Aug", value: 72000 },
  { label: "Sep", value: 68000 },
  { label: "Oct", value: 78000 },
  { label: "Nov", value: 82000 },
  { label: "Dec", value: 95000 },
];

const trafficSources = [
  { label: "Direct", value: 42, color: "hsl(var(--accent))" },
  { label: "Organic Search", value: 28, color: "hsl(var(--accent)/0.7)" },
  { label: "Referral", value: 15, color: "hsl(var(--accent)/0.5)" },
  { label: "Social", value: 10, color: "hsl(var(--accent)/0.35)" },
  { label: "Email", value: 5, color: "hsl(var(--accent)/0.2)" },
];

const recentActivity = [
  { id: 1, type: "event_created", title: "New event created", description: "Annual Atoll Festival scheduled", time: "2 min ago", avatar: "AF", color: "hsl(var(--accent))" },
  { id: 2, type: "user_joined", title: "New member joined", description: "Sarah Chen joined the team", time: "15 min ago", avatar: "SC", color: "hsl(var(--primary))" },
  { id: 3, type: "milestone", title: "Milestone reached", description: "100th island visit completed", time: "1 hour ago", avatar: "🏝️", color: "hsl(var(--accent))" },
  { id: 4, type: "event_completed", title: "Event completed", description: "Marine Conservation Workshop", time: "3 hours ago", avatar: "✓", color: "#10B981" },
  { id: 5, type: "alert", title: "Low inventory alert", description: "Diving equipment running low", time: "5 hours ago", avatar: "⚠", color: "#F59E0B" },
];

// Layout constants matching the 8-point spacing scale
const LAYOUT = {
  pagePadding: 24,           // --space-6
  sidebarWidthExpanded: 288, // w-72
  sidebarWidthCollapsed: 72, // w-18
  sidebarPaddingH: 18,       // intentional
  sidebarPaddingV: 24,       // --space-6
  topBarHeight: 68,          // target
  topBarPaddingH: 20,        // --space-5
  topBarActionGap: 10,       // 10px
  topBarControlHeight: 40,   // 40px
  cardPadding: 24,           // --space-6
  kpiCardPadding: 20,        // --space-5
  cardRowGap: 20,            // --space-5
  sectionGap: 32,            // --space-7
  topBarToHeroGap: 24,       // --space-6
  heroToKpiGap: 24,          // --space-6
  kpiToChartsGap: 32,        // --space-7
  chartsToTableGap: 32,      // --space-7
  navItemHeight: 44,         // 44px tap-friendly
  brandLogoSize: 40,         // 40x40
  breadcrumbSepSize: 14,     // 14x14
  breadcrumbSepGap: 8,       // 8px each side
  notifDotSize: 8,           // 8px diameter
  notifDotOffset: 8,         // 8px from top/right
} as const;

export default function DashboardClient({
  user,
  events,
  users,
  activeEventsCount,
  completedEventsCount,
  visitedIslands,
  atollsVisited,
  teamMembersCount,
}: {
  user: { id: string; email?: string; user_metadata?: { full_name?: string; avatar_url?: string } };
  events: Event[];
  users: User[];
  activeEventsCount: number;
  completedEventsCount: number;
  visitedIslands: number;
  atollsVisited: number;
  teamMembersCount: number;
}) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>("date");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname() || "/dashboard";
  const { theme, setTheme, resolvedTheme } = useTheme();

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/chat/unread-count", { credentials: "include" });
      const data = await res.json();
      setUnreadMessagesCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const toggleEventExpansion = (eventId: string) => {
    const newExpandedEvents = new Set(expandedEvents);
    if (newExpandedEvents.has(eventId)) {
      newExpandedEvents.delete(eventId);
    } else {
      newExpandedEvents.add(eventId);
    }
    setExpandedEvents(newExpandedEvents);
  };

  const recentEvents = events
    .sort((a, b) => {
      if (sortBy === "atoll") return a.atoll.localeCompare(b.atoll);
      else if (sortBy === "island") return a.island.localeCompare(b.island);
      else return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    })
    .slice(0, 6);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active":
        return "bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))] dark:bg-[hsl(var(--accent)/0.2)] dark:text-[hsl(var(--accent))]";
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    }
  };

  const getSparklinePath = (data: number[], width: number = 120, height: number = 32) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    return data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(" ");
  };

  // Sidebar style object
  const sidebarStyle = {
    boxShadow: sidebarCollapsed 
      ? "none" 
      : resolvedTheme === "dark"
        ? "0 4px 6px rgba(0, 0, 0, 0.4)"
        : "0 1px 3px rgba(163, 177, 198, 0.3)",
  };

  // Top bar style object
  const topBarStyle = {
    left: sidebarCollapsed ? LAYOUT.sidebarWidthCollapsed : LAYOUT.sidebarWidthExpanded,
    boxShadow: resolvedTheme === "light"
      ? "0 1px 3px rgba(163, 177, 198, 0.3)"
      : "0 1px 3px rgba(0, 0, 0, 0.3)",
  };

  // Main content style
  const mainStyle = {
    marginLeft: sidebarCollapsed ? LAYOUT.sidebarWidthCollapsed : LAYOUT.sidebarWidthExpanded,
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 z-30 bg-card border-r border-border min-h-screen transition-all duration-300
          ${sidebarCollapsed ? "w-18" : "w-72"}
        `}
        style={sidebarStyle}
      >
        <nav className="p-space-6 space-y-6 h-full flex flex-col" style={{ paddingLeft: LAYOUT.sidebarPaddingH, paddingRight: LAYOUT.sidebarPaddingH }}>
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div 
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center flex-col"
              style={{
                background: 'hsl(var(--background))',
                boxShadow: resolvedTheme === "dark"
                  ? "0 2px 8px rgba(0,0,0,0.4)"
                  : "inset 2px 2px 4px var(--shadow-inset-dark), inset -2px -2px 4px var(--shadow-inset-light)"
              }}
            >
              <div className="w-5 h-5 rounded-full" style={{ background: 'hsl(var(--accent))' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-white/70 mt-0.5" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-xl font-bold text-foreground">EOD-Ops</span>
            )}
          </div>

          {/* Search */}
          {!sidebarCollapsed && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="input-neo dark:input-mono pl-10 w-full"
                style={{ height: LAYOUT.navItemHeight }}
              />
            </div>
          )}

          {/* Navigation Sections */}
          <div className="space-y-4 flex-1 overflow-y-auto">
            {navItems.map((section) => (
              <div key={section.section} className="space-y-1">
                {!sidebarCollapsed && (
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3 mb-2">
                    {section.section}
                  </p>
                )}
                {section.items.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <a key={item.path} href={item.path}>
                      <Button
                        variant="ghost"
                        className={`
                          w-full justify-start gap-3 rounded-xl transition-all duration-200
                          ${isActive
                            ? "text-[hsl(var(--accent))] bg-[hsl(var(--accent)/0.1)]"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }
                          ${sidebarCollapsed ? "justify-center p-3" : "h-11 px-3"}
                        `}
                        style={{
                          borderLeft: isActive ? "4px solid hsl(var(--accent))" : "none",
                          borderRadius: isActive ? "0 12px 12px 0" : "12px",
                          height: LAYOUT.navItemHeight,
                        }}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" style={{ transform: "translateY(1px)" }} />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </Button>
                    </a>
                  );
                })}
              </div>
            ))}
          </div>

          {/* User Profile & Collapse Toggle */}
          <div className="border-t border-border pt-4 space-y-4">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--muted)/0.3)]">
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-[hsl(var(--accent))]" 
                  style={{ background: 'hsl(var(--accent)/0.15)' }}
                >
                  {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.user_metadata?.full_name || user.email || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`
                rounded-xl transition-all duration-200 mx-auto
                ${sidebarCollapsed ? "rotate-180" : ""}
              `}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              style={{ width: 40, height: 40 }}
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen" style={mainStyle}>
        {/* Top Bar */}
        <header 
          className="fixed top-0 left-0 right-0 z-20 bg-card/80 backdrop-blur-sm border-b border-border transition-all duration-300"
          style={topBarStyle}
        >
          <div className="px-space-5 py-4" style={{ height: LAYOUT.topBarHeight }}>
            <div className="flex items-center justify-between gap-4 h-full">
              {/* Breadcrumbs & Mobile Menu */}
              <div className="flex items-center gap-4 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  style={{ height: LAYOUT.topBarControlHeight, width: LAYOUT.topBarControlHeight }}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
                <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb" style={{ lineHeight: "1.5" }}>
                  <span className="text-muted-foreground">Dashboard</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground font-medium">
                    {navItems.flatMap(s => s.items).find(i => i.path === pathname)?.label || "Overview"}
                  </span>
                </nav>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-[10px]">
                {/* Theme Toggle */}
                <ThemeToggleCompact />

                {/* Notifications */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="rounded-xl btn-neo-secondary dark:btn-mono-secondary"
                    aria-label="Notifications"
                    style={{ height: LAYOUT.topBarControlHeight, width: LAYOUT.topBarControlHeight }}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadMessagesCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white text-xs font-medium flex items-center justify-center">
                        {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
                      </span>
                    )}
                  </Button>
                  {notificationsOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 card-neo dark:card-mono shadow-lg animate-fade-in z-50">
                      <div className="p-space-5 border-b border-border">
                        <h3 className="font-semibold">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {recentActivity.slice(0, 3).map((activity) => (
                          <div key={activity.id} className="p-space-4 border-b border-border hover:bg-muted/30 transition-colors">
                            <div className="flex items-start gap-3">
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0" 
                                style={{ background: activity.color }}
                              >
                                {activity.avatar}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                                <p className="text-xs text-muted-foreground">{activity.description}</p>
                                <p className="text-xs text-tertiary mt-1">{activity.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-space-3 border-t border-border">
                        <a href="#" className="text-sm text-accent hover:underline block text-center">View all notifications</a>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="rounded-xl btn-neo-secondary dark:btn-mono-secondary"
                    aria-label="User menu"
                    style={{ height: LAYOUT.topBarControlHeight, width: LAYOUT.topBarControlHeight }}
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-[hsl(var(--accent))]" 
                      style={{ background: 'hsl(var(--accent)/0.15)' }}
                    >
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </div>
                  </Button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 card-neo dark:card-mono shadow-lg animate-fade-in z-50">
                      <div className="p-space-3 border-b border-border">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.user_metadata?.full_name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <a href="/dashboard/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg mx-2 my-1">
                        <User className="h-4 w-4" /> Profile
                      </a>
                      <a href="/dashboard/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg mx-2 my-1">
                        <Settings className="h-4 w-4" /> Admin Panel
                      </a>
                      <hr className="border-border my-1 mx-2" />
                      <button onClick={() => {}} className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg mx-2 my-1 w-full">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 pt-[88px] pb-space-6 px-space-6 lg:pb-0 animate-fade-in">
          {/* Welcome Hero */}
          <div className="mb-space-6">
            <div className="card-neo dark:card-mono p-space-6 sm:p-space-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1 leading-tight">
                    Welcome back, {user.user_metadata?.full_name?.split(" ")[0] || "there"}!
                  </h1>
                  <p className="text-muted-foreground mt-1">Here's what's happening with your events today.</p>
                </div>
                <Button className="btn-neo-accent dark:btn-mono-primary w-full sm:w-auto mt-4 sm:mt-0" style={{ height: 48, paddingLeft: 24, paddingRight: 24 }}>
                  <Plus className="h-4 w-4 mr-2" style={{ transform: "translateY(1px)" }} />
                  Create Report
                </Button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-5 mb-space-7 items-stretch">
            {kpiData.map((kpi, index) => (
              <Card key={kpi.label} className="card-neo dark:card-mono" style={{ padding: LAYOUT.kpiCardPadding, animationDelay: `${index * 80}ms` }}>
                <div className="flex items-start justify-between h-full">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                      <span 
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-[hsl(var(--accent))] flex-shrink-0"
                        style={{ background: 'hsl(var(--accent)/0.12)' }}
                      >
                        {kpi.icon}
                      </span>
                      <span className="font-medium uppercase tracking-wider">{kpi.label}</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums leading-tight">{kpi.value}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`flex items-center gap-1 text-sm font-medium ${
                        kpi.trend === "up" ? "text-green-500" : kpi.trend === "down" ? "text-red-500" : "text-muted-foreground"
                      }`}>
                        {kpi.trend === "up" && <TrendingUp className="h-3.5 w-3.5" style={{ transform: "translateY(1px)" }} />}
                        {kpi.trend === "down" && <TrendingDown className="h-3.5 w-3.5" style={{ transform: "translateY(1px)" }} />}
                        {kpi.trend === "neutral" && <Minus className="h-3.5 w-3.5" />}
                        <span className="tabular-nums">{Math.abs(kpi.delta)}%</span>
                      </span>
                      <span className="text-xs text-muted-foreground">{kpi.deltaLabel}</span>
                    </div>
                    {/* Sparkline */}
                    <div className="mt-3 h-10 w-full">
                      <svg viewBox="0 0 120 32" className="w-full h-full" aria-hidden="true">
                        <defs>
                          <linearGradient id={`sparkline-gradient-${kpi.label.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d={`M${getSparklinePath(kpi.sparkline)}`}
                          stroke="hsl(var(--accent))"
                          strokeWidth="2"
                          fill={`url(#sparkline-gradient-${kpi.label.replace(/\s+/g, '-')})`}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts Section - 12-column grid */}
          <div className="grid grid-cols-12 gap-space-5 mb-space-7">
            {/* Revenue Chart - 8 columns (2/3) */}
            <Card className="card-neo dark:card-mono col-span-12 lg:col-span-8 p-space-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-foreground">Revenue Overview</h2>
                <select className="input-neo dark:input-mono text-sm py-2 px-3" style={{ height: 40 }}>
                  <option>Last 12 Months</option>
                  <option>Last 6 Months</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="h-64 relative">
                <svg viewBox="0 0 560 256" className="w-full h-full" aria-label="Revenue chart" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="revenue-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  <g stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.5">
                    {[0, 64, 128, 192, 256].map((y) => (
                      <line key={y} x1="40" y1={y} x2="520" y2={y} />
                    ))}
                    {revenueData.map((_, i) => (
                      <line key={i} x1={40 + i * 44} y1="0" x2={40 + i * 44} y2="256" />
                    ))}
                  </g>
                  {/* Area */}
                  <path
                    d={`M${revenueData.map((d, i) => {
                      const x = 40 + i * 44;
                      const y = 256 - (d.value / 100000) * 200;
                      return `${x},${y}`;
                    }).join(" L")}`}
                    fill="url(#revenue-gradient)"
                    stroke="none"
                  />
                  {/* Line */}
                  <path
                    d={`M${revenueData.map((d, i) => {
                      const x = 40 + i * 44;
                      const y = 256 - (d.value / 100000) * 200;
                      return `${x},${y}`;
                    }).join(" L")}`}
                    stroke="hsl(var(--accent))"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Dots */}
                  {revenueData.map((d, i) => (
                    <circle
                      key={i}
                      cx={40 + i * 44}
                      cy={256 - (d.value / 100000) * 200}
                      r={4}
                      fill="hsl(var(--accent))"
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    />
                  ))}
                  {/* X-axis labels */}
                  {revenueData.map((d, i) => (
                    <text
                      key={d.label}
                      x={40 + i * 44}
                      y={270}
                      textAnchor="middle"
                      fontSize="10"
                      fill="hsl(var(--muted-foreground))"
                      fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
                    >
                      {d.label}
                    </text>
                  ))}
                </svg>
              </div>
            </Card>

            {/* Traffic Sources - 4 columns (1/3) */}
            <Card className="card-neo dark:card-mono col-span-12 lg:col-span-4 p-space-6">
              <h2 className="text-lg font-semibold text-foreground mb-5">Traffic Sources</h2>
              <div className="flex items-center justify-center h-48 relative">
                <svg viewBox="0 0 200 200" className="w-[160px] h-[160px]">
                  {(() => {
                    let startAngle = -90;
                    return trafficSources.map((source, i) => {
                      const angle = (source.value / 100) * 360;
                      const endAngle = startAngle + angle;
                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;
                      const x1 = 100 + 70 * Math.cos(startRad);
                      const y1 = 100 + 70 * Math.sin(startRad);
                      const x2 = 100 + 70 * Math.cos(endRad);
                      const y2 = 100 + 70 * Math.sin(endRad);
                      const largeArc = angle > 180 ? 1 : 0;
                      
                      startAngle = endAngle;
                      return (
                        <path
                          key={source.label}
                          d={`M100,100 L${x1},${y1} A70,70 0 ${largeArc},1 ${x2},${y2} Z`}
                          fill={source.color}
                          stroke="hsl(var(--background))"
                          strokeWidth={3}
                        />
                      );
                    });
                  })()}
                </svg>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {trafficSources.map((source) => (
                  <div key={source.label} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--muted)/0.3)]">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: source.color }} />
                    <span className="text-xs font-medium text-foreground">{source.label}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{source.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Data Table Section - matches charts row 8+4 grid */}
          <div className="grid grid-cols-12 gap-space-5 mb-space-7">
            {/* Table - 8 columns */}
            <Card className="card-neo dark:card-mono col-span-12 lg:col-span-8 overflow-hidden">
              <div className="p-space-6 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-lg font-semibold text-foreground">Recent Events</h2>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input-neo dark:input-mono text-sm py-2 px-3 w-full sm:w-auto"
                    style={{ height: 40 }}
                  >
                    <option value="date">Sort by Date</option>
                    <option value="atoll">Sort by Atoll</option>
                    <option value="island">Sort by Island</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Event</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Location</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Date</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Participants</th>
                      <th className="px-0 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pr-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentEvents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                          No events yet. Create your first event to get started!
                        </td>
                      </tr>
                    ) : (
                      recentEvents.map((event, index) => (
                        <tr key={event.id} className="hover:bg-muted/30 transition-colors animate-stagger-in" style={{ animationDelay: `${index * 60}ms` }}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: 'hsl(var(--accent)/0.12)' }}
                              >
                                <Calendar className="h-5 w-5" style={{ color: 'hsl(var(--accent))' }} />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{event.title}</p>
                                <p className="text-xs text-muted-foreground">{event.atoll} • {event.island}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell text-sm text-muted-foreground">
                            {event.eventLocation || "Not specified"}
                          </td>
                          <td className="px-5 py-4 hidden lg:table-cell text-sm text-muted-foreground">
                            {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "TBD"}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(event.status)}`}>
                              {event.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 hidden lg:table-cell text-sm text-foreground tabular-nums">
                            {event.participantCount || 0}
                          </td>
                          <td className="px-0 py-4 text-right pr-5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleEventExpansion(event.id)}
                              className="btn-neo-secondary dark:btn-mono-secondary"
                              style={{ height: 36, paddingLeft: 10, paddingRight: 10 }}
                            >
                              {expandedEvents.has(event.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Expanded Event Details */}
              {recentEvents.some(e => expandedEvents.has(e.id)) && (
                <div className="border-t border-border animate-slide-up">
                  {recentEvents.filter(e => expandedEvents.has(e.id)).map((event) => (
                    <div key={event.id} className="p-space-6 bg-[hsl(var(--muted)/0.2)]">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</p>
                          <p className="text-sm text-foreground mt-1">{event.eventLocation || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Participants</p>
                          <p className="text-sm text-foreground mt-1 tabular-nums">{event.participantCount || 0}</p>
                        </div>
                        {event.eventDate && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</p>
                            <p className="text-sm text-foreground mt-1">{new Date(event.eventDate).toLocaleDateString()}</p>
                          </div>
                        )}
                        {event.contact && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</p>
                            <p className="text-sm text-foreground mt-1">{event.contact}</p>
                          </div>
                        )}
                      </div>
                      {event.comment && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Notes</p>
                          <p className="text-sm text-foreground mt-1">{event.comment}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Quick Actions / Activity - 4 columns */}
            <Card className="card-neo dark:card-mono col-span-12 lg:col-span-4 p-space-6">
              <h2 className="text-lg font-semibold text-foreground mb-5">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { icon: Plus, label: "Create Event", desc: "Schedule new event" },
                  { icon: Users, label: "Add Member", desc: "Invite team member" },
                  { icon: MapPin, label: "Log Visit", desc: "Record island visit" },
                  { icon: Package, label: "Add Equipment", desc: "Log new equipment" },
                ].map((action, i) => (
                  <div key={action.label} className="p-4 rounded-xl bg-[hsl(var(--muted)/0.3)] hover:bg-[hsl(var(--muted)/0.5)] transition-colors cursor-pointer" style={{ paddingTop: 18, paddingBottom: 18, paddingLeft: 14, paddingRight: 14 }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[hsl(var(--accent))]" style={{ background: 'hsl(var(--accent)/0.12)' }}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-foreground mt-2">{action.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{action.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="pt-5 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Activity</h3>
                <div className="space-y-2">
                  {recentActivity.slice(0, 4).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[hsl(var(--muted)/0.3)] transition-colors" style={{ paddingTop: 12, paddingBottom: 12, paddingLeft: 12, paddingRight: 12 }}>
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0 mt-1" 
                        style={{ background: activity.color }}
                      >
                        {activity.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-tertiary mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-20 lg:hidden bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}