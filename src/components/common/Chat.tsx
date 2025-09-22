import React, { useState } from "react"
import styled from "@emotion/styled"
import { useSelector, useDispatch } from "react-redux";
import { formSelector, formActions } from '../../store/slices/form-slice';
import { useDrag } from 'react-use-gesture';
const Wraps = styled.div`
  border: 1px solid black;
  max-width: 500px;
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

const Header = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  max-width: 700px;
  margin: 0 auto;
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
const Box = styled.div`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`

const Tilde = styled.span`
  font-size: 1.2em;
  color: #333;
`

const ChatArea = styled.div`
  border: 2px solid #666;
  box-shadow: 0 4px 8px rgba(0, 0, 0);
  border-radius: 5px;
  width: 90%;
  height: 80%;
  padding: 15px;
  background-color: #f9f9f9;
  overflow-y: auto;
  margin-bottom: 20px;
`

const InputArea = styled.div`
  display: flex;
  justify-content:center;
align-items:center;
  gap: 10px;
  width: 90%;
  margin-bottom: 20px;
`

const InputBox = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`

const SendButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
`

const PhotoButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #28a745;
  color: white;
  border-radius: 5px;
  cursor: pointer;
`

const Chat = () => {

  const [selectedDate1, setSelectedDate1] = useState("")
  const [selectedDate2, setSelectedDate2] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<string[]>([])

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, message])
      setMessage("")
    }
  }

  const handlePhoto = () => {
    console.log("사진 버튼 클릭")
  }
  const { chatting } = useSelector(formSelector)
  const dispatch = useDispatch()
  const changePosition = (form: string, position: { x: number, y: number }) => {
    dispatch(formActions.changePosition({ form, position }))
  }
  const chattingPos = useDrag(params => { changePosition('chatting', { x: params.offset[0] + 250, y: params.offset[1] + 300 }) })
  return (
    <>
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
          <div style={{ width: '450px', padding: '1rem', userSelect: 'none', background: "yellow" }}></div>
        </div>
        <div style={{ position: 'fixed', top: chatting.position.y, left: chatting.position.x, zIndex: 1 }}>

          <Header>
            <Box>
              <input
                type="date"
                value={selectedDate1}
                onChange={(e) => setSelectedDate1(e.target.value)}
                style={{ width: "100%", padding: "8px", border: "none" }}
              />
            </Box>
            <Tilde>~</Tilde>
            <Box>
              <input
                type="date"
                value={selectedDate2}
                onChange={(e) => setSelectedDate2(e.target.value)}
                style={{ width: "100%", padding: "8px", border: "none" }}
              />
            </Box>
            <Box>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색"
                style={{ width: "100%", padding: "8px", border: "none" }}
              />
            </Box>
          </Header>
          <ChatArea>
            {messages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </ChatArea>
          <InputArea>
            <CircleBtn>+</CircleBtn>
            <InputBox
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요"
            />
            <SendButton onClick={handleSend}>전송</SendButton>
            <PhotoButton onClick={handlePhoto}>사진</PhotoButton>
          </InputArea>
        </div>
      </Wraps>}
    </>
  )
}

export default Chat
