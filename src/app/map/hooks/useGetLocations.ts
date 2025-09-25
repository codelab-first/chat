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

const useGetLocations = (bounds: MapBounds | null) => {
  const [locations, setLocations] = useState<MarkerLocation[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

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

  return { locations, dataLoading, error }
}

export default useGetLocations
