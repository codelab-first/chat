import styled from "@emotion/styled"
import Chat from "../components/common/Chat_ksh"
import Air from "../components/left/Air"
import Weather from "../components/left/Weather"

import Map from "../components/right/Map"
const WrapperAll = styled.div`

`
const WrapperData = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2.5em;
`
const HomePage = () => {
  return (
    <WrapperAll>
      <WrapperData>
        <Air />
        <Map />
      </WrapperData>
      <Chat />
    </WrapperAll>
  )
}

export default HomePage
