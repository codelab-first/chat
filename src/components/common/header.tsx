import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import styled from "@emotion/styled"
import { useDispatch, useSelector } from "react-redux"
import { tokenData, tokenActions } from "../../store/slices/token-slice"
import Logo from "../../../public/images/logo0.gif"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSmile, faMeh, faSadTear, faAngry } from "@fortawesome/free-solid-svg-icons"
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

const BubbleOverlay = styled.div`
  position: absolute;
  top: 100%;
  left: 60%;
  transform: translate(-50%, -60%);
  pointer-events: none;
  z-index: 1;
  width: 90%;
  max-width: 520px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Bubble = styled.div`
  pointer-events: auto;
  background: #ffffff;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px 16px;
  line-height: 1.6;
  text-align: center;
  max-width: 100%;
  word-break: keep-all;
  overflow-wrap: break-word;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  min-height: 40px;
  font-size: 15px;
  white-space: pre-line;
`

/* ✅ 화살표를 오른쪽으로 이동하고, 오른쪽을 향하게 수정 */
const Tail = styled.span`
  position: absolute;
  top: 50%;
  right: -10px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 8px solid #ffffff;
  filter: drop-shadow(1px 0 0 #e5e7eb);
`

const TypingText = styled.span<{ fadeOut: boolean }>`
  display: inline-block;
  opacity: ${(props) => (props.fadeOut ? 0 : 1)};
  transition: opacity 0.8s ease;
`

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(tokenData)
  const { chatting } = useSelector(formSelector)
  const { setAirDatas, airDatas, airLocal, setRegion, region, setLocalAirData, stationAddress } =
    useContext(AirDataContext)

  const handleLogout = () => {
    dispatch(tokenActions.initToken())
  }

  const onClick = () => {
    dispatch(formActions.toggle_form({ form: "chatting", value: !chatting.visible }))
  }

  useEffect(() => {
    const getAirData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/air?stationName=${airLocal}`)
        setLocalAirData(response.data)
        setAirDatas(response.data.khaiGrade)
        airLocal && setRegion(response.data.sidoName)
      } catch (err) {
        console.error(err)
      }
    }
    if (airLocal) getAirData()
  }, [airLocal])

  const fullText = `${user.name}님 현재 관측소는 ${region || "알 수 없음"} ${airLocal || ""}${
    stationAddress ? ` (${stationAddress})` : ""
  } 입니다.\n저를 누르시면 자세한 정보가 표시됩니다.`

  const [displayText, setDisplayText] = useState("")
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    let i = 0
    let typingTimeout: NodeJS.Timeout

    const startTyping = () => {
      if (i < fullText.length) {
        setDisplayText(fullText.slice(0, i + 1))
        i++
        typingTimeout = setTimeout(startTyping, 120)
      } else {
        setTimeout(() => {
          setFadeOut(true)
          setTimeout(() => {
            setDisplayText("")
            setFadeOut(false)
            i = 0
            startTyping()
          }, 800)
        }, 2500)
      }
    }

    startTyping()
    return () => clearTimeout(typingTimeout)
  }, [fullText])

  return (
    <WrapperHeader>
      <WrappLogo>
        <img src={Logo} width="100px" />
      </WrappLogo>

      <BubbleOverlay>
        <Bubble>
          <Tail />
          <TypingText fadeOut={fadeOut}>{displayText}</TypingText>
        </Bubble>
      </BubbleOverlay>

      <WrappUser>
        {user && user.name && <span style={{ marginRight: "1em" }}>{user.name}님</span>}
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
        <FloatButton onClick={onClick}>{airDatas > 0 && getKhaiGradeIcon(airDatas)}</FloatButton>
      </WrappUser>
    </WrapperHeader>
  )
}

export default Header
