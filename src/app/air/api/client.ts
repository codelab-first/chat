import axios from "axios"

const client = axios.create({
  baseURL: "/apis/B552584/ArpltnInforInqireSvc",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("API 키 에러:", error.message)
    } else if (error.response?.status === 400) {
      console.error("잘못된 요청 파라미터:", error.message)
    }
    return Promise.reject(error)
  }
)

export default client
