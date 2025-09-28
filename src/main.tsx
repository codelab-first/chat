import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import App from "./App.tsx"
import "../src/assets/styles/app.scss"
import { store, persistor } from './store'
import { PersistGate } from "redux-persist/integration/react"
import AlertProvider from "./providers/AlertProvider.tsx"
import ErrorProvider from "./providers/ErrorProvider.tsx"
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from './components/common/ErrorFallback.tsx'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분 캐시
      retry: 2,
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <ErrorProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AlertProvider>
            <BrowserRouter>
              <QueryClientProvider client={queryClient}>
                <App />
              </QueryClientProvider>
            </BrowserRouter>
          </AlertProvider>
        </PersistGate>
      </Provider>
    </ErrorProvider>
  </ErrorBoundary>

)
