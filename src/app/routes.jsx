import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '@/components/layout/RootLayout'
import Home from '@/pages/Home'
import SalonList from '@/pages/SalonList'
import SalonDetails from '@/pages/SalonDetails/index.jsx'
import Booking from '@/pages/Booking/index.jsx'
import Dashboard from '@/pages/Dashboard'
import Profile from '@/pages/Profile'
import Admin from '@/pages/Admin'

const router = createBrowserRouter([
  {
    path: '/',  
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'salons', element: <SalonList /> },
      { path: 'salons/:id', element: <SalonDetails /> },
      { path: 'booking/:salonId', element: <Booking /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'profile', element: <Profile /> },
      { path: 'admin', element: <Admin /> },
    ],
  },
])

export default router
