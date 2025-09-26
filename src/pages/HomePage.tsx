import React, { useState } from "react"
import styled from "@emotion/styled"
import Chat from "../components/common/Chat_ksh"
import Air from "../components/left/Air"
import Weather from "../components/left/Weather"

import Map from "../components/right/Map"
const WrapperAll = styled.div``
const WrapperData = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2.5em;
`
const HomePage = () => {
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  return (
    <WrapperAll>
      <WrapperData>
        <Air selectedStation={selectedStation} />
        <Map setSelectedStation={setSelectedStation} />
      </WrapperData>
      <Chat />
    </WrapperAll>
  )
}

export default HomePage
