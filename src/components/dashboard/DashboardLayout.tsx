"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ChartBar,
  Calendar,
  Users,
  MapPin,
  Package,
  Archive,
  Gear,
  List,
  X,
  Log,
  CaretLeft,
  CaretRight,
  User,
  Bell,
  CaretDown,
  Plus,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { signOut } from "@/lib/supabase/auth";
import { ThemeToggleCompact } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/components/providers/ThemeProvider";

const navItems = [
  { section: "MAIN", items: [
    { icon: ChartBar, label: "Overview", path: "/dashboard" },
    { icon: Calendar, label: "Events", path: "/dashboard/events" },
    { icon: Users, label: "Members", path: "/dashboard/members" },
    { icon: MapPin, label: "Island Map", path: "/dashboard/map" },
  ]},
  { section: "ANALYTICS", items: [
    { icon: Package, label: "Equipment", path: "/dashboard/equipment" },
    { icon: Archive, label: "Archive", path: "/dashboard/archive" },
  ]},
  { section: "ACCOUNT", items: [
    { icon: User, label: "My Profile", path: "/dashboard/profile" },
    { icon: Gear, label: "Admin Panel", path: "/dashboard/admin" },
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

  useEffect(() => { fetchUnreadCount(); }, []);

  // Layout constants matching the 8-point spacing scale
  const LAYOUT = {
    pagePadding: 24,
    sidebarWidthExpanded: 288,
    sidebarWidthCollapsed: 72,
    sidebarPaddingH: 18,
    sidebarPaddingV: 24,
    topBarHeight: 68,
    topBarPaddingH: 20,
    topBarActionGap: 10,
    topBarControlHeight: 40,
    cardPadding: 24,
    kpiCardPadding: 20,
    cardRowGap: 20,
    sectionGap: 32,
    topBarToHeroGap: 24,
    heroToKpiGap: 24,
    kpiToChartsGap: 32,
    chartsToTableGap: 32,
    navItemHeight: 44,
    brandLogoSize: 40,
    breadcrumbSepSize: 14,
    breadcrumbSepGap: 8,
    notifDotSize: 8,
    notifDotOffset: 8,
  } as const;

  const initials = user.user_metadata?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="flex min-h-screen bg-background" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 z-30 min-h-screen transition-all duration-300 ${sidebarCollapsed ? "w-18" : "w-72"}`}
        style={{
          background: resolvedTheme === "dark" ? "var(--sidebar-bg-dark)" : "var(--sidebar-bg)",
          borderRight: resolvedTheme === "dark" ? "1px solid var(--border-dark)" : "none",
          boxShadow: resolvedTheme === "light" ? "4px 0 20px rgba(163, 177, 198, 0.3)" : "4px 0 20px rgba(0, 0, 0, 0.4)",
          padding: `${LAYOUT.sidebarPaddingV}px ${LAYOUT.sidebarPaddingH}px`,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-1)",
        }}
      >
        <nav className="space-y-6 h-full flex flex-col">
          {/* Brand */}
          <div className="flex items-center gap-3" style={{ padding: "8px 8px 20px" }}>
            <div
              className="flex-shrink-0"
              style={{
                width: LAYOUT.brandLogoSize,
                height: LAYOUT.brandLogoSize,
                borderRadius: 12,
                background: "var(--accent)",
                display: "grid",
                placeItems: "center",
                color: "white",
                fontWeight: 800,
                fontSize: 18,
                boxShadow: resolvedTheme === "dark" ? "0 4px 12px rgba(16,185,129,0.3)" : "var(--neu-raised-sm)",
              }}
            >
              N
            </div>
            {!sidebarCollapsed && (
              <>
                <span className="text-xl font-bold text-foreground">EOD-Ops</span>
              </>
            )}
          </div>

          {/* Search */}
          {!sidebarCollapsed && (
            <div className="relative" style={{ marginBottom: "var(--space-3)" }}>
              <MagnifyingGlass
                className="absolute left-3 top-1/2"
                style={{
                  transform: "translateY(calc(-50% + 1px))",
                  color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)",
                  width: 16,
                  height: 16,
                }}
              />
              <input
                type="text"
                placeholder="Search anything..."
                className={resolvedTheme === "dark" ? "input-mono" : "input-neo"}
                style={{
                  width: "100%",
                  height: LAYOUT.navItemHeight,
                  paddingLeft: 40,
                  borderRadius: 12,
                }}
              />
            </div>
          )}

          {/* Navigation Sections */}
          <div className="space-y-4 flex-1 overflow-y-auto">
            {navItems.map((section) => (
              <div key={section.section} className="space-y-1">
                {!sidebarCollapsed && (
                  <p
                    className="text-xs font-semibold text-tertiary uppercase tracking-wider"
                    style={{
                      padding: `var(--space-3) var(--space-3) var(--space-2) 44px`,
                      letterSpacing: "0.08em",
                      fontSize: "10.5px",
                    }}
                  >
                    {section.section}
                  </p>
                )}
                {section.items.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 rounded-xl transition-all duration-200 ${isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"} ${sidebarCollapsed ? "justify-center" : "h-11 px-3"}`}
                        style={{
                          background: isActive
                            ? resolvedTheme === "dark"
                              ? "var(--accent-soft-dark)"
                              : "var(--accent-soft)"
                            : undefined,
                          boxShadow: isActive && resolvedTheme === "light" ? "var(--neu-pressed)" : undefined,
                          borderLeft: isActive ? "4px solid var(--accent)" : "none",
                          borderRadius: isActive ? "0 12px 12px 0" : "12px",
                          height: LAYOUT.navItemHeight,
                          color: resolvedTheme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)",
                        }}
                      >
                        <item.icon
                          className="h-5 w-5 flex-shrink-0"
                          style={{
                            transform: "translateY(1px)",
                            width: 20,
                            height: 20,
                          }}
                        />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* User Profile & Collapse Toggle */}
          <div className="border-t pt-4 space-y-4" style={{ borderColor: resolvedTheme === "dark" ? "var(--border-dark)" : "var(--border)" }}>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{
                background: resolvedTheme === "dark" ? "var(--surface-raised-dark)" : "rgba(124, 58, 237, 0.1)",
                border: resolvedTheme === "dark" ? "1px solid var(--border-dark)" : "none",
              }}>
                <div
                  className="flex-shrink-0"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                    display: "grid",
                    placeItems: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate" style={{ color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)" }}>
                    {user.user_metadata?.full_name || user.email || "User"}
                  </p>
                  <p className="text-xs text-tertiary truncate" style={{ color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)" }}>{user.email}</p>
                </div>
                <CaretDown className="h-4 w-4 text-tertiary" style={{ transform: "translateY(1px)" }} />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`rounded-xl transition-all duration-200 mx-auto ${sidebarCollapsed ? "rotate-180" : ""}`}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              style={{ width: 40, height: 40 }}
            >
              {sidebarCollapsed ? <CaretRight className="h-5 w-5" /> : <CaretLeft className="h-5 w-5" />}
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen ${sidebarCollapsed ? "lg:ml-18" : "lg:ml-72"}`}>
        {/* Top Bar */}
        <header
          className="fixed top-0 right-0 z-20 border-b backdrop-blur-sm transition-all duration-300"
          style={{
            left: sidebarCollapsed ? "72px" : "288px",
            background: resolvedTheme === "dark" ? "var(--topbar-bg-dark)" : "var(--topbar-bg)",
            borderColor: resolvedTheme === "dark" ? "var(--border-dark)" : "var(--border)",
            boxShadow: resolvedTheme === "light" ? "0 1px 3px rgba(163, 177, 198, 0.3)" : "0 1px 3px rgba(0, 0, 0, 0.3)",
            height: LAYOUT.topBarHeight,
          }}
        >
          <div className="flex items-center justify-between gap-4 h-full" style={{ padding: `0 ${LAYOUT.topBarPaddingH}px` }}>
            {/* Breadcrumbs & Mobile Menu */}
            <div className="flex items-center gap-4 flex-1">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ height: LAYOUT.topBarControlHeight, width: LAYOUT.topBarControlHeight }}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
              </Button>
              <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb" style={{ lineHeight: "1", gap: LAYOUT.breadcrumbSepGap }}>
                <Link href="/dashboard" className="text-tertiary hover:text-foreground transition-colors" style={{ color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)" }}>
                  Dashboard
                </Link>
                <CaretRight className="h-3.5 w-3.5 text-tertiary flex-shrink-0" style={{ transform: "translateY(1px)", width: 14, height: 14 }} />
                <span className="text-foreground font-medium" style={{ color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)" }}>
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
                  className="icon-btn-unified"
                  aria-label="Notifications"
                  style={{ height: LAYOUT.topBarControlHeight, width: LAYOUT.topBarControlHeight }}
                >
                  <Bell className="h-5 w-5" />
                  {unreadMessagesCount > 0 && (
                    <span className="notif-dot" style={{
                      width: LAYOUT.notifDotSize,
                      height: LAYOUT.notifDotSize,
                      top: LAYOUT.notifDotOffset,
                      right: LAYOUT.notifDotOffset,
                    }} />
                  )}
                </Button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 card-neo dark:card-mono shadow-lg animate-fade-in z-50">
                    <div className="p-5 border-b" style={{ borderColor: resolvedTheme === "dark" ? "var(--border-dark)" : "var(--border)" }}>
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="p-4 border-b" style={{ borderColor: resolvedTheme === "dark" ? "var(--border-dark)" : "var(--border)" }}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0" style={{ background: "var(--accent)" }}>
                            📋
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">Welcome to EOD-Ops</p>
                            <p className="text-xs text-tertiary">Your dashboard is ready</p>
                            <p className="text-xs text-tertiary mt-1">Just now</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-t" style={{ borderColor: resolvedTheme === "dark" ? "var(--border-dark)" : "var(--border)" }}>
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
                  className="icon-btn-unified"
                  aria-label="User menu"
                  style={{ height: LAYOUT.topBarControlHeight, width: LAYOUT.topBarControlHeight }}
                >
                  <div
                    className="flex-shrink-0"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                      display: "grid",
                      placeItems: "center",
                      color: "white",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {initials}
                  </div>
                </Button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 card-neo dark:card-mono shadow-lg animate-fade-in z-50">
                    <div className="p-3 border-b" style={{ borderColor: resolvedTheme === "dark" ? "var(--border-dark)" : "var(--border)" }}>
                      <p className="text-sm font-medium text-foreground truncate">{user.user_metadata?.full_name || "User"}</p>
                      <p className="text-xs text-tertiary truncate">{user.email}</p>
                    </div>
                    <Link href="/dashboard/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg mx-2 my-1">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <Link href="/dashboard/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg mx-2 my-1">
                      <Gear className="h-4 w-4" /> Admin Panel
                    </Link>
                    <hr className="border-border my-1 mx-2" style={{ borderColor: resolvedTheme === "dark" ? "var(--border-dark)" : "var(--border)" }} />
                    <button onClick={() => signOut()} className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg mx-2 my-1 w-full">
                      <Log className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 pt-20 pb-8 lg:pb-0 animate-fade-in" style={{ padding: `0 ${LAYOUT.pagePadding}px ${LAYOUT.pagePadding}px` }}>
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