import authorizeAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const handleLogoutAPI = async () => {
  // Với trường hợp 1 dùng localStorage => xóa token ở localStorage
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userInfo')
  // Với trường hợp 2 dùng httpOnly cookie => gọi API xóa cookie ở server
  return await authorizeAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
}

export const refreshTokenAPI = async () => {
  return await authorizeAxiosInstance.put(`${API_ROOT}/v1/users/refresh_token`)
}