import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootLayout from '@/components/layout/RootLayout'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import { ROUTE_ROLES } from '@/utils/roleAccess'
import Home from '@/pages/Home'
import SalonList from '@/pages/SalonList/index.jsx'
import SalonDetails from '@/pages/SalonDetails/index.jsx'
import Booking from '@/pages/Booking/index.jsx'
import Dashboard from '@/pages/Dashboard/index.jsx'
import Profile from '@/pages/Profile/index.jsx'
import Admin from '@/pages/Admin/index.jsx'
import About from '@/pages/About/index.jsx'
import Offers from '@/pages/Offers/index.jsx'
import RegisterSalon from '@/pages/RegisterSalon/index.jsx'
import Unauthorized from '@/pages/Unauthorized/index.jsx'
import NotFound from '@/pages/NotFound/index.jsx'
import Bookings from '@/pages/Bookings/index.jsx'
import Wishlist from '@/pages/Wishlist/index.jsx'
import DashOverview from '@/components/dashboard/DashOverview'
import DashQueue from '@/components/dashboard/DashQueue'
import DashBookings from '@/components/dashboard/DashBookings'
import DashWalkIn from '@/components/dashboard/DashWalkIn'
import DashAnalytics from '@/components/dashboard/DashAnalytics'
import DashStaff from '@/components/dashboard/DashStaff'
import DashboardOwnerRoute from '@/components/dashboard/DashboardOwnerRoute'
import { DASHBOARD_PATHS } from '@/constants/dashboardRoutes'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'salons', element: <SalonList /> },
      { path: 'salons/:id', element: <SalonDetails /> },
      { path: 'offers', element: <Offers /> },
      { path: 'about', element: <About /> },
      { path: 'unauthorized', element: <Unauthorized /> },
      {
        path: 'booking/:salonId',
        element: <ProtectedRoute><Booking /></ProtectedRoute>,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute roles={ROUTE_ROLES.salonDashboard}>
            <Dashboard />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="overview" replace /> },
          { path: 'overview', element: <DashOverview /> },
          { path: 'queue', element: <DashQueue /> },
          { path: 'appointments', element: <DashBookings /> },
          { path: 'walk-in', element: <DashWalkIn /> },
          {
            path: 'analytics',
            element: (
              <DashboardOwnerRoute>
                <DashAnalytics />
              </DashboardOwnerRoute>
            ),
          },
          {
            path: 'team',
            element: (
              <DashboardOwnerRoute>
                <DashStaff />
              </DashboardOwnerRoute>
            ),
          },
          { path: '*', element: <Navigate to={DASHBOARD_PATHS.overview} replace /> },
        ],
      },
      {
        path: 'register-salon',
        element: (
          <ProtectedRoute roles={ROUTE_ROLES.registerSalon}>
            <RegisterSalon />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      {
        path: 'bookings',
        element: (
          <ProtectedRoute roles={ROUTE_ROLES.customerPages}>
            <Bookings />
          </ProtectedRoute>
        ),
      },
      {
        path: 'wishlist',
        element: (
          <ProtectedRoute roles={ROUTE_ROLES.customerPages}>
            <Wishlist />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute roles={ROUTE_ROLES.platformAdmin}>
            <Admin />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default router
