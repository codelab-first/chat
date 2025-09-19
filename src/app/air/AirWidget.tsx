import React, { useState } from "react"
import AirApp from "./AirApp"
import AirLocal from "./AirLocal"

export default function AirWidget() {
  const [isAppView, setIsAppView] = useState(false)

  return (
    <div style={{ height: "100%", width: "100%", overflow: "auto" }}>
      {isAppView ? (
        <AirApp onBack={() => setIsAppView(false)} />
      ) : (
        <AirLocal onShowApp={() => setIsAppView(true)} />
      )}
    </div>
  )
}
