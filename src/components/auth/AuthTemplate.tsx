import React from 'react';
import styled from '@emotion/styled'

type Props = {
  children: React.ReactNode
}

const AuthForm = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: url('/images/background.jpg') no-repeat center center; 
  background-size: cover; /* ✅ 화면 크기에 맞게 꽉 채움 */
  display: flex;
  align-items: center;
  justify-content: center;
`

const WhiteBox = styled.div`
  width: 22em;
  padding: 0.625em;
  background: rgba(255, 255, 255, 0.5); 
  border-radius: 0.8em;                 
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); 
  z-index: 1;
  position: relative;
`

const Logo = styled.div`
  text-align:center;
  margin-bottom: 0.5em;
  padding-top: 1em;
`

const LogoImg = styled.img`
  width: 6em;
  height: auto;
  margin-bottom: 0.5em;
`

const LogoText = styled.div`
  font-size: 1em;
  font-weight: 500;
  color: #2E7D32;
  text-align: center;
  letter-spacing: 1px;
  margin-top: 0.3em;
  font-family: 'Segoe UI', 'Pretendard', sans-serif;
  white-space: nowrap; /* 줄바꿈 방지 */
`

const BackgroundGif = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60em;
  height: auto;
  opacity: 0.2;
  z-index: 0;
  pointer-events: none;
`

const AuthTemplate: React.FC<Props> = ({ children }) => {
  return (
    <AuthForm>
      <BackgroundGif src="/images/Auth_Bk_obj.gif" alt="background" />
      <WhiteBox>
        <Logo>
          <LogoImg src="/images/logo0.gif" alt="logo" />
          <LogoText>당신의 하루를 지켜주는 AI 대기질 가이드</LogoText>
        </Logo>
        {children}
      </WhiteBox>
    </AuthForm>
  );
};

export default AuthTemplate;
