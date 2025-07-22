import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { v4 as uuidv4 } from 'uuid'
import { env } from '~/config/environment'
import { userModel } from '~/models/userModel'
import { JwtProvider } from '~/providers/JwtProvider'

import ApiError from '~/utils/ApiError'
import { pickUser } from '~/utils/formatters'

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
    // const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`

    // const customSubject = 'Please verify your email address before using our service!'
    // const htmlContent = `
    //   <p>Dear ${getNewUser.displayName},</p>
    //   <p>Please click the link below to verify your email address:</p>
    //   <p><a href="${verificationLink}">Verify Email</a></p>
    //   <p>Thank you for using our service!</p>
    // `

    // Gửi email xác thực (with fallback to mock service if Brevo fails)
    // await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)

    // return trả về dữ liệu cho phía Controller
    return pickUser(getNewUser)
  } catch (error) { throw error }
}

const verifyAccount = async (reqBody) => {
  try {
    const existingUser = await userModel.findOneByEmail(reqBody.email)

    if (!existingUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    if (existingUser.isActive) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is already active')
    }

    if (existingUser.verifyToken !== reqBody.token) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Invalid verification token')
    }

    const updatedData = {
      isActive: true,
      verifyToken: null
    }
    const updatedUser = await userModel.update(existingUser._id, updatedData)
    return pickUser(updatedUser)
  } catch (error) { throw error }
}

const login = async (reqBody) => {
  try {
    const existingUser = await userModel.findOneByEmail(reqBody.email)

    if (!existingUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    if (!existingUser.isActive) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active')
    }

    const matchPassword = bcrypt.compareSync(reqBody.password, existingUser.password)

    if (!matchPassword) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Invalid password')
    }

    // Nếu mọi thứ check ok thì bắt đầu tạo tokens đăng nhập để trả về cho FE
    // Thông tin sẽ đính kèm JWT Token bao gồm _id và email của user
    const userInfo = {
      _id: existingUser._id,
      email: existingUser.email
    }

    // Tạo ra 2 loại token: accessToken và refreshToken để trả về phía FE
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
      // 5
    )
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )

    // Trả về thông tin của user kèm theo 2 loại token
    return {
      accessToken,
      refreshToken,
      ...pickUser(existingUser)
    }


  } catch (error) { throw error }
}

const refreshToken = async (refreshToken) => {
  try {
    const decoded = await JwtProvider.verifyToken(
      refreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    const userInfo = {
      _id: decoded._id,
      email: decoded.email
    }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    return {
      accessToken
    }
  } catch (error) { throw error }
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken
}
