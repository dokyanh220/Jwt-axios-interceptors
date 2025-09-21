import axios from 'axios'
import { toast } from 'react-toastify'

// Khởi tạo đối tượng Axios(authorizeAxiosInstance) mục đích để custom và cấu hình chung cho dự án
let authorizeAxiosInstance = axios.create()
// Thời gian chờ tối đa của 1 request: để 10 phút
authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 10
// witdhCredentials: sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta sẽ lưu Jwt tokens (refesh & access)
// vào trong httpOnly Cookie của trình duyệt)
authorizeAxiosInstance.defaults.withCredentials = true

// Interceptor request can thiệp vào giữa những request API
authorizeAxiosInstance.interceptors.request.use((config) => {
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Interceptor response can thiệp vào giữa response nhận về từ API
authorizeAxiosInstance.interceptors.response.use((response) => {
  return response
}, (error) => {
  // Any status codes that falls outside the range of 200-299 cause this function to trigger
  // Dùng toastify để hiện bất kể mã lỗi trên màn hình - ngoại trừ mã 410 - GONE phục vụ việc tự động refesh lại token
  if (error.response?.status !== 410) {
    toast.error(error.response?.message || error?.message)
  }
  return Promise.reject(error)
})

export default authorizeAxiosInstance