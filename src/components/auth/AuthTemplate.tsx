import React from 'react';
import styled from '@emotion/styled'
type Props = {
  children: React.ReactNode
}
const AuthForm = styled.div`

position:fixed;
top:0;
right:0;
left:0;
bottom:0;
background:#eee;
display:flex;
align-items:center;
justify-content:center;

`
const Logo = styled.div`
text-align:center;
letter-spacing:3px;
`
const WhiteBox = styled.div`
width:300px;
padding:10px;
background:white;
border-radius:8px;
box-shadow:0 0 2px 4px rgba(100,100,100,0.6)
// border:1px solid black;
`

const AuthTemplate: React.FC<Props> = ({ children }) => {
  return (
    <AuthForm>
      <WhiteBox>
        <Logo>
          TEAM ONE
        </Logo>
        {children}
      </WhiteBox>
    </AuthForm>
  );
};

export default AuthTemplate;