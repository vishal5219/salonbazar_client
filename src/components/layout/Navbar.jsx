import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { openAuthModal } from '@/store/slices/uiSlice'
import { logout } from '@/store/slices/authSlice'
import styles from './Navbar.module.css'

export default function Navbar() {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector(s => s.auth)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}><img src="/logo/salon-bazar-logo-bg.png" alt="SalonBazar" width={32} height={32} /></span>
          <span><em>Salon Bazar</em></span>
        </Link>

        {/* Desktop Links */}
        <ul className={styles.links}>
          <li><Link to="/salons" className={styles.link}>Explore</Link></li>
          <li><Link to="/offers" className={styles.link}>Offers</Link></li>
          <li><Link to="/about" className={styles.link}>About</Link></li>
          <li>
            <Link to="/register-salon" className={styles.linkPartner}>
              List Your Salon
            </Link>
          </li>
        </ul>

        {/* Auth Actions */}
        <div className={styles.actions}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button className={styles.avatarBtn}>
                <span className={styles.avatar}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </button>
              <div className={styles.dropdown}>
                <Link to="/profile" className={styles.dropItem}>My Profile</Link>
                <Link to="/bookings" className={styles.dropItem}>My Bookings</Link>
                <Link to="/wishlist" className={styles.dropItem}>Wishlist</Link>
                <div className={styles.dropDivider} />
                <button className={styles.dropItem} onClick={() => dispatch(logout())}>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                className={styles.btnLogin}
                onClick={() => dispatch(openAuthModal('login'))}
              >
                Sign In
              </button>
              <button
                className={styles.btnRegister}
                onClick={() => dispatch(openAuthModal('register'))}
              >
                Join Free
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : styles.mobileClose}`}>
        <Link to="/salons" className={styles.mobileLink}>Explore Salons</Link>
        <Link to="/offers" className={styles.mobileLink}>Offers</Link>
        <Link to="/about" className={styles.mobileLink}>About</Link>
        <Link to="/register-salon" className={styles.mobileLink}>List Your Salon</Link>
        <div className={styles.mobileDivider} />
        {isAuthenticated ? (
          <>
            <Link to="/profile" className={styles.mobileLink}>My Profile</Link>
            <Link to="/bookings" className={styles.mobileLink}>My Bookings</Link>
            <Link to="/wishlist" className={styles.mobileLink}>Wishlist</Link>
            <button className={styles.mobileLink} onClick={() => dispatch(logout())}>Sign Out</button>
          </>
        ) : (
          <div className={styles.mobileAuth}>
            <button className={styles.btnLogin} onClick={() => { dispatch(openAuthModal('login')); setMenuOpen(false) }}>
              Sign In
            </button>
            <button className={styles.btnRegister} onClick={() => { dispatch(openAuthModal('register')); setMenuOpen(false) }}>
              Join Free
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
