import { createContext, useState, ReactNode } from "react"



interface AirDataContextType {
  airDatas: number;
  setAirDatas: React.Dispatch<React.SetStateAction<number>>;

}



export const AirDataContext = createContext<AirDataContextType>({
  airDatas: 0,
  setAirDatas: () => { },

});

export default function AirDataProvider({ children }: { children: ReactNode }) {
  const [airDatas, setAirDatas] = useState(1)

  return (
    <AirDataContext.Provider
      value={{ airDatas, setAirDatas }}
    >{children}
    </AirDataContext.Provider>
  )
}
