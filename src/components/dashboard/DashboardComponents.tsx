"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar, Users, MapPin, CheckCircle, CaretDown, CaretUp, TrendUp, TrendDown, ActivityIcon,
  ChartBar, ChartPie, CurrencyDollar, Users as UsersIcon, Clock, ArrowUpRight, ArrowDownRight,
  Minus, Plus, MagnifyingGlass, List, X, CaretLeft, CaretRight, User, Log, Gear, Archive,
  Package, MapPin as MapPinIcon, ChatCircle, MagnifyingGlass as SearchIcon, Bell
} from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface KPIData {
  label: string;
  value: string;
  delta: number;
  deltaLabel: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
  sparkline: number[];
  iconColor?: string;
}

interface ChartDataPoint {
  label: string;
  value: number;
}

interface Transaction {
  id: string;
  date: string;
  amount: string;
  status: "completed" | "pending" | "failed";
  customer: string;
}

interface ActivityItem {
  id: number;
  dotColor: string;
  text: string;
  time: string;
}

const kpiData: KPIData[] = [
  {
    label: "Total Revenue",
    value: "$48,294",
    delta: 12.4,
    deltaLabel: "vs last month",
    icon: <CurrencyDollar className="h-5 w-5" />,
    trend: "up",
    sparkline: [28, 24, 26, 18, 20, 12, 14, 8, 6],
    iconColor: "var(--accent)",
  },
  {
    label: "New Customers",
    value: "1,248",
    delta: 8.2,
    deltaLabel: "vs last month",
    icon: <UsersIcon className="h-5 w-5" />,
    trend: "up",
    sparkline: [24, 20, 22, 16, 18, 14, 10, 12, 4],
    iconColor: "var(--accent)",
  },
  {
    label: "Conversion Rate",
    value: "3.42%",
    delta: -1.1,
    deltaLabel: "vs last month",
    icon: <TrendUp className="h-5 w-5" />,
    trend: "down",
    sparkline: [10, 14, 12, 18, 16, 22, 20, 24, 26],
    iconColor: "var(--danger)",
  },
  {
    label: "Avg. Session",
    value: "4m 38s",
    delta: 5.7,
    deltaLabel: "vs last month",
    icon: <Clock className="h-5 w-5" />,
    trend: "up",
    sparkline: [22, 18, 24, 16, 20, 14, 18, 10, 12],
    iconColor: "var(--accent)",
  },
];

const revenueData: ChartDataPoint[] = [
  { label: "Jan", value: 42000 },
  { label: "Feb", value: 38000 },
  { label: "Mar", value: 52000 },
  { label: "Apr", value: 48000 },
  { label: "May", value: 61000 },
  { label: "Jun", value: 55000 },
  { label: "Jul", value: 67000 },
  { label: "Aug", value: 72000 },
];

const channelData: ChartDataPoint[] = [
  { label: "Organic", value: 45 },
  { label: "Paid", value: 25 },
  { label: "Referral", value: 18 },
  { label: "Direct", value: 12 },
];

const recentTransactions: Transaction[] = [
  { id: "TXN-001", date: "2024-01-15", amount: "$2,450.00", status: "completed", customer: "Acme Corp" },
  { id: "TXN-002", date: "2024-01-14", amount: "$1,200.00", status: "pending", customer: "Globex Inc" },
  { id: "TXN-003", date: "2024-01-13", amount: "$3,800.00", status: "completed", customer: "Wayne Enterprises" },
  { id: "TXN-004", date: "2024-01-12", amount: "$950.00", status: "failed", customer: "Stark Industries" },
  { id: "TXN-005", date: "2024-01-11", amount: "$5,600.00", status: "completed", customer: "Umbrella Corp" },
];

const activityItems: ActivityItem[] = [
  { id: 1, dotColor: "var(--success)", text: "Sarah M. upgraded to Pro Annual", time: "2 minutes ago" },
  { id: 2, dotColor: "var(--warning)", text: "Weekly analytics report is ready", time: "15 minutes ago" },
  { id: 3, dotColor: "var(--accent)", text: "New team member joined: Alex Chen", time: "1 hour ago" },
  { id: 4, dotColor: "var(--danger)", text: "Payment failed for order #4421", time: "3 hours ago" },
  { id: 5, dotColor: "var(--success)", text: "Backup completed successfully", time: "5 hours ago" },
];

