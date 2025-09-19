import styled from "@emotion/styled"
import Chat from "../components/common/Chat_ksh"
const WrapperData = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2.5em;
`
const HomePage = () => {
  return (
    <WrapperData>
      <Chat />
    </WrapperData>
  )
}

export default HomePage
