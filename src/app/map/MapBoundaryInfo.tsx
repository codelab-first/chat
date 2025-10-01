import React from "react"

interface MapBoundaryInfoProps {
  bounds: {
    sw: { lat: number; lng: number }
    ne: { lat: number; lng: number }
  } | null
}

const MapBoundaryInfo: React.FC<MapBoundaryInfoProps> = ({ bounds }) => {
  if (!bounds) return null

  return (
    <div style={{ marginTop: "1em" }}>
      <strong>지도 경계:</strong>
      <br />
      <ul>
        <div>
          남서쪽: {bounds.sw.lat.toFixed(4)}, {bounds.sw.lng.toFixed(4)}
        </div>
        <div>
          북동쪽: {bounds.ne.lat.toFixed(4)}, {bounds.ne.lng.toFixed(4)}
        </div>
      </ul>
    </div>
  )
}

export default MapBoundaryInfo
