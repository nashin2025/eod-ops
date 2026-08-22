"use client";

import { useState } from "react";
import { KPICard, AreaChart, DonutChart, DataTable, ActivityFeed, QuickActions } from "@/components/dashboard/DashboardComponents";
import { IslandCheckIn } from "@/components/dashboard/IslandCheckIn";
import { MilestoneBadges, MilestoneQuickStats } from "@/components/dashboard/MilestoneBadges";
import { CurrencyDollar, Users as UsersIcon, MapPin, Calendar, Clock, CheckCircle, Flag, TrendUp, TrendDown, Plus, CaretDown, CaretUp, Phone } from "@phosphor-icons/react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardClientProps {
  totalEvents: number;
  totalUsers: number;
  activeEventsCount: number;
  completedEventsCount: number;
  totalRevenue: number;
  islandVisits: number;
  atollsVisited: number;
  totalVisits: number;
  achievedCount: number;
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
  totalVisits,
  achievedCount,
  recentEvents,
  upcomingEvents,
  usersData,
}: DashboardClientProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>("date"); // date, atoll, island

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
      icon: <MapPin className="h-5 w-5" />,
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

  // Sort events
  const sortedEvents = [...recentEvents].sort((a: any, b: any) => {
    if (sortBy === "atoll") {
      return (a.location || "").localeCompare(b.location || "");
    } else if (sortBy === "island") {
      // Use title as island proxy since we don't have separate island field
      return a.title.localeCompare(b.title);
    } else {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  }).slice(0, 6); // Show more events

  const toggleEventExpansion = (eventId: string) => {
    const newExpandedEvents = new Set(expandedEvents);
    if (newExpandedEvents.has(eventId)) {
      newExpandedEvents.delete(eventId);
    } else {
      newExpandedEvents.add(eventId);
    }
    setExpandedEvents(newExpandedEvents);
  };

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

      {/* Milestone Quick Stats */}
      <div className="grid-12" style={{ gap: "var(--layout-card-gap)" }}>
        <div className="col-span-12" style={{ minWidth: 0, animationDelay: "400ms" }}>
          <MilestoneQuickStats />
        </div>
      </div>

      {/* Island Check-in Section */}
      <div className="grid-12" style={{ gap: "var(--layout-card-gap)" }}>
        <div className="col-span-12" style={{ minWidth: 0, animationDelay: "440ms" }}>
          <IslandCheckIn />
        </div>
      </div>

      {/* Milestone Badges Section */}
      <div className="grid-12" style={{ gap: "var(--layout-card-gap)" }}>
        <div className="col-span-12" style={{ minWidth: 0, animationDelay: "480ms" }}>
          <MilestoneBadges />
        </div>
      </div>

      {/* Recent Events Section with Sort and Expandable Cards */}
      <div className="grid-12" style={{ gap: "var(--layout-card-gap)" }}>
        <div className="col-span-12" style={{ minWidth: 0, animationDelay: "520ms" }}>
          <Card className="card-auth">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Recent Events</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="label" style={{ fontWeight: "normal" }}>Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="atoll">Atoll</SelectItem>
                      <SelectItem value="island">Island</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-3">
                {sortedEvents.length === 0 ? (
                  <p className="text-center py-4" style={{ color: "var(--text-tertiary)" }}>
                    No events found. Create your first event to get started.
                  </p>
                ) : (
                  sortedEvents.map((event: any) => {
                    const isExpanded = expandedEvents.has(event.id);
                    return (
                      <div
                        key={event.id}
                        className="border rounded-lg p-3"
                        style={{ borderColor: "var(--border-subtle)", background: "var(--card-bg)" }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                                {event.title}
                              </p>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  event.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" :
                                  event.status === "scheduled" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" :
                                  event.status === "completed" ? "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300" :
                                  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                                }`}
                              >
                                {event.status}
                              </span>
                            </div>
                            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                              {event.location}
                            </p>
                            {event.date && !isNaN(new Date(event.date).getTime()) && (
                              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                                {formatDate(event.date)} at {event.startTime || "TBD"}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEventExpansion(event.id)}
                          >
                            {isExpanded ? <CaretUp className="h-4 w-4" /> : <CaretDown className="h-4 w-4" />}
                          </Button>
                        </div>

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t space-y-2" style={{ borderColor: "var(--border-subtle)" }}>
                            {event.eventLocation && (
                              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                                <strong>Event Location:</strong> {event.eventLocation}
                              </p>
                            )}
                            {event.waitingLocation && (
                              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                                <strong>Waiting Location:</strong> {event.waitingLocation}
                              </p>
                            )}
                            {event.contact && (
                              <div className="text-sm flex items-center gap-2" style={{ color: "var(--text-tertiary)" }}>
                                <span><strong>Contact:</strong> {event.contact}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.location.href = `tel:${event.contact}`}
                                  className="h-6 w-6 p-0"
                                  title={`Call ${event.contact}`}
                                >
                                  <Phone className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                            {event.comment && (
                              <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                                <strong>Description:</strong> {event.comment}
                              </p>
                            )}
                            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                              <strong>Participants:</strong> {event.participantCount || 0} participants
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Section - 2 column grid */}
      <div className="grid-12" style={{ gap: "var(--layout-card-gap)" }}>
        <div className="col-span-8" style={{ minWidth: 0, animationDelay: "560ms" }}>
          <AreaChart data={revenueChartData} color="var(--accent)" />
        </div>
        <div className="col-span-4" style={{ minWidth: 0, animationDelay: "640ms" }}>
          <DonutChart data={trafficSourceData} colors={trafficSourceData.map(d => d.color)} />
        </div>
      </div>

      {/* Data Table Section */}
      <div className="grid-12" style={{ gap: "var(--layout-card-gap)" }}>
        <div className="col-span-12" style={{ minWidth: 0, animationDelay: "720ms" }}>
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
        <div className="col-span-8" style={{ minWidth: 0, animationDelay: "800ms" }}>
          <ActivityFeed items={activityItems} />
        </div>
        <div className="col-span-4" style={{ display: "flex", flexDirection: "column", gap: "var(--layout-card-gap)", minWidth: 0, animationDelay: "880ms" }}>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}