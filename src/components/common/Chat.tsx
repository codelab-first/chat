import React, { useState } from "react"
import styled from "@emotion/styled"

const Wraps = styled.div`
  border: 1px solid black;
  width: 50%;
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

const Chat = () => {
  const [selectedDate1, setSelectedDate1] = useState("")
  const [selectedDate2, setSelectedDate2] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <Wraps>
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
    </Wraps>
  )
}

export default Chat
