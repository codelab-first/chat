import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/apis": {
        target: "http://apis.data.go.kr",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apis/, ""),
      },
    },
  },
})
