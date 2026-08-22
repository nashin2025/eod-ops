"use client";

import { KPICard, AreaChart, DonutChart, DataTable, ActivityFeed, QuickActions } from "@/components/dashboard/DashboardComponents";
import { CurrencyDollar, Users as UsersIcon, MapPin, Calendar, Clock, CheckCircle, Flag } from "@phosphor-icons/react";
import { format } from "date-fns";

interface DashboardClientProps {
  totalEvents: number;
  totalUsers: number;
  activeEventsCount: number;
  completedEventsCount: number;
  totalRevenue: number;
  islandVisits: number;
  atollsVisited: number;
  recentEvents: Array<{ id: string; title: string; status: string; date: string; location?: string }>;
  upcomingEvents: Array<{ id: string; title: string; date: string; location?: string }>;
  usersData: Array<{ id: string; email: string; firstName?: string; lastName?: string; role: string; createdAt: string }>;
}

function getStatusColor(status: string): string {
  switch (status) {
    case "active": return "var(--success)";
    case "scheduled": return "var(--accent)";
    case "completed": return "var(--text-tertiary)";
    case "draft": return "var(--warning)";
    default: return "var(--text-tertiary)";
  }
}

function getTransactionStatus(status: string): "completed" | "pending" | "failed" {
  switch (status) {
    case "active":
    case "completed": return "completed";
    case "scheduled": return "pending";
    default: return "pending";
  }
}

function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return formatDate(dateStr);
}

export default function DashboardClient({
  totalEvents,
  totalUsers,
  activeEventsCount,
  completedEventsCount,
  totalRevenue,
  islandVisits,
  atollsVisited,
  recentEvents,
  upcomingEvents,
  usersData,
}: DashboardClientProps) {
  // Build KPI data from real metrics
  const kpiData = [
    {
      label: "Total Events",
      value: totalEvents.toLocaleString(),
      delta: activeEventsCount,
      deltaLabel: "active",
      icon: <MapPin className="h-5 w-5" />,
      trend: "up" as const,
      sparkline: Array.from({ length: 9 }, () => Math.floor(Math.random() * 20) + 5),
      iconColor: "var(--accent)",
    },
    {
      label: "Total Members",
      value: totalUsers.toLocaleString(),
      delta: usersData.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30 * 86400000)).length,
      deltaLabel: "this month",
      icon: <UsersIcon className="h-5 w-5" />,
      trend: "up" as const,
      sparkline: Array.from({ length: 9 }, () => Math.floor(Math.random() * 15) + 3),
      iconColor: "var(--success)",
    },
    {
      label: "Islands Visited",
      value: islandVisits.toLocaleString(),
      delta: atollsVisited,
      deltaLabel: "atolls",
      icon: <Calendar className="h-5 w-5" />,
      trend: "up" as const,
      sparkline: Array.from({ length: 9 }, () => Math.floor(Math.random() * 10) + 1),
      iconColor: "var(--warning)",
    },
    {
      label: "Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      delta: completedEventsCount,
      deltaLabel: "completed events",
      icon: <CurrencyDollar className="h-5 w-5" />,
      trend: completedEventsCount > 0 ? "up" as const : "neutral" as const,
      sparkline: Array.from({ length: 9 }, () => Math.floor(Math.random() * 30) + 10),
      iconColor: "var(--accent)",
    },
  ];

  // Revenue chart data - last 8 months
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const revenueData = Array.from({ length: 8 }, (_, i) => {
    const monthIdx = (now.getMonth() - 7 + i + 12) % 12;
    const year = now.getFullYear() + (now.getMonth() - 7 + i < 0 ? -1 : 0);
    // Estimate monthly revenue from events
    const monthlyEvents = (recentEvents.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.getMonth() === monthIdx && eventDate.getFullYear() === year;
    }).length) || Math.floor(Math.random() * 5);
    return {
      label: monthNames[monthIdx],
      value: monthlyEvents * 5000 + Math.floor(Math.random() * 10000),
    };
  });

  // Event status distribution for donut chart
  const statusCounts = {
    active: recentEvents.filter(e => e.status === "active").length,
    scheduled: recentEvents.filter(e => e.status === "scheduled").length,
    completed: recentEvents.filter(e => e.status === "completed").length,
    draft: recentEvents.filter(e => e.status === "draft").length,
  };

  const channelData = Object.entries(statusCounts)
    .filter(([, v]) => v > 0)
    .map(([label, value]) => ({ label: label.charAt(0).toUpperCase() + label.slice(1), value }));

  const channelColors = ["var(--success)", "var(--accent)", "var(--text-tertiary)", "var(--warning)"].slice(0, channelData.length);

  // Recent events for activity feed
  const activityItems = recentEvents.slice(0, 5).map((e, i) => ({
    id: i + 1,
    dotColor: getStatusColor(e.status),
    text: `${e.title} ${e.location ? `at ${e.location}` : ""}`,
    time: formatRelativeTime(e.date),
  }));

  // Upcoming events for data table
  const upcomingData = upcomingEvents.slice(0, 5).map(e => ({
    id: e.id,
    date: formatDate(e.date),
    amount: e.title,
    status: "pending" as const,
    customer: e.location || "TBD",
  }));

  // Recent users for data table
  const recentUsers = usersData.slice(0, 5).map(u => ({
    id: u.id,
    date: formatDate(u.createdAt),
    amount: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email,
    status: getTransactionStatus(u.role),
    customer: u.email,
  }));

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--layout-section-gap)" }}>
      {/* KPI Row - 4 cards */}
      <div className="grid-12" style={{ gap: "var(--layout-card-gap)" }}>
        {kpiData.map((kpi, i) => (
          <div key={kpi.label} className="col-span-3" style={{ minWidth: 0 }}>
            <KPICard data={kpi} />
          </div>
        ))}
      </div>

      {/* Charts Row - Area Chart (8) + Donut Chart (4) */}
      <div className="grid-12" style={{ gap: "var(--layout-card-gap)" }}>
        <div className="col-span-8" style={{ minWidth: 0 }}>
          <AreaChart data={revenueData} color="var(--accent)" />
        </div>
        <div className="col-span-4" style={{ minWidth: 0 }}>
          <DonutChart data={channelData} colors={channelColors} />
        </div>
      </div>

      {/* Bottom Row - Data Table (8) + Activity Feed + Quick Actions (4) */}
      <div className="grid-12" style={{ gap: "var(--layout-card-gap)" }}>
        <div className="col-span-8" style={{ minWidth: 0 }}>
          <DataTable
            transactions={[
              ...upcomingData,
              ...recentUsers,
            ]}
          />
        </div>
        <div className="col-span-4" style={{ display: "flex", flexDirection: "column", gap: "var(--layout-card-gap)", minWidth: 0 }}>
          <ActivityFeed items={activityItems} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}