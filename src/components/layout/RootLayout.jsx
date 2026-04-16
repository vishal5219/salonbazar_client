import { Outlet } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AuthModal from '@/components/common/AuthModal'
import Notification from '@/components/common/Notification'

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
      <Notification />
    </>
  )
}
