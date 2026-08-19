export type UserRole = "admin" | "coordinator" | "agent" | "attachment";

export type User = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  role: UserRole;
  approvalStatus: "pending" | "approved" | "rejected";
  isActive: boolean;
  serviceNumber: string | null;
  mobile: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertUser = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  role?: UserRole;
  approvalStatus?: "pending" | "approved" | "rejected";
  isActive?: boolean;
  serviceNumber?: string | null;
  mobile?: string | null;
};

export type Event = {
  id: string;
  title: string;
  atoll: string;
  island: string;
  eventLocation: string | null;
  waitingLocation: string | null;
  latitude: number | null;
  longitude: number | null;
  waitingLatitude: number | null;
  waitingLongitude: number | null;
  eventDate: Date | null;
  contact: string | null;
  comment: string | null;
  status: "scheduled" | "active" | "completed" | "cancelled" | "archived";
  createdBy: string;
  participantCount: number;
  photoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertEvent = {
  title: string;
  atoll: string;
  island: string;
  eventLocation?: string | null;
  waitingLocation?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  waitingLatitude?: number | null;
  waitingLongitude?: number | null;
  eventDate?: string | null;
  contact?: string | null;
  comment?: string | null;
  status?: "scheduled" | "active" | "completed" | "cancelled" | "archived";
  createdBy?: string;
  participantCount?: number;
  photoUrl?: string | null;
};

export type Island = {
  id: string;
  name: string;
  atoll: string;
  latitude: number;
  longitude: number;
  isVisited: boolean;
  lastVisited: Date | null;
  createdAt: Date;
};

export type InsertIsland = {
  name: string;
  atoll: string;
  latitude: number;
  longitude: number;
  isVisited?: boolean;
  lastVisited?: Date | null;
};

export type Equipment = {
  id: string;
  name: string;
  type: string;
  quantity: number;
  status: "available" | "in-use" | "maintenance" | "damaged" | "transferred";
  atoll: string;
  island: string | null;
  description: string | null;
  condition: "excellent" | "good" | "fair" | "poor" | null;
  parentEquipmentId: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertEquipment = {
  name: string;
  type: string;
  quantity: number;
  status?: "available" | "in-use" | "maintenance" | "damaged" | "transferred";
  atoll: string;
  island?: string | null;
  description?: string | null;
  condition?: "excellent" | "good" | "fair" | "poor" | null;
  parentEquipmentId?: string | null;
  createdBy?: string;
};

export type EquipmentTransfer = {
  id: string;
  sourceEquipmentId: string;
  destinationEquipmentId: string;
  quantityMoved: number;
  fromAtoll: string;
  fromIsland: string | null;
  toAtoll: string;
  toIsland: string | null;
  transferredBy: string;
  transferredAt: Date;
  notes: string | null;
};

export type InsertEquipmentTransfer = {
  sourceEquipmentId: string;
  destinationEquipmentId: string;
  quantityMoved: number;
  fromAtoll: string;
  fromIsland?: string | null;
  toAtoll: string;
  toIsland?: string | null;
  transferredBy: string;
  notes?: string | null;
};

export type ChatMessage = {
  id: string;
  userId: string;
  userName: string;
  message: string | null;
  audioUrl: string | null;
  isAudio: boolean;
  createdAt: Date;
};

export type InsertChatMessage = {
  userId: string;
  userName: string;
  message?: string | null;
  audioUrl?: string | null;
  isAudio?: boolean;
};

export type IslandVisit = {
  id: string;
  islandId: string;
  userId: string;
  visitType: "manual" | "automatic";
  visitedAt: Date;
  notes: string | null;
};

export type InsertIslandVisit = {
  islandId: string;
  userId: string;
  visitType?: "manual" | "automatic";
  notes?: string | null;
};

export type UserMilestone = {
  id: string;
  userId: string;
  milestoneType: "island_visits" | "atolls_visited";
  milestoneName: string;
  milestoneLevel: number;
  description: string;
  badgeIcon: string;
  badgeColor: string;
  progress: number;
  targetValue: number;
  achievedAt: Date | null;
};

export type InsertUserMilestone = {
  userId: string;
  milestoneType: "island_visits" | "atolls_visited";
  milestoneName: string;
  milestoneLevel: number;
  description: string;
  badgeIcon: string;
  badgeColor: string;
  progress: number;
  targetValue: number;
  achievedAt?: Date | null;
};

export type EventParticipant = {
  id: string;
  eventId: string;
  userId: string;
  joinedAt: Date;
};
