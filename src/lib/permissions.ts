import { UserRole, User } from "./index";

export type Permission = 
  | "viewEvents"
  | "createEvents"
  | "editEvents"
  | "deleteEvents"
  | "viewMembers"
  | "manageMembers"
  | "viewMap"
  | "checkIn"
  | "checkInWithEquipment"
  | "viewEquipment"
  | "createEquipment"
  | "editEquipment"
  | "deleteEquipment"
  | "transferEquipment"
  | "viewArchive"
  | "accessAdminPanel"
  | "manageUsers"
  | "viewAnalytics"
  | "manageMilestones";

export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    "viewEvents", "createEvents", "editEvents", "deleteEvents",
    "viewMembers", "manageMembers",
    "viewMap", "checkIn", "checkInWithEquipment",
    "viewEquipment", "createEquipment", "editEquipment", "deleteEquipment", "transferEquipment",
    "viewArchive",
    "accessAdminPanel", "manageUsers", "viewAnalytics", "manageMilestones",
  ],
  coordinator: [
    "viewEvents", "createEvents", "editEvents", "deleteEvents",
    "viewMembers", "manageMembers",
    "viewMap", "checkIn", "checkInWithEquipment",
    "viewEquipment", "createEquipment", "editEquipment", "deleteEquipment", "transferEquipment",
    "viewArchive",
  ],
  agent: [
    "viewEvents", "createEvents", "editEvents",
    "viewMap", "checkIn", "checkInWithEquipment",
    "viewEquipment", "createEquipment", "editEquipment", "transferEquipment",
    "viewArchive",
  ],
  attachment: [
    "viewEvents",
    "viewMap", "checkIn",
    "viewEquipment",
    "viewArchive",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function getPermissions(role: UserRole): Permission[] {
  return rolePermissions[role] ?? [];
}

export function isApproved(user: User | null | undefined): boolean {
  return !!user && user.approvalStatus === "approved" && user.isActive !== false;
}

export function canPerformAction(user: User | null | undefined, permission: Permission): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  return hasPermission(user.role, permission);
}
