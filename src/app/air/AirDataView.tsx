import React, { useEffect, useState, useCallback, useContext } from "react"
import axios from "axios"
import { AirData } from "../../types"
import { AirDataContext } from "../../providers/AirDataProvider"

interface SidoItem {
  value: string
  label: string
}

type Props = {
  onBack: () => void
}

function getCardBackgroundColor(khaiValue?: string): string {
  const value = parseInt(khaiValue || "")
  if (isNaN(value)) return "#E0E0E0" // 정보 없음
  if (value <= 50) return "#4CAF50"  // 좋음 (초록)
  if (value <= 100) return "#FFEB3B" // 보통 (노랑)
  if (value <= 150) return "#FF9800" // 나쁨 (주황)
  return "#F44336"                   // 매우나쁨 (빨강)
}

const SIDO_LIST: SidoItem[] = [
  { value: "", label: "전국" },
  { value: "서울", label: "서울" },
  { value: "부산", label: "부산" },
  { value: "충남", label: "충남" },
  { value: "충북", label: "충북" },
  { value: "세종", label: "세종" },
  { value: "대구", label: "대구" },
  { value: "인천", label: "인천" },
  { value: "광주", label: "광주" },
  { value: "대전", label: "대전" },
  { value: "울산", label: "울산" },
  { value: "경기", label: "경기" },
  { value: "경남", label: "경남" },
  { value: "경북", label: "경북" },
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
  const { region, airLocal } = useContext(AirDataContext)
  const [selectedSido, setSelectedSido] = useState<string | null>(null)
  const [airData, setAirData] = useState<AirData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  // 여러 카드를 펼치기 위해 Set 상태로 변경
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const loadData = useCallback(async (sido: string | null) => {
    setIsLoading(true)
    setError(null)
    try {
      const sidoToQuery = sido?.trim() === "" ? null : sido
      const data = await fetchAirData(sidoToQuery)

      // if (data) {
      //   const currData = newAirData(data)
      //   console.log('sido', data, 'airLocal', airLocal)
      //   console.log('currData', currData)
      //   if (currData)
      setAirData(data)
      // }

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
    loadData(region)

  }, [region])

  // useEffect(() => {


  //   const nextData = airData.filter(data => data.stationName === airLocal)
  //   console.log(nextData)
  //   // loadData(region)

  // }, [airLocal])




  const handleSidoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedSido(value)
  }

  const toggleCard = (cardId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId) // 펼쳐진 상태면 닫기
      } else {
        newSet.add(cardId)    // 아니면 펼치기
      }
      return newSet
    })
  }

  const currentSidoLabel =
    SIDO_LIST.find((item) => item.value === selectedSido)?.label || "전국"



  return (
    <div style={{ padding: "1em" }}>
      {/* 상단 고정 영역 */}
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          padding: "1em 0",
          zIndex: 1,
          borderBottom: "1px solid #ccc",
        }}
      >
        {/* <button
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
        </button> */}

        {/* <div style={{ textAlign: 'center' }}>
          <select
            id="sido-select"
            onChange={handleSidoChange}
            value={region ?? ""}
          >
            {SIDO_LIST.map((item: SidoItem) => (
              <option key={item.value} value={item.value}>
                {item.value}
              </option>
            ))}
          </select>
          <div>
            {region}의 총 관측소 수: {airData.length}
          </div>
        </div> */}
        {/* <p>↑눌러서 시/도변경</p> */}
        <h2 style={{ marginBottom: '1em', textAlign: 'center' }}>{region} 대기 정보 (총 {airData.length}개소)</h2>
      </div>

      <div style={{ marginTop: "1em", textAlign: 'center' }}>

        {isLoading && <p>데이터를 불러오는 중...</p>}

        {error && <p style={{ color: "red" }}>오류: {error}</p>}

        {!isLoading && !error && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1em",
              justifyContent: 'center',
              alignItems: "flex-start",
            }}
          >

            {airData.length > 0 ? (

              airData.map((item) => {
                const cardId = item.stationName + item.dataTime
                // const isExpanded = expandedCards.has(cardId)
                const isExpanded = item.stationName === airLocal || expandedCards.has(cardId)

                return (
                  <div
                    key={cardId}
                    onClick={() => toggleCard(cardId)}
                    style={{

                      order: isExpanded ? 0 : 1,
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "1em",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      maxWidth: "200px",
                      minWidth: "180px",
                      backgroundColor: getCardBackgroundColor(item.khaiValue),
                      color: "#000",
                      cursor: "pointer",
                      transition: "all 0.3s",

                    }}
                  >
                    <h3 style={{ marginTop: 0 }}>
                      {item.sidoName} {item.stationName}
                    </h3>

                    {isExpanded && (
                      <div style={{ marginTop: "0.5em" }}>
                        <p><strong>통합지수:</strong> {item.khaiValue ?? "정보 없음"}</p>
                        <p><strong>PM10:</strong> {item.pm10Value ?? "정보 없음"} μg/m³</p>
                        <p><strong>PM2.5:</strong> {item.pm25Value ?? "정보 없음"} μg/m³</p>
                        <p><strong>이산화황 (SO₂):</strong> {item.so2Value} ppm</p>
                        <p><strong>오존 (O₃):</strong> {item.o3Value} ppm</p>
                        <p><strong>이산화질소 (NO₂):</strong> {item.no2Value} ppm</p>
                        <p><strong>일산화탄소 (CO):</strong> {item.coValue} ppm</p>
                        <p><strong>측정시간:</strong> {item.dataTime ?? "정보 없음"}</p>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <p>
                {currentSidoLabel !== "전국"
                  ? `${currentSidoLabel} 지역에 조회된 데이터가 없습니다.`
                  : "조회된 데이터가 없습니다."}
              </p>
            )}
          </div>
        )}
      </div>
    </div >
  )
}

export default AirDataView
