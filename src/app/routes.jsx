import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '@/components/layout/RootLayout'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import Home from '@/pages/Home'
import SalonList from '@/pages/SalonList/index.jsx'
import SalonDetails from '@/pages/SalonDetails/index.jsx'
import Booking from '@/pages/Booking/index.jsx'
import Dashboard from '@/pages/Dashboard/index.jsx'
import Profile from '@/pages/Profile/index.jsx'
import Admin from '@/pages/Admin/index.jsx'
import About from '@/pages/About/index.jsx'
import Offers from '@/pages/Offers/index.jsx'
import NotFound from '@/pages/NotFound/index.jsx'
import Bookings from '@/pages/Bookings/index.jsx'
import Wishlist from '@/pages/Wishlist/index.jsx'

const router = createBrowserRouter([
  {
    path: '/',    
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'salons', element: <SalonList /> },
      { path: 'salons/:id', element: <SalonDetails /> },
      { path: 'booking/:salonId', element: <ProtectedRoute><Booking /></ProtectedRoute> },
      { path: 'dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: 'profile',   element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: 'bookings',  element: <ProtectedRoute><Bookings /></ProtectedRoute> },
      { path: 'wishlist',  element: <ProtectedRoute><Wishlist /></ProtectedRoute> },
      { path: 'admin',     element: <ProtectedRoute><Admin /></ProtectedRoute> },
      { path: 'about',     element: <About /> },
      { path: 'offers',    element: <Offers /> },
      { path: '*',         element: <NotFound /> },
    ],
  },
])

export default router
