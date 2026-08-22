"use client";

import { useState } from "react";
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface DashboardLayoutProps {
  children: ReactNode;
  user?: {
    id: string;
    email?: string;
    name?: string;
    role?: string;
    avatar?: string;
  };
}

export default function DashboardLayout({
  children,
  user = {
    id: "1",
    email: "alex.chen@eod-ops.com",
    name: "Alex Chen",
    role: "Administrator",
    avatar: "",
  },
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        user={user}
      />

      {/* Top Bar */}
      <TopBar
        sidebarCollapsed={sidebarCollapsed}
        onMobileMenuToggle={handleMobileMenuToggle}
        user={user}
      />

      {/* Main Content */}
      <main
        className="main-content"
        style={{
          marginLeft: sidebarCollapsed ? "var(--layout-sidebar-width-collapsed)" : "var(--layout-sidebar-width-expanded)",
          marginTop: "var(--layout-topbar-height)",
        }}
        role="main"
      >
        {children}
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[25] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}