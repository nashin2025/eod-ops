"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface DashboardLayoutProps {
  children: ReactNode;
  user: { id: string; email?: string; user_metadata?: { full_name?: string; avatar_url?: string } };
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const LAYOUT = {
    pagePadding: 24,
  } as const;

  return (
    <div className="flex min-h-screen bg-background" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300" style={{
        marginLeft: sidebarCollapsed ? "var(--layout-sidebar-width-collapsed)" : "var(--layout-sidebar-width-expanded)"
      }}>
        {/* Top Bar */}
        <TopBar 
          user={user} 
          sidebarCollapsed={sidebarCollapsed}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Main Content Area */}
        <main className="flex-1 animate-fade-in" style={{ padding: `calc(var(--layout-page-padding) + var(--layout-topbar-height)) var(--layout-page-padding) var(--layout-page-padding)` }}>
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 lg:hidden bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ zIndex: "var(--z-mobile-overlay)" }}
        />
      )}
    </div>
  );
}