import React from 'react';
// import { createSelector } from '@reduxjs/toolkit';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled'
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
const WrappLogo = styled.div`

`
const LoginStatus = styled(Link)`

    `
const Header = () => {
  return (
    <WrapperHeader>
      <WrappLogo>Logo</WrappLogo>
      <LoginStatus to={"/"}>LogOut</LoginStatus>
    </WrapperHeader>
  );
};

export default Header;