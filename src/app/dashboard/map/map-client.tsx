"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Navigation } from "lucide-react";

const eventIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
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

  return (
    <div className="h-[calc(100vh-5rem)] overflow-hidden">
      <div className="absolute top-4 left-4 z-[1000] w-80">
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search islands or events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>
      </div>

      <MapContainer
        center={[3.2028, 73.2207]}
        zoom={8}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <>
            <Circle center={userLocation} radius={500} pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.2 }} />
            <Marker position={userLocation}>
              <Popup>Your Location</Popup>
            </Marker>
          </>
        )}

        {eventMarkers.map((event) => (
          <Marker
            key={`event-${event.id}`}
            position={[event.latitude!, event.longitude!]}
            icon={eventIcon}
          >
            <Popup>
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm">{event.atoll} - {event.island}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  event.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}>
                  {event.status}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        {islandMarkers.map((island) => (
          <Marker
            key={`island-${island.id}`}
            position={[island.latitude, island.longitude]}
          >
            <Popup>
              <div>
                <h3 className="font-semibold">{island.name}</h3>
                <p className="text-sm">{island.atoll}</p>
                {island.isVisited && <span className="text-xs text-green-600">Visited</span>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
