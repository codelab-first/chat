import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import { tokenData, tokenActions } from '../../store/slices/token-slice';
import Logo from '../../../public/images/logo0.gif'
import Logo1 from '../../../public/images/logo1.gif'
import Logo2 from '../../../public/images/logo2.gif'
import Logo3 from '../../../public/images/logo3.gif'
const WrapperHeader = styled.div`
display:flex;
justify-content:space-between;
align-items:center;
color:black;
position:fixed;
width:1200px;
top:0;
margin:0 auto;
padding:2em 1.5em;
// border:1px solid gray;
// background:gray;
@media (max-width: 1200px) { 
  max-width:100%;
color:black;
} 
`
const WrappLogo = styled.div`
width:80px;
height:80px;
border-radius:50%;
transition:1s;
background:white;
transform:rotate(360deg);
cursor:pointer;

display:flex;
justify-content:center;
align-items:center;
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
      <div style={{ display: 'flex', alignItems: 'center' }}>

        <WrappLogo style={{ position: 'absolute', top: '10px' }}><img src={Logo} width="100px" /></WrappLogo>
        {/* <WrappLogo style={{ position: 'absolute', top: "-20px" }}><img src={Logo1} width="120px" /></WrappLogo> */}
        {/* <WrappLogo style={{ position: 'absolute', top: "-7px" }}><img src={Logo2} width="120px" /></WrappLogo> */}
        {/* <WrappLogo style={{ position: 'absolute', }}><img src={Logo3} width="150px" /></WrappLogo> */}
      </div>
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