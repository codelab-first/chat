import client from "./client"

const DEFAULT_PARAMS = {
  serviceKey: import.meta.env.VITE_API_KEY as string,
  returnType: "json",
  numOfRows: "100",
  pageNo: "1",
  ver: "1.3",
}

export type AirApiItem = {
  stationName: string
  pm10Value?: string
  pm25Value?: string
  pm10Grade?: string
  dataTime?: string
  [k: string]: unknown
}

export type AirApiResponse = {
  response?: {
    body?: { items?: AirApiItem[] }
  }
  [k: string]: unknown
}

export async function getAirQuality(sidoName: string): Promise<AirApiResponse> {
  if (!DEFAULT_PARAMS.serviceKey) {
    throw new Error("API 키가 없습니다. .env 확인하세요.")
  }

  const params = new URLSearchParams({
    ...DEFAULT_PARAMS,
    sidoName,
  })

  const res = await client.get(`/getCtprvnRltmMesureDnsty?${params.toString()}`)
  return res.data as AirApiResponse
}
