"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useRouter, usePathname } from "next/navigation";
import { Calendar, Users, MapPin, CheckCircle, CaretDown, CaretUp, TrendUp, TrendDown, ActivityIcon, ChartBar, ChartPie, CurrencyDollar, ShoppingCart, Clock, ArrowUpRight, ArrowDownRight, Minus, Plus, MagnifyingGlass, List, X, CaretLeft, CaretRight, User, Log, Gear, Archive, Package, MapPin as MapPinIcon, ChatCircle, MagnifyingGlass as SearchIcon } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggleCompact } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/components/providers/ThemeProvider";

interface Event {
  id: string;
  title: string;
  atoll: string;
  island: string;
  eventLocation?: string;
  status: string;
  participantCount: number;
  eventDate?: string;
  createdAt?: string;
  contact?: string;
  comment?: string;
}

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
}

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
    icon: <Users className="h-5 w-5" />,
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

const trafficSources = [
  { label: "Organic Search", value: 42, color: "var(--accent)" },
  { label: "Direct", value: 28, color: "color-mix(in srgb, var(--accent) 60%, var(--text-primary))" },
  { label: "Social", value: 18, color: "var(--text-secondary)" },
  { label: "Referral", value: 12, color: "var(--text-tertiary)" },
];

const recentTransactions = [
  { id: 1, customer: "Sarah Mitchell", email: "sarah@company.com", avatar: "SM", avatarColor: "linear-gradient(135deg,#7C3AED,#A78BFA)", plan: "Pro Annual", amount: "$299.00", status: "Completed", statusType: "success", date: "Aug 20, 2026" },
  { id: 2, customer: "James Rivera", email: "j.r@design.co", avatar: "JR", avatarColor: "linear-gradient(135deg,#10B981,#34D399)", plan: "Starter Monthly", amount: "$29.00", status: "Completed", statusType: "success", date: "Aug 19, 2026" },
  { id: 3, customer: "Emma Chen", email: "emma@studio.io", avatar: "EC", avatarColor: "linear-gradient(135deg,#F59E0B,#FBBF24)", plan: "Team Plan", amount: "$149.00", status: "Pending", statusType: "pending", date: "Aug 19, 2026" },
  { id: 4, customer: "Marcus Webb", email: "marcus.w@tech.dev", avatar: "MW", avatarColor: "linear-gradient(135deg,#EF4444,#F87171)", plan: "Enterprise", amount: "$999.00", status: "Failed", statusType: "failed", date: "Aug 18, 2026" },
  { id: 5, customer: "Lena Park", email: "lena.park@lab.ai", avatar: "LP", avatarColor: "linear-gradient(135deg,#3B82F6,#60A5FA)", plan: "Pro Monthly", amount: "$49.00", status: "Completed", statusType: "success", date: "Aug 18, 2026" },
];

