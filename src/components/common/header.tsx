import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import { tokenData, tokenActions } from '../../store/slices/token-slice';
const WrapperHeader = styled.div`
display:flex;
justify-content:space-between;
align-items:center;
color:yellow;
position:fixed;
width:1200px;
top:0;
margin:0 auto;
padding:1em 1.5em;
background:gray;
@media (max-width: 1200px) { 
  max-width:100%;
color:yellow
} 
`
const WrappLogo = styled.div``
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
      <WrappLogo>Logo</WrappLogo>
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