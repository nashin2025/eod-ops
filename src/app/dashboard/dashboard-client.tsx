"use client";

import {
  KPICard,
  AreaChart,
  DonutChart,
  DataTable,
  ActivityFeed,
  QuickActions,
} from "@/components/dashboard/DashboardComponents";
import {
  CurrencyDollar,
  Users as UsersIcon,
  TrendUp,
  Clock,
} from "@phosphor-icons/react";

const kpiData = [
  {
    label: "Total Revenue",
    value: "$48,294",
    delta: 12.4,
    deltaLabel: "vs last month",
    icon: <CurrencyDollar className="h-5 w-5" />,
    trend: "up" as const,
    sparkline: [28, 24, 26, 18, 20, 12, 14, 8, 6],
    iconColor: "var(--accent)",
  },
  {
    label: "New Customers",
    value: "1,248",
    delta: 8.2,
    deltaLabel: "vs last month",
    icon: <UsersIcon className="h-5 w-5" />,
    trend: "up" as const,
    sparkline: [24, 20, 22, 16, 18, 14, 10, 12, 4],
    iconColor: "var(--accent)",
  },
  {
    label: "Conversion Rate",
    value: "3.42%",
    delta: -1.1,
    deltaLabel: "vs last month",
    icon: <TrendUp className="h-5 w-5" />,
    trend: "down" as const,
    sparkline: [10, 14, 12, 18, 16, 22, 20, 24, 26],
    iconColor: "var(--danger)",
  },
  {
    label: "Avg. Session",
    value: "4m 38s",
    delta: 5.7,
    deltaLabel: "vs last month",
    icon: <Clock className="h-5 w-5" />,
    trend: "up" as const,
    sparkline: [22, 18, 24, 16, 20, 14, 18, 10, 12],
    iconColor: "var(--accent)",
  },
];

const revenueData = [
  { label: "Jan", value: 42000 },
  { label: "Feb", value: 38000 },
  { label: "Mar", value: 52000 },
  { label: "Apr", value: 48000 },
  { label: "May", value: 61000 },
  { label: "Jun", value: 55000 },
  { label: "Jul", value: 67000 },
  { label: "Aug", value: 72000 },
];

const channelData = [
  { label: "Organic", value: 45 },
  { label: "Paid", value: 25 },
  { label: "Referral", value: 18 },
  { label: "Direct", value: 12 },
];

const recentTransactions = [
  { id: "TXN-001", date: "2024-01-15", amount: "$2,450.00", status: "completed" as const, customer: "Acme Corp" },
  { id: "TXN-002", date: "2024-01-14", amount: "$1,200.00", status: "pending" as const, customer: "Globex Inc" },
  { id: "TXN-003", date: "2024-01-13", amount: "$3,800.00", status: "completed" as const, customer: "Wayne Enterprises" },
  { id: "TXN-004", date: "2024-01-12", amount: "$950.00", status: "failed" as const, customer: "Stark Industries" },
  { id: "TXN-005", date: "2024-01-11", amount: "$5,600.00", status: "completed" as const, customer: "Umbrella Corp" },
];

const activityItems = [
  { id: 1, dotColor: "var(--success)", text: "Sarah M. upgraded to Pro Annual", time: "2 minutes ago" },
  { id: 2, dotColor: "var(--warning)", text: "Weekly analytics report is ready", time: "15 minutes ago" },
  { id: 3, dotColor: "var(--accent)", text: "New team member joined: Alex Chen", time: "1 hour ago" },
  { id: 4, dotColor: "var(--danger)", text: "Payment failed for order #4421", time: "3 hours ago" },
  { id: 5, dotColor: "var(--success)", text: "Backup completed successfully", time: "5 hours ago" },
];

const channelColors = ["var(--accent)", "var(--success)", "var(--warning)", "var(--text-tertiary)"];

export default function DashboardClient() {
  return (
    <div className="space-y-8 animate-fade-in" style={{ gap: "var(--layout-section-gap)" }}>
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
          <DataTable transactions={recentTransactions} />
        </div>
        <div className="col-span-4 flex flex-col" style={{ gap: "var(--layout-card-gap)", minWidth: 0 }}>
          <ActivityFeed items={activityItems} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}