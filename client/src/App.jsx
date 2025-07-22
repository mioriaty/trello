import { Routes, Route, Navigate } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import NotFound from './pages/404/NotFound'
import Auth from './pages/Auth/Auth'
import AccountVerification from './pages/Auth/AccountVerification'
import { selectCurrentUser } from './redux/user/user.slice'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace />
  }
  // Sử dụng Outlet để hiển thị các route con
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={
        // Ở đây cần replace giá trị true để nó thay thế route /. Có thể hiểu là route / sẽ không còn nằm trong history của Browser.
        // Thực hành dễ hiểu hơn bằng cách nhắn Go Home từ trang 404 xong thử quay lại bằng nút back của Browser giữa 2 trường hợp có replace hoặc không có replace.
        <Navigate to="/boards/686d242617f4615325496a61" replace />
      } />

      {/* Board Details */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path="/boards/:boardId" element={<Board />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
