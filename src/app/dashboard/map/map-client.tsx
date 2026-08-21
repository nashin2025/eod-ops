"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, MapPinLine, MapPinSimple, MagnifyingGlass, StackSimple,
  NavigationArrow, Compass, Globe, Users, CheckCircle, Circle as CircleIcon
} from "@phosphor-icons/react";

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { label: "Active", variant: "success" as const };
      case "scheduled":
        return { label: "Scheduled", variant: "default" as const };
      case "completed":
        return { label: "Completed", variant: "default" as const };
      default:
        return { label: status, variant: "danger" as const };
    }
  };

  const getIslandIcon = (island: Island) => {
    if (island.isVisited) return visitedIslandIcon;
    return islandIcon;
  };

  return (
    <div className="relative h-[calc(100vh-var(--layout-topbar-height))] overflow-hidden" style={{ height: "calc(100vh - var(--layout-topbar-height))" }}>
      {/* Search & Filter Panel */}
      <div className="absolute top-[var(--space-6)] left-[var(--space-6)] z-[1000] w-[320px] animate-fade-in">
        <Card style={{ padding: "var(--layout-card-padding)" }}>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5" style={{ color: "var(--accent)" }} />
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Explore</h2>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2" style={{ width: 18, height: 18, color: "var(--text-tertiary)" }} />
            <Input
              placeholder="Search islands or events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11"
              style={{ height: "var(--layout-control-height)" }}
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
                    ? "text-white shadow-[0_4px_14px_var(--accent-glow)]"
                    : "hover:bg-[var(--hover-bg)]"
                }`}
                style={{
                  background: selectedFilter === filter ? "var(--accent)" : "transparent",
                  color: selectedFilter === filter ? "white" : "var(--text-secondary)",
                }}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-center p-3 rounded-xl" style={{ background: "var(--hover-bg)" }}>
            <div>
              <p className="text-2xl font-bold tabular" style={{ color: "var(--text-primary)" }}>{filteredEvents.length}</p>
              <p className="label" style={{ color: "var(--text-tertiary)" }}>Events</p>
            </div>
            <div>
              <p className="text-2xl font-bold tabular" style={{ color: "var(--text-primary)" }}>{filteredIslands.length}</p>
              <p className="label" style={{ color: "var(--text-tertiary)" }}>Islands</p>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 space-y-2" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="label" style={{ color: "var(--text-tertiary)" }}>Legend</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full" style={{ background: "var(--accent)" }} />
              <span style={{ color: "var(--text-tertiary)" }}>Active Events</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full" style={{ background: "var(--success)" }} />
              <span style={{ color: "var(--text-tertiary)" }}>Unvisited Islands</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full" style={{ background: "var(--warning)" }} />
              <span style={{ color: "var(--text-tertiary)" }}>Visited Islands</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full" style={{ background: "#3B82F6" }} />
              <span style={{ color: "var(--text-tertiary)" }}>Your Location</span>
            </div>
          </div>
        </Card>
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
                    <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Your Location</p>
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Current GPS position</p>
                  </div>
                </Popup>
              </Marker>
            </>
          )}

          {/* Event Markers */}
          {(selectedFilter === "all" || selectedFilter === "events") && filteredEvents.map((event) => {
            const statusConfig = getStatusConfig(event.status);
            return (
              <Marker
                key={`event-${event.id}`}
                position={[event.latitude!, event.longitude!]}
                icon={eventIcon}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>{event.title}</h3>
                    <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>{event.atoll} - {event.island}</p>
                    <Badge variant={statusConfig.variant} dot className="mt-2">{statusConfig.label}</Badge>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Island Markers */}
          {(selectedFilter === "all" || selectedFilter === "islands") && filteredIslands.map((island) => (
            <Marker
              key={`island-${island.id}`}
              position={[island.latitude, island.longitude]}
              icon={getIslandIcon(island)}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>{island.name}</h3>
                  <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>{island.atoll}</p>
                  {island.isVisited && (
                    <Badge variant="warning" dot className="mt-2">Visited</Badge>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Zoom Controls */}
        <div className="absolute bottom-[var(--space-6)] right-[var(--space-6)] z-[1000] flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl shadow-lg"
            onClick={() => {
              const map = document.querySelector('.leaflet-container') as any;
              if (map && map._leaflet_map) {
                map._leaflet_map.zoomIn();
              }
            }}
            aria-label="Zoom in"
            style={{ height: "var(--layout-control-height)", width: "var(--layout-control-height)" }}
          >
            <StackSimple className="h-5 w-5" style={{ width: 20, height: 20 }} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl shadow-lg"
            onClick={() => {
              const map = document.querySelector('.leaflet-container') as any;
              if (map && map._leaflet_map) {
                map._leaflet_map.zoomOut();
              }
            }}
            aria-label="Zoom out"
            style={{ height: "var(--layout-control-height)", width: "var(--layout-control-height)" }}
          >
            <StackSimple className="h-5 w-5" style={{ width: 20, height: 20, transform: "rotate(180deg)" }} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl shadow-lg"
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
            style={{ height: "var(--layout-control-height)", width: "var(--layout-control-height)" }}
          >
            <NavigationArrow className="h-5 w-5" style={{ width: 20, height: 20 }} />
          </Button>
        </div>
      </div>
    </div>
  );
}