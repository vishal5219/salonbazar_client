import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '@/components/layout/RootLayout'
import Home from '@/pages/Home'
import SalonList from '@/pages/SalonList'
import SalonDetails from '@/pages/SalonDetails/index.jsx'
import Booking from '@/pages/Booking/index.jsx'

// Lazy imports for future pages
// import Profile from '@/pages/Profile'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'salons', element: <SalonList /> },
      { path: 'salons/:id', element: <SalonDetails /> },
      { path: 'booking/:salonId', element: <Booking /> },
      // { path: 'profile', element: <Profile /> },
    ],
  },
])

export default router
