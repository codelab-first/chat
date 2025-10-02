import React from "react"
import styled from "@emotion/styled"

import MapApp from "../../app/map/MapApp"

const Wraps = styled.div`
  border: 1px solid black;
  height: 70vh;
  justify-content: center;
  align-items: center;
  flex: 1;
  @media (max-width:860px){
    border:none;
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
