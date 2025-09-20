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
const verifyToken = async (token, secretSignature, ) => {
  try {
    // Hàm verify() của JWT
    return verify(token, secretSignature, )
  } catch (error) { throw new Error (error) }
}

export const JwtProvider = {
  genarateToken,
  verifyToken
}