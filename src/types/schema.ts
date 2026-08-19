import { pgTable, uuid, varchar, text, timestamp, boolean, integer, numeric, jsonb, index, unique } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  profileImageUrl: text("profile_image_url"),
  role: varchar("role", { length: 50, enum: ["admin", "coordinator", "agent", "attachment"] }).default("agent").notNull(),
  approvalStatus: varchar("approval_status", { length: 50, enum: ["pending", "approved", "rejected"] }).default("pending").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  serviceNumber: varchar("service_number", { length: 255 }),
  mobile: varchar("mobile", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
  roleIdx: index("users_role_idx").on(table.role),
}));

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  atoll: varchar("atoll", { length: 255 }).notNull(),
  island: varchar("island", { length: 255 }).notNull(),
  eventLocation: text("event_location"),
  waitingLocation: text("waiting_location"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  waitingLatitude: numeric("waiting_latitude", { precision: 10, scale: 7 }),
  waitingLongitude: numeric("waiting_longitude", { precision: 10, scale: 7 }),
  eventDate: timestamp("event_date", { withTimezone: true }),
  contact: varchar("contact", { length: 255 }),
  comment: text("comment"),
  status: varchar("status", { length: 50, enum: ["scheduled", "active", "completed", "cancelled", "archived"] }).default("scheduled").notNull(),
  createdBy: varchar("created_by", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  participantCount: integer("participant_count").default(0).notNull(),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  statusIdx: index("events_status_idx").on(table.status),
  atollIdx: index("events_atoll_idx").on(table.atoll),
  createdByIdx: index("events_created_by_idx").on(table.createdBy),
}));

export const islands = pgTable("islands", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  atoll: varchar("atoll", { length: 255 }).notNull(),
  latitude: numeric("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: numeric("longitude", { precision: 10, scale: 7 }).notNull(),
  isVisited: boolean("is_visited").default(false).notNull(),
  lastVisited: timestamp("last_visited", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  atollIdx: index("islands_atoll_idx").on(table.atoll),
  nameIdx: index("islands_name_idx").on(table.name),
}));

export const eventParticipants = pgTable("event_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  eventUserIdx: unique("event_participants_event_user_idx").on(table.eventId, table.userId),
  eventIdx: index("event_participants_event_idx").on(table.eventId),
  userIdx: index("event_participants_user_idx").on(table.userId),
}));

export const equipment = pgTable("equipment", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  status: varchar("status", { length: 50, enum: ["available", "in-use", "maintenance", "damaged", "transferred"] }).default("available").notNull(),
  atoll: varchar("atoll", { length: 255 }).notNull(),
  island: varchar("island", { length: 255 }),
  description: text("description"),
  condition: varchar("condition", { length: 50, enum: ["excellent", "good", "fair", "poor"] }),
  parentEquipmentId: varchar("parent_equipment_id", { length: 255 }),
  createdBy: varchar("created_by", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  atollIdx: index("equipment_atoll_idx").on(table.atoll),
  islandIdx: index("equipment_island_idx").on(table.island),
  typeIdx: index("equipment_type_idx").on(table.type),
}));

export const equipmentTransfers = pgTable("equipment_transfers", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceEquipmentId: uuid("source_equipment_id").notNull().references(() => equipment.id, { onDelete: "cascade" }),
  destinationEquipmentId: uuid("destination_equipment_id").notNull().references(() => equipment.id, { onDelete: "cascade" }),
  quantityMoved: integer("quantity_moved").notNull(),
  fromAtoll: varchar("from_atoll", { length: 255 }).notNull(),
  fromIsland: varchar("from_island", { length: 255 }),
  toAtoll: varchar("to_atoll", { length: 255 }).notNull(),
  toIsland: varchar("to_island", { length: 255 }),
  transferredBy: varchar("transferred_by", { length: 255 }).notNull().references(() => users.id),
  transferredAt: timestamp("transferred_at", { withTimezone: true }).defaultNow().notNull(),
  notes: text("notes"),
}, (table) => ({
  sourceIdx: index("equipment_transfers_source_idx").on(table.sourceEquipmentId),
  destIdx: index("equipment_transfers_dest_idx").on(table.destinationEquipmentId),
}));

export const equipmentAuditLog = pgTable("equipment_audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  equipmentId: uuid("equipment_id").notNull().references(() => equipment.id, { onDelete: "cascade" }),
  action: varchar("action", { length: 50 }).notNull(),
  fieldName: varchar("field_name", { length: 255 }),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  changedBy: varchar("changed_by", { length: 255 }).notNull().references(() => users.id),
  changedAt: timestamp("changed_at", { withTimezone: true }).defaultNow().notNull(),
  notes: text("notes"),
}, (table) => ({
  equipmentIdx: index("equipment_audit_log_equipment_idx").on(table.equipmentId),
}));

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  userName: varchar("user_name", { length: 255 }).notNull(),
  message: text("message"),
  audioUrl: text("audio_url"),
  isAudio: boolean("is_audio").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("chat_messages_user_id_idx").on(table.userId),
  createdAtIdx: index("chat_messages_created_at_idx").on(table.createdAt),
}));

