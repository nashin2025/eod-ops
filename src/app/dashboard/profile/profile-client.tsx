"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  User, Users, Mailbox, Phone, IdentificationBadge, Calendar, FloppyDisk, X,
  Lock, Shield, Info, IdentificationCard
} from "@phosphor-icons/react";

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
  mobile?: string;
  createdAt: string;
  updatedAt: string;
}

const getStatusConfig = (status: string, isActive: boolean) => {
  if (status === "approved" && isActive) {
    return { label: `${status} (Active)`, variant: "success" as const };
  }
  if (status === "approved" && !isActive) {
    return { label: `${status} (Inactive)`, variant: "warning" as const };
  }
  return { label: status, variant: "default" as const };
};

const getRoleConfig = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return { icon: Shield, variant: "accent" as const };
    case "coordinator":
      return { icon: Users, variant: "default" as const };
    default:
      return { icon: User, variant: "default" as const };
  }
};

export default function ProfileClient({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    mobile: user.mobile || "",
    serviceNumber: user.serviceNumber || "",
  });
  const router = useRouter();

  const handleSave = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving profile:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      alert("Failed to save: " + message);
    }
  };

  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email;

  const initials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user.email[0].toUpperCase();

  return (
    <div className="animate-fade-in" style={{ padding: "var(--layout-page-padding) var(--layout-page-padding) 0" }}>
      <div className="max-w-2xl mx-auto">
        {/* Profile Header Card */}
        <Card className="mb-[var(--layout-section-gap)]" style={{ padding: "var(--layout-card-padding)" }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
            <Avatar
              size="xl"
              src={user.profileImageUrl}
              alt={displayName}
              fallback={initials}
            />
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{displayName}</h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>{user.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                {(() => {
                  const roleConfig = getRoleConfig(user.role);
                  const RoleIcon = roleConfig.icon;
                  return (
                    <Badge variant={roleConfig.variant} dot>
                      <RoleIcon className="h-3 w-3" />
                      {user.role}
                    </Badge>
                  );
                })()}
                <Badge variant={getStatusConfig(user.approvalStatus, user.isActive).variant} dot>
                  {getStatusConfig(user.approvalStatus, user.isActive).label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-5" style={{ borderTop: "1px solid var(--border)" }} />

          {/* Profile Fields */}
          <div className="space-y-4" style={{ gap: "var(--space-4)" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <User className="h-4 w-4" style={{ color: "var(--accent)" }} />
                  First Name
                </label>
                {isEditing ? (
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-2 w-full"
                    style={{ height: "var(--layout-control-height)" }}
                  />
                ) : (
                  <p className="mt-2" style={{ color: "var(--text-primary)" }}>{user.firstName || "Not set"}</p>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <User className="h-4 w-4" style={{ color: "var(--accent)" }} />
                  Last Name
                </label>
                {isEditing ? (
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-2 w-full"
                    style={{ height: "var(--layout-control-height)" }}
                  />
                ) : (
                  <p className="mt-2" style={{ color: "var(--text-primary)" }}>{user.lastName || "Not set"}</p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                <Mailbox className="h-4 w-4" style={{ color: "var(--accent)" }} />
                Email
              </label>
              {isEditing ? (
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  type="email"
                  className="mt-2 w-full max-w-md"
                  style={{ height: "var(--layout-control-height)" }}
                />
              ) : (
                <p className="mt-2" style={{ color: "var(--text-primary)" }}>{user.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <Phone className="h-4 w-4" style={{ color: "var(--accent)" }} />
                  Mobile
                </label>
                {isEditing ? (
                  <Input
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="mt-2 w-full"
                    style={{ height: "var(--layout-control-height)" }}
                  />
                ) : (
                  <p className="mt-2" style={{ color: "var(--text-primary)" }}>{user.mobile || "Not set"}</p>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <IdentificationBadge className="h-4 w-4" style={{ color: "var(--accent)" }} />
                  Service Number
                </label>
                {isEditing ? (
                  <Input
                    value={formData.serviceNumber}
                    onChange={(e) => setFormData({ ...formData, serviceNumber: e.target.value })}
                    className="mt-2 w-full"
                    style={{ height: "var(--layout-control-height)" }}
                  />
                ) : (
                  <p className="mt-2" style={{ color: "var(--text-primary)" }}>{user.serviceNumber || "Not set"}</p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                <Shield className="h-4 w-4" style={{ color: "var(--accent)" }} />
                Account Status
              </label>
              <div className="mt-2">
                <Badge variant={getStatusConfig(user.approvalStatus, user.isActive).variant} dot>
                  {getStatusConfig(user.approvalStatus, user.isActive).label}
                </Badge>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                <Calendar className="h-4 w-4" style={{ color: "var(--accent)" }} />
                Member Since
              </label>
              <p className="mt-2" style={{ color: "var(--text-primary)" }}>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl"
                  style={{ height: "var(--layout-control-height)" }}
                >
                  <X className="h-4 w-4 mr-2" style={{ transform: "translateY(0.5px)" }} />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  size="lg"
                  style={{ height: "var(--layout-control-height)" }}
                >
                  <FloppyDisk className="h-4 w-4 mr-2" style={{ transform: "translateY(0.5px)" }} />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                size="lg"
                style={{ height: "var(--layout-control-height)" }}
              >
                <User className="h-4 w-4 mr-2" style={{ transform: "translateY(0.5px)" }} />
                Edit Profile
              </Button>
            )}
          </div>
        </Card>

        {/* Account Info Card */}
        <Card style={{ padding: "var(--layout-card-padding)" }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <IdentificationCard className="h-5 w-5" style={{ color: "var(--accent)" }} />
            Account Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="label" style={{ color: "var(--text-tertiary)" }}>User ID</p>
              <p className="font-mono text-xs truncate" style={{ color: "var(--text-primary)" }}>{user.id}</p>
            </div>
            <div>
              <p className="label" style={{ color: "var(--text-tertiary)" }}>Role</p>
              <p className="capitalize" style={{ color: "var(--text-primary)" }}>{user.role}</p>
            </div>
            <div>
              <p className="label" style={{ color: "var(--text-tertiary)" }}>Approval Status</p>
              <p className="capitalize" style={{ color: "var(--text-primary)" }}>{user.approvalStatus}</p>
            </div>
            <div>
              <p className="label" style={{ color: "var(--text-tertiary)" }}>Active</p>
              <p style={{ color: "var(--text-primary)" }}>{user.isActive ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="label" style={{ color: "var(--text-tertiary)" }}>Last Updated</p>
              <p style={{ color: "var(--text-primary)" }}>{new Date(user.updatedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="label" style={{ color: "var(--text-tertiary)" }}>Created</p>
              <p style={{ color: "var(--text-primary)" }}>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}