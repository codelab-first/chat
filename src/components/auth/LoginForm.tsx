import React from 'react';
import styled from '@emotion/styled'
import { Link } from 'react-router-dom';
const StyledInput = styled.input`
width:100%;
padding:.5em;
margin-top:1em;
`
const StyledButton = styled.button`
border:none;
padding:.5em 1em;
background:black;;
color:white;
width:100%;
margin-top:1em;

`
const LoginForm = () => {
  return (
    <div>
      <StyledInput placeholder='Input Email' />
      <StyledInput placeholder='Input Password' />
      <StyledButton>로그인</StyledButton>
      <div style={{ textAlign: "right", color: "orange", marginTop: '.5em' }}>
        <Link to='/join'>회원가입</Link>
      </div>

    </div>
  );
};

export default LoginForm;