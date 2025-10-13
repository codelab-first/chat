import { useEffect, useState } from "react"
import styled from "@emotion/styled"
import Chat from "../components/common/Chat_ksh"
import Air from "../components/left/Air"
import Map from "../components/right/Map"
import { formActions } from '../store/slices/form-slice';
import { useDispatch } from "react-redux";


const WrapperAll = styled.div``
const WrapperData = styled.div`
margin-top:3em;
  @media (min-width:860px){
  display:flex;
  }
`

const HomePage = () => {
  const dispatch = useDispatch()
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [width, setWidth] = useState(false);
  useEffect(() => {
    updateWidth();
  }, [])

  const updateWidth = () => {
    const width = window.innerWidth;
    if (width < 860) {
      setWidth(true)
      dispatch(formActions.mobilePosoiton())
    } else {
      setWidth(false)
      dispatch(formActions.initPosition('chatting'))
    }
  }
  window.addEventListener('resize', updateWidth)




  return (
    <WrapperAll>
      <WrapperData>

        <Air selectedStation={selectedStation} />
        <Map setSelectedStation={setSelectedStation} screenMode={width} />
      </WrapperData>
      <div>
        <Chat screenMode={width} />
      </div>



    </WrapperAll>
  )
}

export default HomePage
