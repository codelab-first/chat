import { Button } from "@mui/material"
import { useEffect } from "react"
import styled from "@emotion/styled"

interface ErrorFallbackProps {
  error: any
  resetErrorBoundary: () => void
}

const ErrorContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`

const ErrorWrapper = styled.div`
  padding: 1.5em;
  background-color: rgba(255, 255, 255, 0.1);
  text-align: center;
  color: #f1f1f1;
`

const ErrorTitle = styled.h2`
  padding: 0.5em;
  font-size: 1.25em;
`

const ErrorContent = styled.p`
  padding: 0.5em;
  color: yellow;
`

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  const onReset = () => {
    // resetErrorBoundary()
    location.href = "/"
  }

  useEffect(() => {
    console.log(error)
  }, [error])

  return (
    <ErrorContainer>
      <ErrorWrapper role="alert">
        <ErrorTitle>오류가 발생했습니다.</ErrorTitle>
        {error?.detail?.msg ? (
          <ErrorContent>{error.detail.msg}</ErrorContent>
        ) : (
          <ErrorContent>{error?.message || "알 수 없는 오류가 발생했습니다."}</ErrorContent>
        )}
        <Button
          onClick={onReset}
          variant="outlined"
          color="warning"
          style={{ marginTop: "1em" }}
        >
          메인으로 돌아가기
        </Button>
      </ErrorWrapper>
    </ErrorContainer>
  )
}
