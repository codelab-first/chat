import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled'

import { useDispatch } from 'react-redux'
import { authActions } from '../../store/slices/auth-slice';
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
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  // 로그아웃 버튼 클릭 시 currentUser 삭제
  const handleLogout = () => {
    // localStorage.removeItem("currentUser");
    dispatch(authActions.logout())
    navigate("/"); // 로그아웃 후 로그인 페이지로 이동 (필요시)
  };
  const dispatch = useDispatch();

  return (
    <WrapperHeader>
      <WrappLogo>Logo</WrappLogo>
      <div>
        {currentUser && currentUser.name && (
          <span style={{ marginRight: "1em" }}>{currentUser.name}님</span>
        )}
        <LoginStatus to={"/"} onClick={handleLogout}>LogOut</LoginStatus>
      </div>
    </WrapperHeader>
  );
};

export default Header;