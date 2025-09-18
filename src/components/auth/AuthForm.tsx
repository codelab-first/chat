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
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form === "join") {
      // 회원가입 정보 저장 (예: users라는 배열에 추가)
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      users.push({
        email: inputs.email,
        password: inputs.password,
        name: inputs.name,
      });
      localStorage.setItem("users", JSON.stringify(users));
      alert("회원가입 완료! (로컬 저장)");
    } else {
      // 로그인: 로컬에서 사용자 확인
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u: any) => u.email === inputs.email && u.password === inputs.password
      );
      if (user) {
        alert("로그인 성공! (로컬 저장)");
        localStorage.setItem("currentUser", JSON.stringify(user)); // 추가
        navigate("/home");
      } else {
        alert("로그인 실패! (로컬 저장)");
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