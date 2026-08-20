"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
import { CheckCircle, XCircle, UserPlus, Trash2, Download, RefreshCw, Users, Shield, FileText, Activity, BarChart3, ChevronDown, ChevronUp, Search, Filter } from "lucide-react";
import Image from "next/image";
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

// Layout constants matching the 8-point spacing scale
const LAYOUT = {
  pagePadding: 24,           // --space-6
  cardPadding: 24,           // --space-6
  kpiCardPadding: 20,        // --space-5
  sectionGap: 32,            // --space-7
  cardRowGap: 20,            // --space-5
  controlHeight: 44,         // tap-friendly
  iconSize: 20,              // 20px icons
  iconGap: 8,                // icon-text gap
  buttonPaddingH: 16,        // 16px horizontal
  buttonPaddingV: 10,        // 10px vertical
  avatarSize: 32,            // 32px avatar in table
} as const;

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
    { label: "Total Users", value: stats?.overview.totalUsers || 0, icon: Users, color: "hsl(var(--accent))", trend: stats?.overview.userGrowth !== undefined ? `${stats.overview.userGrowth > 0 ? "+" : ""}${stats.overview.userGrowth}%` : null },
    { label: "Active Users", value: stats?.overview.activeUsers || 0, icon: CheckCircle, color: "#10B981" },
    { label: "Pending Approval", value: stats?.overview.pendingUsers || 0, icon: Shield, color: "#F59E0B" },
    { label: "Total Events", value: stats?.overview.totalEvents || 0, icon: Activity, color: "#3B82F6" },
    { label: "Active Events", value: stats?.overview.activeEvents || 0, icon: Activity, color: "#10B981" },
    { label: "Completed Events", value: stats?.overview.completedEvents || 0, icon: CheckCircle, color: "#6B7280" },
    { label: "Total Equipment", value: stats?.overview.totalEquipment || 0, icon: BarChart3, color: "#8B5CF6" },
    { label: "Available", value: stats?.overview.availableEquipment || 0, icon: CheckCircle, color: "#10B981" },
    { label: "Damaged", value: stats?.overview.damagedEquipment || 0, icon: XCircle, color: "#EF4444" },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
        return "bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))] dark:bg-[hsl(var(--accent)/0.2)] dark:text-[hsl(var(--accent))]";
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "in-use":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "damaged":
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getActiveBadge = (isActive: boolean) => (
    <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );

  const getRoleBadge = (role: string) => (
    <Badge variant="secondary" className="text-xs capitalize">{role}</Badge>
  );

  const getApprovalBadge = (status: string) => (
    <Badge 
      variant={status === "approved" ? "default" : status === "rejected" ? "destructive" : "secondary"}
      className="text-xs capitalize"
    >
      {status}
    </Badge>
  );

  const getEventStatusBadge = (status: string) => (
    <Badge 
      variant={
        status === "active" ? "default" :
        status === "scheduled" ? "secondary" :
        status === "completed" ? "outline" : "destructive"
      }
      className="text-xs capitalize"
    >
      {status}
    </Badge>
  );

  const renderUserRow = (user: User, isCurrentUser: boolean) => (
    <div key={user.id} className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={selectedUsers.includes(user.id)}
          onChange={(e) => handleSelectUser(user.id, e.target.checked)}
          disabled={isCurrentUser}
          className="h-4 w-4 rounded border-border text-[hsl(var(--accent))]"
        />
        <div className="relative w-8 h-8 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0" style={{ background: 'hsl(var(--accent)/0.15)' }}>
          {user.profileImageUrl ? (
            <Image
              src={user.profileImageUrl}
              alt={`${user.firstName || ""} ${user.lastName || ""}`}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-[hsl(var(--accent))]">
              {user.firstName?.[0] || user.email[0].toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.email}
          </p>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Select
          value={user.role}
          onValueChange={(value) => handleRoleChange(user.id, value)}
          disabled={isCurrentUser}
        >
          <SelectTrigger className="w-[130px]">
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
          <SelectTrigger className="w-[130px]">
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
          className="rounded-xl btn-neo-secondary dark:btn-mono-secondary"
          aria-label="Delete user"
          style={{ height: 36, width: 36 }}
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    </div>
  );

  const renderPendingRow = (user: User) => (
    <div key={user.id} className="card-neo dark:card-mono p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.email}
          </p>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={user.approvalStatus}
            onValueChange={(value) => handleApprovalChange(user.id, value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleApprove(user.id)}
            className="btn-neo-secondary dark:btn-mono-secondary gap-1"
            style={{ height: 38, paddingLeft: 12, paddingRight: 12 }}
          >
            <CheckCircle className="h-3.5 w-3.5 text-green-600" />
            <span>Approve</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReject(user.id)}
            className="btn-neo-secondary dark:btn-mono-secondary gap-1"
            style={{ height: 38, paddingLeft: 12, paddingRight: 12 }}
          >
            <XCircle className="h-3.5 w-3.5 text-red-600" />
            <span>Reject</span>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAuditRow = (log: AuditLog) => (
    <tr key={log.id} className="border-b border-border hover:bg-muted/30 transition-colors">
      <td className="px-5 py-3 text-sm text-muted-foreground">
        {format(new Date(log.created_at), "MMM d, yyyy HH:mm")}
      </td>
      <td className="px-5 py-3 text-sm text-foreground">
        {log.admin ? (
          <>
            {log.admin.first_name && log.admin.last_name
              ? `${log.admin.first_name} ${log.admin.last_name}`
              : log.admin.email}
          </>
        ) : "Unknown"}
      </td>
      <td className="px-5 py-3">
        <Badge variant="secondary" className="text-xs capitalize">{log.action.replace("_", " ")}</Badge>
      </td>
      <td className="px-5 py-3 text-sm text-foreground">
        {log.target_user ? (
          <>
            {log.target_user.first_name && log.target_user.last_name
              ? `${log.target_user.first_name} ${log.target_user.last_name}`
              : log.target_user.email}
          </>
        ) : "—"}
      </td>
      <td className="px-5 py-3 text-sm text-muted-foreground max-w-xs truncate">{log.details || "—"}</td>
      <td className="px-5 py-3 text-sm text-muted-foreground text-xs">{log.ip_address}</td>
    </tr>
  );

  return (
    <div className="p-space-6">
      {/* Header */}
      <div className="mb-space-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-space-7">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">Admin Panel</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">Administrative controls and user management</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => { fetchStats(); fetchAuditLogs(); }}
            className="btn-neo-secondary dark:btn-mono-secondary gap-2"
            style={{ height: 44, paddingLeft: LAYOUT.buttonPaddingH, paddingRight: LAYOUT.buttonPaddingH }}
          >
            <RefreshCw className="h-4 w-4" style={{ transform: "translateY(1px)" }} />
            Refresh
          </Button>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mb-space-7 border-b border-border pb-3">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "users", label: "User Management", icon: Users },
            { id: "approvals", label: "Pending Approvals", icon: Shield },
            { id: "audit", label: "Audit Logs", icon: FileText },
          ].map(section => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "ghost"}
              onClick={() => { setActiveSection(section.id); if (section.id === "audit") fetchAuditLogs(); }}
              className="gap-2 px-4 py-2.5 rounded-xl"
              style={{ height: 44 }}
            >
              <section.icon className="h-4 w-4" />
              {section.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Section */}
      {activeSection === "overview" && stats && (
        <>
          {/* KPI Grid - 9 cards in responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-space-5 mb-space-7 items-stretch">
            {statCards.map((stat, i) => (
              <Card key={i} className="card-neo dark:card-mono" style={{ padding: LAYOUT.kpiCardPadding, animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start justify-between h-full">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums leading-tight">{stat.value}</p>
                    {stat.trend && (
                      <p className={`text-xs mt-1 ${stat.trend.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                        {stat.trend} vs last period
                      </p>
                    )}
                  </div>
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${stat.color}15`, color: stat.color }}
                  >
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts Row - User Roles & Events by Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-5 mb-space-7">
            <Card className="card-neo dark:card-mono" style={{ padding: LAYOUT.cardPadding }}>
              <h3 className="text-lg font-semibold text-foreground mb-5">User Roles Distribution</h3>
              <div className="space-y-4">
                {Object.entries(stats.userRoles).map(([role, count]) => (
                  <div key={role} className="flex items-center gap-3">
                    <span className="capitalize text-sm text-foreground w-28 flex-shrink-0">{role}</span>
                    <div className="h-2 bg-muted rounded-full flex-1 max-w-[200px]">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          background: 'hsl(var(--accent))',
                          width: `${(count / (stats.overview.totalUsers || 1)) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground tabular-nums w-10 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="card-neo dark:card-mono" style={{ padding: LAYOUT.cardPadding }}>
              <h3 className="text-lg font-semibold text-foreground mb-5">Events by Status</h3>
              <div className="space-y-4">
                {Object.entries(stats.eventsByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center gap-3">
                    <span className="capitalize text-sm text-foreground w-28 flex-shrink-0">{status}</span>
                    <div className="h-2 bg-muted rounded-full flex-1 max-w-[200px]">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          background: 'hsl(var(--accent))',
                          width: `${(count / (stats.overview.totalEvents || 1)) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground tabular-nums w-10 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Users & Recent Events */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-5">
            <Card className="card-neo dark:card-mono" style={{ padding: LAYOUT.cardPadding }}>
              <h3 className="text-lg font-semibold text-foreground mb-5">Recent Users</h3>
              {stats.recentUsers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No recent users</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentUsers.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-[hsl(var(--muted)/0.3)]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'hsl(var(--accent)/0.15)' }}>
                          <span className="text-sm font-semibold text-[hsl(var(--accent))]">
                            {user.first_name?.[0] || user.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            {user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : user.email}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{user.email}</p>
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

            <Card className="card-neo dark:card-mono" style={{ padding: LAYOUT.cardPadding }}>
              <h3 className="text-lg font-semibold text-foreground mb-5">Recent Events</h3>
              {stats.recentEvents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No recent events</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentEvents.map((event: any) => (
                    <div key={event.id} className="flex items-center justify-between p-3 rounded-xl bg-[hsl(var(--muted)/0.3)]">
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{event.atoll} - {event.island}</p>
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
            <div className="card-neo dark:card-mono mb-space-6 p-space-5 animate-slide-up">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="font-medium text-foreground">{selectedUsers.length} user(s) selected</span>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => handleBulkAction("approve")} disabled={bulkActionLoading} className="btn-neo-secondary dark:btn-mono-secondary gap-1" style={{ height: 38, paddingLeft: 12, paddingRight: 12 }}>
                    <CheckCircle className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction("reject")} disabled={bulkActionLoading} className="gap-1" style={{ height: 38, paddingLeft: 12, paddingRight: 12 }}>
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleBulkAction("activate")} disabled={bulkActionLoading} className="btn-neo-secondary dark:btn-mono-secondary gap-1" style={{ height: 38, paddingLeft: 12, paddingRight: 12 }}>
                    <UserPlus className="h-3.5 w-3.5" /> Activate
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleBulkAction("deactivate")} disabled={bulkActionLoading} className="btn-neo-secondary dark:btn-mono-secondary gap-1" style={{ height: 38, paddingLeft: 12, paddingRight: 12 }}>
                    <UserPlus className="h-3.5 w-3.5" /> Deactivate
                  </Button>
                  <Select onValueChange={(role) => handleBulkAction("role", role)} disabled={bulkActionLoading}>
                    <SelectTrigger className="w-[130px]">
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
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Users Table */}
          <Card className="card-neo dark:card-mono overflow-hidden" style={{ padding: 0 }}>
            <div className="p-space-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">All Users</h3>
            </div>
            <div className="divide-y divide-border">
              {users.map((user) => renderUserRow(user, user.id === currentUser.id))}
            </div>
          </Card>
        </>
      )}

      {/* Pending Approvals Section */}
      {activeSection === "approvals" && (
        <Card className="card-neo dark:card-mono overflow-hidden" style={{ padding: 0 }}>
          <div className="p-space-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-[hsl(var(--accent))]" />
              Pending Approvals <span className="text-sm font-normal text-muted-foreground">({pendingUsers.length})</span>
            </h3>
          </div>
          <div className="divide-y divide-border">
            {pendingUsers.length === 0 ? (
              <div className="p-space-8 text-center">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No pending approvals</p>
              </div>
            ) : (
              pendingUsers.map((user) => renderPendingRow(user))
            )}
          </div>
        </Card>
      )}

      {/* Audit Logs Section */}
      {activeSection === "audit" && (
        <Card className="card-neo dark:card-mono overflow-hidden" style={{ padding: 0 }}>
          <div className="p-space-6 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-[hsl(var(--accent))]" />
                Audit Logs
              </h3>
              <Button
                variant="ghost"
                onClick={() => fetchAuditLogs(auditPage)}
                disabled={auditLoading}
                className="btn-neo-secondary dark:btn-mono-secondary gap-2"
                style={{ height: 40, paddingLeft: 12, paddingRight: 12 }}
              >
                <RefreshCw className="h-4 w-4" style={{ transform: "translateY(1px)" }} />
                Refresh
              </Button>
            </div>
          </div>
          <div className="p-space-6">
            {auditLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[hsl(var(--accent))] border-t-transparent mx-auto mb-2" />
                <p className="text-muted-foreground">Loading audit logs...</p>
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No audit logs found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ borderCollapse: "collapse" }}>
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target User</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Details</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log) => renderAuditRow(log))}
                    </tbody>
                  </table>
                </div>

                {auditTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-5 pt-5 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fetchAuditLogs(auditPage - 1)}
                      disabled={auditPage === 1 || auditLoading}
                      className="btn-neo-secondary dark:btn-mono-secondary"
                      style={{ height: 38, paddingLeft: 12, paddingRight: 12 }}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground px-3">
                      Page {auditPage} of {auditTotalPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fetchAuditLogs(auditPage + 1)}
                      disabled={auditPage === auditTotalPages || auditLoading}
                      className="btn-neo-secondary dark:btn-mono-secondary"
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
        <AlertDialogContent className="card-neo dark:card-mono max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingUser?.firstName && deletingUser?.lastName
                ? `${deletingUser.firstName} ${deletingUser.lastName}`
                : deletingUser?.email}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-3">
            <AlertDialogCancel className="btn-neo-secondary dark:btn-mono-secondary" style={{ height: 40, paddingLeft: 16, paddingRight: 16 }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white" style={{ height: 40, paddingLeft: 16, paddingRight: 16 }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}