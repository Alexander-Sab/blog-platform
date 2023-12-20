import { Navigate } from 'react-router-dom'

export default function Auth({ children }) {
  let isLogin = false
  if (sessionStorage.getItem('userData')) {
    isLogin = true
  }
  if (!isLogin) {
    return <Navigate to="/signin" />
  }

  return children
}
