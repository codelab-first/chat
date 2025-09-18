import { useEffect } from 'react';
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authData, authActions } from '../../store/slices/auth-slice'
import { Link } from 'react-router-dom';
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
  &:hover{
  background:gray;
  ::placeholder{
  color:white;
  }
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
  };
  const login = () => {
    if (!loginData.email || !loginData.password) return;
    console.log(loginData.email, loginData.password)
    // dispatch(authActions.login({ email: loginData.email, password: loginData.password }))

  }
  const join = () => {
    if (!joinData.email || !joinData.name || !joinData.password) return;
    console.log(joinData.email, joinData.password, joinData.name)
    // dispatch(authActions.join({ email: joinData.email, password: joinData.password, name: joinData.name, rank: joinData.rank }))
  }
  // 버튼 클릭 시 서버로 데이터 전송

  const onSubmit = (e: any) => {
    e.preventDefault()
    navigate('/home')
  }
  useEffect(() => {
    dispatch(authActions.initForm(form))
  }, [])
  return (
    <form onSubmit={onSubmit}>
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
        value={loginData.email || joinData.email}
        onChange={onChange}
        placeholder='Input Email'
        autoComplete='none'
      />
      <StyledInput
        name="password"
        type="password"
        value={loginData.password || joinData.password}
        onChange={onChange}
        placeholder='Input Password'
      />
      <StyledButton type="submit">{form !== "login" ? "회원가입" : "로그인"}</StyledButton>
      <div style={{ textAlign: "right", color: "orange", marginTop: '.5em' }}>
        {form === "login" ? <Link to='/join'>회원가입</Link> : <Link to='/'>로그인</Link>}
      </div>
    </form>
  );
};

export default AuthForm;