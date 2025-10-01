import React from "react"

interface MapControlsProps {
  address: string
  displayStation: { title: string } | null | undefined
  onBackToCurrentLocation: () => void
}

const MapControls: React.FC<MapControlsProps> = ({
  address,
  displayStation,
  onBackToCurrentLocation,
}) => {
  return (
    <div>
      <div style={{ margin: "0.75em, 0" }}>
        <strong>현재 위치: </strong> {address}
        {displayStation && (
          <p>
            <strong>가장 가까운 측정소: </strong> {displayStation.title}
          </p>
        )}
      </div>
      <button
        style={{
          padding: "0.5em 1em",
          backgroundColor: "#007bff",
          color: "white",
          border: "1px solid black",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={onBackToCurrentLocation}
      >
        현재 위치로 돌아가기
      </button>
    </div>
  )
}

export default MapControls
