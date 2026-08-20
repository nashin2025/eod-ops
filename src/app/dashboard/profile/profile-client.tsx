"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

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
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });
    setIsEditing(false);
    router.refresh();
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">My Profile</h1>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {user.profileImageUrl ? (
                  <Image
                    src={user.profileImageUrl}
                    alt={`${user.firstName || ""} ${user.lastName || ""}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold">
                    {user.firstName?.[0] || user.email[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email}
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-1 text-xs rounded bg-primary/10 text-primary">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                {isEditing ? (
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                ) : (
                  <p className="mt-1">{user.firstName || "Not set"}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                {isEditing ? (
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                ) : (
                  <p className="mt-1">{user.lastName || "Not set"}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                {isEditing ? (
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                ) : (
                  <p className="mt-1">{user.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                {isEditing ? (
                  <Input
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                ) : (
                  <p className="mt-1">{user.mobile || "Not set"}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Service Number</label>
                {isEditing ? (
                  <Input
                    value={formData.serviceNumber}
                    onChange={(e) => setFormData({ ...formData, serviceNumber: e.target.value })}
                  />
                ) : (
                  <p className="mt-1">{user.serviceNumber || "Not set"}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                <p className="mt-1">
                  <span className={`px-2 py-1 text-xs rounded ${
                    user.approvalStatus === "approved" && user.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {user.approvalStatus}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                <p className="mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
