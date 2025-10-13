import { useEffect, useContext } from 'react';
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authData, authActions } from '../../store/slices/auth-slice'
import { Link } from 'react-router-dom';
import { apiPost } from '../../modules/api';
import Button from '../common/Button';
import { tokenActions } from '../../store/slices/token-slice';
import { io } from 'socket.io-client'
import { ApiResponse } from '../../modules/api';
import AirData from '../../providers/AirDataProvider'
type Props = {
  form: "login" | "join";
}
const StyledInput = styled.input`
  width: 100%;
  padding: 0.7em 1em;
  margin-top: 1em;
  border: 1px solid #ccc;
  border-radius: 2em;
  outline: none;
  font-size: 1rem;
  transition: 0.3s ease;
  &:focus {
    border-color: #1b9135ff;
    background: rgba(255, 255, 255, 0.6);
  }
`

const StyledButton = styled.button`
  border:none;
  padding:.5em 1em;
  background:white;
  width:100%;
  margin-top:1em;
  background:black;
  color:white;
  transition:.5s;
  font-size:1rem;
  &:hover{
    background:gray;
    color:black;
  }
`
const AuthForm: React.FC<Props> = ({ form = "login" }) => {
  // 입력값 상태 관리

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { success, message, loginData, joinData } = useSelector(authData)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(authActions.changeField({ form, key: name, value }))
    // dispatch(authActions.changeField({ form: 'login', key: name, value }))
  };
  const join = async () => {
    console.log("joinData", joinData)
    if (joinData.email === '' || joinData.name === '' || joinData.password === '') return;
    try {

      const rs = await apiPost<{ email: string, name: string, password: string }, { success: string }>("http://localhost:3000/auth/join", { email: joinData.email, name: joinData.name, password: joinData.password });

      if (rs?.success === "OK") {
        dispatch(authActions.joinSuccess({ success: 'OK', joinData }))
        navigate('/')
      }
    } catch (e) {

    }
  }
  const login = async () => {
    if (loginData.email === '' || loginData.password === '') return;
    const rs = await apiPost<
      { email: string, password: string },
      ApiResponse<{ success: string, data: { user: { id: number, name: string }, accessToken: string, refreshToken: string } }>
    >("http://localhost:3000/auth/login", { email: loginData.email, password: loginData.password });
    if (rs?.success === "OK") {
      navigate('/home')
      dispatch(authActions.loginSuccess(rs))
      dispatch(tokenActions.setToken(rs))
      dispatch(authActions.initForm('login'))
      // const socket = io('http://localhost:3000', {
      //   query: { token: rs?.data?.accessToken }
      // })
      // console.log('tokentoken', rs.data?.accessToken)
      // socket.on('connect', () => {
      //   console.log('Socket.IO 서버에 연결되었습니다.')
      // })
    } else {

      dispatch(authActions.loginFailure(rs))
      dispatch(tokenActions.initToken())

    }
  }

  const onLogin = (e: any) => {
    if (e.key === 'Enter') {
      login()
    }
  }

  return (
    <>
      {form === "join" && (
        <StyledInput
          name="name"
          type="text"
          value={joinData.name}
          onChange={onChange}
          placeholder='이름을 입력해주세요'
          autoComplete='none'
        />
      )}
      <StyledInput
        name="email"
        value={form === 'login' ? loginData.email : joinData.email}
        onChange={onChange}
        placeholder='아이디를 입력해주세요'
        autoComplete='none'
        onKeyDown={onLogin}
      />
      <StyledInput
        name="password"
        type="password"
        value={form === 'login' ? loginData.password : joinData.password}
        onChange={onChange}
        placeholder='비밀번호를 입력해주세요'
        onKeyDown={onLogin}
      />
      {form === "login" ? <Button width="30%" color="white" bgcolor="#1b9135ff" onClick={login}>Login</Button> : <Button width="100%" color="white" bgcolor="darkcyan" onClick={join}>회원가입</Button>}
      <div style={{ textAlign: "right", color: "orange", marginTop: '.5em' }}>
        {form === "login" ? <Link to='/join'>회원가입</Link> : <Link to='/'>로그인</Link>}
      </div>
    </>
  );
};

export default AuthForm;