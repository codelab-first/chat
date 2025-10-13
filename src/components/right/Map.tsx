import React from "react"
import styled from "@emotion/styled"

import MapApp from "../../app/map/MapApp"

const Wraps = styled.div`
  border-radius:12px;
  background:white;
  height: 70vh;

  flex: 1;
  @media (max-width:860px){
    position:fixed;
    top:0;
    width:100%;
    }
`

interface MapProps {
  setSelectedStation: React.Dispatch<React.SetStateAction<string | null>>
  , screenMode: boolean
}

const Map = ({ setSelectedStation, screenMode }: MapProps) => {
  return (
    <Wraps>
      <MapApp setSelectedStation={setSelectedStation} screenMode={screenMode} />
    </Wraps>
  )
}

export default Map