export function KPICard({ data }: { data: KPIData }) {
  const { resolvedTheme } = useTheme();
  const trendIcon = data.trend === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />;
  const trendColor = data.trend === "up" ? "var(--success)" : "var(--danger)";
  
  const sparklinePoints = data.sparkline.map((val, i) => {
    const x = (i / (data.sparkline.length - 1)) * 100;
    const y = 100 - ((val - Math.min(...data.sparkline)) / (Math.max(...data.sparkline) - Math.min(...data.sparkline))) * 100;
    return `${x}% ${y}%`;
  }).join(", ");

  return (
    <Card className="p-0 overflow-hidden">
      <CardContent className="p-5 h-full flex flex-col justify-between" style={{ padding: "var(--layout-kpi-card-padding)" }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-tertiary" style={{ color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)" }}>
              {data.label}
            </p>
            <p className="text-2xl font-bold tabular mt-1" style={{ color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)" }}>
              {data.value}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <span style={{ color: trendColor }} className="text-sm font-medium flex items-center gap-0.5">
                {trendIcon}
                {Math.abs(data.delta)}%
              </span>
              <span className="text-xs text-tertiary" style={{ color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)" }}>
                {data.deltaLabel}
              </span>
            </div>
          </div>
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: data.iconColor ? `color-mix(in srgb, ${data.iconColor} 15%, transparent)` : "var(--accent-soft)",
              color: data.iconColor || "var(--accent)",
            }}
          >
            {data.icon}
          </div>
        </div>
        <div className="mt-4" style={{ height: 40 }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id={`gradient-${data.label.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={data.iconColor || "var(--accent)"} stopOpacity="0.3" />
                <stop offset="100%" stopColor={data.iconColor || "var(--accent)"} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M${sparklinePoints}`}
              stroke={data.iconColor || "var(--accent)"}
              strokeWidth="2"
              fill={`url(#gradient-${data.label.replace(/\s+/g, '-')})`}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}

export function AreaChart({ data, color = "var(--accent)" }: { data: ChartDataPoint[]; color?: string }) {
  const { resolvedTheme } = useTheme();
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - minValue) / (maxValue - minValue)) * 80;
    return `${x}% ${y}%`;
  }).join(", ");

  return (
    <Card className="p-0 overflow-hidden">
      <CardContent className="p-5 h-full" style={{ padding: "var(--layout-card-padding)" }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg" style={{ color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)" }}>
            Revenue Overview
          </h3>
          <div className="flex items-center gap-2 text-sm text-tertiary" style={{ color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)" }}>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded" style={{ background: color }} />
              Revenue
            </span>
          </div>
        </div>
        <div style={{ height: 280 }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M${points}`}
              stroke={color}
              strokeWidth="2"
              fill="url(#area-gradient)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.map((d, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = 100 - ((d.value - minValue) / (maxValue - minValue)) * 80;
              return (
                <circle
                  key={i}
                  cx={x + "%"}
                  cy={y + "%"}
                  r="4"
                  fill={color}
                  stroke={resolvedTheme === "dark" ? "var(--base-dark)" : "var(--base)"}
                  strokeWidth="2"
                  className="transition-opacity duration-200"
                  style={{ opacity: 0 }}
                />
              )
            })}
          </svg>
        </div>
        <div className="flex justify-between mt-4 text-xs text-tertiary" style={{ color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)" }}>
          {data.map((d, i) => (
            <span key={i} style={{ flex: 1, textAlign: i === 0 ? "left" : i === data.length - 1 ? "right" : "center" }}>
              {d.label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function DonutChart({ data, colors }: { data: ChartDataPoint[]; colors: string[] }) {
  const { resolvedTheme } = useTheme();
  const total = data.reduce((sum, d) => sum + d.value, 0);
  
  const segments = data.map((d, i) => {
    const percentage = (d.value / total) * 100;
    const angle = (percentage / 100) * 360;
    return { ...d, percentage, angle, color: colors[i % colors.length] };
  });

  let cumulativeAngle = -90;
  
  const paths = segments.map((segment) => {
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + segment.angle;
    cumulativeAngle = endAngle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const outerRadius = 45;
    const innerRadius = 28;
    
    const x1 = 50 + outerRadius * Math.cos(startRad);
    const y1 = 50 + outerRadius * Math.sin(startRad);
    const x2 = 50 + outerRadius * Math.cos(endRad);
    const y2 = 50 + outerRadius * Math.sin(endRad);
    const x3 = 50 + innerRadius * Math.cos(endRad);
    const y3 = 50 + innerRadius * Math.sin(endRad);
    const x4 = 50 + innerRadius * Math.cos(startRad);
    const y4 = 50 + innerRadius * Math.sin(startRad);
    
    const largeArcFlag = segment.angle > 180 ? 1 : 0;
    
    return (
      <path
        key={segment.label}
        d={`M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`}
        fill={segment.color}
        stroke={resolvedTheme === "dark" ? "var(--base-dark)" : "var(--base)"}
        strokeWidth="1"
      />
    );
  });

  return (
    <Card className="p-0 overflow-hidden">
      <CardContent className="p-5 h-full" style={{ padding: "var(--layout-card-padding)" }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg" style={{ color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)" }}>
            Traffic Sources
          </h3>
        </div>
        <div className="flex items-center justify-between h-[280px]">
          <div className="relative w-[200px] h-[200px] mx-auto flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {paths}
            </svg>
          </div>
          <div className="flex-1 pl-6">
            {segments.map((segment) => (
              <div key={segment.label} className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: segment.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate" style={{ color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)" }}>
                    {segment.label}
                  </p>
                  <p className="text-xs text-tertiary" style={{ color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)" }}>
                    {segment.percentage.toFixed(1)}%
                  </p>
                </div>
                <span className="text-sm font-semibold tabular text-foreground flex-shrink-0" style={{ color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)" }}>
                  {segment.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DataTable({ transactions }: { transactions: Transaction[] }) {
  const { resolvedTheme } = useTheme();
  
  const statusConfig = {
    completed: { label: "Completed", variant: "success" as const },
    pending: { label: "Pending", variant: "warning" as const },
    failed: { label: "Failed", variant: "danger" as const },
  };

  return (
    <Card className="p-0 overflow-hidden">
      <CardContent className="p-0 h-full">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ padding: "var(--space-3) var(--space-4)" }}>Transaction</th>
                <th style={{ padding: "var(--space-3) var(--space-4)" }}>Date</th>
                <th style={{ padding: "var(--space-3) var(--space-4)" }}>Amount</th>
                <th style={{ padding: "var(--space-3) var(--space-4)" }}>Status</th>
                <th style={{ padding: "var(--space-3) var(--space-4)" }}>Customer</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const config = statusConfig[tx.status];
                const borderColor = resolvedTheme === "dark" ? "var(--border-dark)" : "var(--border)";
                const textColorSecondary = resolvedTheme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)";
                const textColorPrimary = resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)";
                
                return (
                  <tr key={tx.id}>
                    <td style={{ padding: "var(--space-3) var(--space-4)", borderTop: `1px solid ${borderColor}`, fontWeight: 500, color: textColorPrimary }}>
                      {tx.id}
                    </td>
                    <td style={{ padding: "var(--space-3) var(--space-4)", borderTop: `1px solid ${borderColor}`, color: textColorSecondary }}>
                      {tx.date}
                    </td>
                    <td style={{ padding: "var(--space-3) var(--space-4)", borderTop: `1px solid ${borderColor}`, fontWeight: 600, color: textColorPrimary, fontVariantNumeric: "tabular-nums" }}>
                      {tx.amount}
                    </td>
                    <td style={{ padding: "var(--space-3) var(--space-4)", borderTop: `1px solid ${borderColor}` }}>
                      <Badge variant={config.variant} dot>{config.label}</Badge>
                    </td>
                    <td style={{ padding: "var(--space-3) var(--space-4)", borderTop: `1px solid ${borderColor}`, color: textColorSecondary }}>
                      {tx.customer}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  const { resolvedTheme } = useTheme();
  
  return (
    <Card className="p-0 overflow-hidden">
      <CardContent className="p-5 h-full flex flex-col" style={{ padding: "var(--layout-card-padding)" }}>
        <h3 className="font-semibold text-lg mb-5" style={{ color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)" }}>
          Recent Activity
        </h3>
        <div className="flex-1 overflow-y-auto space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0 mt-2.5"
                style={{ background: item.dotColor }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground" style={{ color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)", lineHeight: 1.4 }}>
                  {item.text}
                </p>
                <p className="text-xs text-tertiary mt-0.5" style={{ color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)" }}>
                  {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickActions() {
  const { resolvedTheme } = useTheme();
  
  const actions = [
    { icon: Plus, label: "New Event", color: "var(--accent)" },
    { icon: Calendar, label: "Schedule", color: "var(--accent)" },
    { icon: Users, label: "Invite Team", color: "var(--accent)" },
    { icon: ChartBar, label: "View Reports", color: "var(--accent)" },
  ];

  return (
    <Card className="p-0 overflow-hidden">
      <CardContent className="p-5 h-full flex flex-col" style={{ padding: "var(--layout-card-padding)" }}>
        <h3 className="font-semibold text-lg mb-5" style={{ color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)" }}>
          Quick Actions
        </h3>
        <div className="flex-1 flex flex-col gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              className="w-full justify-start gap-3 h-12 rounded-xl"
              style={{
                color: resolvedTheme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)",
              }}
            >
              <action.icon
                className="h-5 w-5 flex-shrink-0"
                style={{ color: action.color, transform: "translateY(0.5px)" }}
              />
              <span className="font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}