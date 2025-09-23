import React from "react"
import { MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk"

interface LatLng {
  lat: number
  lng: number
}

interface MarkerLocation {
  title: string
  latlng: LatLng
  // condition: "good" | "normal" | "bad" | "terrible" | "unknown";
}

interface MapMarkerOverlayProps {
  visibleMarkers: MarkerLocation[]
  onMarkerClick: (latlng: LatLng) => void
}

const MapMarkerOverlay: React.FC<MapMarkerOverlayProps> = ({
  visibleMarkers,
  onMarkerClick,
}) => {
  return (
    <>
      {visibleMarkers.map((marker, index) => (
        <React.Fragment key={index}>
          <MapMarker
            position={marker.latlng}
            title={marker.title}
            clickable={true}
            onClick={() => {
              onMarkerClick(marker.latlng)
            }}
            // image={
            //   {
            //     src: `marker-${marker.color}.png`,
            //     size: { width: 24, height: 35 },
            //     options: { offset: { x: 12, y: 35 } },
            //   }
            // }
          />
          <CustomOverlayMap position={marker.latlng}>
            <div
              style={{
                padding: "0.25em",
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "0.25em",
                textAlign: "center",
                transform: "translate(-50%, -120%)",
              }}
            >
              {marker.title}
            </div>
          </CustomOverlayMap>
        </React.Fragment>
      ))}
    </>
  )
}

export default MapMarkerOverlay
