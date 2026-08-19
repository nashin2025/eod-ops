"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Archive, ChevronDown, ChevronUp, MapPin, Phone, Download } from "lucide-react";
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

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Events</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">Manage conservation events across the Maldives</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filters.atoll}
          onChange={(e) => setFilters({ ...filters, atoll: e.target.value })}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Atolls</option>
          {Array.from(new Set(islands.map(i => i.atoll))).map(atoll => (
            <option key={atoll} value={atoll}>{atoll}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No events found. Create your first event to get started!
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {event.atoll} - {event.island}
                    </p>
                    <span
                      className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                        event.status === "active"
                          ? "bg-green-100 text-green-800"
                          : event.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : event.status === "completed"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {event.latitude && event.longitude && (
                      <Link href={`/dashboard/map?event=${event.id}`}>
                        <Button variant="ghost" size="sm">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleEventExpansion(event.id)}
                    >
                      {expandedEvents.has(event.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedEvents.has(event.id) && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Event Location</p>
                        <p>{event.eventLocation || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Participants</p>
                        <p>{event.participantCount || 0}</p>
                      </div>
                      {event.eventDate && (
                        <div>
                          <p className="text-muted-foreground">Event Date</p>
                          <p>{new Date(event.eventDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      {event.contact && (
                        <div>
                          <p className="text-muted-foreground">Contact</p>
                          <p>{event.contact}</p>
                        </div>
                      )}
                    </div>
                    {event.comment && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">Notes</p>
                        <p className="text-sm mt-1">{event.comment}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
