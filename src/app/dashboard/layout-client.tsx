"use client";

import { useState } from "react";
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
} from "lucide-react";
import { signOut } from "@/lib/supabase/auth";
import { ThemeToggleCompact } from "@/components/ui/ThemeToggle";

const navItems = [
  { icon: BarChart3, label: "Overview", path: "/dashboard" },
  { icon: Calendar, label: "Events", path: "/dashboard/events" },
  { icon: Users, label: "Members", path: "/dashboard/members" },
  { icon: Map, label: "Island Map", path: "/dashboard/map" },
  { icon: Package, label: "Equipment", path: "/dashboard/equipment" },
  { icon: Archive, label: "Archive", path: "/dashboard/archive" },
  { icon: User, label: "My Profile", path: "/dashboard/profile" },
  { icon: Settings, label: "Admin Panel", path: "/dashboard/admin" },
];

export default function DashboardLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { id: string; email?: string; user_metadata?: { full_name?: string; avatar_url?: string } };
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const pathname = usePathname();

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
      <aside
        className={`${
          isMinimized ? "w-16" : "w-64"
        } bg-card border-r border-border min-h-screen transition-all duration-300 fixed lg:relative top-0 left-0 z-30`}
      >
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full ${isMinimized ? "justify-center p-2" : "justify-start"}`}
                >
                  <item.icon className={`h-4 w-4 ${isMinimized ? "" : "mr-2"}`} />
                  {!isMinimized && item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <header className="bg-card shadow-sm border-b border-border fixed top-0 left-0 lg:left-64 right-0 z-20">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden lg:block"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </Button>
                <h1 className="text-xl font-semibold text-foreground">
                  {navItems.find((item) => item.path === pathname)?.label || "Dashboard"}
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <ThemeToggleCompact />
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 pt-20 pb-16 lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
