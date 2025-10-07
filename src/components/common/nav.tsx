import styled from '@emotion/styled'
import { formSelector, formActions } from '../../store/slices/form-slice';
import { useSelector, useDispatch } from "react-redux";
// import { Link } from 'react-router-dom';
const WrapsNav = styled.ul`
margin-left:auto;
width:30%;
display:flex;
justify-content:space-evenly;
align-items:center;
// border:1px solid black;
right:0;
top:0;
padding:1em 1.5em;

`
const Nav = () => {

  const dispatch = useDispatch()
  const { chatting } = useSelector(formSelector)

  // const onClick = () => { dispatch(formActions.toggle_form({ form: 'chatting', value: !chatting.visible })) }
  return (
    <div>
      <WrapsNav>
        {/* <li><a href="/weather">날씨정보</a></li> */}
        {/* <li><Link to="/home">대기정보</Link></li> */}
        {/* <li><Link to="/weather">날씨정보</Link></li> */}
      </WrapsNav>
      {/* <button onClick={onClick}>채팅창</button> */}
    </div>
  );
};

export default Nav;