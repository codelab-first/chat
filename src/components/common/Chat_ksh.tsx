import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled'
import { css } from "@emotion/react";
import Button from './Button'
import { useSelector, useDispatch } from "react-redux";
import { formSelector, formActions } from '../../store/slices/form-slice';
import { useDrag } from '@use-gesture/react';
import { chatData, chatActions } from '../../store/slices/chat-slice'
import { authData } from '../../store/slices/auth-slice';
import { tokenData } from '../../store/slices/token-slice'
import { apiPost } from '../../modules/api';
import axios from 'axios';
import { imageInsert } from '../../modules/createFormData'
import { io } from "socket.io-client";
import './chat.scss'

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
background:white;
box-shadow:0px 0px 8px 4px  rgba(.3,.3,.3,.3);
overflow-y:scroll;
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
  &:active{
    transform:rotate(360deg)
    }
    `

const MessageDiv = styled.div<{ wrap: string, height: number }>`
${props => props.wrap && css`text-wrap:${props.wrap}`};
// ${props => props.height && css`height:${((props.height - 1) * 2)}`};

  // textWrap: 'wrap', width: "150px", height: "10px", background: 'yellow', position: 'absolute'
  `
const Chat = () => {
  // const { userData } = useSelector(authData)
  const { chatting } = useSelector(formSelector)
  const { token } = useSelector(tokenData)
  const { user } = useSelector(authData)
  const dispatch = useDispatch()
  const changePosition = (form: string, position: { x: number, y: number }) => {
    dispatch(formActions.changePosition({ form, position }))
  }
  const chattingPos = useDrag(params => { changePosition('chatting', { x: params.offset[0] + 600, y: params.offset[1] + 100 }) })

  const { imageList, status, messages } = useSelector(chatData)
  const [message, setMessage] = useState('')
  const [chats, setChats] = useState<{ message: string, name: string }[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)




  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMessage(value)
  }
  const onInsertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // imageList가 비어있으면 비어 있는대로 => 생성
    // imageList에 데이터가 있으면 있는대로 => 수정
    // 결과적으로 imageList와 조합해서 새로운 formData를 만들어 주는 함수인 것
    const formData = imageInsert(e, imageList)
    dispatch(chatActions.addImage(await formData))
  }
  const onSubmit = async (e: any) => {
    e.preventDefault();
    send();
    setMessage('')
  }
  const send = async () => {
    // socket.emit('message', { message })
    return await axios.post('http://localhost:3000/chat/chat', { message, user })
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

    socket.on('message', (data: { message: string, name: string }) => {
      setChats(prev => [...prev, data])
    })

    socket.on('connect_error', (error) => {
      console.error('연결 오류:', error.message);
    });
  }, [])
  useEffect(() => {
    return () => {
      // socket.off('chat', (data: { message: string }) => {
      //   // console.log('data', data.message)
      //   setChats(prev => [...prev, data])

      // })
    }
  }, [])


  useEffect(() => {
    // setChats(messages)
    setTimeout(scrollToBottom, 1000)
  }, [messages])

  // useEffect(() => {
  //   dispatch(chatActions.getChats())
  // }, [dispatch])
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

          <div style={{ background: "lightyellow", border: "1px solid black", padding: "10px", marginTop: "2em" }}>

            <WrapSearch>
              <div style={{ marginTop: '5em' }}>
              </div>
              <input type="date" name="date" id="date" />
              <input type="date" name="date" id="date" />
              <Button color={"white"} width={'100px'} bgcolor="darkcyan">검색</Button>
            </WrapSearch>

            <WrapChat ref={scrollRef}>
              <div className="chats" >
                {chats?.map((message, index) => {

                  // console.log('message.name', message.name, 'auth.name:', user?.name)
                  return (
                    <div key={index} style={{}}>
                      <div className='username' style={{ minHeight: "20px" }}>
                        {message.name === 'system' ? '' : message.name === user?.name ? " " : message.name}
                      </div>
                      {/* <div>a</div> */}
                      <div style={{ width: "100%", position: "relative" }}>
                        <MessageDiv wrap="wrap" height={1} style={{ textWrap: 'wrap', width: "150px", height: "10px", background: 'yellow', position: 'absolute' }} className={`chat ${message.name === 'system' ? 'center' : message?.name === user?.name ? 'right' : 'left'}`}>{message.message && message.message}</MessageDiv>
                      </div>
                      <div>
                        {/* {message.image && <img key={index} src={message.image} alt='img' width='100px'></img>} */}
                      </div>
                    </div>)
                })}
              </div>
            </WrapChat>

            <WrapControl>
              <CircleBtn>+</CircleBtn>
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