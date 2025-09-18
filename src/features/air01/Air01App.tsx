import React, { useMemo, useState } from "react"
import styled from "@emotion/styled"
import { useAirQuality } from "./hooks/useAirQuality"
import AirCard from "./components/AirCard"
import type { AirApiItem } from "./api/getAirQuality"

const Wrap = styled.div`
  padding: 12px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
`

const Bar = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`

const Title = styled.h1`
  font-weight: 700;
  font-size: 1.5rem;
  text-align: center;
  color: #1f2937;
  margin: 0 0 1rem;
`

const Select = styled.select`
  width: 100%;
  max-width: 18rem;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
`

const FavBtn = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: #111827;
  color: #fff;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`

const Empty = styled.p`
  text-align: center;
  color: #6b7280;
  margin-top: 1rem;
`

const SIDO_LIST = [
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

export default function Air01App() {
  const [sidoName, setSidoName] = useState("서울")
  const { data, isPending, error } = useAirQuality(sidoName)

  const [favorites, setFavorites] = useState<Map<string, AirApiItem>>(new Map())
  const [showFavorites, setShowFavorites] = useState(false)

  const items: AirApiItem[] = useMemo(() => data?.response?.body?.items ?? [], [data])

  const addFavorite = (item: AirApiItem) => {
    setFavorites((prev) => {
      const next = new Map(prev)
      next.set(item.stationName, item)
      return next
    })
  }

  const removeFavorite = (station: string) => {
    setFavorites((prev) => {
      const next = new Map(prev)
      next.delete(station)
      return next
    })
  }

  const isFav = (station: string) => favorites.has(station)

  if (isPending) return <div style={{ textAlign: "center", padding: "2.5rem" }}>로딩 중...</div>
  if (error)
    return (
      <div style={{ color: "#ef4444", textAlign: "center", padding: "2.5rem" }}>
        에러: {(error as any)?.message || "데이터 로드 실패"}
      </div>
    )

  return (
    <Wrap>
      <Title>대기오염 정보</Title>

      <Bar>
        <Select value={sidoName} onChange={(e) => setSidoName(e.target.value)}>
          {SIDO_LIST.map((sido) => (
            <option key={sido.value} value={sido.value}>
              {sido.label}
            </option>
          ))}
        </Select>

        <FavBtn onClick={() => setShowFavorites((v) => !v)}>{showFavorites ? "즐겨찾기 닫기" : "즐겨찾기 보기"}</FavBtn>
      </Bar>

      {showFavorites && (
        <>
          <h2
            style={{
              fontWeight: 700,
              fontSize: "1rem",
              margin: ".25rem 0  .5rem",
              color: "#374151",
              textAlign: "center",
            }}
          >
            즐겨찾기
          </h2>
          {favorites.size === 0 ? (
            <Empty>즐겨찾기된 항목이 없습니다.</Empty>
          ) : (
            <Grid>
              {Array.from(favorites.values()).map((fav) => (
                <div key={fav.stationName} style={{ display: "flex", justifyContent: "center" }}>
                  <AirCard
                    item={fav}
                    favorite={true}
                    createFavorite={() => addFavorite(fav)}
                    removeFavorite={() => removeFavorite(fav.stationName)}
                  />
                </div>
              ))}
            </Grid>
          )}
          <hr style={{ margin: "1rem 0", opacity: 0.2 }} />
        </>
      )}

      <Grid>
        {items.map((item) => (
          <div key={item.stationName} style={{ display: "flex", justifyContent: "center" }}>
            <AirCard
              item={item}
              favorite={isFav(item.stationName)}
              createFavorite={() => addFavorite(item)}
              removeFavorite={() => removeFavorite(item.stationName)}
            />
          </div>
        ))}
      </Grid>

      {items.length === 0 && <Empty>데이터가 없습니다.</Empty>}
    </Wrap>
  )
}
