import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'
import ApiError from '~/utils/ApiError'

const isAuthorized = async (req, res, next) => {
  // Lấy accessToken nằm trong request cookie bên phía FE - withCredentials: true
  const clientAccessToken = req.cookies?.accessToken

  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized'))
    return
  }

  try {
    // Bước 01: Thực hiện giải mã token xem nó có hợp lệ hay không
    const jwtDecoded = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)

    // Bước 02: Nếu như token hợp lệ, lưu thông tin giải mã vào trong req.jwtDecoded, để sử dụng cho các tầng cần xử lý tiếp
    req.jwtDecoded = jwtDecoded

    // Bước 03: Cho phép request đi tiếp
    next()
  } catch (error) {
    // Nếu accessToken bị hết hạn thì trả về 410 cho FE biết để gọ refreshToken
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Access token expired'))
      return
    }

    // Nếu accessToken không hợp lệ thì trả về 401 cho FE biết
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized'))
  }
}

export const authMiddleware = {
  isAuthorized
}
