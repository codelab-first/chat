import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import { tokenData, tokenActions } from '../../store/slices/token-slice';
import Logo from '../../../public/images/logo0.gif'

const WrapperHeader = styled.div`
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
  top:-20px;
  left:0;
  color:red;
  align-items:flex-start;
}
@media (max-width: 1200px) { 
// background:yellow;
width:100%;
color:black;
} 

`
const WrappLogo = styled.div`

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

  return (
    <WrapperHeader>

      <WrappLogo ><img src={Logo} width="100px" /></WrappLogo>

      <div>
        {user && user.name && (
          <span style={{ marginRight: "1em" }}>{user.name}님</span>
        )}
        {user ? <LoginStatus to={"/"} onClick={handleLogout}>LogOut</LoginStatus> : <LoginStatus to={"/"} onClick={handleLogout}>Login</LoginStatus>}
      </div>
    </WrapperHeader>
  );
};

export default Header;