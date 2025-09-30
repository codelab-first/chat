import React from "react"
import MapDataContainer from "./MapDataContainer"

interface MapAppProps {
  setSelectedStation: React.Dispatch<React.SetStateAction<string | null>>
}

const MapApp: React.FC<MapAppProps> = ({ setSelectedStation }) => {
  return <MapDataContainer setSelectedStation={setSelectedStation} />
}

export default MapApp
