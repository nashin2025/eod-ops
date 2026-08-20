"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { User, Mail, Phone, Badge, Calendar, Save, X } from "lucide-react";

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

// Layout constants matching the 8-point spacing scale
const LAYOUT = {
  pagePadding: 24,           // --space-6
  cardPadding: 24,           // --space-6
  sectionGap: 32,            // --space-7
  controlHeight: 44,         // tap-friendly
  avatarSize: 80,            // 80px avatar
  iconSize: 20,              // 20px icons
  iconGap: 8,                // icon-text gap
  buttonPaddingH: 16,        // 16px horizontal
  buttonPaddingV: 10,        // 10px vertical
} as const;

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

  const getStatusStyles = (status: string, isActive: boolean) => {
    if (status === "approved" && isActive) {
      return "bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))] dark:bg-[hsl(var(--accent)/0.2)] dark:text-[hsl(var(--accent))]";
    }
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  };

  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email;

  return (
    <div className="p-space-6">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header Card */}
        <div className="card-neo dark:card-mono mb-space-7" style={{ padding: LAYOUT.cardPadding }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center flex-shrink-0" 
                 style={{ background: 'hsl(var(--accent)/0.15)' }}>
              {user.profileImageUrl ? (
                <Image
                  src={user.profileImageUrl}
                  alt={displayName}
                  fill
                  className="object-cover rounded-full"
                />
              ) : (
                <span className="text-3xl font-semibold text-[hsl(var(--accent))]">
                  {user.firstName?.[0] || user.email[0].toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">{displayName}</h2>
              <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${getStatusStyles(user.approvalStatus, user.isActive)}`}>
                <Badge className="h-3 w-3" />
                {user.role}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-5" />

          {/* Profile Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4 text-[hsl(var(--accent))]" />
                  First Name
                </label>
                {isEditing ? (
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-2 w-full"
                    style={{ height: LAYOUT.controlHeight }}
                  />
                ) : (
                  <p className="mt-2 text-foreground">{user.firstName || "Not set"}</p>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4 text-[hsl(var(--accent))]" />
                  Last Name
                </label>
                {isEditing ? (
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-2 w-full"
                    style={{ height: LAYOUT.controlHeight }}
                  />
                ) : (
                  <p className="mt-2 text-foreground">{user.lastName || "Not set"}</p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="h-4 w-4 text-[hsl(var(--accent))]" />
                Email
              </label>
              {isEditing ? (
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  type="email"
                  className="mt-2 w-full max-w-md"
                  style={{ height: LAYOUT.controlHeight }}
                />
              ) : (
                <p className="mt-2 text-foreground">{user.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Phone className="h-4 w-4 text-[hsl(var(--accent))]" />
                  Mobile
                </label>
                {isEditing ? (
                  <Input
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="mt-2 w-full"
                    style={{ height: LAYOUT.controlHeight }}
                  />
                ) : (
                  <p className="mt-2 text-foreground">{user.mobile || "Not set"}</p>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Badge className="h-4 w-4 text-[hsl(var(--accent))]" />
                  Service Number
                </label>
                {isEditing ? (
                  <Input
                    value={formData.serviceNumber}
                    onChange={(e) => setFormData({ ...formData, serviceNumber: e.target.value })}
                    className="mt-2 w-full"
                    style={{ height: LAYOUT.controlHeight }}
                  />
                ) : (
                  <p className="mt-2 text-foreground">{user.serviceNumber || "Not set"}</p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4 text-[hsl(var(--accent))]" />
                Account Status
              </label>
              <div className="mt-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(user.approvalStatus, user.isActive)}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {user.approvalStatus} {user.isActive ? "(Active)" : "(Inactive)"}
                </span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4 text-[hsl(var(--accent))]" />
                Member Since
              </label>
              <p className="mt-2 text-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-border">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  className="btn-neo-secondary dark:btn-mono-secondary"
                  style={{ height: 44, paddingLeft: LAYOUT.buttonPaddingH, paddingRight: LAYOUT.buttonPaddingH }}
                >
                  <X className="h-4 w-4 mr-2" style={{ transform: "translateY(1px)" }} />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="btn-neo-accent dark:btn-mono-primary"
                  style={{ height: 44, paddingLeft: LAYOUT.buttonPaddingH, paddingRight: LAYOUT.buttonPaddingH }}
                >
                  <Save className="h-4 w-4 mr-2" style={{ transform: "translateY(1px)" }} />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="btn-neo-accent dark:btn-mono-primary"
                style={{ height: 44, paddingLeft: LAYOUT.buttonPaddingH, paddingRight: LAYOUT.buttonPaddingH }}
              >
                <User className="h-4 w-4 mr-2" style={{ transform: "translateY(1px)" }} />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Account Info Card */}
        <div className="card-neo dark:card-mono" style={{ padding: LAYOUT.cardPadding }}>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Badge className="h-5 w-5 text-[hsl(var(--accent))]" />
            Account Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">User ID</p>
              <p className="text-foreground font-mono text-xs truncate">{user.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Role</p>
              <p className="text-foreground capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Approval Status</p>
              <p className="text-foreground capitalize">{user.approvalStatus}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Active</p>
              <p className="text-foreground">{user.isActive ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="text-foreground">{new Date(user.updatedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="text-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}