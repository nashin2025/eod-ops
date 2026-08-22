"use client";

import { ReactNode } from "react";
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
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { useTheme } from "@/components/providers/ThemeProvider";

const navItems = [
  {
    section: "MAIN",
    items: [
      { icon: ChartBar, label: "Overview", path: "/dashboard" },
      { icon: Calendar, label: "Events", path: "/dashboard/events" },
      { icon: Users, label: "Members", path: "/dashboard/members" },
      { icon: MapPin, label: "Island Map", path: "/dashboard/map" },
    ],
  },
  {
    section: "ANALYTICS",
    items: [
      { icon: Package, label: "Equipment", path: "/dashboard/equipment" },
      { icon: Archive, label: "Archive", path: "/dashboard/archive" },
    ],
  },
  {
    section: "ACCOUNT",
    items: [
      { icon: Users, label: "Profile", path: "/dashboard/profile" },
      { icon: Gear, label: "Admin", path: "/dashboard/admin" },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  user: { id: string; email?: string; user_metadata?: { full_name?: string; avatar_url?: string } };
}

export function Sidebar({ collapsed, onToggle, user }: SidebarProps) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  const LAYOUT = {
    sidebarWidthExpanded: 288,
    sidebarWidthCollapsed: 72,
    sidebarPaddingH: 18,
    sidebarPaddingV: 24,
    navItemHeight: 44,
    brandLogoSize: 40,
  } as const;

  const initials = user.user_metadata?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.email?.charAt(0).toUpperCase() || "U";

  return (
    <aside
      className="fixed top-0 left-0 z-30 min-h-screen transition-all duration-300"
      style={{
        width: collapsed ? "var(--layout-sidebar-width-collapsed)" : "var(--layout-sidebar-width-expanded)",
        background: resolvedTheme === "dark" ? "var(--sidebar-bg-dark)" : "var(--sidebar-bg)",
        borderRight: resolvedTheme === "dark" ? "1px solid var(--border-dark)" : "none",
        boxShadow: resolvedTheme === "light"
          ? "var(--neu-raised)"
          : "var(--neu-raised)",
        padding: `${LAYOUT.sidebarPaddingV}px ${LAYOUT.sidebarPaddingH}px`,
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-1)",
      }}
    >
      <nav className="space-y-6 h-full flex flex-col">
        {/* Brand & Toggle */}
        <div className="flex items-center justify-between gap-3" style={{ padding: "8px 8px 20px" }}>
          <div className="flex items-center gap-3">
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
                boxShadow:
                  resolvedTheme === "dark"
                    ? "0 4px 12px var(--accent-glow)"
                    : "var(--neu-raised-sm)",
              }}
            >
              N
            </div>
            {!collapsed && <span className="text-xl font-bold text-foreground">EOD-Ops</span>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={`rounded-xl transition-all duration-200 ${collapsed ? "rotate-180" : ""}`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{ width: 40, height: 40 }}
          >
            {collapsed ? <CaretRight className="h-5 w-5" /> : <CaretLeft className="h-5 w-5" />}
          </Button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="relative" style={{ marginBottom: "var(--space-3)" }}>
            <MagnifyingGlass
              className="absolute left-3 top-1/2 h-4 w-4"
              style={{
                transform: "translateY(calc(-50% + 1px))",
                color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)",
              }}
            />
            <input
              type="text"
              placeholder="Search anything..."
              className={resolvedTheme === "dark" ? "input" : "input"}
              style={{
                width: "100%",
                height: LAYOUT.navItemHeight,
                paddingLeft: 40,
                borderRadius: 12,
              }}
            />
          </div>
        )}

        {/* Navigation Sections - scrollable */}
        <div className="space-y-4 flex-1 overflow-y-auto min-h-0">
          {navItems.map((section) => (
            <div key={section.section} className="space-y-1">
              {!collapsed && (
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
                      className={`w-full justify-start gap-3 rounded-xl transition-all duration-200 ${
                        isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
                      } ${collapsed ? "justify-center" : "h-11 px-3"}`}
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
                        }}
                      />
                      {!collapsed && <span>{item.label}</span>}
                    </Button>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Profile & Collapse Toggle - fixed at bottom */}
        <div
          className="border-t pt-4 flex-shrink-0"
          style={{ borderColor: resolvedTheme === "dark" ? "var(--border-dark)" : "var(--border)" }}
        >
          {!collapsed && (
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                background: resolvedTheme === "dark" ? "var(--surface-raised-dark)" : "var(--accent-soft)",
                border: resolvedTheme === "dark" ? "1px solid var(--border-dark)" : "none",
                marginBottom: "var(--space-2)",
              }}
            >
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
                <p
                  className="text-sm font-medium text-foreground truncate"
                  style={{ color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)" }}
                >
                  {user.user_metadata?.full_name || user.email || "User"}
                </p>
                <p
                  className="text-xs text-tertiary truncate"
                  style={{ color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)" }}
                >
                  {user.email}
                </p>
              </div>
            </div>
          )}
          {collapsed && (
            <div
              className="flex items-center justify-center gap-2 p-2 rounded-xl mx-auto"
              style={{
                background: resolvedTheme === "dark" ? "var(--surface-raised-dark)" : "var(--accent-soft)",
                border: resolvedTheme === "dark" ? "1px solid var(--border-dark)" : "none",
                width: "calc(100% - 8px)",
                marginBottom: "var(--space-2)",
              }}
              title={user.user_metadata?.full_name || user.email || "User"}
            >
              <div
                className="flex-shrink-0"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                  display: "grid",
                  placeItems: "center",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                {initials}
              </div>
              <span className="text-xs text-tertiary truncate max-w-[120px]" style={{ color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)" }}>
                {user.email}
              </span>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}