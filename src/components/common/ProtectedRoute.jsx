import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute({ children, roles }) {
  const location = useLocation()
  const { isAuthenticated, role, initializing } = useSelector(s => s.auth)

  if (initializing) return null

  if (!isAuthenticated) {
    return <Navigate to="/?auth=login" state={{ from: location }} replace />
  }

  if (roles?.length && !roles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return children
}
