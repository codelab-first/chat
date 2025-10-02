import React, { useState } from "react"
import styled from "@emotion/styled"
import Chat from "../components/common/Chat_ksh"
import Air from "../components/left/Air"
// import Weather from "../components/left/Weather"
import { formSelector, formActions } from '../store/slices/form-slice';
import { useSelector, useDispatch } from "react-redux";




import Map from "../components/right/Map"
const WrapperAll = styled.div``
const WrapperData = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2.5em;
`
const WrapsAir = styled.div`
display:none;
`
const FloatButton = styled.button`
position:fixed;
top:60px;
right:60px;
border-radius:50%;
width:60px;
height:60px;
background:darkcyan;
color:white;
font-size:1em;
opacity:.2;
transition:1s;
&:hover{
  background:darkcyan;
opacity:.7}

`
const HomePage = () => {

  const dispatch = useDispatch()
  const { chatting } = useSelector(formSelector)

  const [selectedStation, setSelectedStation] = useState<string | null>(null)

  const onClick = () => { dispatch(formActions.toggle_form({ form: 'chatting', value: !chatting.visible })) }

  return (
    <WrapperAll>
      <WrapperData>
        <WrapsAir>
          <Air selectedStation={selectedStation} screenMode="mobile" />
        </WrapsAir>
        <Map setSelectedStation={setSelectedStation} />
      </WrapperData>
      <div>

        <Chat />
      </div>
      <FloatButton onClick={onClick} >채팅</FloatButton>

    </WrapperAll>
  )
}

export default HomePage
