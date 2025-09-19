import { useQuery } from "@tanstack/react-query"
import { getAirQuality, type AirApiResponse } from "../../../app/air/api/getAirQuality"

export const useAirQuality = (sidoName: string) =>
  useQuery<AirApiResponse>({
    queryKey: ["airQuality", sidoName],
    queryFn: () => getAirQuality(sidoName),
    enabled: !!sidoName,
    retry: 1,
  })
