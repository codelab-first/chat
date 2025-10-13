import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react"
import styled from "@emotion/styled"

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
import { AirDataContext } from "../../providers/AirDataProvider"

interface MapAppProps {
  setSelectedStation: React.Dispatch<React.SetStateAction<string | null>>
  screenMode: boolean
}

const MapApp: React.FC<MapAppProps> = ({ setSelectedStation, screenMode }) => {
  const { bounds, updateBounds } = useMapBoundary()
  const {
    position,
    address,
    loading: locationLoading,
    error: locationError,
    refetch,
  } = useCurrentLocation()
  const {
    locations,
    dataLoading,
    error: getError,
  } = useGetLocations(bounds, position)

  const { loading: apiLoading, error: apiError } = useKakaoApi()

  const currentNearestStation = useNearStation(position, locations)
  const { map, setMap, containerRef } = useMapResize()

  const [initNearestStation, setInitNearestStation] = useState<
    typeof currentNearestStation | null
  >(null)

  const [isManuallySelected, setIsManuallySelected] = useState(false)

  const mapCenterRef = useRef<kakao.maps.LatLng | null>(null)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  // const [isResizing, setIsResizing] = useState(false)
  const isProgrammaticMove = useRef(false)

  const displayStation = initNearestStation || currentNearestStation
  const { setAirLocal, setStationAddress } = useContext(AirDataContext)

  const getStationAddress = useCallback(
    async (stationName: string, position: { lat: number; lng: number }) => {
      if (window.kakao && window.kakao.maps.services) {
        const geocoder = new (window as any).kakao.maps.services.Geocoder()

        const selectedLocation = locations.find(
          (loc) => loc.title === stationName
        )
        if (selectedLocation) {
          geocoder.coord2Address(
            selectedLocation.latlng.lng,
            selectedLocation.latlng.lat,
            (result: any, status: any) => {
              if (status === (window as any).kakao.maps.services.Status.OK) {
                const region = result[0].address
                if (region) {
                  const {
                    region_1depth_name: city,
                    region_2depth_name: district,
                    region_3depth_name: town,
                  } = region
                  const stationAddress = `${city} ${district} ${town || ""}`
                  setStationAddress(stationAddress.trim())
                }
              }
            }
          )
        }
      }
    },
    [locations, setStationAddress]
  )
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
      currentNearestStation.title &&
      !isManuallySelected
    ) {
      setInitNearestStation(currentNearestStation)
      setSelectedStation(currentNearestStation.title)
      setAirLocal(currentNearestStation.title)
      // setRegion()
      getStationAddress(
        currentNearestStation.title,
        currentNearestStation.latlng
      )

      console.log("초기 가장 가까운 측정소:", currentNearestStation.title)
    }
  }, [
    currentNearestStation,
    initNearestStation,
    isManuallySelected,
    setSelectedStation,
    getStationAddress,
  ])

  useEffect(() => {
    if (isManuallySelected) return
    if (!displayStation?.title) return

    setSelectedStation(displayStation.title)

    console.log("가장 가까운 측정소:", displayStation.title)
  }, [displayStation?.title, isManuallySelected, setSelectedStation])

  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width

        if (containerWidth === null) {
          setContainerWidth(newWidth)
          return
        }

        if (containerWidth !== newWidth && map && mapCenter) {
          isProgrammaticMove.current = true
          if (map && mapCenter) {
            map.setCenter(
              new (window as any).kakao.maps.LatLng(
                mapCenterRef.current?.getLat() ||
                  import.meta.env.VITE_DEFAULT_LATITUDE,
                mapCenterRef.current?.getLng() ||
                  import.meta.env.VITE_DEFAULT_LONGITUDE
              )
            )
          }
        }
        setContainerWidth(newWidth)
      }
    })
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [containerRef, containerWidth, map])

  const handleMarkerClick = useCallback(
    (stationName: string) => {
      setIsManuallySelected(true)
      setSelectedStation(stationName)
      setAirLocal(stationName)

      const selectedLocation = locations.find(
        (loc) => loc.title === stationName
      )
      if (selectedLocation && map) {
        getStationAddress(stationName, selectedLocation.latlng)
      }
    },
    [setSelectedStation]
  )

  const handleReturnToCurrentLocation = useCallback(() => {
    console.log("현재 위치로 돌아가기")
    refetch()

    setIsManuallySelected(false)

    if (map && position) {
      isProgrammaticMove.current = true
      map.panTo(
        new (window as any).kakao.maps.LatLng(position.lat, position.lng)
      )
      mapCenterRef.current = { lat: position.lat, lng: position.lng }
    }

    const stationToSelect =
      initNearestStation?.title || currentNearestStation?.title
    if (stationToSelect) {
      setSelectedStation(stationToSelect)

      const stationLocation = initNearestStation || currentNearestStation
      if (stationLocation && map) {
        getStationAddress(stationToSelect, stationLocation.latlng)
      }
      console.log("선택된 측정소:", stationToSelect)
    }
  }, [
    refetch,
    map,
    position,
    initNearestStation,
    currentNearestStation,
    setSelectedStation,
    getStationAddress,
  ])

  // const visibleMarkers = useVisibleMarkers(locations, bounds)

  // useEffect(() => {
  //   if (currentNearestStation) {

  //     setAirLocal(currentNearestStation.title)
  //   }
  // }, [])
  if (apiLoading || locationLoading) return <div>로딩중...</div>
  if (apiError) return <div>카카오맵 API 로딩 실패: {apiError.message}</div>

  return (
    // Map 내부에서 loading 상태를 관찰하고 있기 때문에 conditional rendering를 하지 않아도 됩니다.
    <>
      {/* <div style={{ margin: "0.75em 0" }}>
        {!screenMode && (
          <>
            <strong>현재 위치: </strong> {address}
            {displayStation && (
              <p>
                <strong>가장 가까운 측정소: </strong> {displayStation.title}
              </p>
            )}
          </>
        )}
      </div> */}
      <div ref={containerRef}>
        <Map
          center={position}
          style={{
            width: "100%", // 지도의 크기
            height: "70vh",
          }}
          level={6} // 지도의 확대 레벨
          onCreate={(mapInstance) => {
            setMap(mapInstance)
            updateBounds(mapInstance)
            // updateBounds(mapInstance)
            // setMapCenter({
            //   lat: map.getCenter().getLat(),
            //   lng: map.getCenter().getLng(),
            // })
            const center = mapInstance.getCenter()
            mapCenterRef.current = {
              lat: center.getLat(),
              lng: center.getLng(),
            }

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
            if (!isProgrammaticMove.current) {
              const center = mapInstance.getCenter()
              const newCenter = { lat: center.getLat(), lng: center.getLng() }

              // ref로 직접 비교하고 업데이트
              if (
                !mapCenterRef.current ||
                mapCenterRef.current.lat !== newCenter.lat ||
                mapCenterRef.current.lng !== newCenter.lng
              ) {
                mapCenterRef.current = newCenter
              }
            } else {
              isProgrammaticMove.current = false
            }

            console.log("지도 이동 완료", mapInstance)
          }}
        >
          <MapClickHandler
            visibleMarkers={locations}
            setSelectedStation={handleMarkerClick}
          />
        </Map>
      </div>
      {/* {!screenMode && (
        <>
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
            {!screenMode && (
              <button
                style={{
                  padding: "0.5em 1em",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "1px solid black",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={handleReturnToCurrentLocation}
              >
                현재 위치로 돌아가기
              </button>
            )}
          </div>
        </>
      )} */}
    </>
  )
}

export default MapApp
