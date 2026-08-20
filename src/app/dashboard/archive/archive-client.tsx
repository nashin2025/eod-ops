"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Search, Archive as ArchiveIcon } from "lucide-react";

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

// Layout constants matching the 8-point spacing scale
const LAYOUT = {
  pagePadding: 24,           // --space-6
  cardPadding: 24,           // --space-6
  kpiCardPadding: 20,        // --space-5
  sectionGap: 32,            // --space-7
  cardRowGap: 20,            // --space-5
  controlHeight: 44,         // tap-friendly
  iconSize: 20,              // 20px icons
  iconGap: 8,                // icon-text gap in buttons
  buttonPaddingH: 16,        // 16px horizontal
  buttonPaddingV: 10,        // 10px vertical
} as const;

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
    { label: "Archived Events", value: events.length, icon: <ArchiveIcon className="h-5 w-5" />, color: "hsl(var(--accent))" },
    { label: "Total Participants", value: totalParticipants, icon: <ArchiveIcon className="h-5 w-5" />, color: "#10B981" },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="p-space-6">
      {/* Header */}
      <div className="mb-space-7">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">Archive</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">Historical record of completed and cancelled events</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-space-5 mb-space-7 items-stretch">
        {kpiItems.map((kpi, index) => (
          <Card key={kpi.label} className="card-neo dark:card-mono" style={{ padding: LAYOUT.kpiCardPadding, animationDelay: `${index * 80}ms` }}>
            <div className="flex items-start justify-between h-full">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                  <span 
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${kpi.color}15`, color: kpi.color }}
                  >
                    {kpi.icon}
                  </span>
                  <span className="font-medium uppercase tracking-wider">{kpi.label}</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums leading-tight">{kpi.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="mb-space-7">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search archived events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full text-sm"
            style={{ height: LAYOUT.controlHeight }}
          />
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="card-neo dark:card-mono p-space-8 text-center">
          <ArchiveIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No archived events found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="card-neo dark:card-mono" style={{ padding: LAYOUT.cardPadding }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground truncate">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{event.atoll} - {event.island}</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${getStatusStyles(event.status)}`}>
                    {event.status}
                  </span>
                </div>
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

              {expandedEvents.has(event.id) && (
                <div className="mt-5 pt-5 border-t border-border animate-slide-up">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Participants</p>
                      <p className="text-sm text-foreground mt-1 tabular-nums">{event.participantCount || 0}</p>
                    </div>
                    {event.eventDate && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Event Date</p>
                        <p className="text-sm text-foreground mt-1">{new Date(event.eventDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Archived</p>
                      <p className="text-sm text-foreground mt-1">{new Date(event.updated_at).toLocaleDateString()}</p>
                    </div>
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