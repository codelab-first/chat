import React, {useState, useEffect} from "react";
import { useMap } from "react-kakao-maps-sdk";

interface LatLng {
  lat: number;
  lng: number;
}

const useMarkerClickHandler = () => {

  const map = useMap()
  const [center, setCenter] = useState<LatLng | null>(null);

  const handleMarkerClick = (latlng: LatLng) => {
    if (map) {
      map.panTo(new kakao.maps.LatLng(latlng.lat, latlng.lng));
    }
  }

  return { handleMarkerClick }
}

export default useMarkerClickHandler;