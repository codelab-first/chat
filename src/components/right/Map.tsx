import React from "react"
import styled from "@emotion/styled"

import MapApp from "../../app/map/MapApp"

const Wraps = styled.div`
  border: 1px solid black;
  width: 50%;
  height: 70vh;
  // display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`

interface MapProps {
  setSelectedStation: React.Dispatch<React.SetStateAction<string | null>>
}

const Map = ({ setSelectedStation }: MapProps) => {
  return (
    <Wraps>
      <MapApp setSelectedStation={setSelectedStation} />
    </Wraps>
  )
}

export default Map
