import { useState, useRef, useEffect, useContext } from 'react';
import styled from '@emotion/styled'
import { css } from "@emotion/react";
import Button from './Button'
import { useSelector, useDispatch } from "react-redux";
import { formSelector, formActions } from '../../store/slices/form-slice';
import { useDrag } from '@use-gesture/react';
import { chatData } from '../../store/slices/chat-slice'
import { tokenData } from '../../store/slices/token-slice'
import axios from 'axios';
import { FaCalendarAlt, FaPaperPlane, FaCamera, FaSearch } from "react-icons/fa";
import { imageInsert } from '../../modules/createFormData'
import { io } from "socket.io-client";
import './chat.scss'
import AirLocal from '../../app/air/AirLocal';
import { AirDataContext } from '../../providers/AirDataProvider';
import { authData } from '../../store/slices/auth-slice';


import HeaderTop from "./header";

type props = {
  screenMode: boolean
}

const Wraps = styled.div`
width:400px;
padding:1em;
position:relative;

//추가
@media (max-width:860px){
width:100%;

}
`
const WrapSearch = styled.div`
margin:0 auto;
display:flex;
justify-content:space-between;
align-items:center;
`
const WrapChat = styled.div`
margin:1em auto;
width:90%;
height:500px;
background:white;
box-shadow: 0px 4px 12px rgba(0,0,0,0.15); 
overflow-y:scroll;

//추가
@media (max-width:860px){
height:300px;
}
`
const WrapControl = styled.div`
margin:0 auto;
display:flex;
justify-content:flex-end;
align-items:center;
width:90%;
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
}
`

