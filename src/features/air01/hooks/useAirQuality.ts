import { useQuery } from "@tanstack/react-query"
import { getAirQuality, type AirApiResponse } from "../api/getAirQuality"

export const useAirQuality = (sidoName: string) =>
  useQuery<AirApiResponse>({
    queryKey: ["airQuality", sidoName],
    queryFn: () => getAirQuality(sidoName),
    enabled: !!sidoName,
    retry: 1,
  })
