"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus, Users, Shield, FileText, ChartBar, ActivityIcon, CheckCircle, XCircle,
  UserPlus, Trash, ArrowClockwise, MagnifyingGlass, FunnelSimple, CaretDown,
  CaretUp, CaretRight, Mailbox, Phone
} from "@phosphor-icons/react";
import { format } from "date-fns";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: string;
  approvalStatus: string;
  isActive: boolean;
  serviceNumber?: string;
  createdAt: string;
}

interface AdminStats {
  overview: {
    totalUsers: number;
    activeUsers: number;
    pendingUsers: number;
    totalEvents: number;
    activeEvents: number;
    completedEvents: number;
    totalEquipment: number;
    availableEquipment: number;
    damagedEquipment: number;
    userGrowth: number;
  };
  recentUsers: any[];
  recentEvents: any[];
  userRoles: Record<string, number>;
  eventsByStatus: Record<string, number>;
}

interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_user_id: string | null;
  details: string | null;
  metadata: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
  admin?: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
  target_user?: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
}

export default function AdminClient({
  currentUser,
  users,
  pendingUsers,
}: {
  currentUser: { id: string; email?: string };
  users: User[];
  pendingUsers: User[];
}) {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotalPages, setAuditTotalPages] = useState(1);
  const [auditLoading, setAuditLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const router = useRouter();

  // Fetch stats on mount
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch audit logs
  const fetchAuditLogs = async (page = 1) => {
    setAuditLoading(true);
    try {
      const res = await fetch(`/api/admin/audit?page=${page}&limit=20`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs);
        setAuditPage(data.pagination.page);
        setAuditTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setAuditLoading(false);
    }
  };

  // Bulk actions
  const handleBulkAction = async (action: string, role?: string) => {
    if (selectedUsers.length === 0) return;

    setBulkActionLoading(true);
    try {
      const res = await fetch("/api/admin/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, userIds: selectedUsers, data: { role } }),
        credentials: "include",
      });

      if (res.ok) {
        router.refresh();
        setSelectedUsers([]);
      } else {
        const error = await res.json();
        alert(`Failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Bulk action error:", error);
      alert("Failed to perform bulk action");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    await fetch(`/api/users/${userId}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approvalStatus: "approved" }),
      credentials: "include",
    });
    router.refresh();
  };

  const handleReject = async (userId: string) => {
    await fetch(`/api/users/${userId}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approvalStatus: "rejected" }),
      credentials: "include",
    });
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    await fetch(`/api/users/${deletingUser.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setDeletingUser(null);
    router.refresh();
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
      credentials: "include",
    });
    router.refresh();
  };

  const handleApprovalChange = async (userId: string, newStatus: string) => {
    await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approval_status: newStatus }),
      credentials: "include",
    });
    router.refresh();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(u => u.id).filter(id => id !== currentUser.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    setSelectedUsers(prev => checked ? [...prev, userId] : prev.filter(id => id !== userId));
  };

  // Load stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Load audit logs when section is active
  useEffect(() => {
    if (activeSection === "audit") {
      fetchAuditLogs();
    }
  }, [activeSection]);

  const statCards = [
    { label: "Total Users", value: stats?.overview.totalUsers || 0, icon: Users, color: "var(--accent)", trend: stats?.overview.userGrowth !== undefined ? `${stats.overview.userGrowth > 0 ? "+" : ""}${stats.overview.userGrowth}%` : null },
    { label: "Active Users", value: stats?.overview.activeUsers || 0, icon: CheckCircle, color: "var(--success)" },
    { label: "Pending Approval", value: stats?.overview.pendingUsers || 0, icon: Shield, color: "var(--warning)" },
    { label: "Total Events", value: stats?.overview.totalEvents || 0, icon: ActivityIcon, color: "var(--accent)" },
    { label: "Active Events", value: stats?.overview.activeEvents || 0, icon: ActivityIcon, color: "var(--success)" },
    { label: "Completed Events", value: stats?.overview.completedEvents || 0, icon: CheckCircle, color: "var(--text-tertiary)" },
    { label: "Total Equipment", value: stats?.overview.totalEquipment || 0, icon: ChartBar, color: "var(--accent)" },
    { label: "Available", value: stats?.overview.availableEquipment || 0, icon: CheckCircle, color: "var(--success)" },
    { label: "Damaged", value: stats?.overview.damagedEquipment || 0, icon: XCircle, color: "var(--danger)" },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
        return { label: "Active", variant: "success" as const };
      case "scheduled":
        return { label: "Scheduled", variant: "default" as const };
      case "completed":
        return { label: "Completed", variant: "default" as const };
      case "in-use":
        return { label: "In Use", variant: "warning" as const };
      case "damaged":
      case "rejected":
        return { label: "Damaged", variant: "danger" as const };
      case "pending":
        return { label: "Pending", variant: "warning" as const };
      default:
        return { label: status, variant: "default" as const };
    }
  };

  const getActiveBadge = (isActive: boolean) => (
    <Badge variant={isActive ? "success" : "default"} className="text-xs">
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );

  const getRoleBadge = (role: string) => (
    <Badge variant="default" className="text-xs capitalize">{role}</Badge>
  );

  const getApprovalBadge = (status: string) => (
    <Badge
      variant={status === "approved" ? "success" : status === "rejected" ? "danger" : "warning"}
      className="text-xs capitalize"
    >
      {status}
    </Badge>
  );

  const getEventStatusBadge = (status: string) => (
    <Badge
      variant={
        status === "active" ? "success" :
        status === "scheduled" ? "default" :
        status === "completed" ? "default" : "danger"
      }
      className="text-xs capitalize"
    >
      {status}
    </Badge>
  );

  const renderUserRow = (user: User, isCurrentUser: boolean) => {
    const fallback = user.firstName?.[0] || user.lastName?.[0] || user.email[0].toUpperCase();
    return (
      <div key={user.id} className="flex items-center justify-between p-4 border-b border-border hover:bg-[var(--hover-bg)] transition-colors" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={selectedUsers.includes(user.id)}
            onChange={(e) => handleSelectUser(user.id, e.target.checked)}
            disabled={isCurrentUser}
            className="h-4 w-4 rounded border-border accent"
            style={{ accentColor: "var(--accent)" }}
          />
          <Avatar size="sm" src={user.profileImageUrl} fallback={fallback} />
          <div className="min-w-0">
            <p className="font-medium truncate" style={{ color: "var(--text-primary)" }}>
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.email}
            </p>
            <p className="text-sm truncate" style={{ color: "var(--text-tertiary)" }}>{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={user.role}
            onValueChange={(value) => handleRoleChange(user.id, value)}
            disabled={isCurrentUser}
          >
            <SelectTrigger className="w-[130px]" style={{ height: "var(--layout-control-height)" }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="coordinator">Coordinator</SelectItem>
              <SelectItem value="agent">Agent</SelectItem>
              <SelectItem value="attachment">Attachment</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={user.approvalStatus}
            onValueChange={(value) => handleApprovalChange(user.id, value)}
          >
            <SelectTrigger className="w-[130px]" style={{ height: "var(--layout-control-height)" }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          {getActiveBadge(user.isActive)}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeletingUser(user)}
            disabled={isCurrentUser}
            className="rounded-xl"
            aria-label="Delete user"
          >
            <Trash className="h-5 w-5 text-danger" />
          </Button>
        </div>
      </div>
    );
  };

  const renderPendingRow = (user: User) => {
    const fallback = user.firstName?.[0] || user.lastName?.[0] || user.email[0].toUpperCase();
    return (
      <div key={user.id} className="p-4 border-b border-border" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Avatar size="sm" src={user.profileImageUrl} fallback={fallback} />
            <div className="min-w-0">
              <p className="font-medium truncate" style={{ color: "var(--text-primary)" }}>
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.email}
              </p>
              <p className="text-sm truncate" style={{ color: "var(--text-tertiary)" }}>{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Select
              value={user.approvalStatus}
              onValueChange={(value) => handleApprovalChange(user.id, value)}
            >
              <SelectTrigger className="w-[150px]" style={{ height: "var(--layout-control-height)" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={() => handleApprove(user.id)}
              className="gap-1"
              style={{ height: 38, paddingLeft: 12, paddingRight: 12 }}
            >
              <CheckCircle className="h-4 w-4 text-success" />
              <span>Approve</span>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleReject(user.id)}
              className="gap-1"
              style={{ height: 38, paddingLeft: 12, paddingRight: 12 }}
            >
              <XCircle className="h-4 w-4" />
              <span>Reject</span>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderAuditRow = (log: AuditLog) => (
    <tr key={log.id} className="border-b border-border hover:bg-[var(--hover-bg)] transition-colors" style={{ borderColor: "var(--border)" }}>
      <td className="px-5 py-3 text-sm" style={{ color: "var(--text-tertiary)" }}>
        {format(new Date(log.created_at), "MMM d, yyyy HH:mm")}
      </td>
      <td className="px-5 py-3 text-sm" style={{ color: "var(--text-primary)" }}>
        {log.admin ? (
          <>
            {log.admin.first_name && log.admin.last_name
              ? `${log.admin.first_name} ${log.admin.last_name}`
              : log.admin.email}
          </>
        ) : "Unknown"}
      </td>
      <td className="px-5 py-3">
        <Badge variant="default" className="text-xs capitalize">{log.action.replace("_", " ")}</Badge>
      </td>
      <td className="px-5 py-3 text-sm" style={{ color: "var(--text-primary)" }}>
        {log.target_user ? (
          <>
            {log.target_user.first_name && log.target_user.last_name
              ? `${log.target_user.first_name} ${log.target_user.last_name}`
              : log.target_user.email}
          </>
        ) : "—"}
      </td>
      <td className="px-5 py-3 text-sm max-w-xs truncate" style={{ color: "var(--text-tertiary)" }}>{log.details || "—"}</td>
      <td className="px-5 py-3 text-sm text-xs" style={{ color: "var(--text-tertiary)" }}>{log.ip_address}</td>
    </tr>
  );

  const sections = [
    { id: "overview", label: "Overview", icon: ChartBar },
    { id: "users", label: "User Management", icon: Users },
    { id: "approvals", label: "Pending Approvals", icon: Shield },
    { id: "audit", label: "Audit Logs", icon: FileText },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: "var(--layout-page-padding) var(--layout-page-padding) 0", display: "flex", flexDirection: "column", gap: "var(--layout-section-gap)" }}>
      {/* Header */}
      <div className="mb-[var(--layout-section-gap)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-[var(--layout-section-gap)]">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Admin Panel</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Administrative controls and user management</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => { fetchStats(); fetchAuditLogs(); }}
            className="gap-2"
            style={{ height: "var(--layout-control-height)", paddingLeft: "var(--space-5)", paddingRight: "var(--space-5)" }}
          >
            <ArrowClockwise className="h-5 w-5" />
            Refresh
          </Button>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mb-[var(--layout-section-gap)] border-b border-border pb-3" style={{ borderColor: "var(--border)" }}>
          {sections.map(section => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "ghost"}
              onClick={() => { setActiveSection(section.id); if (section.id === "audit") fetchAuditLogs(); }}
              className="gap-2 px-4"
              style={{ height: "var(--layout-control-height)", borderRadius: "var(--layout-border-radius-sm)" }}
            >
              <section.icon className="h-5 w-5" />
              {section.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Section */}
      {activeSection === "overview" && stats && (
        <>
          {/* KPI Grid - 9 cards in responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[var(--layout-card-gap)] mb-[var(--layout-section-gap)]">
            {statCards.map((stat, i) => (
              <Card key={i} style={{ padding: "var(--layout-kpi-padding)", animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start justify-between h-full">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm mb-1" style={{ color: "var(--text-tertiary)" }}>{stat.label}</p>
                    <p className="text-2xl font-bold tabular leading-tight" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
                    {stat.trend && (
                      <p className="text-xs mt-1" style={{ color: stat.trend.startsWith("+") ? "var(--success)" : "var(--danger)" }}>
                        {stat.trend} vs last period
                      </p>
                    )}
                  </div>
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `color-mix(in srgb, ${stat.color} 15%, transparent)`, color: stat.color }}
                  >
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts Row - User Roles & Events by Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--layout-card-gap)] mb-[var(--layout-section-gap)]">
            <Card style={{ padding: "var(--layout-card-padding)" }}>
              <h3 className="text-lg font-semibold mb-5" style={{ color: "var(--text-primary)" }}>User Roles Distribution</h3>
              <div className="space-y-[var(--space-4)]">
                {Object.entries(stats.userRoles).map(([role, count]) => (
                  <div key={role} className="flex items-center gap-3">
                    <span className="capitalize text-sm w-28 flex-shrink-0" style={{ color: "var(--text-primary)" }}>{role}</span>
                    <div className="h-2 bg-[var(--border)] rounded-full flex-1 max-w-[200px]" style={{ borderColor: "var(--border)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          background: "var(--accent)",
                          width: `${(count / (stats.overview.totalUsers || 1)) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium tabular w-10 text-right" style={{ color: "var(--text-primary)" }}>{count}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card style={{ padding: "var(--layout-card-padding)" }}>
              <h3 className="text-lg font-semibold mb-5" style={{ color: "var(--text-primary)" }}>Events by Status</h3>
              <div className="space-y-[var(--space-4)]">
                {Object.entries(stats.eventsByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center gap-3">
                    <span className="capitalize text-sm w-28 flex-shrink-0" style={{ color: "var(--text-primary)" }}>{status}</span>
                    <div className="h-2 bg-[var(--border)] rounded-full flex-1 max-w-[200px]" style={{ borderColor: "var(--border)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          background: "var(--accent)",
                          width: `${(count / (stats.overview.totalEvents || 1)) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium tabular w-10 text-right" style={{ color: "var(--text-primary)" }}>{count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Users & Recent Events */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--layout-card-gap)]">
            <Card style={{ padding: "var(--layout-card-padding)" }}>
              <h3 className="text-lg font-semibold mb-5" style={{ color: "var(--text-primary)" }}>Recent Users</h3>
              {stats.recentUsers.length === 0 ? (
                <p className="text-center py-8" style={{ color: "var(--text-tertiary)" }}>No recent users</p>
              ) : (
                <div className="space-y-[var(--space-3)]">
                  {stats.recentUsers.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--hover-bg)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                          <span className="text-sm font-semibold">{user.first_name?.[0] || user.email[0].toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                            {user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : user.email}
                          </p>
                          <p className="text-xs truncate max-w-[200px]" style={{ color: "var(--text-tertiary)" }}>{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getRoleBadge(user.role)}
                        {getApprovalBadge(user.approval_status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card style={{ padding: "var(--layout-card-padding)" }}>
              <h3 className="text-lg font-semibold mb-5" style={{ color: "var(--text-primary)" }}>Recent Events</h3>
              {stats.recentEvents.length === 0 ? (
                <p className="text-center py-8" style={{ color: "var(--text-tertiary)" }}>No recent events</p>
              ) : (
                <div className="space-y-[var(--space-3)]">
                  {stats.recentEvents.map((event: any) => (
                    <div key={event.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--hover-bg)" }}>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate" style={{ color: "var(--text-primary)" }}>{event.title}</p>
                        <p className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>{event.atoll} - {event.island}</p>
                      </div>
                      {getEventStatusBadge(event.status)}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}

      {/* User Management Section */}
      {activeSection === "users" && (
        <>
          {/* Bulk Actions Bar */}
          {selectedUsers.length > 0 && (
            <div className="mb-[var(--layout-section-gap)] p-[var(--layout-card-padding)] animate-slide-in-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{selectedUsers.length} user(s) selected</span>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => handleBulkAction("approve")} disabled={bulkActionLoading} className="gap-1" style={{ height: 38, paddingLeft: 12, paddingRight: 12 }}>
                    <CheckCircle className="h-4 w-4" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction("reject")} disabled={bulkActionLoading} className="gap-1" style={{ height: 38, paddingLeft: 12, paddingRight: 12 }}>
                    <XCircle className="h-4 w-4" /> Reject
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleBulkAction("activate")} disabled={bulkActionLoading} className="gap-1" style={{ height: 38, paddingLeft: 12, paddingRight: 12 }}>
                    <UserPlus className="h-4 w-4" /> Activate
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleBulkAction("deactivate")} disabled={bulkActionLoading} className="gap-1" style={{ height: 38, paddingLeft: 12, paddingRight: 12 }}>
                    <UserPlus className="h-4 w-4" /> Deactivate
                  </Button>
                  <Select onValueChange={(role) => handleBulkAction("role", role)} disabled={bulkActionLoading}>
                    <SelectTrigger className="w-[130px]" style={{ height: 38 }}>
                      <SelectValue placeholder="Change Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="coordinator">Coordinator</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="attachment">Attachment</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")} disabled={bulkActionLoading} className="gap-1" style={{ height: 38, paddingLeft: 12, paddingRight: 12 }}>
                    <Trash className="h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Users Table */}
          <Card style={{ padding: 0 }}>
            <div className="p-[var(--layout-card-padding)] border-b border-border" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>All Users</h3>
            </div>
            <div className="divide-y divide-border" style={{ borderColor: "var(--border)" }}>
              {users.map((user) => renderUserRow(user, user.id === currentUser.id))}
            </div>
          </Card>
        </>
      )}

      {/* Pending Approvals Section */}
      {activeSection === "approvals" && (
        <Card style={{ padding: 0 }}>
          <div className="p-[var(--layout-card-padding)] border-b border-border" style={{ borderColor: "var(--border)" }}>
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Shield className="h-5 w-5 text-accent" />
              Pending Approvals <span className="text-sm font-normal" style={{ color: "var(--text-tertiary)" }}>({pendingUsers.length})</span>
            </h3>
          </div>
          <div className="divide-y divide-border" style={{ borderColor: "var(--border)" }}>
            {pendingUsers.length === 0 ? (
              <div className="p-[var(--space-8)] text-center">
                <Shield className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--text-tertiary)" }} />
                <p className="text-lg" style={{ color: "var(--text-tertiary)" }}>No pending approvals</p>
              </div>
            ) : (
              pendingUsers.map((user) => renderPendingRow(user))
            )}
          </div>
        </Card>
      )}

      {/* Audit Logs Section */}
      {activeSection === "audit" && (
        <Card style={{ padding: 0 }}>
          <div className="p-[var(--layout-card-padding)] border-b border-border" style={{ borderColor: "var(--border)" }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <FileText className="h-5 w-5 text-accent" />
                Audit Logs
              </h3>
              <Button
                variant="ghost"
                onClick={() => fetchAuditLogs(auditPage)}
                disabled={auditLoading}
                className="gap-2"
                style={{ height: 40, paddingLeft: 12, paddingRight: 12 }}
              >
                <ArrowClockwise className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
          <div className="p-[var(--layout-card-padding)]">
            {auditLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent mx-auto mb-2" style={{ borderColor: "var(--accent)" }} />
                <p style={{ color: "var(--text-tertiary)" }}>Loading audit logs...</p>
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--text-tertiary)" }} />
                <p className="text-lg" style={{ color: "var(--text-tertiary)" }}>No audit logs found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ borderCollapse: "collapse" }}>
                    <thead>
                      <tr className="border-b border-border" style={{ borderColor: "var(--border)" }}>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Date</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Admin</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Action</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Target User</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Details</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log) => renderAuditRow(log))}
                    </tbody>
                  </table>
                </div>

                {auditTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-5 pt-5 border-t border-border" style={{ borderColor: "var(--border)" }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fetchAuditLogs(auditPage - 1)}
                      disabled={auditPage === 1 || auditLoading}
                      style={{ height: 38, paddingLeft: 12, paddingRight: 12 }}
                    >
                      Previous
                    </Button>
                    <span className="text-sm px-3" style={{ color: "var(--text-tertiary)" }}>
                      Page {auditPage} of {auditTotalPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fetchAuditLogs(auditPage + 1)}
                      disabled={auditPage === auditTotalPages || auditLoading}
                      style={{ height: 38, paddingLeft: 12, paddingRight: 12 }}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      )}

      <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingUser?.firstName && deletingUser?.lastName
                ? `${deletingUser.firstName} ${deletingUser.lastName}`
                : deletingUser?.email}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-3">
            <AlertDialogCancel style={{ height: 40, paddingLeft: 16, paddingRight: 16 }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-[var(--danger)] hover:bg-[var(--danger)] text-white" style={{ height: 40, paddingLeft: 16, paddingRight: 16 }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}