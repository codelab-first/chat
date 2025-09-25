import { useEffect } from 'react';
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authData, authActions } from '../../store/slices/auth-slice'
import { Link } from 'react-router-dom';
import { apiPost } from '../../modules/api';
import Button from '../common/Button';
import { tokenActions } from '../../store/slices/token-slice';
import { io } from 'socket.io-client'
type Props = {
  form: "login" | "join";
}
const StyledInput = styled.input`
  width:100%;
  padding:.5em;
  margin-top:1em;
  border:none;
  outline:none;
  border:1px solid black;
  cursor:pointer;
  &:focus{
  background:rgba(200,200,200,0.4)
  // ::placeholder{
  // color:white;
  // }
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
    console.log("loginData", loginData)
    const rs = await apiPost<{ email: string, password: string }, { success: string, data: { user: { id: number, name: string }, accessToken: string, refreshToken: string } }>("http://localhost:3000/auth/login", { email: loginData.email, password: loginData.password });
    // console.log(rs)
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
    }
  }


  useEffect(() => {
    // dispatch(authActions.initForm(form))
  }, [])
  return (
    <>
      {form === "join" && (
        <StyledInput
          name="name"
          type="text"
          value={joinData.name}
          onChange={onChange}
          placeholder='Input Nickname'
          autoComplete='none'
        />
      )}
      <StyledInput
        name="email"
        type="text"
        value={form === 'login' ? loginData.email : joinData.email}
        onChange={onChange}
        placeholder='Input Email'
        autoComplete='none'
      />
      <StyledInput
        name="password"
        type="password"
        value={form === 'login' ? loginData.password : joinData.password}
        onChange={onChange}
        placeholder='Input Password'
      />
      {form === "login" ? <Button width="100%" color="white" bgcolor="darkcyan" onClick={login}>로그인</Button> : <Button width="100%" color="white" bgcolor="darkcyan" onClick={join}>회원가입</Button>}
      <div style={{ textAlign: "right", color: "orange", marginTop: '.5em' }}>
        {form === "login" ? <Link to='/join'>회원가입</Link> : <Link to='/'>로그인</Link>}
      </div>
    </>
  );
};

export default AuthForm;