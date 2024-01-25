import { StatusCodes } from 'http-status-codes'
import { generateToken } from '~/config/jwtToken'
import { generateRefreshToken } from '~/config/refreshToken'
import { authService } from '~/services/authService'
import ApiError from '~/utils/ApiError'

const register = async (req, res, next) => {
  try {
    const user = await authService.createUser(req.body)
    res.status(StatusCodes.CREATED).json({ user })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await authService.loginUser(email, password)
    const refreshToken = await generateRefreshToken(user?._id)
    const token = await generateToken(user?._id)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 7
    })

    res.status(StatusCodes.OK).json({
      userName: user.fullName,
      userEmail: user.email,
      userRole: user.role,
      userAvatar: user.avatar,
      token,
      refreshToken
    })
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'No refresh token')
    }

    const user = await authService.verifyRefreshToken(refreshToken)
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'No user')
    }

    const newRefreshToken = await generateRefreshToken(user._id)
    const token = await generateToken(user._id)

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 7
    })

    res.status(StatusCodes.OK).json({
      userName: user.fullName,
      userEmail: user.email,
      userRole: user.role,
      userAvatar: user.avatar,
      token,
      refreshToken: newRefreshToken
    })
  } catch (error) {
    next(error)
  }
}

const logoutUser = async (req, res, next) => {
  try {
    const cookie = req.cookies
    if (!cookie?.refreshToken) throw new ApiError(StatusCodes.UNAUTHORIZED, 'No refresh token in Cookies')
    const refreshToken = cookie.refreshToken
    const user = await authService.verifyRefreshToken(refreshToken)

    if (!user) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
      })
      return res.status(StatusCodes.FORBIDDEN)
    }
    await authService.logout(user._id)

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true
    })
    res.status(StatusCodes.OK).json({ message: 'Logout successfully' })
  } catch (error) {
    next(error)
  }
}

const getAllUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers()

    res.status(StatusCodes.OK).json({ users })
  } catch (error) {
    next(error)
  }
}

export const authController = {
  register,
  login,
  refreshToken,
  getAllUsers,
  logoutUser
}