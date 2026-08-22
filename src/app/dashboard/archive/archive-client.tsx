"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Archive, Users, Clock, CaretDown, CaretUp, MagnifyingGlass
} from "@phosphor-icons/react";

interface Event {
  id: string;
  title: string;
  atoll: string;
  island: string;
  status: string;
  participantCount: number;
  eventDate?: string;
  comment?: string;
  updated_at: string;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "completed":
      return { label: "Completed", variant: "default" as const };
    case "cancelled":
      return { label: "Cancelled", variant: "danger" as const };
    default:
      return { label: status, variant: "default" as const };
  }
};

export default function ArchiveClient({ events }: { events: Event[] }) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = events.filter((event) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(query) ||
      event.atoll.toLowerCase().includes(query) ||
      event.island.toLowerCase().includes(query) ||
      (event.comment && event.comment.toLowerCase().includes(query))
    );
  });

  const toggleEventExpansion = (eventId: string) => {
    const newExpandedEvents = new Set(expandedEvents);
    if (newExpandedEvents.has(eventId)) {
      newExpandedEvents.delete(eventId);
    } else {
      newExpandedEvents.add(eventId);
    }
    setExpandedEvents(newExpandedEvents);
  };

  const totalParticipants = events.reduce((sum, e) => sum + (e.participantCount || 0), 0);

  const kpiItems = [
    { label: "Archived Events", value: events.length, icon: <Archive className="h-5 w-5" />, color: "var(--accent)" },
    { label: "Total Participants", value: totalParticipants, icon: <Users className="h-5 w-5" />, color: "var(--success)" },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: "var(--layout-page-padding) var(--layout-page-padding) 0" }}>
      {/* Header */}
      <div className="mb-[var(--layout-section-gap)]">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Archive</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Historical record of completed and cancelled events</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-[var(--layout-card-gap)] mb-[var(--layout-section-gap)]">
        {kpiItems.map((kpi, index) => (
          <Card key={kpi.label} style={{ padding: "var(--layout-kpi-padding)", animationDelay: `${index * 80}ms` }}>
            <div className="flex items-start justify-between h-full">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 text-sm text-tertiary mb-2" style={{ color: "var(--text-tertiary)" }}>
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `color-mix(in srgb, ${kpi.color} 15%, transparent)`, color: kpi.color }}
                  >
                    {kpi.icon}
                  </span>
                  <span className="font-medium uppercase tracking-wider">{kpi.label}</span>
                </div>
                <p className="text-2xl font-bold tabular" style={{ color: "var(--text-primary)" }}>{kpi.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="mb-[var(--layout-section-gap)]">
        <div className="relative max-w-md">
          <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary" />
          <Input
            placeholder="Search archived events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11"
            style={{ height: "var(--layout-control-height)" }}
          />
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <Card className="text-center" style={{ padding: "var(--space-8)" }}>
          <Archive className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--text-tertiary)" }} />
          <p className="text-lg" style={{ color: "var(--text-tertiary)" }}>No archived events found</p>
        </Card>
      ) : (
        <div className="space-y-4" style={{ gap: "var(--space-4)" }}>
          {filteredEvents.map((event) => {
            const statusConfig = getStatusConfig(event.status);
            return (
              <Card key={event.id} style={{ padding: "var(--layout-card-padding)" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate" style={{ color: "var(--text-primary)" }}>{event.title}</h3>
                    <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>{event.atoll} - {event.island}</p>
                    <Badge variant={statusConfig.variant} dot className="mt-2">{statusConfig.label}</Badge>
                  </div>
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

                {expandedEvents.has(event.id) && (
                  <div className="mt-5 pt-5 animate-slide-in-left" style={{ borderTop: "1px solid var(--border)" }}>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="label" style={{ color: "var(--text-tertiary)" }}>Participants</p>
                        <p className="mt-1 tabular" style={{ color: "var(--text-primary)" }}>{event.participantCount || 0}</p>
                      </div>
                      {event.eventDate && (
                        <div>
                          <p className="label" style={{ color: "var(--text-tertiary)" }}>Event Date</p>
                          <p className="mt-1" style={{ color: "var(--text-primary)" }}>{new Date(event.eventDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      <div>
                        <p className="label" style={{ color: "var(--text-tertiary)" }}>Archived</p>
                        <p className="mt-1" style={{ color: "var(--text-primary)" }}>{new Date(event.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {event.comment && (
                      <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                        <p className="label" style={{ color: "var(--text-tertiary)" }}>Notes</p>
                        <p className="mt-1" style={{ color: "var(--text-primary)" }}>{event.comment}</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}