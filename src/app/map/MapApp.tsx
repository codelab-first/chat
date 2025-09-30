import React, { useState, useEffect, useRef, use } from "react"
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  useKakaoLoader,
} from "react-kakao-maps-sdk"

import useCurrentLocation from "../../hooks/useCurrentLocation"
import useNearStation from "../../hooks/useNearStation"
import useMapBoundary from "./hooks/useMapBoundary"
import useMapResize from "./hooks/useMapResize"
// import useVisibleMarkers from "./hooks/useVisibleMarkers"
import useGetLocations from "./hooks/useGetLocations"

import useKakaoApi from "./../../components/api/useKakaoApi"

import MapMarkerOverlay from "./MapMarkerOverlay"
import MapClickHandler from "./MapClickHandler"

interface MapAppProps {
  setSelectedStation: React.Dispatch<React.SetStateAction<string | null>>
}

const MapApp: React.FC<MapAppProps> = ({ setSelectedStation }) => {
  const { bounds, updateBounds } = useMapBoundary()
  const { locations, dataLoading, error: getError } = useGetLocations(bounds)
  const { loading: apiLoading, error: apiError } = useKakaoApi()
  const {
    position,
    address,
    loading: locationLoading,
    error: locationError,
  } = useCurrentLocation()

  const currentNearestStation = useNearStation(position, locations)
  const { map, setMap, containerRef } = useMapResize()

  const [initNearestStation, setInitNearestStation] = useState<
    typeof currentNearestStation | null
  >(null)

  const displayStation = initNearestStation || currentNearestStation

  // const nearestStation = useNearStation(currentNearestStation, locations)

  // const locations = [
  //   {
  //     title: "서울",
  //     latlng: {
  //       lat: import.meta.env.VITE_DEFAULT_LATITUDE,
  //       lng: import.meta.env.VITE_DEFAULT_LONGITUDE,
  //     },
  //   },
  // ]

  useEffect(() => {
    if (
      !initNearestStation &&
      currentNearestStation &&
      currentNearestStation.title
    ) {
      setInitNearestStation(currentNearestStation)
      setSelectedStation(currentNearestStation.title)
      console.log("초기 가장 가까운 측정소:", currentNearestStation.title)
    }

    if (displayStation && displayStation.title) {
      setSelectedStation(displayStation.title)
      console.log("가장 가까운 측정소:", displayStation.title)
    }
  }, [
    displayStation,
    initNearestStation,
    currentNearestStation,
    setSelectedStation,
  ])

  // const visibleMarkers = useVisibleMarkers(locations, bounds)

  if (apiLoading || locationLoading) return <div>로딩중...</div>
  if (apiError) return <div>카카오맵 API 로딩 실패: {apiError.message}</div>

  return (
    // Map 내부에서 loading 상태를 관찰하고 있기 때문에 conditional rendering를 하지 않아도 됩니다.
    <>
      <div style={{ margin: "0.75em 0" }}>
        <strong>현재 위치: </strong> {address}
        {displayStation && (
          <p>
            <strong>가장 가까운 측정소: </strong> {displayStation.title}
          </p>
        )}
      </div>
      <div ref={containerRef}>
        <Map
          center={position}
          style={{
            width: "100%", // 지도의 크기
            height: "480px",
            position: "static",
          }}
          level={6} // 지도의 확대 레벨
          onCreate={(mapInstance) => {
            setMap(mapInstance)
            updateBounds(mapInstance)
            // setMapCenter({
            //   lat: map.getCenter().getLat(),
            //   lng: map.getCenter().getLng(),
            // })
            console.log("지도 생성 완료", mapInstance)
          }}
          onIdle={(mapInstance) => {
            updateBounds(mapInstance)
            // const newCenter = {
            //   lat: map.getCenter().getLat(),
            //   lng: map.getCenter().getLng(),
            // }
            // if (
            //   !mapCenter ||
            //   mapCenter.lat !== newCenter.lat ||
            //   mapCenter.lng !== newCenter.lng
            // ) {
            //   setMapCenter(newCenter)
            // }
            console.log("지도 이동 완료", mapInstance)
          }}
        >
          <MapClickHandler
            visibleMarkers={locations}
            setSelectedStation={setSelectedStation}
          />
        </Map>
      </div>
      {bounds && (
        <div style={{ marginTop: "1em" }}>
          <strong>지도 경계:</strong>
          <br />
          <ul>
            <div>
              남서쪽: {bounds.sw.lat}, {bounds.sw.lng}
            </div>
            <div>
              북동쪽: {bounds.ne.lat}, {bounds.ne.lng}
            </div>
          </ul>
        </div>
      )}
      <div>
        <button
          style={{
            padding: "0.5em 1em",
            backgroundColor: "#007bff",
            color: "white",
            border: "1px solid black",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => {
            console.log("현재 위치로 이동")
            if (map && position) {
              map.panTo(new (window as any).kakao.maps.LatLng(position))
            }
          }}
        >
          현재 위치로 돌아가기
        </button>
      </div>
    </>
  )
}

export default MapApp
