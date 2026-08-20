"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Calendar, Users, MapPin, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  atoll: string;
  island: string;
  eventLocation?: string;
  status: string;
  participantCount: number;
  eventDate?: string;
  createdAt?: string;
  contact?: string;
  comment?: string;
}

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
}

export default function DashboardClient({
  user,
  events,
  users,
  activeEventsCount,
  completedEventsCount,
  visitedIslands,
  atollsVisited,
  teamMembersCount,
}: {
  user: { id: string; email?: string; user_metadata?: { full_name?: string } };
  events: Event[];
  users: User[];
  activeEventsCount: number;
  completedEventsCount: number;
  visitedIslands: number;
  atollsVisited: number;
  teamMembersCount: number;
}) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>("date");

  const toggleEventExpansion = (eventId: string) => {
    const newExpandedEvents = new Set(expandedEvents);
    if (newExpandedEvents.has(eventId)) {
      newExpandedEvents.delete(eventId);
    } else {
      newExpandedEvents.add(eventId);
    }
    setExpandedEvents(newExpandedEvents);
  };

  const recentEvents = events
    .sort((a, b) => {
      if (sortBy === "atoll") return a.atoll.localeCompare(b.atoll);
      else if (sortBy === "island") return a.island.localeCompare(b.island);
      else return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    })
    .slice(0, 6);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    }
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">Overview of events and activities across Maldives</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
        <Card className="card-neo dark:card-mono">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Events</p>
                <p className="text-xl sm:text-2xl font-bold" data-testid="text-active-events">{activeEventsCount}</p>
              </div>
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-neo dark:card-mono">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-xl sm:text-2xl font-bold" data-testid="text-team-members">{teamMembersCount}</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-neo dark:card-mono">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Islands Visited</p>
                <p className="text-xl sm:text-2xl font-bold" data-testid="text-visited-islands">{visitedIslands}</p>
              </div>
              <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-neo dark:card-mono">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Events</p>
                <p className="text-xl sm:text-2xl font-bold" data-testid="text-completed-events">{completedEventsCount}</p>
              </div>
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Events</h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-neo dark:input-mono text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="atoll">Sort by Atoll</option>
            <option value="island">Sort by Island</option>
          </select>
        </div>

        {recentEvents.length === 0 ? (
          <Card className="card-neo dark:card-mono">
            <CardContent className="p-6 text-center text-muted-foreground">
              No events yet. Create your first event to get started!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 animate-stagger-in">
            {recentEvents.map((event, index) => (
              <Card key={event.id} className="card-neo dark:card-mono" style={{ animationDelay: `${index * 60}ms` }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.atoll} - {event.island}
                      </p>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${getStatusStyles(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleEventExpansion(event.id)}
                      className="btn-neo-secondary dark:btn-mono-secondary"
                    >
                      {expandedEvents.has(event.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {expandedEvents.has(event.id) && (
                    <div className="mt-4 pt-4 border-t border-border">
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
    </div>
  );
}