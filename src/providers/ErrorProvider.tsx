// ERROR_API -> 오류페이지
// ERROR_BIZ -> Alert으로 보내서 alert창을 띄운다.

import { createContext, useEffect, useState, ReactNode } from "react"
import { useErrorBoundary } from "react-error-boundary"
interface ErrorContextType {
  rootError: any
}
export const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export default function ErrorProvider({ children }: { children: ReactNode }) {
  const [rootError, setRootError] = useState(null)
  const { showBoundary } = useErrorBoundary()

  useEffect(() => {
    const onError = (e: any) => {
      console.log("ErrorProvider", e)
      if (e?.detail?.cod === 403) {
        location.href = "/login"
      } else {
        showBoundary(e)
      }
    }
    const onBizError = (e: any) => {
      console.log("ErrorProvider", e)
      setRootError(e.detail)
    }

    window.addEventListener("ERROR_API", onError)
    window.addEventListener("ERROR_BIZ", onBizError)
    return () => {
      window.removeEventListener("ERROR_API", onError)
      window.removeEventListener("ERROR_BIZ", onBizError)
    }
  }, [])

  return (
    <ErrorContext.Provider value={{ rootError }}>
      {children}
    </ErrorContext.Provider>
  )
}
