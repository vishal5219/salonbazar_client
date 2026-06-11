import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROLES } from '@/constants/roles'
import { DASHBOARD_PATHS } from '@/constants/dashboardRoutes'

export default function DashboardOwnerRoute({ children }) {
  const role = useSelector(s => s.auth.role)
  if (role !== ROLES.SHOP_OWNER) {
    return <Navigate to={DASHBOARD_PATHS.overview} replace />
  }
  return children
}
