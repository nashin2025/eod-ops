import { z } from "zod";

export const insertUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(["admin", "coordinator", "agent", "attachment"]).default("agent"),
});

export const insertEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  atoll: z.string().min(1, "Atoll is required"),
  island: z.string().min(1, "Island is required"),
  eventLocation: z.string().optional(),
  waitingLocation: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  waitingLatitude: z.number().optional(),
  waitingLongitude: z.number().optional(),
  eventDate: z.string().optional(),
  contact: z.string().optional(),
  comment: z.string().optional(),
  status: z.enum(["scheduled", "active", "completed", "cancelled", "archived"]).default("scheduled"),
  photoUrl: z.string().optional(),
});

export const insertEquipmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  quantity: z.number().int().min(0, "Quantity must be non-negative"),
  status: z.enum(["available", "in-use", "maintenance", "damaged", "transferred"]).default("available"),
  atoll: z.string().min(1, "Atoll is required"),
  island: z.string().optional(),
  description: z.string().optional(),
  condition: z.enum(["excellent", "good", "fair", "poor"]).optional(),
});

export const transferFormSchema = z.object({
  quantityToMove: z.number().int().min(1, "Quantity must be at least 1"),
  destinationAtoll: z.string().min(1, "Destination atoll is required"),
  destinationIsland: z.string().optional(),
  notes: z.string().optional(),
});

export type TransferFormValues = z.infer<typeof transferFormSchema>;