export const userChatReadStatus = pgTable("user_chat_read_status", {
  userId: varchar("user_id", { length: 255 }).primaryKey().references(() => users.id, { onDelete: "cascade" }),
  lastReadMessageId: uuid("last_read_message_id"),
  lastReadCreatedAt: timestamp("last_read_created_at", { withTimezone: true }),
  lastReadAt: timestamp("last_read_at", { withTimezone: true }).defaultNow().notNull(),
});

export const islandVisits = pgTable("island_visits", {
  id: uuid("id").primaryKey().defaultRandom(),
  islandId: uuid("island_id").notNull().references(() => islands.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  visitType: varchar("visit_type", { length: 50, enum: ["manual", "automatic"] }).default("automatic").notNull(),
  visitedAt: timestamp("visited_at", { withTimezone: true }).defaultNow().notNull(),
  notes: text("notes"),
}, (table) => ({
  userIslandIdx: unique("island_visits_user_island_idx").on(table.userId, table.islandId),
  userIdIdx: index("island_visits_user_id_idx").on(table.userId),
  islandIdIdx: index("island_visits_island_id_idx").on(table.islandId),
}));

export const islandVisitEquipment = pgTable("island_visit_equipment", {
  id: uuid("id").primaryKey().defaultRandom(),
  visitId: uuid("visit_id").notNull().references(() => islandVisits.id, { onDelete: "cascade" }),
  equipmentId: uuid("equipment_id").notNull().references(() => equipment.id, { onDelete: "cascade" }),
}, (table) => ({
  visitEquipmentIdx: unique("island_visit_equipment_visit_equipment_idx").on(table.visitId, table.equipmentId),
}));

export const userMilestones = pgTable("user_milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  milestoneType: varchar("milestone_type", { length: 50, enum: ["island_visits", "atolls_visited"] }).notNull(),
  milestoneName: varchar("milestone_name", { length: 255 }).notNull(),
  milestoneLevel: integer("milestone_level").notNull(),
  description: text("description").notNull(),
  badgeIcon: varchar("badge_icon", { length: 50 }).notNull(),
  badgeColor: varchar("badge_color", { length: 50 }).notNull(),
  progress: integer("progress").default(0).notNull(),
  targetValue: integer("target_value").notNull(),
  achievedAt: timestamp("achieved_at", { withTimezone: true }),
}, (table) => ({
  userTypeLevelIdx: unique("user_milestones_user_type_level_idx").on(table.userId, table.milestoneType, table.milestoneLevel),
  userIdIdx: index("user_milestones_user_id_idx").on(table.userId),
}));

export const selectUserSchema = createSelectSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});
export const insertUserSchema = createSelectSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const updateUserSchema = insertUserSchema.partial();

export const selectEventSchema = createSelectSchema(events).omit({ createdAt: true, updatedAt: true });
export const insertEventSchema = createSelectSchema(events).omit({ id: true, createdAt: true, updatedAt: true });
export const updateEventSchema = insertEventSchema.partial();

export const selectIslandSchema = createSelectSchema(islands).omit({ createdAt: true });
export const insertIslandSchema = createSelectSchema(islands).omit({ id: true, createdAt: true });

export const selectEquipmentSchema = createSelectSchema(equipment).omit({ createdAt: true, updatedAt: true });
export const insertEquipmentSchema = createSelectSchema(equipment).omit({ id: true, createdAt: true, updatedAt: true });

export const selectEquipmentTransferSchema = createSelectSchema(equipmentTransfers).omit({ transferredAt: true });
export const insertEquipmentTransferSchema = createSelectSchema(equipmentTransfers).omit({ id: true, transferredAt: true });

export const selectChatMessageSchema = createSelectSchema(chatMessages).omit({ createdAt: true });
export const insertChatMessageSchema = createSelectSchema(chatMessages).omit({ id: true, createdAt: true });

export const selectIslandVisitSchema = createSelectSchema(islandVisits).omit({ visitedAt: true });
export const insertIslandVisitSchema = createSelectSchema(islandVisits).omit({ id: true, visitedAt: true });

export const selectUserMilestoneSchema = createSelectSchema(userMilestones).omit({ achievedAt: true });
export const insertUserMilestoneSchema = createSelectSchema(userMilestones).omit({ id: true, achievedAt: true });

export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Event = z.infer<typeof selectEventSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Island = z.infer<typeof selectIslandSchema>;
export type InsertIsland = z.infer<typeof insertIslandSchema>;
export type Equipment = z.infer<typeof selectEquipmentSchema>;
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type EquipmentTransfer = z.infer<typeof selectEquipmentTransferSchema>;
export type InsertEquipmentTransfer = z.infer<typeof insertEquipmentTransferSchema>;
export type ChatMessage = z.infer<typeof selectChatMessageSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type IslandVisit = z.infer<typeof selectIslandVisitSchema>;
export type InsertIslandVisit = z.infer<typeof insertIslandVisitSchema>;
export type UserMilestone = z.infer<typeof selectUserMilestoneSchema>;
export type InsertUserMilestone = z.infer<typeof insertUserMilestoneSchema>;