"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Navigation } from "lucide-react";

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
  eventLocation?: string;
  latitude?: number;
  longitude?: number;
  contact?: string;
  status: string;
}

export default function EventShareClient({ event }: { event: Event }) {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error("Geolocation error:", error)
      );
    }
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Join ${event.title} at ${event.atoll} - ${event.island}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Share error:", error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] overflow-hidden">
      <div className="absolute top-4 left-4 z-[1000]">
        <Card className="p-4 w-80">
          <h1 className="text-xl font-bold mb-2">{event.title}</h1>
          <p className="text-sm text-muted-foreground mb-2">
            {event.atoll} - {event.island}
          </p>
          {event.eventLocation && (
            <p className="text-sm mb-4">{event.eventLocation}</p>
          )}
          <div className="flex gap-2">
            <Button onClick={handleShare} className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            {event.latitude && event.longitude && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  <Navigation className="h-4 w-4 mr-2" />
                  Directions
                </Button>
              </a>
            )}
          </div>
        </Card>
      </div>

      {event.latitude && event.longitude ? (
        <MapContainer
          center={[event.latitude, event.longitude]}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[event.latitude, event.longitude]} icon={eventIcon}>
            <Popup>
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm">{event.atoll} - {event.island}</p>
              </div>
            </Popup>
          </Marker>
          {currentLocation && (
            <Marker position={currentLocation}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
        </MapContainer>
      ) : (
        <div className="h-full flex items-center justify-center">
          <Card className="p-8">
            <p className="text-center text-muted-foreground">No location data available for this event.</p>
          </Card>
        </div>
      )}
    </div>
  );
}
