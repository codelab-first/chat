import React from "react"
import styled from "@emotion/styled"
import type { AirApiItem } from "../api/getAirQuality"

type Props = {
  item: AirApiItem
  favorite?: boolean
  createFavorite: () => void
  removeFavorite: () => void
}

const gradeBg = (g: number) =>
  ({
    0: "#6b7280",
    1: "#3b82f6",
    2: "#7dd3fc",
    3: "#fde047",
    4: "#f97316",
    5: "#ef4444",
  }[g] || "#6b7280")

const Card = styled.div<{ $bg: string }>`
  position: relative;
  width: 100%;
  max-width: 18rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 2px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  background: ${({ $bg }) => $bg};
  color: #fff;
`

const Star = styled.button<{ $on: boolean }>`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  font-size: 1.5rem;
  color: ${({ $on }) => ($on ? "#f59e0b" : "#9ca3af")};
  background: transparent;
  border: none;
  cursor: pointer;
`

const Title = styled.h3`
  font-weight: 700;
  font-size: 1.125rem;
  margin: 0 0 0.25rem;
`

const Metric = styled.p`
  margin: 0.125rem 0;
  font-size: 0.875rem;
`

const Status = styled.p`
  margin-top: 0.25rem;
  font-size: 0.75rem;
`

const Time = styled.div`
  margin-top: 0.25rem;
  text-align: center;
  font-size: 0.75rem;
  color: #111827;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0.25rem;
  display: inline-block;
  padding: 0.125rem 0.25rem;
`

const AirCard: React.FC<Props> = ({ item, favorite = false, createFavorite, removeFavorite }) => {
  const numericGrade = parseInt(item.pm10Grade || "0", 10) || 0

  const onStarClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    if (favorite) removeFavorite()
    else createFavorite()
  }

  const gradeLabel: Record<number, string> = {
    0: "알수없음",
    1: "좋음",
    2: "보통",
    3: "한때나쁨",
    4: "나쁨",
    5: "매우나쁨",
  }

  return (
    <Card $bg={gradeBg(numericGrade)}>
      <Star onClick={onStarClick} $on={!!favorite}>
        ★
      </Star>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          textAlign: "center",
        }}
      >
        <div>
          <Title>{item.stationName}</Title>
          <Metric>PM10: {item.pm10Value || "N/A"} ㎍/㎥</Metric>
          <Metric>PM2.5: {item.pm25Value || "N/A"} ㎍/㎥</Metric>
          <Status>{gradeLabel[numericGrade] || "알수없음"}</Status>
        </div>
        <div style={{ marginTop: ".25rem", textAlign: "center" }}>
          <Time>{item.dataTime || "N/A"} 기준</Time>
        </div>
      </div>
    </Card>
  )
}

export default AirCard
