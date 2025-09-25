import { StatusCodes } from 'http-status-codes'
import { ACCESS_TOKEN_SECRET_SIGNATURE, JwtProvider } from '~/providers/JwtProvider'

const isAuthorized = async (req, res, next) => {
  // Cách 1: Lấy accessToken nằm trong req cookies phía client - widthCrenditials từ FE có hợp lệ hay không
  const accessTokenFromCookie = req.cookies?.accessToken
  // console.log('🚀 ~ isAuthorized ~ accessTokenFromCookie:', accessTokenFromCookie)
  if (!accessTokenFromCookie) {
    res.status(StatusCodes.UNAUTHORIZED).json({message: 'Please login before access' })
    return
  }
  // Cách 2: Lấy accessToken trong trường hợp FE lưu localstorage và gửi lên thông qua header authorization
  const accessTokenFromHeader = req.headers.authorization
  // console.log('🚀 ~ isAuthorized ~ accessTokenFromHeader:', accessTokenFromHeader)
  // console.log('🚀 ~ isAuthorized ~ accessTokenFromHeader.subtring():', accessTokenFromHeader.substring('Bearer '.length))
  if (!accessTokenFromHeader) {
    res.status(StatusCodes.UNAUTHORIZED).json({message: 'Unauthorized! From header' })
    return
  }

  try {
    // Buoc 01: Thực hiện giải mã token xem nó có hợp lệ hay là không
    const accessTokenDecoded = await JwtProvider.verifyToken(
      accessTokenFromCookie, // Dùng token theo cách 1.
      // accessTokenFromHeader.substring('Bearer '.length), // Dùng token theo cách 2
      ACCESS_TOKEN_SECRET_SIGNATURE
    )
    // console.log('🚀 ~ isAuthorized ~ ACCESS_TOKEN_SECRET_SIGNATURE:', ACCESS_TOKEN_SECRET_SIGNATURE)
    // Bước 02: Quan trọng: Nếu như cái token hợp lệ, thì sẽ cần phải lưu thông tin giải mã được vào cái req.jwtDecoded,
    // để sử dụng cho các tầng cần xử lý ở phía sau
    req.jwtDecoded = accessTokenDecoded
    // Bước 03: Cho phép cái request đi tiêp
    next()
  } catch (error) {
    // console.log('error from middleware: ', error)
    // Trường hợp lỗi 01: Nếu cái accessToken nó bị hết hạn (expired) thì cần trả về một mã lỗi
    // GONE - 410 cho phía FE biết để gọi api refreshToken
    if (error.message?.includes('jwt expired')) {
      res.status(StatusCodes.GONE).json({ message: 'Need to refresh token' })
      return
    }

    // Trường hợp lỗi 02: Nếu như cái accessToken nó không lợp lệ do bất kỳ điều gì khác vụ hết hạn thì
    // chúng ta cứ thắng tay trả về mã 401 cho phía FE xử lý Logout / hoặc gọi API Logout tùy trường hợp
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorize! Please login' })
  }
}

export const authMiddleware = {
  isAuthorized
}