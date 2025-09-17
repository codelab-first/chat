import styled from '@emotion/styled'

const WrapsNav = styled.ul`
margin-left:auto;
width:50%;
display:flex;
justify-content:space-between;
align-items:center;
border:1px solid black;
right:0;
top:0;
padding:1em 1.5em;

`
const Nav = () => {
  return (
    <div>
      <WrapsNav>
        <li><a href="/home">Home</a></li>
        <li><a href="/wheather">날씨정보</a></li>
        <li><a href="/air">대기정보</a></li>
      </WrapsNav>
    </div>
  );
};

export default Nav;