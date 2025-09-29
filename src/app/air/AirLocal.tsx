import React, { useState, useEffect, use } from "react"
import useCurrentLocation from "../../hooks/useCurrentLocation"
import axios from "axios"

function getKhaiGradeColor(grade: number | null): string {
  switch (grade) {
    case 1:
      return "#E8F5E9" // 초록 (좋음)
    case 2:
      return "#FFFDE7" // 노랑 (보통)
    case 3:
      return "#FFF3E0" // 주황 (나쁨)
    case 4:
      return "#FFEBEE" // 빨강 (매우 나쁨)
    default:
      return "#F5F5F5" // 회색 (정보 없음)
  }
}
interface AirData {
  stationName: string
  pm10Grade: number | null
  pm25Grade: number | null
  khaiGrade: number | null
  so2Grade: number | null
  o3Grade: number | null
  no2Grade: number | null
  dataTime: string
  sidoName: string
}

type Props = {
  onShowApp?: () => void
  selectedStation: string | null
}

export default function AirLocal({ onShowApp, selectedStation }: Props) {
  const { position, address, region } = useCurrentLocation()
  const [airData, setAirData] = useState<AirData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getAirData = async () => {
      if (selectedStation) {
        setLoading(true)
        setError(null)
        try {
          const response = await axios.get(
            `http://localhost:3000/api/air?stationName=${selectedStation}`
          )
          setAirData(response.data)
        } catch (err) {
          setError("대기 정보를 불러오는 중 오류가 발생했습니다.")
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
    }

    getAirData()
  }, [selectedStation])

  return (
    <>
      <div
        style={{
          padding: "1em",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>현재 지역 정보</h2>
        <p>
          <strong>현재 지역: </strong> {region}
        </p>
        {onShowApp && (
          <button
            onClick={() => onShowApp()}
            style={{
              minWidth: "64px",
              padding: "0.5em 1em",
              backgroundColor: "#007bff",
              color: "white",
              border: "1px solid black",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            전체 대기 상태 보기
          </button>
        )}
      </div>
      {loading && <p>대기 정보 로딩 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {airData && (
        <div
          style={{
            backgroundColor: getKhaiGradeColor(airData.khaiGrade),
            padding: "1em",
            borderRadius: "8px",
            marginTop: "1em",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3>선택된 측정소: {airData.stationName}</h3>
          <p>
            <strong>통합대기환경지수:</strong>{" "}
            {airData.khaiGrade ?? "정보 없음"}
          </p>
          <p>
            <strong>미세먼지 (PM10):</strong>{" "}
            {airData.pm10Grade ?? "정보 없음"}
          </p>
          <p>
            <strong>초미세먼지 (PM2.5):</strong>{" "}
            {airData.pm25Grade ?? "정보 없음"}
          </p>
          <p>
            <strong>측정 시간:</strong>{" "}
            {new Date(airData.dataTime).toLocaleString()}
          </p>
        </div>
      )}
    </>
  )
}
