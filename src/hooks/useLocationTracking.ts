"use client";

import { useEffect, useRef, useCallback } from "react";

export function useLocationTracking(onLocationUpdate?: (lat: number, lon: number) => void) {
  const watchIdRef = useRef<number | null>(null);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        onLocationUpdate?.(position.coords.latitude, position.coords.longitude);
      },
      (error) => console.error("Location tracking error:", error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [onLocationUpdate]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopTracking();
  }, [stopTracking]);

  return { startTracking, stopTracking };
}
