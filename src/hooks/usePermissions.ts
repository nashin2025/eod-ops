"use client";

import { useAuth } from "./useAuth";
import { hasPermission } from "@/lib/permissions";

export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role || "attachment";

  return {
    role,
    canViewEvents: hasPermission(role, "viewEvents"),
    canCreateEvents: hasPermission(role, "createEvents"),
    canEditEvents: hasPermission(role, "editEvents"),
    canDeleteEvents: hasPermission(role, "deleteEvents"),
    canViewMembers: hasPermission(role, "viewMembers"),
    canManageMembers: hasPermission(role, "manageMembers"),
    canViewMap: hasPermission(role, "viewMap"),
    canCheckIn: hasPermission(role, "checkIn"),
    canCheckInWithEquipment: hasPermission(role, "checkInWithEquipment"),
    canViewEquipment: hasPermission(role, "viewEquipment"),
    canCreateEquipment: hasPermission(role, "createEquipment"),
    canEditEquipment: hasPermission(role, "editEquipment"),
    canDeleteEquipment: hasPermission(role, "deleteEquipment"),
    canTransferEquipment: hasPermission(role, "transferEquipment"),
    canViewArchive: hasPermission(role, "viewArchive"),
    canAccessAdminPanel: hasPermission(role, "accessAdminPanel"),
  };
}
