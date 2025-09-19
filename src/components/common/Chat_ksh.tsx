import React from 'react';
import styled from '@emotion/styled'
import Button from './Button'
import { useSelector, useDispatch } from "react-redux";
import { formSelector, formActions } from '../../store/slices/form-slice';
import { useDrag } from 'react-use-gesture';
const Wraps = styled.div`
// border:1px solid black;
min-width:400px;
padding:1em;

`
const WrapSearch = styled.div`
margin:0 auto;
display:flex;
justify-content:space-between;
align-items:center;
// width:70%;
`
const WrapChat = styled.div`
border:1px solid black;
margin:1em auto;
width:90%;
height:500px;
`
const WrapControl = styled.div`
margin:0 auto;
display:flex;
justify-content:flex-end;
align-items:center;
// width:70%;
`
const CircleBtn = styled.div`
min-width:30px;
height:30px;
display:flex;
justify-content:center;
align-items:center;
font-size:1.5em;
font-weight:1000;
background:gray;
border-radius:50%;
line-height:1.5;
transition:.5s ease-in;
cursor:pointer;
user-select:none;
&:hover{
color:white;
background:black;
transform:rotate(360deg)
}
`
const Chat = () => {
  const { chatting } = useSelector(formSelector)
  const dispatch = useDispatch()
  const changePosition = (form: string, position: { x: number, y: number }) => {
    dispatch(formActions.changePosition({ form, position }))
  }
  const chattingPos = useDrag(params => { changePosition('chatting', { x: params.offset[0] + 250, y: params.offset[1] + 300 }) })
  return (
    <div>
      {chatting.visible && <Wraps>
        <div {...chattingPos()} style={{
          color: 'black',
          position: 'fixed',
          top: chatting.position.y,
          left: chatting.position.x,
          zIndex: 2,
          textAlign: 'center',
          boxSizing: 'border-box',

        }}>
          <div style={{ width: '480px', padding: '2rem 0', userSelect: 'none' }}></div>
        </div>
        <div style={{ position: 'fixed', top: chatting.position.y, left: chatting.position.x, zIndex: 1, }}>

          <div style={{ border: "1px solid black", padding: "10px", marginTop: "2em" }}>

            <WrapSearch>
              <div style={{ marginTop: '5em' }}>
              </div>
              <input type="date" name="date" id="date" />
              <input type="date" name="date" id="date" />
              <Button color={"white"} width={'100px'} bgcolor="darkcyan">검색</Button>
            </WrapSearch>
            <WrapChat></WrapChat>
            <WrapControl>
              <CircleBtn>+</CircleBtn>
              <input type="text" name="message" id="" />
              <Button color={"white"} width={'100px'} bgcolor="darkcyan" >전송</Button>
              <Button color={"white"} width={'100px'} bgcolor="darkcyan" >사진</Button>
            </WrapControl>
          </div>
        </div>

      </Wraps >}
    </div>
  );
};

export default Chat;