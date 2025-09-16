
import styled from '@emotion/styled'
import { Link } from 'react-router-dom';
type Props = {
  form: string;
}
const StyledInput = styled.input`
width:100%;
padding:.5em;
margin-top:1em;
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
  return (
    <div>

      {form !== "login" && <StyledInput placeholder='Input Nickname' />}
      <StyledInput placeholder='Input Email' />
      <StyledInput placeholder='Input Password' />
      <StyledButton>{form !== "login" ? "회원가입" : "로그인"}</StyledButton>
      <div style={{ textAlign: "right", color: "orange", marginTop: '.5em' }}>
        {form === "login" ? <Link to='/join'>회원가입</Link> : <Link to='/'>로그인</Link>}
      </div>
    </div>
  );
};

export default AuthForm;