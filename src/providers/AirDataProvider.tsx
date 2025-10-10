import { createContext, useState, ReactNode } from "react"



interface AirDataContextType {
  airDatas: number;
  setAirDatas: React.Dispatch<React.SetStateAction<number>>;
  airLocal: string;
  setAirLocal: React.Dispatch<React.SetStateAction<string>>;
  region: string;
  setRegion: React.Dispatch<React.SetStateAction<string>>;

}



export const AirDataContext = createContext<AirDataContextType>({
  airDatas: 0,
  setAirDatas: () => { },
  airLocal: '',
  setAirLocal: () => { },
  region: '',
  setRegion: () => { }

});

export default function AirDataProvider({ children }: { children: ReactNode }) {
  const [airDatas, setAirDatas] = useState(1)
  const [airLocal, setAirLocal] = useState('')
  const [region, setRegion] = useState('')
  return (
    <AirDataContext.Provider
      value={{ airDatas, setAirDatas, airLocal, setAirLocal, region, setRegion }}
    >{children}
    </AirDataContext.Provider>
  )
}
