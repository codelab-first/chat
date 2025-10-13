import { useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import styled from "@emotion/styled"
import { useDispatch, useSelector } from "react-redux"
import { tokenData, tokenActions } from "../../store/slices/token-slice"
import Logo from "../../../public/images/logo0.gif"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSmile,
  faMeh,
  faSadTear,
  faAngry,
} from "@fortawesome/free-solid-svg-icons"
import { AirDataContext } from "../../providers/AirDataProvider"
import { formSelector, formActions } from "../../store/slices/form-slice"
import axios from "axios"

function getKhaiGradeIcon(grade: number | null) {
  const style = { fontSize: "64px" }
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

const WrapperHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
  width: 1200px;
  margin: 0 auto;
  padding: 1em 1.5em;
  position: relative;
  top: 0;
  @media (max-width: 860px) {
    position: absolute;
    top: -15px;
    left: 0;
    color: red;
    align-items: flex-start;
  }
  @media (max-width: 1200px) {
    width: 100%;
    color: black;
  }
`

const WrappUser = styled.div`
  width: 320px;
  text-align: left;
  position: relative;
  z-index: 2;
  @media (max-width: 860px) {
    margin-top: 0.5em;
    width: 260px;
  }
`

const WrappLogo = styled.div`
  display: flex;
  align-items: center;
  img {
    vertical-align: middle;
  }
`

const FloatButton = styled.button`
  padding: 0.2em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  @media (max-width: 860px) {
    display: none;
  }
`

const LoginStatus = styled(Link)``

/* 말풍선을 로고 높이에 맞춰 수평 정렬 */
const BubbleOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%); /* 로고 높이에 맞춰 살짝 내림 */
  pointer-events: none;
  z-index: 1;
  width: 90%;
  max-width: 520px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Bubble = styled.button`
  pointer-events: auto;
  background: #ffffff;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px 16px;
  line-height: 1.5;
  text-align: center;
  max-width: 100%;
  white-space: normal;
  word-break: keep-all;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`

const Tail = styled.span`
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #ffffff;
  filter: drop-shadow(0 1px 0 #e5e7eb);
`

const Header = () => {
  const navigate = useNavigate()
  const { user } = useSelector(tokenData)
  const handleLogout = () => {
    dispatch(tokenActions.initToken())
  }
  const dispatch = useDispatch()
  const {
    setAirDatas,
    airDatas,
    airLocal,
    setRegion,
    region,
    setLocalAirData,
    stationAddress,
  } = useContext(AirDataContext)
  const { chatting } = useSelector(formSelector)

  const onClick = () => {
    dispatch(
      formActions.toggle_form({
        form: "chatting",
        value: !chatting.visible,
      })
    )
  }

  useEffect(() => {
    const getAirData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/air?stationName=${airLocal}`
        )
        setLocalAirData(response.data)
        setAirDatas(response.data.khaiGrade)
        airLocal && setRegion(response.data.sidoName)
      } catch (err) {
        console.error(err)
      }
    }
    if (airLocal) {
      getAirData()
    }
  }, [airLocal])

  return (
    <WrapperHeader>
      <WrappLogo>
        <img src={Logo} width="100px" />
      </WrappLogo>

      {/* 헤더 중앙, 로고와 수평 맞춤 */}
      <BubbleOverlay>
        <Bubble type="button">
          <Tail />
          <p>
            현재 관측소는 {region ? region : "알 수 없음"}{" "}
            {airLocal && <span>{airLocal}</span>}{" "}
            {stationAddress && <span> ({stationAddress})</span>} 입니다. 저를
            누르시면 자세한 정보가 표시됩니다.
          </p>
        </Bubble>
      </BubbleOverlay>

      <WrappUser>
        {user && user.name && (
          <span style={{ marginRight: "1em" }}>{user.name}님</span>
        )}
        {user ? (
          <LoginStatus
            to={"/"}
            onClick={() => {
              handleLogout()
              navigate("/")
            }}
          >
            LogOut
          </LoginStatus>
        ) : (
          <LoginStatus to={"/"} onClick={() => navigate("/")}>
            Login
          </LoginStatus>
        )}
        <FloatButton onClick={onClick}>
          {airDatas > 0 && getKhaiGradeIcon(airDatas)}
        </FloatButton>
      </WrappUser>
    </WrapperHeader>
  )
}

export default Header
