"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus, PencilSimple, Trash, Archive, CaretDown, CaretUp, MapPin,
  Phone, Download, MagnifyingGlass, FunnelSimple, Calendar, CaretDown as ChevronDownIcon
} from "@phosphor-icons/react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  atoll: string;
  island: string;
  eventLocation?: string;
  status: string;
  participantCount: number;
  eventDate?: string;
  contact?: string;
  comment?: string;
  latitude?: number;
  longitude?: number;
}

interface Island {
  id: string;
  name: string;
  atoll: string;
}

export default function EventsClient({
  user,
  events,
  islands,
}: {
  user: { id: string; email?: string };
  events: Event[];
  islands: Island[];
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({ atoll: "", island: "", status: "" });
  const router = useRouter();

  const toggleEventExpansion = (eventId: string) => {
    const newExpandedEvents = new Set(expandedEvents);
    if (newExpandedEvents.has(eventId)) {
      newExpandedEvents.delete(eventId);
    } else {
      newExpandedEvents.add(eventId);
    }
    setExpandedEvents(newExpandedEvents);
  };

  const filteredEvents = events.filter((event) => {
    if (filters.atoll && event.atoll !== filters.atoll) return false;
    if (filters.island && event.island !== filters.island) return false;
    if (filters.status && event.status !== filters.status) return false;
    return true;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { label: "Active", variant: "accent" as const };
      case "scheduled":
        return { label: "Scheduled", variant: "default" as const };
      case "completed":
        return { label: "Completed", variant: "success" as const };
      case "cancelled":
        return { label: "Cancelled", variant: "danger" as const };
      default:
        return { label: status, variant: "default" as const };
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: "var(--layout-page-padding) var(--layout-page-padding) 0" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-[var(--layout-section-gap)]">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Events</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Manage conservation events across the Maldives</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          size="lg"
          className="w-full sm:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" style={{ transform: "translateY(0.5px)" }} />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-[var(--layout-section-gap)]">
        <div className="relative flex-1 min-w-[180px] max-w-[280px]">
          <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary" />
          <Input
            type="text"
            placeholder="Search events..."
            className="pl-11"
            style={{ height: "var(--layout-control-height)" }}
          />
        </div>
        <div className="relative flex-1 min-w-[180px] max-w-[280px]">
          <FunnelSimple className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary" />
          <select
            value={filters.atoll}
            onChange={(e) => setFilters({ ...filters, atoll: e.target.value })}
            className="pl-11 pr-10"
            style={{ height: "var(--layout-control-height)", appearance: "none" }}
          >
            <option value="">All Atolls</option>
            {Array.from(new Set(islands.map(i => i.atoll))).map(atoll => (
              <option key={atoll} value={atoll}>{atoll}</option>
            ))}
          </select>
        </div>
        <div className="relative flex-1 min-w-[180px] max-w-[280px]">
          <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none h-5 w-5 text-tertiary" />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="pr-10"
            style={{ height: "var(--layout-control-height)", appearance: "none" }}
          >
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <Card className="text-center" style={{ padding: "var(--space-8)" }}>
          <Calendar className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--text-tertiary)" }} />
          <p className="text-lg mb-1" style={{ color: "var(--text-tertiary)" }}>No events found</p>
          <p className="text-sm mb-4" style={{ color: "var(--text-tertiary)" }}>Create your first event to get started!</p>
          <Button size="lg" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-5 w-5 mr-2" style={{ transform: "translateY(0.5px)" }} />
            Create Event
          </Button>
        </Card>
      ) : (
        <div className="space-y-4" style={{ gap: "var(--space-4)" }}>
          {filteredEvents.map((event) => {
            const statusConfig = getStatusConfig(event.status);
            return (
              <Card key={event.id} className="p-0 overflow-hidden">
                <CardContent style={{ padding: "var(--layout-card-padding)" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold truncate" style={{ color: "var(--text-primary)" }}>{event.title}</h3>
                      <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>{event.atoll} - {event.island}</p>
                      <Badge variant={statusConfig.variant} dot className="mt-2">
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {event.latitude && event.longitude && (
                        <Link href={`/dashboard/map?event=${event.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl"
                            aria-label="View on map"
                          >
                            <MapPin className="h-5 w-5" />
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleEventExpansion(event.id)}
                        className="rounded-xl"
                        aria-label={expandedEvents.has(event.id) ? "Collapse event" : "Expand event"}
                      >
                        {expandedEvents.has(event.id) ? <CaretUp className="h-5 w-5" /> : <CaretDown className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>

                  {expandedEvents.has(event.id) && (
                    <div className="mt-5 pt-5 animate-slide-in-left" style={{ borderTop: "1px solid var(--border)" }}>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="label" style={{ color: "var(--text-tertiary)" }}>Event Location</p>
                          <p className="mt-1" style={{ color: "var(--text-primary)" }}>{event.eventLocation || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="label" style={{ color: "var(--text-tertiary)" }}>Participants</p>
                          <p className="mt-1 tabular" style={{ color: "var(--text-primary)" }}>{event.participantCount || 0}</p>
                        </div>
                        {event.eventDate && (
                          <div>
                            <p className="label" style={{ color: "var(--text-tertiary)" }}>Date</p>
                            <p className="mt-1" style={{ color: "var(--text-primary)" }}>{new Date(event.eventDate).toLocaleDateString()}</p>
                          </div>
                        )}
                        {event.contact && (
                          <div>
                            <p className="label" style={{ color: "var(--text-tertiary)" }}>Contact</p>
                            <p className="mt-1" style={{ color: "var(--text-primary)" }}>{event.contact}</p>
                          </div>
                        )}
                      </div>
                      {event.comment && (
                        <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                          <p className="label" style={{ color: "var(--text-tertiary)" }}>Notes</p>
                          <p className="mt-1" style={{ color: "var(--text-primary)" }}>{event.comment}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}