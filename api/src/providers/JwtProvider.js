import JWT, { verify } from 'jsonwebtoken'

/**
 * Function tạo mới Token - cần 3 tham số
 * useInfo: Nhúng thông tin muốn đính kèm vào token
 * secretSignature: Chữ ký bí mật(dạng chuỗi string ngẫu nhiên) trên docs để tên là privateKey
 * tokenLife: Thời gian sống của token
 */
const genarateToken = async (useInfo, secretSignature, tokenLife) => {
  try {
    // Hàm sign() của JWT - Thuật toán mặc định là HS256
    return JWT.sign(useInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) { throw new Error (error) }
}

/**
 * Function kiểm tra Token
 * Token hợp lệ là được tạo ra đúng với secretSignature trong dự án
 */
const verifyToken = async (token, secretSignature ) => {
  try {
    // Hàm verify() của JWT
    return verify(token, secretSignature )
  } catch (error) { throw new Error (error) }
}

/**
 * 2 cái chữ ký bí mật quan trọng trong dự án. Dành cho JWT - Jsonwebtokens
 * Lưu ý phải lưu vào biến môi trường ENV trong thực tế cho bảo mật.
 * Ở đây mình làm Demo thôi nên mới đặt biến const và giá trị random ngẫu nhiên trong code nhé.
 */
export const ACCESS_TOKEN_SECRET_SIGNATURE = 'f6pl0ydSqdOw1XTnpaot2q6j99yVoS0G'
export const REFRESH_TOKEN_SECRET_SIGNATURE = 'bk7hjr9OGQeHsUlInRVgP4DB3WbfVrsB'

export const JwtProvider = {
  genarateToken,
  verifyToken
}