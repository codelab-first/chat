import styled from '@emotion/styled'
import { formSelector, formActions } from '../../store/slices/form-slice';
import { useSelector, useDispatch } from "react-redux";
const WrapsNav = styled.ul`
margin-left:auto;
width:30%;
display:flex;
justify-content:space-evenly;
align-items:center;
border:1px solid black;
right:0;
top:0;
padding:1em 1.5em;

`
const Nav = () => {

  const dispatch = useDispatch()
  const { chatting } = useSelector(formSelector)

  const onClick = () => { dispatch(formActions.toggle_form({ form: 'chatting', value: !chatting.visible })) }
  return (
    <div>
      <WrapsNav>
        {/* <li><a href="/weather">날씨정보</a></li> */}
        <li><a href="/home">대기정보</a></li>
        <li><a href="/weather">날씨정보</a></li>
        <button onClick={onClick}>채팅창</button>
      </WrapsNav>
    </div>
  );
};

export default Nav;