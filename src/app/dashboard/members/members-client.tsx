"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus, MagnifyingGlass, Phone, Mailbox, Users, FunnelSimple, CaretDown
} from "@phosphor-icons/react";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: string;
  serviceNumber?: string;
  mobile?: string;
  createdAt: string;
}

export default function MembersClient({
  currentUser,
  users,
}: {
  currentUser: { id: string; email?: string };
  users: User[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.serviceNumber && user.serviceNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roles = ["admin", "coordinator", "agent", "attachment"];

  const kpiItems = [
    { label: "Total Members", value: users.length, icon: <Users className="h-5 w-5" />, color: "var(--accent)" },
    { label: "Admins", value: users.filter(u => u.role === "admin").length, icon: <Users className="h-5 w-5" />, color: "var(--accent)" },
    { label: "Coordinators", value: users.filter(u => u.role === "coordinator").length, icon: <Users className="h-5 w-5" />, color: "var(--accent)" },
    { label: "Agents", value: users.filter(u => u.role === "agent").length, icon: <Users className="h-5 w-5" />, color: "var(--accent)" },
  ];

  const getStatusConfig = (role: string) => {
    switch (role) {
      case "admin":
        return { label: "Admin", variant: "accent" as const };
      case "coordinator":
        return { label: "Coordinator", variant: "default" as const };
      case "agent":
        return { label: "Agent", variant: "success" as const };
      case "attachment":
        return { label: "Attachment", variant: "default" as const };
      default:
        return { label: role, variant: "default" as const };
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: "var(--layout-page-padding) var(--layout-page-padding) 0", display: "flex", flexDirection: "column", gap: "var(--layout-section-gap)" }}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Members</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Team directory and member management</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--layout-card-gap)]">
        {kpiItems.map((kpi, index) => (
          <Card key={kpi.label} style={{ padding: "var(--layout-kpi-padding)", animationDelay: `${index * 80}ms` }}>
            <div className="flex items-start justify-between h-full">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 text-sm text-tertiary mb-2" style={{ color: "var(--text-tertiary)" }}>
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `color-mix(in srgb, ${kpi.color} 15%, transparent)`, color: kpi.color }}
                  >
                    {kpi.icon}
                  </span>
                  <span className="font-medium uppercase tracking-wider">{kpi.label}</span>
                </div>
                <p className="text-2xl font-bold tabular" style={{ color: "var(--text-primary)" }}>{kpi.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11"
            style={{ height: "var(--layout-control-height)" }}
          />
        </div>
        <div className="relative flex-1 min-w-[180px] max-w-[220px]">
          <FunnelSimple className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary" />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full pl-11" style={{ height: "var(--layout-control-height)" }}>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map(role => (
                <SelectItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Members List */}
      {filteredUsers.length === 0 ? (
        <Card className="text-center" style={{ padding: "var(--space-8)" }}>
          <Users className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--text-tertiary)" }} />
          <p className="text-lg" style={{ color: "var(--text-tertiary)" }}>No members found</p>
        </Card>
      ) : (
        <div className="space-y-[var(--space-4)]" style={{ gap: "var(--space-4)" }}>
          {filteredUsers.map((member) => {
            const statusConfig = getStatusConfig(member.role);
            const fallback = member.firstName?.[0] || member.lastName?.[0] || member.email[0].toUpperCase();
            return (
              <Card key={member.id} style={{ padding: "var(--layout-card-padding)" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Avatar size="lg" src={member.profileImageUrl} fallback={fallback} />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg truncate" style={{ color: "var(--text-primary)" }}>
                        {member.firstName && member.lastName
                          ? `${member.firstName} ${member.lastName}`
                          : member.email}
                      </h3>
                      <p className="text-sm truncate" style={{ color: "var(--text-tertiary)" }}>{member.email}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant={statusConfig.variant} dot>{statusConfig.label}</Badge>
                        {member.serviceNumber && (
                          <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--hover-bg)", color: "var(--text-tertiary)" }}>
                            {member.serviceNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {member.mobile && (
                      <a href={`tel:${member.mobile}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-xl"
                          aria-label="Call"
                        >
                          <Phone className="h-5 w-5" style={{ width: 20, height: 20 }} />
                        </Button>
                      </a>
                    )}
                    <a href={`mailto:${member.email}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl"
                        aria-label="Email"
                      >
                        <Mailbox className="h-5 w-5" style={{ width: 20, height: 20 }} />
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}