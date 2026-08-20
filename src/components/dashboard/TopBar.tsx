"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, User, Gear, Log, CaretDown, List, X, MagnifyingGlass, ChartBar, Calendar, Users, MapPin, Package, Archive } from "@phosphor-icons/react";
import { ThemeToggleCompact } from "@/components/ui/ThemeToggle";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown";
import { signOut } from "@/lib/supabase/auth";
import { useTheme } from "@/components/providers/ThemeProvider";

interface TopBarProps {
  user: { id: string; email?: string; user_metadata?: { full_name?: string; avatar_url?: string } };
  sidebarCollapsed: boolean;
}

export function TopBar({ user, sidebarCollapsed }: TopBarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  const LAYOUT = {
    topBarHeight: 68,
    topBarPaddingH: 20,
    topBarActionGap: 10,
    topBarControlHeight: 40,
    breadcrumbSepSize: 14,
    breadcrumbSepGap: 8,
    notifDotSize: 8,
    notifDotOffset: 8,
  } as const;

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

  const initials = user.user_metadata?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.email?.charAt(0).toUpperCase() || "U";

  const navItems = [
    { icon: ChartBar, label: "Overview", path: "/dashboard" },
    { icon: Calendar, label: "Events", path: "/dashboard/events" },
    { icon: Users, label: "Members", path: "/dashboard/members" },
    { icon: MapPin, label: "Island Map", path: "/dashboard/map" },
    { icon: Package, label: "Equipment", path: "/dashboard/equipment" },
    { icon: Archive, label: "Archive", path: "/dashboard/archive" },
    { icon: User, label: "Profile", path: "/dashboard/profile" },
    { icon: Gear, label: "Admin", path: "/dashboard/admin" },
  ];

  const currentPage = navItems.find(i => i.path === pathname)?.label || "Overview";

  return (
    <header
      className="fixed top-0 right-0 z-20 border-b backdrop-blur-sm transition-all duration-300"
      style={{
        left: sidebarCollapsed ? "72px" : "288px",
        background: resolvedTheme === "dark" ? "var(--topbar-bg-dark)" : "var(--topbar-bg)",
        borderColor: resolvedTheme === "dark" ? "var(--border-dark)" : "var(--border)",
        boxShadow: resolvedTheme === "light"
          ? "0 1px 3px rgba(163, 177, 198, 0.3)"
          : "0 1px 3px rgba(0, 0, 0, 0.3)",
        height: LAYOUT.topBarHeight,
      }}
    >
      <div className="flex items-center justify-between gap-4 h-full" style={{ padding: `0 ${LAYOUT.topBarPaddingH}px` }}>
        {/* Breadcrumbs & Mobile Menu */}
        <div className="flex items-center gap-4 flex-1">
          <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb" style={{ lineHeight: "1", gap: LAYOUT.breadcrumbSepGap }}>
            <Link href="/dashboard" className="text-tertiary hover:text-foreground transition-colors" style={{ color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)" }}>
              Dashboard
            </Link>
            <CaretDown className="h-3.5 w-3.5 text-tertiary flex-shrink-0" style={{ transform: "translateY(1px)", width: 14, height: 14 }} />
            <span className="text-foreground font-medium" style={{ color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)" }}>
              {currentPage}
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
              className="icon-btn"
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
              <div className="absolute right-0 top-full mt-2 w-80 card shadow-lg animate-fade-in z-50">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="icon-btn"
                aria-label="User menu"
                style={{ height: LAYOUT.topBarControlHeight, width: LAYOUT.topBarControlHeight }}
              >
                <Avatar size="md" fallback={initials} src={user.user_metadata?.avatar_url} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="p-3 border-b" style={{ borderColor: resolvedTheme === "dark" ? "var(--border-dark)" : "var(--border)" }}>
                <p className="text-sm font-medium text-foreground truncate">{user.user_metadata?.full_name || "User"}</p>
                <p className="text-xs text-tertiary truncate">{user.email}</p>
              </div>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg w-full">
                  <User className="h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg w-full">
                  <Gear className="h-4 w-4" /> Admin Panel
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" style={{ borderColor: resolvedTheme === "dark" ? "var(--border-dark)" : "var(--border)" }} />
              <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg w-full">
                <Log className="h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}