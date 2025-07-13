import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'


// Khởi tạo instance của axios
let fetcher = axios.create()

// Thời gian chờ tối đa của 1 request là 10 phút
fetcher.defaults.timeout = 1000 * 60 * 10

// withCredentials: Sẽ cho phép axios tự động gửi cookie trong mỗi request lêb BE (phục vụ việc lưu JWT tokens: refresh token & access token vào trong httpOnly cookie của Browser)
fetcher.defaults.withCredentials = true

// config Interceptors

// Request Interceptors: can thiệp vào giữa request gửi đi
fetcher.interceptors.request.use(
  (config) => {
    // Khi request gửi đi thì sẽ gọi interceptorLoadingElements để làm mờ UI, chặn người dùng spam click
    interceptorLoadingElements(true)

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptors: can thiệp vào giữa response nhận về
fetcher.interceptors.response.use(
  (response) => {
    // Khi response nhận về thì sẽ gọi interceptorLoadingElements để trả về UI, cho phép người dùng click
    interceptorLoadingElements(false)

    return response
  },
  (error) => {
    // Khi response nhận về thì sẽ gọi interceptorLoadingElements để trả về UI, cho phép người dùng click
    interceptorLoadingElements(false)

    // Mọi mã http status code nằm ngoài khoảng 200 - 299 sẽ là error và rơi vào đây

    // Xử lý tập trung phần hiển thị thông báo lõi trả về từ mọi API ở đây
    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }
    // Dùng toast để hiển thị thông báo lỗi
    // Ngoại trừ mã 410 - GONE phục vụ việc tự động refresh token
    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default fetcher
