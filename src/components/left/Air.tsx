// chat/src/components/left/Air.tsx
import React from "react"
import styled from "@emotion/styled"
// ✅ index.tsx까지 명시
import AirWidget from "../../app/air/index.tsx"

const Wraps = styled.div`
  border: 1px solid black;
  width: 50%;
  height: 70vh;
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  overflow: hidden;
`

const Air = () => {
  return (
    <Wraps>
      <AirWidget />
    </Wraps>
  )
}

export default Air
