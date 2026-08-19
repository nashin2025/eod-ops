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
import { insertEquipmentSchema } from "@/types/schemas";

interface Island {
  id: string;
  name: string;
  atoll: string;
}

interface Equipment {
  id?: string;
  name: string;
  type: string;
  quantity: number;
  status: string;
  atoll: string;
  island?: string;
  description?: string;
  condition?: string;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  quantity: z.coerce.number().min(0, "Quantity must be non-negative"),
  status: z.enum(["available", "in-use", "maintenance", "damaged", "transferred"]).default("available"),
  atoll: z.string().min(1, "Atoll is required"),
  island: z.string().optional(),
  description: z.string().optional(),
  condition: z.enum(["excellent", "good", "fair", "poor"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EquipmentForm({
  equipment,
  islands,
  onClose,
}: {
  equipment?: Equipment | null;
  islands: Island[];
  onClose: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAtoll, setSelectedAtoll] = useState(equipment?.atoll || "");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: equipment?.name || "",
      type: equipment?.type || "tools",
      quantity: equipment?.quantity || 1,
      status: (equipment?.status as FormValues["status"]) || "available",
      atoll: equipment?.atoll || "",
      island: equipment?.island || "",
      description: equipment?.description || "",
      condition: equipment?.condition as FormValues["condition"] || "good",
    },
  });

  const availableIslands = islands
    .filter(island => island.atoll === selectedAtoll)
    .map(island => island.name);

  useEffect(() => {
    if (equipment?.atoll) {
      setSelectedAtoll(equipment.atoll);
    }
  }, [equipment]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const url = equipment?.id ? `/api/equipment/${equipment.id}` : "/api/equipment";
      const method = equipment?.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to save equipment");

      onClose();
    } catch (error) {
      console.error("Error saving equipment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="tools">Tools</SelectItem>
                  <SelectItem value="vehicles">Vehicles</SelectItem>
                  <SelectItem value="safety">Safety Equipment</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="camping">Camping</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="atoll"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Atoll</FormLabel>
              <Select onValueChange={(value) => { field.onChange(value); setSelectedAtoll(value); form.setValue("island", ""); }} value={field.value}>
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
              <FormLabel>Island (Optional)</FormLabel>
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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
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
            {isSubmitting ? "Saving..." : equipment?.id ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
