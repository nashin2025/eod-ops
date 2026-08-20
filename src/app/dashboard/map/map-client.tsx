"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Navigation, MapPin, Layers } from "lucide-react";

// Custom icons for leaflet markers
const eventIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const islandIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const visitedIslandIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Event {
  id: string;
  title: string;
  atoll: string;
  island: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
}

interface Island {
  id: string;
  name: string;
  atoll: string;
  latitude: number;
  longitude: number;
  isVisited: boolean;
}

// Layout constants matching the 8-point spacing scale
const LAYOUT = {
  pagePadding: 24,           // --space-6
  controlHeight: 44,         // tap-friendly
  panelWidth: 320,           // 320px side panel
  headerHeight: 68,          // matches top bar
} as const;

export default function MapClient({
  user,
  events,
  islands,
}: {
  user: { id: string };
  events: Event[];
  islands: Island[];
}) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "events" | "islands">("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedIsland, setSelectedIsland] = useState<Island | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error("Geolocation error:", error)
      );
    }
  }, []);

  const eventMarkers = events.filter(e => e.latitude && e.longitude);
  const islandMarkers = islands;

  const filteredEvents = eventMarkers.filter(event => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(query) ||
      event.atoll.toLowerCase().includes(query) ||
      event.island.toLowerCase().includes(query)
    );
  });

  const filteredIslands = islandMarkers.filter(island => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      island.name.toLowerCase().includes(query) ||
      island.atoll.toLowerCase().includes(query)
    );
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

  const getIslandIcon = (island: Island) => {
    if (island.isVisited) return visitedIslandIcon;
    return islandIcon;
  };

  return (
    <div className="relative h-[calc(100vh-5rem)] overflow-hidden">
      {/* Search & Filter Panel */}
      <div className="absolute top-space-6 left-space-6 z-[1000] w-[320px] animate-fade-in">
        <div className="card-neo dark:card-mono p-space-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-[hsl(var(--accent))]" />
            <h2 className="text-lg font-semibold text-foreground">Explore</h2>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search islands or events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full text-sm"
              style={{ height: LAYOUT.controlHeight }}
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4">
            {["all", "events", "islands"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter as "all" | "events" | "islands")}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedFilter === filter
                    ? "bg-[hsl(var(--accent))] text-white shadow-[0_4px_14px_hsl(var(--accent)/0.4)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--muted)/0.3)]"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-center p-3 rounded-xl bg-[hsl(var(--muted)/0.3)]">
            <div>
              <p className="text-2xl font-bold text-foreground tabular-nums">{filteredEvents.length}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Events</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground tabular-nums">{filteredIslands.length}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Islands</p>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Legend</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--accent))" }} />
              <span className="text-muted-foreground">Active Events</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full" style={{ background: "#10B981" }} />
              <span className="text-muted-foreground">Unvisited Islands</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full" style={{ background: "#F59E0B" }} />
              <span className="text-muted-foreground">Visited Islands</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full" style={{ background: "#3B82F6" }} />
              <span className="text-muted-foreground">Your Location</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="absolute inset-0">
        <MapContainer
          center={[3.2028, 73.2207]}
          zoom={8}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User Location */}
          {userLocation && (
            <>
              <Circle center={userLocation} radius={500} pathOptions={{ color: "#3B82F6", fillColor: "#3B82F6", fillOpacity: 0.2 }} />
              <Marker position={userLocation}>
                <Popup>
                  <div className="p-2">
                    <p className="font-semibold text-foreground">Your Location</p>
                    <p className="text-xs text-muted-foreground">Current GPS position</p>
                  </div>
                </Popup>
              </Marker>
            </>
          )}

          {/* Event Markers */}
          {(selectedFilter === "all" || selectedFilter === "events") && filteredEvents.map((event) => (
            <Marker
              key={`event-${event.id}`}
              position={[event.latitude!, event.longitude!]}
              icon={eventIcon}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-foreground">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.atoll} - {event.island}</p>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${getStatusStyles(event.status)}`}>
                    {event.status}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Island Markers */}
          {(selectedFilter === "all" || selectedFilter === "islands") && filteredIslands.map((island) => (
            <Marker
              key={`island-${island.id}`}
              position={[island.latitude, island.longitude]}
              icon={getIslandIcon(island)}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-foreground">{island.name}</h3>
                  <p className="text-sm text-muted-foreground">{island.atoll}</p>
                  {island.isVisited && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      Visited
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Zoom Controls */}
        <div className="absolute bottom-space-6 right-space-6 z-[1000] flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl btn-neo-secondary dark:btn-mono-secondary shadow-lg"
            onClick={() => {
              const map = document.querySelector('.leaflet-container') as any;
              if (map && map._leaflet_map) {
                map._leaflet_map.zoomIn();
              }
            }}
            aria-label="Zoom in"
            style={{ height: 44, width: 44 }}
          >
            <Layers className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl btn-neo-secondary dark:btn-mono-secondary shadow-lg"
            onClick={() => {
              const map = document.querySelector('.leaflet-container') as any;
              if (map && map._leaflet_map) {
                map._leaflet_map.zoomOut();
              }
            }}
            aria-label="Zoom out"
            style={{ height: 44, width: 44 }}
          >
            <Layers className="h-5 w-5 rotate-180" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl btn-neo-secondary dark:btn-mono-secondary shadow-lg"
            onClick={() => {
              if (userLocation) {
                const map = document.querySelector('.leaflet-container') as any;
                if (map && map._leaflet_map) {
                  map._leaflet_map.setView(userLocation, 12);
                }
              } else if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const map = document.querySelector('.leaflet-container') as any;
                    if (map && map._leaflet_map) {
                      map._leaflet_map.setView([position.coords.latitude, position.coords.longitude], 12);
                    }
                  },
                  (error) => console.error("Geolocation error:", error)
                );
              }
            }}
            aria-label="Center on location"
            style={{ height: 44, width: 44 }}
          >
            <Navigation className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}