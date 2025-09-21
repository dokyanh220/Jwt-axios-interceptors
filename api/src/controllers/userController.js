import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { JwtProvider } from '~/providers/JwtProvider'

/**
 * Mock nhanh thông tin user thay vì phải tạo Database rồi query.
 * Nếu muốn học kỹ và chuẩn chỉnh đầy đủ hơn thì xem Playlist này nhé:
 * https://www.youtube.com/playlist?list=PLP6tw4Zpj-RIMgUPYxhLBVCpaBs94D73V
 */
const MOCK_DATABASE = {
  USER: {
    ID: 'dokyanh-sample-id-12345678',
    EMAIL: 'dokyanh.official@gmail.com',
    PASSWORD: 'dokyanh@123'
  }
}

/**
 * 2 cái chữ ký bí mật quan trọng trong dự án. Dành cho JWT - Jsonwebtokens
 * Lưu ý phải lưu vào biến môi trường ENV trong thực tế cho bảo mật.
 * Ở đây mình làm Demo thôi nên mới đặt biến const và giá trị random ngẫu nhiên trong code nhé.
 */
const ACCESS_TOKEN_SECRET_SIGNATURE = 'f6pl0ydSqdOw1XTnpaot2q6j99yVoS0G'
const REFRESH_TOKEN_SECRET_SIGNATURE = 'bk7hjr9OGQeHsUlInRVgP4DB3WbfVrsB'

const login = async (req, res) => {
  try {
    if (req.body.email !== MOCK_DATABASE.USER.EMAIL || req.body.password !== MOCK_DATABASE.USER.PASSWORD) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Your email or password is incorrect!' })
      return
    }

    // Trường hợp nhập đúng thông tin tài khoản, tạo token và trả về cho phía Client
    // Tạo thông tin payload để đính kèm trong Jwt Token: bao gồm _id và email ủa user
    const userInfo = {
      id: MOCK_DATABASE.USER.ID,
      email: MOCK_DATABASE.USER.EMAIL
    }

    // Tạo 2 loại token, accessToken và refeshToken để trả về FE
    const accessToken = await JwtProvider.genarateToken(
      userInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      '1h'
    )

    const refreshToken = await JwtProvider.genarateToken(
      userInfo,
      REFRESH_TOKEN_SECRET_SIGNATURE,
      '14 days'
    )

    /**
    * Xử lý trường hợp trả về http only cookie cho phía trình duyệt
    * Về cái maxAge và thư viện ms: https://expressjs.com/en/api.html
    * Đối với cái maxAge - thời gian sống của Cookie thì chúng ta sẽ để tối đa 14 ngày, tùy dự án. Lưu ý
    * thời gian sống của cookie khác với cái thời gian sống của token nhé. Đừng bị nhầm lẫn :D
    */
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    const response = {
      ...userInfo,
      accessToken,
      refreshToken
    }
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const logout = async (req, res) => {
  try {
    if (req.body.email !== MOCK_DATABASE.USER.EMAIL || req.body.password !== MOCK_DATABASE.USER.PASSWORD) {
      res.status(StatusCodes. UNAUTHORIZED).json({ message: 'Your email or password is incorrect!' })
      return
    }

    // Trường hợp nhập đúng thông tin tài khoản, tạo token và trả về cho phía Client
    // Tạo thông tin payload để đính kèm trong JWT Token: bao gồm id và email của user
    const userInfo = {

    }

    res.status(StatusCodes.OK).json({ message: 'Logout API success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    // Do something
    res.status(StatusCodes.OK).json({ message: ' Refresh Token API success.' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const userController = {
  login,
  logout,
  refreshToken
}
