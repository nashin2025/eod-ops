"use client";

import { KPICard, AreaChart, DonutChart, DataTable, ActivityFeed, QuickActions } from "@/components/dashboard/DashboardComponents";
import { CurrencyDollar, Users as UsersIcon, MapPin, Calendar, Clock, CheckCircle, Flag, TrendUp, TrendDown, Plus } from "@phosphor-icons/react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

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

// Sample revenue data for area chart
const revenueChartData = [
  { label: "Jan", value: 42000 },
  { label: "Feb", value: 38000 },
  { label: "Mar", value: 51000 },
  { label: "Apr", value: 48000 },
  { label: "May", value: 62000 },
  { label: "Jun", value: 58000 },
  { label: "Jul", value: 71000 },
  { label: "Aug", value: 69000 },
  { label: "Sep", value: 75000 },
  { label: "Oct", value: 82000 },
  { label: "Nov", value: 78000 },
  { label: "Dec", value: 89000 },
];

// Sample traffic source data for donut chart
const trafficSourceData = [
  { label: "Direct", value: 42, color: "var(--accent)" },
  { label: "Organic Search", value: 28, color: "var(--success)" },
  { label: "Referral", value: 18, color: "var(--warning)" },
  { label: "Social", value: 12, color: "var(--danger)" },
];

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
      delta: activeEventsCount > 0 ? Math.round((activeEventsCount / Math.max(totalEvents - activeEventsCount, 1)) * 100) : 0,
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
      delta: completedEventsCount > 0 ? Math.round((completedEventsCount / Math.max(totalEvents - completedEventsCount, 1)) * 100) : 0,
      deltaLabel: "completed events",
      icon: <CurrencyDollar className="h-5 w-5" />,
      trend: completedEventsCount > 0 ? "up" as const : "neutral" as const,
      sparkline: Array.from({ length: 9 }, () => Math.floor(Math.random() * 30) + 10),
      iconColor: "var(--accent)",
    },
  ];

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
      {/* Dashboard Hero */}
      <div className="dashboard-hero" style={{ animationDelay: "80ms" }}>
        <div className="dashboard-hero-header">
          <div className="dashboard-greeting">
            <h1 className="dashboard-greeting-text">Good morning, Alex</h1>
            <p className="dashboard-greeting-sub">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <button className="dashboard-hero-cta btn-primary" style={{ height: "var(--layout-control-height)" }}>
            <Plus className="h-5 w-5" />
            Create Report
          </button>
        </div>
      </div>

      {/* KPI Row - 4 cards */}
      <div className="grid-12" style={{ gap: "var(--layout-card-gap)" }}>
        {kpiData.map((kpi, i) => (
          <div key={kpi.label} className="col-span-3" style={{ minWidth: 0, animationDelay: `${160 + i * 80}ms` }}>
            <KPICard data={kpi} />
          </div>
        ))}
      </div>

      {/* Charts Section - 2 column grid */}
      <div className="grid-12" style={{ gap: "var(--layout-card-gap)" }}>
        <div className="col-span-8" style={{ minWidth: 0, animationDelay: "480ms" }}>
          <AreaChart data={revenueChartData} color="var(--accent)" />
        </div>
        <div className="col-span-4" style={{ minWidth: 0, animationDelay: "560ms" }}>
          <DonutChart data={trafficSourceData} colors={trafficSourceData.map(d => d.color)} />
        </div>
      </div>

      {/* Data Table Section */}
      <div className="grid-12" style={{ gap: "var(--layout-card-gap)" }}>
        <div className="col-span-12" style={{ minWidth: 0, animationDelay: "640ms" }}>
          <DataTable
            transactions={[
              ...upcomingData,
              ...recentUsers,
            ]}
          />
        </div>
      </div>

      {/* Secondary Row - Activity Feed + Quick Actions */}
      <div className="grid-12" style={{ gap: "var(--layout-card-gap)" }}>
        <div className="col-span-8" style={{ minWidth: 0, animationDelay: "720ms" }}>
          <ActivityFeed items={activityItems} />
        </div>
        <div className="col-span-4" style={{ display: "flex", flexDirection: "column", gap: "var(--layout-card-gap)", minWidth: 0, animationDelay: "800ms" }}>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}