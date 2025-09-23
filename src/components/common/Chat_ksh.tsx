import { apiPost } from '../../modules/api';
import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled'
import Button from './Button'
import { useSelector, useDispatch } from "react-redux";
import { formSelector, formActions } from '../../store/slices/form-slice';
import { useDrag } from '@use-gesture/react';
import { chatData, chatActions } from '../../store/slices/chat-slice'
import { authData } from '../../store/slices/auth-slice';
import io from 'socket.io-client'
import { imageInsert } from '../../modules/createFormData'
import axios from 'axios'
const socket = io('/', { withCredentials: true, path: '/socket.io' })

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
box-shadow:0px 0px 8px 4px  rgba(.3,.3,.3,.3)
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
const Chat = () => {
  const { user } = useSelector(authData)
  const { chatting } = useSelector(formSelector)
  const dispatch = useDispatch()
  const changePosition = (form: string, position: { x: number, y: number }) => {
    dispatch(formActions.changePosition({ form, position }))
  }
  const chattingPos = useDrag(params => { changePosition('chatting', { x: params.offset[0] + 600, y: params.offset[1] + 100 }) })

  const { imageList, status, messages } = useSelector(chatData)
  const [message, setMessage] = useState('')
  const [chats, setChats] = useState<{ chat: string, name: string, image: string }[]>([])
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
    return await axios.post<{ message: string, user: { id: number, name: string } | null }, Promise<string>>('http://localhost:3000/chat/chat', { user, message })
  }
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
    }
  }
  useEffect(() => {
    if (!io) return
    // if (once.current) {
    //   once.current = false;
    //   return
    // }
    socket.on('chat', (data: { chat: string, name: string, image: string, userList: string[] }) => {
      console.log('data', data)
      setChats(prev => [...prev, data])
      if (data.image) {
        setTimeout(scrollToBottom, 1000)
      } else {
        setTimeout(scrollToBottom, 100)
      }
    })
    // once.current = true;
    return () => {
      socket.off('chat', (data: { chat: string, name: string, image: string, userList: string[] }) => {
        setChats(prev => [...prev, data])
      })
    }
  }, []);
  useEffect(() => {
    setChats(messages)
    setTimeout(scrollToBottom, 1000)
  }, [messages])

  useEffect(() => {
    dispatch(chatActions.getChats())
  }, [dispatch])
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

            <WrapChat>
              <div className="chats" ref={scrollRef}>
                {chats?.map((message, index) => {
                  // console.log('message.name', message.name, 'auth.name:', auth?.name)
                  // return (<div key={index} className={`chat ${message.name === 'system' ? 'center' : message?.name === auth?.name ? 'right' : 'left'}`}>
                  return (<div key={index} className={`chat  right `}>
                    <div className='username'>
                      {/* {message.name === 'system' ? '' : message.name === auth?.name ? "" : message.name} */}
                    </div>
                    {message.chat && message.chat}
                    <div>
                      {message.image && <img key={index} src={message.image} alt='img' width='100px'></img>}
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
    </div>
  );
};

export default Chat;