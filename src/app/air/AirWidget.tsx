import React, { useState } from "react"
import AirApp from "./AirApp"
import AirLocal from "./AirLocal"

interface AirWidgetProps {
  selectedStation: string | null
}

export default function AirWidget({ selectedStation }: AirWidgetProps) {
  const [isAppView, setIsAppView] = useState(false)

  return (
    <div style={{ height: "100%", width: "100%", overflow: "auto" }}>
      {isAppView ? (
        <AirApp onBack={() => setIsAppView(false)} />
      ) : (
        <AirLocal
          onShowApp={() => setIsAppView(true)}
          selectedStation={selectedStation}
        />
      )}
    </div>
  )
}
