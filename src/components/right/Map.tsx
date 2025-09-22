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
  flex:1;
`
const Map = () => {
  return (
    <Wraps>
      <MapApp />
    </Wraps>
  )
}

export default Map
