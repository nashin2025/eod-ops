"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Phone, Mail, UserPlus, Users } from "lucide-react";
import Image from "next/image";

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

// Layout constants matching the 8-point spacing scale
const LAYOUT = {
  pagePadding: 24,           // --space-6
  cardPadding: 24,           // --space-6
  kpiCardPadding: 20,        // --space-5
  sectionGap: 32,            // --space-7
  cardRowGap: 20,            // --space-5
  controlHeight: 44,         // tap-friendly
  avatarSize: 48,            // 48px avatar
  iconSize: 20,              // 20px icons
  iconGap: 8,                // icon-text gap
  buttonPaddingH: 16,        // 16px horizontal
  buttonPaddingV: 10,        // 10px vertical
} as const;

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
    { label: "Total Members", value: users.length, icon: <Users className="h-5 w-5" />, color: "hsl(var(--accent))" },
    { label: "Admins", value: users.filter(u => u.role === "admin").length, icon: <Users className="h-5 w-5" />, color: "#8B5CF6" },
    { label: "Coordinators", value: users.filter(u => u.role === "coordinator").length, icon: <Users className="h-5 w-5" />, color: "#3B82F6" },
    { label: "Agents", value: users.filter(u => u.role === "agent").length, icon: <Users className="h-5 w-5" />, color: "#10B981" },
  ];

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      coordinator: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      agent: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      attachment: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors[role] || "bg-gray-100 text-gray-800"}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-space-6">
      {/* Header */}
      <div className="mb-space-7">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">Members</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">Team directory and member management</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-5 mb-space-7 items-stretch">
        {kpiItems.map((kpi, index) => (
          <Card key={kpi.label} className="card-neo dark:card-mono" style={{ padding: LAYOUT.kpiCardPadding, animationDelay: `${index * 80}ms` }}>
            <div className="flex items-start justify-between h-full">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                  <span 
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${kpi.color}15`, color: kpi.color }}
                  >
                    {kpi.icon}
                  </span>
                  <span className="font-medium uppercase tracking-wider">{kpi.label}</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums leading-tight">{kpi.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-space-7">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full text-sm"
            style={{ height: LAYOUT.controlHeight }}
          />
        </div>
        <div className="relative flex-1 min-w-[180px] max-w-[220px]">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full">
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
        <div className="card-neo dark:card-mono p-space-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No members found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((member) => (
            <div key={member.id} className="card-neo dark:card-mono" style={{ padding: LAYOUT.cardPadding }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'hsl(var(--accent)/0.15)' }}>
                    {member.profileImageUrl ? (
                      <Image
                        src={member.profileImageUrl}
                        alt={`${member.firstName || ""} ${member.lastName || ""}`}
                        fill
                        className="object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-[hsl(var(--accent))]">
                        {member.firstName?.[0] || member.email[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg text-foreground truncate">
                      {member.firstName && member.lastName
                        ? `${member.firstName} ${member.lastName}`
                        : member.email}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {getRoleBadge(member.role)}
                      {member.serviceNumber && (
                        <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-[hsl(var(--muted)/0.3)]">
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
                        className="rounded-xl btn-neo-secondary dark:btn-mono-secondary"
                        aria-label="Call"
                        style={{ height: 40, width: 40 }}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  <a href={`mailto:${member.email}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl btn-neo-secondary dark:btn-mono-secondary"
                      aria-label="Email"
                      style={{ height: 40, width: 40 }}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}