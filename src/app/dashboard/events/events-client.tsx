"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Archive, ChevronDown, ChevronUp, MapPin, Phone, Download, Search, Filter, Calendar } from "lucide-react";
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

// Layout constants matching the 8-point spacing scale
const LAYOUT = {
  pagePadding: 24,           // --space-6
  cardPadding: 24,           // --space-6
  sectionGap: 32,            // --space-7
  cardRowGap: 20,            // --space-5
  controlHeight: 44,         // tap-friendly
  iconSize: 20,              // 20px icons
  iconGap: 8,                // icon-text gap in buttons
  buttonPaddingH: 16,        // 16px horizontal
  buttonPaddingV: 10,        // 10px vertical
} as const;

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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active":
        return "bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))] dark:bg-[hsl(var(--accent)/0.2)] dark:text-[hsl(var(--accent))]";
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    }
  };

  return (
    <div className="p-space-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-space-7">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">Events</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">Manage conservation events across the Maldives</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="btn-neo-accent dark:btn-mono-primary w-full sm:w-auto"
          style={{ height: 48, paddingLeft: LAYOUT.buttonPaddingH, paddingRight: LAYOUT.buttonPaddingH }}
        >
          <Plus className="h-4 w-4 mr-2" style={{ transform: "translateY(1px)" }} />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-space-7">
        <div className="relative flex-1 min-w-[180px] max-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <select
            value={filters.atoll}
            onChange={(e) => setFilters({ ...filters, atoll: e.target.value })}
            className="input-neo dark:input-mono pl-10 w-full text-sm"
            style={{ height: LAYOUT.controlHeight }}
          >
            <option value="">All Atolls</option>
            {Array.from(new Set(islands.map(i => i.atoll))).map(atoll => (
              <option key={atoll} value={atoll}>{atoll}</option>
            ))}
          </select>
        </div>
        <div className="relative flex-1 min-w-[180px] max-w-[280px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="input-neo dark:input-mono pl-10 w-full text-sm"
            style={{ height: LAYOUT.controlHeight }}
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
        <div className="card-neo dark:card-mono p-space-8 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No events found</p>
          <p className="text-sm text-muted-foreground mt-1">Create your first event to get started!</p>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="btn-neo-accent dark:btn-mono-primary mt-4"
            style={{ height: 48, paddingLeft: 24, paddingRight: 24 }}
          >
            <Plus className="h-4 w-4 mr-2" style={{ transform: "translateY(1px)" }} />
            Create Event
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="card-neo dark:card-mono" style={{ padding: LAYOUT.cardPadding }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground truncate">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{event.atoll} - {event.island}</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${getStatusStyles(event.status)}`}
                  >
                    {event.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {event.latitude && event.longitude && (
                    <Link href={`/dashboard/map?event=${event.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl btn-neo-secondary dark:btn-mono-secondary"
                        aria-label="View on map"
                        style={{ height: 40, width: 40 }}
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleEventExpansion(event.id)}
                    className="rounded-xl btn-neo-secondary dark:btn-mono-secondary"
                    aria-label={expandedEvents.has(event.id) ? "Collapse event" : "Expand event"}
                    style={{ height: 40, width: 40 }}
                  >
                    {expandedEvents.has(event.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {expandedEvents.has(event.id) && (
                <div className="mt-5 pt-5 border-t border-border animate-slide-up">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Event Location</p>
                      <p className="text-sm text-foreground mt-1">{event.eventLocation || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Participants</p>
                      <p className="text-sm text-foreground mt-1 tabular-nums">{event.participantCount || 0}</p>
                    </div>
                    {event.eventDate && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</p>
                        <p className="text-sm text-foreground mt-1">{new Date(event.eventDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {event.contact && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</p>
                        <p className="text-sm text-foreground mt-1">{event.contact}</p>
                      </div>
                    )}
                  </div>
                  {event.comment && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Notes</p>
                      <p className="text-sm text-foreground mt-1">{event.comment}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}