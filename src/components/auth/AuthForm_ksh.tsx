import { useEffect } from 'react';
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authData, authActions } from '../../store/slices/auth-slice'
import { Link } from 'react-router-dom';
import { apiPost } from '../../modules/api';
import { tokenActions } from '../../store/slices/token-slice';
import { ApiResponse } from '../../modules/api';
import { FiLogIn, FiUserPlus } from "react-icons/fi";

type Props = {
  form: "login" | "join";
}

const StyledInput = styled.input`
  width: 100%;
  padding: 0.7em 1.5em;
  margin-top: 1em;
  border: 1px solid #ccc;
  outline: none;
  font-size: 1rem;
  transition: 0.3s ease;

  &:focus {
    border-color: #1b9135ff;
    background: rgba(255, 255, 255, 0.6);
  }
`;

/* ✅ 로그인/회원가입 전용 버튼 */
const RoundedButton = styled.button<{ bgcolor?: string }>`
  display: block;
  margin: 1.5em auto 0;  /* 가운데 정렬 */
  padding: 0.6em 1.2em;    /* 높이 키움 */
  border: none;
  border-radius: 1.8em;    /* pill 모양 */
  background: ${({ bgcolor }) => bgcolor || "rgba(27,145,53,0.8)"};
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background: ${({ bgcolor }) =>
      bgcolor === "darkcyan" ? "#117272" : "#166a29"};
  }
`;

const AuthForm: React.FC<Props> = ({ form = "login" }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { success, message, loginData, joinData } = useSelector(authData)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(authActions.changeField({ form, key: name, value }))
  };

  const join = async () => {
    if (joinData.email === '' || joinData.name === '' || joinData.password === '') return;
    try {
      const rs = await apiPost<{ email: string, name: string, password: string }, { success: string }>(
        "http://localhost:3000/auth/join",
        { email: joinData.email, name: joinData.name, password: joinData.password }
      );
      if (rs?.success === "OK") {
        dispatch(authActions.joinSuccess({ success: 'OK', joinData }))
        navigate('/')
      }
    } catch (e) {}
  };

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
    } else {
      dispatch(authActions.loginFailure(rs))
      dispatch(tokenActions.initToken())
    }
  };

  const onLogin = (e: any) => {
    if (e.key === 'Enter') {
      login()
    }
  };

  return (
    <>
      {form === "join" && (
        <StyledInput
          name="name"
          type="text"
          value={joinData.name}
          onChange={onChange}
          placeholder='이름을 입력해주세요'
          autoComplete='off'
        />
      )}
      <StyledInput
        name="email"
        type="text"
        value={form === 'login' ? loginData.email : joinData.email}
        onChange={onChange}
        placeholder='아이디를 입력해주세요'
        autoComplete='off'
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

      {form === "login" ? (
        <RoundedButton onClick={login}>Login</RoundedButton>
      ) : (
        <RoundedButton onClick={join}>Join</RoundedButton>
      )}

        <div style={{ textAlign: "right", color: "#6A89A7", marginTop: '1em' }}>
        {form === "login" ? (
          <Link to='/join'><FiUserPlus style={{ marginRight: "0.2em" }} /> Sign up</Link>
        ) : (
          <Link to='/'><FiLogIn style={{ marginRight: "0.2em" }} /> Login</Link>
        )}
      </div>
    </>
  );
};

export default AuthForm;
