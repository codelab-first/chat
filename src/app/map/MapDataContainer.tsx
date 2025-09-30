import React, { useEffect } from "react"
import useCurrentLocation from "../../hooks/useCurrentLocation"
import useNearStation from "../../hooks/useNearStation"
import useMapBoundary from "./hooks/useMapBoundary"
import useMapResize from "./hooks/useMapResize"
import useGetLocations from "./hooks/useGetLocations"
import useKakaoApi from "./../../components/api/useKakaoApi"

import MapDisplay, {
  MarkerLocation,
  Station,
  BoundaryState,
} from "./MapDisplay"

interface MapDataContainerProps {
  setSelectedStation: React.Dispatch<React.SetStateAction<string | null>>
}

const MapDataContainer: React.FC<MapDataContainerProps> = ({
  setSelectedStation,
}) => {
  // 1. 모든 훅 호출 (MapApp.tsx에서 이동)
  const { bounds, updateBounds } = useMapBoundary()
  const {
    position,
    address,
    loading: locationLoading,
    error: locationError,
    refetchLocation, // ⭐️ useCurrentLocation에서 가져옴
  } = useCurrentLocation()

  const {
    locations,
    dataLoading,
    error: getError,
  } = useGetLocations(bounds, position)

  const { loading: apiLoading, error: apiError } = useKakaoApi()
  const currentNearestStation = useNearStation(position, locations)
  const { map, setMap, containerRef } = useMapResize()

  const displayStation = currentNearestStation

  useEffect(() => {
    if (map && position) {
      console.log("새 위치로 지도 이동:", position.lat, position.lng)
      map.panTo(
        new (window as any).kakao.maps.LatLng(position.lat, position.lng)
      )
    }
  }, [map, position])

  useEffect(() => {
    if (!displayStation?.title) return
    setSelectedStation(displayStation.title)
    console.log("가장 가까운 측정소:", displayStation.title)
  }, [displayStation, setSelectedStation])

  if (apiLoading || locationLoading) return <div>로딩중...</div>
  if (apiError) return <div>카카오맵 API 로딩 실패: {apiError}</div>
  if (locationError) return <div>위치 정보 로딩 실패: {locationError}</div>
  if (getError) return <div>측정소 데이터 로딩 실패: {getError.message}</div>

  const isLoading = dataLoading || locationLoading || apiLoading

  return (
    <MapDisplay
      position={position}
      address={address}
      displayStation={displayStation}
      bounds={bounds as BoundaryState | null}
      locations={locations as MarkerLocation[]}
      isLoading={isLoading}
      map={map}
      setMap={setMap}
      containerRef={containerRef}
      updateBounds={updateBounds}
      setSelectedStation={setSelectedStation}
      refetchLocation={refetchLocation} // ⭐️ 재조회 함수 전달
    />
  )
}

export default MapDataContainer
