import React, { useState, useEffect } from "react"
import useNearStation from "../../../hooks/useNearStation"

type Station = { title: string } | null

interface UseStationSettingProps {
  position: { lat: number; lng: number }
  locations: any[]
  setSelectedStation: React.Dispatch<React.SetStateAction<string | null>>
}

export const useStationSetting = ({ position, locations, setSelectedStation }: UseStationSettingProps) => {
  const currentNearestStation = useNearStation(position, locations)
  const [initNearestStation, setInitNearestStation] = useState<Station | null>(null)

  const displayStation = initNearestStation || currentNearestStation

  useEffect(() => {
    if (!initNearestStation && currentNearestStation && currentNearestStation.title) {
      setInitNearestStation(currentNearestStation)
      setSelectedStation(currentNearestStation.title)
      console.log("초기 설정된 가장 가까운 측정소:", currentNearestStation.title)
    }
  }, [initNearestStation, currentNearestStation, setSelectedStation])

  useEffect(() => {
    if (!displayStation?.title) return
    setSelectedStation(displayStation.title)
    console.log("가장 가까운 측정소:", displayStation.title)
  }, [displayStation, setSelectedStation])

  return { displayStation, initNearestStation, currentNearestStation }
}