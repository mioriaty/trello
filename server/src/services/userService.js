import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { env } from '~/config/environment'

const createNew = async (reqBody) => {
  try {
    // Check email exist
    const existingUser = await userModel.findOneByEmail(reqBody.email)

    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists')
    }

    // Tạo data để lưu vào Database
    const nameFromEmail = reqBody.email.split('@')[0]
    const hashedPassword = await bcrypt.hash(reqBody.password, 8)

    const newUser = {
      email: reqBody.email,
      password: hashedPassword,
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }

    // Thực hiện lưu thông tin user vào Database
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    // Gửi email cho người dùng xác thực tài khoản (buổi sau...)
    const verificationLink = `${env.WEBSITE_DOMAIN_DEVELOPMENT}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`

    const customSubject = 'Please verify your email address before using our service!'
    const customContent = `
      <p>Dear ${getNewUser.displayName},</p>
      <p>Please click the link below to verify your email address:</p>
      <p><a href="${verificationLink}">Verify Email</a></p>
      <p>Thank you for using our service!</p>
    `


    // return trả về dữ liệu cho phía Controller
    return pickUser(getNewUser)
  } catch (error) { throw error }
}


export const userService = {
  createNew
}
