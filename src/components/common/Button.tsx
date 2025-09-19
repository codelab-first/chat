import styled from "@emotion/styled";
import { css } from "@emotion/react";

const ButtonStyle = css`
border:none;
margin-left:.5em;
padding:.2em .3em;
font-size:1em;
&:hover{
color:black;}
`
const CircleButton=css`

`
const StyledButton = styled.button<{ color: string, width: string, bgcolor: string, circle: boolean }>`${ButtonStyle}
${props => props.color && css`color:${props.color}`}
${props => props.bgcolor && css`background:${props.bgcolor}`}
${props => props.width && css`width:${props.width}`}
${props => props.circle && css`border-radius:50%;margin-right:1em;font-size:auto`}
`;

const Button = (props: any) => {
  return <StyledButton {...props}></StyledButton>;
};

export default Button;
