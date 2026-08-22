"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MagnifyingGlass,
  MapPin,
  ChartBar,
  ChartPie,
  Users,
  Calendar,
  Bell,
  Shield,
  Gear,
  User,
  SignOut,
  CaretLeft,
  CaretRight,
  Cube,
  MapPin as MapPinIcon,
  Package,
  Archive,
  ChatCircle,
} from "@phosphor-icons/react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  user?: {
    name?: string;
    email?: string;
    role?: string;
    avatar?: string;
  };
}

export default function Sidebar({
  collapsed = false,
  onToggle,
  user = {
    name: "Alex Chen",
    email: "alex.chen@eod-ops.com",
    role: "Administrator",
    avatar: "",
  },
}: SidebarProps) {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navSections: NavSection[] = [
    {
      label: "MAIN",
      items: [
        { href: "/dashboard", icon: <MapPin className="h-5 w-5" />, label: "Dashboard" },
        { href: "/dashboard/events", icon: <Calendar className="h-5 w-5" />, label: "Events" },
        { href: "/dashboard/members", icon: <Users className="h-5 w-5" />, label: "Members" },
        { href: "/dashboard/equipment", icon: <Package className="h-5 w-5" />, label: "Equipment" },
      ],
    },
    {
      label: "ANALYTICS",
      items: [
        { href: "/dashboard/map", icon: <MapPinIcon className="h-5 w-5" />, label: "Map View" },
        { href: "/dashboard/archive", icon: <Archive className="h-5 w-5" />, label: "Archive" },
      ],
    },
    {
      label: "ACCOUNT",
      items: [
        { href: "/dashboard/profile", icon: <User className="h-5 w-5" />, label: "Profile" },
        { href: "/dashboard/settings", icon: <Gear className="h-5 w-5" />, label: "Settings" },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const getInitials = (name?: string) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[25] bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
        style={{
          width: collapsed ? "var(--layout-sidebar-width-collapsed)" : "var(--layout-sidebar-width-expanded)",
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <div className="sidebar-brand" role="banner">
          <div className="sidebar-brand-icon" aria-hidden="true">
            <MapPin className="h-6 w-6" />
          </div>
          <span className="sidebar-brand-text">EOD-Ops</span>
        </div>

        {/* Search */}
        <div className="sidebar-search">
          <div className="relative">
            <MagnifyingGlass
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5"
              style={{ color: "var(--text-tertiary)" }}
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search..."
              className="sidebar-search-input"
              aria-label="Search events, members, equipment"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Sidebar navigation">
          {navSections.map((section) => (
            <div key={section.label} className="sidebar-nav-section">
              <span className="sidebar-nav-label">{section.label}</span>
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-nav-item ${active ? "active" : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="sidebar-nav-item-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="sidebar-nav-item-text">{item.label}</span>
                    {item.badge && (
                      <span
                        className="badge badge-accent ml-auto sidebar-nav-item-text"
                        style={{ fontSize: "10px", padding: "2px 6px" }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Profile & Toggle */}
        <div className="sidebar-footer relative">
          <div className="sidebar-user" role="button" tabIndex={0} aria-expanded="false" aria-haspopup="true">
            <div className="sidebar-user-avatar" aria-hidden="true">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                getInitials(user.name)
              )}
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{user.name}</p>
              <p className="sidebar-user-role">{user.role}</p>
            </div>
          </div>

          <button
            className="sidebar-toggle"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            {collapsed ? (
              <CaretRight className="h-5 w-5" />
            ) : (
              <CaretLeft className="h-5 w-5" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}