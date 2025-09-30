import React, { RefObject } from "react"
import { Map, MapMarker } from "react-kakao-maps-sdk"
import MapClickHandler from "./MapClickHandler"
import MapMarkerOverlay from "./mapMarkerOverlay"

interface MapBounds {
  sw: { lat: number; lng: number }
  ne: { lat: number; lng: number }
}

interface MarkerLocation {
  title: string
  latlng: { lat: number; lng: number }
}

interface Station {
  title: string
  latlng: { lat: number; lng: number }
}

interface MapDisplayProps {
  position: { lat: number; lng: number }
  address: string
  displayStation: Station | null
  bounds: MapBounds | null
  locations: MarkerLocation[]
  isLoading: boolean

  map: kakao.maps.Map | null
  setMap: React.Dispatch<React.SetStateAction<kakao.maps.Map | null>>
  containerRef: RefObject<HTMLDivElement>
  updateBounds: (map: kakao.maps.Map) => void
  setSelectedStation: React.Dispatch<React.SetStateAction<string | null>>
  refetchLocation: () => void
}

const MapDisplay: React.FC<MapDisplayProps> = (props) => {
  const {
    position,
    address,
    displayStation,
    bounds,
    locations,
    setMap,
    updateBounds,
    containerRef,
    setSelectedStation,
    refetchLocation,
  } = props

  return (
    <>
      <div style={{ margin: "0.75em 0" }}>
        <strong>현재 위치: </strong> {address}
        {displayStation && (
          <p>
            <strong>가장 가까운 측정소: </strong> {displayStation.title}
          </p>
        )}
      </div>
      <div ref={containerRef}>
        <Map
          center={position}
          style={{
            width: "100%",
            height: "480px",
            position: "static",
          }}
          level={6}
          onCreate={(mapInstance) => {
            setMap(mapInstance)
            updateBounds(mapInstance)
          }}
          onIdle={(mapInstance) => {
            updateBounds(mapInstance)
          }}
        >
          {locations.map((loc) => (
            <MapMarker
              key={loc.title}
              position={loc.latlng}
              onClick={() => setSelectedStation(loc.title)}
            />
          ))}

          <MapClickHandler
            visibleMarkers={locations}
            setSelectedStation={setSelectedStation}
          />
        </Map>
      </div>
      {bounds && (
        <div style={{ marginTop: "1em" }}>
          <strong>지도 경계:</strong>
          <br />
          <ul>
            <div>
              남서쪽: {bounds.sw.lat}, {bounds.sw.lng}
            </div>
            <div>
              북동쪽: {bounds.ne.lat}, {bounds.ne.lng}
            </div>
          </ul>
        </div>
      )}
      <div>
        <button
          style={{
            padding: "0.5em 1em",
            backgroundColor: "#007bff",
            color: "white",
            border: "1px solid black",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={refetchLocation}
        >
          현재 위치로 돌아가기
        </button>
      </div>
    </>
  )
}

export default MapDisplay
