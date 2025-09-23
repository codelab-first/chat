import React, { useState, useEffect } from "react"
import useMarkerClickHandler from "./hooks/useMarkerClickHandler"
import MapMarkerOverlay from "./mapMarkerOverlay"

interface LatLng {
  lat: number
  lng: number
}

interface MarkerLocation {
  title: string
  latlng: LatLng
  // condition: "good" | "normal" | "bad" | "terrible" | "unknown";
}

interface MapClickHandlerProps {
  visibleMarkers: MarkerLocation[]
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({
  visibleMarkers,
}) => {
  const { handleMarkerClick } = useMarkerClickHandler()

  return (
    <MapMarkerOverlay
      visibleMarkers={visibleMarkers}
      onMarkerClick={handleMarkerClick}
    />
  )
}

export default MapClickHandler
