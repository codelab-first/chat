import {useState, useEffect} from "react"
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

interface MapBounds {
  sw: { lat: number; lng: number }
  ne: { lat: number; lng: number }
}

const useGetLocations = (bounds: MapBounds | null, initialPosition: { lat: number; lng: number } | null) => {
  const [locations, setLocations] = useState<MarkerLocation[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const getLocation = async () => {
      let currentBounds = bounds;

      if (!currentBounds && initialPosition) {
        const deltaLat = 0.5;
        const deltaLng = 0.5;

        currentBounds = {
          sw: {
            lat: initialPosition.lat - deltaLat,
            lng: initialPosition.lng - deltaLng,
          },
          ne: {
            lat: initialPosition.lat + deltaLat,
            lng: initialPosition.lng + deltaLng,
          },
        };
      }

      if (!currentBounds) {
        setDataLoading(false)
        return
      }

      setDataLoading(true)
      setError(null)

      try {
        const response = await axios.get("http://localhost:3000/api/positions", {
          params: {
            sw_lat: currentBounds.sw.lat,
            sw_lng: currentBounds.sw.lng,
            ne_lat: currentBounds.ne.lat,
            ne_lng: currentBounds.ne.lng
          }
        })
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
          console.error("데이터 형식이 잘못되었습니다.", response.data)
          setLocations([])
        }
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error)
        setError(error as Error)
        setLocations([])
      } finally {
        setDataLoading(false)
      }
    }

    getLocation()
  }, [bounds, initialPosition])

  return { locations, dataLoading, error }
}

export default useGetLocations
