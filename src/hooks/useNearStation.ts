import { useMemo } from "react";

interface LatLng {
  lat: number;
  lng: number;
}

interface Station {
  stationName: string;
  latlng: LatLng;
  // airData: any;
}

const getDistance = (p1: LatLng, p2: LatLng): number => {
  const dx = p1.lng - p2.lng;
  const dy = p1.lat - p2.lat;
  return Math.sqrt(dx * dx + dy * dy);
}

const useNearStation = (
  currentLocation: LatLng | null,
  stations: Station[],
): Station | null => {
  const nearestStation = useMemo(() => {
    if (!currentLocation || stations.length === 0) return null;

    let minDistance = Infinity;
    let nearest: Station | null = null;

    stations.forEach(station => {
      const distance = getDistance(currentLocation, station.latlng);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = station;
      }
    });

    return nearest;
  }, [currentLocation, stations]);

  return nearestStation;
}
export default useNearStation;