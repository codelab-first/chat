import React, { useState } from "react";
import styled from '@emotion/styled'
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가

type Props = {
  form: "login" | "join";
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
  // 입력값 상태 관리
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: "",
  });
  const navigate = useNavigate(); // 추가

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 버튼 클릭 시 서버로 데이터 전송
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form === "join") {
      const res = await fetch("http://localhost:5173/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inputs.email,
          password: inputs.password,
          name: inputs.name,
        }),
      });
      const result = await res.json();
      alert(result.message);
    } else {
      const res = await fetch("http://localhost:5173/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inputs.email,
          password: inputs.password,
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert("로그인 성공!");
        localStorage.setItem("currentUser", JSON.stringify(result.user));
        navigate("/home");
      } else {
        alert(result.message);
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {form === "join" && (
        <StyledInput
          name="name"
          value={inputs.name}
          onChange={onChange}
          placeholder='Input Nickname'
        />
      )}
      <StyledInput
        name="email"
        value={inputs.email}
        onChange={onChange}
        placeholder='Input Email'
      />
      <StyledInput
        name="password"
        type="password"
        value={inputs.password}
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

export default AuthForm;;0
