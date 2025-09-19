interface LatLng {
  lat: number;
  lng: number;
}

interface MarkerLocation {
  title: string;
  latlng: LatLng;
}

interface BoundaryState {
  sw: LatLng; // 남서쪽
  ne: LatLng; // 북동쪽
}

export default function useVisibleMarkers(
  locations: MarkerLocation[],
  bounds: BoundaryState | null
) {
  const isInBounds = (point: LatLng, bounds: BoundaryState): boolean => {
    return (
      point.lat >= bounds.sw.lat &&
      point.lat <= bounds.ne.lat &&
      point.lng >= bounds.sw.lng &&
      point.lng <= bounds.ne.lng
    );
  };

  if (!bounds) return [];

  const visibleMarkers = locations.filter((pos) =>
    isInBounds(pos.latlng, bounds)
  );

  return visibleMarkers;
}
