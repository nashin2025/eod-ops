"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Calendar,
  Users,
  Map,
  Package,
  Archive,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  MessageCircle,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";
import { signOut } from "@/lib/supabase/auth";
import { ThemeToggleCompact } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/components/providers/ThemeProvider";

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

interface DashboardLayoutProps {
  children: ReactNode;
  user: { id: string; email?: string; user_metadata?: { full_name?: string; avatar_url?: string } };
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/chat/unread-count", { credentials: "include" });
      const data = await res.json();
      setUnreadMessagesCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 z-30 bg-card border-r border-border min-h-screen transition-all duration-300
          ${sidebarCollapsed ? "w-18" : "w-72"}
        `}
        style={{ 
          boxShadow: resolvedTheme === "light" ? "4px 0 20px rgba(163, 177, 198, 0.3)" : "4px 0 20px rgba(0, 0, 0, 0.4)"
        }}
      >
        <nav className="p-4 space-y-6 h-full flex flex-col">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center flex-col" 
                 style={{ 
                   background: 'hsl(var(--background))',
                   boxShadow: resolvedTheme === "dark" 
                     ? "0 2px 8px rgba(0,0,0,0.4)" 
                     : "inset 2px 2px 4px var(--shadow-inset-dark), inset -2px -2px 4px var(--shadow-inset-light)"
                 }}>
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
              />
            </div>
          )}

          {/* Navigation Sections */}
          <div className="space-y-4 flex-1 overflow-y-auto">
            {navItems.map((section) => (
              <div key={section.section} className="space-y-1">
                {!sidebarCollapsed && (
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.section}
                  </p>
                )}
                {section.items.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <Button
                        variant="ghost"
                        className={`
                          w-full justify-start gap-3 rounded-xl transition-all duration-200
                          ${isActive 
                            ? "text-[hsl(var(--accent))] bg-[hsl(var(--accent)/0.1)]" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }
                          ${sidebarCollapsed ? "justify-center p-3" : "p-3"}
                        `}
                        style={{
                          borderLeft: isActive ? "4px solid hsl(var(--accent))" : "none",
                          borderRadius: isActive ? "0 12px 12px 0" : "12px",
                        }}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* User Profile & Collapse Toggle */}
          <div className="border-t border-border pt-4 space-y-3">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--muted)/0.3)]">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-[hsl(var(--accent))]" 
                     style={{ background: 'hsl(var(--accent)/0.15)' }}>
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
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`
        flex-1 flex flex-col min-h-screen 
        ${sidebarCollapsed ? "lg:ml-18" : "lg:ml-72"}
      `}>
        {/* Top Bar */}
        <header className="fixed top-0 right-0 z-20 bg-card/80 backdrop-blur-sm border-b border-border transition-all duration-300"
              style={{ 
                left: sidebarCollapsed ? "72px" : "288px",
                boxShadow: resolvedTheme === "light" 
                  ? "0 1px 3px rgba(163, 177, 198, 0.3)" 
                  : "0 1px 3px rgba(0, 0, 0, 0.3)"
              }}>
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Breadcrumbs & Mobile Menu */}
              <div className="flex items-center gap-4 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
                <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
                  <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-foreground font-medium">
                    {navItems.flatMap(s => s.items).find(i => i.path === pathname)?.label || "Overview"}
                  </span>
                </nav>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
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
                      <div className="p-4 border-b border-border">
                        <h3 className="font-semibold">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        <div className="p-4 border-b border-border">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0" style={{ background: 'hsl(var(--accent))' }}>
                              📋
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">Welcome to EOD-Ops</p>
                              <p className="text-xs text-muted-foreground">Your dashboard is ready</p>
                              <p className="text-xs text-muted-foreground mt-1">Just now</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 border-t border-border">
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
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-[hsl(var(--accent))]" 
                         style={{ background: 'hsl(var(--accent)/0.15)' }}>
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </div>
                  </Button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 card-neo dark:card-mono shadow-lg animate-fade-in z-50">
                      <div className="p-3 border-b border-border">
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
                      <button onClick={() => signOut()} className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg mx-2 my-1 w-full">
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
        <main className="flex-1 pt-20 pb-8 lg:pb-0 px-4 sm:px-6 lg:px-8 animate-fade-in">
          {children}
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