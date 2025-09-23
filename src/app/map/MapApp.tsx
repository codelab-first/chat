import React, { useState, useEffect, useRef } from "react"
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  useKakaoLoader,
} from "react-kakao-maps-sdk"

import useCurrentLocation from "../../hooks/useCurrentLocation"
import useMapBoundary from "./hooks/useMapBoundary"
import useMapResize from "./hooks/useMapResize"
import useVisibleMarkers from "./hooks/useVisibleMarkers"

import useKakaoApi from "./../../components/api/useKakaoApi"
import axios from "axios"

interface dbData {
  stationName: string
  dmX: number
  dmY: number
}
interface MarkerLocation {
  title: string
  latlng: { lat: number; lng: number }
  // condition: "good" | "normal" | "bad" | "terrible" | "unknown"
}

const MapApp = () => {
  const [locations, setLocations] = useState<MarkerLocation[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  const { loading: apiLoading, error: apiError } = useKakaoApi()
  const {
    position,
    address,
    loading: locationLoading,
    error: locationError,
  } = useCurrentLocation()
  const { bounds, updateBounds } = useMapBoundary()
  const { setMap, containerRef } = useMapResize()

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
    const getLocation = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/positions")
        console.log("response", response.data)

        if (Array.isArray(response.data)) {
          const mapLocations: MarkerLocation[] = response.data.map(
            (item: dbData) => ({
              title: item.stationName,
              latlng: { lat: item.dmX, lng: item.dmY },
              // condition: "unknown", // 기본값 설정
            })
          )
          setLocations(mapLocations)
        } else {
          console.error("Invalid data format: Expected an array", response.data)
          setLocations([])
        }

        setDataLoading(false)
      } catch (error) {
        console.error("Error getting data:", error)
        setDataLoading(false)
      }
    }

    getLocation()
  }, [])

  const visibleMarkers = useVisibleMarkers(locations, bounds)

  if (apiLoading || locationLoading) return <div>로딩중...</div>
  if (apiError) return <div>카카오맵 API 로딩 실패: {apiError.message}</div>

  return (
    // Map 내부에서 loading 상태를 관찰하고 있기 때문에 conditional rendering를 하지 않아도 됩니다.
    <>
      <div style={{ margin: "0.75em 0" }}>
        <strong>현재 위치: </strong> {address}
      </div>
      <div ref={containerRef}>
        <Map
          center={position}
          style={{
            width: "100%", // 지도의 크기
            height: "480px",
            position: "static",
          }}
          level={9} // 지도의 확대 레벨
          onCreate={(map) => {
            setMap(map)
            updateBounds(map)
            console.log("지도 생성 완료", map)
          }}
          onIdle={(map) => {
            updateBounds(map)
            console.log("지도 이동 완료", map)
          }}
        >
          {visibleMarkers.map((location, index) => (
            <React.Fragment key={index}>
              <MapMarker
                position={location.latlng}
                title={location.title}
                clickable={true}
                onClick={() => alert(location.title)}
                // image={
                //   {
                //     src: `marker-${location.color}.png`, // 마커이미지의 주소입니다
                //     size: { width: 24, height: 35 },
                //     options: { offset: { x: 12, y: 35 } },
                //   }
                // }
              />
              <CustomOverlayMap position={location.latlng}>
                <div
                  style={{
                    padding: "0.25em",
                    background: "white",
                    border: "1px solid #ccc",
                    borderRadius: "0.25em",
                    textAlign: "center",
                    transform: "translate(-50%, -120%)",
                  }}
                >
                  {location.title}
                </div>
              </CustomOverlayMap>
            </React.Fragment>
          ))}
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
    </>
  )
}

export default MapApp
