import { useEffect, useState, useContext } from "react"
import styled from "@emotion/styled"
import Chat from "../components/common/Chat_ksh"
import Air from "../components/left/Air"
import { formSelector, formActions } from '../store/slices/form-slice';
import { useSelector, useDispatch } from "react-redux";
import Map from "../components/right/Map"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSmile,
  faMeh,
  faSadTear,
  faAngry,
} from "@fortawesome/free-solid-svg-icons"

import { AirDataContext } from '../providers/AirDataProvider'

function getKhaiGradeIcon(grade: number | null) {
  const style = { fontSize: "64px" } // 아이콘 크기 직접 조절

  switch (grade) {
    case 1:
      return <FontAwesomeIcon icon={faSmile} color="green" style={style} />
    case 2:
      return <FontAwesomeIcon icon={faMeh} color="goldenrod" style={style} />
    case 3:
      return <FontAwesomeIcon icon={faSadTear} color="orange" style={style} />
    case 4:
      return <FontAwesomeIcon icon={faAngry} color="red" style={style} />
    default:
      return <FontAwesomeIcon icon={faMeh} color="gray" style={style} />
  }
}
const WrapperAll = styled.div``
const WrapperData = styled.div`
  @media (min-width:860px){
  display:flex;
  }
`

const FloatButton = styled.button`
position:fixed;
top:60px;
right:60px;
font-size:1em;
transition:1s;
`

const HomePage = () => {
  const { airDatas } = useContext(AirDataContext)

  const dispatch = useDispatch()
  const { chatting } = useSelector(formSelector)

  const [selectedStation, setSelectedStation] = useState<string | null>(null)


  const onClick = () => { dispatch(formActions.toggle_form({ form: 'chatting', value: !chatting.visible })) }
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

      {!width && <FloatButton onClick={onClick} >
        {airDatas > 0 && getKhaiGradeIcon(airDatas)}
      </FloatButton>}

    </WrapperAll>
  )
}

export default HomePage
