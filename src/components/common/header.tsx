import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import { tokenData, tokenActions } from '../../store/slices/token-slice';
import Logo from '../../../public/images/logo0.gif'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSmile,
  faMeh,
  faSadTear,
  faAngry,
} from "@fortawesome/free-solid-svg-icons"
import { AirDataContext } from '../../providers/AirDataProvider'
import { formSelector, formActions } from '../../store/slices/form-slice';
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
const WrapperHeader = styled.div`
// border:1px solid black;
display:flex;
justify-content:space-between;
align-items:center;
color:black;
width:1200px;
margin:0 auto;
padding:1em 1.5em;
position:relatived;
top:0;
@media(max-width:860px){
  position:absolute;
  top:-15px;
  left:0;
  color:red;
  align-items:flex-start;
}
@media (max-width: 1200px) { 
width:100%;
color:black;
} 
`
const WrappUser = styled.div`
width:200px;
text-align:left;
@media (max-width:860px){
  margin-top:.5em;
  }
`
const WrappLogo = styled.div`

`
const FloatButton = styled.button`
padding:.4em;
@media(max-width:860px){
  display:none;
}
`
const LoginStatus = styled(Link)``

const Header = () => {
  const navigate = useNavigate();
  // const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const { user } = useSelector(tokenData)
  // 로그아웃 버튼 클릭 시 currentUser 삭제
  const handleLogout = () => {
    // localStorage.removeItem("currentUser");
    dispatch(tokenActions.initToken())
    navigate("/"); // 로그아웃 후 로그인 페이지로 이동 (필요시)
  };
  const dispatch = useDispatch();
  const { airDatas, airLocal } = useContext(AirDataContext)
  const { chatting } = useSelector(formSelector)

  const onClick = () => { dispatch(formActions.toggle_form({ form: 'chatting', value: !chatting.visible })) }


  return (

    <WrapperHeader>

      <WrappLogo ><img src={Logo} width="100px" /></WrappLogo>

        {airLocal ? airLocal : '없음'}
      <WrappUser>
        {user && user.name && (
          <span style={{ marginRight: "1em" }}>{user.name}님</span>
        )}
        {user ? <LoginStatus to={"/"} onClick={handleLogout}>LogOut</LoginStatus> : <LoginStatus to={"/"} onClick={handleLogout}>Login</LoginStatus>}
        {<FloatButton onClick={onClick} >
          {airDatas > 0 && getKhaiGradeIcon(airDatas)}
        </FloatButton>}
      </WrappUser>
    </WrapperHeader>
  );
};

export default Header;