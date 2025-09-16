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
const WhiteBox = styled.div`
width:300px;
padding:10px;
background:white;
border-radius:8px;
// border:1px solid black;
`

const AuthTemplate: React.FC<Props> = ({ children }) => {
  return (
    <AuthForm>
      <WhiteBox>
        {children}
      </WhiteBox>
    </AuthForm>
  );
};

export default AuthTemplate;