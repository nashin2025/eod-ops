"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sun,
  Moon,
  Bell,
  CaretDown,
  CaretRight,
  X,
  User,
  Gear,
  SignOut,
} from "@phosphor-icons/react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface TopBarProps {
  sidebarCollapsed?: boolean;
  onMobileMenuToggle?: () => void;
  user?: {
    name?: string;
    email?: string;
    role?: string;
    avatar?: string;
  };
}

export default function TopBar({
  sidebarCollapsed = false,
  onMobileMenuToggle,
  user = {
    name: "Alex Chen",
    email: "alex.chen@eod-ops.com",
    role: "Administrator",
    avatar: "",
  },
}: TopBarProps) {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Breadcrumb generation
  const getBreadcrumb = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: { label: string; href: string }[] = [{ label: "Home", href: "/dashboard" }];

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      breadcrumbs.push({ label, href: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumb();

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
    <header
      className="topbar"
      style={{
        left: sidebarCollapsed ? "var(--layout-sidebar-width-collapsed)" : "var(--layout-sidebar-width-expanded)",
        height: "var(--layout-topbar-height)",
      }}
      role="banner"
    >
      {/* Mobile Menu Toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={onMobileMenuToggle}
        aria-label="Open navigation menu"
        aria-expanded="false"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Left: Breadcrumb */}
      <div className="topbar-left">
        <nav className="topbar-breadcrumb" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center gap-2">
              {index > 0 && (
                <CaretRight
                  className="topbar-breadcrumb-separator h-4 w-4 flex-shrink-0"
                  style={{ color: "var(--text-tertiary)" }}
                  aria-hidden="true"
                />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="topbar-breadcrumb-current">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-primary transition-colors">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Right: Theme Toggle, Notifications, User */}
      <div className="topbar-right">
        {/* Theme Toggle */}
        <div className="dropdown" onKeyDown={(e) => e.key === "Escape" && setNotificationsOpen(false)}>
          <button
            className="topbar-theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Notifications */}
        <div className="dropdown" ref={notificationsRef}>
          <button
            className="topbar-notifications"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setUserMenuOpen(false);
            }}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            aria-haspopup="true"
          >
            <Bell className="h-5 w-5" />
            <span className="topbar-notification-badge" aria-label="3 unread notifications">3</span>
          </button>

          {notificationsOpen && (
            <div className="dropdown-menu" style={{ width: 360, right: 0 }}>
              <div className="p-3 border-b border-border" style={{ borderColor: "var(--border-subtle)" }}>
                <h4 className="font-semibold" style={{ color: "var(--text-primary)" }}>Notifications</h4>
                <p className="text-xs" style={{ color: "var(--text-tertiary)", marginTop: "2px" }}>3 unread</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {[
                  { title: "New event scheduled", desc: "Coral Reef Monitoring at Vaavu Atoll", time: "5 min ago", unread: true },
                  { title: "Member joined", desc: "Sarah Mitchell joined the team", time: "1 hour ago", unread: true },
                  { title: "Equipment maintenance due", desc: "Drone #4 requires calibration", time: "3 hours ago", unread: false },
                ].map((notif, i) => (
                  <button
                    key={i}
                    className={`dropdown-item p-3 ${notif.unread ? "bg-active" : ""}`}
                    style={{
                      background: notif.unread ? "var(--active-bg)" : "transparent",
                      textAlign: "left",
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" style={{ color: "var(--text-primary)" }}>{notif.title}</p>
                      <p className="text-sm truncate" style={{ color: "var(--text-secondary)", marginTop: "2px" }}>{notif.desc}</p>
                    </div>
                    <span className="text-xs flex-shrink-0" style={{ color: "var(--text-tertiary)" }}>{notif.time}</span>
                  </button>
                ))}
              </div>
              <div className="p-3 border-t border-border" style={{ borderColor: "var(--border-subtle)" }}>
                <Link href="/notifications" className="dropdown-item w-full justify-center text-accent" style={{ color: "var(--accent)" }}>
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="dropdown" ref={userMenuRef}>
          <button
            className="topbar-user"
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setNotificationsOpen(false);
            }}
            aria-label="User menu"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
          >
            <div className="topbar-user-avatar" aria-hidden="true">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-full" />
              ) : (
                getInitials(user.name)
              )}
            </div>
            <div className="topbar-user-info">
              <span className="topbar-user-name">{user.name}</span>
              <span className="topbar-user-role">{user.role}</span>
            </div>
            <CaretDown className="topbar-user-chevron h-4 w-4" />
          </button>

          {userMenuOpen && (
            <div className="dropdown-menu" style={{ width: 240, right: 0 }}>
              <div className="p-3 border-b border-border" style={{ borderColor: "var(--border-subtle)" }}>
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>{user.name}</p>
                <p className="text-sm truncate" style={{ color: "var(--text-tertiary)", marginTop: "2px" }}>{user.email}</p>
              </div>
              <Link href="/dashboard/profile" className="dropdown-item">
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link href="/dashboard/settings" className="dropdown-item">
                <Gear className="h-4 w-4" />
                Settings
              </Link>
              <div className="dropdown-divider" />
              <button className="dropdown-item destructive" style={{ color: "var(--danger)" }}>
                <SignOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}