export type UserRole = "admin" | "coordinator" | "agent" | "attachment";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: UserRole;
  approvalStatus: "pending" | "approved" | "rejected";
  isActive: boolean;
  serviceNumber?: string;
  mobile?: string;
  createdAt: string;
  updatedAt: string;
}