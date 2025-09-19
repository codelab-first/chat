import { useState, useEffect, useRef } from "react";

export default function useMapResize() {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const centerRef = useRef<kakao.maps.LatLng | null>(null);

  useEffect(() => {
    if (!map) return;

    centerRef.current = map.getCenter();

    const updateCenter = () => {
      centerRef.current = map.getCenter();
    };

    const handleResize = () => {
      if (!map ||!centerRef.current) return;
      map.relayout();
      map.setCenter(centerRef.current);
    }; 
    kakao.maps.event.addListener(map, "center_changed", updateCenter);
    window.addEventListener("resize", handleResize);

    return () => {
      kakao.maps.event.removeListener(map, "center_changed", updateCenter);
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  return { setMap };
}
