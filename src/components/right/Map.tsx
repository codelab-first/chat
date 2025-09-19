import React from "react"
import styled from "@emotion/styled"

import MapComponent from "../../features/map/app/MapApp"

const Wraps = styled.div`
  border: 1px solid black;
  width: 50%;
  height: 70vh;
  // display: flex;
  justify-content: center;
  align-items: center;
`
const Map = () => {
  return (
    <Wraps>
      <MapComponent />
    </Wraps>
  )
}

export default Map
