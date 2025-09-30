import React, { useState } from "react"

const SIDO_LIST = [
  { value: "", label: "전국" },
  { value: "서울", label: "서울" },
  { value: "부산", label: "부산" },
  { value: "대구", label: "대구" },
  { value: "인천", label: "인천" },
  { value: "광주", label: "광주" },
  { value: "대전", label: "대전" },
  { value: "울산", label: "울산" },
  { value: "경기", label: "경기" },
  { value: "제주", label: "제주" },
]

type Props = {
  onBack: () => void
}

export default function AirSidoApp({ onBack }: Props) {
  const [selectedSido, setSelectedSido] = useState<string | null>("")
}