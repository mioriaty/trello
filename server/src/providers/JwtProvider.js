
import JWT from 'jsonwebtoken'

/**
 * Function tạp mới một token - cần 3 tham số đầu vào
 * - userInfo: Những thông tin muốn đính kèm vào token
 * - secretSignature: Chữ ký bí mật
 * - tokenLife: Thời gian sống của token
 */
const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    return JWT.sign(userInfo, secretSignature, {
      expiresIn: tokenLife,
      algorithm: 'HS256'
    })
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Function để kiểm tra 1 token có hợp lệ không
 * Hợp lệ ở đây là cái token được tạo ra có đúng với cái chữ bí mật secretSignature trong dự án không
 */
const verifyToken = async (token, secretSignature) => {
  try {
    return JWT.verify(token, secretSignature)
  } catch (error) {
    throw new Error(error)
  }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}
