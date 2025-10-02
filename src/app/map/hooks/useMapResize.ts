import { useState, useEffect, useRef } from "react";

export default function useMapResize() {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const lastCenterRef = useRef<kakao.maps.LatLng | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!map || !containerRef.current) return;

    lastCenterRef.current = map.getCenter();

    const handleUserMoved = () => {
      lastCenterRef.current = map.getCenter();
    };

    const resizeObserver = new ResizeObserver(() => {
      if (!map || !lastCenterRef.current) return;
      map.relayout();
      map.setCenter(lastCenterRef.current);
    });

    resizeObserver.observe(containerRef.current);

    kakao.maps.event.addListener(map, "dragend", handleUserMoved);
    kakao.maps.event.addListener(map,"zoom_changed", handleUserMoved);

    return () => {
      resizeObserver.disconnect();
      kakao.maps.event.removeListener(map, "dragend", handleUserMoved);
      kakao.maps.event.removeListener(map, "zoom_changed", handleUserMoved);
    };
  }, [map]);

  return { map, setMap, containerRef };
}
