import { createContext, useState, ReactNode } from "react"



interface LocalAirData {
  stationName: string
  pm10Grade: number | null
  pm25Grade: number | null
  khaiGrade: number | null
  so2Grade: number | null
  o3Grade: number | null
  no2Grade: number | null
  coGrade: number | null
  pm10Value: number | null
  pm25Value: number | null
  khaiValue: number | null
  so2Value: number | null
  o3Value: number | null
  no2Value: number | null
  coValue: number | null
  dataTime: string
  sidoName: string
}
interface AirDataContextType {
  airDatas: number;
  setAirDatas: React.Dispatch<React.SetStateAction<number>>;
  airLocal: string;
  setAirLocal: React.Dispatch<React.SetStateAction<string>>;
  region: string;
  setRegion: React.Dispatch<React.SetStateAction<string>>;
  setLocalAirData: React.Dispatch<React.SetStateAction<LocalAirData | null>>;
  localAirData: LocalAirData | null

}


export const AirDataContext = createContext<AirDataContextType>({
  airDatas: 0,
  setAirDatas: () => { },
  airLocal: '',
  setAirLocal: () => { },
  region: '',
  setRegion: () => { },
  setLocalAirData: () => { },
  localAirData: null

});

export default function AirDataProvider({ children }: { children: ReactNode }) {
  const [airDatas, setAirDatas] = useState(1)
  const [airLocal, setAirLocal] = useState('')
  const [region, setRegion] = useState('')
  const [localAirData, setLocalAirData] = useState<LocalAirData | null>(null)
  return (
    <AirDataContext.Provider
      value={{ airDatas, setAirDatas, airLocal, setAirLocal, region, setRegion, setLocalAirData, localAirData }}
    >{children}
    </AirDataContext.Provider>
  )
}
