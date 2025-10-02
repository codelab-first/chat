// chat/src/components/left/Air.tsx
import React from "react"
import styled from "@emotion/styled"
// ✅ index.tsx까지 명시
import AirWidget from "../../app/air/AirWidget.tsx"

const Wraps = styled.div`
  border: 1px solid black;
  width: 50%;
  height: 70vh;
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  overflow: hidden;
  flex:1;
`
interface AirProps {
  selectedStation?: string | null,
  screenMode: string
}

const Air: React.FC<AirProps> = ({ selectedStation, screenMode }) => {
  return (
    <Wraps>
      {screenMode === "full" && <AirWidget selectedStation={selectedStation} />}
    </Wraps>
  )
}

export default Air
