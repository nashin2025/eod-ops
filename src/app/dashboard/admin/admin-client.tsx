"use client";

import { useState } from "react";
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
import { CheckCircle, XCircle, UserPlus, Trash2, Download, RefreshCw, Users, Shield, FileText, Activity, BarChart3 } from "lucide-react";
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
  if (statsLoading && !stats) {
    fetchStats();
  }

  // Load audit logs when section is active
  if (activeSection === "audit" && auditLogs.length === 0) {
    fetchAuditLogs();
  }

  const statCards = [
    { label: "Total Users", value: stats?.overview.totalUsers || 0, icon: Users, color: "text-primary", trend: stats?.overview.userGrowth !== undefined ? `${stats.overview.userGrowth > 0 ? "+" : ""}${stats.overview.userGrowth}%` : null },
    { label: "Active Users", value: stats?.overview.activeUsers || 0, icon: CheckCircle, color: "text-green-600" },
    { label: "Pending Approval", value: stats?.overview.pendingUsers || 0, icon: Shield, color: "text-yellow-600" },
    { label: "Total Events", value: stats?.overview.totalEvents || 0, icon: Activity, color: "text-blue-600" },
    { label: "Active Events", value: stats?.overview.activeEvents || 0, icon: Activity, color: "text-green-600" },
    { label: "Completed Events", value: stats?.overview.completedEvents || 0, icon: CheckCircle, color: "text-gray-600" },
    { label: "Total Equipment", value: stats?.overview.totalEquipment || 0, icon: BarChart3, color: "text-purple-600" },
    { label: "Available", value: stats?.overview.availableEquipment || 0, icon: CheckCircle, color: "text-green-600" },
    { label: "Damaged", value: stats?.overview.damagedEquipment || 0, icon: XCircle, color: "text-red-600" },
  ];

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">Administrative controls and user management</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="outline" onClick={() => { fetchStats(); fetchAuditLogs(); }}>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b pb-2">
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
              className="gap-2"
            >
              <section.icon className="h-4 w-4" />
              {section.label}
            </Button>
          ))}
        </div>

        {/* Overview Section */}
        {activeSection === "overview" && stats && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {statCards.map((stat, i) => (
                <Card key={i}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                        {stat.trend && (
                          <p className={`text-xs mt-1 ${stat.trend.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                            {stat.trend} vs last period
                          </p>
                        )}
                      </div>
                      <stat.icon className={`h-8 w-8 sm:h-10 sm:w-10 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Roles Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.userRoles).map(([role, count]) => (
                      <div key={role} className="flex items-center justify-between">
                        <span className="capitalize">{role}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 bg-primary/20 rounded-full flex-1 max-w-40">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${(count / (stats.overview.totalUsers || 1)) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-10 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Events by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.eventsByStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <span className="capitalize">{status}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 bg-primary/20 rounded-full flex-1 max-w-40">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${(count / (stats.overview.totalEvents || 1)) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-10 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.recentUsers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No recent users</p>
                  ) : (
                    <div className="space-y-3">
                      {stats.recentUsers.map((user: any) => (
                        <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-semibold">
                                {user.first_name?.[0] || user.email[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {user.first_name && user.last_name
                                  ? `${user.first_name} ${user.last_name}`
                                  : user.email}
                              </p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">{user.role}</Badge>
                            <Badge 
                              variant={user.approval_status === "approved" ? "default" : user.approval_status === "rejected" ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {user.approval_status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.recentEvents.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No recent events</p>
                  ) : (
                    <div className="space-y-3">
                      {stats.recentEvents.map((event: any) => (
                        <div key={event.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium text-sm">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{event.atoll} - {event.island}</p>
                          </div>
                          <Badge 
                            variant={
                              event.status === "active" ? "default" :
                              event.status === "scheduled" ? "secondary" :
                              event.status === "completed" ? "outline" : "destructive"
                            }
                            className="text-xs"
                          >
                            {event.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* User Management Section */}
        {activeSection === "users" && (
          <>
            {selectedUsers.length > 0 && (
              <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="font-medium">{selectedUsers.length} user(s) selected</span>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => handleBulkAction("approve")} disabled={bulkActionLoading}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction("reject")} disabled={bulkActionLoading}>Reject</Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("activate")} disabled={bulkActionLoading}>Activate</Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("deactivate")} disabled={bulkActionLoading}>Deactivate</Button>
                  <Select onValueChange={(role) => handleBulkAction("role", role)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Change Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="coordinator">Coordinator</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="attachment">Attachment</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")} disabled={bulkActionLoading}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                          disabled={user.id === currentUser.id}
                          className="h-4 w-4"
                        />
                        <div className="relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                          {user.profileImageUrl ? (
                            <Image
                              src={user.profileImageUrl}
                              alt={`${user.firstName || ""} ${user.lastName || ""}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold">
                              {user.firstName?.[0] || user.email[0].toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user.email}
                          </p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleRoleChange(user.id, value)}
                          disabled={user.id === currentUser.id}
                        >
                          <SelectTrigger className="w-[140px]">
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
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <Badge variant={user.isActive ? "default" : "secondary"} className="text-xs">
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingUser(user)}
                          disabled={user.id === currentUser.id}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Pending Approvals Section */}
        {activeSection === "approvals" && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals ({pendingUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingUsers.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No pending approvals</p>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <p className="font-medium">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.email}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Select
                          value={user.approvalStatus}
                          onValueChange={(value) => handleApprovalChange(user.id, value)}
                        >
                          <SelectTrigger className="w-[160px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(user.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(user.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Audit Logs Section */}
        {activeSection === "audit" && (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Audit Logs</CardTitle>
                <Button variant="outline" onClick={() => fetchAuditLogs(auditPage)}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {auditLoading ? (
                <p className="text-center text-muted-foreground py-4">Loading audit logs...</p>
              ) : auditLogs.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No audit logs found</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left text-sm text-muted-foreground">
                          <th className="pb-2 pr-4">Date</th>
                          <th className="pb-2 pr-4">Admin</th>
                          <th className="pb-2 pr-4">Action</th>
                          <th className="pb-2 pr-4">Target User</th>
                          <th className="pb-2 pr-4">Details</th>
                          <th className="pb-2 pr-4">IP Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogs.map((log) => (
                          <tr key={log.id} className="border-b text-sm">
                            <td className="py-2 pr-4">{format(new Date(log.created_at), "MMM d, yyyy HH:mm")}</td>
                            <td className="py-2 pr-4">
                              {log.admin ? (
                                <>
                                  {log.admin.first_name && log.admin.last_name
                                    ? `${log.admin.first_name} ${log.admin.last_name}`
                                    : log.admin.email}
                                </>
                              ) : "Unknown"}
                            </td>
                            <td className="py-2 pr-4">
                              <Badge variant="secondary" className="text-xs capitalize">{log.action.replace("_", " ")}</Badge>
                            </td>
                            <td className="py-2 pr-4">
                              {log.target_user ? (
                                <>
                                  {log.target_user.first_name && log.target_user.last_name
                                    ? `${log.target_user.first_name} ${log.target_user.last_name}`
                                    : log.target_user.email}
                                </>
                              ) : "—"}
                            </td>
                            <td className="py-2 pr-4 text-muted-foreground max-w-xs truncate">{log.details || "—"}</td>
                            <td className="py-2 pr-4 text-muted-foreground text-xs">{log.ip_address}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {auditTotalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fetchAuditLogs(auditPage - 1)} 
                        disabled={auditPage === 1 || auditLoading}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {auditPage} of {auditTotalPages}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fetchAuditLogs(auditPage + 1)} 
                        disabled={auditPage === auditTotalPages || auditLoading}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {deletingUser?.firstName && deletingUser?.lastName
                  ? `${deletingUser.firstName} ${deletingUser.lastName}`
                  : deletingUser?.email}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}