const Chat: React.FC<props> = ({ screenMode }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { chatting } = useSelector(formSelector)
  const { token, user } = useSelector(tokenData)
  const [rise, setRise] = useState(false)
  const dispatch = useDispatch()
  const changePosition = (form: string, position: { x: number, y: number }) => {
    dispatch(formActions.changePosition({ form, position }))
  }
  const chattingPos = useDrag(params => { changePosition('chatting', { x: params.offset[0] + 600, y: params.offset[1] + 100 }) })

  const { imageList } = useSelector(chatData)
  const [message, setMessage] = useState('')
  const [chats, setChats] = useState<{ chat: string, name: string, image: string[] }[]>([])
  const [day, setDay] = useState<{ [key: string]: string }>({});

  const daySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDay(prev => ({ ...prev, [name]: value }))
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMessage(value)
  }

  const onInsertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = imageInsert(e, imageList)
    sendImage(await formData)
  }

  const onSubmit = async (e: any) => {
    e.preventDefault();
    send();
    setMessage('')
  }

  const sendImage = async (formData: FormData) => {
    formData.append('user', JSON.stringify(user))
    return await axios.post('http://localhost:3000/chat/images', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
  }

  const send = async () => {
    if (!message) return;
    return await axios.post('http://localhost:3000/chat/chat', { message, user })
  }

  const chatInit = async () => {
    const result = await axios.get('http://localhost:3000/chat/init')
    setChats([])
    result.data.map((newData: any) => {
      if (newData.image) {
        newData.image = newData.image.split(",")
      }
    })
    setChats(result.data)
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
    }
  }
  const { airLocal } = useContext(AirDataContext)
  useEffect(() => {
    const socket = io('http://localhost:3000', {
      auth: {
        token: token.accessToken
      }
    });
    socket.on('connect', () => {
      console.log('서버에 연결되었습니다.');
    });
    socket.on('disconnect', () => {
      console.log('서버와 연결이 끊어졌습니다.');
    });
    socket.on('message', (data: { chat: string, name: string, image: string[] }) => {
      setChats(prev => [...prev, data])
    })
    socket.on('connect_error', (error) => {
      console.error('연결 오류:', error.message);
    });
  }, [])

  const riseUp = () => {
    setRise(!rise)
  }

  useEffect(() => {
    setTimeout(scrollToBottom, 100)
  }, [chats])

  const onSearch = async () => {
    const result = await axios(`http://127.0.0.1:3000/chat/searchByDay?startDay=${day.startDay}&endDay=${day.endDay}`)
    setChats([])
    setChats(result.data)
  }

  useEffect(() => {
    if (chatting.visible) {
      chatInit()
    }
  }, [chatting.visible])

  return (
    <div>
      {chatting.visible || screenMode ? 'width:true' : 'width:false'}
      {(chatting.visible || screenMode) && <Wraps>
        {!screenMode && <div {...chattingPos()} style={{
          color: 'black',
          position: 'fixed',
          top: chatting.position.y,
          left: chatting.position.x,
          zIndex: 2,
          textAlign: 'center',
          boxSizing: 'border-box',
          cursor: 'move'
        }}>
          {screenMode ? <div style={{ width: `370px`, padding: '1rem 0', userSelect: 'none', marginTop: '1em' }}></div> :
            <div style={{ width: `420px`, padding: '1rem 0', userSelect: 'none', marginTop: '2em', }}></div>}
        </div>}

        <div className='chat_outline' style={{ top: chatting.position.y, left: chatting.position.x, zIndex: 1 }}>
          <div style={{
            maxWidth: "100%",
            background: "rgba(255, 255, 255, 0.8)",
            border: "3px solid #2E7D32",
            borderRadius: "12px",
            padding: "1.5em",
            // marginTop: "2em"
          }}>
            <WrapChat ref={scrollRef} onClick={() => { if (rise) riseUp() }}>
              {screenMode && <HeaderTop />}
              <div className="chats" style={{ position: 'relative' }}>

                <AirLocal selectStation={airLocal} />

                {chats?.map((message, index) => (
                  <div key={index}>
                    <div className='username' style={{ marginTop: "1.5em", marginLeft: ".3em", fontSize: '.8em', color: 'gray' }}>
                      {message.name === 'system' ? '' : message.name === user?.name ? " " : message.name}
                    </div>

                    {/* 글 메시지 */}
                    {message.chat && (
                      <div>
                        <div
                          style={{
                            background: message?.name === user?.name
                              ? "rgba(255, 245, 157, 0.85)" // 🟡 내가 보낸 메시지
                              : "rgba(200, 230, 201, 0.8)", // 🟢 받은 메시지
                            padding: "1em .4em",
                            borderRadius: "8px",
                            fontSize: "1em",
                            maxWidth: "60%",
                            display: "inline-block"
                          }}
                          className={`chat ${message.name === 'system'
                            ? 'center'
                            : message?.name === user?.name
                              ? 'right'
                              : 'left'}`}
                        >
                          {message.chat}
                        </div>
                      </div>
                    )}

                    {/* 이미지 메시지 (글메세지와 동일한 말풍선 양식 적용) */}
                    {(message?.image || message?.image?.length > 0) && (
                      <div
                        style={{
                          background: message?.name === user?.name
                            ? "rgba(255, 245, 157, 0.85)" // 🟡 내가 보낸 이미지
                            : "rgba(200, 230, 201, 0.8)", // 🟢 받은 이미지
                          padding: "1em .4em",
                          borderRadius: "8px",
                          fontSize: "1em",
                          maxWidth: "60%",
                          display: "inline-block",
                          marginTop: "0.5em"
                        }}
                        className={`chat ${message.name === 'system'
                          ? 'center'
                          : message?.name === user?.name
                            ? 'right'
                            : 'left'}`}
                      >
                        {message?.image && (Array.isArray(message?.image)
                          ? message.image.map(img => (
                            <img
                              key={img}
                              src={`http://localhost:3000${img}`}
                              alt="img"
                              width='100px'
                              style={{
                                borderRadius: "6px",
                                display: "block",
                                margin: "4px auto",
                                maxWidth: "100%"
                              }}
                            />
                          ))
                          : <img
                            key={index}
                            src={`http://localhost:3000${message?.image}`}
                            alt="img"
                            width="100px"
                            style={{
                              borderRadius: "6px",
                              maxWidth: "100%",
                              display: "block",
                              margin: "4px auto"
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </WrapChat>

            <div className={`menu ${rise ? "up" : ''}`}>
              <WrapSearch className="search">
                <div style={{ display: "flex", alignItems: "center", marginTop: '5em' }}></div>
                <input type="date" name="startDay" id="date" value={day.startDay} onChange={daySelect} />
                <input type="date" name="endDay" id="date" value={day.endDay} onChange={daySelect} />
                <Button
                  onClick={onSearch}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4em",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    color: "white",
                    border: "none",
                    borderRadius: "2em",
                    padding: "0.4em 1em",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: "bold",
                    transition: "0.3s ease"
                  }}
                >
                  <FaSearch />
                </Button>              </WrapSearch>
            </div>

            <WrapControl>
              {/* 달력 버튼 (회색 원) */}
              <div
                onClick={riseUp}
                style={{
                  minWidth: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  background: "#ccc",       // 입력창 보더와 같은 회색
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: "1rem",
                  marginRight: "0.5em",
                  cursor: "pointer"
                }}
              >
                <FaCalendarAlt />
              </div>

              <form className="control" onSubmit={onSubmit} style={{ display: "flex", alignItems: "center" }}>
                <input type="text" onChange={onChange} value={message} />

                {/* 전송 버튼 (라운드 네모, 텍스트+아이콘) */}
                <button
                  type="submit"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "0.55em 0.8em",
                    borderRadius: "8px",
                    background: "#388E3C",
                    color: "white",
                    border: "none",
                    marginLeft: "0.5em",
                    cursor: "pointer"
                  }}
                >
                  <FaPaperPlane />
                </button>

                {/* 사진 버튼 (연두색 원) */}
                {/* 사진 버튼 (연두색 동그라미, 네모 제거) */}
                <label
                  htmlFor="photo"
                  style={{
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",       // 동그라미
                    background: "#81C784",     // 초록색
                    color: "white",
                    cursor: "pointer",
                    marginLeft: "0.5em",
                    border: "none"             // 네모 테두리 제거
                  }}
                >
                  <FaCamera />
                </label>
                <input
                  type="file"
                  id="photo"
                  name="images"
                  multiple
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={onInsertImage}
                />
              </form>
            </WrapControl>
          </div>
        </div>
      </Wraps>}
    </div>
  );
};

export default Chat;