// chat/src/components/left/Air.tsx
import React from "react"
import styled from "@emotion/styled"
// ✅ index.tsx까지 명시
import AirWidget from "../../app/air/AirWidget.tsx"

const Wraps = styled.div`
  border-radius:12px;
  width: 50%;
  height: 70vh;
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  overflow: hidden;
  flex:1;
  background:white;
  @media (max-width:860px){
    display:none;
  }
`
interface AirProps {
  selectedStation?: string | null,

}

const Air: React.FC<AirProps> = ({ selectedStation }) => {
  return (
    <Wraps>
      <AirWidget selectedStation={selectedStation} />
    </Wraps>
  )
}

export default Air
