import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import { API_ROOT } from '~/utils/constants'
import authorizeAxiosInstance from '~/utils/authorizedAxios'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const res = await authorizeAxiosInstance.get(`${API_ROOT}/v1/dashboards/access`)
      setUser(res.data)
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    // Với trường hợp 1 dùng localStorage => xóa token ở localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
    // Với trường hợp 2 dùng httpOnly cookie => gọi API xóa cookie ở server
    await authorizeAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    setUser(null)
    // Điều hướng về trang login
    navigate('/login')
  }

  if (!user) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography>Loading dashboard user...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{
      maxWidth: '100%',
      marginTop: '1em',
      mx: 'auto',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '0 1em'
    }}>
      <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
        Đây là trang Dashboard sau khi user:&nbsp;
        <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{user?.email}</Typography>
        &nbsp; đăng nhập thành công thì mới cho truy cập vào.
      </Alert>

      <Button
        type='button'
        sx={{ mt: 2, alignSelf: 'flex-end', maxWidth: 'min-content' }}
        color='info'
        variant="contained"
        size='large'
        onClick={handleLogout}
      >
        logout
      </Button>

      <Divider sx={{ my: 2 }} />
    </Box>
  )
}

export default Dashboard