const quickActions = [
  { label: "Upload Data", desc: "Import CSV", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg> },
  { label: "Invite Team", desc: "Add members", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg> },
  { label: "New Report", desc: "From template", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg> },
  { label: "Settings", desc: "Preferences", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
];

const activityItems = [
  { id: 1, dotColor: "var(--success)", text: "Sarah M. upgraded to Pro Annual", time: "2 minutes ago" },
  { id: 2, dotColor: "var(--warning)", text: "Weekly analytics report is ready", time: "1 hour ago" },
  { id: 3, dotColor: "var(--accent)", text: "3 new invites pending approval", time: "3 hours ago" },
];

// Layout constants matching the 8-point spacing scale
const LAYOUT = {
  pagePadding: 24,
  sidebarWidthExpanded: 288,
  sidebarWidthCollapsed: 72,
  sidebarPaddingH: 18,
  sidebarPaddingV: 24,
  topBarHeight: 68,
  topBarPaddingH: 20,
  topBarActionGap: 10,
  topBarControlHeight: 40,
  cardPadding: 24,
  kpiCardPadding: 20,
  cardRowGap: 20,
  sectionGap: 32,
  topBarToHeroGap: 24,
  heroToKpiGap: 24,
  kpiToChartsGap: 32,
  chartsToTableGap: 32,
  navItemHeight: 44,
  brandLogoSize: 40,
  breadcrumbSepSize: 14,
  breadcrumbSepGap: 8,
  notifDotSize: 8,
  notifDotOffset: 8,
} as const;

export default function DashboardClient({
  user,
  events,
  users,
  activeEventsCount,
  completedEventsCount,
  visitedIslands,
  atollsVisited,
  teamMembersCount,
}: {
  user: { id: string; email?: string; user_metadata?: { full_name?: string; avatar_url?: string } };
  events: Event[];
  users: User[];
  activeEventsCount: number;
  completedEventsCount: number;
  visitedIslands: number;
  atollsVisited: number;
  teamMembersCount: number;
}) {
  const { resolvedTheme } = useTheme();

  const getSparklinePath = (data: number[], width: number = 160, height: number = 44) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    return data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(" ");
  };

  const getSparklineAreaPath = (data: number[], width: number = 160, height: number = 44) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return { x, y };
    });
    let path = `M${points[0].x},${points[0].y} `;
    points.forEach(p => { path += `L${p.x},${p.y} `; });
    path += `L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`;
    return path;
  };

  return (
    <div className="flex min-h-screen bg-background" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      {/* Main Content Area - Dashboard Layout is now handled by DashboardLayout wrapper */}
      <main className="flex-1 pt-20 pb-8 lg:pb-0 animate-fade-in" style={{ padding: `0 ${LAYOUT.pagePadding}px ${LAYOUT.pagePadding}px` }}>
        {/* Hero */}
        <div className="hero" style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-4)",
          marginTop: LAYOUT.topBarToHeroGap,
          marginBottom: LAYOUT.heroToKpiGap,
        }}>
          <div className="hero-greet">
            <h1 style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
              lineHeight: 1.2,
            }}>
              Good morning, {user.user_metadata?.full_name?.split(" ")[0] || "Alex"}
            </h1>
            <p style={{
              color: resolvedTheme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)",
              marginTop: "var(--space-1)",
              fontSize: 14,
            }}>
              Here's what's happening with your business today.
            </p>
          </div>
          <Button className="btn-primary">
            <Plus className="h-4 w-4" style={{ transform: "translateY(0.5px)" }} />
            Create Report
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "var(--space-5)",
        }}>
          {kpiData.map((kpi, index) => (
            <div key={index} className="card" style={{
              padding: LAYOUT.kpiCardPadding,
              display: "flex",
              flexDirection: "column",
              minHeight: 160,
            }}>
              <div className="kpi-icon" style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                display: "grid",
                placeItems: "center",
                color: kpi.iconColor,
                marginBottom: "var(--space-4)",
                background: resolvedTheme === "dark" ? "var(--accent-soft-dark)" : "var(--accent-soft)",
                boxShadow: resolvedTheme === "dark" ? "none" : "var(--neu-raised-sm)",
              }}>
                {kpi.icon}
              </div>
              <div className="kpi-label" style={{
                fontSize: 11,
                color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}>
                {kpi.label}
              </div>
              <div className="kpi-value tabular" style={{
                fontSize: 28,
                fontWeight: 800,
                color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                marginTop: "var(--space-1)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}>
                {kpi.value}
              </div>
              <div className="kpi-footer" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "var(--space-3)",
                gap: "var(--space-2)",
              }}>
                <span className="kpi-delta" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--space-1)",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "var(--space-1) var(--space-2)",
                  borderRadius: 8,
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                  color: kpi.trend === "up" ? "var(--success)" : "var(--danger)",
                  background: kpi.trend === "up"
                    ? "color-mix(in srgb, var(--success) 12%, transparent)"
                    : "color-mix(in srgb, var(--danger) 12%, transparent)",
                }}>
                  {kpi.trend === "up" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12, flexShrink: 0 }}>
                      <polyline points="18 15 12 9 6 15"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12, flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  )}
                  {Math.abs(kpi.delta)}%
                </span>
                <span className="kpi-compare" style={{
                  fontSize: 11.5,
                  color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)",
                  textAlign: "right",
                  lineHeight: 1.3,
                }}>
                  {kpi.deltaLabel}
                </span>
              </div>
              <svg
                className="sparkline"
                viewBox={`0 0 160 44`}
                preserveAspectRatio="none"
                style={{ width: "100%", height: 44, marginTop: "var(--space-3)", display: "block" }}
              >
                <defs>
                  <linearGradient id={`areaGrad${index}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={kpi.iconColor} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={kpi.iconColor} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  className="area"
                  d={getSparklineAreaPath(kpi.sparkline)}
                  fill={`url(#areaGrad${index})`}
                />
                <path
                  d={getSparklinePath(kpi.sparkline)}
                  stroke={kpi.iconColor}
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="charts-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "var(--space-5)",
          marginTop: LAYOUT.kpiToChartsGap,
        }}>
          {/* Area Chart - 8 cols */}
          <div className="card" style={{
            gridColumn: "span 8",
            padding: LAYOUT.cardPadding,
            display: "flex",
            flexDirection: "column",
          }}>
            <div className="card-header" style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "var(--space-5)",
              gap: "var(--space-3)",
            }}>
              <div>
                <div className="card-title" style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                  lineHeight: 1.3,
                }}>
                  Revenue Overview
                </div>
                <div className="card-sub" style={{
                  fontSize: 12,
                  color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)",
                  marginTop: "var(--space-1)",
                  lineHeight: 1.4,
                }}>
                  Monthly performance this year
                </div>
              </div>
              <div className="chart-legend" style={{
                display: "flex",
                gap: "var(--space-4)",
                fontSize: 12,
                color: resolvedTheme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)",
                alignItems: "center",
              }}>
                <div className="chart-legend-item" style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                  <span className="legend-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, transform: "translateY(0.5px)" }}></span>
                  This year
                </div>
                <div className="chart-legend-item" style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                  <span className="legend-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)", flexShrink: 0, transform: "translateY(0.5px)" }}></span>
                  Last year
                </div>
              </div>
            </div>
            <svg
              className="area-chart"
              viewBox="0 0 600 260"
              preserveAspectRatio="none"
              style={{ width: "100%", height: 260, display: "block" }}
            >
              <defs>
                <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <g stroke={resolvedTheme === "dark" ? "var(--border-dark)" : "var(--border)"} strokeWidth="1" strokeDasharray="3 4">
                <line x1="0" y1="50" x2="600" y2="50" />
                <line x1="0" y1="110" x2="600" y2="110" />
                <line x1="0" y1="170" x2="600" y2="170" />
                <line x1="0" y1="230" x2="600" y2="230" />
              </g>
              {/* Last year */}
              <path
                d="M0,160 C60,150 100,170 150,140 C200,115 250,150 300,120 C350,95 400,110 450,85 C500,65 550,80 600,60 L600,260 L0,260 Z"
                fill={resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)"}
                fillOpacity="0.08"
              />
              <path
                d="M0,160 C60,150 100,170 150,140 C200,115 250,150 300,120 C350,95 400,110 450,85 C500,65 550,80 600,60"
                fill="none"
                stroke={resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)"}
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
              {/* This year */}
              <path
                d="M0,200 C60,180 100,190 150,160 C200,130 250,150 300,110 C350,70 400,90 450,50 C500,25 550,40 600,20 L600,260 L0,260 Z"
                fill="url(#areaGrad)"
              />
              <path
                d="M0,200 C60,180 100,190 150,160 C200,130 250,150 300,110 C350,70 400,90 450,50 C500,25 550,40 600,20"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Data point */}
              <circle cx="450" cy="50" r="5" fill="var(--accent)" />
              <circle cx="450" cy="50" r="10" fill="var(--accent)" fillOpacity="0.2" />
              {/* X labels */}
              <g fill={resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)"} fontSize="10" fontFamily="Inter">
                <text x="0" y="252">Jan</text>
                <text x="90" y="252">Feb</text>
                <text x="175" y="252">Mar</text>
                <text x="260" y="252">Apr</text>
                <text x="345" y="252">May</text>
                <text x="420" y="252">Jun</text>
                <text x="500" y="252">Jul</text>
                <text x="575" y="252">Aug</text>
              </g>
            </svg>
          </div>

          {/* Donut Chart - 4 cols */}
          <div className="card" style={{
            gridColumn: "span 4",
            padding: LAYOUT.cardPadding,
            display: "flex",
            flexDirection: "column",
          }}>
            <div className="card-header" style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "var(--space-5)",
              gap: "var(--space-3)",
            }}>
              <div>
                <div className="card-title" style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                  lineHeight: 1.3,
                }}>
                  Traffic Sources
                </div>
                <div className="card-sub" style={{
                  fontSize: 12,
                  color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)",
                  marginTop: "var(--space-1)",
                  lineHeight: 1.4,
                }}>
                  Where visitors come from
                </div>
              </div>
            </div>
            <div className="donut-wrap" style={{ display: "flex", alignItems: "center", gap: "var(--space-6)", flex: 1 }}>
              <svg className="donut" viewBox="0 0 42 42" style={{ width: 160, height: 160, flexShrink: 0 }}>
                <circle cx="21" cy="21" r="15.915" fill="none" stroke={resolvedTheme === "dark" ? "var(--border-dark)" : "var(--border)"} strokeWidth="5"/>
                <circle cx="21" cy="21" r="15.915" fill="none" stroke="var(--accent)" strokeWidth="5" strokeDasharray="42 58" strokeDashoffset="25" strokeLinecap="round"/>
                <circle cx="21" cy="21" r="15.915" fill="none" stroke="color-mix(in srgb, var(--accent) 60%, var(--text-primary))" strokeWidth="5" strokeDasharray="28 72" strokeDashoffset="-17" strokeLinecap="round"/>
                <circle cx="21" cy="21" r="15.915" fill="none" stroke="var(--text-secondary)" strokeWidth="5" strokeDasharray="18 82" strokeDashoffset="-45" strokeLinecap="round"/>
                <circle cx="21" cy="21" r="15.915" fill="none" stroke="var(--text-tertiary)" strokeWidth="5" strokeDasharray="12 88" strokeDashoffset="-63" strokeLinecap="round"/>
                <text x="21" y="19.5" textAnchor="middle" fill={resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)"} fontSize="5" fontWeight="700" fontFamily="Inter" dominantBaseline="central">84.2K</text>
                <text x="21" y="24.5" textAnchor="middle" fill={resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)"} fontSize="2.8" fontFamily="Inter" dominantBaseline="central">visitors</text>
              </svg>
              <div className="donut-legend" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", flex: 1, minWidth: 0 }}>
                {trafficSources.map((source, idx) => (
                  <div key={idx} className="donut-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-2)", fontSize: 13 }}>
                    <div className="donut-item-left" style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: resolvedTheme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)", minWidth: 0 }}>
                      <span className="legend-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: source.color, flexShrink: 0 }}></span>
                      {source.label}
                    </div>
                    <span className="donut-item-val" style={{ fontWeight: 700, color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
                      {source.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table + bottom row */}
        <div className="bottom-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "var(--space-5)",
          marginTop: LAYOUT.chartsToTableGap,
        }}>
          <div className="card" style={{
            gridColumn: "span 8",
            padding: LAYOUT.cardPadding,
          }}>
            <div className="card-header" style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "var(--space-5)",
              gap: "var(--space-3)",
            }}>
              <div>
                <div className="card-title" style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                  lineHeight: 1.3,
                }}>
                  Recent Transactions
                </div>
                <div className="card-sub" style={{
                  fontSize: 12,
                  color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)",
                  marginTop: "var(--space-1)",
                  lineHeight: 1.4,
                }}>
                  Latest payments processed
                </div>
              </div>
              <a className="card-action" href="#" style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--accent)",
                padding: "var(--space-1) var(--space-3)",
                borderRadius: 8,
                marginLeft: "auto",
                alignSelf: "flex-start",
                lineHeight: 1.4,
                flexShrink: 0,
              }}>
                View all →
              </a>
            </div>
            <div className="table-wrap" style={{ overflowX: "auto", margin: `0 ${-LAYOUT.cardPadding}px`, padding: `0 ${LAYOUT.cardPadding}px`, marginTop: `calc(-1 * var(--space-2))` }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)", padding: `0 var(--space-3) var(--space-3)`, whiteSpace: "nowrap" }}>Customer</th>
                    <th style={{ textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)", padding: `0 var(--space-3) var(--space-3)`, whiteSpace: "nowrap" }}>Plan</th>
                    <th style={{ textAlign: "right", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)", padding: `0 var(--space-3) var(--space-3)`, whiteSpace: "nowrap" }}>Amount</th>
                    <th style={{ textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)", padding: `0 var(--space-3) var(--space-3)`, whiteSpace: "nowrap" }}>Status</th>
                    <th style={{ textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)", padding: `0 0 var(--space-3)`, whiteSpace: "nowrap" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => {
                    const borderColor = resolvedTheme === "dark" ? "var(--border-dark)" : "var(--border)";
                    const textColorSecondary = resolvedTheme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)";
                    const textColorPrimary = resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)";
                    const textColorTertiary = resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)";
                    const statusColor = tx.statusType === "success" ? "var(--success)" : tx.statusType === "pending" ? "var(--warning)" : "var(--danger)";
                    const statusBg = tx.statusType === "success" ? "color-mix(in srgb, var(--success) 14%, transparent)" : tx.statusType === "pending" ? "color-mix(in srgb, var(--warning) 14%, transparent)" : "color-mix(in srgb, var(--danger) 14%, transparent)";
                    return (
                      <tr key={tx.id}>
                        <td style={{ padding: "var(--space-3) var(--space-3)", borderTop: `1px solid ${borderColor}`, fontSize: 13, color: textColorSecondary, verticalAlign: "middle" }}>
                          <div className="customer-cell" style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                            <div className="avatar" style={{ width: 32, height: 32, borderRadius: "50%", background: tx.avatarColor, display: "grid", placeItems: "center", color: "white", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{tx.avatar}</div>
                            <div>
                              <div className="customer-name" style={{ fontWeight: 600, color: textColorPrimary, fontSize: 13, lineHeight: 1.2 }}>{tx.customer}</div>
                              <div className="customer-email" style={{ fontSize: 11.5, color: textColorTertiary, marginTop: 2, lineHeight: 1.2 }}>{tx.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "var(--space-3) var(--space-3)", borderTop: `1px solid ${borderColor}`, fontSize: 13, color: textColorSecondary }}>{tx.plan}</td>
                        <td className="amount tabular" style={{ fontWeight: 700, color: textColorPrimary, fontVariantNumeric: "tabular-nums", textAlign: "right", display: "block", padding: "var(--space-3) var(--space-3)", borderTop: `1px solid ${borderColor}` }}>{tx.amount}</td>
                        <td style={{ padding: "var(--space-3) var(--space-3)", borderTop: `1px solid ${borderColor}` }}>
                          <span className={`status-pill ${tx.statusType}`} style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "var(--space-1)",
                            padding: "var(--space-1) var(--space-2)",
                            borderRadius: "999px",
                            fontSize: 11,
                            fontWeight: 600,
                            lineHeight: 1.3,
                            whiteSpace: "nowrap",
                            color: statusColor,
                            background: statusBg,
                          }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", flexShrink: 0 }} />
                            {tx.status}
                          </span>
                        </td>
                        <td style={{ padding: "var(--space-3) 0", borderTop: `1px solid ${borderColor}`, fontSize: 13, color: textColorSecondary }}>{tx.date}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card" style={{
            gridColumn: "span 4",
            padding: LAYOUT.cardPadding,
            display: "flex",
            flexDirection: "column",
          }}>
            <div className="card-header" style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "var(--space-5)",
              gap: "var(--space-3)",
            }}>
              <div>
                <div className="card-title" style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                  lineHeight: 1.3,
                }}>
                  Quick Actions
                </div>
                <div className="card-sub" style={{
                  fontSize: 12,
                  color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)",
                  marginTop: "var(--space-1)",
                  lineHeight: 1.4,
                }}>
                  Shortcuts
                </div>
              </div>
            </div>
            <div className="actions-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
              {quickActions.map((action, idx) => (
                <button key={idx} className="action-tile" style={{
                  padding: "var(--space-4) var(--space-3)",
                  borderRadius: 14,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "var(--space-2)",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                  cursor: "pointer",
                  background: resolvedTheme === "dark" ? "var(--surface-raised-dark)" : "transparent",
                  border: resolvedTheme === "dark" ? "1px solid var(--border-dark)" : "none",
                  boxShadow: resolvedTheme === "light" ? "var(--neu-raised-sm)" : "none",
                }}>
                  <div className="action-icon" style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    display: "grid",
                    placeItems: "center",
                    color: "var(--accent)",
                    background: resolvedTheme === "dark" ? "var(--accent-soft-dark)" : "var(--accent-soft)",
                    boxShadow: resolvedTheme === "light" ? "var(--neu-raised-sm)" : "none",
                  }}>
                    {action.icon}
                  </div>
                  <div className="action-label" style={{ fontWeight: 600, fontSize: 13, color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)", lineHeight: 1.3 }}>{action.label}</div>
                  <div className="action-desc" style={{ fontSize: 11, color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)", lineHeight: 1.3 }}>{action.desc}</div>
                </button>
              ))}
            </div>

            <div className="activity-section" style={{ marginTop: "var(--space-5)", paddingTop: "var(--space-5)", borderTop: `1px solid ${resolvedTheme === "dark" ? "var(--border-dark)" : "var(--border)"}` }}>
              <div className="card-title" style={{ fontSize: 14, marginBottom: "var(--space-3)", color: resolvedTheme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)" }}>Recent Activity</div>
              <div className="activity-list" style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                {activityItems.map((item) => (
                  <div key={item.id} className="activity-item" style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--space-3)",
                    padding: "var(--space-2) var(--space-3)",
                    borderRadius: 10,
                    transition: "background 0.2s",
                    background: "transparent",
                  }}>
                    <div className="activity-dot" style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 7, flexShrink: 0, background: item.dotColor }}></div>
                    <div style={{ flex: 1 }}>
                      <div className="activity-text" style={{ fontSize: 13, color: resolvedTheme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)", lineHeight: 1.4 }}>
                        {item.text}
                      </div>
                      <div className="activity-time" style={{ fontSize: 11, color: resolvedTheme === "dark" ? "var(--text-tertiary-dark)" : "var(--text-tertiary)", marginTop: 2 }}>{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}