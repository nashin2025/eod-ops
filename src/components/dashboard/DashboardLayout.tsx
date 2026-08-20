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
      <div className={`flex-1 flex flex-col min-h-screen ${sidebarCollapsed ? "lg:ml-18" : "lg:ml-72"}`}>
        {/* Top Bar */}
        <TopBar user={user} sidebarCollapsed={sidebarCollapsed} />

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