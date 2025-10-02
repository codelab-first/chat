import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled'
import { css } from "@emotion/react";
import Button from './Button'
import { useSelector, useDispatch } from "react-redux";
import { formSelector, formActions } from '../../store/slices/form-slice';
import { useDrag } from '@use-gesture/react';
import { chatData, chatActions } from '../../store/slices/chat-slice'
import { tokenData } from '../../store/slices/token-slice'
import axios from 'axios';
import { imageInsert } from '../../modules/createFormData'
import { io } from "socket.io-client";
import './chat.scss'
import { apiPost } from '../../modules/api';
import { authData } from '../../store/slices/auth-slice';

import HeaderTop from "./header";
type props = {
  screenMode: boolean
}
const Wraps = styled.div`
// border:1px solid black;
width:400px;
padding:1em;
position:relative;
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
border:1px solid black;

margin:1em auto;
width:90%;
height:500px;
background:white;
box-shadow:0px 0px 8px 4px  rgba(.3,.3,.3,.3);
overflow-y:scroll;
@media (max-width:860px){
height:360px;
}
@media (max-width:860px){
height:360px;
}



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
  // transform:rotate(360deg)
  }
  // &:active{
  //   transform:rotate(360deg)
  //   }
    `

// const MessageDiv = styled.div<{ wrap: string, height: number }>`
//     ${props => props.wrap && css`text-wrap:${props.wrap}`};
//     // ${props => props.height && css`height:${((props.height - 1) * 2)}`};

//   // textWrap: 'wrap', width: "150px", height: "10px", background: 'yellow', position: 'absolute'
//   `
const Chat: React.FC<props> = ({ screenMode }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  // const { userData } = useSelector(authData)
  const { chatting } = useSelector(formSelector)
  const { token, user } = useSelector(tokenData)
  const [rise, setRise] = useState(false)
  const dispatch = useDispatch()
  const changePosition = (form: string, position: { x: number, y: number }) => {
    dispatch(formActions.changePosition({ form, position }))
  }
  const chattingPos = useDrag(params => { changePosition('chatting', { x: params.offset[0] + 600, y: params.offset[1] + 100 }) })

  const { imageList, status, messages } = useSelector(chatData)
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
    // imageList가 비어있으면 비어 있는대로 => 생성
    // imageList에 데이터가 있으면 있는대로 => 수정
    // 결과적으로 imageList와 조합해서 새로운 formData를 만들어 주는 함수인 것
    const formData = imageInsert(e, imageList)
    // console.log(formData)
    // dispatch(chatActions.addImage(await formData))
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

    // console.log('message', message)
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


  useEffect(() => {
    const socket = io('http://localhost:3000', {
      auth: {
        token: token.accessToken // auth 속성을 통해 토큰을 전달
      }
    });
    socket.on('connect', () => {
      console.log('서버에 연결되었습니다.');
    });

    socket.on('disconnect', () => {
      console.log('서버와 연결이 끊어졌습니다.');
    });

    socket.on('message', (data: { chat: string, name: string, image: string[] }) => {
      console.log('data', data)
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
      // alert('채팅창 열림')
    }
  }, [chatting.visible])
  return (
    <div>{chatting.visible || screenMode ? 'width:true' : 'width:false'}
      {(chatting.visible || screenMode) && <Wraps>
        {!screenMode && <div {...chattingPos()} style={{
          color: 'black',
          position: 'fixed',
          top: chatting.position.y,
          left: chatting.position.x,
          zIndex: 2,
          textAlign: 'center',
          boxSizing: 'border-box',

        }}>

          {screenMode ? <div style={{ width: `370px`, padding: '2rem 0', userSelect: 'none', background: 'transparent' }}></div> :
            <div style={{ width: `420px`, padding: '2rem 0', userSelect: 'none', background: 'transparent' }}></div>}

        </div>}
        <div className='chat_outline' style={{ top: chatting.position.y, left: chatting.position.x, zIndex: 1 }}>

          <div className='chat_inline' style={{ maxWidth: "100%", background: "lightyellow", border: "1px solid red", padding: "10px" }}>


            <WrapChat ref={scrollRef} onClick={() => {
              if (rise)
                riseUp()
            }}>
              <div className="chats">
                {screenMode && <HeaderTop />}
                {chats?.map((message, index) => {

                  // console.log('message.name', message.name, 'auth.name:', user?.name)
                  return (
                    <div key={index}>

                      <div className='username' style={{ marginTop: "1.5em", marginLeft: ".3em", fontSize: '.8em', color: 'gray' }}>
                        {message.name === 'system' ? '' : message.name === user?.name ? " " : message.name}
                      </div>

                      {message.chat && <div>
                        <div style={{ background: 'yellow', padding: '1em .4em', borderRadius: '4px', fontSize: '1em' }} className={`chat ${message.name === 'system' ? 'center' : message?.name === user?.name ? 'right' : 'left'}`}>{message.chat && message.chat}</div>
                      </div>}

                      <div>
                        {(message?.image || message?.image?.length > 0) && <div style={{ borderRadius: '4px', fontSize: '1em' }} className={`chat ${message.name === 'system' ? 'center' : message?.name === user?.name ? 'right' : 'left'}`}>

                          {message?.image && (Array.isArray(message?.image) ? message.image.map(img =>
                            <img key={img} src={`http://localhost:3000${img}`} alt='img' width='100px'></img>
                          ) : <img key={index} src={`http://localhost:3000${message?.image}`} alt='img' width='100px' />)}
                        </div>}
                      </div>
                      <div>

                      </div>
                    </div>)
                })}
              </div>
            </WrapChat>
            <div className={`menu ${rise ? "up" : ''}`}>
              <WrapSearch className={`search ${rise ? '' : 'down'}`}>
                <div style={{ marginTop: '5em' }}>
                </div>
                <input type="date" name="startDay" id="date" value={day.startDay} onChange={daySelect} />
                <input type="date" name="endDay" id="date" value={day.endDay} onChange={daySelect} />
                <Button color={"white"} width={'100px'} bgcolor="darkcyan" onClick={onSearch}>검색</Button>
              </WrapSearch>
            </div>
            <WrapControl>
              <CircleBtn onClick={riseUp} className={rise ? 'rise' : ''}>+</CircleBtn>

              <form className="control" onSubmit={onSubmit}>
                <input type="text" onChange={onChange} value={message} />
                <Button color={"white"} width={'100px'} bgcolor="darkcyan" marginLeft=".5em">전송</Button>
                <label htmlFor="photo" className='btn'>사진</label>
                <input type="file" name="images" id="photo" onChange={onInsertImage} multiple accept='image/*' />
              </form>
            </WrapControl>
          </div>
        </div>

      </Wraps >}
    </div >
  );
};

export default Chat;
