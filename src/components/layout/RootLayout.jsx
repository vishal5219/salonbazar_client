import { useEffect } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { openAuthModal } from '@/store/slices/uiSlice'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AuthModal from '@/components/common/AuthModal'
import Notification from '@/components/common/Notification'
import ScrollToTop from '@/components/common/ScrollToTop'

export default function RootLayout() {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useDispatch()

  useEffect(() => {
    const auth = searchParams.get('auth')
    if (auth === 'login' || auth === 'register') {
      dispatch(openAuthModal(auth))
      const next = new URLSearchParams(searchParams)
      next.delete('auth')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams, dispatch])

  return (
    <>
      <ScrollToTop />
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
