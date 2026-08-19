"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { insertEventSchema } from "@/types/schemas";

interface Island {
  id: string;
  name: string;
  atoll: string;
}

interface Event {
  id?: string;
  title: string;
  atoll: string;
  island: string;
  eventLocation?: string;
  waitingLocation?: string;
  latitude?: number;
  longitude?: number;
  eventDate?: string;
  contact?: string;
  comment?: string;
  status: string;
  photoUrl?: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  atoll: z.string().min(1, "Atoll is required"),
  island: z.string().min(1, "Island is required"),
  eventLocation: z.string().optional(),
  waitingLocation: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  waitingLatitude: z.coerce.number().optional(),
  waitingLongitude: z.coerce.number().optional(),
  eventDate: z.string().optional(),
  contact: z.string().optional(),
  comment: z.string().optional(),
  status: z.enum(["scheduled", "active", "completed", "cancelled", "archived"]).default("scheduled"),
  photoUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EventForm({
  event,
  islands,
  onClose,
}: {
  event?: Event | null;
  islands: Island[];
  onClose: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAtoll, setSelectedAtoll] = useState(event?.atoll || "");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event?.title || "",
      atoll: event?.atoll || "",
      island: event?.island || "",
      eventLocation: event?.eventLocation || "",
      waitingLocation: event?.waitingLocation || "",
      latitude: event?.latitude || undefined,
      longitude: event?.longitude || undefined,
      eventDate: event?.eventDate || "",
      contact: event?.contact || "",
      comment: event?.comment || "",
      status: (event?.status as FormValues["status"]) || "scheduled",
      photoUrl: event?.photoUrl || "",
    },
  });

  const availableIslands = islands
    .filter(island => island.atoll === selectedAtoll)
    .map(island => island.name);

  useEffect(() => {
    if (event?.atoll) {
      setSelectedAtoll(event.atoll);
    }
  }, [event]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const url = event?.id ? `/api/events/${event.id}` : "/api/events";
      const method = event?.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to save event");

      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="atoll"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Atoll</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedAtoll(value);
                    form.setValue("island", "");
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select atoll" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from(new Set(islands.map(i => i.atoll))).map(atoll => (
                      <SelectItem key={atoll} value={atoll}>{atoll}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="island"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Island</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedAtoll}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select island" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableIslands.map(island => (
                      <SelectItem key={island} value={island}>{island}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="eventLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Date</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : event?.id ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
