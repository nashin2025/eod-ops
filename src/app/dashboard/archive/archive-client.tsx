"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";

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

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Archive</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">Historical record of completed and cancelled events</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-6">
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Archived Events</p>
                <p className="text-xl sm:text-2xl font-bold">{events.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Participants</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {events.reduce((sum, e) => sum + (e.participantCount || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search archived events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No archived events found.
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
                    <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                      {event.status}
                    </span>
                  </div>
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

                {expandedEvents.has(event.id) && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
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
                      <div>
                        <p className="text-muted-foreground">Archived</p>
                        <p>{new Date(event.updated_at).toLocaleDateString()}</p>
                      </div>
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
