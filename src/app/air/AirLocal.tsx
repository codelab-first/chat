import React, { useState, useEffect } from "react"
import useCurrentLocation from "../../hooks/useCurrentLocation"
import axios from "axios"
import { getGradeText, getGradeColor } from "../../utils/getGrade"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSmile,
  faMeh,
  faSadTear,
  faAngry,
} from "@fortawesome/free-solid-svg-icons"

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

// 통합대기환경지수에 맞는 아이콘을 반환하는 함수
function getKhaiGradeIcon(grade: number | null) {
  const style = { fontSize: "64px" } // 아이콘 크기 직접 조절

  switch (grade) {
    case 1:
      return <FontAwesomeIcon icon={faSmile} color="green" style={style} />
    case 2:
      return <FontAwesomeIcon icon={faMeh} color="goldenrod" style={style} />
    case 3:
      return <FontAwesomeIcon icon={faSadTear} color="orange" style={style} />
    case 4:
      return <FontAwesomeIcon icon={faAngry} color="red" style={style} />
    default:
      return <FontAwesomeIcon icon={faMeh} color="gray" style={style} />
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
  coGrade: number | null
  pm10Value: number | null
  pm25Value: number | null
  khaiValue: number | null
  so2Value: number | null
  o3Value: number | null
  no2Value: number | null
  coValue: number | null
  dataTime: string
  sidoName: string
}

type Props = {
  onShowApp?: () => void
  selectedStation: string | null
}

export default function AirLocal({ onShowApp, selectedStation }: Props) {
  const { region } = useCurrentLocation()
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
          <h3>선택된 측정소: {airData?.stationName}</h3>
          <p>
            <strong>통합대기환경지수: </strong>
            <span style={{ color: getGradeColor(airData.khaiGrade) }}>
              {getGradeText(airData.khaiGrade) ?? "정보 없음"}
            </span>
            <span> {airData?.khaiValue}</span>
          </p>
          <p>
            <strong>미세먼지 (PM10): </strong>
            <span style={{ color: getGradeColor(airData.pm10Grade) }}>
              {getGradeText(airData.pm10Grade) ?? "정보 없음"}
            </span>
            <span> {airData?.pm10Value}</span>
          </p>
          <p>
            <strong>초미세먼지 (PM2.5): </strong>
            <span style={{ color: getGradeColor(airData.pm25Grade) }}>
              {getGradeText(airData.pm25Grade) ?? "정보 없음"}
            </span>
            <span> {airData?.pm25Value}</span>
          </p>
          <p>
            <strong>오존 (O3): </strong>
            <span style={{ color: getGradeColor(airData.o3Grade) }}>
              {getGradeText(airData.o3Grade) ?? "정보 없음"}
            </span>
            <span> {airData?.o3Value}</span>
          </p>
          <p>
            <strong>이산화질소 (NO2): </strong>
            <span style={{ color: getGradeColor(airData.no2Grade) }}>
              {getGradeText(airData.no2Grade) ?? "정보 없음"}
            </span>
            <span> {airData?.no2Value}</span>
          </p>
          <p>
            <strong>일산화탄소 (CO): </strong>
            <span style={{ color: getGradeColor(airData.coGrade) }}>
              {getGradeText(airData.coGrade) ?? "정보 없음"}
            </span>
            <span> {airData?.coValue}</span>
          </p>
          <p>
            <strong>아황산가스 (SO2): </strong>
            <span style={{ color: getGradeColor(airData.so2Grade) }}>
              {getGradeText(airData.so2Grade) ?? "정보 없음"}
            </span>
            <span> {airData?.so2Value}</span>
          </p>
          {/* 통합대기환경지수에 따른 아이콘 추가 */}
          <div style={{ marginTop: "1em", textAlign: "center" }}>
            {getKhaiGradeIcon(airData.khaiGrade)}
          </div>
        </div>
      )}
    </>
  )
}
