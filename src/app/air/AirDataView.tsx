import React, { useEffect, useState, useCallback } from "react"
import axios from "axios"

import { AirData } from "../../types"
import { current } from "@reduxjs/toolkit"

interface SidoItem {
  value: string
  label: string
}

type Props = {
  onBack: () => void
}

const SIDO_LIST: SidoItem[] = [
  { value: "", label: "전국" },
  { value: "서울", label: "서울" },
  { value: "부산", label: "부산" },
  { value: "대구", label: "대구" },
  { value: "인천", label: "인천" },
  { value: "광주", label: "광주" },
  { value: "대전", label: "대전" },
  { value: "울산", label: "울산" },
  { value: "경기", label: "경기" },
  { value: "제주", label: "제주" },
]

async function fetchAirData(sidoName: string | null): Promise<AirData[]> {
  try {
    const response = await axios.get("http://localhost:3000/api/air/data", {
      params: {
        sidoName: sidoName && sidoName.trim() !== "" ? sidoName : undefined,
      },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      if (status === 404) {
        return []
      }
      throw new Error(`API 요청 실패: ${status || "네트워크 오류"}`)
    }
    throw new Error("알 수 없는 오류가 발생했습니다.")
  }
}

const AirDataView: React.FC<Props> = ({ onBack }) => {
  const [selectedSido, setSelectedSido] = useState<string | null>(null)
  const [airData, setAirData] = useState<AirData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async (sido: string | null) => {
    setIsLoading(true)
    setError(null)
    try {
      const sidoToQuery = sido?.trim() === "" ? null : sido
      const data = await fetchAirData(sidoToQuery)
      setAirData(data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("알 수 없는 오류가 발생했습니다.")
      }
      setAirData([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData(selectedSido)
  }, [selectedSido, loadData])

  const handleSidoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedSido(value)
  }

  const currentSidoLabel =
    SIDO_LIST.find((item) => item.value === selectedSido)?.label || "전국"

  return (
    <div style={{ padding: "1em" }}>
      <button
        onClick={onBack}
        style={{
          marginBottom: "1em",
          padding: "0.5em 1em",
          backgroundColor: "#007bff",
          color: "white",
          border: "1px solid black",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        &larr; 현 위치 정보 보기
      </button>
      <h1>대기 정보 조회</h1>
      <label htmlFor="sido-select">시도 선택: </label>
      <select
        id="sido-select"
        onChange={handleSidoChange}
        value={selectedSido ?? ""}
      >
        {SIDO_LIST.map((item: SidoItem) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <div style={{ marginTop: "1em" }}>
        <h2>대기 정보({currentSidoLabel})</h2>
        {isLoading && <p>데이터를 불러오는 중...</p>}

        {error && <p style={{ color: "red" }}>오류: {error}</p>}

        {!isLoading && !error && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>시도명</th>
                <th>측정소명</th>
                <th>통합대기환경지수</th>
                <th>미세먼지(PM10)</th>
                <th>초미세먼지(PM2.5)</th>
                <th>측정 시간</th>
              </tr>
            </thead>
            <tbody>
              {airData.length > 0 ? (
                airData.map((item) => (
                  <tr key={item.stationName + item.dataTime}>
                    <td>{item.sidoName}</td>
                    <td>{item.stationName}</td>
                    <td>{item.khaiValue ?? "정보 없음"}</td>
                    <td>{item.pm10Value ?? "정보 없음"}</td>
                    <td>{item.pm25Value ?? "정보 없음"}</td>
                    <td>{item.dataTime ?? "정보 없음"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    {currentSidoLabel !== "전국"
                      ? `${currentSidoLabel} 지역에 조회된 데이터가 없습니다.`
                      : "조회된 데이터가 없습니다."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AirDataView
