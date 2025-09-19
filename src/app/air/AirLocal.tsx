import React from "react"
import useCurrentLocation from "../../hooks/useCurrentLocation"

type Props = {
  onShowApp?: () => void
}

export default function AirLocal({ onShowApp }: Props) {
  const { position, address } = useCurrentLocation()

  return (
    <div
      style={{
        padding: "1em",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h2>현재 지역 정보</h2>
        <p>대기질 정보와 관련된 현재 위치 정보를 표시합니다.</p>
        <p>
          <strong>현재 위치: </strong> {address}
        </p>
      </div>
      {onShowApp && (
        <button
          onClick={() => {
            onShowApp()
          }}
          style={{
            padding: "0.5em 1em",
            backgroundColor: "#007bff",
            color: "white",
            border: "1px solid black",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          전체 지역 보기
        </button>
      )}
    </div>
  )
}
